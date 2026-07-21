export function applyTextFormatting(value, selectionStart, selectionEnd, type) {
  const selected = value.slice(selectionStart, selectionEnd);
  const hasSelection = selectionEnd > selectionStart;

  const wrappers = {
    bold: ["**", "**", "teks penting"],
    italic: ["_", "_", "teks miring"],
    underline: ["<u>", "</u>", "teks bergaris bawah"],
    strike: ["~~", "~~", "teks dicoret"],
  };

  if (wrappers[type]) {
    const [before, after, placeholder] = wrappers[type];
    const content = hasSelection ? selected : placeholder;
    const replacement = `${before}${content}${after}`;
    const nextValue = `${value.slice(0, selectionStart)}${replacement}${value.slice(selectionEnd)}`;
    const contentStart = selectionStart + before.length;
    return {
      nextValue,
      nextSelectionStart: contentStart,
      nextSelectionEnd: contentStart + content.length,
    };
  }

  if (type === "link") {
    const label = hasSelection ? selected : "tautan";
    const replacement = `[${label}](https://)`;
    const nextValue = `${value.slice(0, selectionStart)}${replacement}${value.slice(selectionEnd)}`;
    const urlStart = selectionStart + label.length + 3;
    return {
      nextValue,
      nextSelectionStart: urlStart,
      nextSelectionEnd: urlStart + 8,
    };
  }

  if (type === "ordered" || type === "bullet") {
    const markerFor = (index) => (type === "ordered" ? `${index + 1}. ` : "• ");

    if (hasSelection) {
      const lines = selected.split("\n");
      const replacement = lines.map((line, index) => `${markerFor(index)}${line}`).join("\n");
      const nextValue = `${value.slice(0, selectionStart)}${replacement}${value.slice(selectionEnd)}`;
      return {
        nextValue,
        nextSelectionStart: selectionStart,
        nextSelectionEnd: selectionStart + replacement.length,
      };
    }

    const marker = markerFor(0);
    const nextValue = `${value.slice(0, selectionStart)}${marker}${value.slice(selectionEnd)}`;
    const nextCursor = selectionStart + marker.length;
    return {
      nextValue,
      nextSelectionStart: nextCursor,
      nextSelectionEnd: nextCursor,
    };
  }

  return null;
}
