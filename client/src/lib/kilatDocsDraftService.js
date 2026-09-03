// CK-DOC-04B-SAFE
// CK-DOC-04C-SAFE
import { supabase } from "./supabase";

function normalizeErrorMessage(error, fallback) {
  return error?.message || fallback || "Terjadi kendala saat memproses draft.";
}

function createDraftTitle(document) {
  const title = String(document?.title || "Dokumen").trim();

  if (!title) {
    return "Draft Dokumen";
  }

  return `Draft ${title}`;
}

export async function getCurrentDraftUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return {
      user: null,
      error,
    };
  }

  return {
    user: data?.user || null,
    error: null,
  };
}

export async function saveKilatDocsDraft({
  document,
  formData,
  draftContent,
  draftId,
}) {
  try {
    const { user, error: userError } = await getCurrentDraftUser();

    if (userError) {
      return {
        ok: false,
        code: "AUTH_ERROR",
        message: normalizeErrorMessage(userError, "Gagal membaca sesi login."),
      };
    }

    if (!user) {
      return {
        ok: false,
        code: "AUTH_REQUIRED",
        message: "Silakan login terlebih dahulu untuk menyimpan draft.",
      };
    }

    if (!document?.id) {
      return {
        ok: false,
        code: "DOCUMENT_REQUIRED",
        message: "Dokumen tidak valid. Tutup lalu buka ulang builder.",
      };
    }

    const payload = {
      user_id: user.id,
      document_id: document.id,
      title: createDraftTitle(document),
      form_data: formData || {},
      draft_content: draftContent || "",
      status: "DRAFT",
      last_opened_at: new Date().toISOString(),
    };

    const selectColumns = "id, title, document_id, status, updated_at, created_at";

    if (draftId) {
      const { data, error } = await supabase
        .from("document_drafts")
        .update({
          document_id: payload.document_id,
          title: payload.title,
          form_data: payload.form_data,
          draft_content: payload.draft_content,
          status: payload.status,
          last_opened_at: payload.last_opened_at,
        })
        .eq("id", draftId)
        .eq("user_id", user.id)
        .select(selectColumns)
        .single();

      if (error) {
        return {
          ok: false,
          code: "UPDATE_FAILED",
          message: normalizeErrorMessage(error, "Draft gagal diperbarui."),
        };
      }

      return {
        ok: true,
        draft: data,
        action: "updated",
        message: "Draft berhasil diperbarui.",
      };
    }

    const { data, error } = await supabase
      .from("document_drafts")
      .insert(payload)
      .select(selectColumns)
      .single();

    if (error) {
      return {
        ok: false,
        code: "SAVE_FAILED",
        message: normalizeErrorMessage(error, "Draft gagal disimpan."),
      };
    }

    return {
      ok: true,
      draft: data,
      action: "created",
      message: "Draft berhasil disimpan.",
    };
  } catch (error) {
    return {
      ok: false,
      code: "UNKNOWN_ERROR",
      message: normalizeErrorMessage(error, "Draft gagal disimpan."),
    };
  }
}
