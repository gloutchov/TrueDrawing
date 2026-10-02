import { expect, it } from "vitest";
import { webpDimensions } from "../../src/shared/document/webpDimensions";
function riff(kind:string,payload:Buffer):Buffer {
  const bytes=Buffer.alloc(20+payload.length);bytes.write("RIFF");bytes.writeUInt32LE(bytes.length-8,4);bytes.write("WEBP",8);bytes.write(kind,12);bytes.writeUInt32LE(payload.length,16);payload.copy(bytes,20);return bytes;
}
it("reads extended WebP dimensions and rejects truncated RIFF",()=>{
  const payload=Buffer.alloc(10);payload.writeUIntLE(319,4,3);payload.writeUIntLE(239,7,3);
  const bytes=riff("VP8X",payload);expect(webpDimensions(bytes)).toEqual({width:320,height:240});
  expect(()=>webpDimensions(bytes.subarray(0,25))).toThrow();
});
it("reads lossless WebP dimensions",()=>{
  const payload=Buffer.alloc(6);payload[0]=0x2f;payload.writeUInt32LE(99|(49<<14),1);
  expect(webpDimensions(riff("VP8L",payload))).toEqual({width:100,height:50});
});
it("reads lossy WebP keyframe dimensions",()=>{
  const payload=Buffer.alloc(10);payload[3]=0x9d;payload[4]=1;payload[5]=0x2a;payload.writeUInt16LE(120,6);payload.writeUInt16LE(80,8);
  expect(webpDimensions(riff("VP8 ",payload))).toEqual({width:120,height:80});
});
it("rejects unknown formats without inferring unbounded dimensions",()=>{
  expect(()=>webpDimensions(riff("JUNK",Buffer.alloc(10)))).toThrow();
});
