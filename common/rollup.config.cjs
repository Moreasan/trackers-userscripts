const typescript = require('@rollup/plugin-typescript');
const path = require("path");

const sourcemapPathTransform = (relativeSourcePath, sourcemapPath) => {
  return path.relative(__dirname, path.resolve(path.dirname(sourcemapPath), relativeSourcePath));
};

module.exports = {
  input: {
    'http/index': 'src/http/index.ts',
    'dom/index': 'src/dom/index.ts',
    'trackers/index': 'src/trackers/index.ts',
    'searcher/index': 'src/searcher/index.ts',
    'logger/index': 'src/logger/index.ts',
  },
  plugins: [
    typescript({
      tsconfig: "tsconfig.json",
    }),
  ],
  output: [
    // ES module (for bundlers) build.
    {
      format: "esm",
      dir: "dist",
      entryFileNames: '[name].mjs',
      exports: "named",
      sourcemap: true,
      sourcemapExcludeSources: false,
      sourcemapPathTransform,
    },
  ],
};
