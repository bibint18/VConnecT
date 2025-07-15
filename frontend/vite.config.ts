import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ["pdfmake", "pdfmake/build/vfs_fonts", "html2canvas", "xlsx", "file-saver"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "pdfmake/build/vfs_fonts": "pdfmake/build/vfs_fonts.js",
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
  }
});
