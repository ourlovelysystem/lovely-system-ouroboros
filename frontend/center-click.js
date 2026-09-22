(function () {
  "use strict";

  var center = document.querySelector(".center");
  var strike = document.querySelector(".center-strike");
  var blackout = document.querySelector(".blackout");
  if (!center || !strike || !blackout) return;

  center.addEventListener("click", function () {
    strike.classList.add("growing");
    blackout.classList.add("active");
  });
})();
