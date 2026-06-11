import { describe, expect, it } from "vitest";

import viteConfig from "../../vite.config";

describe("viteConfig", () => {
  it("uses relative asset URLs for packaged Electron file loading", () => {
    expect(viteConfig).toMatchObject({
      base: "./"
    });
  });
});
