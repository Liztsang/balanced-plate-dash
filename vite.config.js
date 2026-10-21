import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Works for a repository named "balanced-plate-dash" on GitHub Pages.
  // Change this if you rename the repository.
  base: "/balanced-plate-dash/",
});
