(function () {
  "use strict";

  var tiles = Array.prototype.slice.call(document.querySelectorAll(".tile"));
  var pointer = null; // {x, y} in viewport coords; null when pointer isn't over the page

  document.addEventListener("mousemove", function (e) {
    pointer = { x: e.clientX, y: e.clientY };
  });
  document.documentElement.addEventListener("mouseleave", function () {
    pointer = null;
  });

  function tick() {
    for (var i = 0; i < tiles.length; i++) {
      var inside = false;
      if (pointer) {
        var rect = tiles[i].getBoundingClientRect();
        inside = pointer.x >= rect.left && pointer.x <= rect.right &&
                 pointer.y >= rect.top && pointer.y <= rect.bottom;
      }
      tiles[i].classList.toggle("is-struck", inside);
    }
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
