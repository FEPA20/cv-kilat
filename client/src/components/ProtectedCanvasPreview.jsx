import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import html2canvas from "html2canvas-pro";

const VIEW_MODES = {
  top: "Atas",
  middle: "Tengah",
  bottom: "Bawah",
};

const ProtectedCanvasPreview = forwardRef(
  function ProtectedCanvasPreview(
    {
      children,
      refreshKey,
      previewWidth = 590,
      viewportHeight = 640,
      sourceWidth = 794,
      captureScale = 0.58,
      jpegQuality = 0.72,
      debounceMs = 380,
      className = "",
    },
    forwardedRef
  ) {
    const sourceRef = useRef(null);
    const viewportRef = useRef(null);
    const renderVersionRef = useRef(0);

    const [imageUrl, setImageUrl] = useState("");
    const [imageSize, setImageSize] = useState({
      width: 0,
      height: 0,
    });
    const [viewportWidth, setViewportWidth] =
      useState(previewWidth);
    const [viewMode, setViewMode] = useState("top");
    const [rendering, setRendering] = useState(true);
    const [renderError, setRenderError] = useState("");

    useImperativeHandle(
      forwardedRef,
      () => sourceRef.current
    );

    useEffect(() => {
      const element = viewportRef.current;

      if (!element) return undefined;

      const updateWidth = () => {
        const width =
          element.getBoundingClientRect().width;

        if (width > 0) {
          setViewportWidth(width);
        }
      };

      updateWidth();

      const observer =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(updateWidth)
          : null;

      observer?.observe(element);
      window.addEventListener("resize", updateWidth);

      return () => {
        observer?.disconnect();
        window.removeEventListener(
          "resize",
          updateWidth
        );
      };
    }, []);

    useEffect(() => {
      let cancelled = false;
      const renderVersion =
        ++renderVersionRef.current;

      const timeoutId = window.setTimeout(
        async () => {
          const sourceElement = sourceRef.current;

          if (!sourceElement) return;

          setRendering(true);
          setRenderError("");

          try {
            if (document.fonts?.ready) {
              await document.fonts.ready;
            }

            const canvas = await html2canvas(
              sourceElement,
              {
                scale: captureScale,
                useCORS: true,
                allowTaint: false,
                logging: false,
                backgroundColor: "#ffffff",
                scrollX: 0,
                scrollY: 0,
              }
            );

            if (
              cancelled ||
              renderVersion !==
                renderVersionRef.current
            ) {
              return;
            }

            if (!canvas.width || !canvas.height) {
              throw new Error(
                "Ukuran gambar preview tidak valid."
              );
            }

            setImageSize({
              width: canvas.width,
              height: canvas.height,
            });

            setImageUrl(
              canvas.toDataURL(
                "image/jpeg",
                jpegQuality
              )
            );
          } catch (error) {
            console.error(
              "Gagal membuat protected preview:",
              error
            );

            if (!cancelled) {
              setRenderError(
                error?.message ||
                  "Preview belum dapat dibuat."
              );
            }
          } finally {
            if (
              !cancelled &&
              renderVersion ===
                renderVersionRef.current
            ) {
              setRendering(false);
            }
          }
        },
        debounceMs
      );

      return () => {
        cancelled = true;
        window.clearTimeout(timeoutId);
      };
    }, [
      refreshKey,
      captureScale,
      jpegQuality,
      debounceMs,
    ]);

    const renderedHeight = useMemo(() => {
      if (!imageSize.width || !imageSize.height) {
        return viewportHeight;
      }

      return (
        viewportWidth *
        (imageSize.height / imageSize.width)
      );
    }, [
      imageSize,
      viewportHeight,
      viewportWidth,
    ]);

    const visibleHeight = Math.min(
      viewportHeight,
      Math.max(renderedHeight, 360)
    );

    const imageOffset = useMemo(() => {
      const maximumOffset = Math.max(
        0,
        renderedHeight - visibleHeight
      );

      if (viewMode === "middle") {
        return maximumOffset / 2;
      }

      if (viewMode === "bottom") {
        return maximumOffset;
      }

      return 0;
    }, [
      renderedHeight,
      visibleHeight,
      viewMode,
    ]);

    return (
      <>
        {/* Sumber resolusi penuh untuk PDF resmi.
            Diposisikan jauh di luar layar, bukan display:none,
            agar html2canvas tetap dapat membacanya. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-0"
          style={{
            left: "-100000px",
            width: `${sourceWidth}px`,
            zIndex: -9999,
          }}
        >
          <div
            ref={sourceRef}
            style={{
              width: `${sourceWidth}px`,
              backgroundColor: "#ffffff",
            }}
          >
            {children}
          </div>
        </div>

        {/* Yang terlihat user hanya JPEG beresolusi terbatas. */}
        <section
          className={`overflow-hidden rounded-[24px] border border-slate-300 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.16)] ${className}`}
          style={{
            width: "100%",
            maxWidth: `${previewWidth}px`,
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
            <div>
              <p className="text-xs font-extrabold text-slate-800">
                Preview aman
              </p>
              <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
                Resolusi layar dibatasi. PDF resmi tetap tajam.
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
              {Object.entries(VIEW_MODES).map(
                ([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setViewMode(key)}
                    className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition ${
                      viewMode === key
                        ? "bg-white text-sky-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          <div
            ref={viewportRef}
            className="relative w-full overflow-hidden bg-slate-100 select-none"
            style={{ height: `${visibleHeight}px` }}
            onContextMenu={(event) =>
              event.preventDefault()
            }
            onDragStart={(event) =>
              event.preventDefault()
            }
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Preview CV beresolusi terbatas"
                draggable="false"
                className="pointer-events-none absolute left-0 top-0 w-full max-w-none select-none"
                style={{
                  transform: `translateY(-${imageOffset}px)`,
                  transition:
                    "transform 260ms ease",
                  filter:
                    "saturate(0.97) contrast(0.985)",
                  imageRendering: "auto",
                }}
              />
            ) : null}

            {rendering ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/75">
                <div className="text-center">
                  <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
                  <p className="mt-3 text-xs font-semibold text-slate-500">
                    Memperbarui preview...
                  </p>
                </div>
              </div>
            ) : null}

            {renderError ? (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-white px-6 text-center">
                <div>
                  <p className="text-sm font-extrabold text-rose-600">
                    Preview belum dapat ditampilkan
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {renderError}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-slate-950/10 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-slate-100 via-slate-100/50 to-transparent" />

            <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-slate-300 bg-white/95 px-4 py-2 text-[10px] font-extrabold text-slate-600 shadow-sm">
              Tampilan penuh tersedia pada PDF resmi
            </div>
          </div>
        </section>
      </>
    );
  }
);

export default ProtectedCanvasPreview;