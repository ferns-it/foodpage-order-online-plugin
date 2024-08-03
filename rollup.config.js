import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { babel } from "@rollup/plugin-babel";
import image from "@rollup/plugin-image";
import json from '@rollup/plugin-json';
// import { uglify } from "rollup-plugin-uglify";
// import uglify from "@lopatnov/rollup-plugin-uglify";
// const packageJson = require('./package.json')

export default [
  {
    input: "./src/index.jsx",
    output: [
      {
        file: "./dist/index.js",
        format: "cjs",
        sourcemap: false,
      },
      {
        file: "./dist/index.es.js",
        format: "es",
        exports: "named",
      },
    ],
    external: ["react", "react-dom"],
    plugins: [
      peerDepsExternal(),
      nodeResolve({
        extensions: [".js", ".jsx"],
        preferBuiltins: false,
      }),
      image(),
      commonjs(),
      terser(),
      postcss({
        plugins: [],
        minimize: true,
        extract: "style.css",
      }),
      json(),
      babel({
        // presets: ["@babel/preset-env", "@babel/preset-react"],
        // extensions: ['.js', '.jsx']
        configFile: "./.babelrc",
        babelHelpers: "bundled",
        exclude: "node_modules/**",
      }),
      // uglify()
    ],
  },
];
