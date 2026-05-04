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

export type SuapUserData = SuapBaseUserData &
	(SuapStudentBond | SuapServantBond);
