/**
 * Created by GTX95017 on 2015/11/16.
 */


function get(s) {
  return document.querySelectorAll(s);
}

window.onload = function () {
  "use strict";
  $.material.init();
  var list = get(".list-group-item-heading");
  var music = new Musicobject({
    visualizar: draw
  });
  for (let i = 0; i < list.length; i++) {
    list[i].addEventListener('click', function () {
      for (var j = 0; j < list.length; j++) {
        list[j].className = 'list-group-item-heading';
      }
      this.className = 'list-group-item-heading active';
      music.play("/media/" + this.innerText);
    });
  }

  var canvas = document.createElement('canvas');
  var canvasContext = canvas.getContext("2d");
  var canvasBox = get('.right')[0];
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
    var size = music.analyser.fftSize / 2;
    var w = width / size;
    for (let i = 0; i < music.analyser.fftSize / 2; i++) {
      var h = arr[i] / 256 * height;
      canvasContext.fillRect(w * i * 4, (height - h) * 0.5, w, h);
    }
  }
};
