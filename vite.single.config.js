// Builds the whole app into one self-contained dist-single/index.html
// (handy for sharing the demo as a single file or hosting it anywhere).
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'dist-single' },
});
