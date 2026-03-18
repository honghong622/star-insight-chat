import { defineConfig } from "@apps-in-toss/web-framework";

export default defineConfig({
  appName: "allaboutastro",
  build: {
    command: "npm run build",
    output: "dist",
  },
});

