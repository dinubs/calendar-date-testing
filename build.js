const esbuild = require('esbuild');

const isDev = process.argv.includes('--dev');

const buildConfig = {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  platform: 'browser',
  target: 'es2020',
  minify: !isDev,
  sourcemap: isDev,
};

if (isDev) {
  esbuild.context(buildConfig).then(async (ctx) => {
    await ctx.watch();
    console.log('Watching for changes...');
  }).catch(() => process.exit(1));
} else {
  esbuild.build(buildConfig).then(() => {
    console.log('Build complete');
  }).catch(() => process.exit(1));
}