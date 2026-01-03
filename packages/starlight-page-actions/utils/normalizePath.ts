import path from "node:path";

const windowsSlashRE = /\\/g;

const slash = (p: string): string => {
  return p.replace(windowsSlashRE, "/");
};

export const normalizePath = (p: string): string => {
  const isWindows: boolean =
    typeof process !== "undefined" && process.platform === "win32";

  return path.posix.normalize(isWindows ? slash(p) : p);
};
