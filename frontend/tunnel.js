(function () {
  "use strict";

  var img = document.querySelector(".tunnel-img");
  if (!img) return;

  var FRAMES = [
    "images/tunnel/tunnel_01.png",
    "images/tunnel/tunnel_02.png",
    "images/tunnel/tunnel_03.png",
    "images/tunnel/tunnel_04.png",
    "images/tunnel/tunnel_05.png",
    "images/tunnel/tunnel_06.png",
    "images/tunnel/tunnel_07.png",
  ];
  var EXPAND_SCALE = 1.6;
  var STEP_MS = 3000;

  var index = 0;

  function showFrame(i) {
    img.style.transition = "none";
    img.style.transform = "scale(1)";
    img.style.opacity = "0";
    img.src = FRAMES[i];
    img.style.pointerEvents = "auto";
    // Force reflow so the reset above is committed before transitions are
    // re-enabled, otherwise the browser can skip straight to the end
    // state instead of animating from it.
    void img.offsetWidth;
    img.style.transition = "opacity 3s ease, transform 3s ease-in";
    requestAnimationFrame(function () {
      img.style.opacity = "1";
    });
  }

  function onClick() {
    img.removeEventListener("click", onClick);
    img.style.pointerEvents = "none";
    img.style.transform = "scale(" + EXPAND_SCALE + ")";
    setTimeout(function () {
      img.style.opacity = "0";
      setTimeout(function () {
        index++;
        if (index < FRAMES.length) {
          showFrame(index);
          img.addEventListener("click", onClick);
        }
      }, STEP_MS);
    }, STEP_MS);
  }

  document.addEventListener("enveloped", function () {
    index = 0;
    showFrame(0);
    img.addEventListener("click", onClick);
  });
})();
