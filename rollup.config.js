import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default {
  input: "src/index.ts",
  plugins: [
    nodeResolve({
      extensions: [".ts"],
    }),
    babel({
      extensions,
      exclude: "node_modules/**",
    }),
    terser({
      compress: {
        inline: 3,
        // passes: 3,
      },
      mangle: false,
      toplevel: true,
      module: true,
      output: {
        beautify: true,
      },
      keep_classnames: true,
    }),
  ],
  output: [
    {
      name: "objectbuffer",
      file: "dist/objectbuffer.umd.js",
      sourcemap: true,
      format: "umd",
    },
    {
      file: "dist/objectbuffer.cjs.js",
      sourcemap: true,
      format: "cjs",
    },
    {
      file: "dist/objectbuffer.esm.js",
      sourcemap: true,
      format: "esm",
    },
  ],
};
