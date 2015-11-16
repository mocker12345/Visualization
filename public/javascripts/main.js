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
  gainNode.connect(audio.destination);
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
        bufferSource.connect(gainNode);
        bufferSource[bufferSource.start ? "start" : "noteOn"](0);
        //把bufferSource 赋值给 source,判断是否正在播放
        source = bufferSource;
      }, function (err) {
        console.log(err);
      });
    };
    xhr.send();
  }

  function adJust(percent) {
    gainNode.gain.value = percent * percent;
  }

  $(".volume")[0].addEventListener('change', function () {
    adJust(this.value / this.max)
  });
  gainNode.gain.value = $(".volume")[0].value / 100;
};
