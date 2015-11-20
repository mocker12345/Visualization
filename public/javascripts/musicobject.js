"use strict";
function Musicobject(object) {
  this.source = null;
  this.count = 0;
  this.n = 0;
  this.analyser = this.audio.createAnalyser();
  this.gainNode = this.audio[this.audio.createGain ? "createGain" : "createGainNode"]();
  this.analyser.fftSize = 512;
  this.gainNode.connect(this.audio.destination);
  this.analyser.connect(this.gainNode);
  this.xhr = new XMLHttpRequest();
  this.visulaizar = object.visualizar;
  this.visualization();

}
Musicobject.prototype.audio = new window.AudioContext();
Musicobject.prototype.load = function (url, decode) {
  this.source && this.source[this.source.stop ? "stop" : "noteOff"](0);
  this.xhr.abort();
  this.xhr.open("GET", url);
  this.xhr.responseType = "arraybuffer";
  var self = this;
  this.xhr.onload = function () {
    decode(self.xhr.response);
  };
  this.xhr.send();
};
Musicobject.prototype.decode = function (response, fun) {
  this.audio.decodeAudioData(response, function (buffer) {
    //if(this.n !== this.count)return;
    //var bufferSource = this.audio.createBufferSource();
    //bufferSource.buffer = buffer;
    //bufferSource.connect(this.analyser);
    //bufferSource[bufferSource.start?"start":"noteOn"](0);
    //this.source = bufferSource;
    fun(buffer);
  }, function (err) {
    console.error(err);
  });
};
Musicobject.prototype.play = function (url) {
  var self = this;
  var n = ++this.count;
  this.load(url, function (arraybuffer) {
    if (n !== self.count)return;
    self.decode(arraybuffer, function (buffer) {
      if (n !== self.count)return;
      var bufferSource = self.audio.createBufferSource();
      bufferSource.buffer = buffer;
      bufferSource.connect(self.analyser);
      bufferSource[bufferSource.start ? "start" : "noteOn"](0);
      self.source = bufferSource;
    });
  });
};
Musicobject.prototype.changeVolume = function (percent) {
  this.gainNode.gain.value = percent * percent;
};
Musicobject.prototype.visualization = function () {
  var musicArray = new Uint8Array(this.analyser.frequencyBinCount);
  var requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

  var self = this;

  function constant() {
    self.analyser.getByteFrequencyData(musicArray);
    requestAnimationFrame(constant);
    self.visulaizar(musicArray);
  }

  requestAnimationFrame(constant);
};
