const SNAP_SCRIPT_ID = "cv-kilat-midtrans-snap";

function getSnapConfig() {
  const clientKey = String(
    import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "",
  ).trim();

  const production =
    String(
      import.meta.env.VITE_MIDTRANS_IS_PRODUCTION || "false",
    ).toLowerCase() === "true";

  if (!clientKey) {
    throw new Error(
      "VITE_MIDTRANS_CLIENT_KEY belum tersedia di client/.env.local.",
    );
  }

  return {
    clientKey,
    production,
    scriptUrl: production
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js",
  };
}

export function loadMidtransSnap() {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Midtrans Snap hanya bisa dibuka di browser."),
    );
  }

  if (window.snap?.pay) {
    return Promise.resolve(window.snap);
  }

  const { clientKey, scriptUrl } = getSnapConfig();

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SNAP_SCRIPT_ID);

    const finish = () => {
      if (window.snap?.pay) {
        resolve(window.snap);
        return;
      }

      reject(
        new Error(
          "Snap.js berhasil dimuat, tetapi window.snap.pay tidak tersedia.",
        ),
      );
    };

    if (existing) {
      existing.addEventListener("load", finish, {
        once: true,
      });

      existing.addEventListener(
        "error",
        () =>
          reject(
            new Error("Gagal memuat Midtrans Snap.js."),
          ),
        { once: true },
      );

      return;
    }

    const script = document.createElement("script");
    script.id = SNAP_SCRIPT_ID;
    script.src = scriptUrl;
    script.async = true;
    script.type = "text/javascript";
    script.setAttribute("data-client-key", clientKey);

    script.addEventListener("load", finish, {
      once: true,
    });

    script.addEventListener(
      "error",
      () =>
        reject(
          new Error(
            "Gagal memuat Midtrans Snap.js. Periksa Client Key dan koneksi internet.",
          ),
        ),
      { once: true },
    );

    document.head.appendChild(script);
  });
}
