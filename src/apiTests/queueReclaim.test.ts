/* eslint-env jest, node */
import { createObjectBuffer } from "..";
import {
  memoryStats,
  processQueuedReclaims,
  queueReclaim,
} from "../internal/api";

test("Test queueReclaim", async function () {
  const ob: any = createObjectBuffer(1024, {
    foo: undefined,
  });

  const memoryStatsAfterCreate = memoryStats(ob);

  ob.foo = { a: "123abc" };

  const memoryStatsAfterFillingFoo = memoryStats(ob);

  const { foo } = ob;

  ob.foo = undefined;

  queueReclaim(foo);

  const memoryStatsAfterQueueReclaimFoo = memoryStats(ob);

  processQueuedReclaims(ob);

  const memoryStatsAfterProcessQueuedReclaims = memoryStats(ob);

  expect(memoryStatsAfterFillingFoo).toEqual(memoryStatsAfterQueueReclaimFoo);
  expect(memoryStatsAfterProcessQueuedReclaims).not.toEqual(
    memoryStatsAfterQueueReclaimFoo
  );
  expect(memoryStatsAfterProcessQueuedReclaims).toEqual(memoryStatsAfterCreate);
});
