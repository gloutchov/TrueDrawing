// WebP RIFF canvas dimensions (VP8X, VP8L and lossy VP8 key frame).
export function webpDimensions(bytes: Uint8Array): {width:number;height:number} {
  const view = new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  const text = (offset:number) => String.fromCharCode(...bytes.subarray(offset,offset+4));
  const uint24 = (offset:number) => bytes[offset] | bytes[offset+1]<<8 | bytes[offset+2]<<16;
  if (bytes.length < 20 || text(0)!=="RIFF" || text(8)!=="WEBP" || view.getUint32(4,true)+8!==bytes.length) throw new Error("Invalid WebP image.");
  for (let offset=12;offset+8<=bytes.length;) {
    const size=view.getUint32(offset+4,true),data=offset+8;
    if (data+size>bytes.length) throw new Error("Invalid WebP image.");
    const chunk=text(offset);
    if (chunk==="VP8X" && size>=10) return {width:uint24(data+4)+1,height:uint24(data+7)+1};
    if (chunk==="VP8L" && size>=5 && bytes[data]===0x2f) {
      const bits=view.getUint32(data+1,true);
      return {width:(bits&0x3fff)+1,height:((bits>>>14)&0x3fff)+1};
    }
    if (chunk==="VP8 " && size>=10 && bytes[data+3]===0x9d && bytes[data+4]===1 && bytes[data+5]===0x2a)
      return {width:view.getUint16(data+6,true)&0x3fff,height:view.getUint16(data+8,true)&0x3fff};
    offset=data+size+(size%2);
  }
  throw new Error("Invalid WebP image.");
}
