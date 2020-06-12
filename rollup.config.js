import * as fs from "fs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import svelte from "rollup-plugin-svelte";
import copy from "rollup-plugin-copy";
import resolve from "@rollup/plugin-node-resolve";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from "rollup-plugin-node-polyfills";

const production = !process.env.ROLLUP_WATCH;
const dedupe = importee =>
  importee === "svelte" || importee.startsWith("svelte/");

export default {
  input: "src/index.js",
  output: {
    file: "build/bundle.js",
    format: "iife"
  },
  plugins: [
    replace({
      __buildEnv__: JSON.stringify({
        production,
        date: new Date()
      })
    }),
    copy({ targets: [{ src: "public/index.html", dest: "build" }] }),
    svelte({
      css: css => css.write("build/bundle.css")
    }),
    json(),
    nodePolyfills(),
    // rollup-plugin-node-resolve embeds external dependecies in the bundle,
    // more info here:
    // https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
    resolve({ browser: true, dedupe }),
    commonjs(),
    // https://github.com/thgh/rollup-plugin-serve
    !production &&
      serve({ contentBase: "build", open: true, host: "0.0.0.0", port: 4000 }),
    !production && livereload("build"),
    production && terser()
  ],
  watch: {
    clearScreen: true,
    chokidar: {
      usePolling: true
    }
  }
};
