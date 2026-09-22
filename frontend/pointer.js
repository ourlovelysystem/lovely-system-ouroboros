(function () {
  "use strict";

  var FRAME_COUNT = 12;
  var TICK_MS = 167;
  var BASE = "images/pointer/frame_";

  // Hotspot: the mouse's average position across all 12 frames (not the
  // hand's), a single fixed offset - not recalculated per frame. The
  // mouse still has its own small natural wobble around this point (part
  // of the wiggle), same as the hand had its own near-zero wobble around
  // its anchor before. In display-size (129x192) pixels.
  var HOTSPOT_X = 67;
  var HOTSPOT_Y = 107;

  function frameSrc(n) {
    return BASE + (n < 10 ? "0" + n : "" + n) + ".png";
  }

  // Preload every frame so the wiggle plays smoothly from the first loop.
  for (var p = 1; p <= FRAME_COUNT; p++) {
    var pre = new Image();
    pre.src = frameSrc(p);
  }

  var el = document.createElement("img");
  el.className = "custom-pointer";
  el.alt = "";
  el.src = frameSrc(1);
  document.body.appendChild(el);

  var enveloped = false;

  document.addEventListener("mousemove", function (e) {
    if (enveloped) return;
    el.style.opacity = "1";
    el.style.transform =
      "translate(" + e.clientX + "px, " + e.clientY + "px) " +
      "translate(-" + HOTSPOT_X + "px, -" + HOTSPOT_Y + "px)";
  });
  document.documentElement.addEventListener("mouseleave", function () {
    el.style.opacity = "0";
  });

  // Once the user is enveloped in darkness, the custom pointer reverts
  // to normal - the wiggling hand is part of the ring/hole interaction,
  // not the tunnel sequence that follows.
  document.addEventListener("enveloped", function () {
    enveloped = true;
    el.style.opacity = "0";
    document.body.style.cursor = "auto";
  });

  // Returning to the landing page (end of the tunnel sequence) restores
  // the custom pointer.
  document.addEventListener("returned", function () {
    enveloped = false;
    document.body.style.cursor = "none";
  });

  var frame = 1;
  function tick() {
    frame = (frame % FRAME_COUNT) + 1;
    el.src = frameSrc(frame);
    setTimeout(tick, TICK_MS);
  }
  tick();
})();
