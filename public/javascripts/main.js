/**
 * Created by GTX95017 on 2015/11/16.
 */
'use strict';
function $(s) {
  return document.querySelectorAll(s);
}
window.onload = function () {
  var list = $(".list li");
  for (let i = 0; i < list.length; i++) {
    list[i].addEventListener('click', function () {
      for (var j = 0; j < list.length; j++) {
        list[j].className = '';
      }
      this.className = 'active';
      load("/media/" + this.innerText);
    });
  }
  var xhr = new XMLHttpRequest();
  var audio = new window.AudioContext();
  var gainNode = audio[audio.createGain ? 'createGain' : 'createGainNode']();
  var analyser = audio[audio.createAnalyser ? 'createAnalyser' : 'createAnalyserNode']();
  analyser.fftSize = 512;
  analyser.connect(gainNode);
  gainNode.connect(audio.destination);
  var canvas = document.createElement('canvas');
  var canvasContext = canvas.getContext("2d");
  var canvasBox = $('.right')[0];
  canvasBox.appendChild(canvas);
  var height;
  var width;

  function canvasSize() {
    height = canvasBox.clientHeight;
    width = canvasBox.clientWidth;
    canvas.height = height;
    canvas.width = width;
    var liner = canvasContext.createLinearGradient(0, 0, 0, height);
    liner.addColorStop(0, 'red');
    liner.addColorStop(0.5, 'yellow');
    liner.addColorStop(1, 'green');
    canvasContext.fillStyle = liner;
  }

  window.onresize = canvasSize;
  canvasSize();
  function draw(arr) {
    canvasContext.clearRect(0, 0, width, height);
    var size = analyser.fftSize / 2;
    var w = width / size;
    for (let i = 0; i < analyser.fftSize / 2; i++) {
      var h = arr[i] / 256 * height;
      canvasContext.fillRect(w * i * 4, (height - h) * 0.5, w, h);
    }
  }

  var source = null;
  var count = 0;

  function load(url) {
    //防止连续点击造成同时播放
    var n = ++count;
    //如果source已经有内容,则停止掉当前播放
    source && source[source.stop ? 'stop' : 'nodeOff'](0);
    //终止上一次请求
    xhr.abort();
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
      //如果 n 不等于 count 则说明在还没有解码之前就点击了下一首歌曲
      if (n !== count)return;
      audio.decodeAudioData(xhr.response, function (buffer) {
        if (n !== count)return;
        var bufferSource = audio.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.connect(analyser);
        bufferSource[bufferSource.start ? "start" : "noteOn"](0);
        //把bufferSource 赋值给 source,判断是否正在播放
        analyserData();
        source = bufferSource;
      }, function (err) {
        console.log(err);
      });
    };
    xhr.send();
  }

  function analyserData() {
    var musicArray = new Uint8Array(analyser.frequencyBinCount);
    var requestAnimationFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

    function constant() {
      analyser.getByteFrequencyData(musicArray);
      console.log(musicArray);
      requestAnimationFrame(constant);
      draw(musicArray);
    }

    requestAnimationFrame(constant);
  };
  function adJust(percent) {
    gainNode.gain.value = percent * percent;
  }

  $(".volume")[0].addEventListener('change', function () {
    adJust(this.value / this.max)
  });
  gainNode.gain.value = $(".volume")[0].value / 100;
};
