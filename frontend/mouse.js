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

  // No independent per-frame scaling (that was the bug - see index.html's
  // .mouse-icon comment): each width here is that frame's native pixel
  // width divided by 900px, posture_up.png's native width, which is also
  // the canvas .center is sized to. height:auto (in CSS) keeps each
  // image's own intrinsic aspect ratio, so this one number per frame is
  // enough - every frame ends up at its true relative scale, not
  // independently stretched to fill the box.
  var WIDTH_PCT = {
    "posture_up.png": "100%", // 900/900
    "posture_up_mid.png": "100%", // 900/900
    "idle.png": "63.22%", // 569/900
    "posture_down_mid.png": "85.89%", // 773/900
    "posture_down.png": "91.33%", // 822/900
  };

  var SEQUENCE = [3, 2, 1, 1, 1, 2, 3, 3, 3, 4, 5, 5, 5, 4, 3, 3];

  function setFrame(name) {
    img.src = BASE + name;
    img.style.width = WIDTH_PCT[name] || "100%";
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
