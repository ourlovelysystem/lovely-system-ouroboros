(function () {
  "use strict";

  var imgA = document.getElementById("tunnel-img-a");
  var imgB = document.getElementById("tunnel-img-b");
  var hotspot = document.getElementById("tunnel-hotspot");
  if (!imgA || !imgB || !hotspot) return;

  var FRAMES = [
    "images/tunnel/tunnel_01.png",
    "images/tunnel/tunnel_02.png",
    "images/tunnel/tunnel_03.png",
    "images/tunnel/tunnel_04.png",
    "images/tunnel/tunnel_05.png",
    "images/tunnel/tunnel_06.png",
    "images/tunnel/tunnel_07.png",
  ];
  // Each frame's own light-source position - the bright core specifically,
  // not the halo or the lit tunnel walls around it (checked against a
  // marked overlay of every frame, not just measured blind). As a raw
  // fraction (0-1) of the source image's own width/height.
  var LIGHT_FRAC = [
    [0.506, 0.481],
    [0.475, 0.534],
    [0.497, 0.478],
    [0.503, 0.457],
    [0.500, 0.336],
    [0.517, 0.336],
    [0.500, 0.440],
  ];
  var IMG_W = 784;
  var IMG_H = 1168;
  var EXPAND_SCALE = 1.6;
  var EXPAND_MS = 3000;
  var FADE_MS = 1000;

  var imgs = [imgA, imgB];
  var cur = 0;
  var index = 0;

  // object-position: X% Y% is NOT the same as "the light's own fraction
  // of the image" except by coincidence at one specific viewport aspect
  // ratio - object-fit:cover's crop amount depends on how the image's
  // aspect ratio compares to the viewport's, so the object-position
  // needed to land a given point at the viewport center has to be solved
  // from that crop, not read off the source image directly.
  function lightObjectPosition(fx, fy) {
    var boxW = window.innerWidth;
    var boxH = window.innerHeight;
    var scale = Math.max(boxW / IMG_W, boxH / IMG_H);
    var scaledW = IMG_W * scale;
    var scaledH = IMG_H * scale;
    var xPct = 50;
    var yPct = 50;
    if (scaledW > boxW) {
      xPct = ((fx * scaledW - boxW / 2) / (scaledW - boxW)) * 100;
    }
    if (scaledH > boxH) {
      yPct = ((fy * scaledH - boxH / 2) / (scaledH - boxH)) * 100;
    }
    xPct = Math.max(0, Math.min(100, xPct));
    yPct = Math.max(0, Math.min(100, yPct));
    return xPct + "% " + yPct + "%";
  }

  function prepare(img, frameIndex) {
    img.style.transition = "none";
    img.style.opacity = "0";
    img.style.transform = "scale(1)";
    var frac = LIGHT_FRAC[frameIndex];
    img.style.objectPosition = lightObjectPosition(frac[0], frac[1]);
    img.src = FRAMES[frameIndex];
    // Force reflow so the reset above is committed before transitions are
    // re-enabled, otherwise the browser can skip straight to the end
    // state instead of animating from it.
    void img.offsetWidth;
    img.style.transition = "opacity " + FADE_MS + "ms ease, transform " + EXPAND_MS + "ms ease-in";
  }

  function returnToLanding(curImg) {
    curImg.style.opacity = "0";

    setTimeout(function () {
      [imgA, imgB].forEach(function (img) {
        img.style.transition = "none";
        img.style.opacity = "0";
        img.style.transform = "scale(1)";
      });

      var strike = document.querySelector(".center-strike");
      var blackout = document.querySelector(".blackout");
      if (strike) strike.classList.remove("growing");
      if (blackout) blackout.classList.remove("active");

      document.dispatchEvent(new CustomEvent("returned"));
    }, FADE_MS);
  }

  function onClick() {
    hotspot.classList.remove("active");
    hotspot.removeEventListener("click", onClick);

    var curImg = imgs[cur];
    var nextIdx = 1 - cur;
    var nextImg = imgs[nextIdx];
    var hasNext = index + 1 < FRAMES.length;

    if (hasNext) {
      prepare(nextImg, index + 1);
    }

    curImg.style.transform = "scale(" + EXPAND_SCALE + ")";

    setTimeout(function () {
      if (!hasNext) {
        // Last frame: instead of dead-ending, return to the landing page -
        // the ring/tunnel is meant to be a full Ouroboros loop.
        returnToLanding(curImg);
        return;
      }

      index++;
      // Crossfade: fade out the current frame and fade in the next one
      // at the same time, so there's no black gap between them.
      curImg.style.opacity = "0";
      requestAnimationFrame(function () {
        nextImg.style.opacity = "1";
      });
      cur = nextIdx;

      setTimeout(function () {
        hotspot.classList.add("active");
        hotspot.addEventListener("click", onClick);
      }, FADE_MS);
    }, EXPAND_MS);
  }

  document.addEventListener("enveloped", function () {
    index = 0;
    cur = 0;
    prepare(imgA, 0);
    requestAnimationFrame(function () {
      imgA.style.opacity = "1";
    });
    hotspot.classList.add("active");
    hotspot.addEventListener("click", onClick);
  });
})();
