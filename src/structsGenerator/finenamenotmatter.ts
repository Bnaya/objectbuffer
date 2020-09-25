import {
  StructManifest,
  typedArrayNameToHeapProp,
  TypedArrayPropNameToCtorType,
  typedArraysPropNameToCtorMap,
} from "./consts";

export function createStructDeclaration<T extends StructManifest>(
  manifest: T
): T {
  validateAlignment(manifest);
  validateNames(manifest);
  return manifest;
}

function validateNames(manifest: StructManifest) {
  if (new Set(Object.keys(manifest)).size !== Object.keys(manifest).length) {
    throw new Error("duplicate manifest fields");
  }
}

export function validateAlignment(manifest: StructManifest) {
  const arr = Object.values(manifest);

  let locationInStruct = 0;
  for (let i = 0; i < arr.length; i++) {
    if (locationInStruct % arr[i].BYTES_PER_ELEMENT) {
      throw new Error("struct is unaligned");
    }

    locationInStruct += arr[i].BYTES_PER_ELEMENT;
  }
}

export function generateFunctionsCodeForManifest(
  structName: string,
  manifest: StructManifest
) {
  let startInStruct = 0;
  const functions: string[] = [
    "\n",
    `/** --- struct ${structName} start --- **/`,
  ];

  for (const [propName, TypedArray] of Object.entries(manifest)) {
    functions.push(
      getTemplate(
        structName,
        propName,
        typedArrayNameToHeapProp[TypedArray.name as any],
        startInStruct
      ),
      setTemplate(
        structName,
        propName,
        typedArrayNameToHeapProp[TypedArray.name as any],
        startInStruct
      ),
      `export const ${structName}_${propName}_place = ${startInStruct};`,
      `export const ${structName}_${propName}_ctor = ${TypedArray.name};`
    );
    startInStruct += TypedArray.BYTES_PER_ELEMENT;
  }

  functions.push(
    setAllTemplate(structName, manifest),
    `
    export const ${structName}_size = ${startInStruct};
  `,
    `/** --- struct ${structName} end --- **/`
  );

  return functions;
}

function getTemplate(
  structName: string,
  propName: string,
  typedArrayName: keyof TypedArrayPropNameToCtorType,
  startPointerInsideOfStruct: number
) {
  return `
  export function ${structName}_${propName}_get(heap: Heap, structPointer: number) {
    return heap.${typedArrayName}[(
          structPointer + ${startPointerInsideOfStruct}
          ) / ${typedArraysPropNameToCtorMap[typedArrayName].BYTES_PER_ELEMENT}];
  }
  `;
}

function setTemplate(
  structName: string,
  propName: string,
  typedArrayName: keyof TypedArrayPropNameToCtorType,
  startPointerInsideOfStruct: number
) {
  const valueType =
    typedArrayName === "b64" || typedArrayName === "u64" ? "bigint" : "number";

  return `
  export function ${structName}_${propName}_set(heap: Heap, structPointer: number, value: ${valueType}) {
    return heap.${typedArrayName}[(
          structPointer + ${startPointerInsideOfStruct}
          ) / ${typedArraysPropNameToCtorMap[typedArrayName].BYTES_PER_ELEMENT}] = value;
  }
  `;
}

function setAllTemplate(structName: string, manifest: StructManifest) {
  const args: Array<[string, string]> = [
    ["heap", "Heap"],
    ["structPointer", "number"],
  ];

  const propsArgs = Object.entries(manifest).map(([prop, ctor]): [
    string,
    string
  ] => {
    const valueType =
      ctor.name === "BigInt64Array" || ctor.name === "BigUint64Array"
        ? "bigint"
        : "number";

    return [prop, valueType];
  });

  const allArgs = [...args, ...propsArgs];
  const argsAsString = allArgs.map((a) => a.join(": ")).join(", ");

  const functionName = `${structName}_set_all`;

  const setValues: string[] = [];

  let startPointerInsideOfStruct = 0;
  for (const [paramName, ctor] of Object.entries(manifest)) {
    const typedArrayName = typedArrayNameToHeapProp[ctor.name];
    const BYTES_PER_ELEMENT: number =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      typedArraysPropNameToCtorMap[typedArrayName].BYTES_PER_ELEMENT;
    setValues.push(
      `heap.${typedArrayName}[(
      structPointer + ${startPointerInsideOfStruct}
      ) / ${BYTES_PER_ELEMENT}] = ${paramName};`
    );

    startPointerInsideOfStruct += ctor.BYTES_PER_ELEMENT;
  }

  return `
  export function ${functionName}(${argsAsString}) {
    ${setValues.join("\n")}
  }
  `;
}
