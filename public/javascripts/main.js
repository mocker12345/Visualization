/**
 * Created by GTX95017 on 2015/11/16.
 */
'use strict';
function $(s) {
  return document.querySelectorAll(s);
}
window.onload = () => {
  var list = $(".list li");
  for (let i = 0; i < list.length; i++) {
    list[i].addEventListener('click', function () {
      for (var j = 0; j < list.length; j++) {
        list[j].className = '';
      }
      this.className = 'active';
      console.log(this.title);
      load("/media/" + this.innerText);
    });
  }
  var xhr = new XMLHttpRequest();
  var audio = new window.AudioContext();

  function load(url) {
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
      audio.decodeAudioData(xhr.response, function (buffer) {
        var bufferSource = audio.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.connect(audio.destination);
        bufferSource[bufferSource.start ? "start" : "noteOn"]();
      }, function (err) {
        console.log(err);
      });
    };
    xhr.send();
  }
};
