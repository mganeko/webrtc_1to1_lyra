//
// webrtc 1to1 sample
//   https://github.com/mganeko/webrtc_1to1
//   webrtc_1to1 is provided under MIT license
//
//

// (1) install
//   npm install ws
//   npm install express
// or
//   npm install
//
// (2) start
//   Server
//      export PORT=8080 && node server_1to1.js
//   Client
//      open http://localhost:8080/



'use strict';

// --- get PORT from env --
let port = process.env.PORT;
if ((!port) || (port === '')) {
  port = '8080';
}

// --- prepare server ---
const http = require("http");
const WebSocketServer = require('ws').Server;
const express = require('express');
express.static.mime.define({ 'application/wasm': ['wasm'] })

const app = express();
app.use(express.static('public', {
  setHeaders: function (res, path, stat) {
    res.set('Cross-Origin-Opener-Policy', 'same-origin');
    res.set('Cross-Origin-Embedder-Policy', 'require-corp');
  }
}));

let webServer = null;
const hostName = 'localhost';

// --- http ---
webServer = http.Server(app).listen(port, function () {
  const address = webServer.address();
  if (address) {
    console.log('Web server start. http://' + hostName + ':' + address.port + '/');
  }
  else {
    console.error('WebServer Start ERROR');
  }
});


// --- websocket signaling ---
const wsServer = new WebSocketServer({ server: webServer });
const address = webServer.address();
if (address) {
  console.log('websocket server start. port=' + address.port);
}
else {
  console.error('websocket Start ERROR with port=' + port);
}
//console.log('websocket server start. port=' + port);


wsServer.on('connection', function (ws) {
  console.log('-- websocket connected --');
  ws.on('message', function (message) {
    wsServer.clients.forEach(function each(client) {
      if (isSame(ws, client)) {
        console.log('- skip sender -');
      }
      else {
        client.send(message);
      }
    });
  });
});

function isSame(ws1, ws2) {
  // -- compare object --
  return (ws1 === ws2);

  // -- compare undocumented id --
  //return (ws1._ultron.id === ws2._ultron.id);
}
