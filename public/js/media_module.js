'use strict';

// ローカルのカメラ映像、マイク音声を取得する
export async function getLocalStream(options) {
  const constraints = options ? options : { video: true, audio: true };
  const localStream = await navigator.mediaDevices.getUserMedia(constraints).catch(err => {
    //console.error('mediaDevices.getUserMedia() error:', err);
    console.error(`mediaDevices.getUserMedia() error: ${err}`);
    return null;
  });
  return localStream;
}

// ローカルのカメラ映像、マイク音声を停止する
export function stopLocalStream(localStream) {
  if (localStream) {
    stopStream(localStream);
    //localStream = null;
  }
}


// ------- inner variable, function ------
//let localStream = null;

// MediaStreamの各トラックを停止させる
function stopStream(stream) {
  stream.getTracks().forEach(track => track.stop());
}