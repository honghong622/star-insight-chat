import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "allaboutastro",
  brand: {
    displayName: "allaboutastro",
    primaryColor: "#3182F6",
    icon: null,
  },
  web: {
    host: "localhost",
    port: 8080,
    commands: {
      dev: "vite --host 0.0.0.0 --port 8080",
      build: "vite build",
    },
  },
  permissions: [],
  outdir: "dist",
});
