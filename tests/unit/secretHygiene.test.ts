import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { expect, it } from "vitest";

it("contains no credential literals in configuration, project/preferences samples or test fixtures", () => {
  const roots = ["config", "tests"];
  const credential = /(?:sk-(?:proj-)?[A-Za-z0-9_-]{24,}|gh[pousr]_[A-Za-z0-9]{24,}|Bearer\s+[A-Za-z0-9._-]{24,})/;
  const visit = (directory: string) => {
    for (const entry of readdirSync(directory, {withFileTypes: true})) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else expect(credential.test(readFileSync(file, "utf8")), file).toBe(false);
    }
  };
  roots.forEach(visit);
});
