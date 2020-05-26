/* eslint-env node */

import * as fs from "fs";
import * as path from "path";
import { generateFunctionsCodeForManifest } from "./finenamenotmatter";
import {
  numberStructDeceleration,
  dateStructDeclaration,
  arrayStructDeclaration,
  objectMapSetStructDeclaration,
  bigIntPositiveOrNegativeStructDeclaration,
  stringStructDeclaration,
  typeReaderDeclaration,
  typeAndRcDeclaration,
  linkedListDeclaration,
  linkedListItemDeclaration,
} from "./declarations";

const number = generateFunctionsCodeForManifest(
  "number",
  numberStructDeceleration
);

const bigint = generateFunctionsCodeForManifest(
  "bigint",
  bigIntPositiveOrNegativeStructDeclaration
);

const date = generateFunctionsCodeForManifest("date", dateStructDeclaration);
const array = generateFunctionsCodeForManifest("array", arrayStructDeclaration);
const object = generateFunctionsCodeForManifest(
  "object",
  objectMapSetStructDeclaration
);

const string = generateFunctionsCodeForManifest(
  "string",
  stringStructDeclaration
);

const typeOnly = generateFunctionsCodeForManifest(
  "typeOnly",
  typeReaderDeclaration
);
const typeAndRc = generateFunctionsCodeForManifest(
  "typeAndRc",
  typeAndRcDeclaration
);

const linkedListItem = generateFunctionsCodeForManifest(
  "linkedListItem",
  linkedListItemDeclaration
);

const linkedList = generateFunctionsCodeForManifest(
  "linkedList",
  linkedListDeclaration
);

const all = [
  `/** Generate code. don't try to edit manually **/`,
  `/* istanbul ignore file */`,
  `import type { Heap } from "../structsGenerator/consts"`,
  ...number,
  ...bigint,
  ...date,
  ...array,
  ...object,
  ...string,
  ...typeOnly,
  ...typeAndRc,
  ...linkedList,
  ...linkedListItem,
];

fs.writeFileSync(
  path.resolve(__dirname, "../internal", "generatedStructs.ts"),
  all.join("\n")
);
