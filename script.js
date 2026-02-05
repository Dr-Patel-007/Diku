// ===== CONFIG =====
var radius = 240;
var autoRotate = true;
var rotateSpeed = -60;
var imgWidth = 140;
var imgHeight = 200;

// Run after DOM is ready
window.addEventListener("load", function () {

  // ===== 3D CAROUSEL SETUP =====
  var odrag = document.getElementById('drag-container');
  var ospin = document.getElementById('spin-container');
  var ground = document.getElementById('ground');

  if (!odrag || !ospin || !ground) return;

  var aImg = ospin.getElementsByTagName('img');
  var aVid = ospin.getElementsByTagName('video');

  // ---- REPLACE SPREAD WITH CLASSIC CONCAT ----
  var aEle = [];
  for (var i = 0; i < aImg.length; i++) aEle.push(aImg[i]);
  for (var j = 0; j < aVid.length; j++) aEle.push(aVid[j]);
  // -------------------------------------------

  // Size of images
  ospin.style.width = imgWidth + "px";
  ospin.style.height = imgHeight + "px";

  // Size of ground
  ground.style.width = radius * 3 + "px";
  ground.style.height = radius * 3 + "px";

  function init(delayTime) {
    for (var i = 0; i < aEle.length; i++) {
      aEle[i].style.transform =
        "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
      aEle[i].style.transition = "transform 1s";
      aEle[i].style.transitionDelay = (delayTime || (aEle.length - i) / 4) + "s";
    }
  }

  function applyTranform(obj) {
    if (tY > 180) tY = 180;
    if (tY < 0) tY = 0;
    obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
  }

  function playSpin(yes) {
    ospin.style.animationPlayState = yes ? 'running' : 'paused';
  }

  var sX, sY, nX, nY, desX = 0, desY = 0, tX = 0, tY = 10;

  // auto spin
  if (autoRotate) {
    var animationName = rotateSpeed > 0 ? 'spin' : 'spinRevert';
    ospin.style.animation = animationName + " " + Math.abs(rotateSpeed) + "s infinite linear";
  }

  // start after 1s
  setTimeout(init, 1000);

  // drag to rotate
  document.onpointerdown = function (e) {
    clearInterval(odrag.timer);
    e = e || window.event;
    var sX0 = e.clientX, sY0 = e.clientY;

    this.onpointermove = function (e) {
      e = e || window.event;
      var nX0 = e.clientX, nY0 = e.clientY;
      desX = nX0 - sX0;
      desY = nY0 - sY0;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      sX0 = nX0;
      sY0 = nY0;
    };

    this.onpointerup = function () {
      odrag.timer = setInterval(function () {
        desX *= 0.95;
        desY *= 0.95;
        tX += desX * 0.1;
        tY += desY * 0.1;
        applyTranform(odrag);
        playSpin(false);
        if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
          clearInterval(odrag.timer);
          playSpin(true);
        }
      }, 17);
      this.onpointermove = this.onpointerup = null;
    };

    return false;
  };

  // zoom with wheel
  document.onmousewheel = function (e) {
    e = e || window.event;
    var d = e.wheelDelta / 20 || -e.detail;
    radius += d;
    init(1);
  };

  // ===== FLOATING HEARTS =====
  function createHeart() {
    var heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML = "❤️";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (20 + Math.random() * 20) + "px";
    document.body.appendChild(heart);
    setTimeout(function () { heart.parentNode && heart.parentNode.removeChild(heart); }, 4000);
  }
  setInterval(createHeart, 800);

  // ===== AUDIO (SAFE) =====
  var audio = document.getElementById("bg-audio");
  if (!audio) return;

  audio.volume = 0;

  function fadeInAudio() {
    var vol = 0;
    var fade = setInterval(function () {
      if (vol < 1) {
        vol += 0.02;
        audio.volume = vol;
      } else {
        clearInterval(fade);
      }
    }, 120);
  }

  function enableAudio() {
    audio.play().then(fadeInAudio).catch(function () {});
    document.removeEventListener("pointerdown", enableAudio);
    document.removeEventListener("touchstart", enableAudio);
  }

  document.addEventListener("pointerdown", enableAudio);
  document.addEventListener("touchstart", enableAudio);

  // desktop attempt
  audio.play().catch(function () {});
});
