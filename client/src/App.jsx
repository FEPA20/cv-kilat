import { lazy, useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { loadMidtransSnap } from "./lib/midtrans";

import LandingPage from "./pages/LandingPage";
import CookieConsentBanner from "./components/CookieConsentBanner";


const TemplatesPage = lazy(() => import("./pages/TemplatesPage"));
const BuilderPage = lazy(() => import("./pages/BuilderPage"));
const TemplateEditorPage = lazy(() =>
  import("./pages/TemplateEditorPage")
);
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const CoverLetterPage = lazy(() =>
  import("./pages/CoverLetterPage")
);
const UploadDocumentPage = lazy(() =>
  import("./pages/UploadDocumentPage")
);

const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPolicyPage = lazy(() =>
  import("./pages/PrivacyPolicyPage")
);
const CookiePolicyPage = lazy(() =>
  import("./pages/CookiePolicyPage")
);
const ContactPage = lazy(() => import("./pages/ContactPage"));
const LoginModal = lazy(() =>
  import("./components/LoginModal")
);

const ResetPasswordModal = lazy(() =>
  import("./components/ResetPasswordModal")
);

const loadCvTemplateTools = () =>
  import("./data/cvTemplates");

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("landing");

  const [editData, setEditData] = useState(null);
  const [designData, setDesignData] = useState(null);
  const [designRecordId, setDesignRecordId] = useState(null);
  const [coverLetterCv, setCoverLetterCv] = useState(null);

  const [showLogin, setShowLogin] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [pendingAfterLogin, setPendingAfterLogin] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [pricingPaymentBusy, setPricingPaymentBusy] =
    useState(false);
  const [pricingPaymentMessage, setPricingPaymentMessage] =
    useState("");
  const [pricingPaymentOrderId, setPricingPaymentOrderId] =
    useState(null);
  const [pricingPaymentPlanCode, setPricingPaymentPlanCode] =
    useState(null);
  const [legalReturnPage, setLegalReturnPage] = useState("landing");

  // ======================================================
  // AUTH SESSION + OAUTH CALLBACK + PASSWORD RECOVERY
  // ======================================================
  useEffect(() => {
    let mounted = true;

    const recordPendingLegalConsent = async () => {
      const rawConsent = sessionStorage.getItem(
        "cv-kilat-legal-consent"
      );

      if (!rawConsent) return;

      try {
        const consent = JSON.parse(rawConsent);

        const { error } = await supabase.auth.updateUser({
          data: {
            terms_accepted_at: consent.acceptedAt,
            terms_version: consent.termsVersion,
            privacy_accepted_at: consent.acceptedAt,
            privacy_version: consent.privacyVersion,
          },
        });

        if (error) {
          console.error(
            "Gagal mencatat persetujuan legal:",
            error
          );
          return;
        }

        sessionStorage.removeItem(
          "cv-kilat-legal-consent"
        );
      } catch (error) {
        console.error(
          "Format persetujuan legal tidak valid:",
          error
        );
      }
    };

    const applyAuthReturn = () => {
      const destination = sessionStorage.getItem(
        "cv-kilat-auth-return"
      );

      if (!destination) return;

      sessionStorage.removeItem("cv-kilat-auth-return");
      setShowLogin(false);
      setPendingAfterLogin(null);

      if (destination === "builder") {
        try {
          const savedDraft = JSON.parse(
            localStorage.getItem("cv-kilat-builder-draft")
          );

          if (savedDraft) {
            setEditData({
              id: null,
              data: savedDraft,
              source: "oauth-return",
            });
            setPage("builder");
            return;
          }
        } catch (error) {
          console.error("Gagal memulihkan draft builder:", error);
        }
      }

      if (destination === "design") {
        try {
          const savedDesign = JSON.parse(
            localStorage.getItem("cv-kilat-design-draft")
          );

          if (savedDesign) {
            setDesignData(savedDesign);
            setPage("design");
            return;
          }
        } catch (error) {
          console.error("Gagal memulihkan draft desain:", error);
        }

        setPage("dashboard");
        return;
      }

      if (
        [
          "landing",
          "templates",
          "dashboard",
          "upload-document",
          "cover-letter",
        ].includes(destination)
      ) {
        setPage(destination);
        return;
      }

      setPage("dashboard");
    };

    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Gagal membaca session:", error);
      }

      if (!mounted) return;

      setUser(data?.session?.user?.id || null);
      setAuthLoading(false);

      if (data?.session?.user?.id) {
        recordPendingLegalConsent();
        applyAuthReturn();
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      setUser(session?.user?.id || null);
      setAuthLoading(false);

      if (event === "PASSWORD_RECOVERY") {
        setShowLogin(false);
        setShowResetPassword(true);
        return;
      }

      if (event === "SIGNED_IN") {
        recordPendingLegalConsent();
        applyAuthReturn();
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // ======================================================
  // HELPERS
  // ======================================================
  const closeLogin = () => {
    setShowLogin(false);
    setPendingAfterLogin(null);
  };

  const openLogin = (destination = null) => {
    setPendingAfterLogin(destination);
    setShowLogin(true);
  };

  const openLegal = (legalPage) => {
    const legalPages = [
      "terms",
      "privacy",
      "cookies",
      "contact",
    ];

    if (!legalPages.includes(page)) {
      setLegalReturnPage(page || "landing");
    }

    setShowLogin(false);
    setPendingAfterLogin(null);
    setPage(legalPage);
  };

  const closeLegal = () => {
    setPage(legalReturnPage || "landing");
  };

  const resetCvWorkspace = () => {
    setEditData(null);
    setDesignData(null);
    setDesignRecordId(null);
  };

  const openTemplates = () => {
    resetCvWorkspace();
    setPage("templates");
  };

  const openBlankBuilder = async () => {
    const { createBlankCvData } =
      await loadCvTemplateTools();

    const draft = createBlankCvData();

    localStorage.setItem(
      "cv-kilat-builder-draft",
      JSON.stringify(draft)
    );
    localStorage.removeItem("cv-kilat-design-draft");

    setEditData({
      id: null,
      data: draft,
      source: "blank",
    });
    setDesignData(null);
    setDesignRecordId(null);
    setPage("builder");
  };

  const openImportedCv = async (importedData) => {
    const { createBlankCvData } =
      await loadCvTemplateTools();

    const base = createBlankCvData();
    const draft = {
      ...base,
      ...importedData,
      contact: {
        ...(base.contact || {}),
        ...(importedData?.contact || {}),
      },
      experiences: importedData?.experiences?.length
        ? importedData.experiences
        : base.experiences,
      education: importedData?.education?.length
        ? importedData.education
        : base.education,
      skills: importedData?.skills || [],
      languages: importedData?.languages?.length
        ? importedData.languages
        : base.languages,
      hobbies: importedData?.hobbies || [],
      certifications: importedData?.certifications || [],
      design: {
        ...(base.design || {}),
        ...(importedData?.design || {}),
      },
    };

    localStorage.setItem(
      "cv-kilat-builder-draft",
      JSON.stringify(draft)
    );
    localStorage.removeItem("cv-kilat-design-draft");

    setEditData({
      id: null,
      data: draft,
      source: "uploaded-document",
    });
    setDesignData(null);
    setDesignRecordId(null);
    setPage("builder");
  };

  const openImportedCoverLetter = (importedLetter) => {
    localStorage.setItem(
      "cv-kilat-cover-letter-draft-v1",
      JSON.stringify({
        letter: importedLetter,
        letterId: null,
        selectedCvId: "",
      })
    );

    setCoverLetterCv(null);
    setPage("cover-letter");
  };

  const handleUseTemplate = async (
    template,
    mode = "sample"
  ) => {
    const { createTemplateDraft } =
      await loadCvTemplateTools();

    const draft = createTemplateDraft(template, mode);

    localStorage.setItem(
      "cv-kilat-builder-draft",
      JSON.stringify(draft)
    );
    localStorage.removeItem("cv-kilat-design-draft");

    setEditData({
      id: null,
      data: draft,
      templateSourceId: template.id,
      source: mode === "sample" ? "template-sample" : "template-design",
    });
    setDesignData(null);
    setDesignRecordId(null);
    setPage("builder");
  };

  // ======================================================
  // LOGIN SUCCESS
  // ======================================================
  const handleLoginSuccess = (userId) => {
    setUser(userId);
    setShowLogin(false);

    if (pendingAfterLogin === "design") {
      setPage("design");
      setPendingAfterLogin(null);
      return;
    }

    if (pendingAfterLogin === "dashboard") {
      setPage("dashboard");
      setPendingAfterLogin(null);
      return;
    }

    if (pendingAfterLogin === "templates") {
      setPage("templates");
      setPendingAfterLogin(null);
      return;
    }

    if (pendingAfterLogin === "pricing") {
  setPage("pricing");
  setPendingAfterLogin(null);
  return;
}

    setPendingAfterLogin(null);

    if (page === "landing") {
      setPage("dashboard");
    }
  };

  // ======================================================
  // BUILDER → DESIGN
  // ======================================================
  const handleContinueDesign = (builderPayload) => {
    setDesignData(builderPayload);
    setDesignRecordId(editData?.id || designRecordId || null);

    if (user) {
      setPage("design");
      return;
    }

    openLogin("design");
  };

  // ======================================================
  // LOGOUT
  // ======================================================
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Gagal logout:", error);
      alert("Logout gagal. Silakan coba kembali.");
      return;
    }

    setUser(null);
    resetCvWorkspace();
    setCoverLetterCv(null);
    setShowLogin(false);
    setShowResetPassword(false);
    setPendingAfterLogin(null);
    sessionStorage.removeItem("cv-kilat-auth-return");
    sessionStorage.removeItem("cv-kilat-legal-consent");
    setPage("landing");
  };

  const authOverlays = (
    <>
      {showLogin && (
        <LoginModal
          onClose={closeLogin}
          onLogin={handleLoginSuccess}
          onOpenLegal={openLegal}
          oauthReturnTo={pendingAfterLogin || page || "dashboard"}
        />
      )}

      {showResetPassword && (
        <ResetPasswordModal
          onClose={() => setShowResetPassword(false)}
          onSuccess={() => {
            setShowResetPassword(false);
            setShowLogin(false);
            setPage("dashboard");
          }}
        />
      )}

      <CookieConsentBanner
        onOpenPolicy={() => openLegal("cookies")}
      />
    </>
  );

  // ======================================================
  // AUTH LOADING
  // ======================================================
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-amber-400" />
          <p className="text-sm font-medium text-slate-300">
            Memuat CV Kilat...
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // LEGAL PAGES
  // ======================================================
  if (page === "terms") {
    return (
      <>
        <TermsPage
          onBack={closeLegal}
          onNavigate={openLegal}
        />
        {authOverlays}
      </>
    );
  }

  if (page === "privacy") {
    return (
      <>
        <PrivacyPolicyPage
          onBack={closeLegal}
          onNavigate={openLegal}
        />
        {authOverlays}
      </>
    );
  }

  if (page === "cookies") {
    return (
      <>
        <CookiePolicyPage
          onBack={closeLegal}
          onNavigate={openLegal}
        />
        {authOverlays}
      </>
    );
  }

  if (page === "contact") {
    return (
      <>
        <ContactPage
          user={user}
          onBack={closeLegal}
          onNavigate={openLegal}
        />
        {authOverlays}
      </>
    );
  }

  // ======================================================
  // PRICING PAYMENT
  // ======================================================
  const resolvePricingPlanCode = (plan) => {
    const id = String(plan?.id || "").toLowerCase();
    const name = String(plan?.name || "").toLowerCase();
    const price = String(plan?.price || "").replace(/\D/g, "");

    if (
      price === "19000" ||
      id.includes("single") ||
      id.includes("sekali") ||
      name.includes("sekali")
    ) {
      return "SINGLE_CV";
    }

    if (
      price === "39000" ||
      id.includes("three") ||
      id.includes("credit") ||
      id.includes("kredit") ||
      name.includes("3 kredit") ||
      name.includes("tiga")
    ) {
      return "THREE_CV";
    }

    if (
      price === "59000" ||
      id.includes("career") ||
      id.includes("karier") ||
      name.includes("career") ||
      name.includes("karier")
    ) {
      return "CAREER_ACCESS";
    }

    return null;
  };

  const getPricingFunctionError = async (error) => {
    try {
      const payload = await error?.context?.json?.();

      if (payload?.error) return payload.error;
    } catch {
      // Gunakan pesan umum di bawah.
    }

    return (
      error?.message ||
      "Terjadi kesalahan saat menghubungi server pembayaran."
    );
  };

  const waitForPricingPayment = async (
    orderId,
    { wait = true } = {},
  ) => {
    const attempts = wait ? 20 : 1;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      const { data: order, error } = await supabase
        .from("payment_orders")
        .select("status, plan_code, paid_at")
        .eq("order_id", orderId)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (order?.status === "paid") {
        return order;
      }

      if (
        ["failed", "expired", "cancelled", "refunded"].includes(
          order?.status,
        )
      ) {
        throw new Error(
          `Transaksi berstatus ${order.status}. Silakan buat transaksi baru.`,
        );
      }

      if (!wait) {
        return order || { status: "pending" };
      }

      setPricingPaymentMessage(
        `Pembayaran diterima. Menunggu verifikasi server (${attempt}/${attempts})...`,
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 1500),
      );
    }

    throw new Error(
      "Pembayaran belum terverifikasi. Tekan “Cek status” beberapa saat lagi.",
    );
  };

  const verifyPricingPayment = async (
    orderId = pricingPaymentOrderId,
    { wait = false } = {},
  ) => {
    if (!orderId) return false;

    setPricingPaymentBusy(true);

    try {
      const order = await waitForPricingPayment(orderId, {
        wait,
      });

      if (order?.status !== "paid") {
        setPricingPaymentMessage(
          "Pembayaran masih pending. Selesaikan pembayaran lalu cek kembali.",
        );
        return false;
      }

      setPricingPaymentMessage(
        "Pembayaran berhasil dan paket sudah aktif. Paket dapat digunakan saat mengunduh CV.",
      );

      setPricingPaymentOrderId(null);
      setPricingPaymentPlanCode(null);
      return true;
    } catch (error) {
      console.error(
        "Verifikasi pembayaran halaman Upgrade gagal:",
        error,
      );

      setPricingPaymentMessage(
        error?.message ||
          "Status pembayaran belum dapat diverifikasi.",
      );

      return false;
    } finally {
      setPricingPaymentBusy(false);
    }
  };

  const startPricingPayment = async (plan) => {
    if (!user) {
      openLogin("pricing");
      return;
    }

    if (pricingPaymentBusy) return;

    const planCode = resolvePricingPlanCode(plan);

    if (!planCode) {
      setPricingPaymentMessage(
        "Paket tidak dikenali. Muat ulang halaman lalu coba kembali.",
      );
      return;
    }

    setPricingPaymentBusy(true);
    setPricingPaymentPlanCode(planCode);
    setPricingPaymentMessage(
      `Menyiapkan pembayaran ${plan?.name || "CV Kilat"}...`,
    );

    try {
      const { data: transaction, error } =
        await supabase.functions.invoke("create-payment", {
          body: {
            plan_code: planCode,
            document_name:
              plan?.name || "Paket CV Kilat",
          },
        });

      if (error) {
        throw new Error(
          await getPricingFunctionError(error),
        );
      }

      if (transaction?.error) {
        throw new Error(transaction.error);
      }

      if (!transaction?.token || !transaction?.order_id) {
        throw new Error(
          "Token transaksi Midtrans tidak tersedia.",
        );
      }

      setPricingPaymentOrderId(transaction.order_id);

      const snap = await loadMidtransSnap();

      setPricingPaymentMessage(
        "Pilih metode pembayaran pada jendela Midtrans.",
      );

      snap.pay(transaction.token, {
        onSuccess: async () => {
          setPricingPaymentMessage(
            "Pembayaran berhasil. Memverifikasi aktivasi paket...",
          );

          await verifyPricingPayment(
            transaction.order_id,
            { wait: true },
          );
        },

        onPending: () => {
          setPricingPaymentBusy(false);
          setPricingPaymentMessage(
            "Pembayaran masih pending. Selesaikan pembayaran lalu tekan “Cek status”.",
          );
        },

        onError: (result) => {
          console.error(
            "Midtrans pricing payment error:",
            result,
          );

          setPricingPaymentBusy(false);
          setPricingPaymentMessage(
            "Pembayaran gagal atau layanan pembayaran sedang bermasalah. Silakan coba kembali.",
          );
        },

        onClose: () => {
          setPricingPaymentBusy(false);
          setPricingPaymentMessage(
            "Jendela pembayaran ditutup. Paket belum aktif apabila pembayaran belum selesai.",
          );
        },
      });
    } catch (error) {
      console.error(
        "Gagal memulai pembayaran halaman Upgrade:",
        error,
      );

      setPricingPaymentBusy(false);
      setPricingPaymentMessage(
        error?.message ||
          "Gagal membuka pembayaran Midtrans.",
      );
    }
  };

  // ======================================================
  // PRICING PAGE
  // ======================================================
  if (page === "pricing") {
    return (
      <>
        <PricingPage
          user={user}
          onBack={() => setPage("landing")}
          onChoosePlan={startPricingPayment}
        />

        {pricingPaymentBusy ? (
          <div className="fixed inset-0 z-[139] bg-slate-950/35 backdrop-blur-[1px]" />
        ) : null}

        {pricingPaymentMessage ? (
          <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[140] px-4">
            <div className="pointer-events-auto mx-auto flex w-full max-w-xl items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-lg">
                {pricingPaymentBusy ? "…" : "✓"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-slate-900">
                  {pricingPaymentBusy
                    ? "Memproses pembayaran"
                    : "Status pembayaran"}
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {pricingPaymentMessage}
                </p>

                {!pricingPaymentBusy &&
                pricingPaymentOrderId ? (
                  <button
                    type="button"
                    onClick={() =>
                      verifyPricingPayment(
                        pricingPaymentOrderId,
                      )
                    }
                    className="mt-3 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-sky-600"
                  >
                    Cek status
                  </button>
                ) : null}
              </div>

              {!pricingPaymentBusy ? (
                <button
                  type="button"
                  onClick={() =>
                    setPricingPaymentMessage("")
                  }
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500 hover:bg-slate-200"
                  aria-label="Tutup status pembayaran"
                >
                  ×
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {authOverlays}
      </>
    );
  }


  // ======================================================
  // TEMPLATE GALLERY
  // ======================================================
  if (page === "templates") {
    return (
      <>
        <TemplatesPage
          user={user}
          onBack={() => {
            if (user) {
              setPage("dashboard");
            } else {
              setPage("landing");
            }
          }}
          onUseTemplate={handleUseTemplate}
          onStartBlank={openBlankBuilder}
          onLogin={() => openLogin("templates")}
          onDashboard={() => {
            if (user) {
              setPage("dashboard");
            } else {
              openLogin("dashboard");
            }
          }}
          onLogout={handleLogout}
        />

        {authOverlays}
      </>
    );
  }

  // ======================================================
  // BUILDER PAGE
  // ======================================================
  if (page === "builder") {
    return (
      <>
        <BuilderPage
          key={`${editData?.id || "new-cv"}-${
            editData?.templateSourceId || editData?.source || "manual"
          }`}
          user={user}
          editData={editData}
          onBack={() => {
            setEditData(null);

            if (user) {
              setPage("dashboard");
            } else {
              setPage("templates");
            }
          }}
          onRequireAuth={() => openLogin()}
          onContinueDesign={handleContinueDesign}
        />

        {authOverlays}
      </>
    );
  }

  // ======================================================
  // TEMPLATE EDITOR PAGE
  // ======================================================
  if (page === "design") {
    return (
      <>
        <TemplateEditorPage
          user={user}
          initialData={designData || editData?.data || null}
          cvId={designRecordId || editData?.id || null}
          onBack={(updatedData) => {
            setDesignData(updatedData);
            setEditData((current) => ({
              id: designRecordId || current?.id || null,
              data: updatedData,
              templateSourceId: current?.templateSourceId,
              source: current?.source,
            }));
            setPage("builder");
          }}
          onSaved={(savedId, savedData) => {
            setDesignRecordId(savedId);
            setDesignData(savedData);
            setEditData({
              id: savedId,
              data: savedData,
            });
          }}
          onRequireAuth={() => openLogin("design")}
        />

        {authOverlays}
      </>
    );
  }

  // ======================================================
  // UPLOAD DOCUMENT PAGE
  // ======================================================
  if (page === "upload-document") {
    if (!user) {
      return (
        <>
          <LandingPage
            user={null}
            onStart={openTemplates}
            onLogin={() => openLogin("dashboard")}
            onLogout={handleLogout}
            onOpenLegal={openLegal}
            onPricing={() => setPage("pricing")}
          />

          {authOverlays}
        </>
      );
    }

    return (
      <>
        <UploadDocumentPage
          user={user}
          onBack={() => setPage("dashboard")}
          onImportCv={openImportedCv}
          onImportCoverLetter={openImportedCoverLetter}
        />
        {authOverlays}
      </>
    );
  }

  // ======================================================
  // COVER LETTER PAGE
  // ======================================================
  if (page === "cover-letter") {
    if (!user) {
      return (
        <>
          <LandingPage
            user={null}
            onStart={openTemplates}
            onLogin={() => openLogin("dashboard")}
            onLogout={handleLogout}
            onOpenLegal={openLegal}
            onPricing={() => setPage("pricing")}
          />

          {authOverlays}
        </>
      );
    }

    return (
      <CoverLetterPage
        user={user}
        initialCv={coverLetterCv}
        onBack={() => {
          setCoverLetterCv(null);
          setPage("dashboard");
        }}
        onSaved={() => {
          // Tetap berada di editor agar user dapat meninjau dan mengunduh.
        }}
      />
    );
  }

  // ======================================================
  // DASHBOARD PAGE
  // ======================================================
  if (page === "dashboard") {
    if (!user) {
      return (
        <>
          <LandingPage
            user={null}
            onStart={openTemplates}
            onLogin={() => openLogin("dashboard")}
            onLogout={handleLogout}
            onOpenLegal={openLegal}
            onPricing={() => setPage("pricing")}
          />

          {authOverlays}
        </>
      );
    }

    return (
      <DashboardPage
        user={user}
        onCreate={openTemplates}
        onUploadDocument={() => setPage("upload-document")}
        onEdit={(cvData) => {
          setEditData(cvData);
          setDesignData(cvData?.data || null);
          setDesignRecordId(cvData?.id || null);
          setPage("builder");
        }}
        onCreateCoverLetter={(cvData) => {
          setCoverLetterCv(cvData || null);
          setPage("cover-letter");
        }}
        onBack={() => setPage("landing")}
        onLogout={handleLogout}
        onOpenLegal={openLegal}
        onAccountDeleted={() => {
          setUser(null);
          resetCvWorkspace();
          setCoverLetterCv(null);
          setPage("landing");
        }}
      />
    );
  }

  // ======================================================
  // LANDING PAGE
  // ======================================================
  return (
    <>
      <LandingPage
        user={user}
        onStart={openTemplates}
        onLogin={() => {
          if (user) {
            setPage("dashboard");
          } else {
            openLogin("dashboard");
          }
        }}
        onLogout={handleLogout}
        onOpenLegal={openLegal}
        onPricing={() => setPage("pricing")}
      />

      {authOverlays}
    </>
  );
}