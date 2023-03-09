import {
  malloc,
  free,
  realloc,
  listFreeBlocks,
  listAllocatedBlocks,
  stats,
  allocatorInit,
} from "./functional";
import type { AllocatorState } from "./functionalInterfaces";

let allocatorState: AllocatorState;

describe("next gen", () => {
  beforeEach(() => {
    allocatorState = allocatorInit({
      size: 0x200,
      align: 8,
      start: 0,
      end: 0x200,
      compact: true,
      split: true,
      minSplit: 24,
    });
  });

  test("Before any allocation", () => {
    expect(listFreeBlocks(allocatorState)).toMatchInlineSnapshot(`[]`);
    expect(listAllocatedBlocks(allocatorState)).toMatchInlineSnapshot(`[]`);
    expect(stats(allocatorState)).toMatchInlineSnapshot(`
      {
        "available": 480,
        "free": {
          "count": 0,
          "size": 0,
        },
        "top": 32,
        "total": 512,
        "used": {
          "count": 0,
          "size": 0,
        },
      }
    `);
  });
  describe("Allocate", () => {
    test("Allocate single block", () => {
      const allocatedPointer = malloc(allocatorState, 8);
      expect(allocatedPointer).toMatchInlineSnapshot(`48`);

      expect(listFreeBlocks(allocatorState)).toMatchInlineSnapshot(`[]`);
      expect(listAllocatedBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 32,
            "dataPointer": 48,
            "dataSize": 8,
            "next": 0,
            "prev": 0,
            "size": 24,
          },
        ]
      `);
      expect(stats(allocatorState)).toMatchInlineSnapshot(`
        {
          "available": 456,
          "free": {
            "count": 0,
            "size": 0,
          },
          "top": 56,
          "total": 512,
          "used": {
            "count": 1,
            "size": 24,
          },
        }
      `);
    });

    test("Allocate 2 blocks and free the first one", () => {
      const allocatedPointer1 = malloc(allocatorState, 8);
      const allocatedPointer2 = malloc(allocatorState, 16);
      expect(allocatedPointer1).toMatchInlineSnapshot(`48`);
      expect(allocatedPointer2).toMatchInlineSnapshot(`72`);

      expect(listFreeBlocks(allocatorState)).toHaveLength(0);
      expect(listAllocatedBlocks(allocatorState)).toHaveLength(2);
      expect(listAllocatedBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 56,
            "dataPointer": 72,
            "dataSize": 16,
            "next": 32,
            "prev": 0,
            "size": 32,
          },
          {
            "blockPointer": 32,
            "dataPointer": 48,
            "dataSize": 8,
            "next": 0,
            "prev": 56,
            "size": 24,
          },
        ]
      `);
      const statsBeforeFree = stats(allocatorState);
      expect(statsBeforeFree);

      free(allocatorState, allocatedPointer1);
      expect(listFreeBlocks(allocatorState)).toHaveLength(1);
      expect(listAllocatedBlocks(allocatorState)).toHaveLength(1);

      const statsAfterFree = stats(allocatorState);

      expect(statsAfterFree.top).toBe(statsBeforeFree.top);

      expect(statsAfterFree).toMatchInlineSnapshot(`
        {
          "available": 448,
          "free": {
            "count": 1,
            "size": 24,
          },
          "top": 88,
          "total": 512,
          "used": {
            "count": 1,
            "size": 32,
          },
        }
      `);

      expect(listFreeBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 32,
            "dataPointer": 48,
            "dataSize": 8,
            "next": 0,
            "prev": 0,
            "size": 24,
          },
        ]
      `);
      expect(listAllocatedBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 56,
            "dataPointer": 72,
            "dataSize": 16,
            "next": 0,
            "prev": 0,
            "size": 32,
          },
        ]
      `);
    });

    test("Allocate 3 blocks, free the 2nd block", () => {
      const allocatedPointer1 = malloc(allocatorState, 8);
      const allocatedPointer2 = malloc(allocatorState, 8);
      const allocatedPointer3 = malloc(allocatorState, 8);

      expect(allocatedPointer1).toMatchInlineSnapshot(`48`);
      expect(allocatedPointer2).toMatchInlineSnapshot(`72`);
      expect(allocatedPointer3).toMatchInlineSnapshot(`96`);

      free(allocatorState, allocatedPointer2);

      expect(stats(allocatorState)).toMatchInlineSnapshot(`
        {
          "available": 432,
          "free": {
            "count": 1,
            "size": 24,
          },
          "top": 104,
          "total": 512,
          "used": {
            "count": 2,
            "size": 48,
          },
        }
      `);

      expect(listFreeBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 56,
            "dataPointer": 72,
            "dataSize": 8,
            "next": 0,
            "prev": 0,
            "size": 24,
          },
        ]
      `);
      expect(listAllocatedBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 80,
            "dataPointer": 96,
            "dataSize": 8,
            "next": 32,
            "prev": 0,
            "size": 24,
          },
          {
            "blockPointer": 32,
            "dataPointer": 48,
            "dataSize": 8,
            "next": 0,
            "prev": 80,
            "size": 24,
          },
        ]
      `);
    });

    test("Allocate 3 blocks, free the 1st block", () => {
      const allocatedPointer1 = malloc(allocatorState, 8);
      const allocatedPointer2 = malloc(allocatorState, 8);
      const allocatedPointer3 = malloc(allocatorState, 8);

      expect(allocatedPointer1).toMatchInlineSnapshot(`48`);
      expect(allocatedPointer2).toMatchInlineSnapshot(`72`);
      expect(allocatedPointer3).toMatchInlineSnapshot(`96`);

      free(allocatorState, allocatedPointer1);

      expect(stats(allocatorState)).toMatchInlineSnapshot(`
        {
          "available": 432,
          "free": {
            "count": 1,
            "size": 24,
          },
          "top": 104,
          "total": 512,
          "used": {
            "count": 2,
            "size": 48,
          },
        }
      `);

      expect(listFreeBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 32,
            "dataPointer": 48,
            "dataSize": 8,
            "next": 0,
            "prev": 0,
            "size": 24,
          },
        ]
      `);
      expect(listAllocatedBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 80,
            "dataPointer": 96,
            "dataSize": 8,
            "next": 56,
            "prev": 0,
            "size": 24,
          },
          {
            "blockPointer": 56,
            "dataPointer": 72,
            "dataSize": 8,
            "next": 0,
            "prev": 80,
            "size": 24,
          },
        ]
      `);
    });

    test("Allocate 3 blocks, free the 3rd block", () => {
      const allocatedPointer1 = malloc(allocatorState, 8);
      const allocatedPointer2 = malloc(allocatorState, 8);
      const allocatedPointer3 = malloc(allocatorState, 8);

      expect(allocatedPointer1).toMatchInlineSnapshot(`48`);
      expect(allocatedPointer2).toMatchInlineSnapshot(`72`);
      expect(allocatedPointer3).toMatchInlineSnapshot(`96`);

      expect(stats(allocatorState).top).toBe(104);

      free(allocatorState, allocatedPointer3);

      // The freed block is merged into top
      expect(stats(allocatorState).top).toBe(80);
      expect(listFreeBlocks(allocatorState)).toHaveLength(0);

      expect(stats(allocatorState)).toMatchInlineSnapshot(`
        {
          "available": 432,
          "free": {
            "count": 0,
            "size": 0,
          },
          "top": 80,
          "total": 512,
          "used": {
            "count": 2,
            "size": 48,
          },
        }
      `);
      expect(listFreeBlocks(allocatorState)).toHaveLength(0);
      expect(listAllocatedBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 56,
            "dataPointer": 72,
            "dataSize": 8,
            "next": 32,
            "prev": 0,
            "size": 24,
          },
          {
            "blockPointer": 32,
            "dataPointer": 48,
            "dataSize": 8,
            "next": 0,
            "prev": 56,
            "size": 24,
          },
        ]
      `);
    });
  });

  describe("Block reuse", () => {
    test("Simple block reuse", () => {
      const allocatedPointer1 = malloc(allocatorState, 8);
      const allocatedPointer2 = malloc(allocatorState, 8);
      const allocatedPointer3 = malloc(allocatorState, 8);

      expect(allocatedPointer1).toMatchInlineSnapshot(`48`);
      expect(allocatedPointer2).toMatchInlineSnapshot(`72`);
      expect(allocatedPointer3).toMatchInlineSnapshot(`96`);

      const statsBeforeFree = stats(allocatorState);

      free(allocatorState, allocatedPointer2);

      const statsAfterFree = stats(allocatorState);

      expect(statsAfterFree.top).toBe(statsBeforeFree.top);

      expect(stats(allocatorState)).toMatchInlineSnapshot(`
        {
          "available": 432,
          "free": {
            "count": 1,
            "size": 24,
          },
          "top": 104,
          "total": 512,
          "used": {
            "count": 2,
            "size": 48,
          },
        }
      `);

      const blockThatShouldComeFromReuse = malloc(allocatorState, 8);
      expect(blockThatShouldComeFromReuse).toBe(allocatedPointer2);

      expect(stats(allocatorState)).toMatchInlineSnapshot(`
        {
          "available": 408,
          "free": {
            "count": 0,
            "size": 0,
          },
          "top": 104,
          "total": 512,
          "used": {
            "count": 3,
            "size": 72,
          },
        }
      `);

      expect(listFreeBlocks(allocatorState)).toHaveLength(0);
    });

    test("Block reuse / allocate 10, free 4, allocate 3", () => {
      const allocations = Array.from({ length: 10 }, () => {
        return malloc(allocatorState, 8);
      });

      expect(listAllocatedBlocks(allocatorState)).toHaveLength(10);

      const freeFrom = 0;
      const howMuchToFree = 4;

      for (let i = 0; i < howMuchToFree * 2; i += 2) {
        free(allocatorState, allocations[freeFrom + i]);
      }

      expect(listFreeBlocks(allocatorState)).toHaveLength(4);

      malloc(allocatorState, 8);
      malloc(allocatorState, 8);
      malloc(allocatorState, 8);

      expect(listFreeBlocks(allocatorState)).toHaveLength(1);
      expect(listAllocatedBlocks(allocatorState)).toHaveLength(9);

      expect(listAllocatedBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 128,
            "dataPointer": 144,
            "dataSize": 8,
            "next": 80,
            "prev": 0,
            "size": 24,
          },
          {
            "blockPointer": 80,
            "dataPointer": 96,
            "dataSize": 8,
            "next": 32,
            "prev": 128,
            "size": 24,
          },
          {
            "blockPointer": 32,
            "dataPointer": 48,
            "dataSize": 8,
            "next": 248,
            "prev": 80,
            "size": 24,
          },
          {
            "blockPointer": 248,
            "dataPointer": 264,
            "dataSize": 8,
            "next": 224,
            "prev": 32,
            "size": 24,
          },
          {
            "blockPointer": 224,
            "dataPointer": 240,
            "dataSize": 8,
            "next": 200,
            "prev": 248,
            "size": 24,
          },
          {
            "blockPointer": 200,
            "dataPointer": 216,
            "dataSize": 8,
            "next": 152,
            "prev": 224,
            "size": 24,
          },
          {
            "blockPointer": 152,
            "dataPointer": 168,
            "dataSize": 8,
            "next": 104,
            "prev": 200,
            "size": 24,
          },
          {
            "blockPointer": 104,
            "dataPointer": 120,
            "dataSize": 8,
            "next": 56,
            "prev": 152,
            "size": 24,
          },
          {
            "blockPointer": 56,
            "dataPointer": 72,
            "dataSize": 8,
            "next": 0,
            "prev": 104,
            "size": 24,
          },
        ]
      `);
      expect(listFreeBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 176,
            "dataPointer": 192,
            "dataSize": 8,
            "next": 0,
            "prev": 0,
            "size": 24,
          },
        ]
      `);
    });

    test("Block reuse / enlarge into top", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const allocated1 = malloc(allocatorState, 8);
      const allocated2 = malloc(allocatorState, 8);

      expect(listAllocatedBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 56,
            "dataPointer": 72,
            "dataSize": 8,
            "next": 32,
            "prev": 0,
            "size": 24,
          },
          {
            "blockPointer": 32,
            "dataPointer": 48,
            "dataSize": 8,
            "next": 0,
            "prev": 56,
            "size": 24,
          },
        ]
      `);

      free(allocatorState, allocated2);

      expect(listAllocatedBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 32,
            "dataPointer": 48,
            "dataSize": 8,
            "next": 0,
            "prev": 0,
            "size": 24,
          },
        ]
      `);
      expect(listFreeBlocks(allocatorState)).toMatchInlineSnapshot(`[]`);

      const shouldBeReusedBlock = malloc(allocatorState, 16);

      expect(shouldBeReusedBlock).toBe(allocated2);

      expect(listAllocatedBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 56,
            "dataPointer": 72,
            "dataSize": 16,
            "next": 32,
            "prev": 0,
            "size": 32,
          },
          {
            "blockPointer": 32,
            "dataPointer": 48,
            "dataSize": 8,
            "next": 0,
            "prev": 56,
            "size": 24,
          },
        ]
      `);
      expect(listFreeBlocks(allocatorState)).toHaveLength(0);
    });

    test("Block reuse / split block", () => {
      const allocated1 = malloc(allocatorState, 80);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const allocated2 = malloc(allocatorState, 80);

      free(allocatorState, allocated1);

      expect(listAllocatedBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 128,
            "dataPointer": 144,
            "dataSize": 80,
            "next": 0,
            "prev": 0,
            "size": 96,
          },
        ]
      `);
      expect(listFreeBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 32,
            "dataPointer": 48,
            "dataSize": 80,
            "next": 0,
            "prev": 0,
            "size": 96,
          },
        ]
      `);

      const shouldBeReused = malloc(allocatorState, 8);
      expect(shouldBeReused).toBe(allocated1);

      expect(listAllocatedBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 32,
            "dataPointer": 48,
            "dataSize": 8,
            "next": 128,
            "prev": 0,
            "size": 24,
          },
          {
            "blockPointer": 128,
            "dataPointer": 144,
            "dataSize": 80,
            "next": 0,
            "prev": 32,
            "size": 96,
          },
        ]
      `);
      expect(listFreeBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 56,
            "dataPointer": 72,
            "dataSize": 56,
            "next": 0,
            "prev": 0,
            "size": 72,
          },
        ]
      `);
    });

    test("Block reuse / don't split when too small", () => {
      const allocated1 = malloc(allocatorState, 80);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const allocated2 = malloc(allocatorState, 80);

      free(allocatorState, allocated1);

      expect(listAllocatedBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 128,
            "dataPointer": 144,
            "dataSize": 80,
            "next": 0,
            "prev": 0,
            "size": 96,
          },
        ]
      `);
      expect(listFreeBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 32,
            "dataPointer": 48,
            "dataSize": 80,
            "next": 0,
            "prev": 0,
            "size": 96,
          },
        ]
      `);

      const shouldBeReused = malloc(allocatorState, 72);
      expect(shouldBeReused).toBe(allocated1);

      expect(listAllocatedBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 32,
            "dataPointer": 48,
            "dataSize": 80,
            "next": 128,
            "prev": 0,
            "size": 96,
          },
          {
            "blockPointer": 128,
            "dataPointer": 144,
            "dataSize": 80,
            "next": 0,
            "prev": 32,
            "size": 96,
          },
        ]
      `);
      expect(listFreeBlocks(allocatorState)).toHaveLength(0);
    });
  });

  describe("Merge adjacent", () => {
    test("Merge adjacent-before blocks after free", () => {
      const allocations = [
        malloc(allocatorState, 8),
        malloc(allocatorState, 8),
        malloc(allocatorState, 8),
        malloc(allocatorState, 8),
        malloc(allocatorState, 8),
      ];

      expect(listAllocatedBlocks(allocatorState)).toHaveLength(5);
      expect(listFreeBlocks(allocatorState)).toHaveLength(0);

      free(allocatorState, allocations[2]);
      expect(listFreeBlocks(allocatorState)).toHaveLength(1);
      expect(listFreeBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 80,
            "dataPointer": 96,
            "dataSize": 8,
            "next": 0,
            "prev": 0,
            "size": 24,
          },
        ]
      `);
      free(allocatorState, allocations[1]);
      // merge
      expect(listFreeBlocks(allocatorState)).toHaveLength(1);
      expect(listFreeBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 56,
            "dataPointer": 72,
            "dataSize": 32,
            "next": 0,
            "prev": 0,
            "size": 48,
          },
        ]
      `);
    });
    test("Merge adjacent-next blocks after free", () => {
      const allocations = [
        malloc(allocatorState, 8),
        malloc(allocatorState, 8),
        malloc(allocatorState, 8),
        malloc(allocatorState, 8),
        malloc(allocatorState, 8),
      ];

      expect(listAllocatedBlocks(allocatorState)).toHaveLength(5);
      expect(listFreeBlocks(allocatorState)).toHaveLength(0);

      free(allocatorState, allocations[1]);
      expect(listFreeBlocks(allocatorState)).toHaveLength(1);
      expect(listFreeBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 56,
            "dataPointer": 72,
            "dataSize": 8,
            "next": 0,
            "prev": 0,
            "size": 24,
          },
        ]
      `);
      free(allocatorState, allocations[2]);
      expect(listFreeBlocks(allocatorState)).toHaveLength(1);
      expect(listFreeBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 56,
            "dataPointer": 72,
            "dataSize": 32,
            "next": 0,
            "prev": 0,
            "size": 48,
          },
        ]
      `);
    });
    test("Merge adjacent blocks after free from both sides", () => {
      const allocations = [
        malloc(allocatorState, 8),
        malloc(allocatorState, 8),
        malloc(allocatorState, 8),
        malloc(allocatorState, 8),
        malloc(allocatorState, 8),
      ];

      expect(stats(allocatorState).top).toEqual(152);
      free(allocatorState, allocations[1]);
      free(allocatorState, allocations[3]);
      expect(stats(allocatorState).top).toEqual(152);
      expect(listFreeBlocks(allocatorState)).toHaveLength(2);
      expect(listFreeBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 56,
            "dataPointer": 72,
            "dataSize": 8,
            "next": 104,
            "prev": 0,
            "size": 24,
          },
          {
            "blockPointer": 104,
            "dataPointer": 120,
            "dataSize": 8,
            "next": 0,
            "prev": 56,
            "size": 24,
          },
        ]
      `);
      free(allocatorState, allocations[2]);
      expect(stats(allocatorState).top).toEqual(152);

      expect(listFreeBlocks(allocatorState)).toHaveLength(1);
      expect(listFreeBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 56,
            "dataPointer": 72,
            "dataSize": 56,
            "next": 0,
            "prev": 0,
            "size": 72,
          },
        ]
      `);
      expect(listAllocatedBlocks(allocatorState)).toMatchInlineSnapshot(`
        [
          {
            "blockPointer": 128,
            "dataPointer": 144,
            "dataSize": 8,
            "next": 32,
            "prev": 0,
            "size": 24,
          },
          {
            "blockPointer": 32,
            "dataPointer": 48,
            "dataSize": 8,
            "next": 0,
            "prev": 128,
            "size": 24,
          },
        ]
      `);
    });

    test("Merge adjacent blocks + meld with top", () => {
      const allocations = [
        malloc(allocatorState, 8),
        malloc(allocatorState, 8),
        malloc(allocatorState, 8),
        malloc(allocatorState, 8),
        malloc(allocatorState, 8),
        malloc(allocatorState, 8),
      ];

      expect(stats(allocatorState).top).toBe(176);
      expect(stats(allocatorState).used.count).toBe(6);
      expect(stats(allocatorState).free.count).toBe(0);

      free(allocatorState, allocations[4]);
      free(allocatorState, allocations[2]);

      expect(stats(allocatorState).top).toBe(176);
      expect(stats(allocatorState).used.count).toBe(4);
      expect(stats(allocatorState).free.count).toBe(2);

      free(allocatorState, allocations[3]);

      expect(stats(allocatorState).top).toBe(176);
      expect(stats(allocatorState).used.count).toBe(3);
      expect(stats(allocatorState).free.count).toBe(1);
      free(allocatorState, allocations[5]);
      expect(stats(allocatorState).top).toBe(80);
      expect(stats(allocatorState).used.count).toBe(2);
      expect(stats(allocatorState).free.count).toBe(0);
    });
  });

  describe("realloc", () => {
    test("block is already is in size, no change is needed", () => {
      const allocation = malloc(allocatorState, 8);
      // we make this allocation so the first allocation won't be adjacent to top
      const anotherAllocation = malloc(allocatorState, 8);
      expect(anotherAllocation).toMatchInlineSnapshot(`72`);

      expect(stats(allocatorState).used.count).toBe(2);
      const afterRealloc = realloc(allocatorState, allocation, 8);
      expect(stats(allocatorState).used.count).toBe(2);
      expect(allocation).toBe(afterRealloc);
    });
    test("We are at top, oom when enlarge, fallback to malloc", () => {
      const allocations = [
        malloc(allocatorState, 100),
        malloc(allocatorState, 200),
        malloc(allocatorState, 100),
      ];

      expect(stats(allocatorState).used.count).toBe(3);

      free(allocatorState, allocations[1]);
      expect(stats(allocatorState).used.count).toBe(2);
      expect(stats(allocatorState).free.count).toBe(1);

      // fill all allocated space with 5's
      allocatorState.u32.fill(5, allocations[0] / 4, 100 / 4);

      const afterRealloc = realloc(allocatorState, allocations[0], 200);
      expect(afterRealloc).toBe(allocations[1]);
      expect(stats(allocatorState).used.count).toBe(2);
      expect(stats(allocatorState).free.count).toBe(1);

      // ensure the new area is all 5's
      expect(
        allocatorState.u32.slice(afterRealloc, 100).every((v) => v === 5)
      ).toBe(true);

      expect(afterRealloc).toBe(afterRealloc);
    });
    test("enlarge into top", () => {
      const allocation = malloc(allocatorState, 8);

      expect(stats(allocatorState).used.count).toBe(1);
      const afterRealloc = realloc(allocatorState, allocation, 16);
      expect(stats(allocatorState).used.count).toBe(1);
      expect(listAllocatedBlocks(allocatorState)[0].dataSize).toBe(16);
      expect(allocation).toBe(afterRealloc);
    });
    test("make smaller using top meld", () => {
      const allocation = malloc(allocatorState, 32);
      expect(stats(allocatorState).top).toBe(80);

      const afterRealloc = realloc(allocatorState, allocation, 8);
      expect(allocation).toBe(afterRealloc);
      expect(stats(allocatorState).top).toBe(56);

      expect(stats(allocatorState).used.count).toBe(1);
    });

    test("make smaller by split block", () => {
      const allocation = malloc(allocatorState, 80);
      // allocation So Wont Be Adjacent To Top
      malloc(allocatorState, 80);

      expect(stats(allocatorState).used.count).toBe(2);
      expect(stats(allocatorState).free.count).toBe(0);
      expect(stats(allocatorState).top).toBe(224);
      expect(listAllocatedBlocks(allocatorState)[0].dataSize).toBe(80);

      const afterRealloc = realloc(allocatorState, allocation, 8);
      expect(stats(allocatorState).used.count).toBe(2);
      expect(stats(allocatorState).free.count).toBe(1);
      expect(allocation).toBe(afterRealloc);

      expect(stats(allocatorState).top).toBe(224);
      expect(
        listAllocatedBlocks(allocatorState).find(
          (b) => b.dataPointer === allocation
        )?.dataSize
      ).toBe(8);
    });
    test("make smaller but can't split, dut to < monSplit so leave as is", () => {
      const allocation = malloc(allocatorState, 80);
      // allocation So Wont Be Adjacent To Top
      malloc(allocatorState, 80);

      expect(stats(allocatorState).used.count).toBe(2);
      expect(stats(allocatorState).free.count).toBe(0);
      expect(stats(allocatorState).top).toBe(224);
      expect(listAllocatedBlocks(allocatorState)[0].dataSize).toBe(80);

      const afterRealloc = realloc(allocatorState, allocation, 72);
      expect(stats(allocatorState).used.count).toBe(2);
      expect(stats(allocatorState).free.count).toBe(0);
      expect(allocation).toBe(afterRealloc);

      expect(stats(allocatorState).top).toBe(224);
      expect(
        listAllocatedBlocks(allocatorState).find(
          (b) => b.dataPointer === allocation
        )?.dataSize
      ).toBe(80);
    });

    test("allocate new bigger block, free old", () => {
      const allocation = malloc(allocatorState, 80);
      // allocation So Wont Be Adjacent To Top
      malloc(allocatorState, 8);

      expect(stats(allocatorState).used.count).toBe(2);
      expect(stats(allocatorState).free.count).toBe(0);
      expect(stats(allocatorState).top).toBe(152);
      expect(listAllocatedBlocks(allocatorState)[0].dataSize).toBe(8);

      const afterRealloc = realloc(allocatorState, allocation, 160);
      expect(stats(allocatorState).used.count).toBe(2);
      expect(stats(allocatorState).free.count).toBe(1);
      expect(afterRealloc).toBe(
        listAllocatedBlocks(allocatorState)[0].dataPointer
      );

      expect(stats(allocatorState).top).toBe(328);
    });

    test("oom when adjacent To Top", () => {
      malloc(allocatorState, 80);
      const allocation = malloc(allocatorState, 80);

      expect(stats(allocatorState).used.count).toBe(2);
      expect(stats(allocatorState).free.count).toBe(0);
      expect(stats(allocatorState).top).toBe(224);
      expect(listAllocatedBlocks(allocatorState)[0].dataSize).toBe(80);

      const statusBeforeOOM = stats(allocatorState);

      const afterRealloc = realloc(allocatorState, allocation, 400);
      // OOM
      expect(afterRealloc).toBe(0);

      // Make sure everything is the same - no state destruction due to oom
      expect(stats(allocatorState).used.count).toBe(2);
      expect(stats(allocatorState).free.count).toBe(0);
      expect(stats(allocatorState).top).toBe(224);
      expect(listAllocatedBlocks(allocatorState)[0].dataSize).toBe(80);
      expect(stats(allocatorState)).toEqual(statusBeforeOOM);
    });

    test("oom when not adjacent To Top", () => {
      const allocation = malloc(allocatorState, 80);
      // allocation So Wont Be Adjacent To Top
      malloc(allocatorState, 8);

      expect(stats(allocatorState).used.count).toBe(2);
      expect(stats(allocatorState).free.count).toBe(0);
      expect(stats(allocatorState).top).toBe(152);
      expect(listAllocatedBlocks(allocatorState)[0].dataSize).toBe(8);

      const statusBeforeOOM = stats(allocatorState);

      const afterRealloc = realloc(allocatorState, allocation, 400);
      // OOM
      expect(afterRealloc).toBe(0);

      // Make sure everything is the same - no state destruction due to oom
      expect(stats(allocatorState)).toEqual(statusBeforeOOM);
      expect(stats(allocatorState).used.count).toBe(2);
      expect(stats(allocatorState).free.count).toBe(0);
      expect(stats(allocatorState).top).toBe(152);
      expect(listAllocatedBlocks(allocatorState)[0].dataSize).toBe(8);
    });
  });
});
