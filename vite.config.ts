import { defineConfig } from "vitest/config";
import tsconfigPath from "vite-tsconfig-paths";

export const config = defineConfig({
	plugins: [tsconfigPath()],
});
