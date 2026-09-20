(function () {
  "use strict";

  var img = document.getElementById("mouse-icon");
  var center = document.querySelector(".center");
  if (!img || !center) return;

  var BASE = "images/mouse/";

  function rep(name, n) {
    var a = [];
    for (var i = 0; i < n; i++) a.push(name);
    return a;
  }

  // Idle cycle, per spec: idle -> turn left forward -> backward -> idle ->
  // turn right forward -> backward -> idle -> posture up backward -> forward
  // -> idle -> loop. IDLE_HOLD/TURN_HOLD just repeat a frame a few times so
  // it reads as a pause, not an instant snap.
  var IDLE_HOLD = 4;
  var TURN_HOLD = 2;

  var TURN_LEFT_FWD = ["turn_l_1.png", "turn_l_2.png", "turn_l_3.png", "turn_l_4.png"].concat(rep("turn_left.png", TURN_HOLD));
  var TURN_LEFT_BACK = ["turn_l_4.png", "turn_l_3.png", "turn_l_2.png", "turn_l_1.png"];
  var TURN_RIGHT_FWD = ["turn_r_1.png", "turn_r_2.png", "turn_r_3.png", "turn_r_4.png"].concat(rep("turn_right.png", TURN_HOLD));
  var TURN_RIGHT_BACK = ["turn_r_4.png", "turn_r_3.png", "turn_r_2.png", "turn_r_1.png"];
  // Only two posture-up frames exist (mid, full) - "backwards then
  // forwards" is up -> mid -> up; the shared mid frame at the turnaround
  // isn't repeated.
  var POSTURE_UP_BACK_THEN_FWD = ["posture_up.png", "posture_up_mid.png", "posture_up.png"];

  var IDLE_FRAMES = []
    .concat(rep("idle.png", IDLE_HOLD))
    .concat(TURN_LEFT_FWD)
    .concat(TURN_LEFT_BACK)
    .concat(rep("idle.png", IDLE_HOLD))
    .concat(TURN_RIGHT_FWD)
    .concat(TURN_RIGHT_BACK)
    .concat(rep("idle.png", IDLE_HOLD))
    .concat(POSTURE_UP_BACK_THEN_FWD)
    .concat(rep("idle.png", IDLE_HOLD));
  var IDLE_INTERVAL = 90;

  // Escape sequence (on hover): turn to face right, then a run cycle
  // repeated a few times - timed to match the 1.2s `scurry` CSS animation
  // that handles the actual on-screen movement/fade (see index.html).
  var ESCAPE_TURN_FRAMES = ["turn_r_1.png", "turn_r_2.png", "turn_r_3.png", "turn_r_4.png", "turn_right.png"];
  var ESCAPE_TURN_INTERVAL = 65;
  var SCURRY_FRAMES = ["scurry_r_a.png", "scurry_r_contact.png", "scurry_r_b.png", "scurry_r_contact.png"];
  var SCURRY_INTERVAL = 70;
  var SCURRY_REPEATS = 3;

  var idleTimer = null;
  var escaping = false;

  function setFrame(name) {
    img.src = BASE + name;
  }

  function startIdle() {
    escaping = false;
    clearInterval(idleTimer);
    var i = 0;
    setFrame(IDLE_FRAMES[0]);
    idleTimer = setInterval(function () {
      i = (i + 1) % IDLE_FRAMES.length;
      setFrame(IDLE_FRAMES[i]);
    }, IDLE_INTERVAL);
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

  function runEscape() {
    if (escaping) return;
    escaping = true;
    clearInterval(idleTimer);
    playSequence(ESCAPE_TURN_FRAMES, ESCAPE_TURN_INTERVAL, function () {
      var repeats = 0;
      (function nextCycle() {
        if (!escaping) return;
        playSequence(SCURRY_FRAMES, SCURRY_INTERVAL, function () {
          repeats++;
          if (repeats < SCURRY_REPEATS && escaping) nextCycle();
        });
      })();
    });
  }

  center.addEventListener("mouseenter", runEscape);
  center.addEventListener("mouseleave", startIdle);

  startIdle();
})();
