'use strict';

import Module from './webassembly_codec_wrapper.js';

let codecModule;
Module().then((module) => {
  console.log("Initialized codec's wasmModule.");
  codecModule = module;
}).catch(e => {
  console.log(`Module() error: ${e.name} message: ${e.message}`);
});
