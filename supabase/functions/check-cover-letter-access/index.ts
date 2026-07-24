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
    const letterId = String(body?.letter_id || "").trim();

    if (!letterId) {
      return jsonResponse(
        { error: "letter_id wajib tersedia." },
        400,
      );
    }

    const admin = createAdminClient();
    const { data, error } = await admin.rpc(
      "check_cover_letter_download_access",
      {
        p_user_id: user.id,
        p_cover_letter_id: letterId,
      },
    );

    if (error) throw new Error(error.message);

    return jsonResponse({
      ok: true,
      ...(data || { can_download: false }),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan.";

    if (message === "UNAUTHORIZED") {
      return jsonResponse(
        {
          error:
            "Silakan login untuk memeriksa akses surat lamaran.",
        },
        401,
      );
    }

    console.error(
      "check-cover-letter-access:",
      error,
    );

    return jsonResponse({ error: message }, 500);
  }
});
