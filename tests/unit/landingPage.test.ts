import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const landingHtml = readFileSync(join(projectRoot, "docs", "index.html"), "utf8");
const rootDocumentationFiles = [
  "README.md",
  "ISTRUZIONI.md",
  "INSTRUCTIONS.md",
  "SECURITY_MODEL.md",
  "AGENTS.md",
  "MAP.md",
  "PLAN.md"
].map((relativePath) => join(projectRoot, relativePath));

function filesUnder(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(entryPath) : [entryPath];
  });
}

const documentationFiles = [...rootDocumentationFiles, ...filesUnder(join(projectRoot, "docs"))];

describe("landing page links", () => {
  it("uses the custom domain as its canonical URL", () => {
    expect(landingHtml).toContain(
      '<link rel="canonical" href="https://truedrawing.glaucosilvestri.it/" />'
    );
  });

  it("links the header home icon to the personal homepage", () => {
    expect(landingHtml).toContain('href="https://glaucosilvestri.it/"');
    expect(landingHtml).toContain("data-home-link");
  });

  it("keeps the download link valid before and after a release", () => {
    expect(landingHtml).toContain(
      'href="https://github.com/gloutchov/truedrawing/releases/latest"'
    );
  });

  it("does not reference the default GitHub Pages domain", () => {
    for (const filePath of documentationFiles) {
      const contents = readFileSync(filePath, "utf8");
      expect(contents, relative(projectRoot, filePath)).not.toMatch(/(?:github\.io|pages\.github)/i);
    }
  });
});
