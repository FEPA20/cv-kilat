import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import LandingPage from "./pages/LandingPage";
import TemplatesPage from "./pages/TemplatesPage";
import BuilderPage from "./pages/BuilderPage";
import TemplateEditorPage from "./pages/TemplateEditorPage";
import DashboardPage from "./pages/DashboardPage";
import CoverLetterPage from "./pages/CoverLetterPage";
import UploadDocumentPage from "./pages/UploadDocumentPage";
import LoginModal from "./components/LoginModal";
import ResetPasswordModal from "./components/ResetPasswordModal";
import CookieConsentBanner from "./components/CookieConsentBanner";

import TermsPage from "./pages/TermsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import ContactPage from "./pages/ContactPage";

import {
  createBlankCvData,
  createTemplateDraft,
} from "./data/cvTemplates";

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

  const openBlankBuilder = () => {
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


const openImportedCv = (importedData) => {
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

  const handleUseTemplate = (template, mode = "sample") => {
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
      />

      {authOverlays}
    </>
  );
}
