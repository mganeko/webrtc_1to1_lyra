'use strict';

import Module from './webassembly_codec_wrapper.js';

let codecModule;
Module().then((module) => {
  console.log("Initialized codec's wasmModule.");
  codecModule = module;
}).catch(e => {
  console.log(`Module() error: ${e.name} message: ${e.message}`);
});


export function modifyDesc(desc, audioCodec) {
  let modifiedSDP = desc.sdp;
  if (audioCodec === "lyra" || audioCodec === "pcm") {
    modifiedSDP = addL16ToSDP(modifiedSDP);
  }
  if (audioCodec === "lyra") {
    modifiedSDP = removeCNFromSDP(modifiedSDP);
  }
  return {
    type: desc.type,
    sdp: modifiedSDP
  }
}

function addL16ToSDP(sdp) {
  return sdp
    .replace("SAVPF 111", "SAVPF 109 111")
    .replace("a=rtpmap:111", "a=rtpmap:109 L16/16000/1\r\na=fmtp:109 ptime=20\r\na=rtpmap:111");
}

function removeCNFromSDP(sdp) {
  return sdp
    .replace("a=rtpmap:106 CN/32000\r\n", "")
    .replace("a=rtpmap:105 CN/16000\r\n", "")
    .replace("a=rtpmap:13 CN/8000\r\n", "")
    .replace(" 106 105 13", "");
}

export function encodeFunction(encodedFrame, controller) {
  const inputDataArray = new Uint8Array(encodedFrame.data);

  const inputBufferPtr = codecModule._malloc(encodedFrame.data.byteLength);
  const encodedBufferPtr = codecModule._malloc(1024);

  codecModule.HEAPU8.set(inputDataArray, inputBufferPtr);
  const length = codecModule.encode(inputBufferPtr,
    inputDataArray.length, 16000,
    encodedBufferPtr);

  const newData = new ArrayBuffer(length);
  if (length > 0) {
    const newDataArray = new Uint8Array(newData);
    newDataArray.set(codecModule.HEAPU8.subarray(encodedBufferPtr, encodedBufferPtr + length));
  }

  codecModule._free(inputBufferPtr);
  codecModule._free(encodedBufferPtr);

  encodedFrame.data = newData;
  controller.enqueue(encodedFrame);
}

export function decodeFunction(encodedFrame, controller) {
  const newData = new ArrayBuffer(16000 * 0.02 * 2);
  if (encodedFrame.data.byteLength > 0) {
    const inputDataArray = new Uint8Array(encodedFrame.data);
    const inputBufferPtr = codecModule._malloc(encodedFrame.data.byteLength);
    const outputBufferPtr = codecModule._malloc(2048);
    codecModule.HEAPU8.set(inputDataArray, inputBufferPtr);
    const length = codecModule.decode(inputBufferPtr,
      inputDataArray.length, 16000,
      outputBufferPtr);

    const newDataArray = new Uint8Array(newData);
    newDataArray.set(codecModule.HEAPU8.subarray(outputBufferPtr, outputBufferPtr + length));

    codecModule._free(inputBufferPtr);
    codecModule._free(outputBufferPtr);
  }

  encodedFrame.data = newData;
  controller.enqueue(encodedFrame);
}