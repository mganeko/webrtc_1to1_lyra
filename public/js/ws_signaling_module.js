'use strict';

// シグナリングサーバへ接続する
/*--
export function connectSignaling(url) {
  let wsUrl = 'ws://localhost:3001/';
  if (url) {
    wsUrl = url;
  }
  if (ws && ws.readyState === ws.OPEN) {
    console.warn('signaling ALREADY open');
    return;
  }

  ws = new WebSocket(wsUrl);
  ws.onopen = (evt) => {
    console.log('ws open()');
  };
  ws.onerror = (err) => {
    console.error('ws onerror() ERR:', err);
  };
  ws.onmessage = (evt) => {
    //console.log('ws onmessage() data.type:', evt.data.type);
    const message = JSON.parse(evt.data);
    console.log('ws onmessage() message.type:', message.type);
    switch (message.type) {
      case 'offer': {
        console.log('Received offer ...');
        receiveSdpFunc(message, message.type);
        break;
      }
      case 'answer': {
        console.log('Received answer ...');
        receiveSdpFunc(message, message.type);
        break;
      }
      case 'candidate': {
        console.log('Received ICE candidate ...');
        const candidate = new RTCIceCandidate(message.ice);
        console.log(candidate);
        receiveIceCandidate(candidate);
        break;
      }
      case 'close': {
        console.log('peer is closed ...');
        closedFunc();
        break;
      }
      default: {
        console.log("Invalid message");
        break;
      }
    }
  };
}
---*/

export function disconnectSignaling() {
  if (ws) {
    ws.close();
    ws = null;
  }
}

export async function connectSignalingAsync(url) {
  let wsUrl = 'ws://localhost:3001/';
  if (url) {
    wsUrl = url;
  }
  if (ws && ws.readyState === ws.OPEN) {
    console.warn('signaling ALREADY open');
    return;
  }

  ws = new WebSocket(wsUrl);
  return new Promise((resolve, reject) => {
    ws.onopen = (evt) => {
      console.log('ws open()');
      resolve();
    };
    ws.onerror = (err) => {
      console.error('ws onerror() ERR:', err);
      reject(err);
    };
    ws.onmessage = (evt) => {
      //console.log('ws onmessage() data.type:', evt.data.type);
      const message = JSON.parse(evt.data);
      console.log('ws onmessage() message.type:', message.type);
      switch (message.type) {
        case 'offer': {
          console.log('Received offer ...');
          receiveSdpFunc(message, message.type);
          break;
        }
        case 'answer': {
          console.log('Received answer ...');
          receiveSdpFunc(message, message.type);
          break;
        }
        case 'candidate': {
          console.log('Received ICE candidate ...');
          const candidate = new RTCIceCandidate(message.ice);
          console.log(candidate);
          receiveIceCandidate(candidate);
          break;
        }
        case 'close': {
          console.log('peer is closed ...');
          closedFunc();
          break;
        }
        default: {
          console.log("Invalid message");
          break;
        }
      }
    };
  });
}

export function sendSdp(sessionDescription) {
  const message = JSON.stringify(sessionDescription);
  console.log('---sending SDP type=' + sessionDescription.type);
  ws.send(message);
}

export function sendIceCandidate(candidate) {
  console.log('---sending ICE candidate ---');
  const message = JSON.stringify({ type: 'candidate', ice: candidate });
  console.log('sending candidate=' + message);
  ws.send(message);
}

export function sendClose() {
  const message = JSON.stringify({ type: 'close' });
  console.log('---sending close message---');
  ws.send(message);
}

export function setRceiveSdpHandeler(handler) {
  receiveSdpFunc = handler;
}
let receiveSdpFunc = null;

export function setReceiveIceCandidateHandeler(handler) {
  receiveIceCandidate = handler;
}
let receiveIceCandidate = null;

export function setCloseHander(handler) {
  closedFunc = handler;
}
let closedFunc = null;

// ---- inner variable, function ----
let ws = null;


