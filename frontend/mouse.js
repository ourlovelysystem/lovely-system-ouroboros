(function () {
  "use strict";

  var img = document.getElementById("mouse-icon");
  if (!img) return;

  var BASE = "images/mouse/";
  var MID_MS = 300;
  var OTHER_MS = 600;

  var SEQUENCE = [
    { frame: "idle.png", ms: OTHER_MS },
    { frame: "posture_down_mid.png", ms: MID_MS },
    { frame: "posture_down.png", ms: OTHER_MS },
    { frame: "posture_down_mid.png", ms: MID_MS },
    { frame: "idle.png", ms: OTHER_MS },
  ];

  function setFrame(name) {
    img.src = BASE + name;
  }

  function step(i) {
    var entry = SEQUENCE[i % SEQUENCE.length];
    setFrame(entry.frame);
    setTimeout(function () {
      step(i + 1);
    }, entry.ms);
  }

  step(0);
})();
