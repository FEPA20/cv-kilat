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
    const documentName = String(
      body?.document_name || "CV_Kilat",
    ).slice(0, 120);

    if (!cvId) {
      return jsonResponse({ error: "cv_id wajib tersedia." }, 400);
    }

    const admin = createAdminClient();
    const { data, error } = await admin.rpc(
      "consume_cv_download_access",
      {
        p_user_id: user.id,
        p_cv_id: cvId,
        p_document_name: documentName,
        p_user_agent: req.headers.get("user-agent"),
      },
    );

    if (error) throw new Error(error.message);

    const allowed = Boolean(data?.can_download);

    return jsonResponse(
      {
        ok: allowed,
        ...(data || { can_download: false }),
      },
      allowed ? 200 : 402,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan.";

    if (message === "UNAUTHORIZED") {
      return jsonResponse(
        { error: "Silakan login sebelum mengunduh CV." },
        401,
      );
    }

    console.error("consume-download-access:", error);
    return jsonResponse({ error: message }, 500);
  }
});
