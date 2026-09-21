(function () {
  "use strict";

  var img = document.getElementById("mouse-icon");
  if (!img) return;

  var BASE = "images/mouse/";
  var TICK_MS = 300;

  var SEQUENCE = [
    "idle.png",
    "posture_up_mid.png",
    "posture_up.png",
    "posture_up_mid.png",
    "posture_down_mid.png",
    "posture_down.png",
    "posture_down_mid.png",
    "idle.png",
  ];

  function setFrame(name) {
    img.src = BASE + name;
  }

  function step(i) {
    setFrame(SEQUENCE[i % SEQUENCE.length]);
    setTimeout(function () {
      step(i + 1);
    }, TICK_MS);
  }

  step(0);
})();
