import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/web2-course-project-front-end-NolanWeemaels/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        auth: resolve(__dirname, "auth.html"),
        race: resolve(__dirname, "race.html"),
        results: resolve(__dirname, "results.html"),
        rules: resolve(__dirname, "rules.html"),
        trackGalmaarden: resolve(__dirname, "track-galmaarden.html"),
        trackKnokke: resolve(__dirname, "track-knokke.html"),
        trackBrussel: resolve(__dirname, "track-brussel.html"),
      },
    },
  },
});