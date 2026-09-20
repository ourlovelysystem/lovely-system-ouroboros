(function () {
  "use strict";

  var img = document.getElementById("mouse-icon");
  if (!img) return;

  var BASE = "images/mouse/";
  var FRAME_MS = 400;
  var IDLE_HOLD_MS = 1500;

  // Behavior 2, "posturing sequence" (one unit): backward, then forward,
  // named exactly as specced - no de-duplication of the shared middle
  // frame at the junction.
  var POSTURE_BACKWARD = ["posture_up.png", "posture_up_mid.png"];
  var POSTURE_FORWARD = ["posture_up_mid.png", "posture_up.png"];

  function setFrame(name) {
    img.src = BASE + name;
  }

  function playSequence(frames, interval, onDone) {
    var i = 0;
    setFrame(frames[0]);
    var t = setInterval(function () {
      i++;
      if (i >= frames.length) {
        clearInterval(t);
        onDone();
        return;
      }
      setFrame(frames[i]);
    }, interval);
  }

  // Behavior 1 (idle) -> behavior 2 (posturing sequence) -> idle, held
  // 1500ms -> loop.
  function runCycle() {
    playSequence(POSTURE_BACKWARD, FRAME_MS, function () {
      playSequence(POSTURE_FORWARD, FRAME_MS, function () {
        setFrame("idle.png");
        setTimeout(runCycle, IDLE_HOLD_MS);
      });
    });
  }

  setFrame("idle.png");
  setTimeout(runCycle, IDLE_HOLD_MS);
})();
