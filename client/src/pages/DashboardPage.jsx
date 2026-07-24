import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import LogoCVKilat from "../components/LogoCVKilat";
import DeleteAccountPanel from "../components/DeleteAccountPanel";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dasbor", icon: HomeIcon },
  { id: "documents", label: "Dokumen", icon: DocumentIcon },
  { id: "cover-letter", label: "Surat Lamaran", icon: LetterIcon },
  { id: "ats", label: "Pemeriksa ATS", icon: ShieldIcon },
  { id: "account", label: "Akun Saya", icon: UserIcon },
];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  name: "",
  jobTitle: "",
  email: "",
  phone: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
};

function getFormData(cv) {
  const raw =
    cv?.data && typeof cv.data === "object"
      ? cv.data
      : {};

  const contact =
    raw.contact && typeof raw.contact === "object"
      ? raw.contact
      : {};

  const experiences = Array.isArray(raw.experiences)
    ? raw.experiences
    : Array.isArray(raw.experience)
      ? raw.experience
      : [];

  return {
    ...EMPTY_FORM,
    ...raw,

    firstName:
      contact.firstName ||
      raw.firstName ||
      "",

    lastName:
      contact.lastName ||
      raw.lastName ||
      "",

    name:
      contact.fullName ||
      raw.name ||
      "",

    jobTitle:
      contact.desiredJob ||
      raw.jobTitle ||
      raw.desiredJob ||
      "",

    email:
      contact.email ||
      raw.email ||
      "",

    phone:
      contact.phone ||
      raw.phone ||
      "",

    experience: experiences,
    experiences,

    education: Array.isArray(raw.education)
      ? raw.education
      : [],

    skills: Array.isArray(raw.skills)
      ? raw.skills
      : [],
  };
}

function getFullName(data) {
  const fullName = `${data?.firstName || ""} ${data?.lastName || ""}`.trim();
  return fullName || data?.name || "CV Tanpa Nama";
}

function getDocumentTitle(cv, index = 0) {
  const data = getFormData(cv);
  const fullName = getFullName(data);

  if (fullName === "CV Tanpa Nama") {
    return `CV ${index + 1}`;
  }

  if (data.jobTitle) {
    return `${fullName} — ${data.jobTitle}`;
  }

  return `${fullName} — CV`;
}

function textHasContent(value) {
  if (typeof value !== "string") return false;
  return value.replace(/[*_~•\-\d.\s]/g, "").trim().length > 0;
}

function calculateCvScore(cv) {
  const data = getFormData(cv);
  let score = 0;

  if (getFullName(data) !== "CV Tanpa Nama") score += 15;
  if (data.email) score += 10;
  if (data.phone) score += 10;
  if (data.jobTitle) score += 10;
  if (textHasContent(data.summary)) score += 15;

  const experiences = Array.isArray(data.experience) ? data.experience : [];
  if (
    experiences.some(
      (item) =>
        item?.role ||
        item?.job ||
        item?.company ||
        textHasContent(item?.description || item?.desc)
    )
  ) {
    score += 20;
  }

  const education = Array.isArray(data.education) ? data.education : [];
  if (education.some((item) => item?.school || item?.degree)) score += 10;

  const skills = Array.isArray(data.skills) ? data.skills : [];
  if (skills.some((item) => (typeof item === "string" ? item : item?.name))) {
    score += 10;
  }

  return Math.min(score, 100);
}

function getDocumentDate(cv) {
  return (
    cv?.updated_at ||
    cv?.created_at ||
    cv?.data?.updatedAt ||
    cv?.data?.createdAt ||
    ""
  );
}

function getDocumentTimestamp(cv) {
  const value = getDocumentDate(cv);
  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function formatDate(value) {
  if (!value) return "Tanggal belum tersedia";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Tanggal belum tersedia";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getScoreTone(score) {
  if (score >= 80) {
    return {
      label: "Sangat Baik",
      badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      bar: "bg-emerald-500",
    };
  }

  if (score >= 60) {
    return {
      label: "Baik",
      badge: "bg-blue-50 text-blue-700 ring-blue-200",
      bar: "bg-blue-500",
    };
  }

  if (score >= 40) {
    return {
      label: "Perlu Ditingkatkan",
      badge: "bg-amber-50 text-amber-700 ring-amber-200",
      bar: "bg-amber-500",
    };
  }

  return {
    label: "Belum Lengkap",
    badge: "bg-rose-50 text-rose-700 ring-rose-200",
    bar: "bg-rose-500",
  };
}

export default function DashboardPage({
  user,
  onCreate,
  onEdit,
  onUploadDocument,
  onCreateCoverLetter,
  onLogout,
  onBack,
  onOpenLegal = () => {},
  onAccountDeleted = () => {},
}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [cvList, setCvList] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [notice, setNotice] = useState("");

  const selectedCv = useMemo(() => {
    if (!cvList.length) return null;
    return cvList.find((cv) => cv.id === selectedId) || cvList[0];
  }, [cvList, selectedId]);

  const selectedData = useMemo(() => getFormData(selectedCv), [selectedCv]);
  const selectedScore = useMemo(
    () => (selectedCv ? calculateCvScore(selectedCv) : 0),
    [selectedCv]
  );
  const selectedTone = useMemo(
    () => getScoreTone(selectedScore),
    [selectedScore]
  );

  const totalCompleted = useMemo(
    () => cvList.filter((cv) => calculateCvScore(cv) >= 80).length,
    [cvList]
  );

  const averageScore = useMemo(() => {
    if (!cvList.length) return 0;
    const total = cvList.reduce((sum, cv) => sum + calculateCvScore(cv), 0);
    return Math.round(total / cvList.length);
  }, [cvList]);

  const loadData = async () => {
    if (!user) {
      setCvList([]);
      setSelectedId("");
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("cv_data")
      .select("*")
      .eq("user_id", user)
      .order("id", { ascending: false });

    if (error) {
      console.error("Gagal mengambil CV:", error);
      setNotice("Data CV belum dapat dimuat. Silakan coba lagi.");
      setLoading(false);
      return;
    }

    const rows = [...(data || [])].sort(
  (a, b) =>
    getDocumentTimestamp(b) -
    getDocumentTimestamp(a)
);
    setCvList(rows);
    setSelectedId((currentId) => {
      if (rows.some((item) => item.id === currentId)) return currentId;
      return rows[0]?.id || "";
    });
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Hapus CV ini? Data yang sudah dihapus tidak dapat dikembalikan."
    );

    if (!confirmed) return;

    setDeletingId(id);

    const { error } = await supabase
      .from("cv_data")
      .delete()
      .eq("id", id)
      .eq("user_id", user);

    if (error) {
      console.error("Gagal menghapus CV:", error);
      setNotice("CV gagal dihapus. Silakan coba kembali.");
      setDeletingId("");
      return;
    }

    setCvList((current) => current.filter((item) => item.id !== id));
    setNotice("CV berhasil dihapus.");
    setDeletingId("");
  };

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) console.error("Gagal logout:", error);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#eef7ff] text-slate-900">
      <DashboardHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCreate={onCreate}
        onLogout={handleLogout}
        onBack={onBack}
      />

      <main className="mx-auto w-full min-w-0 max-w-[1480px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {notice && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-blue-100 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              className="rounded-lg px-2 py-1 font-semibold text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              ×
            </button>
          </div>
        )}

        {activeTab === "dashboard" && (
          <DashboardOverview
            user={user}
            cvList={cvList}
            loading={loading}
            selectedCv={selectedCv}
            selectedData={selectedData}
            selectedScore={selectedScore}
            selectedTone={selectedTone}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            totalCompleted={totalCompleted}
            averageScore={averageScore}
            onCreate={onCreate}
            onEdit={onEdit}
            onUploadDocument={onUploadDocument}
            onDelete={handleDelete}
            deletingId={deletingId}
            onCreateCoverLetter={onCreateCoverLetter}
          />
        )}

        {activeTab === "documents" && (
          <DocumentsView
            cvList={cvList}
            loading={loading}
            onCreate={onCreate}
            onEdit={onEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        )}

        {activeTab === "cover-letter" && (
          <CoverLetterDashboardView
            cvList={cvList}
            selectedCv={selectedCv}
            selectedData={selectedData}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            onCreateCoverLetter={onCreateCoverLetter}
          />
        )}

        {activeTab === "ats" && (
          <AtsView
            cvList={cvList}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            selectedCv={selectedCv}
            selectedData={selectedData}
            selectedScore={selectedScore}
            selectedTone={selectedTone}
            onEdit={onEdit}
          />
        )}

        {activeTab === "account" && (
          <AccountView
            user={user}
            onLogout={handleLogout}
            onOpenLegal={onOpenLegal}
            onAccountDeleted={onAccountDeleted}
          />
        )}
      </main>
    </div>
  );
}

function DashboardHeader({
  activeTab,
  setActiveTab,
  onCreate,
  onLogout,
  onBack,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] w-full min-w-0 max-w-[1480px] items-center justify-between gap-2 px-4 sm:gap-5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-7">
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Kembali ke halaman utama"
          >
            <LogoCVKilat variant="dark" compact />
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-sky-100 text-sky-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onCreate}
            className="hidden items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-600 sm:flex"
          >
            <PlusIcon className="h-4 w-4" />
            Buat CV Baru
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("account")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
            aria-label="Akun Saya"
          >
            <UserIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 sm:px-4"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 py-2 lg:hidden">
        <div className="mx-auto flex w-full min-w-0 max-w-[1480px] gap-2 overflow-x-auto overscroll-x-contain pb-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                  active
                    ? "bg-sky-100 text-sky-700"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

function DashboardOverview({
  user,
  cvList,
  loading,
  selectedCv,
  selectedData,
  selectedScore,
  selectedTone,
  selectedId,
  setSelectedId,
  totalCompleted,
  averageScore,
  onCreate,
  onEdit,
  onUploadDocument,
  onDelete,
  deletingId,
  onCreateCoverLetter,
}) {
  const displayName = selectedCv
    ? getFullName(selectedData).split(" ")[0]
    : "Kembali";

  return (
    <>
      <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#0b1730] via-[#102448] to-[#153a68] px-6 py-7 text-white shadow-[0_24px_70px_rgba(15,55,95,0.18)] sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-8 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="relative">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-300">
            <SparkIcon className="h-4 w-4" />
            Ruang Kerja CV Kilat
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Selamat datang, {displayName}.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            Mulai dokumen baru, impor dokumen lama, atau susun surat lamaran
            dari satu ruang kerja yang terorganisasi.
          </p>
        </div>
      </section>

      <QuickActionCards
        selectedCv={selectedCv}
        onCreate={onCreate}
        onUploadDocument={onUploadDocument}
        onCreateCoverLetter={onCreateCoverLetter}
      />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total CV"
          value={cvList.length}
          helper="Dokumen tersimpan"
          icon={DocumentIcon}
          tone="sky"
        />
        <MetricCard
          label="CV Siap Kirim"
          value={totalCompleted}
          helper="Skor minimal 80%"
          icon={CheckIcon}
          tone="emerald"
        />
        <MetricCard
          label="Rata-rata ATS"
          value={`${averageScore}%`}
          helper="Berdasarkan kelengkapan"
          icon={ShieldIcon}
          tone="amber"
        />
        <MetricCard
          label="Akun Aktif"
          value={user ? "Aktif" : "-"}
          helper="Data tersinkron cloud"
          icon={CloudIcon}
          tone="violet"
        />
      </section>

      {loading ? (
        <DashboardSkeleton />
      ) : cvList.length === 0 ? (
        <EmptyDashboard onCreate={onCreate} />
      ) : (
        <section className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="min-w-0 space-y-6">
            <ChecklistPanel
              selectedCv={selectedCv}
              selectedScore={selectedScore}
              onEdit={onEdit}
              onCreateCoverLetter={onCreateCoverLetter}
            />

            <RecentDocuments
              cvList={cvList}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              onEdit={onEdit}
              onDelete={onDelete}
              deletingId={deletingId}
            />
          </div>

          <SelectedCvPanel
            cvList={cvList}
            selectedCv={selectedCv}
            selectedData={selectedData}
            selectedScore={selectedScore}
            selectedTone={selectedTone}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            onEdit={onEdit}
            onDelete={onDelete}
            deletingId={deletingId}
            onCreate={onCreate}
            onCreateCoverLetter={onCreateCoverLetter}
          />
        </section>
      )}
    </>
  );
}


function QuickActionCards({
  selectedCv,
  onCreate,
  onUploadDocument,
  onCreateCoverLetter,
}) {
  const actions = [
    {
      id: "create-cv",
      eyebrow: "Mulai dari template",
      title: "Buat CV Baru",
      description:
        "Pilih template profesional lalu isi atau sesuaikan data Anda.",
      helper: "20+ template siap diedit",
      icon: PlusIcon,
      iconClass: "bg-amber-100 text-amber-700",
      buttonClass:
        "bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-amber-200",
      actionLabel: "Mulai Buat CV",
      onClick: onCreate,
    },
    {
      id: "upload-document",
      eyebrow: "Gunakan dokumen lama",
      title: "Upload CV / Surat Lamaran",
      description:
        "Unggah PDF atau DOCX agar dokumen lama dapat diperiksa dan diperbarui.",
      helper: "CV dan surat lamaran",
      icon: UploadIcon,
      iconClass: "bg-sky-100 text-sky-700",
      buttonClass:
        "bg-sky-500 text-white hover:bg-sky-600 shadow-sky-200",
      actionLabel: "Upload Dokumen",
      onClick: onUploadDocument,
    },
    {
      id: "create-letter",
      eyebrow: "Dokumen pendamping",
      title: "Buat Surat Lamaran",
      description:
        "Gunakan CV tersimpan sebagai dasar surat lamaran yang konsisten.",
      helper: selectedCv ? "CV aktif siap digunakan" : "Bisa dimulai tanpa CV",
      icon: LetterIcon,
      iconClass: "bg-violet-100 text-violet-700",
      buttonClass:
        "bg-violet-600 text-white hover:bg-violet-700 shadow-violet-200",
      actionLabel: "Buat Surat Lamaran",
      onClick: () => onCreateCoverLetter?.(selectedCv || null),
    },
  ];

  return (
    <section className="mt-6">
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
            Mulai pekerjaan
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
            Apa yang ingin Anda buat?
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          Pilih satu alur untuk memulai.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <article
              key={action.id}
              className="group flex min-h-[250px] min-w-0 flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl sm:p-6"
            >
              <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
                <span
                  className={`flex h-13 w-13 items-center justify-center rounded-2xl ${action.iconClass}`}
                >
                  <Icon className="h-6 w-6" />
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500">
                  {action.helper}
                </span>
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                {action.eyebrow}
              </p>
              <h3 className="mt-2 text-xl font-extrabold text-slate-900">
                {action.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                {action.description}
              </p>

              <button
                type="button"
                onClick={action.onClick}
                className={`mt-5 inline-flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-extrabold shadow-lg transition ${action.buttonClass}`}
              >
                {action.actionLabel}
                <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function MetricCard({ label, value, helper, icon: Icon, tone }) {
  const tones = {
    sky: "bg-sky-50 text-sky-700 ring-sky-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
  };

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-400">{helper}</p>
        </div>
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${tones[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </article>
  );
}

function ChecklistPanel({
  selectedCv,
  selectedScore,
  onEdit,
  onCreateCoverLetter,
}) {
  const tasks = [
    {
      title: "Lengkapi isi CV",
      description: "Pastikan kontak, pengalaman, pendidikan, dan keahlian terisi.",
      action: "Lanjutkan CV",
      done: selectedScore >= 70,
      icon: DocumentIcon,
    },
    {
      title: "Periksa kesiapan ATS",
      description: "Tinjau kelengkapan dan struktur sebelum dikirim ke perekrut.",
      action: "Periksa ATS",
      done: selectedScore >= 80,
      icon: ShieldIcon,
    },
    {
      title: "Tinjau desain dan keterbacaan",
      description: "Gunakan template profesional dengan font dan spasi yang konsisten.",
      action: "Edit Desain",
      done: Boolean(selectedCv?.data?.design?.template),
      icon: PaletteIcon,
    },
    {
      title: "Siapkan dokumen lamaran",
      description: "Gunakan CV final sebagai dasar surat lamaran yang konsisten.",
      action: "Buat Surat Lamaran",
      done: false,
      icon: LetterIcon,
    },
  ];

  const doneCount = tasks.filter((task) => task.done).length;

  return (
    <article className="min-w-0 overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
            Checklist profesional
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
            Daftar Periksa CV Siap Kerja
          </h2>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
          <span className="text-sky-600">{doneCount}</span>/{tasks.length} selesai
        </div>
      </div>

      <div className="space-y-3 bg-slate-50/60 p-4 sm:p-5">
        {tasks.map((task, index) => {
          const Icon = task.icon;

          return (
            <div
              key={task.title}
              className="flex min-w-0 flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-200 hover:shadow-md sm:flex-row sm:items-center sm:p-5"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100 text-sky-600">
                  <Icon className="h-7 w-7" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white text-[11px] font-extrabold text-slate-500 shadow">
                    {index + 1}
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-slate-900">{task.title}</h3>
                    {task.done && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                        Selesai
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {task.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedCv) return;
                      if (task.title === "Siapkan dokumen lamaran") {
                        onCreateCoverLetter?.(selectedCv);
                        return;
                      }
                      onEdit?.(selectedCv);
                    }}
                    className="mt-3 rounded-xl border border-sky-200 px-3.5 py-2 text-xs font-bold text-sky-600 transition hover:bg-sky-50"
                  >
                    {task.action}
                  </button>
                </div>
              </div>

              <div
                className={`flex shrink-0 items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-semibold sm:self-center ${
                  task.done
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    task.done ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                {task.done ? "Selesai" : "Belum selesai"}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function RecentDocuments({
  cvList,
  selectedId,
  setSelectedId,
  onEdit,
  onDelete,
  deletingId,
}) {
  return (
    <article className="min-w-0 overflow-hidden rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex min-w-0 flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
            Dokumen terbaru
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-slate-900">
            CV Tersimpan
          </h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
          {cvList.length} dokumen
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {cvList.slice(0, 4).map((cv, index) => {
          const data = getFormData(cv);
          const score = calculateCvScore(cv);
          const tone = getScoreTone(score);
          const active = cv.id === selectedId;

          return (
            <article
              key={cv.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedId(cv.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedId(cv.id);
                }
              }}
              className={`group min-w-0 cursor-pointer overflow-hidden rounded-2xl border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                active
                  ? "border-sky-300 bg-sky-50/70 shadow-md"
                  : "border-slate-200 bg-white hover:border-sky-200 hover:shadow-md"
              }`}
            >
              <div className="flex min-w-0 gap-3 sm:gap-4">
                <MiniCvPreview data={data} compact />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-extrabold text-slate-900">
                    {getDocumentTitle(cv, index)}
                  </p>
                  <p className="mt-1 truncate text-sm text-slate-500">
                    {data.jobTitle || "Posisi belum diisi"}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    Diperbarui {formatDate(getDocumentDate(cv))}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${tone.badge}`}
                    >
                      {score}% ATS
                    </span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit?.(cv);
                      }}
                      className="rounded-lg px-2.5 py-1 text-[11px] font-bold text-sky-600 hover:bg-sky-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === cv.id}
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(cv.id);
                      }}
                      className="rounded-lg px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    >
                      {deletingId === cv.id ? "Menghapus..." : "Hapus"}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </article>
  );
}

function SelectedCvPanel({
  cvList,
  selectedCv,
  selectedData,
  selectedScore,
  selectedTone,
  selectedId,
  setSelectedId,
  onEdit,
  onDelete,
  deletingId,
  onCreate,
  onCreateCoverLetter,
}) {
  return (
    <aside className="min-w-0 self-start overflow-hidden rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:sticky xl:top-28">
      <select
        value={selectedId}
        onChange={(event) => setSelectedId(event.target.value)}
        className="block w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 sm:px-4"
      >
        {cvList.map((cv, index) => (
          <option key={cv.id} value={cv.id}>
            {getDocumentTitle(cv, index)}
          </option>
        ))}
      </select>

      <div className="mt-4 min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-3 sm:p-4">
        <MiniCvPreview data={selectedData} />
      </div>

      <div className="mt-4">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-bold text-slate-700">Kesiapan CV</span>
          <span
            className={`max-w-full rounded-full px-2.5 py-1 text-right text-xs font-bold ring-1 ${selectedTone.badge}`}
          >
            {selectedScore}% · {selectedTone.label}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all ${selectedTone.bar}`}
            style={{ width: `${selectedScore}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => selectedCv && onEdit?.(selectedCv)}
          className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600"
        >
          <EditIcon className="h-4 w-4" />
          Edit CV
        </button>
        <button
          type="button"
          disabled={deletingId === selectedCv?.id}
          onClick={() => selectedCv && onDelete(selectedCv.id)}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
        >
          <TrashIcon className="h-4 w-4" />
          Hapus
        </button>
      </div>

      <button
        type="button"
        disabled={!selectedCv}
        onClick={() => selectedCv && onCreateCoverLetter?.(selectedCv)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/15 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <LetterIcon className="h-4 w-4" />
        Buat Surat Lamaran
      </button>

      <button
        type="button"
        onClick={onCreate}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-bold text-slate-500 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
      >
        <PlusIcon className="h-4 w-4" />
        Buat CV Baru
      </button>
    </aside>
  );
}

function MiniCvPreview({
  data,
  compact = false,
}) {
  /*
   * Preview compact pada kartu dokumen hanya berupa skeleton.
   * Tidak ada data CV asli yang ditampilkan.
   */
  if (compact) {
    return (
      <div
        className="relative h-[112px] w-[82px] shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-sm"
        aria-label="Thumbnail CV terlindungi"
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
      >
        <div className="h-4 rounded-sm bg-amber-100" />

        <div className="mt-2 h-1.5 w-10 rounded bg-slate-800" />
        <div className="mt-1 h-1 w-12 rounded bg-slate-300" />

        <div className="mt-3 grid grid-cols-[1fr_1.4fr] gap-1">
          <div className="space-y-1">
            <div className="h-1 rounded bg-slate-300" />
            <div className="h-1 rounded bg-slate-200" />
            <div className="h-1 rounded bg-slate-200" />
          </div>

          <div className="space-y-1">
            <div className="h-1 rounded bg-slate-400" />
            <div className="h-1 rounded bg-slate-200" />
            <div className="h-1 rounded bg-slate-200" />
            <div className="h-1 rounded bg-slate-200" />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className="whitespace-nowrap text-[5px] font-black uppercase tracking-[0.12em] text-slate-500/35"
            style={{ transform: "rotate(-28deg)" }}
          >
            CV KILAT
          </span>
        </div>
      </div>
    );
  }

  /*
   * Dashboard tidak merender isi lengkap CV.
   * Nama masih diperbolehkan untuk identifikasi dokumen,
   * tetapi kontak, ringkasan, pengalaman, pendidikan,
   * dan keahlian tidak dimasukkan ke DOM preview.
   */
  const fullName = getFullName(data);

  const jobTitle =
    data?.jobTitle ||
    data?.contact?.desiredJob ||
    "CV Profesional";

  const watermarkItems = Array.from(
    { length: 9 },
    (_, index) => index
  );

  return (
    <div
      className="relative mx-auto aspect-[210/297] w-full max-w-[255px] select-none overflow-hidden border border-slate-200 bg-white text-[6px] leading-[1.45] text-slate-800 shadow-lg"
      aria-label="Preview CV terlindungi"
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
      onCopy={(event) => event.preventDefault()}
    >
      {/* Header hanya untuk identifikasi dokumen. */}
      <div className="relative z-[1] bg-[#eadfd8] px-5 py-4">
        <p className="truncate text-[12px] font-bold text-slate-900">
          {fullName}
        </p>

        <p className="mt-1 truncate text-[5px] font-medium text-slate-600">
          {jobTitle}
        </p>

        <div className="mt-2 flex gap-1">
          <span className="h-1 w-14 rounded-full bg-slate-400/45" />
          <span className="h-1 w-8 rounded-full bg-slate-400/25" />
        </div>
      </div>

      {/* Skeleton CV. Tidak memakai isi CV pengguna. */}
      <div className="relative z-[1] grid h-full grid-cols-[0.85fr_1.15fr]">
        <div className="border-r border-slate-200 px-4 py-4">
          <div className="h-1.5 w-12 rounded bg-slate-700/75" />

          <div className="mt-3 space-y-1.5">
            <div className="h-1 rounded bg-slate-300" />
            <div className="h-1 rounded bg-slate-200" />
            <div className="h-1 w-4/5 rounded bg-slate-200" />
            <div className="h-1 rounded bg-slate-200" />
            <div className="h-1 w-3/4 rounded bg-slate-200" />
          </div>

          <div className="mt-6 h-1.5 w-10 rounded bg-slate-700/75" />

          <div className="mt-3 space-y-2">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5"
                >
                  <span className="h-1 w-1 rounded-full bg-slate-400" />
                  <span
                    className="h-1 rounded bg-slate-200"
                    style={{
                      width: `${55 + index * 6}%`,
                    }}
                  />
                </div>
              )
            )}
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="h-1.5 w-14 rounded bg-slate-700/75" />

          <div className="mt-3">
            <div className="h-1.5 w-20 rounded bg-slate-500/70" />
            <div className="mt-1.5 h-1 w-14 rounded bg-slate-300" />

            <div className="mt-2 space-y-1.5">
              <div className="h-1 rounded bg-slate-200" />
              <div className="h-1 rounded bg-slate-200" />
              <div className="h-1 w-5/6 rounded bg-slate-200" />
              <div className="h-1 rounded bg-slate-200" />
            </div>
          </div>

          <div className="mt-6">
            <div className="h-1.5 w-16 rounded bg-slate-500/70" />
            <div className="mt-1.5 h-1 w-12 rounded bg-slate-300" />

            <div className="mt-2 space-y-1.5">
              <div className="h-1 rounded bg-slate-200" />
              <div className="h-1 rounded bg-slate-200" />
              <div className="h-1 w-4/5 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Watermark berulang di atas seluruh thumbnail. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      >
        {watermarkItems.map((index) => (
          <span
            key={index}
            className="absolute whitespace-nowrap text-[9px] font-black uppercase tracking-[0.16em] text-slate-800/10"
            style={{
              top: `${6 + index * 11}%`,
              left: index % 2 === 0 ? "48%" : "55%",
              transform:
                "translateX(-50%) rotate(-28deg)",
            }}
          >
            Preview • CV Kilat
          </span>
        ))}
      </div>

      {/* Penutup bawah agar halaman tidak dapat diambil utuh. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[42%] bg-gradient-to-t from-white via-white/95 to-transparent" />

      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-40 rounded-xl border border-slate-200 bg-slate-950/90 px-3 py-3 text-center text-white shadow-xl backdrop-blur-sm">
        <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[12px]">
          🔒
        </div>

        <p className="mt-1.5 text-[8px] font-extrabold">
          Preview CV dilindungi
        </p>

        <p className="mt-1 text-[5px] leading-relaxed text-slate-300">
          Isi lengkap tersedia melalui editor. PDF tanpa
          watermark mengikuti akses paket.
        </p>
      </div>
    </div>
  );
}
function DocumentsView({
  cvList,
  loading,
  onCreate,
  onEdit,
  onDelete,
  deletingId,
}) {
  return (
    <section>
      <PageTitle
        eyebrow="Pusat dokumen"
        title="Dokumen CV Anda"
        description="Kelola semua CV yang tersimpan dan lanjutkan proses pengeditan."
        actionLabel="Buat CV Baru"
        onAction={onCreate}
      />

      {loading ? (
        <DashboardSkeleton />
      ) : cvList.length === 0 ? (
        <EmptyDashboard onCreate={onCreate} />
      ) : (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {cvList.map((cv, index) => {
            const data = getFormData(cv);
            const score = calculateCvScore(cv);
            const tone = getScoreTone(score);

            return (
              <article
                key={cv.id}
                className="min-w-0 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="overflow-hidden rounded-2xl bg-slate-100 p-4">
                  <MiniCvPreview data={data} />
                </div>

                <div className="mt-5 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-extrabold text-slate-900">
                      {getDocumentTitle(cv, index)}
                    </h3>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {data.jobTitle || "Posisi belum diisi"}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${tone.badge}`}
                  >
                    {score}%
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Diperbarui {formatDate(getDocumentDate(cv))}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit?.(cv)}
                    className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-600"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === cv.id}
                    onClick={() => onDelete(cv.id)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
                  >
                    {deletingId === cv.id ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function AtsView({
  cvList,
  selectedId,
  setSelectedId,
  selectedCv,
  selectedData,
  selectedScore,
  selectedTone,
  onEdit,
}) {
  const checks = [
    {
      label: "Identitas dan kontak",
      done: Boolean(
        getFullName(selectedData) !== "CV Tanpa Nama" &&
          selectedData.email &&
          selectedData.phone
      ),
    },
    {
      label: "Target pekerjaan",
      done: Boolean(selectedData.jobTitle),
    },
    {
      label: "Ringkasan profesional",
      done: textHasContent(selectedData.summary),
    },
    {
      label: "Pengalaman kerja",
      done: Array.isArray(selectedData.experience)
        ? selectedData.experience.some(
            (item) => item?.role || item?.job || item?.company
          )
        : false,
    },
    {
      label: "Pendidikan",
      done: Array.isArray(selectedData.education)
        ? selectedData.education.some((item) => item?.school || item?.degree)
        : false,
    },
    {
      label: "Keahlian relevan",
      done: Array.isArray(selectedData.skills)
        ? selectedData.skills.some((item) =>
            typeof item === "string" ? item : item?.name
          )
        : false,
    },
  ];

  return (
    <section>
      <PageTitle
        eyebrow="Pemeriksa otomatis"
        title="Kesiapan ATS"
        description="Lihat bagian yang sudah kuat dan bagian yang masih perlu dilengkapi."
      />

      {!cvList.length ? (
        <EmptyDashboard />
      ) : (
        <div className="mt-7 grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Pilih CV
            </label>
            <select
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            >
              {cvList.map((cv, index) => (
                <option key={cv.id} value={cv.id}>
                  {getDocumentTitle(cv, index)}
                </option>
              ))}
            </select>

            <div className="mt-5 rounded-2xl bg-slate-100 p-4">
              <MiniCvPreview data={selectedData} />
            </div>
          </aside>

          <article className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-bold text-slate-500">Skor CV Anda</p>
                <div className="mt-2 flex items-end gap-3">
                  <span className="text-5xl font-extrabold tracking-tight text-slate-900">
                    {selectedScore}%
                  </span>
                  <span
                    className={`mb-1 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${selectedTone.badge}`}
                  >
                    {selectedTone.label}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => selectedCv && onEdit?.(selectedCv)}
                className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white hover:bg-sky-600"
              >
                Perbaiki CV
              </button>
            </div>

            <div className="mt-7 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${selectedTone.bar}`}
                style={{ width: `${selectedScore}%` }}
              />
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {checks.map((check) => (
                <div
                  key={check.label}
                  className={`flex items-center gap-3 rounded-2xl border p-4 ${
                    check.done
                      ? "border-emerald-100 bg-emerald-50/70"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      check.done
                        ? "bg-emerald-500 text-white"
                        : "bg-white text-slate-400 shadow-sm"
                    }`}
                  >
                    {check.done ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    )}
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

function CoverLetterDashboardView({
  cvList,
  selectedCv,
  selectedData,
  selectedId,
  setSelectedId,
  onCreateCoverLetter,
}) {
  return (
    <section>
      <PageTitle
        eyebrow="Dokumen pendamping"
        title="Surat Lamaran Kerja"
        description="Buat surat lamaran yang konsisten dengan data CV dan disesuaikan untuk perusahaan serta posisi yang dituju."
        actionLabel="Buat Surat Lamaran"
        onAction={() => selectedCv && onCreateCoverLetter?.(selectedCv)}
      />

      {cvList.length === 0 ? (
        <div className="mt-7 rounded-[28px] border border-dashed border-sky-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-gradient-to-br from-violet-100 to-sky-100 text-violet-600">
            <LetterIcon className="h-10 w-10" />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-slate-900">
            Buat CV terlebih dahulu
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Surat lamaran menggunakan profil, pengalaman, dan keahlian dari CV agar isi dokumen tetap konsisten.
          </p>
        </div>
      ) : (
        <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
          <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#101b38] via-[#172856] to-[#1f4e7a] px-6 py-8 text-white sm:px-8">
              <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-amber-400/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 right-6 h-56 w-56 rounded-full bg-violet-400/20 blur-3xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-amber-300">
                  <SparkIcon className="h-4 w-4" />
                  Terhubung dengan CV
                </span>
                <h2 className="mt-5 max-w-2xl text-3xl font-extrabold tracking-tight">
                  Ubah data CV menjadi surat lamaran profesional.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Pilih CV, isi perusahaan dan posisi tujuan, lalu CV Kilat membantu menyusun struktur surat dengan live preview dan export PDF.
                </p>
                <button
                  type="button"
                  onClick={() => selectedCv && onCreateCoverLetter?.(selectedCv)}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 font-extrabold text-slate-950 shadow-xl shadow-amber-500/20 transition hover:-translate-y-0.5 hover:bg-amber-300"
                >
                  <LetterIcon className="h-5 w-5" />
                  Mulai Surat Lamaran
                </button>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
              {[
                ["1", "Pilih CV", "Gunakan profil dan pengalaman yang sudah tersimpan."],
                ["2", "Isi Lowongan", "Masukkan perusahaan, posisi, dan tujuan lamaran."],
                ["3", "Unduh PDF", "Tinjau hasil akhir lalu simpan atau unduh dokumen."],
              ].map(([number, title, description]) => (
                <div key={number} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sm font-extrabold text-sky-700">
                    {number}
                  </span>
                  <h3 className="mt-4 font-extrabold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="self-start rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-28">
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              CV Sumber
            </label>
            <select
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            >
              {cvList.map((cv, index) => (
                <option key={cv.id} value={cv.id}>
                  {getDocumentTitle(cv, index)}
                </option>
              ))}
            </select>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-4">
              <MiniCvPreview data={selectedData} />
            </div>

            <button
              type="button"
              onClick={() => selectedCv && onCreateCoverLetter?.(selectedCv)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-bold text-white shadow-lg shadow-violet-500/15 transition hover:-translate-y-0.5"
            >
              <LetterIcon className="h-4 w-4" />
              Gunakan CV Ini
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}

function AccountView({
  user,
  onLogout,
  onOpenLegal,
  onAccountDeleted,
}) {
  return (
    <section>
      <PageTitle
        eyebrow="Pengaturan akun"
        title="Akun Saya"
        description="Kelola sesi, salinan data, dokumen legal, dan penghapusan akun CV Kilat."
      />

      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_360px]">
        <article className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-blue-200 text-sky-700">
              <UserIcon className="h-8 w-8" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-400">
                ID Pengguna
              </p>
              <p className="mt-1 break-all font-bold text-slate-800">
                {user || "Tidak tersedia"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">
                Status akun
              </p>
              <p className="mt-2 flex items-center gap-2 font-extrabold text-emerald-700">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Aktif
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">
                Sinkronisasi
              </p>
              <p className="mt-2 font-extrabold text-sky-700">
                Supabase Cloud
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[26px] border border-rose-100 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <LogoutIcon className="h-6 w-6" />
          </div>

          <h2 className="mt-5 text-xl font-extrabold text-slate-900">
            Keluar dari akun
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            CV tersimpan tetap aman di cloud dan dapat dibuka kembali setelah
            login.
          </p>

          <button
            type="button"
            onClick={onLogout}
            className="mt-6 w-full rounded-xl bg-rose-500 px-4 py-3 font-bold text-white transition hover:bg-rose-600"
          >
            Logout
          </button>
        </article>
      </div>

      <div className="mt-6">
        <DeleteAccountPanel
          user={user}
          onOpenLegal={onOpenLegal}
          onDeleted={onAccountDeleted}
        />
      </div>
    </section>
  );
}

function PageTitle({ eyebrow, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600"
        >
          <PlusIcon className="h-4 w-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function EmptyDashboard({ onCreate }) {
  return (
    <section className="mt-7 flex min-h-[480px] items-center justify-center rounded-[30px] border border-dashed border-sky-200 bg-white/70 p-8 text-center shadow-sm">
      <div className="max-w-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-gradient-to-br from-sky-100 to-blue-200 text-sky-600">
          <DocumentIcon className="h-10 w-10" />
        </div>
        <h2 className="mt-6 text-2xl font-extrabold text-slate-900">
          Belum ada CV tersimpan
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Buat CV pertama Anda, lengkapi data profesional, kemudian pilih template
          yang paling sesuai dengan tujuan karier.
        </p>
        {onCreate && (
          <button
            type="button"
            onClick={onCreate}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 font-bold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600"
          >
            <PlusIcon className="h-5 w-5" />
            Buat CV Pertama
          </button>
        )}
      </div>
    </section>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mt-6 grid animate-pulse gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
      <div className="space-y-6">
        <div className="h-[420px] rounded-[26px] bg-white" />
        <div className="h-[260px] rounded-[26px] bg-white" />
      </div>
      <div className="h-[620px] rounded-[26px] bg-white" />
    </div>
  );
}

function IconBase({ children, className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function HomeIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </IconBase>
  );
}

function DocumentIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v5h5" />
      <path d="M10 12h5M10 16h5" />
    </IconBase>
  );
}

function LetterIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 5h16v14H4z" />
      <path d="m4 7 8 6 8-6" />
      <path d="M8 3h8" />
    </IconBase>
  );
}

function ShieldIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6z" />
      <path d="m9.5 12 1.7 1.7 3.5-3.7" />
    </IconBase>
  );
}

function UserIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.8-4 3.4-6 8-6s7.2 2 8 6" />
    </IconBase>
  );
}

function PlusIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14M5 12h14" />
    </IconBase>
  );
}


function UploadIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M5 14v5h14v-5" />
    </IconBase>
  );
}

function ArrowRightIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </IconBase>
  );
}

function CheckIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m5 12 4 4L19 6" />
    </IconBase>
  );
}

function CloudIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 8.5 4.5 4.5 0 0 0 7 18Z" />
      <path d="m9 13 3-3 3 3M12 10v7" />
    </IconBase>
  );
}

function PaletteIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 3a9 9 0 1 0 0 18h1.3a1.7 1.7 0 0 0 1.2-2.9l-.5-.5a1.7 1.7 0 0 1 1.2-2.9H17a4 4 0 0 0 4-4C21 6.4 17 3 12 3Z" />
      <circle cx="7.5" cy="10" r=".7" fill="currentColor" stroke="none" />
      <circle cx="10" cy="6.8" r=".7" fill="currentColor" stroke="none" />
      <circle cx="14" cy="6.8" r=".7" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

function BriefcaseIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M8 7V5h8v2M3 12h18M10 12v2h4v-2" />
    </IconBase>
  );
}

function EditIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10z" />
      <path d="m14.5 7.5 3 3" />
    </IconBase>
  );
}

function TrashIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />
    </IconBase>
  );
}

function SparkIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m12 3 1.2 4.2L17 9l-3.8 1.8L12 15l-1.2-4.2L7 9l3.8-1.8z" />
      <path d="m19 14 .6 2.1 1.9.9-1.9.9L19 20l-.6-2.1-1.9-.9 1.9-.9z" />
    </IconBase>
  );
}

function LogoutIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" />
    </IconBase>
  );
}