const typescript = require('@rollup/plugin-typescript');
const pkg = require("./package.json");
const path = require("path");

const sourcemapPathTransform = (relativeSourcePath, sourcemapPath) => {
  return path.relative(__dirname, path.resolve(path.dirname(sourcemapPath), relativeSourcePath));
};

module.exports = {
  input: "./src/index.ts",
  plugins: [
    typescript({
      tsconfig: "tsconfig.json",
    }),
  ],
  output: [
    // ES module (for bundlers) build.
    {
      format: "esm",
      file: pkg.module,
      exports: "default",
      sourcemap: true,
      sourcemapExcludeSources: false,
      sourcemapPathTransform,
    },
    // CommonJS (for Node) build.
    {
      format: "cjs",
      file: pkg.main,
      exports: "default",
      sourcemap: true,
      sourcemapExcludeSources: false,
      sourcemapPathTransform,
    },
  ],
};
