// CK-DOC-04B-SAFE
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

    const { data, error } = await supabase
      .from("document_drafts")
      .insert(payload)
      .select("id, title, document_id, status, updated_at, created_at")
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
