/** Shared CSV / text download helpers for IT list + builder export actions. */

export function downloadCsv(filename, headers, rowArrays) {
  const lines = [
    headers.join(","),
    ...rowArrays.map((cells) =>
      cells.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ];
  const blob = new Blob([`\uFEFF${lines.join("\n")}`], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename.endsWith(".csv") ? filename : `${filename}.csv`);
}

export function downloadText(filename, body) {
  const blob = new Blob([`\uFEFF${body}`], { type: "text/plain;charset=utf-8;" });
  triggerDownload(blob, filename);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
