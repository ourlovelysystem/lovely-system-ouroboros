(function () {
  "use strict";

  var img = document.getElementById("mouse-icon");
  if (!img) return;

  var BASE = "images/mouse/";
  var TICK_MS = 300;

  // Sequence numbers per the new asset set (2026-09-20, "New Mouse Assets"):
  // 1=posture_up, 2=posture_up_mid, 3=idle, 4=posture_down_mid, 5=posture_down
  var FRAME_BY_NUMBER = {
    1: "posture_up.png",
    2: "posture_up_mid.png",
    3: "idle.png",
    4: "posture_down_mid.png",
    5: "posture_down.png",
  };

  var SEQUENCE = [3, 2, 1, 1, 1, 2, 3, 3, 3, 4, 5, 5, 5, 4, 3, 3];

  function setFrame(name) {
    img.src = BASE + name;
  }

  function step(i) {
    var n = SEQUENCE[i % SEQUENCE.length];
    setFrame(FRAME_BY_NUMBER[n]);
    setTimeout(function () {
      step(i + 1);
    }, TICK_MS);
  }

  step(0);
})();
