(function () {
  "use strict";

  var center = document.querySelector(".center");
  var strike = document.querySelector(".center-strike");
  var blackout = document.querySelector(".blackout");
  if (!center || !strike || !blackout) return;

  var ENVELOPE_MS = 4000; // matches the growing/blackout transition duration

  center.addEventListener("click", function () {
    strike.classList.add("growing");
    blackout.classList.add("active");
    setTimeout(function () {
      document.dispatchEvent(new CustomEvent("enveloped"));
    }, ENVELOPE_MS);
  });
})();
