import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import {
  createAdminClient,
  requireUser,
} from "../_shared/supabase.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method tidak didukung." }, 405);
  }

  try {
    const user = await requireUser(req);
    const body = await req.json().catch(() => ({}));
    const cvId = String(body?.cv_id || "").trim();

    if (!cvId) {
      return jsonResponse({ error: "cv_id wajib tersedia." }, 400);
    }

    const admin = createAdminClient();
    const { data, error } = await admin.rpc(
      "check_cv_download_access",
      {
        p_user_id: user.id,
        p_cv_id: cvId,
      },
    );

    if (error) throw new Error(error.message);

    return jsonResponse({
      ok: true,
      ...(data || { can_download: false }),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan.";

    if (message === "UNAUTHORIZED") {
      return jsonResponse(
        { error: "Silakan login untuk memeriksa akses." },
        401,
      );
    }

    console.error("check-download-access:", error);
    return jsonResponse({ error: message }, 500);
  }
});
