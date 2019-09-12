import babel from "rollup-plugin-babel";
import nodeResolve from "rollup-plugin-node-resolve";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default {
  input: "src/index.ts",
  plugins: [
    nodeResolve({
      extensions: [".ts"]
    }),
    babel({
      extensions,
      exclude: "node_modules/**"
    })
  ],
  output: [
    {
      name: "objectbuffer",
      file: "dist/objectbuffer.umd.js",
      format: "umd"
    },
    {
      file: "dist/objectbuffer.cjs.js",
      format: "cjs"
    },
    {
      file: "dist/objectbuffer.esm.js",
      format: "esm"
    }
  ]
};
