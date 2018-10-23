import { ProcessPacket } from './vban';
import * as pcm from 'pcm-util';

window.$ = window.jQuery = require('jquery');
window.Popper = require('popper.js').default;
window.feather = require('feather-icons');
window.Chart = require('chart.js');
feather.replace();
if (process.env.NODE_ENV === 'development') {
  const livereloadScript = document.createElement('script');
  livereloadScript.src = 'http://localhost:35729/livereload.js?snipver=1';
  document.documentElement.appendChild(livereloadScript);
}

let isListening = false;

let PORT = 6980;
let HOST = '0.0.0.0';

let dgram = require('dgram');
let server = dgram.createSocket('udp4');

let audioCtx = new AudioContext();

server.on('listening', function () {
    let address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

let count = 0;
let offset = 0;
let msInput = 1000;
let msToBuffer = Math.max(50, msInput);
let bufferX = 0;
let audioBuffer;
let prevFormat = {};
let source;

server.on('message', function (message, remote) {
  // console.log(`Received packet: ${remote.address}:${remote.port}`);
  if (isListening) {
    let audioData = ProcessPacket(message);
    // console.log(audioData);
    if (!audioBuffer || Object.keys(audioData.format).some((key) => prevFormat[key] !== audioData.format[key])) {
      prevFormat = audioData.format;
      bufferX = Math.ceil(((msToBuffer / 1000) * audioData.sampleRate) / audioData.samples);
      if (bufferX < 3) {
        bufferX = 3;
      }
      audioBuffer = audioCtx.createBuffer(audioData.channels, audioData.samples * bufferX, audioData.sampleRate);
      if (source) {
        source.disconnect();
      }
      source = audioCtx.createBufferSource();
      source.connect(audioCtx.destination);
      source.loop = true;
      source.buffer = audioBuffer;
      source.start();
    }
    let pcmAudioBuffer = pcm.toAudioBuffer(audioData.buffer, audioData.format);
    for (var channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      // This gives us the actual array that contains the data
      var dest = audioBuffer.getChannelData(channel);
      var src = pcmAudioBuffer.getChannelData(channel);
      for (var i = 0; i < pcmAudioBuffer.length; i++) {
        dest[i + offset] = src[i];
      }
    }
    offset += pcmAudioBuffer.length;
    count++;
    if (count >= bufferX) {
      count = 0;
      offset = 0;
    }
  }
});

server.bind(PORT, HOST);

const listenButton = document.getElementById('listenButton');
listenButton.addEventListener('click', function(event) {
  isListening = !isListening;
  if (isListening) {
    listenButton.textContent = 'Stop Listening';
  }
  else {
    listenButton.textContent = 'Listen';
    if (source) {
      source.disconnect();
      source = undefined;
      audioBuffer = undefined;
    }
  }
});
