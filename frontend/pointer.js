(function () {
  "use strict";

  var FRAME_COUNT = 12;
  var TICK_MS = 80;
  var BASE = "images/pointer/frame_";

  // Hotspot: the hand's pinch point, in display-size (65x96) pixels -
  // measured from the source frames, see the CSS comment on .custom-pointer.
  var HOTSPOT_X = 39;
  var HOTSPOT_Y = 7;

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

  document.addEventListener("mousemove", function (e) {
    el.style.opacity = "1";
    el.style.transform =
      "translate(" + e.clientX + "px, " + e.clientY + "px) " +
      "translate(-" + HOTSPOT_X + "px, -" + HOTSPOT_Y + "px)";
  });
  document.documentElement.addEventListener("mouseleave", function () {
    el.style.opacity = "0";
  });

  var frame = 1;
  function tick() {
    frame = (frame % FRAME_COUNT) + 1;
    el.src = frameSrc(frame);
    setTimeout(tick, TICK_MS);
  }
  tick();
})();
