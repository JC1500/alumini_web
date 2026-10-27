import { existsSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { registerHooks } from "node:module";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const extensions = [".ts", ".mts", ".js", ".mjs"];

function resolveFile(specifier, parentDirectory) {
  const basePath = resolve(parentDirectory, specifier);

  for (const extension of extensions) {
    const candidate = `${basePath}${extension}`;

    if (existsSync(candidate)) {
      return candidate;
    }
  }

  for (const extension of extensions) {
    const candidate = resolve(basePath, `index${extension}`);

    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.conditions?.includes("require")) {
      return nextResolve(specifier, context);
    }

    let targetPath = null;

    if (specifier.startsWith("@/")) {
      targetPath = resolveFile(specifier.slice(2), projectRoot);
    } else if (
      specifier.startsWith(".") &&
      !extname(specifier) &&
      context.parentURL?.startsWith("file:")
    ) {
      const parentDirectory = dirname(fileURLToPath(context.parentURL));
      targetPath = resolveFile(specifier, parentDirectory);
    }

    if (targetPath) {
      return nextResolve(pathToFileURL(targetPath).href, context);
    }

    return nextResolve(specifier, context);
  },
});
