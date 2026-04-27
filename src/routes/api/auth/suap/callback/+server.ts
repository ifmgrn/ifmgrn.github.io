import { createClient } from "@supabase/supabase-js";
import { error, redirect } from "@sveltejs/kit";
import { SUAP_CLIENT_SECRET, SUPABASE_SECRET_KEY } from "$env/static/private";
import {
	PUBLIC_SUAP_CLIENT_ID,
	PUBLIC_SUAP_REDIRECT_URI,
	PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import { STATUS_CODE } from "$lib/consts.js";

interface SuapBaseUserData {
	// e.g.: 00000
	id: number;
	// e.g.: 0000000
	matricula: string;
	// First name + Last name
	nome_usual: string;
	// e.g.: 000.000.000-00
	cpf: string;
	// e.g. "MGXXXXXXXX - XX/MG - DD/MM/YYYY"
	rg: "None - / - " | (string & {});
	// Mother and father (?)
	filiacao: [null | string, null | string];
	// e.g.: 2000-00-00 (YYYY-MM-DD)
	data_nascimento: string;
	// e.g.: BELO HORIZONTE/MG
	naturalidade: string;
	tipo_sanguineo:
		| "NoneNone"
		| "AB+"
		| "AB-"
		| "A+"
		| "A-"
		| "B+"
		| "B-"
		| "O+"
		| "O-";
	// If student, email registered by the user. Otherwise, academic email (x@ifmg.edu.br)
	email: string;
	// Relpath to photo (relative to suap base domain, starting with /); e.g.: /media/alunos/75x100/00000.xxxXxxXXxXxX.jpg, /media/fotos/...
	url_foto_75x100: string;
	// Relpath to photo (relative to suap base domain, starting with /); e.g.: /media/alunos/150x200/00000.xxxXxxXXxXxX.jpg, /media/fotos/...
	url_foto_150x200: string;
	vinculo: {
		// e.g.: "0000000"
		matricula: string;
		// Full name
		nome: string;
		// e.g.: RIBEIRAO DAS NEVES (does not contain accents)
		campus: string;
		// Can be empty (for both student and servant)
		curriculo_lattes: string;
	};
}

interface SuapStudentBond {
	tipo_vinculo: "Aluno";
	vinculo: {
		// e.g.: Técnico em Informática Integrado ao Ensino Médio
		curso: string;
		situacao: "Matriculado" | (string & {});
		// Can be null
		cota_sistec: unknown;
		// Can be null
		cota_mec: unknown;
		situacao_sistemica: "Matriculado no SUAP" | (string & {});
		// Can be false even for regular students (?)
		matricula_regular: boolean;
		// Can be null
		linha_pesquisa: unknown;
	};
}

interface SuapServantBond {
	tipo_vinculo: "Servidor";
	vinculo: {
		cargo: "PROFESSOR ENS BASICO TECN TECNOLOGICO" | (string & {});
		// XXX-XX (e.g. "CRN-DE", which may mean "Campus Ribeirão das Neves - Diretoria de Ensino"?)
		setor_suap: string;
		// XXX-XX (same as setor_suap?)
		setor_siape: string;
		jornada_trabalho: "DEDICACAO EXCLUSIVA" | (string & {});
		// e.g. ["FUC0001 - XXX-XX"]
		funcao: string[];
		// Can be [""]
		telefones_institucionais: string[];
		categoria: "docente" | (string & {});
		disciplina_ingresso: "None" | (string & {});
		// e.g. "/media/fotos/75x100/X.X.jpg"
		url_foto_75x100: string;
	};
}

type SuapUserData = SuapBaseUserData & (SuapStudentBond | SuapServantBond);

export async function GET({ url, cookies, locals: { supabase, isLoggedIn } }) {
	const code = url.searchParams.get("code");
	if (!code) error(STATUS_CODE.BAD_REQUEST, "No code was specified in the URL");

	const returnedState = url.searchParams.get("state");
	const originalState = cookies.get("oauth_state");
	if (!returnedState || returnedState !== originalState) {
		error(STATUS_CODE.BAD_REQUEST, "Invalid OAuth state");
	}

	cookies.delete("oauth_state", { path: "/" });

	if (await isLoggedIn())
		error(STATUS_CODE.FORBIDDEN, "A user is already logged in.");

	const tokenRes = await fetch("https://suap.ifmg.edu.br/o/token/", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: PUBLIC_SUAP_REDIRECT_URI,
			client_id: PUBLIC_SUAP_CLIENT_ID,
			client_secret: SUAP_CLIENT_SECRET,
		}),
	});

	const tokenData = await tokenRes.json();

	const userRes = await fetch(
		"https://suap.ifmg.edu.br/api/v2/minhas-informacoes/meus-dados/",
		{
			headers: {
				Authorization: `Bearer ${tokenData.access_token}`,
			},
		},
	);
	if (!userRes.ok) error(STATUS_CODE.BAD_REQUEST, "Code is invalid for SUAP.");

	const suapUser: SuapUserData = await userRes.json();

	if (suapUser.vinculo.campus.toLowerCase() !== "ribeirao das neves") {
		error(
			STATUS_CODE.FORBIDDEN,
			"Não estamos aceitando usuários de outros campi.",
		);
	}

	const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});

	const { data: user } = await supabaseAdmin
		.from("suap_users")
		.select("suap_id, auth_id")
		.eq("suap_id", suapUser.id)
		.single();

	let authId: string | undefined;
	if (user) {
		authId = (
			await supabaseAdmin.auth.admin.updateUserById(user.auth_id, {
				email: suapUser.email,
				email_confirm: true,
			})
		).data.user?.id;
	} else {
		authId = (
			await supabaseAdmin.auth.admin.createUser({
				email: suapUser.email,
				email_confirm: true,
			})
		).data.user?.id;
	}

	if (!authId) throw new Error("The server could not create/update the user.");

	const { data: magicLink } = await supabaseAdmin.auth.admin.generateLink({
		type: "magiclink",
		email: suapUser.email,
	});

	if (!magicLink.properties?.hashed_token) {
		throw new Error("Failed to generate auth token.");
	}

	// Verify OTP to create session
	await supabase.auth.verifyOtp({
		token_hash: magicLink.properties.hashed_token,
		type: "email",
	});

	const userData: SuapUser = {
		auth_id: authId,
		suap_id: suapUser.id,
		ra: suapUser.matricula,
		name: suapUser.vinculo.nome,
		role: ("categoria" in suapUser.vinculo
			? suapUser.vinculo.categoria
			: suapUser.tipo_vinculo
		).toLowerCase(),
		photo_relurl: suapUser.url_foto_150x200,
	};

	await supabase.from("suap_users").upsert(userData);

	cookies.set("user_data", JSON.stringify(userData), {
		path: "/",
		httpOnly: false,
	});

	return redirect(STATUS_CODE.FOUND, "/");
}
