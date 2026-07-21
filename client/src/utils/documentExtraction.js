const PDF_EXTENSION = "pdf";
const DOCX_EXTENSION = "docx";
const PAGE_BREAK = "\n\n<<<CV_KILAT_PAGE_BREAK>>>\n\n";

function getExtension(filename = "") {
  return String(filename).split(".").pop()?.toLowerCase() || "";
}

function normalizeExtractedText(value = "") {
  return String(value)
    .replace(/\u00a0/g, " ")
    .replace(/\u200b/g, "")
    .replace(/\r/g, "")
    .replace(/[ ]+\n/g, "\n")
    .replace(/\n[ ]+/g, "\n")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\t[ ]+/g, "\t")
    .replace(/[ ]+\t/g, "\t")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function itemY(item) {
  return Number(item?.transform?.[5] || 0);
}

function itemX(item) {
  return Number(item?.transform?.[4] || 0);
}

function itemHeight(item) {
  const transformedHeight = Math.abs(Number(item?.transform?.[3] || 0));
  return Math.max(
    1,
    Math.abs(Number(item?.height || 0)),
    transformedHeight
  );
}

function itemWidth(item) {
  return Math.max(0, Math.abs(Number(item?.width || 0)));
}

function averageCharacterWidth(item) {
  const textLength = Math.max(1, String(item?.text || "").length);
  return Math.max(1, Number(item?.width || 0) / textLength);
}

function groupItemsIntoLines(items = []) {
  const sorted = items
    .filter((item) => item.text)
    .sort((a, b) => {
      const yDifference = b.y - a.y;
      if (Math.abs(yDifference) > 1.5) return yDifference;
      return a.x - b.x;
    });

  const lines = [];

  for (const item of sorted) {
    const tolerance = Math.max(2.5, Math.min(5, item.height * 0.35));
    let targetLine = null;

    for (let index = lines.length - 1; index >= 0; index -= 1) {
      const candidate = lines[index];

      if (candidate.y - item.y > 10) {
        break;
      }

      if (Math.abs(candidate.y - item.y) <= tolerance) {
        targetLine = candidate;
        break;
      }
    }

    if (!targetLine) {
      targetLine = {
        y: item.y,
        height: item.height,
        items: [],
      };
      lines.push(targetLine);
    }

    targetLine.items.push(item);
    targetLine.y =
      targetLine.items.reduce((sum, current) => sum + current.y, 0) /
      targetLine.items.length;
    targetLine.height = Math.max(targetLine.height, item.height);
  }

  return lines
    .sort((a, b) => b.y - a.y)
    .map((line) => ({
      ...line,
      items: line.items.sort((a, b) => a.x - b.x),
    }));
}

function buildLineText(items = []) {
  let output = "";
  let previous = null;

  for (const item of items) {
    if (previous) {
      const previousRight = previous.x + previous.width;
      const gap = item.x - previousRight;
      const averageWidth = Math.max(
        averageCharacterWidth(previous),
        averageCharacterWidth(item)
      );
      const columnGap = Math.max(34, averageWidth * 5.5);

      if (gap >= columnGap) {
        output += "\t";
      } else if (gap > -averageWidth * 0.2) {
        output += " ";
      }
    }

    output += item.text;
    previous = item;
  }

  return output
    .replace(/[ ]{2,}/g, " ")
    .replace(/\s+\t/g, "\t")
    .replace(/\t\s+/g, "\t")
    .trim();
}

function buildPageText(items = []) {
  const textItems = items
    .filter((item) => typeof item?.str === "string" && item.str.trim())
    .map((item) => ({
      text: item.str.trim(),
      x: itemX(item),
      y: itemY(item),
      width: itemWidth(item),
      height: itemHeight(item),
    }));

  if (!textItems.length) return "";

  return groupItemsIntoLines(textItems)
    .map((line) => buildLineText(line.items))
    .filter(Boolean)
    .join("\n");
}

async function extractPdfText(file, onProgress) {
  const pdfjsLib = await import("pdfjs-dist");
  const workerModule = await import(
    "pdfjs-dist/build/pdf.worker.min.mjs?url"
  );

  pdfjsLib.GlobalWorkerOptions.workerSrc = workerModule.default;

  const fileData = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjsLib.getDocument({
    data: fileData,
    useSystemFonts: true,
  });
  const pdf = await loadingTask.promise;
  const pages = [];

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      onProgress?.({
        current: pageNumber,
        total: pdf.numPages,
        message: `Membaca halaman ${pageNumber} dari ${pdf.numPages}`,
      });

      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent({
        includeMarkedContent: false,
        disableNormalization: false,
      });
      const pageText = buildPageText(content.items);

      if (pageText) {
        pages.push(pageText);
      }

      page.cleanup();
    }
  } finally {
    if (typeof loadingTask?.destroy === "function") {
      await loadingTask.destroy();
    } else if (typeof pdf?.destroy === "function") {
      await pdf.destroy();
    }
  }

  return normalizeExtractedText(pages.join(PAGE_BREAK));
}

async function extractDocxText(file, onProgress) {
  onProgress?.({
    current: 1,
    total: 1,
    message: "Membaca dokumen Word",
  });

  const mammothModule = await import("mammoth");
  const mammoth = mammothModule.default || mammothModule;
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });

  return normalizeExtractedText(result.value);
}

export async function extractTextFromDocument(file, onProgress) {
  if (!file) {
    throw new Error("File belum dipilih.");
  }

  const extension = getExtension(file.name);

  if (extension === PDF_EXTENSION) {
    return extractPdfText(file, onProgress);
  }

  if (extension === DOCX_EXTENSION) {
    return extractDocxText(file, onProgress);
  }

  if (extension === "doc") {
    throw new Error(
      "Format DOC lama belum dapat dibaca langsung. Simpan ulang file sebagai DOCX atau PDF."
    );
  }

  throw new Error("Format file belum didukung. Gunakan PDF atau DOCX.");
}

export function isSupportedDocument(file) {
  return ["pdf", "docx"].includes(getExtension(file?.name));
}

export function getDocumentExtension(filename) {
  return getExtension(filename);
}
