import { defineConfig } from 'tsup';
import fs from 'node:fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

export default defineConfig({
    entry: ['server/src/index.ts'],
    format: ['esm'],
    outDir: 'dist-server',
    clean: true,
    external: Object.keys(pkg.dependencies || {}),
    target: 'node18',
});
