export interface TextEncoder {
  encode(input?: string): Uint8Array;
}

export interface TextDecoder {
  decode(input?: ArrayBuffer): string;
}
