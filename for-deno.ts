// import { createObjectBuffer } from "./dist/objectbuffer.esm.js";
import { createObjectBuffer } from "https://cdn.pika.dev/@bnaya/objectbuffer@^0.20.0";

const ob = createObjectBuffer(
  {},
  1024,
  {
    message: "Hello Deno! 🦕",
  },
  {}
);

console.log(ob.message);
