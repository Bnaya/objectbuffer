let ENTRY_TYPE;

!function(ENTRY_TYPE) {
    ENTRY_TYPE[ENTRY_TYPE.NUMBER = 2] = "NUMBER", ENTRY_TYPE[ENTRY_TYPE.BIGINT_POSITIVE = 3] = "BIGINT_POSITIVE", 
    ENTRY_TYPE[ENTRY_TYPE.BIGINT_NEGATIVE = 4] = "BIGINT_NEGATIVE", ENTRY_TYPE[ENTRY_TYPE.STRING = 5] = "STRING", 
    ENTRY_TYPE[ENTRY_TYPE.OBJECT = 7] = "OBJECT", ENTRY_TYPE[ENTRY_TYPE.ARRAY = 9] = "ARRAY", 
    ENTRY_TYPE[ENTRY_TYPE.MAP = 11] = "MAP", ENTRY_TYPE[ENTRY_TYPE.SET = 12] = "SET", 
    ENTRY_TYPE[ENTRY_TYPE.DATE = 13] = "DATE";
}(ENTRY_TYPE || (ENTRY_TYPE = {}));

const INTERNAL_API_SYMBOL = Symbol("INTERNAL_API"), INITIAL_ENTRY_POINTER_TO_POINTER = 0 + Uint32Array.BYTES_PER_ELEMENT, ENDIANNESS_FLAG_POINTER = INITIAL_ENTRY_POINTER_TO_POINTER + Uint32Array.BYTES_PER_ELEMENT;

let ENDIANNESS;

!function(ENDIANNESS) {
    ENDIANNESS[ENDIANNESS.BIG = 0] = "BIG", ENDIANNESS[ENDIANNESS.LITTLE = 1] = "LITTLE";
}(ENDIANNESS || (ENDIANNESS = {}));

const TEMP_SAVE_POINTER = ENDIANNESS_FLAG_POINTER + Uint32Array.BYTES_PER_ELEMENT, INITIAL_ENTRY_POINTER_VALUE = TEMP_SAVE_POINTER + Uint32Array.BYTES_PER_ELEMENT, MEM_POOL_START = INITIAL_ENTRY_POINTER_VALUE + Uint32Array.BYTES_PER_ELEMENT, MAX_64_BIG_INT = BigInt("0xFFFFFFFFFFFFFFFF");

function getEndiannessOfSystem() {
    const F64 = new Float64Array(1), U32 = new Uint32Array(F64.buffer);
    return F64[0] = 2, 1073741824 === U32[1] ? ENDIANNESS.LITTLE : ENDIANNESS.BIG;
}

function getOurPointerIfApplicable(value, ourAllocator) {
    if (INTERNAL_API_SYMBOL in value) {
        const api = getInternalAPI(value);
        if (api.getCarrier().allocator === ourAllocator) return api.getEntryPointer();
    }
}

function externalArgsApiToExternalArgsApi(p) {
    return {
        ...p,
        hashMapMinInitialCapacity: p.hashMapMinInitialCapacity ? p.hashMapMinInitialCapacity : 8,
        hashMapLoadFactor: p.hashMapLoadFactor ? p.hashMapLoadFactor : .75,
        arrayAdditionalAllocation: p.arrayAdditionalAllocation ? p.arrayAdditionalAllocation : 0
    };
}

function getInternalAPI(value) {
    if (!value[INTERNAL_API_SYMBOL]) throw new RangeError("getInternalAPI not applicable");
    return value[INTERNAL_API_SYMBOL];
}

function isKnownAddressValuePointer(entryPointer) {
    return 0 === entryPointer || 1 === entryPointer || 2 === entryPointer || 3 === entryPointer;
}

function number_value_get(heap, structPointer) {
    return heap.Float64Array[(structPointer + 8) / 8];
}

const number_value_ctor = Float64Array;

function number_set_all(heap, structPointer, type, value) {
    heap.Float64Array[(structPointer + 0) / 8] = type, heap.Float64Array[(structPointer + 8) / 8] = value;
}

function bigint_value_get(heap, structPointer) {
    return heap.BigUint64Array[(structPointer + 8) / 8];
}

function bigint_set_all(heap, structPointer, type, value) {
    heap.Float64Array[(structPointer + 0) / 8] = type, heap.BigUint64Array[(structPointer + 8) / 8] = value;
}

function date_set_all(heap, structPointer, type, refsCount, __padding__, timestamp) {
    heap.Float64Array[(structPointer + 0) / 8] = type, heap.Uint32Array[(structPointer + 8) / 4] = refsCount, 
    heap.Uint32Array[(structPointer + 12) / 4] = __padding__, heap.Float64Array[(structPointer + 16) / 8] = timestamp;
}

function array_dataspacePointer_get(heap, structPointer) {
    return heap.Uint32Array[(structPointer + 12) / 4];
}

function array_length_get(heap, structPointer) {
    return heap.Uint32Array[(structPointer + 16) / 4];
}

function array_length_set(heap, structPointer, value) {
    return heap.Uint32Array[(structPointer + 16) / 4] = value;
}

function array_set_all(heap, structPointer, type, refsCount, dataspacePointer, length, allocatedLength) {
    heap.Float64Array[(structPointer + 0) / 8] = type, heap.Uint32Array[(structPointer + 8) / 4] = refsCount, 
    heap.Uint32Array[(structPointer + 12) / 4] = dataspacePointer, heap.Uint32Array[(structPointer + 16) / 4] = length, 
    heap.Uint32Array[(structPointer + 20) / 4] = allocatedLength;
}

function object_pointerToHashMap_get(heap, structPointer) {
    return heap.Uint32Array[(structPointer + 12) / 4];
}

function object_set_all(heap, structPointer, type, refsCount, pointerToHashMap) {
    heap.Float64Array[(structPointer + 0) / 8] = type, heap.Uint32Array[(structPointer + 8) / 4] = refsCount, 
    heap.Uint32Array[(structPointer + 12) / 4] = pointerToHashMap;
}

function string_bytesLength_get(heap, structPointer) {
    return heap.Uint32Array[(structPointer + 12) / 4];
}

function string_charsPointer_get(heap, structPointer) {
    return heap.Uint32Array[(structPointer + 16) / 4];
}

function string_set_all(heap, structPointer, type, refsCount, bytesLength, charsPointer) {
    heap.Float64Array[(structPointer + 0) / 8] = type, heap.Uint32Array[(structPointer + 8) / 4] = refsCount, 
    heap.Uint32Array[(structPointer + 12) / 4] = bytesLength, heap.Uint32Array[(structPointer + 16) / 4] = charsPointer;
}

function typeOnly_type_get(heap, structPointer) {
    return heap.Float64Array[(structPointer + 0) / 8];
}

function typeAndRc_refsCount_get(heap, structPointer) {
    return heap.Uint32Array[(structPointer + 8) / 4];
}

function typeAndRc_refsCount_set(heap, structPointer, value) {
    return heap.Uint32Array[(structPointer + 8) / 4] = value;
}

function linkedList_END_POINTER_get(heap, structPointer) {
    return heap.Uint32Array[(structPointer + 0) / 4];
}

function linkedListItem_NEXT_POINTER_get(heap, structPointer) {
    return heap.Uint32Array[(structPointer + 0) / 4];
}

function linkedListItem_VALUE_get(heap, structPointer) {
    return heap.Uint32Array[(structPointer + 4) / 4];
}

function linkedListItem_set_all(heap, structPointer, NEXT_POINTER, VALUE) {
    heap.Uint32Array[(structPointer + 0) / 4] = NEXT_POINTER, heap.Uint32Array[(structPointer + 4) / 4] = VALUE;
}

function hashmap_ARRAY_POINTER_get(heap, structPointer) {
    return heap.Uint32Array[(structPointer + 0) / 4];
}

function hashmap_LINKED_LIST_POINTER_get(heap, structPointer) {
    return heap.Uint32Array[(structPointer + 4) / 4];
}

function hashmap_LINKED_LIST_SIZE_get(heap, structPointer) {
    return heap.Uint32Array[(structPointer + 8) / 4];
}

function hashmap_LINKED_LIST_SIZE_set(heap, structPointer, value) {
    return heap.Uint32Array[(structPointer + 8) / 4] = value;
}

function hashmap_CAPACITY_get(heap, structPointer) {
    return heap.Uint8Array[(structPointer + 12) / 1];
}

function hashmap_USED_CAPACITY_get(heap, structPointer) {
    return heap.Uint8Array[(structPointer + 13) / 1];
}

function hashmap_USED_CAPACITY_set(heap, structPointer, value) {
    return heap.Uint8Array[(structPointer + 13) / 1] = value;
}

function hashmapNode_VALUE_POINTER_get(heap, structPointer) {
    return heap.Uint32Array[(structPointer + 0) / 4];
}

function hashmapNode_NEXT_NODE_POINTER_get(heap, structPointer) {
    return heap.Uint32Array[(structPointer + 4) / 4];
}

function hashmapNode_NEXT_NODE_POINTER_set(heap, structPointer, value) {
    return heap.Uint32Array[(structPointer + 4) / 4] = value;
}

function hashmapNode_KEY_POINTER_get(heap, structPointer) {
    return heap.Uint32Array[(structPointer + 8) / 4];
}

function hashmapNode_LINKED_LIST_ITEM_POINTER_get(heap, structPointer) {
    return heap.Uint32Array[(structPointer + 12) / 4];
}

function hashmapNode_set_all(heap, structPointer, VALUE_POINTER, NEXT_NODE_POINTER, KEY_POINTER, LINKED_LIST_ITEM_POINTER) {
    heap.Uint32Array[(structPointer + 0) / 4] = VALUE_POINTER, heap.Uint32Array[(structPointer + 4) / 4] = NEXT_NODE_POINTER, 
    heap.Uint32Array[(structPointer + 8) / 4] = KEY_POINTER, heap.Uint32Array[(structPointer + 12) / 4] = LINKED_LIST_ITEM_POINTER;
}

function stringEncodeInto(uint8, from, str) {
    const strLen = str.length;
    let resPos = from - 1;
    for (let point = 0, nextCode = 0, i = 0; i !== strLen; ) {
        if (point = str.charCodeAt(i), i += 1, point >= 55296 && point <= 56319) {
            if (i === strLen) {
                uint8[resPos += 1] = 239, uint8[resPos += 1] = 191, uint8[resPos += 1] = 189;
                break;
            }
            if (nextCode = str.charCodeAt(i), !(nextCode >= 56320 && nextCode <= 57343)) {
                uint8[resPos += 1] = 239, uint8[resPos += 1] = 191, uint8[resPos += 1] = 189;
                continue;
            }
            if (point = 1024 * (point - 55296) + nextCode - 56320 + 65536, i += 1, point > 65535) {
                uint8[resPos += 1] = 240 | point >>> 18, uint8[resPos += 1] = 128 | point >>> 12 & 63, 
                uint8[resPos += 1] = 128 | point >>> 6 & 63, uint8[resPos += 1] = 128 | 63 & point;
                continue;
            }
        }
        point <= 127 ? uint8[resPos += 1] = 0 | point : point <= 2047 ? (uint8[resPos += 1] = 192 | point >>> 6, 
        uint8[resPos += 1] = 128 | 63 & point) : (uint8[resPos += 1] = 224 | point >>> 12, 
        uint8[resPos += 1] = 128 | point >>> 6 & 63, uint8[resPos += 1] = 128 | 63 & point);
    }
    return resPos + 1 - from;
}

function linkedListItemInsert(carrier, linkedListPointer, nodeValuePointer) {
    const {allocator: allocator, heap: heap} = carrier, newEndMarker = allocator.calloc(8);
    linkedListItem_set_all(heap, newEndMarker, 0, 0);
    const wasEndMarker = linkedList_END_POINTER_get(heap, linkedListPointer);
    return function linkedList_END_POINTER_set(heap, structPointer, value) {
        heap.Uint32Array[(structPointer + 0) / 4] = value;
    }(heap, linkedListPointer, newEndMarker), linkedListItem_set_all(heap, wasEndMarker, newEndMarker, nodeValuePointer), 
    wasEndMarker;
}

function stringLengthV2(str) {
    const strLen = str.length;
    let resPos = -1;
    for (let point = 0, nextCode = 0, i = 0; i !== strLen; ) {
        if (point = str.charCodeAt(i), i += 1, point >= 55296 && point <= 56319) {
            if (i === strLen) {
                resPos += 3;
                break;
            }
            if (nextCode = str.charCodeAt(i), !(nextCode >= 56320 && nextCode <= 57343)) {
                resPos += 3;
                continue;
            }
            if (point = 1024 * (point - 55296) + nextCode - 56320 + 65536, i += 1, point > 65535) {
                resPos += 4;
                continue;
            }
        }
        resPos += point <= 127 ? 1 : point <= 2047 ? 2 : 3;
    }
    return resPos + 1;
}

const helperFloatArray = new Float64Array(1), helperUint8Array = new Uint8Array(helperFloatArray.buffer);

function hashUint8CodeInPlace(uint8, keyStart, keyBytesLength) {
    let h = 0;
    for (let i = 0; i < keyBytesLength; i++) h = hashStep(h, uint8[i + keyStart]);
    return Math.abs(h);
}

function hashStep(h, v) {
    return Math.imul(31, h) + v | 0;
}

function createHashMap(carrier, initialCapacity = 10) {
    const {heap: heap, allocator: allocator} = carrier, hashMapMemory = allocator.calloc(14), arrayMemory = allocator.calloc(initialCapacity * Uint32Array.BYTES_PER_ELEMENT), linkedListPointer = function initLinkedList(carrier) {
        const {allocator: allocator, heap: heap} = carrier, memoryForLinkedList = allocator.calloc(8), memoryForEndMarkerItem = allocator.calloc(8);
        return function linkedList_set_all(heap, structPointer, END_POINTER, START_POINTER) {
            heap.Uint32Array[(structPointer + 0) / 4] = END_POINTER, heap.Uint32Array[(structPointer + 4) / 4] = START_POINTER;
        }(heap, memoryForLinkedList, memoryForEndMarkerItem, memoryForEndMarkerItem), memoryForLinkedList;
    }(carrier);
    return function hashmap_set_all(heap, structPointer, ARRAY_POINTER, LINKED_LIST_POINTER, LINKED_LIST_SIZE, CAPACITY, USED_CAPACITY) {
        heap.Uint32Array[(structPointer + 0) / 4] = ARRAY_POINTER, heap.Uint32Array[(structPointer + 4) / 4] = LINKED_LIST_POINTER, 
        heap.Uint32Array[(structPointer + 8) / 4] = LINKED_LIST_SIZE, heap.Uint8Array[(structPointer + 12) / 1] = CAPACITY, 
        heap.Uint8Array[(structPointer + 13) / 1] = USED_CAPACITY;
    }(heap, hashMapMemory, arrayMemory, linkedListPointer, 0, initialCapacity, 0), hashMapMemory;
}

function hashMapInsertUpdateKeyIsPointerReturnNode(externalArgs, carrier, mapPointer, keyPointer) {
    const {heap: heap, allocator: allocator} = carrier, memoryForNewNode = allocator.calloc(16);
    let keyDataMemoryStart, keyDataMemoryLength;
    typeOnly_type_get(heap, keyPointer) === ENTRY_TYPE.NUMBER ? (keyDataMemoryStart = keyPointer + 8, 
    keyDataMemoryLength = number_value_ctor.BYTES_PER_ELEMENT) : (keyDataMemoryLength = string_bytesLength_get(heap, keyPointer), 
    keyDataMemoryStart = string_charsPointer_get(heap, keyPointer));
    const bucket = hashUint8CodeInPlace(heap.Uint8Array, keyDataMemoryStart, keyDataMemoryLength) % hashmap_CAPACITY_get(heap, mapPointer), bucketStartPointer = hashmap_ARRAY_POINTER_get(heap, mapPointer) + bucket * Uint32Array.BYTES_PER_ELEMENT;
    let ptrToPtrToSaveTheNodeTo = bucketStartPointer, iteratedNodePointer = heap.Uint32Array[ptrToPtrToSaveTheNodeTo / Uint32Array.BYTES_PER_ELEMENT];
    for (;0 !== iteratedNodePointer && !compareStringOrNumberEntriesInPlace(carrier.heap, hashmapNode_KEY_POINTER_get(heap, iteratedNodePointer), keyPointer); ) ptrToPtrToSaveTheNodeTo = iteratedNodePointer + 4, 
    iteratedNodePointer = hashmapNode_NEXT_NODE_POINTER_get(heap, iteratedNodePointer);
    return ptrToPtrToSaveTheNodeTo === bucketStartPointer && hashmap_USED_CAPACITY_set(heap, mapPointer, hashmap_USED_CAPACITY_get(heap, mapPointer) + 1), 
    0 !== iteratedNodePointer ? (allocator.free(memoryForNewNode), iteratedNodePointer) : (iteratedNodePointer = memoryForNewNode, 
    hashmapNode_set_all(heap, iteratedNodePointer, 0, 0, keyPointer, linkedListItemInsert(carrier, hashmap_LINKED_LIST_POINTER_get(heap, mapPointer), memoryForNewNode)), 
    heap.Uint32Array[ptrToPtrToSaveTheNodeTo / Uint32Array.BYTES_PER_ELEMENT] = memoryForNewNode, 
    hashmap_LINKED_LIST_SIZE_set(heap, mapPointer, hashmap_LINKED_LIST_SIZE_get(heap, mapPointer) + 1), 
    shouldRehash(hashmap_CAPACITY_get(heap, mapPointer), hashmap_USED_CAPACITY_get(heap, mapPointer), externalArgs.hashMapLoadFactor) && hashMapRehash(carrier, mapPointer, 2 * hashmap_CAPACITY_get(heap, mapPointer)), 
    iteratedNodePointer);
}

function hashMapNodeLookup(heap, mapPointer, externalKeyValue) {
    const bucket = function hashCodeExternalValue(value) {
        return "number" == typeof value ? function hashNumber(num) {
            return helperFloatArray[0] = num, hashUint8CodeInPlace(helperUint8Array, 0, helperUint8Array.byteLength);
        }(value) : function hashString(str) {
            const strLen = str.length;
            let h = 0;
            for (let point = 0, nextCode = 0, i = 0; i !== strLen; ) {
                if (point = str.charCodeAt(i), i += 1, point >= 55296 && point <= 56319) {
                    if (i === strLen) {
                        h = hashStep(h, 239), h = hashStep(h, 191), h = hashStep(h, 189);
                        break;
                    }
                    if (nextCode = str.charCodeAt(i), !(nextCode >= 56320 && nextCode <= 57343)) {
                        h = hashStep(h, 239), h = hashStep(h, 191), h = hashStep(h, 189);
                        continue;
                    }
                    if (point = 1024 * (point - 55296) + nextCode - 56320 + 65536, i += 1, point > 65535) {
                        h = hashStep(h, 240 | point >>> 18), h = hashStep(h, 128 | point >>> 12 & 63), h = hashStep(h, 128 | point >>> 6 & 63), 
                        h = hashStep(h, 128 | 63 & point);
                        continue;
                    }
                }
                point <= 127 ? h = hashStep(h, 0 | point) : point <= 2047 ? (h = hashStep(h, 192 | point >>> 6), 
                h = hashStep(h, 128 | 63 & point)) : (h = hashStep(h, 224 | point >>> 12), h = hashStep(h, 128 | point >>> 6 & 63), 
                h = hashStep(h, 128 | 63 & point));
            }
            return Math.abs(h);
        }(value);
    }(externalKeyValue) % hashmap_CAPACITY_get(heap, mapPointer), bucketStartPtrToPtr = hashmap_ARRAY_POINTER_get(heap, mapPointer) + bucket * Uint32Array.BYTES_PER_ELEMENT;
    let ptrToPtr = bucketStartPtrToPtr, iteratedNode = heap.Uint32Array[bucketStartPtrToPtr / Uint32Array.BYTES_PER_ELEMENT];
    for (;0 !== iteratedNode; ) {
        if (readNumberOrString(heap, hashmapNode_KEY_POINTER_get(heap, iteratedNode)) === externalKeyValue) return ptrToPtr;
        ptrToPtr = iteratedNode + 4, iteratedNode = hashmapNode_NEXT_NODE_POINTER_get(heap, iteratedNode);
    }
    return 0;
}

function hashMapLowLevelIterator(heap, mapPointer, nodePointerIteratorToken) {
    let tokenToUseForLinkedListIterator = 0;
    0 !== nodePointerIteratorToken && (tokenToUseForLinkedListIterator = hashmapNode_LINKED_LIST_ITEM_POINTER_get(heap, nodePointerIteratorToken));
    const pointerToNextLinkedListItem = function linkedListLowLevelIterator(heap, linkedListPointer, itemPointer) {
        let iteratedItem = itemPointer;
        return 0 === itemPointer ? (iteratedItem = function linkedList_START_POINTER_get(heap, structPointer) {
            return heap.Uint32Array[(structPointer + 4) / 4];
        }(heap, linkedListPointer), 0 === linkedListItem_VALUE_get(heap, iteratedItem) ? 0 : iteratedItem) : 0 === linkedListItem_VALUE_get(heap, iteratedItem) ? 0 : (iteratedItem = linkedListItem_NEXT_POINTER_get(heap, iteratedItem), 
        0 === linkedListItem_VALUE_get(heap, iteratedItem) ? 0 : iteratedItem);
    }(heap, hashmap_LINKED_LIST_POINTER_get(heap, mapPointer), tokenToUseForLinkedListIterator);
    return 0 === pointerToNextLinkedListItem ? 0 : function linkedListGetValue(heap, itemPointer) {
        return linkedListItem_VALUE_get(heap, itemPointer);
    }(heap, pointerToNextLinkedListItem);
}

function hashMapNodePointerToKeyValue(heap, nodePointer) {
    return {
        valuePointer: nodePointer + 0,
        keyPointer: hashmapNode_KEY_POINTER_get(heap, nodePointer)
    };
}

function hashMapSize(heap, mapPointer) {
    return hashmap_LINKED_LIST_SIZE_get(heap, mapPointer);
}

function hashMapRehash(carrier, hashmapPointer, newCapacity) {
    const {heap: heap, allocator: allocator} = carrier;
    allocator.free(hashmap_ARRAY_POINTER_get(heap, hashmapPointer)), function hashmap_ARRAY_POINTER_set(heap, structPointer, value) {
        heap.Uint32Array[(structPointer + 0) / 4] = value;
    }(heap, hashmapPointer, carrier.allocator.calloc(newCapacity * Uint32Array.BYTES_PER_ELEMENT)), 
    function hashmap_CAPACITY_set(heap, structPointer, value) {
        heap.Uint8Array[(structPointer + 12) / 1] = value;
    }(heap, hashmapPointer, newCapacity), hashmap_USED_CAPACITY_set(heap, hashmapPointer, 0);
    let pointerToNode = 0;
    for (;0 !== (pointerToNode = hashMapLowLevelIterator(heap, hashmapPointer, pointerToNode)); ) hashMapRehashInsert(heap, hashmapPointer, pointerToNode);
}

function hashMapRehashInsert(heap, hashmapPointer, nodePointer) {
    const bucket = hashUint8CodeInPlace(heap.Uint8Array, function getKeyStart(heap, keyPointer) {
        return typeOnly_type_get(heap, keyPointer) === ENTRY_TYPE.NUMBER ? keyPointer + 8 : string_charsPointer_get(heap, keyPointer);
    }(heap, hashmapNode_KEY_POINTER_get(heap, nodePointer)), function getKeyLength(heap, keyPointer) {
        return typeOnly_type_get(heap, keyPointer) === ENTRY_TYPE.NUMBER ? number_value_ctor.BYTES_PER_ELEMENT : string_bytesLength_get(heap, keyPointer);
    }(heap, hashmapNode_KEY_POINTER_get(heap, nodePointer))) % hashmap_CAPACITY_get(heap, hashmapPointer), bucketStartPointer = hashmap_ARRAY_POINTER_get(heap, hashmapPointer) + bucket * Uint32Array.BYTES_PER_ELEMENT, prevFirstNodeInBucket = heap.Uint32Array[bucketStartPointer / Uint32Array.BYTES_PER_ELEMENT];
    heap.Uint32Array[bucketStartPointer / Uint32Array.BYTES_PER_ELEMENT] = nodePointer, 
    0 !== prevFirstNodeInBucket ? hashmapNode_NEXT_NODE_POINTER_set(heap, nodePointer, prevFirstNodeInBucket) : (hashmapNode_NEXT_NODE_POINTER_set(heap, nodePointer, 0), 
    hashmap_USED_CAPACITY_set(heap, hashmapPointer, hashmap_USED_CAPACITY_get(heap, hashmapPointer) + 1));
}

function shouldRehash(buckets, fullBuckets, loadFactor) {
    return fullBuckets / buckets > loadFactor;
}

function* hashmapNodesPointerIterator(heap, mapPointer) {
    let iteratorToken = 0;
    for (;0 !== (iteratorToken = hashMapLowLevelIterator(heap, mapPointer, iteratorToken)); ) yield iteratorToken;
}

function getAllLinkedAddresses(heap, ignoreRefCount, entryPointer) {
    const leafAddresses = new Set, arcAddresses = new Map, addressesToProcessQueue = [ entryPointer ];
    let addressToProcess = void 0;
    for (;void 0 !== (addressToProcess = addressesToProcessQueue.shift()); ) 0 !== addressToProcess && getAllLinkedAddressesStep(heap, ignoreRefCount, addressToProcess, leafAddresses, arcAddresses, addressesToProcessQueue);
    return {
        leafAddresses: leafAddresses,
        arcAddresses: arcAddresses
    };
}

function getAllLinkedAddressesStep(heap, ignoreRefCount, entryPointer, leafAddresses, arcAddresses, addressesToProcessQueue) {
    if (isKnownAddressValuePointer(entryPointer) || leafAddresses.has(entryPointer)) return;
    arcAddresses.has(entryPointer) && arcAddresses.set(entryPointer, arcAddresses.get(entryPointer) + 1);
    const entryType = typeOnly_type_get(heap, entryPointer), refsCount = typeAndRc_refsCount_get(heap, entryPointer) - (arcAddresses.get(entryPointer) || 0);
    switch (entryType) {
      case ENTRY_TYPE.NUMBER:
      case ENTRY_TYPE.BIGINT_NEGATIVE:
      case ENTRY_TYPE.BIGINT_POSITIVE:
        leafAddresses.add(entryPointer);
        break;

      case ENTRY_TYPE.STRING:
        refsCount <= 1 || ignoreRefCount ? (leafAddresses.add(string_charsPointer_get(heap, entryPointer)), 
        leafAddresses.add(entryPointer), arcAddresses.delete(entryPointer)) : arcAddresses.set(entryPointer, 1);
        break;

      case ENTRY_TYPE.OBJECT:
      case ENTRY_TYPE.MAP:
      case ENTRY_TYPE.SET:
        refsCount <= 1 || ignoreRefCount ? (leafAddresses.add(entryPointer), arcAddresses.delete(entryPointer), 
        function getObjectOrMapOrSetAddresses(heap, internalHashmapPointer, leafAddresses, addressesToProcessQueue) {
            !function hashMapGetPointersToFreeV2(heap, hashmapPointer, leafAddresses, addressesToProcessQueue) {
                leafAddresses.add(hashmapPointer), leafAddresses.add(hashmap_ARRAY_POINTER_get(heap, hashmapPointer)), 
                leafAddresses.add(hashmap_LINKED_LIST_POINTER_get(heap, hashmapPointer)), leafAddresses.add(linkedList_END_POINTER_get(heap, hashmap_LINKED_LIST_POINTER_get(heap, hashmapPointer)));
                let nodeIterator = 0;
                for (;0 !== (nodeIterator = hashMapLowLevelIterator(heap, hashmapPointer, nodeIterator)); ) leafAddresses.add(nodeIterator), 
                leafAddresses.add(hashmapNode_LINKED_LIST_ITEM_POINTER_get(heap, nodeIterator)), 
                addressesToProcessQueue.push(hashmapNode_KEY_POINTER_get(heap, nodeIterator), hashmapNode_VALUE_POINTER_get(heap, nodeIterator));
            }(heap, internalHashmapPointer, leafAddresses, addressesToProcessQueue);
        }(heap, object_pointerToHashMap_get(heap, entryPointer), leafAddresses, addressesToProcessQueue)) : arcAddresses.set(entryPointer, 1);
        break;

      case ENTRY_TYPE.ARRAY:
        if (refsCount <= 1 || ignoreRefCount) {
            leafAddresses.add(entryPointer), leafAddresses.add(array_dataspacePointer_get(heap, entryPointer)), 
            arcAddresses.delete(entryPointer);
            const arrayLength = array_length_get(heap, entryPointer);
            for (let i = 0; i < arrayLength; i += 1) {
                const valuePointer = heap.Uint32Array[(array_dataspacePointer_get(heap, entryPointer) + i * Uint32Array.BYTES_PER_ELEMENT) / Uint32Array.BYTES_PER_ELEMENT];
                addressesToProcessQueue.push(valuePointer);
            }
        } else arcAddresses.set(entryPointer, 1);
        break;

      case ENTRY_TYPE.DATE:
        refsCount <= 1 || ignoreRefCount ? (arcAddresses.delete(entryPointer), leafAddresses.add(entryPointer)) : arcAddresses.set(entryPointer, 1);
    }
}

const clz32 = Math.clz32, fromCharCode = String.fromCharCode;

function decoderReplacer(encoded) {
    let codePoint = encoded.charCodeAt(0) << 24;
    const leadingOnes = 0 | clz32(~codePoint);
    let endPos = 0;
    const stringLen = 0 | encoded.length;
    let result = "";
    if (leadingOnes < 5 && stringLen >= leadingOnes) {
        for (codePoint = codePoint << leadingOnes >>> 24 + leadingOnes, endPos = 1; endPos < leadingOnes; endPos = endPos + 1 | 0) codePoint = codePoint << 6 | 63 & encoded.charCodeAt(endPos);
        codePoint <= 65535 ? result += fromCharCode(codePoint) : codePoint <= 1114111 ? (codePoint = codePoint - 65536 | 0, 
        result += fromCharCode(55296 + (codePoint >> 10) | 0, 56320 + (1023 & codePoint) | 0)) : endPos = 0;
    }
    for (;endPos < stringLen; endPos = endPos + 1 | 0) result += "�";
    return result;
}

function readString(heap, stringEntryPointer) {
    return function stringDecode(uint8, from, bytesLength) {
        const finalUint8 = uint8.subarray(from, from + bytesLength);
        let resultingString = "";
        for (let index = 0, len = 0 | finalUint8.length; index < len; index = index + 32768 | 0) resultingString += fromCharCode.apply(0, finalUint8.subarray(index, index + 32768 | 0));
        return resultingString.replace(/[\xc0-\xff][\x80-\xbf]*/g, decoderReplacer);
    }(heap.Uint8Array, string_charsPointer_get(heap, stringEntryPointer), string_bytesLength_get(heap, stringEntryPointer));
}

function arraySaverIterative(arrayAdditionalAllocation, carrier, valuesToSave, pointersToSaveTo, arrayToSave) {
    const arrayLength = arrayToSave.length, arrayStructPointer = carrier.allocator.calloc(24), arrayPointersSpaceStart = arrayLength + arrayAdditionalAllocation > 0 ? carrier.allocator.calloc((arrayLength + arrayAdditionalAllocation) * Uint32Array.BYTES_PER_ELEMENT) : 0;
    array_set_all(carrier.heap, arrayStructPointer, ENTRY_TYPE.ARRAY, 1, arrayPointersSpaceStart, arrayLength, arrayLength + arrayAdditionalAllocation);
    for (let i = 0; i < arrayLength; i += 1) valuesToSave.push(arrayToSave[i]), pointersToSaveTo.push(arrayPointersSpaceStart + i * Uint32Array.BYTES_PER_ELEMENT);
    return arrayStructPointer;
}

function objectSaverIterative(externalArgs, carrier, valuesToSave, pointersToSaveTo, savedValuesToPointer, referencedExistingPointers, objectToSave) {
    const {heap: heap, allocator: allocator} = carrier, pointerToStruct = allocator.malloc(16), objectEntries = Object.entries(objectToSave), objectEntriesLength = objectEntries.length, hashMapPointer = createHashMap(carrier, Math.max(externalArgs.hashMapMinInitialCapacity, Math.ceil(1.3 * objectEntriesLength)));
    let newKeyPointer;
    for (let i = 0; i < objectEntriesLength; i += 1) {
        newKeyPointer = savedValuesToPointer.get(objectEntries[i][0]), newKeyPointer ? referencedExistingPointers.push(newKeyPointer) : newKeyPointer = saveStringOrNumber(carrier, objectEntries[i][0]);
        const ptrToNode = hashMapInsertUpdateKeyIsPointerReturnNode(externalArgs, carrier, hashMapPointer, newKeyPointer);
        hashmapNode_KEY_POINTER_get(heap, ptrToNode) !== newKeyPointer ? freeStringOrNumber(carrier, newKeyPointer) : "string" == typeof objectEntries[i][0] && savedValuesToPointer.set(objectEntries[i][0], newKeyPointer);
        const ptrToPtrForObjectPropValue = ptrToNode + 0;
        valuesToSave.push(objectEntries[i][1]), pointersToSaveTo.push(ptrToPtrForObjectPropValue);
    }
    return object_set_all(heap, pointerToStruct, ENTRY_TYPE.OBJECT, 1, hashMapPointer), 
    pointerToStruct;
}

function mapSaverIterative(externalArgs, carrier, valuesToSave, pointersToSaveTo, savedValuesToPointer, referencedExistingPointers, mapToSave) {
    const {heap: heap, allocator: allocator} = carrier, pointerToStruct = allocator.malloc(16), hashMapPointer = createHashMap(carrier, Math.max(externalArgs.hashMapMinInitialCapacity, Math.ceil(1.3 * mapToSave.size)));
    let newKeyPointer;
    for (const [key, value] of mapToSave) {
        newKeyPointer = savedValuesToPointer.get(key), newKeyPointer ? referencedExistingPointers.push(newKeyPointer) : newKeyPointer = saveStringOrNumber(carrier, key);
        const ptrToNode = hashMapInsertUpdateKeyIsPointerReturnNode(externalArgs, carrier, hashMapPointer, newKeyPointer);
        hashmapNode_KEY_POINTER_get(heap, ptrToNode) !== newKeyPointer ? freeStringOrNumber(carrier, newKeyPointer) : "string" == typeof key && savedValuesToPointer.set(key, newKeyPointer);
        const ptrToPtrForObjectPropValue = ptrToNode + 0;
        valuesToSave.push(value), pointersToSaveTo.push(ptrToPtrForObjectPropValue);
    }
    return object_set_all(heap, pointerToStruct, ENTRY_TYPE.MAP, 1, hashMapPointer), 
    pointerToStruct;
}

function setSaverIterative(externalArgs, carrier, savedValuesToPointer, referencedExistingPointers, setToSave) {
    const {heap: heap, allocator: allocator} = carrier, pointerToStruct = allocator.malloc(16), hashMapPointer = createHashMap(carrier, Math.max(externalArgs.hashMapMinInitialCapacity, Math.ceil(1.3 * setToSave.size)));
    let newKeyPointer;
    for (const key of setToSave) newKeyPointer = savedValuesToPointer.get(key), newKeyPointer ? referencedExistingPointers.push(newKeyPointer) : newKeyPointer = saveStringOrNumber(carrier, key), 
    hashmapNode_KEY_POINTER_get(heap, hashMapInsertUpdateKeyIsPointerReturnNode(externalArgs, carrier, hashMapPointer, newKeyPointer)) !== newKeyPointer ? freeStringOrNumber(carrier, newKeyPointer) : "string" == typeof key && savedValuesToPointer.set(key, newKeyPointer);
    return object_set_all(heap, pointerToStruct, ENTRY_TYPE.SET, 1, hashMapPointer), 
    object_set_all(carrier.heap, pointerToStruct, ENTRY_TYPE.SET, 1, hashMapPointer), 
    pointerToStruct;
}

function saveValueIterativeReturnPointer(externalArgs, carrier, referencedExistingPointers, initialValue) {
    saveValueIterative(externalArgs, carrier, referencedExistingPointers, TEMP_SAVE_POINTER, initialValue);
    const p = carrier.heap.Uint32Array[TEMP_SAVE_POINTER / Uint32Array.BYTES_PER_ELEMENT];
    return carrier.heap.Uint32Array[TEMP_SAVE_POINTER / Uint32Array.BYTES_PER_ELEMENT] = 0, 
    p;
}

function saveValueIterative(externalArgs, carrier, referencedExistingPointers, initialValuePtrToPtr, initialValue) {
    const valuesToSave = [ initialValue ], pointersToSaveTo = [ initialValuePtrToPtr ], savedValuesToPointer = new Map, {heap: {Uint32Array: uint32}, allocator: allocator, heap: heap} = carrier;
    for (;0 !== valuesToSave.length; ) {
        const valueToSave = valuesToSave.pop(), ptrToPtrToSaveTo = pointersToSaveTo.pop();
        if (void 0 === valueToSave) {
            uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT] = 0;
            continue;
        }
        if (null === valueToSave) {
            uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT] = 1;
            continue;
        }
        if (!0 === valueToSave) {
            uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT] = 2;
            continue;
        }
        if (!1 === valueToSave) {
            uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT] = 3;
            continue;
        }
        if (savedValuesToPointer.has(valueToSave)) {
            uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT] = savedValuesToPointer.get(valueToSave), 
            referencedExistingPointers.push(uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT]);
            continue;
        }
        switch (typeof valueToSave) {
          case "number":
            uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT] = allocator.calloc(16), 
            number_set_all(heap, uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT], ENTRY_TYPE.NUMBER, valueToSave);
            continue;

          case "string":
            const stringBytesLength = stringLengthV2(valueToSave), stringDataPointer = allocator.calloc(stringBytesLength);
            uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT] = allocator.calloc(20), 
            stringEncodeInto(heap.Uint8Array, stringDataPointer, valueToSave), 
            /*!==
        stringBytesLength;*/
            string_set_all(heap, uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT], ENTRY_TYPE.STRING, 1, stringBytesLength, stringDataPointer), 
            savedValuesToPointer.set(valueToSave, uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT]);
            continue;

          case "bigint":
            if (valueToSave > MAX_64_BIG_INT || valueToSave < -MAX_64_BIG_INT) {
                uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT] = 0;
                continue;
            }
            uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT] = allocator.calloc(16), 
            bigint_set_all(heap, uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT], valueToSave > 0 ? ENTRY_TYPE.BIGINT_POSITIVE : ENTRY_TYPE.BIGINT_NEGATIVE, valueToSave * (valueToSave > 0 ? BigInt("1") : BigInt("-1")));
            continue;

          case "function":
          case "symbol":
            uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT] = 0;
            continue;
        }
        const maybeOurPointerFromSymbol = getOurPointerIfApplicable(valueToSave, carrier.allocator);
        maybeOurPointerFromSymbol ? (referencedExistingPointers.push(maybeOurPointerFromSymbol), 
        heap.Uint32Array[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT] = maybeOurPointerFromSymbol) : Array.isArray(valueToSave) ? (heap.Uint32Array[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT] = arraySaverIterative(externalArgs.arrayAdditionalAllocation, carrier, valuesToSave, pointersToSaveTo, valueToSave), 
        savedValuesToPointer.set(valueToSave, uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT])) : valueToSave instanceof Date ? (heap.Uint32Array[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT] = allocator.calloc(24), 
        date_set_all(heap, heap.Uint32Array[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT], ENTRY_TYPE.DATE, 1, 0, valueToSave.getTime()), 
        savedValuesToPointer.set(valueToSave, uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT])) : valueToSave instanceof Map ? (heap.Uint32Array[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT] = mapSaverIterative(externalArgs, carrier, valuesToSave, pointersToSaveTo, savedValuesToPointer, referencedExistingPointers, valueToSave), 
        savedValuesToPointer.set(valueToSave, uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT])) : valueToSave instanceof Set ? (heap.Uint32Array[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT] = setSaverIterative(externalArgs, carrier, savedValuesToPointer, referencedExistingPointers, valueToSave), 
        savedValuesToPointer.set(valueToSave, uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT])) : (heap.Uint32Array[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT] = objectSaverIterative(externalArgs, carrier, valuesToSave, pointersToSaveTo, savedValuesToPointer, referencedExistingPointers, valueToSave), 
        savedValuesToPointer.set(valueToSave, uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT]));
    }
}

function freeStringOrNumber({heap: heap, allocator: allocator}, stringOrNumberStructPointer) {
    typeOnly_type_get(heap, stringOrNumberStructPointer) == ENTRY_TYPE.STRING && allocator.free(string_charsPointer_get(heap, stringOrNumberStructPointer)), 
    allocator.free(stringOrNumberStructPointer);
}

function saveStringOrNumber(carrier, value) {
    return "string" == typeof value ? function saveString({heap: heap, allocator: allocator}, value) {
        const stringBytesLength = stringLengthV2(value), stringDataPointer = allocator.calloc(stringBytesLength);
        stringEncodeInto(heap.Uint8Array, stringDataPointer, value);
        const stringPointer = allocator.calloc(20);
        return string_set_all(heap, stringPointer, ENTRY_TYPE.STRING, 1, stringBytesLength, stringDataPointer), 
        stringPointer;
    }(carrier, value) : function saveNumber({heap: heap, allocator: allocator}, value) {
        const numberPointer = allocator.calloc(16);
        return number_set_all(heap, numberPointer, ENTRY_TYPE.NUMBER, value), numberPointer;
    }(carrier, value);
}

function handleArcForDeletedValuePointer(carrier, deletedValuePointer) {
    const {heap: heap, allocator: allocator} = carrier;
    if (isKnownAddressValuePointer(deletedValuePointer)) return;
    if (!function isTypeWithRC(type) {
        return type === ENTRY_TYPE.OBJECT || type === ENTRY_TYPE.ARRAY || type === ENTRY_TYPE.DATE || type === ENTRY_TYPE.MAP || type === ENTRY_TYPE.SET || type === ENTRY_TYPE.STRING;
    }(typeOnly_type_get(heap, deletedValuePointer))) return void allocator.free(deletedValuePointer);
    if (decrementRefCount(heap, deletedValuePointer) > 0) return;
    const {leafAddresses: leafAddresses, arcAddresses: arcAddresses} = getAllLinkedAddresses(carrier.heap, !1, deletedValuePointer);
    for (const address of leafAddresses) allocator.free(address);
    for (const [address, count] of arcAddresses) decrementRefCountWithNum(heap, address, count);
}

function incrementRefCount(heap, entryPointer) {
    return typeAndRc_refsCount_set(heap, entryPointer, typeAndRc_refsCount_get(heap, entryPointer) + 1), 
    typeAndRc_refsCount_get(heap, entryPointer);
}

function decrementRefCount(heap, entryPointer) {
    return typeAndRc_refsCount_set(heap, entryPointer, typeAndRc_refsCount_get(heap, entryPointer) - 1), 
    typeAndRc_refsCount_get(heap, entryPointer);
}

function decrementRefCountWithNum(heap, entryPointer, num) {
    return typeAndRc_refsCount_set(heap, entryPointer, typeAndRc_refsCount_get(heap, entryPointer) - num), 
    typeAndRc_refsCount_get(heap, entryPointer);
}

function compareStringOrNumberEntriesInPlace(heap, entryAPointer, entryBPointer) {
    typeOnly_type_get(heap, entryAPointer);
    const entryAType = typeOnly_type_get(heap, entryAPointer);
    if (entryAType !== typeOnly_type_get(heap, entryBPointer)) return !1;
    if (entryAType === ENTRY_TYPE.STRING) {
        const aLength = string_bytesLength_get(heap, entryAPointer);
        return aLength === string_bytesLength_get(heap, entryBPointer) && function memComp(uint8, aStart, bStart, length) {
            if (uint8.byteLength < aStart + length || uint8.byteLength < bStart + length) return !1;
            for (let i = 0; i <= length - i; i += 1) if (uint8[aStart + i] !== uint8[bStart + i]) return !1;
            return !0;
        }(heap.Uint8Array, string_charsPointer_get(heap, entryAPointer), string_charsPointer_get(heap, entryBPointer), aLength);
    }
    return number_value_get(heap, entryAPointer) === number_value_get(heap, entryBPointer);
}

function readNumberOrString(heap, pointer) {
    return typeOnly_type_get(heap, pointer) === ENTRY_TYPE.NUMBER ? number_value_get(heap, pointer) : readString(heap, pointer);
}

function arrayGetPointerToIndex(carrier, pointerToArrayEntry, indexToGet) {
    if (indexToGet >= array_length_get(carrier.heap, pointerToArrayEntry)) throw new Error("NOT MAKES SENSE");
    return array_dataspacePointer_get(carrier.heap, pointerToArrayEntry) + indexToGet * Uint32Array.BYTES_PER_ELEMENT;
}

function arrayGetValuePointerInIndex(carrier, pointerToArrayEntry, indexToGet) {
    return carrier.heap.Uint32Array[arrayGetPointerToIndex(carrier, pointerToArrayEntry, indexToGet) / Uint32Array.BYTES_PER_ELEMENT];
}

function getFinalValueAtArrayIndex(externalArgs, globalCarrier, pointerToArrayEntry, indexToGet) {
    return entryToFinalJavaScriptValue(externalArgs, globalCarrier, arrayGetValuePointerInIndex(globalCarrier, pointerToArrayEntry, indexToGet));
}

function setValuePointerAtArrayIndex(carrier, pointerToArrayEntry, indexToSet, pointerToEntry) {
    const pointer = arrayGetPointerToIndex(carrier, pointerToArrayEntry, indexToSet);
    carrier.heap.Uint32Array[pointer / Uint32Array.BYTES_PER_ELEMENT] = pointerToEntry;
}

function extendArrayIfNeeded(externalArgs, carrier, pointerToArrayEntry, wishedLength) {
    wishedLength > array_length_get(carrier.heap, pointerToArrayEntry) && (wishedLength > function array_allocatedLength_get(heap, structPointer) {
        return heap.Uint32Array[(structPointer + 20) / 4];
    }(carrier.heap, pointerToArrayEntry) ? function reallocateArray(carrier, pointerToArrayEntry, newAllocatedLength, newLength) {
        const dataspacePointer = array_dataspacePointer_get(carrier.heap, pointerToArrayEntry), newArrayValueLocation = 0 !== dataspacePointer ? carrier.allocator.realloc(dataspacePointer, newAllocatedLength * Uint32Array.BYTES_PER_ELEMENT) : carrier.allocator.calloc(newAllocatedLength * Uint32Array.BYTES_PER_ELEMENT);
        array_set_all(carrier.heap, pointerToArrayEntry, ENTRY_TYPE.ARRAY, function array_refsCount_get(heap, structPointer) {
            return heap.Uint32Array[(structPointer + 8) / 4];
        }(carrier.heap, pointerToArrayEntry), newArrayValueLocation, newLength, newAllocatedLength);
    }(carrier, pointerToArrayEntry, wishedLength + externalArgs.arrayAdditionalAllocation, wishedLength) : array_length_set(carrier.heap, pointerToArrayEntry, wishedLength));
}

function arraySort(externalArgs, carrier, pointerToArrayEntry, sortComparator = defaultCompareFunction) {
    const arrayDataSpace = array_dataspacePointer_get(carrier.heap, pointerToArrayEntry), sortMe = [ ...new Array(array_length_get(carrier.heap, pointerToArrayEntry)).keys() ].map(index => arrayDataSpace + index * Uint32Array.BYTES_PER_ELEMENT).map(pointerToPointer => carrier.heap.Uint32Array[pointerToPointer / Uint32Array.BYTES_PER_ELEMENT]).map(pointer => [ pointer, entryToFinalJavaScriptValue(externalArgs, carrier, pointer) ]);
    sortMe.sort((a, b) => sortComparator(a[1], b[1]));
    for (let i = 0; i < sortMe.length; i += 1) carrier.heap.Uint32Array[(arrayDataSpace + i * Uint32Array.BYTES_PER_ELEMENT) / Uint32Array.BYTES_PER_ELEMENT] = sortMe[i][0];
}

function defaultCompareFunction(x, y) {
    if (void 0 === x && void 0 === y) return 0;
    if (void 0 === x) return 1;
    if (void 0 === y) return -1;
    const xString = toString(x), yString = toString(y);
    return xString < yString ? -1 : xString > yString ? 1 : 0;
}

function toString(obj) {
    if (null === obj) return "null";
    if ("boolean" == typeof obj || "number" == typeof obj) return obj.toString();
    if ("string" == typeof obj) return obj;
    if ("symbol" == typeof obj) throw new TypeError;
    return obj.toString();
}

class IllegalObjectPropConfigError extends RangeError {
    constructor() {
        super("IllegalObjectPropConfigError");
    }
}

class IllegalArrayIndexError extends RangeError {
    constructor() {
        super("IllegalArrayIndexError");
    }
}

class UnsupportedOperationError extends Error {
    constructor() {
        super("UnsupportedOperationError");
    }
}

class OutOfMemoryError extends Error {
    constructor() {
        super("OutOfMemoryError");
    }
}

class WrapperDestroyed extends Error {
    constructor() {
        super("WrapperDestroyed");
    }
}

class BaseProxyTrap {
    constructor(externalArgs, carrier, _entryPointer) {
        this.externalArgs = externalArgs, this.carrier = carrier, this._entryPointer = _entryPointer, 
        incrementRefCount(this.carrier.heap, this.entryPointer);
    }
    destroy() {
        const newRefCount = decrementRefCount(this.carrier.heap, this.entryPointer);
        return this._entryPointer = 0, newRefCount;
    }
    getCarrier() {
        return this.carrier;
    }
    replaceCarrierContent(newCarrierContent) {
        Object.assign(this.carrier, newCarrierContent);
    }
    getEntryPointer() {
        return this.entryPointer;
    }
    getExternalArgs() {
        return this.externalArgs;
    }
    get entryPointer() {
        if (0 === this._entryPointer) throw new WrapperDestroyed;
        return this._entryPointer;
    }
}

class ArrayWrapper extends BaseProxyTrap {
    get(target, p) {
        if (p === INTERNAL_API_SYMBOL) return this;
        if (p in this && "constructor" !== p) return this[p];
        if ("length" === p) return array_length_get(this.carrier.heap, this.entryPointer);
        if ("string" == typeof p || "number" == typeof p) {
            const asInt = "string" == typeof p ? Number.parseInt(p, 10) : p;
            if (Number.isSafeInteger(asInt)) return getFinalValueAtArrayIndex(this.externalArgs, this.carrier, this.entryPointer, asInt);
        }
        return target[p];
    }
    deleteProperty(target, p) {
        const index = "number" == typeof p ? p : Number.parseInt(p, 10);
        return 1 === this.splice(index, 1).length;
    }
    enumerate() {
        throw new Error("unsupported enumerate");
    }
    ownKeys() {
        const length = array_length_get(this.carrier.heap, this.entryPointer);
        return [ ...new Array(length).keys(), "length" ];
    }
    getOwnPropertyDescriptor(target, prop) {
        return "length" === prop ? {
            configurable: !1,
            enumerable: !1,
            writable: !0
        } : this.has(target, prop) ? {
            configurable: !1,
            enumerable: !0
        } : void 0;
    }
    has(target, p) {
        if (p === INTERNAL_API_SYMBOL) return !0;
        const length = array_length_get(this.carrier.heap, this.entryPointer);
        if ("number" == typeof p) return length - 1 >= p;
        if ("string" == typeof p) return length - 1 >= Number.parseInt(p, 10);
        throw new Error("unsupported");
    }
    set(target, accessedProp, value) {
        if ("symbol" == typeof accessedProp) throw new IllegalArrayIndexError;
        if ("length" === accessedProp) return this.handleLengthChange(value);
        const possibleIndex = Number.parseInt(accessedProp, 10);
        if (!Number.isSafeInteger(possibleIndex) || possibleIndex < 0) throw new IllegalArrayIndexError;
        return this.carrier.allocator.transaction(() => {
            !function setValueAtArrayIndex(externalArgs, carrier, pointerToArrayEntry, indexToSet, value) {
                const refedPointers = [], newValuePointer = saveValueIterativeReturnPointer(externalArgs, carrier, refedPointers, value);
                extendArrayIfNeeded(externalArgs, carrier, pointerToArrayEntry, indexToSet + 1);
                for (const pointer of refedPointers) incrementRefCount(carrier.heap, pointer);
                const pointerToThePointer = arrayGetPointerToIndex(carrier, pointerToArrayEntry, indexToSet);
                handleArcForDeletedValuePointer(carrier, carrier.heap.Uint32Array[pointerToThePointer / Uint32Array.BYTES_PER_ELEMENT]), 
                carrier.heap.Uint32Array[pointerToThePointer / Uint32Array.BYTES_PER_ELEMENT] = newValuePointer;
            }(this.externalArgs, this.carrier, this.entryPointer, possibleIndex, value);
        }), !0;
    }
    * entries() {
        let index = 0, length = 0;
        do {
            yield [ index, getFinalValueAtArrayIndex(this.externalArgs, this.carrier, this.entryPointer, index) ], 
            index += 1, length = array_length_get(this.carrier.heap, this.entryPointer);
        } while (index < length);
    }
    * keys() {
        let index = 0, length = 0;
        do {
            yield index, index += 1, length = array_length_get(this.carrier.heap, this.entryPointer);
        } while (index < length);
    }
    * values() {
        let index = 0, length = 0;
        do {
            yield getFinalValueAtArrayIndex(this.externalArgs, this.carrier, this.entryPointer, index), 
            index += 1, length = array_length_get(this.carrier.heap, this.entryPointer);
        } while (index < length);
    }
    get [Symbol.iterator]() {
        return this.values;
    }
    sort(comparator) {
        arraySort(this.externalArgs, this.carrier, this.entryPointer, comparator);
    }
    splice(start, deleteCount, ...items) {
        return this.carrier.allocator.transaction(() => function arraySplice(externalArgs, carrier, pointerToArrayEntry, startArg, deleteCountArg, ...itemsToAddArg) {
            const arrayLength = array_length_get(carrier.heap, pointerToArrayEntry), calcedStart = function calculateSpliceStart(arrayLength, startArg) {
                return startArg >= arrayLength ? arrayLength : startArg < 0 ? arrayLength + startArg : startArg;
            }(arrayLength, startArg), calcedDeleteCount = function calculateDeleteCount(arrayLength, start, deleteCountArg) {
                return void 0 === deleteCountArg || deleteCountArg >= arrayLength - start ? Math.min(arrayLength, arrayLength - start) : deleteCountArg <= 0 ? 0 : Math.min(arrayLength, deleteCountArg);
            }(arrayLength, calcedStart, deleteCountArg), newLength = arrayLength + itemsToAddArg.length - calcedDeleteCount, newValuesPointers = [], referencedExistingPointers = [];
            for (let i = 0; i < itemsToAddArg.length; i += 1) newValuesPointers.push(saveValueIterativeReturnPointer(externalArgs, carrier, referencedExistingPointers, itemsToAddArg[i]));
            if (extendArrayIfNeeded(externalArgs, carrier, pointerToArrayEntry, newLength), 
            referencedExistingPointers.length > 0) for (const ptr of referencedExistingPointers) incrementRefCount(carrier.heap, ptr);
            const deletedItemsToReturn = [], itemCountChange = newLength - arrayLength;
            for (let deletedItemIndexToSave = calcedStart; deletedItemIndexToSave < calcedStart + calcedDeleteCount; deletedItemIndexToSave += 1) deletedItemsToReturn.push(getFinalValueAtArrayIndex(externalArgs, carrier, pointerToArrayEntry, deletedItemIndexToSave)), 
            handleArcForDeletedValuePointer(carrier, arrayGetValuePointerInIndex(carrier, pointerToArrayEntry, deletedItemIndexToSave));
            if (itemCountChange > 0) for (let writeValueToIndex = newLength - 1; writeValueToIndex >= calcedStart + itemCountChange; writeValueToIndex -= 1) {
                const ptrToPtr = arrayGetPointerToIndex(carrier, pointerToArrayEntry, writeValueToIndex - itemCountChange);
                setValuePointerAtArrayIndex(carrier, pointerToArrayEntry, writeValueToIndex, carrier.heap.Uint32Array[ptrToPtr / Uint32Array.BYTES_PER_ELEMENT]), 
                carrier.heap.Uint32Array[ptrToPtr / Uint32Array.BYTES_PER_ELEMENT] = 0;
            } else if (itemCountChange < 0) for (let writeValueToIndex = calcedStart + itemsToAddArg.length; writeValueToIndex < arrayLength + itemCountChange; writeValueToIndex += 1) setValuePointerAtArrayIndex(carrier, pointerToArrayEntry, writeValueToIndex, arrayGetValuePointerInIndex(carrier, pointerToArrayEntry, writeValueToIndex - itemCountChange));
            for (let i = 0; i < newValuesPointers.length; i += 1) {
                const pointerToThePointer = arrayGetPointerToIndex(carrier, pointerToArrayEntry, calcedStart + i);
                carrier.heap.Uint32Array[pointerToThePointer / Uint32Array.BYTES_PER_ELEMENT] = newValuesPointers[i];
            }
            return newLength < arrayLength && function shrinkArray(heap, pointerToArrayEntry, wishedLength) {
                array_length_set(heap, pointerToArrayEntry, wishedLength);
            }(carrier.heap, pointerToArrayEntry, newLength), deletedItemsToReturn;
        }(this.externalArgs, this.carrier, this.entryPointer, start, deleteCount, ...items));
    }
    reverse() {
        return function arrayReverse(carrier, pointerToArrayEntry) {
            for (let i = 0; i < Math.floor(array_length_get(carrier.heap, pointerToArrayEntry) / 2); i += 1) {
                const theOtherIndex = array_length_get(carrier.heap, pointerToArrayEntry) - i - 1, a = arrayGetValuePointerInIndex(carrier, pointerToArrayEntry, i);
                setValuePointerAtArrayIndex(carrier, pointerToArrayEntry, i, arrayGetValuePointerInIndex(carrier, pointerToArrayEntry, theOtherIndex)), 
                setValuePointerAtArrayIndex(carrier, pointerToArrayEntry, theOtherIndex, a);
            }
        }(this.carrier, this.entryPointer), this;
    }
    shift() {
        return this.splice(0, 1)[0];
    }
    unshift(...elements) {
        return this.splice(0, 0, ...elements), array_length_get(this.carrier.heap, this.entryPointer);
    }
    getEntryPointer() {
        return this.entryPointer;
    }
    isExtensible() {
        return !0;
    }
    preventExtensions() {
        throw new UnsupportedOperationError;
    }
    setPrototypeOf() {
        throw new UnsupportedOperationError;
    }
    defineProperty() {
        throw new UnsupportedOperationError;
    }
    handleLengthChange(newLength) {
        if ("number" != typeof newLength || !Number.isSafeInteger(newLength) || newLength < 0) throw new RangeError("Invalid array length");
        const currentLength = array_length_get(this.carrier.heap, this.entryPointer);
        return currentLength === newLength || this.carrier.allocator.transaction(() => {
            currentLength > newLength ? this.splice(newLength, currentLength - newLength) : extendArrayIfNeeded(this.externalArgs, this.carrier, this.entryPointer, newLength);
        }), !0;
    }
}

const getFunctions = [ "toString", "toDateString", "toTimeString", "toISOString", "toUTCString", "getDate", "getDay", "getFullYear", "getHours", "getMilliseconds", "getMinutes", "getMonth", "getSeconds", "getTime", "getTimezoneOffset", "getUTCDate", "getUTCDay", "getUTCFullYear", "getUTCHours", "getUTCMilliseconds", "getUTCMinutes", "getUTCMonth", "getUTCSeconds", "toJSON", "toLocaleString", "toLocaleDateString", "toLocaleTimeString" ], setFunctions = [ "setDate", "setFullYear", "setHours", "setMilliseconds", "setMinutes", "setMonth", "setSeconds", "setTime", "getTimezoneOffset", "setUTCDate", "setUTCFullYear", "setUTCHours", "setUTCMilliseconds", "setUTCMinutes", "setUTCMonth", "setUTCSeconds" ];

class DateWrapper extends BaseProxyTrap {
    constructor(externalArgs, carrier, entryPointer) {
        super(externalArgs, carrier, entryPointer), this.dateObjectForReuse = new Date, 
        this.useMeToGiveNamesToFunctionsAndCacheThem = {};
    }
    get(target, p) {
        return p === INTERNAL_API_SYMBOL ? this : getFunctions.includes(p) ? (p in this.useMeToGiveNamesToFunctionsAndCacheThem || (this.useMeToGiveNamesToFunctionsAndCacheThem[p] = () => (this.updateDateObjectForReuse(), 
        this.dateObjectForReuse[p]())), this.useMeToGiveNamesToFunctionsAndCacheThem[p]) : setFunctions.includes(p) ? (p in this.useMeToGiveNamesToFunctionsAndCacheThem || (this.useMeToGiveNamesToFunctionsAndCacheThem[p] = (...args) => {
            this.updateDateObjectForReuse();
            const returnValue = this.dateObjectForReuse[p](...args);
            return this.persistDateObject(), returnValue;
        }), this.useMeToGiveNamesToFunctionsAndCacheThem[p]) : target[p];
    }
    updateDateObjectForReuse() {
        this.dateObjectForReuse.setTime(function date_timestamp_get(heap, structPointer) {
            return heap.Float64Array[(structPointer + 16) / 8];
        }(this.carrier.heap, this.entryPointer));
    }
    persistDateObject() {
        date_set_all(this.carrier.heap, this.entryPointer, ENTRY_TYPE.DATE, function date_refsCount_get(heap, structPointer) {
            return heap.Uint32Array[(structPointer + 8) / 4];
        }(this.carrier.heap, this.entryPointer), 0, this.dateObjectForReuse.getTime());
    }
    defineProperty() {
        throw new UnsupportedOperationError;
    }
    setPrototypeOf() {
        throw new UnsupportedOperationError;
    }
    isExtensible() {
        return !1;
    }
}

class MapWrapper extends BaseProxyTrap {
    clear() {
        mapOrSetClear(this.externalArgs, this.carrier, this.entryPointer);
    }
    forEach(callbackfn, thisArg) {
        for (const pair of this.entries()) callbackfn.call(thisArg || null, pair[1], pair[0], this);
    }
    get size() {
        return hashMapSize(this.carrier.heap, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer));
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    * entries() {
        for (const nodePointer of hashmapNodesPointerIterator(this.carrier.heap, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer))) {
            const {valuePointer: valuePointer, keyPointer: keyPointer} = hashMapNodePointerToKeyValue(this.carrier.heap, nodePointer);
            yield [ entryToFinalJavaScriptValue(this.externalArgs, this.carrier, keyPointer), entryToFinalJavaScriptValue(this.externalArgs, this.carrier, this.carrier.heap.Uint32Array[valuePointer / Uint32Array.BYTES_PER_ELEMENT]) ];
        }
    }
    * keys() {
        for (const nodePointer of hashmapNodesPointerIterator(this.carrier.heap, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer))) {
            const t = hashMapNodePointerToKeyValue(this.carrier.heap, nodePointer);
            yield entryToFinalJavaScriptValue(this.externalArgs, this.carrier, t.keyPointer);
        }
    }
    * values() {
        for (const nodePointer of hashmapNodesPointerIterator(this.carrier.heap, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer))) {
            const {valuePointer: valuePointer} = hashMapNodePointerToKeyValue(this.carrier.heap, nodePointer);
            yield entryToFinalJavaScriptValue(this.externalArgs, this.carrier, this.carrier.heap.Uint32Array[valuePointer / Uint32Array.BYTES_PER_ELEMENT]);
        }
    }
    get [Symbol.toStringTag]() {
        return Map.prototype[Symbol.toStringTag];
    }
    get [INTERNAL_API_SYMBOL]() {
        return this;
    }
    static get [Symbol.species]() {
        return Map;
    }
    get(p) {
        if ("string" == typeof p || "number" == typeof p) return objectGet(this.externalArgs, this.carrier, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer), p);
    }
    delete(p) {
        return ("string" == typeof p || "number" == typeof p) && deleteObjectPropertyEntryByKey(this.carrier, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer), p);
    }
    has(p) {
        return ("string" == typeof p || "number" == typeof p) && 0 !== hashMapNodeLookup(this.carrier.heap, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer), p);
    }
    set(p, value) {
        return "string" != typeof p && "number" != typeof p || objectSet(this.externalArgs, this.carrier, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer), p, value), 
        this;
    }
}

class SetWrapper extends BaseProxyTrap {
    clear() {
        mapOrSetClear(this.externalArgs, this.carrier, this.entryPointer);
    }
    forEach(callbackfn, thisArg) {
        for (const pair of this.entries()) callbackfn.call(thisArg || null, pair[1], pair[0], this);
    }
    get size() {
        return hashMapSize(this.carrier.heap, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer));
    }
    [Symbol.iterator]() {
        return this.keys();
    }
    * entries() {
        for (const nodePointer of hashmapNodesPointerIterator(this.carrier.heap, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer))) {
            const t = hashMapNodePointerToKeyValue(this.carrier.heap, nodePointer), key = entryToFinalJavaScriptValue(this.externalArgs, this.carrier, t.keyPointer);
            yield [ key, key ];
        }
    }
    * keys() {
        for (const nodePointer of hashmapNodesPointerIterator(this.carrier.heap, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer))) {
            const t = hashMapNodePointerToKeyValue(this.carrier.heap, nodePointer);
            yield entryToFinalJavaScriptValue(this.externalArgs, this.carrier, t.keyPointer);
        }
    }
    * values() {
        for (const nodePointer of hashmapNodesPointerIterator(this.carrier.heap, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer))) {
            const t = hashMapNodePointerToKeyValue(this.carrier.heap, nodePointer);
            yield entryToFinalJavaScriptValue(this.externalArgs, this.carrier, t.keyPointer);
        }
    }
    get [Symbol.toStringTag]() {
        return Set.prototype[Symbol.toStringTag];
    }
    get [INTERNAL_API_SYMBOL]() {
        return this;
    }
    static get [Symbol.species]() {
        return Set;
    }
    has(p) {
        return ("string" == typeof p || "number" == typeof p) && 0 !== hashMapNodeLookup(this.carrier.heap, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer), p);
    }
    add(p) {
        return "string" != typeof p && "number" != typeof p || objectSet(this.externalArgs, this.carrier, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer), p, void 0), 
        this;
    }
    delete(p) {
        return ("string" == typeof p || "number" == typeof p) && deleteObjectPropertyEntryByKey(this.carrier, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer), p);
    }
}

class WeakValueMap {
    constructor(iterable, externalFinalizer) {
        if (this.externalFinalizer = externalFinalizer, null != iterable) for (const [key, value] of iterable) this.set(key, value);
        this.map = new Map;
        const FinalizationSomething = "undefined" != typeof FinalizationRegistry ? FinalizationRegistry : FinalizationGroup;
        this.group = new FinalizationSomething(iteratorOrKey => {
            if (Symbol.iterator in iteratorOrKey) for (const key of iteratorOrKey) this.map.delete(key), 
            this.externalFinalizer && this.externalFinalizer(key); else this.map.delete(iteratorOrKey), 
            this.externalFinalizer && this.externalFinalizer(iteratorOrKey);
        });
    }
    set(key, value) {
        const existingRef = this.map.get(key);
        existingRef && this.group.unregister(existingRef);
        const newRef = new WeakRef(value);
        return this.map.set(key, newRef), this.group.register(value, key, newRef), this;
    }
    has(key) {
        const w = this.map.get(key);
        return void 0 !== w && (void 0 !== w.deref() || (this.map.delete(key), this.group.unregister(w), 
        !1));
    }
    get(key) {
        const w = this.map.get(key);
        if (void 0 === w) return;
        const v = w.deref();
        return void 0 === v ? (this.map.delete(key), void this.group.unregister(w)) : v;
    }
    delete(key) {
        const w = this.map.get(key);
        return !!w && (this.map.delete(key), this.group.unregister(w), void 0 !== w.deref());
    }
    clear() {
        for (const w of this.map.values()) this.group.unregister(w);
        this.map.clear();
    }
    * [Symbol.iterator](type) {
        for (const [key, weak] of this.map) {
            const v = weak.deref();
            void 0 === v ? (this.map.delete(key), this.group.unregister(weak)) : 1 === type ? yield key : 2 === type ? yield v : yield [ key, v ];
        }
    }
    keys() {
        return this[Symbol.iterator](1);
    }
    values() {
        return this[Symbol.iterator](2);
    }
    entries() {
        return this[Symbol.iterator](3);
    }
    forEach(callbackfn, thisArg) {
        for (const [key, value] of this) callbackfn.call(thisArg, key, value, this);
    }
    get size() {
        return this.map.size;
    }
    get [Symbol.toStringTag]() {
        return this.map[Symbol.toStringTag];
    }
}

const addressesNoLongerUsed = new WeakMap, externalObjectsCache = new WeakMap;

function getCacheFor(obj, externalFinalizer) {
    let map = externalObjectsCache.get(obj);
    return map || (map = function supportWeakRef() {
        return "undefined" != typeof WeakRef && ("undefined" != typeof FinalizationGroup || !0);
    }() ? new WeakValueMap(void 0, null == externalFinalizer ? void 0 : externalFinalizer.bind(null, obj)) : new Map, 
    externalObjectsCache.set(obj, map)), map;
}

const TYPE_TO_FACTORY = {
    [ENTRY_TYPE.OBJECT]: createObjectWrapper,
    [ENTRY_TYPE.DATE]: function createDateWrapper(externalArgs, carrier, entryPointer) {
        return new Proxy(new Date(0), new DateWrapper(externalArgs, carrier, entryPointer));
    },
    [ENTRY_TYPE.ARRAY]: function createArrayWrapper(externalArgs, globalCarrier, entryPointer) {
        return new Proxy([], new ArrayWrapper(externalArgs, globalCarrier, entryPointer));
    },
    [ENTRY_TYPE.MAP]: function createMapWrapper(externalArgs, globalCarrier, entryPointer) {
        return new MapWrapper(externalArgs, globalCarrier, entryPointer);
    },
    [ENTRY_TYPE.SET]: function createSetWrapper(externalArgs, globalCarrier, entryPointer) {
        return new SetWrapper(externalArgs, globalCarrier, entryPointer);
    }
};

function entryToFinalJavaScriptValue(externalArgs, carrier, pointerToEntry) {
    if (0 === pointerToEntry) return;
    if (1 === pointerToEntry) return null;
    if (2 === pointerToEntry) return !0;
    if (3 === pointerToEntry) return !1;
    const entryType = typeOnly_type_get(carrier.heap, pointerToEntry);
    switch (entryType) {
      case ENTRY_TYPE.NUMBER:
        return number_value_get(carrier.heap, pointerToEntry);

      case ENTRY_TYPE.STRING:
        return readString(carrier.heap, pointerToEntry);

      case ENTRY_TYPE.BIGINT_POSITIVE:
        return bigint_value_get(carrier.heap, pointerToEntry);

      case ENTRY_TYPE.BIGINT_NEGATIVE:
        return bigint_value_get(carrier.heap, pointerToEntry) * BigInt("-1");
    }
    if (entryType !== ENTRY_TYPE.OBJECT && entryType !== ENTRY_TYPE.DATE && entryType !== ENTRY_TYPE.ARRAY && entryType !== ENTRY_TYPE.MAP && entryType !== ENTRY_TYPE.SET) throw new Error("Nope Nope Nope");
    const cache = getCacheFor(carrier, finalizer);
    let ret = cache.get(pointerToEntry);
    return ret || (ret = TYPE_TO_FACTORY[entryType](externalArgs, carrier, pointerToEntry), 
    cache.set(pointerToEntry, ret)), ret;
}

function finalizer(carrier, memoryAddress) {
    (function getAddressesNoLongerUsed(carrier) {
        let l = addressesNoLongerUsed.get(carrier);
        return void 0 === l && (l = [], addressesNoLongerUsed.set(carrier, l)), l;
    })(carrier).push(memoryAddress);
}

function deleteObjectPropertyEntryByKey(carrier, hashmapPointer, keyToDeleteBy) {
    const deletedValuePointerToPointer = function hashMapDelete(carrier, mapPointer, externalKeyValue) {
        const {heap: heap, allocator: allocator} = carrier, foundNodePtrToPtr = hashMapNodeLookup(heap, mapPointer, externalKeyValue);
        if (0 === foundNodePtrToPtr) return 0;
        const nodeToDeletePointer = heap.Uint32Array[foundNodePtrToPtr / Uint32Array.BYTES_PER_ELEMENT], valuePointer = nodeToDeletePointer + 0;
        return function linkedListItemRemove({heap: heap, allocator: allocator}, itemPointer) {
            const memoryToFree = linkedListItem_NEXT_POINTER_get(heap, itemPointer);
            linkedListItem_set_all(heap, itemPointer, linkedListItem_NEXT_POINTER_get(heap, memoryToFree), linkedListItem_VALUE_get(heap, memoryToFree)), 
            allocator.free(memoryToFree);
        }(carrier, hashmapNode_LINKED_LIST_ITEM_POINTER_get(heap, nodeToDeletePointer)), 
        heap.Uint32Array[foundNodePtrToPtr / Uint32Array.BYTES_PER_ELEMENT] = hashmapNode_NEXT_NODE_POINTER_get(heap, nodeToDeletePointer), 
        typeOnly_type_get(heap, hashmapNode_KEY_POINTER_get(heap, nodeToDeletePointer)) === ENTRY_TYPE.STRING && allocator.free(string_charsPointer_get(heap, hashmapNode_KEY_POINTER_get(heap, nodeToDeletePointer))), 
        allocator.free(hashmapNode_KEY_POINTER_get(heap, nodeToDeletePointer)), allocator.free(nodeToDeletePointer), 
        hashmap_LINKED_LIST_SIZE_set(heap, mapPointer, hashmap_LINKED_LIST_SIZE_get(heap, mapPointer) - 1), 
        valuePointer;
    }(carrier, hashmapPointer, keyToDeleteBy);
    return 0 !== deletedValuePointerToPointer && (handleArcForDeletedValuePointer(carrier, carrier.heap.Uint32Array[deletedValuePointerToPointer / Uint32Array.BYTES_PER_ELEMENT]), 
    !0);
}

function getObjectPropertiesEntries(carrier, hashmapPointer) {
    let iterator = 0;
    const foundValues = [];
    for (;iterator = hashMapLowLevelIterator(carrier.heap, hashmapPointer, iterator); ) {
        const {valuePointer: valuePointer, keyPointer: keyPointer} = hashMapNodePointerToKeyValue(carrier.heap, iterator), key = typeOnly_type_get(carrier.heap, keyPointer) === ENTRY_TYPE.NUMBER ? number_value_get(carrier.heap, keyPointer) : readString(carrier.heap, keyPointer);
        foundValues.push({
            valuePointer: carrier.heap.Uint32Array[valuePointer / Uint32Array.BYTES_PER_ELEMENT],
            key: key
        });
    }
    return foundValues;
}

function objectSet(externalArgs, carrier, hashMapPointer, p, value) {
    carrier.allocator.transaction(() => {
        const ptrToPtr = function hashMapInsertUpdate(externalArgs, carrier, mapPointer, externalKeyValue) {
            const {heap: heap, allocator: allocator} = carrier, memoryForNewNode = allocator.calloc(16);
            let keyMemoryEntryPointer, keyDataMemoryStart, keyDataMemoryLength;
            "number" == typeof externalKeyValue ? (keyMemoryEntryPointer = allocator.calloc(16), 
            number_set_all(carrier.heap, keyMemoryEntryPointer, ENTRY_TYPE.NUMBER, externalKeyValue), 
            keyDataMemoryStart = keyMemoryEntryPointer + 8, keyDataMemoryLength = number_value_ctor.BYTES_PER_ELEMENT) : (keyMemoryEntryPointer = allocator.calloc(20), 
            keyDataMemoryLength = stringLengthV2(externalKeyValue), keyDataMemoryStart = allocator.calloc(keyDataMemoryLength), 
            stringEncodeInto(carrier.heap.Uint8Array, keyDataMemoryStart, externalKeyValue), 
            string_set_all(carrier.heap, keyMemoryEntryPointer, ENTRY_TYPE.STRING, 1, keyDataMemoryLength, keyDataMemoryStart));
            const bucket = hashUint8CodeInPlace(heap.Uint8Array, keyDataMemoryStart, keyDataMemoryLength) % hashmap_CAPACITY_get(heap, mapPointer), bucketStartPointer = hashmap_ARRAY_POINTER_get(heap, mapPointer) + bucket * Uint32Array.BYTES_PER_ELEMENT;
            let ptrToPtrToSaveTheNodeTo = bucketStartPointer, iteratedNodePointer = heap.Uint32Array[ptrToPtrToSaveTheNodeTo / Uint32Array.BYTES_PER_ELEMENT];
            for (;0 !== iteratedNodePointer && !compareStringOrNumberEntriesInPlace(carrier.heap, hashmapNode_KEY_POINTER_get(heap, iteratedNodePointer), keyMemoryEntryPointer); ) ptrToPtrToSaveTheNodeTo = iteratedNodePointer + 4, 
            iteratedNodePointer = hashmapNode_NEXT_NODE_POINTER_get(heap, iteratedNodePointer);
            return ptrToPtrToSaveTheNodeTo === bucketStartPointer && hashmap_USED_CAPACITY_set(heap, mapPointer, hashmap_USED_CAPACITY_get(heap, mapPointer) + 1), 
            0 !== iteratedNodePointer ? (typeOnly_type_get(carrier.heap, keyMemoryEntryPointer) === ENTRY_TYPE.STRING && allocator.free(string_charsPointer_get(carrier.heap, keyMemoryEntryPointer)), 
            allocator.free(keyMemoryEntryPointer), allocator.free(memoryForNewNode), iteratedNodePointer + 0) : (iteratedNodePointer = memoryForNewNode, 
            hashmapNode_set_all(heap, iteratedNodePointer, 0, 0, keyMemoryEntryPointer, linkedListItemInsert(carrier, hashmap_LINKED_LIST_POINTER_get(heap, mapPointer), memoryForNewNode)), 
            heap.Uint32Array[ptrToPtrToSaveTheNodeTo / Uint32Array.BYTES_PER_ELEMENT] = memoryForNewNode, 
            hashmap_LINKED_LIST_SIZE_set(heap, mapPointer, hashmap_LINKED_LIST_SIZE_get(heap, mapPointer) + 1), 
            shouldRehash(hashmap_CAPACITY_get(heap, mapPointer), hashmap_USED_CAPACITY_get(heap, mapPointer), externalArgs.hashMapLoadFactor) && hashMapRehash(carrier, mapPointer, 2 * hashmap_CAPACITY_get(heap, mapPointer)), 
            iteratedNodePointer + 0);
        }(externalArgs, carrier, hashMapPointer, p);
        !function writeValueInPtrToPtrAndHandleMemory(externalArgs, carrier, ptrToPtr, value) {
            const existingEntryPointer = carrier.heap.Uint32Array[ptrToPtr / Uint32Array.BYTES_PER_ELEMENT], referencedPointers = function writeValueInPtrToPtr(externalArgs, carrier, ptrToPtr, value) {
                const referencedPointers = [];
                return saveValueIterative(externalArgs, carrier, referencedPointers, ptrToPtr, value), 
                referencedPointers;
            }(externalArgs, carrier, ptrToPtr, value);
            if (referencedPointers.length > 0) for (const ptr of referencedPointers) incrementRefCount(carrier.heap, ptr);
            handleArcForDeletedValuePointer(carrier, existingEntryPointer);
        }(externalArgs, carrier, ptrToPtr, value);
    });
}

function objectGet(externalArgs, carrier, entryPointer, key) {
    const valuePointer = function hashMapValueLookup(heap, mapPointer, externalKeyValue) {
        const nodePtrToPtr = hashMapNodeLookup(heap, mapPointer, externalKeyValue);
        return 0 === nodePtrToPtr ? 0 : heap.Uint32Array[nodePtrToPtr / Uint32Array.BYTES_PER_ELEMENT] + 0;
    }(carrier.heap, entryPointer, key);
    return entryToFinalJavaScriptValue(externalArgs, carrier, carrier.heap.Uint32Array[valuePointer / Uint32Array.BYTES_PER_ELEMENT]);
}

function mapOrSetClear(externalArgs, carrier, mapOrSetPtr) {
    const prevCount = typeAndRc_refsCount_get(carrier.heap, mapOrSetPtr);
    typeAndRc_refsCount_set(carrier.heap, mapOrSetPtr, 0);
    const {leafAddresses: leafAddresses, arcAddresses: arcAddresses} = getAllLinkedAddresses(carrier.heap, !1, mapOrSetPtr);
    for (const address of leafAddresses) address !== mapOrSetPtr && carrier.allocator.free(address);
    for (const [address, count] of arcAddresses) address !== mapOrSetPtr && decrementRefCountWithNum(carrier.heap, address, count);
    typeAndRc_refsCount_set(carrier.heap, mapOrSetPtr, prevCount), function object_pointerToHashMap_set(heap, structPointer, value) {
        heap.Uint32Array[(structPointer + 12) / 4] = value;
    }(carrier.heap, mapOrSetPtr, createHashMap(carrier, externalArgs.hashMapMinInitialCapacity));
}

class ObjectWrapper extends BaseProxyTrap {
    get(target, p) {
        return p === INTERNAL_API_SYMBOL ? this : "symbol" != typeof p ? objectGet(this.externalArgs, this.carrier, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer), p) : void 0;
    }
    deleteProperty(target, p) {
        return "symbol" != typeof p && deleteObjectPropertyEntryByKey(this.carrier, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer), p);
    }
    enumerate() {
        return getObjectPropertiesEntries(this.carrier, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer)).map(e => e.key);
    }
    ownKeys() {
        return getObjectPropertiesEntries(this.carrier, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer)).map(e => e.key);
    }
    getOwnPropertyDescriptor(target, p) {
        if (this.has(target, p)) return {
            configurable: !0,
            enumerable: !0
        };
    }
    has(target, p) {
        return p === INTERNAL_API_SYMBOL || "symbol" != typeof p && 0 !== hashMapNodeLookup(this.carrier.heap, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer), p);
    }
    set(target, p, value) {
        if ("symbol" == typeof p) throw new IllegalObjectPropConfigError;
        return objectSet(this.externalArgs, this.carrier, object_pointerToHashMap_get(this.carrier.heap, this.entryPointer), p, value), 
        !0;
    }
    isExtensible() {
        return !0;
    }
    preventExtensions() {
        throw new UnsupportedOperationError;
    }
    setPrototypeOf() {
        throw new UnsupportedOperationError;
    }
    defineProperty() {
        throw new UnsupportedOperationError;
    }
}

function createObjectWrapper(externalArgs, globalCarrier, entryPointer) {
    return new Proxy({
        objectBufferWrapper: "objectBufferWrapper"
    }, new ObjectWrapper(externalArgs, globalCarrier, entryPointer));
}

const typedArrays = {
    Uint8Array: Uint8Array,
    Uint8ClampedArray: Uint8ClampedArray,
    Int8Array: Int8Array,
    Uint16Array: Uint16Array,
    Int16Array: Int16Array,
    Uint32Array: Uint32Array,
    Int32Array: Int32Array,
    Float32Array: Float32Array,
    Float64Array: Float64Array,
    BigInt64Array: BigInt64Array,
    BigUint64Array: BigUint64Array
};

function createHeap(sb) {
    return Object.fromEntries(Object.entries(typedArrays).map(([name, Ctor]) => [ name, new Ctor(sb) ]));
}

function malloc(allocatorState, bytes) {
    if (bytes <= 0) return 0;
    const state = allocatorState.state, u32 = allocatorState.u32, paddedSize = align(bytes + 8, get_align(state)), end = get_end(state);
    let top = get_top(state), block = get__free(state), prev = 0;
    for (;block; ) {
        const itrBlockSize = blockSize(u32, block), isTop = block + itrBlockSize >= top;
        if (isTop || itrBlockSize >= paddedSize) {
            if (isTop && block + paddedSize > end) return 0;
            if (prev ? unlinkBlock(u32, prev, block) : set__free(state, blockNext(u32, block)), 
            setBlockNext(u32, block, get__used(state)), set__used(state, block), isTop) set_top(state, block + setBlockSize(u32, block, paddedSize)); else if (get_doSplit(state)) {
                const excess = itrBlockSize - paddedSize;
                excess >= get_minSplit(state) && splitBlock(state, u32, block, paddedSize, excess);
            }
            return blockDataAddress(block);
        }
        prev = block, block = blockNext(u32, block);
    }
    return block = top, top = block + paddedSize, top <= end ? (initBlock(u32, block, paddedSize, get__used(state)), 
    set__used(state, block), set_top(state, top), blockDataAddress(block)) : 0;
}

function free(allocatorState, ptr) {
    const state = allocatorState.state, u32 = allocatorState.u32;
    let addr = ptr;
    addr = blockSelfAddress(addr);
    let block = get__used(state), prev = 0;
    for (;block; ) {
        if (block === addr) return prev ? unlinkBlock(u32, prev, block) : set__used(state, blockNext(u32, block)), 
        insert(state, u32, block), get_doCompact(state) && compact(state, u32), !0;
        prev = block, block = blockNext(u32, block);
    }
    return !1;
}

function invariant$1(assertionResult, message) {
    if (!assertionResult) throw new Error("Invariant: " + message);
}

function get_align(state) {
    return state[4];
}

function get_end(state) {
    return state[3];
}

function set_end(state, x) {
    state[3] = x;
}

function get_top(state) {
    return state[2];
}

function set_top(state, x) {
    state[2] = x;
}

function get__free(state) {
    return state[0];
}

function set__free(state, block) {
    state[0] = block;
}

function get__used(state) {
    return state[1];
}

function set__used(state, block) {
    state[1] = block;
}

function get_doCompact(state) {
    return !!(1 & state[5]);
}

function get_doSplit(state) {
    return !!(2 & state[5]);
}

function get_minSplit(state) {
    return state[6];
}

function initialTop(start, _align) {
    return align(start + 28 + 8, _align) - 8;
}

function blockSize(u32, block) {
    return u32[0 + (block >> 2)];
}

function setBlockSize(u32, block, size) {
    return u32[0 + (block >> 2)] = size, size;
}

function blockNext(u32, block) {
    return u32[1 + (block >> 2)];
}

function setBlockNext(u32, block, next) {
    u32[1 + (block >> 2)] = next;
}

function initBlock(u32, block, size, next) {
    const idx = block >>> 2;
    return u32[idx + 0] = size, u32[idx + 1] = next, block;
}

function unlinkBlock(u32, prev, block) {
    setBlockNext(u32, prev, blockNext(u32, block));
}

function splitBlock(stateU32, u32, block, blockSize, excess) {
    insert(stateU32, u32, initBlock(u32, block + setBlockSize(u32, block, blockSize), excess, 0)), 
    get_doCompact(stateU32) && compact(stateU32, u32);
}

function compact(stateU32, u32) {
    let scanPrev, block = get__free(stateU32), prev = 0, scan = 0, res = !1;
    for (;block; ) {
        for (scanPrev = block, scan = blockNext(u32, block); scan && scanPrev + blockSize(u32, scanPrev) === scan; ) scanPrev = scan, 
        scan = blockNext(u32, scan);
        if (scanPrev !== block) {
            setBlockSize(u32, block, scanPrev - block + blockSize(u32, scanPrev));
            const next = blockNext(u32, scanPrev);
            let tmp = blockNext(u32, block);
            for (;tmp && tmp !== next; ) {
                const tn = blockNext(u32, tmp);
                setBlockNext(u32, tmp, 0), tmp = tn;
            }
            setBlockNext(u32, block, next), res = !0;
        }
        block + blockSize(u32, block) >= get_top(stateU32) && (set_top(stateU32, block), 
        0 !== prev ? unlinkBlock(u32, prev, block) : set__free(stateU32, blockNext(u32, block))), 
        prev = block, block = blockNext(u32, block);
    }
    return res;
}

function insert(stateU32, u32, block) {
    let ptr = get__free(stateU32), prev = 0;
    for (;ptr && !(block <= ptr); ) prev = ptr, ptr = blockNext(u32, ptr);
    prev ? setBlockNext(u32, prev, block) : set__free(stateU32, block), setBlockNext(u32, block, ptr);
}

function blockDataAddress(blockAddress) {
    return blockAddress + 8;
}

function blockSelfAddress(dataAddress) {
    return dataAddress - 8;
}

function align(addr, size) {
    return addr + --size & ~size;
}

class TransactionalAllocator {
    static load(ab) {
        const state = function loadAllocator(buf, start) {
            const u8 = new Uint8Array(buf), u32 = new Uint32Array(buf), state = new Uint32Array(buf, start, 7);
            return {
                options: {
                    start: start,
                    end: get_end(state),
                    size: buf.byteLength,
                    align: get_align(state),
                    split: get_doSplit(state),
                    minSplit: get_minSplit(state),
                    compact: get_doCompact(state)
                },
                u8: u8,
                u32: u32,
                state: state
            };
        }(ab, MEM_POOL_START);
        return new TransactionalAllocator(state);
    }
    constructor(optsOrState, useSharedArrayBuffer = !1) {
        var _ref, _optsOrState$end;
        this.allocatorState = "u8" in optsOrState ? optsOrState : function allocatorInit(options, useShareArrayBuffer = !1) {
            invariant$1(options.align >= 8, "align must be >= 8"), invariant$1(options.align % 8 == 0, "align must be multiplication of 8");
            const buf = useShareArrayBuffer ? new SharedArrayBuffer(options.size) : new ArrayBuffer(options.size), u8 = new Uint8Array(buf), u32 = new Uint32Array(buf), state = new Uint32Array(buf, options.start, 7), top = initialTop(options.start, options.align), resolvedEnd = null != options.end ? Math.min(options.end, buf.byteLength) : buf.byteLength;
            if (function set_align(state, x) {
                state[4] = x;
            }(state, options.align), function set_doCompact(state, flag) {
                flag ? state[5] |= 1 : state[5] &= -2;
            }(state, options.compact), function set_doSplit(state, flag) {
                flag ? state[5] |= 2 : state[5] &= -3;
            }(state, options.split), function set_minSplit(state, x) {
                invariant$1(x > 8, `illegal min split threshold: ${x}, require at least 9`), state[6] = x;
            }(state, options.minSplit), set_end(state, resolvedEnd), set_top(state, top), set__free(state, 0), 
            set__used(state, 0), top >= resolvedEnd) throw new Error(`insufficient address range (0x${options.start.toString(16)} - 0x${resolvedEnd.toString(16)})`);
            return {
                options: options,
                u8: u8,
                u32: u32,
                state: state
            };
        }({
            size: 4096,
            start: MEM_POOL_START,
            end: null !== (_ref = null !== (_optsOrState$end = optsOrState.end) && void 0 !== _optsOrState$end ? _optsOrState$end : optsOrState.size) && void 0 !== _ref ? _ref : 4096,
            align: 8,
            compact: !0,
            split: !0,
            minSplit: 16,
            ...optsOrState
        }, useSharedArrayBuffer), this.inTransaction = !1, this.transactionAddresses = [];
    }
    getArrayBuffer() {
        return this.allocatorState.u32.buffer;
    }
    release() {
        return !0;
    }
    calloc(bytes, fill) {
        if (0 === bytes) return 0;
        const address = function calloc(allocatorState, bytes, fill = 0) {
            const addr = malloc(allocatorState, bytes);
            return addr && allocatorState.u8.fill(fill, addr, addr + bytes), addr;
        }(this.allocatorState, bytes, fill);
        if (0 === address) {
            if (this.transactionAddresses.length > 0) for (const block of this.transactionAddresses) this.free(block);
            throw this.endTransaction(), new OutOfMemoryError;
        }
        return this.transactionAddresses.push(address), address;
    }
    realloc(ptr, size) {
        if (0 === size) return 0;
        const address = function realloc(allocatorState, ptr, bytes) {
            if (bytes <= 0) return 0;
            const state = allocatorState.state, u32 = allocatorState.u32, u8 = allocatorState.u8, oldAddr = blockSelfAddress(ptr);
            let newAddr = 0, block = get__used(state), blockEnd = 0;
            for (;block; ) {
                if (block === oldAddr) {
                    const itrBlockSize = blockSize(u32, block);
                    blockEnd = oldAddr + itrBlockSize;
                    const isTop = blockEnd >= get_top(state), paddedSize = align(bytes + 8, get_align(state));
                    if (paddedSize <= itrBlockSize) {
                        if (get_doSplit(state)) {
                            const excess = itrBlockSize - paddedSize;
                            excess >= get_minSplit(state) ? splitBlock(state, u32, block, paddedSize, excess) : isTop && set_top(state, oldAddr + paddedSize);
                        } else isTop && set_top(state, oldAddr + paddedSize);
                        newAddr = oldAddr;
                        break;
                    }
                    if (isTop && oldAddr + paddedSize < get_end(state)) {
                        set_top(state, oldAddr + setBlockSize(u32, block, paddedSize)), newAddr = oldAddr;
                        break;
                    }
                    free(allocatorState, oldAddr), newAddr = blockSelfAddress(malloc(allocatorState, bytes));
                    break;
                }
                block = blockNext(u32, block);
            }
            return newAddr && newAddr !== oldAddr && u8.copyWithin(blockDataAddress(newAddr), blockDataAddress(oldAddr), blockEnd), 
            blockDataAddress(newAddr);
        }(this.allocatorState, ptr, size);
        if (0 === address) {
            if (this.transactionAddresses.length > 0) for (const block of this.transactionAddresses) this.free(block);
            throw this.endTransaction(), new OutOfMemoryError;
        }
        return address !== ptr && this.transactionAddresses.push(address), address;
    }
    free(ptr) {
        return free(this.allocatorState, ptr);
    }
    freeAll() {
        !function freeAll(allocatorState) {
            const state = allocatorState.state, options = allocatorState.options;
            set__free(state, 0), set__used(state, 0), set_top(state, initialTop(options.start, get_align(state)));
        }(this.allocatorState);
    }
    stats() {
        return function stats(allocatorState) {
            const listStats = block => {
                let count = 0, size = 0;
                for (;block; ) count++, size += blockSize(allocatorState.u32, block), block = blockNext(allocatorState.u32, block);
                return {
                    count: count,
                    size: size
                };
            }, free = listStats(get__free(allocatorState.state));
            return {
                free: free,
                used: listStats(get__used(allocatorState.state)),
                top: get_top(allocatorState.state),
                available: get_end(allocatorState.state) - get_top(allocatorState.state) + free.size,
                total: allocatorState.u8.buffer.byteLength
            };
        }(this.allocatorState);
    }
    setNewEnd(newEnd) {
        !function setEnd(allocatorState, newEnd) {
            set_end(allocatorState.state, newEnd);
        }(this.allocatorState, newEnd);
    }
    malloc(bytes) {
        if (0 === bytes) return 0;
        const address = malloc(this.allocatorState, bytes);
        if (0 === address) {
            if (this.transactionAddresses.length > 0) for (const block of this.transactionAddresses) this.free(block);
            throw this.endTransaction(), new OutOfMemoryError;
        }
        return this.transactionAddresses.push(address), address;
    }
    transaction(cmd) {
        this.startTransaction();
        try {
            return cmd();
        } finally {
            this.endTransaction();
        }
    }
    startTransaction() {
        this.inTransaction = !0;
    }
    endTransaction() {
        this.inTransaction = !1, this.transactionAddresses = [];
    }
}

function disposeWrapperObject(value) {
    const internalApi = getInternalAPI(value), entryPointer = internalApi.getEntryPointer(), newRefCount = internalApi.destroy();
    if (getCacheFor(internalApi.getCarrier()).delete(entryPointer), 0 === newRefCount) {
        const addressesToFree = getAllLinkedAddresses(internalApi.getCarrier().heap, !1, entryPointer), {allocator: allocator, heap: heap} = internalApi.getCarrier();
        for (const address of addressesToFree.leafAddresses) allocator.free(address);
        for (const [address, count] of addressesToFree.arcAddresses) decrementRefCountWithNum(heap, address, count);
        return !0;
    }
    return !1;
}

function createObjectBuffer(externalArgs, size, initialValue, options = {}) {
    if (!function isSupportedTopLevelValue(value) {
        return !(Array.isArray(value) || value instanceof Date || value instanceof Map || value instanceof Set || "object" != typeof value || null === typeof value || "Object" !== value.constructor.name);
    }(initialValue)) throw new UnsupportedOperationError;
    const allocator = new TransactionalAllocator({
        start: MEM_POOL_START,
        size: size
    }, !!options.useSharedArrayBuffer), arrayBuffer = allocator.getArrayBuffer();
    !function initializeArrayBuffer(arrayBuffer) {
        const uint32 = new Uint32Array(arrayBuffer);
        uint32[0] = 0, uint32[INITIAL_ENTRY_POINTER_TO_POINTER / Uint32Array.BYTES_PER_ELEMENT] = INITIAL_ENTRY_POINTER_VALUE;
    }(arrayBuffer);
    const carrier = {
        allocator: allocator,
        heap: createHeap(arrayBuffer)
    }, referencedPointers = [];
    allocator.transaction(() => {
        saveValueIterative(externalArgsApiToExternalArgsApi(externalArgs), carrier, referencedPointers, INITIAL_ENTRY_POINTER_TO_POINTER, initialValue);
    });
    for (const pointer of referencedPointers) incrementRefCount(carrier.heap, pointer);
    return new DataView(arrayBuffer).setUint32(ENDIANNESS_FLAG_POINTER, getEndiannessOfSystem(), !0), 
    createObjectWrapper(externalArgsApiToExternalArgsApi(externalArgs), carrier, carrier.heap.Uint32Array[INITIAL_ENTRY_POINTER_TO_POINTER / Uint32Array.BYTES_PER_ELEMENT]);
}

function resizeObjectBuffer(objectBuffer, newSize) {
    const oldArrayBuffer = getUnderlyingArrayBuffer(objectBuffer), newArrayBuffer = new ArrayBuffer(newSize);
    return function arrayBufferCopyTo(origin, startByte, length, target, toTargetByte) {
        const copyFrom = new Uint8Array(origin);
        new Uint8Array(target).set(copyFrom.subarray(startByte, startByte + length), toTargetByte);
    }(oldArrayBuffer, 0, Math.min(newSize, oldArrayBuffer.byteLength), newArrayBuffer, 0), 
    replaceUnderlyingArrayBuffer(objectBuffer, newArrayBuffer), newArrayBuffer;
}

function getUnderlyingArrayBuffer(objectBuffer) {
    return getInternalAPI(objectBuffer).getCarrier().heap.Uint8Array.buffer;
}

function loadObjectBuffer(externalArgs, arrayBuffer) {
    const carrier = {
        allocator: TransactionalAllocator.load(arrayBuffer),
        heap: createHeap(arrayBuffer)
    };
    if (new DataView(arrayBuffer).getUint32(ENDIANNESS_FLAG_POINTER, !0) !== getEndiannessOfSystem()) throw new Error("Endianness miss-match");
    return createObjectWrapper(externalArgsApiToExternalArgsApi(externalArgs), carrier, carrier.heap.Uint32Array[INITIAL_ENTRY_POINTER_TO_POINTER / Uint32Array.BYTES_PER_ELEMENT]);
}

function replaceUnderlyingArrayBuffer(objectBuffer, newArrayBuffer) {
    const allocator = TransactionalAllocator.load(newArrayBuffer), carrier = {
        allocator: allocator,
        heap: createHeap(newArrayBuffer)
    };
    if (new DataView(newArrayBuffer).getUint32(ENDIANNESS_FLAG_POINTER, !0) !== getEndiannessOfSystem()) throw new Error("Endianness miss-match");
    allocator.setNewEnd(newArrayBuffer.byteLength), getInternalAPI(objectBuffer).replaceCarrierContent(carrier);
}

function memoryStats(objectBuffer) {
    const {available: available, total: total, top: top} = getInternalAPI(objectBuffer).getCarrier().allocator.stats();
    return {
        available: available,
        used: total - available,
        total: total,
        top: top
    };
}

function updateExternalArgs(objectBuffer, options) {
    Object.assign(getInternalAPI(objectBuffer).getExternalArgs(), options);
}

function acquireLock(agentId, objectBuffer) {
    const sab = getUnderlyingArrayBuffer(objectBuffer);
    !function invariant(condition, message) {
        if (!condition) throw new Error(message);
    }(agentId > 0, "agentId must be more than 0");
    const int32 = new Int32Array(sab);
    return 0 === Atomics.compareExchange(int32, 0, 0, agentId);
}

function releaseLock(agentId, objectBuffer) {
    const sab = getUnderlyingArrayBuffer(objectBuffer), int32 = new Int32Array(sab);
    return Atomics.compareExchange(int32, 0, agentId, 0) === agentId && (Atomics.notify(int32, 0, 1 / 0), 
    !0);
}

function acquireLockWait(agentId, objectBuffer, timeout) {
    const sab = getUnderlyingArrayBuffer(objectBuffer), int32 = new Int32Array(sab), oldValue = Atomics.compareExchange(int32, 0, 0, agentId);
    if (0 === oldValue) return "have-lock";
    const r = Atomics.wait(int32, 0, oldValue, timeout);
    return "not-equal" === r ? 0 === Atomics.compareExchange(int32, 0, 0, agentId) ? "have-lock" : "miss-lock" : "timed-out" === r ? "timed-out" : "no-lock";
}

export { acquireLock, acquireLockWait, createObjectBuffer, disposeWrapperObject, getUnderlyingArrayBuffer, loadObjectBuffer, memoryStats, releaseLock, replaceUnderlyingArrayBuffer, resizeObjectBuffer, updateExternalArgs };
//# sourceMappingURL=objectbuffer.esm.js.map
