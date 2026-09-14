/**
 * Generates golden Excel fixtures for visual / parse regression.
 * Run: node scripts/generate-excel-fixtures.mjs
 */
import ExcelJS from "exceljs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../tests/excel-fixtures");

async function save(name, build) {
  const wb = new ExcelJS.Workbook();
  await build(wb);
  const buf = await wb.xlsx.writeBuffer();
  const path = join(outDir, name);
  await writeFile(path, Buffer.from(buf));
  console.log("wrote", name);
}

await mkdir(outDir, { recursive: true });

await save("01-basic.xlsx", async (wb) => {
  const ws = wb.addWorksheet("Basic");
  ws.getCell("A1").value = "Hello";
  ws.getCell("B1").value = "World";
  ws.getCell("A2").value = 42;
});

await save("02-merged.xlsx", async (wb) => {
  const ws = wb.addWorksheet("Merged");
  ws.mergeCells("A1:D2");
  ws.getCell("A1").value = "Merged Title";
  ws.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
  ws.getCell("A1").font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
  ws.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
  ws.getCell("A3").value = "Label";
  ws.getCell("B3").value = "Value";
});

await save("03-colors.xlsx", async (wb) => {
  const ws = wb.addWorksheet("Colors");
  ws.getCell("A1").value = "Header";
  ws.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E78" } };
  ws.getCell("A1").font = { color: { argb: "FFFFFFFF" }, bold: true };
  ws.getCell("A2").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2F0D9" } };
  ws.getCell("A2").value = "Green row";
});

await save("04-borders.xlsx", async (wb) => {
  const ws = wb.addWorksheet("Borders");
  const thin = { style: "thin", color: { argb: "FF000000" } };
  for (const ref of ["A1", "B1", "A2", "B2"]) {
    ws.getCell(ref).border = { top: thin, left: thin, bottom: thin, right: thin };
    ws.getCell(ref).value = ref;
  }
  ws.getCell("A1").border.bottom = { style: "medium", color: { argb: "FF4472C4" } };
});

await save("05-rtl-arabic.xlsx", async (wb) => {
  const ws = wb.addWorksheet("عربي");
  ws.views = [{ rightToLeft: true, state: "normal", activeCell: "A1" }];
  ws.getCell("A1").value = "اسم العميل";
  ws.getCell("B1").value = "محمد أحمد";
  ws.getCell("A2").value = "الجهة";
  ws.getCell("B2").value = "الجهاز المركزي";
  ws.getCell("A1").font = { name: "Arial", size: 12, bold: true };
});

await save("06-row-height.xlsx", async (wb) => {
  const ws = wb.addWorksheet("RowHeight");
  ws.getRow(1).height = 40;
  ws.getRow(2).height = 20;
  ws.getCell("A1").value = "Tall row";
  ws.getCell("A2").value = "Normal";
});

await save("07-column-width.xlsx", async (wb) => {
  const ws = wb.addWorksheet("ColWidth");
  ws.getColumn(1).width = 8;
  ws.getColumn(2).width = 24;
  ws.getColumn(3).width = 40;
  ws.getCell("A1").value = "S";
  ws.getCell("B1").value = "Medium column";
  ws.getCell("C1").value = "Wide column text content";
});

await save("08-wrapped-text.xlsx", async (wb) => {
  const ws = wb.addWorksheet("Wrap");
  ws.getColumn(1).width = 30;
  ws.getRow(1).height = 45;
  ws.getCell("A1").value =
    "This is a long wrapped paragraph that should break across multiple lines inside the cell.";
  ws.getCell("A1").alignment = { wrapText: true, vertical: "top" };
});

await save("09-theme-colors.xlsx", async (wb) => {
  const ws = wb.addWorksheet("Theme");
  // Explicit ARGB approximating theme accents (fixture still useful for fill path)
  ws.getCell("A1").value = "Accent-like";
  ws.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
  ws.getCell("A1").font = { color: { argb: "FFFFFFFF" }, bold: true };
  ws.getCell("A2").value = "Accent2-like";
  ws.getCell("A2").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFED7D31" } };
});

await save("10-complex-form.xlsx", async (wb) => {
  const ws = wb.addWorksheet("Form");
  ws.mergeCells("A1:D1");
  ws.getCell("A1").value = "CUSTOMER INFORMATION FORM";
  ws.getCell("A1").font = { bold: true, size: 18, color: { argb: "FFFFFFFF" } };
  ws.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E78" } };
  ws.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(1).height = 36;

  ws.getColumn(1).width = 22;
  ws.getColumn(2).width = 28;
  ws.getColumn(3).width = 14;
  ws.getColumn(4).width = 18;

  const thin = { style: "thin", color: { argb: "FF000000" } };
  const box = { top: thin, left: thin, bottom: thin, right: thin };

  ws.getCell("A3").value = "Customer Name";
  ws.getCell("B3").value = "";
  ws.getCell("A4").value = "Organization";
  ws.getCell("B4").value = "";
  ws.getCell("A5").value = "Country";
  ws.getCell("B5").value = "";
  ws.getCell("C5").value = "City";
  ws.getCell("D5").value = "";
  ws.getCell("A6").value = "Notes";
  ws.mergeCells("B6:D8");
  ws.getCell("B6").value = "";

  for (const ref of ["A3", "B3", "A4", "B4", "A5", "B5", "C5", "D5", "A6", "B6"]) {
    ws.getCell(ref).border = box;
  }
  ws.getCell("A3").font = { bold: true };
  ws.getCell("A4").font = { bold: true };
  ws.getCell("A5").font = { bold: true };
  ws.getCell("C5").font = { bold: true };
  ws.getCell("A6").font = { bold: true };
});

await writeFile(
  join(outDir, "README.md"),
  `# Excel golden fixtures

Generated by \`node scripts/generate-excel-fixtures.mjs\`.

| File | Focus |
|------|--------|
| 01-basic.xlsx | Plain values |
| 02-merged.xlsx | Merged cells + header style |
| 03-colors.xlsx | Solid fills |
| 04-borders.xlsx | Borders |
| 05-rtl-arabic.xlsx | RTL + Arabic |
| 06-row-height.xlsx | Custom row heights |
| 07-column-width.xlsx | Column widths |
| 08-wrapped-text.xlsx | Wrap text |
| 09-theme-colors.xlsx | Accent-like fills |
| 10-complex-form.xlsx | Form layout for field inference |

## Visual regression (planned)

1. Parse each fixture → WorkbookJSON
2. Render \`ExcelSheetRenderer\` in VIEW
3. Screenshot vs baseline

Until Playwright/Chromatic is wired, use these files for manual QA in the IT Form Builder upload path.
`,
);

console.log("done →", outDir);
