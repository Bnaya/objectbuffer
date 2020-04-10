/* eslint-env jest */
import {
  layoutDeclarationToMemoryMap,
  createMemoryOperator,
  _buildMemoryLayout,
} from "./memoryMachinery";
import { arrayBuffer2HexArray, makeCarrier } from "./testUtils";

describe("memory manifest", () => {
  test("LayoutDeclarationToMemoryMap", () => {
    const input = {
      Uint16: Uint16Array,
      Uint32: Uint32Array,
      Uint8: Uint8Array,
    };

    const r = layoutDeclarationToMemoryMap(input);
    expect(r).toMatchInlineSnapshot(`
      Object {
        "SIZE_OF": 7,
        "Uint16": Object {
          "bytesOffset": 0,
          "type": [Function],
        },
        "Uint32": Object {
          "bytesOffset": 2,
          "type": [Function],
        },
        "Uint8": Object {
          "bytesOffset": 6,
          "type": [Function],
        },
      }
    `);

    expect(
      Object.entries(r)
        .filter(([key]) => key !== "SIZE_OF")
        .map((entry) => [
          entry[0],
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          entry[1].type,
        ])
    ).toEqual(Object.entries(input));
  });

  test("createMemoryOperator.set", () => {
    const memoryMap = layoutDeclarationToMemoryMap({
      POINTER_TO_NODE: Uint32Array,
      LENGTH_OF_KEY: Uint32Array,
    });

    const ab = new ArrayBuffer(memoryMap.SIZE_OF + 48);
    const carrier = makeCarrier(ab);

    const operator = createMemoryOperator(memoryMap, carrier, 0);

    operator.set("POINTER_TO_NODE", 9);
    operator.set("LENGTH_OF_KEY", 5);

    expect(arrayBuffer2HexArray(ab)).toMatchInlineSnapshot(`
      Array [
        "0x09",
        "0x00",
        "0x00",
        "0x00",
        "0x05",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x28",
        "0x00",
        "0x00",
        "0x00",
        "0x38",
        "0x00",
        "0x00",
        "0x00",
        "0x08",
        "0x00",
        "0x00",
        "0x00",
        "0x03",
        "0x00",
        "0x00",
        "0x00",
        "0x10",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
      ]
    `);

    operator.set("POINTER_TO_NODE", 0);

    expect(arrayBuffer2HexArray(ab)).toMatchInlineSnapshot(`
Array [
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x05",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x28",
  "0x00",
  "0x00",
  "0x00",
  "0x38",
  "0x00",
  "0x00",
  "0x00",
  "0x08",
  "0x00",
  "0x00",
  "0x00",
  "0x03",
  "0x00",
  "0x00",
  "0x00",
  "0x10",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
]
`);
  });

  test("createMemoryOperator.get", () => {
    const memoryMap = layoutDeclarationToMemoryMap({
      POINTER_TO_NODE: Uint32Array,
      LENGTH_OF_KEY: Uint32Array,
    });

    const ab = new ArrayBuffer(memoryMap.SIZE_OF + 48);
    const carrier = makeCarrier(ab);

    const operator = createMemoryOperator(memoryMap, carrier, 0);

    operator.set("POINTER_TO_NODE", 9);
    operator.set("LENGTH_OF_KEY", 1000);

    expect(operator.get("LENGTH_OF_KEY")).toMatchInlineSnapshot(`1000`);
  });
});

test("buildMemoryLayout", () => {
  const memoryLayout = _buildMemoryLayout({
    NODE_VALUE_POINTER: Uint32Array.BYTES_PER_ELEMENT,
    MODE_NEXT_BUCKET_NODE_POINTER: Uint32Array.BYTES_PER_ELEMENT,
    NODE_KEY_POINTER: Uint32Array.BYTES_PER_ELEMENT,
    NODE_KEY_LENGTH: Uint16Array.BYTES_PER_ELEMENT,
  });

  expect(memoryLayout).toMatchInlineSnapshot(`
    Object {
      "MODE_NEXT_BUCKET_NODE_POINTER": 4,
      "NODE_KEY_LENGTH": 12,
      "NODE_KEY_POINTER": 8,
      "NODE_VALUE_POINTER": 0,
      "TOTAL_SIZE": 14,
    }
  `);
});
