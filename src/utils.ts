import path from "path";

export function getCurrentDirName () {
  const cwd = process.cwd();
  const dirname = path.dirname(cwd);
  return cwd.slice(dirname.length + 1)
}