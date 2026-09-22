(function () {
  "use strict";

  var FRAME_COUNT = 12;
  var TICK_MS = 167;
  var BASE = "images/pointer/frame_";

  // Hotspot per frame: the mouse's own centroid (not the hand), in
  // display-size (129x192) pixels - the mouse swings relative to the
  // fixed hand across the wiggle, so this is measured per frame rather
  // than being one fixed offset. Index 0 unused (frames are 1-based).
  var HOTSPOTS = [
    null,
    [66, 105], [67, 105], [66, 107], [67, 105], [68, 109], [66, 106],
    [66, 110], [65, 106], [69, 108], [66, 106], [70, 111], [67, 108],
  ];

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

  var mouseX = null;
  var mouseY = null;
  var frame = 1;

  function reposition() {
    if (mouseX === null) return;
    var hs = HOTSPOTS[frame];
    el.style.transform =
      "translate(" + mouseX + "px, " + mouseY + "px) " +
      "translate(-" + hs[0] + "px, -" + hs[1] + "px)";
  }

  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    el.style.opacity = "1";
    reposition();
  });
  document.documentElement.addEventListener("mouseleave", function () {
    el.style.opacity = "0";
  });

  function tick() {
    frame = (frame % FRAME_COUNT) + 1;
    el.src = frameSrc(frame);
    reposition();
    setTimeout(tick, TICK_MS);
  }
  tick();
})();
