#!/usr/bin/env node
import fs from "fs";
import path from "path";
import jscodeshift from "jscodeshift";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cari root project dari next.config.ts
function findProjectRoot(dir = __dirname) {
  let current = dir;
  while (current !== path.parse(current).root) {
    if (fs.existsSync(path.join(current, "next.config.ts"))) {
      return current;
    }
    current = path.dirname(current);
  }
  return __dirname;
}

const ROOT = findProjectRoot();
console.log("📁 Project root:", ROOT);

// Folder yang akan di-scan
const FOLDERS = [
  ROOT,
  path.join(ROOT, "app"),
  path.join(ROOT, "components"),
  path.join(ROOT, "lib"),
  path.join(ROOT, "hooks"),
  path.join(ROOT, "static"),
  path.join(ROOT, "prisma"),
  path.join(ROOT, "function"),
  path.join(ROOT, "constants"),
];

// Hapus semua type annotations, interface, type alias, dan `as Type`
function removeTypes(fileContent, isTSX) {
  const j = jscodeshift.withParser(isTSX ? "tsx" : "ts");
  const root = j(fileContent);

  root.find(j.TSTypeAnnotation).remove();
  root.find(j.TSInterfaceDeclaration).remove();
  root.find(j.TSTypeAliasDeclaration).remove();
  root.find(j.TSAsExpression).replaceWith(p => p.node.expression);

  return root.toSource({ quote: "double" });
}

// Rename file extension
function renameFile(filePath) {
  let newPath;
  if (filePath.endsWith(".tsx")) newPath = filePath.replace(/\.tsx$/, ".jsx");
  else if (filePath.endsWith(".ts")) newPath = filePath.replace(/\.ts$/, ".js");
  else return filePath;

  fs.renameSync(filePath, newPath);
  return newPath;
}

// Rekursif scan folder
function walkFolder(folder) {
  if (!fs.existsSync(folder)) return;
  const files = fs.readdirSync(folder);

  for (const file of files) {
    const fullPath = path.join(folder, file);
    if (!fs.existsSync(fullPath)) continue;
    const stat = fs.statSync(fullPath);

    // ❌ skip folder yang tidak perlu
    if (
      stat.isDirectory() &&
      !["node_modules", ".next", "dist", "build", "out"].includes(file)
    ) {
      walkFolder(fullPath);
    } else if (
      stat.isFile() &&
      (file.endsWith(".ts") || file.endsWith(".tsx")) &&
      !file.endsWith(".d.ts") // ⛔ skip deklarasi
    ) {
      try {
        console.log("🔧 Processing:", fullPath);
        const isTSX = file.endsWith(".tsx");
        let content = fs.readFileSync(fullPath, "utf-8");
        content = removeTypes(content, isTSX);
        fs.writeFileSync(fullPath, content, "utf-8");
        renameFile(fullPath);
      } catch (err) {
        console.warn("⚠️ Skip (parse error):", fullPath);
      }
    }
  }
}

// Jalankan konversi pada semua folder
for (const folder of FOLDERS) {
  if (fs.existsSync(folder)) walkFolder(folder);
  else console.warn("⚠️ Folder not found:", folder);
}

// Konversi next.config.ts → next.config.js
const nextConfigTS = path.join(ROOT, "next.config.ts");
if (fs.existsSync(nextConfigTS)) {
  console.log("⚙️ Converting next.config.ts...");
  let content = fs.readFileSync(nextConfigTS, "utf-8");
  content = removeTypes(content, false);
  fs.writeFileSync(nextConfigTS, content, "utf-8");
  renameFile(nextConfigTS);
}

console.log("✅ Conversion TS/TSX → JS/JSX selesai!");
