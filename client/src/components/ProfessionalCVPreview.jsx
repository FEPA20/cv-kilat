import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

const A4_RATIO = 297 / 210;

function clamp(value, minimum, maximum) {
  return Math.min(
    maximum,
    Math.max(minimum, value)
  );
}

function formatZoom(value) {
  return `${Math.round(value * 100)}%`;
}

const ProfessionalCVPreview = forwardRef(
  function ProfessionalCVPreview(
    {
      children,
      refreshKey,
      sourceWidth = 794,
      viewportHeight = 820,
      minZoom = 0.5,
      maxZoom = 1.25,
      zoomStep = 0.05,
      defaultZoom = 1,
      defaultMode = "actual-size",
      className = "",
    },
    forwardedRef
  ) {
    const sourceRef = useRef(null);
    const viewportRef = useRef(null);

    const [viewportWidth, setViewportWidth] =
      useState(sourceWidth);

    const [sourceHeight, setSourceHeight] =
      useState(sourceWidth * A4_RATIO);

    const [zoomMode, setZoomMode] =
      useState(defaultMode);

    const [customZoom, setCustomZoom] =
      useState(
        clamp(
          defaultZoom,
          minZoom,
          maxZoom
        )
      );

    useImperativeHandle(
      forwardedRef,
      () => sourceRef.current
    );

    useEffect(() => {
      const viewportElement =
        viewportRef.current;

      if (!viewportElement) {
        return undefined;
      }

      const updateViewport = () => {
        const nextWidth =
          viewportElement.getBoundingClientRect()
            .width;

        if (nextWidth > 0) {
          setViewportWidth(nextWidth);
        }
      };

      updateViewport();

      const viewportObserver =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(updateViewport)
          : null;

      viewportObserver?.observe(
        viewportElement
      );

      window.addEventListener(
        "resize",
        updateViewport
      );

      return () => {
        viewportObserver?.disconnect();

        window.removeEventListener(
          "resize",
          updateViewport
        );
      };
    }, []);

    useEffect(() => {
      const sourceElement =
        sourceRef.current;

      if (!sourceElement) {
        return undefined;
      }

      const updateSourceHeight = () => {
        const measuredHeight = Math.max(
          sourceElement.scrollHeight,
          sourceElement.offsetHeight,
          sourceWidth * A4_RATIO
        );

        setSourceHeight(measuredHeight);
      };

      updateSourceHeight();

      const sourceObserver =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(
              updateSourceHeight
            )
          : null;

      sourceObserver?.observe(sourceElement);

      return () => {
        sourceObserver?.disconnect();
      };
    }, [
      refreshKey,
      sourceWidth,
    ]);

    const fitWidthZoom = useMemo(
      () =>
        clamp(
          (viewportWidth - 80) /
            sourceWidth,
          minZoom,
          maxZoom
        ),
      [
        viewportWidth,
        sourceWidth,
        minZoom,
        maxZoom,
      ]
    );

    const zoom =
      zoomMode === "fit-width"
        ? fitWidthZoom
        : zoomMode === "actual-size"
          ? 1
          : clamp(
              customZoom,
              minZoom,
              maxZoom
            );

    const scaledWidth =
      sourceWidth * zoom;

    const scaledHeight =
      sourceHeight * zoom;

    const changeZoom = (direction) => {
      const nextZoom = clamp(
        zoom + direction * zoomStep,
        minZoom,
        maxZoom
      );

      setCustomZoom(nextZoom);
      setZoomMode("custom");
    };

    const resetActualSize = () => {
      setCustomZoom(1);
      setZoomMode("actual-size");
    };

    return (
      <section
        className={`overflow-hidden rounded-[24px] border border-slate-300 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] ${className}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <div>
            <p className="text-xs font-extrabold text-slate-900">
              Preview CV
            </p>

            <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
              Tampilan kontinu • Tajam • PDF kualitas tinggi
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() =>
                  changeZoom(-1)
                }
                disabled={zoom <= minZoom}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-base font-bold text-slate-600 transition hover:bg-white hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Perkecil preview"
              >
                −
              </button>

              <span className="min-w-[58px] px-2 text-center text-[11px] font-extrabold text-slate-700">
                {formatZoom(zoom)}
              </span>

              <button
                type="button"
                onClick={() =>
                  changeZoom(1)
                }
                disabled={zoom >= maxZoom}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-base font-bold text-slate-600 transition hover:bg-white hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Perbesar preview"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={resetActualSize}
              className={`rounded-xl px-3 py-2 text-[11px] font-bold transition ${
                zoomMode === "actual-size"
                  ? "bg-sky-500 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700"
              }`}
            >
              100%
            </button>

            <button
              type="button"
              onClick={() =>
                setZoomMode("fit-width")
              }
              className={`rounded-xl px-3 py-2 text-[11px] font-bold transition ${
                zoomMode === "fit-width"
                  ? "bg-sky-500 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700"
              }`}
            >
              Fit Lebar
            </button>
          </div>
        </div>

        <div
          ref={viewportRef}
          className="overflow-auto bg-slate-200"
          style={{
            height: `${viewportHeight}px`,
          }}
        >
          <div
            className="relative mx-auto"
            style={{
              width: `${Math.max(
                scaledWidth + 80,
                viewportWidth
              )}px`,
              height: `${scaledHeight + 80}px`,
              minHeight: "100%",
            }}
          >
            <div
              className="absolute left-1/2 top-10"
              style={{
                width: `${sourceWidth}px`,
                transform: `translateX(-50%) scale(${zoom})`,
                transformOrigin: "top center",
              }}
            >
              <div
                ref={sourceRef}
                className="overflow-hidden bg-white shadow-[0_22px_65px_rgba(15,23,42,0.22)] ring-1 ring-slate-300"
                style={{
                  width: `${sourceWidth}px`,
                  minHeight: `${
                    sourceWidth * A4_RATIO
                  }px`,
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white px-4 py-2.5 text-center text-[10px] leading-4 text-slate-500">
          CV ditampilkan sebagai satu dokumen berkelanjutan.
          Pembagian halaman dilakukan saat PDF diunduh.
        </div>
      </section>
    );
  }
);

export default ProfessionalCVPreview;