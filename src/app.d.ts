import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "./database.types.ts"; // import generated types

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession: () => Promise<{
				session: Session | null;
				user: User | null;
			}>;
			session: Session | null;
			user: User | null;
		}
		interface PageData {
			supabase: SupabaseClient<Database>;
			session: Session | null;
			userMetadata: UserMetadata | null;
		}
		// interface PageState {}
		// interface Platform {}
	}

	type Phase = "Gás" | "Líquido" | "Sólido" | "Aquoso" | null;

	interface UserMetadata {
		suap_id: number;
		name: string;
		ra: string;
		role: string;
		photo_relurl: string;
	}

	interface Reaction {
		id: number;
		name: string;
		classifications: string[];
		equation: string;
		youtube_video_id: string;
		description: string;
		products: string[];
		reactants: string[];
	}

	interface Atom {
		atomic_number: number;
		symbol: string;
		period: number;
		group: number;
		chemical_serie: string;
		name: string;
		atomic_weight: number;
		state: Phase;
		short_lived: boolean;
	}
}
