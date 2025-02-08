import { dirname } from "path";
import { fileURLToPath } from "url";

export function getScriptDir(importMetaUrl: string): string {
  return dirname(fileURLToPath(importMetaUrl));
}
