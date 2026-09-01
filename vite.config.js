import {defineConfig} from 'vite';
import {cpSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';

const copyStoryContent = () => ({
  name: 'copy-story-content',
  closeBundle() {
    const source = resolve('content');
    if (existsSync(source)) cpSync(source, resolve('dist/content'), {recursive: true});
  }
});

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  base: './',
  define: {global: 'globalThis'},
  plugins: [copyStoryContent()],
  build: {outDir: '../dist', emptyOutDir: true}
});
