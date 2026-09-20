(function () {
  "use strict";

  var img = document.getElementById("mouse-icon");
  if (!img) return;

  var BASE = "images/mouse/";
  var TICK_MS = 200;

  // First animation: idle, posture up, posture down - no mid frames yet.
  // Hold 3 ticks at top (posture_up) and 3 ticks at bottom (posture_down).
  var SEQUENCE = [
    "idle.png",
    "posture_up.png", "posture_up.png", "posture_up.png",
    "posture_down.png", "posture_down.png", "posture_down.png",
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
