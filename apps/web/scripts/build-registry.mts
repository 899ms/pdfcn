import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import ts from "typescript";

interface RegistryFile {
  path: string;
  target: string;
}
interface RegistryItem {
  name: string;
  files: RegistryFile[];
  dependencies?: string[];
  registryDependencies?: string[];
}
type PublishedFile = RegistryFile & { content: string };
type PublishedItem = Omit<RegistryItem, "files"> & { files: PublishedFile[] };

const root = path.resolve(import.meta.dirname, "..");

// Build the source registry before fixing import paths in its installable JSON.
execFileSync("shadcn", ["build"], { cwd: root, stdio: "inherit" });

const registry = JSON.parse(
  await readFile(path.join(root, "registry.json"), "utf-8")
) as { items: RegistryItem[] };
const targets = new Map<string, string>();
const publishedItems = new Map<string, PublishedItem>();

for (const item of registry.items) {
  for (const file of item.files) {
    const existing = targets.get(file.path);
    if (existing && existing !== file.target) {
      throw new Error(`Conflicting destinations for ${file.path}`);
    }
    targets.set(file.path, file.target);
  }
}

const resolveSource = (importPath: string) => {
  const source = importPath.slice(2);
  for (const candidate of [
    source,
    `${source}.ts`,
    `${source}.tsx`,
    `${source}/index.ts`,
    `${source}/index.tsx`,
  ]) {
    if (targets.has(candidate)) {
      return targets.get(candidate);
    }
  }
  throw new Error(`No registry destination for ${importPath}`);
};

let rewritten = 0;
for (const item of registry.items) {
  const output = path.join(root, "public/r", `${item.name}.json`);
  const published = JSON.parse(
    await readFile(output, "utf-8")
  ) as PublishedItem;

  for (const file of published.files ?? []) {
    const source = ts.createSourceFile(
      file.path,
      file.content,
      ts.ScriptTarget.Latest,
      true
    );
    const replacements: { start: number; end: number; value: string }[] = [];
    const visit = (node: ts.Node) => {
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier) &&
        node.moduleSpecifier.text.startsWith("@/registry/")
      ) {
        replacements.push({
          end: node.moduleSpecifier.getEnd() - 1,
          start: node.moduleSpecifier.getStart(source) + 1,
          value: `@/${resolveSource(node.moduleSpecifier.text)}`.replace(
            /\.(tsx?|jsx?)$/,
            ""
          ),
        });
      }
      ts.forEachChild(node, visit);
    };
    visit(source);

    for (const { start, end, value } of replacements.toReversed()) {
      file.content =
        file.content.slice(0, start) + value + file.content.slice(end);
      rewritten += 1;
    }
  }
  publishedItems.set(item.name, published);

  await writeFile(output, `${JSON.stringify(published, null, 2)}\n`);
}

for (const item of registry.items) {
  const installed = new Map();
  const packages = new Set();
  const pending = [item.name];
  const visited = new Set();

  while (pending.length) {
    const name = pending.pop() as string;
    if (visited.has(name)) {
      continue;
    }
    visited.add(name);
    const dependency = publishedItems.get(name);
    if (!dependency) {
      throw new Error(`${item.name}: missing registry dependency ${name}`);
    }

    for (const file of dependency.files ?? []) {
      const previous = installed.get(file.target);
      if (previous && previous !== file.content) {
        throw new Error(
          `${item.name}: conflicting installed file ${file.target}`
        );
      }
      installed.set(file.target, file.content);
    }
    for (const pkg of dependency.dependencies ?? []) {
      packages.add(pkg);
    }
    for (const ref of dependency.registryDependencies ?? []) {
      if (!ref.startsWith("@pdfcn/")) {
        throw new Error(`${name}: unexpected registry dependency ${ref}`);
      }
      pending.push(ref.slice("@pdfcn/".length));
    }
  }

  for (const [filename, content] of installed) {
    const source = ts.createSourceFile(
      filename,
      content,
      ts.ScriptTarget.Latest,
      true
    );
    const visit = (node: ts.Node) => {
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        const specifier = node.moduleSpecifier.text;
        if (specifier.startsWith("@/") || specifier.startsWith(".")) {
          const base = specifier.startsWith("@/")
            ? specifier.slice(2)
            : path.posix.join(path.posix.dirname(filename), specifier);
          if (
            ![
              base,
              `${base}.ts`,
              `${base}.tsx`,
              `${base}/index.ts`,
              `${base}/index.tsx`,
            ].some((candidate) => installed.has(candidate))
          ) {
            throw new Error(
              `${item.name}: ${filename} imports missing ${specifier}`
            );
          }
        } else if (!specifier.startsWith("node:")) {
          const pkg = specifier.startsWith("@")
            ? specifier.split("/").slice(0, 2).join("/")
            : specifier.split("/")[0];
          if (!["react", "react-dom"].includes(pkg) && !packages.has(pkg)) {
            throw new Error(
              `${item.name}: ${filename} requires undeclared package ${pkg}`
            );
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
}

console.log(
  `Validated isolated install closure for ${registry.items.length} items.`
);
console.log(
  `Rewrote ${rewritten} registry imports in ${registry.items.length} items.`
);
