# webrtc_1to1_lyra

Simple 1 to 1 WebRTC video chat example wity Lyra V2(audio) and AV1(video). Only for Chrome

## Thaks to

This repo is using many codes from https://github.com/Flash-Meeting/lyra-webrtc (Apache-2.0 license)

# install

```
$ npm install
```

# start

## server

```
$ export PORT=8080 && node server_1to1.js
```

## Client

- open http://localhost:8080/lyra.html with Desktop Chrome (106 or later) in 2 tabs.
- click [Start Media] button of each tab to start capturing Video/Audio.
- click [Connect] button of one of the tabs to connect WebRTC P2P.
- Communication between 2 tabs will be established.
  - AV1 for Video (50kbps)
  - L16 (PCM) for Audio, with Lyra v2 inside (6kbps)
- click [Hang up] button of one of the tabs to disconnect.
- click [Stop Media] button of each tab to stop capturing Video/Audio.


# License

Apache 2.0 license



