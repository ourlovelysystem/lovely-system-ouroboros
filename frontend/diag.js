(function () {
  "use strict";

  var el = document.getElementById("diag");
  if (!el) return;

  fetch(location.pathname + "?_=" + Date.now(), { method: "HEAD", cache: "no-store" })
    .then(function (res) {
      var lm = res.headers.get("Last-Modified");
      el.textContent = "last pushed: " + (lm ? new Date(lm).toLocaleString() : "unknown");
    })
    .catch(function () {
      el.textContent = "last pushed: unknown";
    });
})();
