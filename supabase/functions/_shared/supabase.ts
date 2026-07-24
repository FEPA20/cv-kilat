import {
  createClient,
  type SupabaseClient,
  type User,
} from "npm:@supabase/supabase-js@2";

function requireEnv(name: string): string {
  const value = Deno.env.get(name);

  if (!value) {
    throw new Error("Environment variable belum tersedia: " + name);
  }

  return value;
}

function readDefaultKey(
  modernName: string,
  legacyName: string,
): string {
  const modernValue = Deno.env.get(modernName);

  if (modernValue) {
    try {
      const parsed = JSON.parse(modernValue);
      const key = parsed?.default;

      if (typeof key === "string" && key) return key;
    } catch {
      // Lanjutkan ke legacy key.
    }
  }

  return requireEnv(legacyName);
}

export function createAdminClient(): SupabaseClient {
  const url = requireEnv("SUPABASE_URL");
  const key = readDefaultKey(
    "SUPABASE_SECRET_KEYS",
    "SUPABASE_SERVICE_ROLE_KEY",
  );

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function createPublicClient(): SupabaseClient {
  const url = requireEnv("SUPABASE_URL");
  const key = readDefaultKey(
    "SUPABASE_PUBLISHABLE_KEYS",
    "SUPABASE_ANON_KEY",
  );

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function requireUser(req: Request): Promise<User> {
  const authorization = req.headers.get("Authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!match?.[1]) {
    throw new Error("UNAUTHORIZED");
  }

  const client = createPublicClient();
  const { data, error } = await client.auth.getUser(match[1]);

  if (error || !data.user) {
    throw new Error("UNAUTHORIZED");
  }

  return data.user;
}
