export * from "./internal/api";
import * as locks from "./internal/locks";
export type ExternalArgs = import("./internal/interfaces").ExternalArgs;
export { locks };
