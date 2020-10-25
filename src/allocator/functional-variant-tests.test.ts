import assert from "assert";
import {
  malloc,
  free,
  freeAll,
  calloc,
  realloc,
  get__free,
  readBlockNext,
  get__used,
  readBlockSize,
  align,
  get_top,
  get_doCompact,
  get_doSplit,
  get_end,
} from "./functional";
import { allocatorInit, stats as readStats } from "./functional";
import type { AllocatorState } from "./functionalInterfaces";

const POOL_OVERHEAD = 7 * 4;
const BLOCK_OVERHEAD = 4 * 4;

describe("malloc functional", () => {
  let allocatorState: AllocatorState;

  beforeEach(() => {
    // allocatorState = new MemPool({ size: 0x100 });
    allocatorState = allocatorInit({
      size: 0x100,
      align: 8,
      start: 0,
      end: 0x100,
      compact: true,
      split: true,
      minSplit: 24,
    });
  });

  it("allocatorInit", () => {
    assert.strictEqual(allocatorState.options.start, 0);
    assert.strictEqual(get_top(allocatorState.state), align(POOL_OVERHEAD, 8));
    assert(get_doCompact(allocatorState.state));
    assert(get_doSplit(allocatorState.state));
    assert.strictEqual(
      get_end(allocatorState.state),
      allocatorState.u8.buffer.byteLength,
      "When end option not specified, end should be byteLength"
    );

    // p = new MemPool({ size: 0x100, start: 0x0c, end: 0x80 });
    allocatorState = allocatorInit({
      size: 0x100,
      align: 8,
      start: 0x0c,
      end: 0x80,
      compact: true,
      split: true,
      minSplit: 24,
    });

    assert.strictEqual(allocatorState.options.start, 0x0c);
    assert.strictEqual(
      get_top(allocatorState.state),
      align(0x0c + POOL_OVERHEAD, 8)
    );
    assert.strictEqual(get_end(allocatorState.state), 0x80);

    assert.throws(() => {
      // assert.throws(() => new MemPool({ size: 0x100, start: 0x0, end: 0x0 }));
      allocatorState = allocatorInit({
        size: 0x100,
        align: 8,
        start: 0x0,
        end: 0x0,
        compact: true,
        split: true,
        minSplit: 24,
      });
    });

    assert.throws(() => {
      // new MemPool({ size: 0x100, start: 0x100, end: 0x200 })
      allocatorState = allocatorInit({
        size: 0x100,
        align: 8,
        start: 0x100,
        end: 0x200,
        compact: true,
        split: true,
        minSplit: 24,
      });
    });

    assert.throws(() => {
      // () => new MemPool({ size: 0x100, start: 0x80, end: 0x0 })
      allocatorState = allocatorInit({
        size: 0x100,
        align: 8,
        start: 0x80,
        end: 0x0,
        compact: true,
        split: true,
        minSplit: 24,
      });
    });
  });

  it("malloc / free", () => {
    assert(!malloc(allocatorState, 256), "insufficient mem");
    assert(!malloc(allocatorState, -1), "neg size");
    assert(!malloc(allocatorState, 0), "zero size");

    const base = readStats(allocatorState).top;
    let a = malloc(allocatorState, 12);
    let b = malloc(allocatorState, 31);
    let c = malloc(allocatorState, 24);
    assert.strictEqual(a, base + BLOCK_OVERHEAD, "a");
    assert.strictEqual(b, a + 16 + BLOCK_OVERHEAD, "b");
    assert.strictEqual(c, b + 32 + BLOCK_OVERHEAD, "c");

    // state check
    let stats = readStats(allocatorState);
    assert.strictEqual(stats.top, c + 24, "top");
    assert.deepStrictEqual(stats.free, { count: 0, size: 0 });
    assert.deepStrictEqual(stats.used, {
      count: 3,
      size: 16 + 32 + 24 + 3 * BLOCK_OVERHEAD,
    });

    // free all
    assert(free(allocatorState, a), "free a");
    assert(free(allocatorState, c), "free b");
    assert(free(allocatorState, b), "free c");
    // assert(!free(allocatorState, b), "free b (repeat)");
    stats = readStats(allocatorState);
    assert.strictEqual(stats.top, base, "top2");
    assert.deepStrictEqual(stats.free, { count: 0, size: 0 });
    assert.deepStrictEqual(stats.used, { count: 0, size: 0 });

    // alloc & split free block
    a = malloc(allocatorState, 32);
    assert.strictEqual(a, base + BLOCK_OVERHEAD, "a2");
    stats = readStats(allocatorState);
    assert.deepStrictEqual(stats.free, { count: 0, size: 0 });
    assert.deepStrictEqual(stats.used, { count: 1, size: 32 + BLOCK_OVERHEAD });
    assert.strictEqual(stats.top, base + 32 + BLOCK_OVERHEAD, "top3");
    // alloc next block & free prev
    b = malloc(allocatorState, 12);
    assert.strictEqual(b, base + 32 + BLOCK_OVERHEAD * 2, "b2");
    assert(free(allocatorState, a), "free a2");

    // re-alloc from free & split
    a = malloc(allocatorState, 8);
    assert.strictEqual(a, base + BLOCK_OVERHEAD, "a3");
    stats = readStats(allocatorState);
    assert.deepStrictEqual(stats.free, { count: 1, size: 24 });
    assert.deepStrictEqual(stats.used, {
      count: 2,
      size: 24 + 2 * BLOCK_OVERHEAD,
    });
    assert.strictEqual(stats.top, base + 32 + 16 + 2 * BLOCK_OVERHEAD, "top4");

    // join both free blocks
    assert(free(allocatorState, b), "free b2");

    // extend free block + top
    b = malloc(allocatorState, 64);
    assert.strictEqual(b, base + 8 + 2 * BLOCK_OVERHEAD, "b3");
    stats = readStats(allocatorState);
    assert.deepStrictEqual(stats.free, { count: 0, size: 0 });
    assert.deepStrictEqual(stats.used, {
      count: 2,
      size: 8 + 64 + 2 * BLOCK_OVERHEAD,
    });
    assert.strictEqual(stats.top, base + 8 + 64 + 2 * BLOCK_OVERHEAD, "top5");

    // alloc at top, below min size
    c = malloc(allocatorState, 1);
    // non-continous free chain
    assert(free(allocatorState, c), "free c2");
    // top reset to before
    assert.strictEqual(stats.top, base + 8 + 64 + 2 * BLOCK_OVERHEAD, "top6");
    assert(free(allocatorState, a), "free a3");
    stats = readStats(allocatorState);
    assert.deepStrictEqual(stats.free, { count: 1, size: 8 + BLOCK_OVERHEAD });
    assert.deepStrictEqual(stats.used, { count: 1, size: 64 + BLOCK_OVERHEAD });
    // top remains unchanged
    assert.strictEqual(stats.top, base + 8 + 64 + 2 * BLOCK_OVERHEAD, "top7");

    // alloc larger size to force walking free chain
    // and then alloc @ top (reuse earlier block)
    a = malloc(allocatorState, 27);
    assert.strictEqual(a, base + 8 + 64 + 3 * BLOCK_OVERHEAD, "a4");
    stats = readStats(allocatorState);
    assert.deepStrictEqual(stats.free, { count: 1, size: 8 + BLOCK_OVERHEAD });
    assert.deepStrictEqual(stats.used, {
      count: 2,
      size: 64 + 32 + 2 * BLOCK_OVERHEAD,
    });
    assert.strictEqual(
      stats.top,
      base + 8 + 64 + 32 + 3 * BLOCK_OVERHEAD,
      "top8"
    );

    assert(free(allocatorState, a), "free a4");
    assert(free(allocatorState, b), "free b3");
    stats = readStats(allocatorState);
    assert.deepStrictEqual(stats.free, { count: 0, size: 0 });
    assert.deepStrictEqual(stats.used, { count: 0, size: 0 });
    assert.strictEqual(stats.available, 256 - base);
    assert.strictEqual(stats.top, base, "top9");

    freeAll(allocatorState);
    assert.deepStrictEqual(readStats(allocatorState), {
      free: { count: 0, size: 0 },
      used: { count: 0, size: 0 },
      available: allocatorState.u8.buffer.byteLength - base,
      total: allocatorState.u8.buffer.byteLength,
      top: base,
    });

    // allocatorState.release();
  });

  it("calloc", () => {
    const u8: Uint8Array = (<any>allocatorState).u8;
    u8.fill(0xff, readStats(allocatorState).top);
    const a = calloc(allocatorState, 6);
    assert.deepStrictEqual(
      [...u8.subarray(a, a + 9)],
      [0, 0, 0, 0, 0, 0, 0xff, 0xff, 0xff]
    );
  });

  it("malloc top", () => {
    const a = malloc(allocatorState, 8);
    const b = malloc(allocatorState, 8);
    const c = malloc(allocatorState, 8);
    const d = malloc(allocatorState, 8);
    // cause non continuous free chain
    free(allocatorState, a);
    free(allocatorState, b);
    free(allocatorState, d);
    assert.strictEqual(
      malloc(allocatorState, allocatorState.u8.buffer.byteLength - d + 1),
      0,
      "malloc top"
    );
    // assert.strictEqual(
    //     allocatorState.mallocAs(Type.U8, allocatorState.u8.buffer.byteLength - d + 1),
    //     null,
    //     "mallocAs top"
    // );
    free(allocatorState, c);
  });

  // We have tests in the other file
  it.skip("realloc", () => {
    const a = malloc(allocatorState, 8);
    allocatorState.u8.fill(0xff, a, a + 8);

    const block = get__used(allocatorState.state);
    const bsize = readBlockSize(allocatorState.u32, block);
    assert.strictEqual(bsize, align(8 + BLOCK_OVERHEAD, 8), "size a");
    assert.strictEqual(realloc(allocatorState, a, 0), 0, "too small");
    assert.strictEqual(realloc(allocatorState, a, 65), a, "enlarge a");

    const usedBlockAfterRealloc = get__used(allocatorState.state);
    assert.strictEqual(usedBlockAfterRealloc, block);
    assert.strictEqual(
      readBlockSize(allocatorState.u32, usedBlockAfterRealloc),
      align(65 + BLOCK_OVERHEAD, 8)
    );

    // shrink & update top
    assert.strictEqual(realloc(allocatorState, a, 31), a, "shrink a");
    assert.strictEqual(
      readBlockSize(allocatorState.u32, usedBlockAfterRealloc),
      align(31 + BLOCK_OVERHEAD, 8)
    );
    assert.strictEqual(get__free(allocatorState.state), 0);
    assert.strictEqual(get_top(allocatorState.state), a + 32);

    // add new top block
    const b = malloc(allocatorState, 8);
    assert.strictEqual(b, a + 48, "b");

    // enlage a again, but need to move after b
    const a2 = realloc(allocatorState, a, 65);
    assert.strictEqual(a2, b + 16);
    assert.deepStrictEqual(
      [...allocatorState.u8.slice(a2, a2 + 9)],
      [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0]
    );
  });

  // it("reallocArray", () => {
  //     const a = allocatorState.callocAs(Type.F32, 4, 1);
  //     assert.deepStrictEqual(
  //         [...allocatorState.reallocArray(a!, 8)!],
  //         [1, 1, 1, 1, 0, 0, 0, 0]
  //     );
  //     assert.strictEqual(allocatorState.reallocArray(a!, 10000), undefined);
  //     assert.strictEqual(allocatorState.reallocArray(new Float32Array(4), 8), undefined);
  // });

  // We now have merge on by default
  it.skip("no compact", () => {
    allocatorState = allocatorInit({
      size: 0x100,
      split: true,
      start: 0,
      end: 0x100,
      align: 8,
      minSplit: 24,
      compact: false,
    });

    const a = malloc(allocatorState, 8);
    const a1 = malloc(allocatorState, 8);
    const a2 = malloc(allocatorState, 8);
    free(allocatorState, a);
    free(allocatorState, a1);
    free(allocatorState, a2);
    assert.strictEqual(get__free(allocatorState.state) + BLOCK_OVERHEAD, a);
    assert.strictEqual(
      readBlockNext(allocatorState.u32, get__free(allocatorState.state)) +
        BLOCK_OVERHEAD,
      a1
    );
    assert.strictEqual(
      readBlockNext(
        allocatorState.u32,
        readBlockNext(allocatorState.u32, get__free(allocatorState.state))
      ) + BLOCK_OVERHEAD,
      a2
    );
    assert.strictEqual(
      readBlockNext(
        allocatorState.u32,
        readBlockNext(
          allocatorState.u32,
          readBlockNext(allocatorState.u32, get__free(allocatorState.state))
        )
      ),
      0
    );
  });

  it("no split", () => {
    // allocatorState = new MemPool({ size: 0x100, split: true });
    allocatorState = allocatorInit({
      size: 0x100,
      split: true,
      start: 0,
      end: 0x100,
      align: 8,
      minSplit: 24,
      compact: true,
    });

    const base = readStats(allocatorState).top;

    let a = malloc(allocatorState, 32);
    malloc(allocatorState, 8);
    free(allocatorState, a);
    malloc(allocatorState, 8);
    assert.strictEqual(get__used(allocatorState.state), base);
    assert.strictEqual(
      readBlockSize(allocatorState.u32, get__used(allocatorState.state)),
      8 + BLOCK_OVERHEAD
    );
    assert.strictEqual(
      get__free(allocatorState.state),
      base + 8 + BLOCK_OVERHEAD
    );
    assert.strictEqual(
      readBlockSize(allocatorState.u32, get__free(allocatorState.state)),
      24
    );

    allocatorState = allocatorInit({
      size: 0x100,
      split: false,
      start: 0,
      end: 0x100,
      align: 8,
      minSplit: 24,
      compact: true,
    });

    a = malloc(allocatorState, 32);
    malloc(allocatorState, 8);
    free(allocatorState, a);
    malloc(allocatorState, 8);
    assert.strictEqual(get__used(allocatorState.state), base);
    assert.strictEqual(
      readBlockSize(allocatorState.u32, get__used(allocatorState.state)),
      32 + BLOCK_OVERHEAD
    );
    assert.strictEqual(get__free(allocatorState.state), 0);
  });

  // it("malloc (align 16)", () => {
  //     allocatorState = new MemPool({ size: 0x100, align: 16 });
  //     let p: any = allocatorState;
  //     const base = allocatorState.stats().top;
  //     let a = allocatorState.callocAs(Type.U8, 15);
  //     let b = allocatorState.callocAs(Type.U8, 11);
  //     let c = allocatorState.callocAs(Type.U8, 7);
  //     let d = allocatorState.callocAs(Type.U8, 3);
  //     let e = allocatorState.callocAs(Type.U8, 1);
  //     assert.strictEqual(a!.byteOffset, base + BLOCK_OVERHEAD, "a");
  //     assert.strictEqual(
  //         b!.byteOffset,
  //         align(a!.byteOffset + BLOCK_OVERHEAD + 15, 16),
  //         "b"
  //     );
  //     assert.strictEqual(
  //         c!.byteOffset,
  //         align(b!.byteOffset + BLOCK_OVERHEAD + 11, 16),
  //         "c"
  //     );
  //     assert.strictEqual(
  //         d!.byteOffset,
  //         align(c!.byteOffset + BLOCK_OVERHEAD + 7, 16),
  //         "d"
  //     );
  //     assert.strictEqual(
  //         e!.byteOffset,
  //         align(d!.byteOffset + BLOCK_OVERHEAD + 3, 16),
  //         "e"
  //     );
  //     let stats = readStats(allocatorState);
  //     assert.strictEqual(stats.top, align(e!.byteOffset + 1, 16) - BLOCK_OVERHEAD);

  //     free(allocatorState, d!);
  //     assert.strictEqual(get__free(allocatorState.state), d!.byteOffset - BLOCK_OVERHEAD);
  //     free(allocatorState, b!);
  //     assert.strictEqual(get__free(allocatorState.state), b!.byteOffset - BLOCK_OVERHEAD);
  //     assert.strictEqual(p.blockNext(get__free(allocatorState.state)), d!.byteOffset - BLOCK_OVERHEAD);
  //     free(allocatorState, c!);
  //     assert.strictEqual(get__free(allocatorState.state), b!.byteOffset - BLOCK_OVERHEAD);
  //     assert.strictEqual(blockSize(allocatorState.u32, get__free(allocatorState.state)), e!.byteOffset - b!.byteOffset);
  //     free(allocatorState, a!);
  //     assert.strictEqual(get__free(allocatorState.state), a!.byteOffset - BLOCK_OVERHEAD);
  //     assert.strictEqual(blockSize(allocatorState.u32, get__free(allocatorState.state)), e!.byteOffset - a!.byteOffset);
  //     free(allocatorState, e!);
  //     assert.strictEqual(get__free(allocatorState.state), 0);
  //     assert.strictEqual(get__used(allocatorState.state), 0);
  //     assert.strictEqual(p.top, base);
  // });

  // it("freeAll (align 16)", () => {
  //     pool = new MemPool({ size: 0x100, align: 16 });
  //     const base = readStats(allocatorState).top;
  //     pool.callocAs(Type.U8, 15);
  //     pool.callocAs(Type.U8, 11);
  //     freeAll(allocatorState);
  //     assert.strictEqual(readStats(allocatorState).top, base);
  // });
});
