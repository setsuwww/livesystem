#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const jscodeshift = require("jscodeshift");

// Folder yang akan di-scan
const FOLDERS = ["./app", "./components", "./lib", "./hooks", "./static", "./prisma", "./function", "./constants"];

// Fungsi hapus semua type annotations, interface, type alias, as Type
function removeTypes(fileContent, isTSX) {
  const j = jscodeshift.withParser(isTSX ? "tsx" : "ts");
  const root = j(fileContent);

  // hapus type annotations
  root.find(j.TSTypeAnnotation).remove();

  // hapus interface / type alias
  root.find(j.TSInterfaceDeclaration).remove();
  root.find(j.TSTypeAliasDeclaration).remove();

  // hapus cast 'as Type'
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

// Scan folder rekursif
function walkFolder(folder) {
  if (!fs.existsSync(folder)) return;
  const files = fs.readdirSync(folder);
  files.forEach(file => {
    const fullPath = path.join(folder, file);
    if (!fs.existsSync(fullPath)) return; // ✅ skip kalau file hilang
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkFolder(fullPath);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      console.log("Processing:", fullPath);
      const isTSX = file.endsWith(".tsx");
      let content = fs.readFileSync(fullPath, "utf-8");
      content = removeTypes(content, isTSX);
      fs.writeFileSync(fullPath, content, "utf-8");
      renameFile(fullPath);
    }
  });
}


// Update import paths dari .ts/.tsx ke .js/.jsx
function updateImports(filePath, oldName, newName) {
  FOLDERS.forEach(folder => {
    if (!fs.existsSync(folder)) return;
    const files = fs.readdirSync(folder);
    files.forEach(f => {
      const full = path.join(folder, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walkFolder(full);
      } else if (full.endsWith(".js") || full.endsWith(".jsx")) {
        let content = fs.readFileSync(full, "utf-8");
        const regex = new RegExp(`(\\./.*${oldName.replace(".", "\\.")})`, "g");
        content = content.replace(regex, newName);
        fs.writeFileSync(full, content, "utf-8");
      }
    });
  });
}

// Run script
FOLDERS.forEach(folder => {
  if (fs.existsSync(folder)) walkFolder(folder);
  else console.warn("Folder not found:", folder);
});

console.log("✅ Conversion TS/TSX → JS/JSX selesai!");
