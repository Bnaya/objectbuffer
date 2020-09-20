import type { Options } from "benchmark";
export interface BenchmarkTest {
  name: string;
  fn: () => void;
  options?: Options;
}
