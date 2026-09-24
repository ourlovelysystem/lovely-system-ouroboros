(function () {
  "use strict";

  // Same shared cross-app session cookie Touchstone (and home/earn-credits)
  // use - .ourlovelysystem.org scope means a user already signed in on
  // another OLS app is picked up here too, no new sign-in required, only
  // authenticated_user_id/id_token are read from it (nothing else Touchstone
  // keeps in that cookie - display_name etc - is this page's concern).
  var COOKIE_NAME = "ols_session";
  var COOKIE_DOMAIN = ".ourlovelysystem.org";

  var COGNITO_DOMAIN = "https://ourlovelysystem-867712763388.auth.us-east-1.amazoncognito.com";
  var COGNITO_CLIENT_ID = "3268p93389ii97vt26hmkmv28n"; // lovely-system-ouroboros-web
  var REDIRECT_URI = "https://ouroboros.ourlovelysystem.org/thelight.html";

  function randomId() {
    return "s" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function base64url(bytes) {
    var s = btoa(String.fromCharCode.apply(null, bytes));
    return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function readCookie() {
    var match = document.cookie.match(new RegExp("(?:^|; )" + COOKIE_NAME + "=([^;]*)"));
    if (!match) return null;
    try {
      return JSON.parse(decodeURIComponent(match[1]));
    } catch (e) {
      return null;
    }
  }

  function writeCookie(session) {
    var value = encodeURIComponent(JSON.stringify(session));
    var expires = new Date(Date.now() + 400 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie =
      COOKIE_NAME + "=" + value + "; expires=" + expires + "; path=/; domain=" + COOKIE_DOMAIN + "; SameSite=Lax";
  }

  var session = readCookie();
  if (!session) {
    session = { session_id: randomId(), display_name: "", authenticated_user_id: null, id_token: null };
    writeCookie(session);
  }

  function signIn() {
    var verifierBytes = crypto.getRandomValues(new Uint8Array(32));
    var codeVerifier = base64url(verifierBytes);
    sessionStorage.setItem("ols_pkce_verifier", codeVerifier);
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier)).then(function (hashBuf) {
      var codeChallenge = base64url(new Uint8Array(hashBuf));
      var url = COGNITO_DOMAIN + "/oauth2/authorize" +
        "?client_id=" + encodeURIComponent(COGNITO_CLIENT_ID) +
        "&response_type=code" +
        "&scope=" + encodeURIComponent("openid email profile") +
        "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
        "&code_challenge_method=S256" +
        "&code_challenge=" + codeChallenge;
      window.location.href = url;
    });
  }

  function signOut() {
    session.authenticated_user_id = null;
    session.id_token = null;
    writeCookie(session);
    var url = COGNITO_DOMAIN + "/logout" +
      "?client_id=" + encodeURIComponent(COGNITO_CLIENT_ID) +
      "&logout_uri=" + encodeURIComponent(REDIRECT_URI);
    window.location.href = url;
  }

  function decodeJwtPayload(jwt) {
    var payload = jwt.split(".")[1];
    payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    while (payload.length % 4) payload += "=";
    return JSON.parse(atob(payload));
  }

  function exchangeCodeForToken(code, onDone) {
    var codeVerifier = sessionStorage.getItem("ols_pkce_verifier");
    if (!codeVerifier) return;
    var body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: COGNITO_CLIENT_ID,
      code: code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    });
    fetch(COGNITO_DOMAIN + "/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })
      .then(function (r) { return r.json(); })
      .then(function (tokens) {
        if (!tokens.id_token) return;
        var claims = decodeJwtPayload(tokens.id_token);
        session.authenticated_user_id = claims.email || claims.sub;
        session.id_token = tokens.id_token;
        writeCookie(session);
        var cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        if (onDone) onDone();
      });
  }

  window.OLSAuth = {
    getSession: function () {
      return {
        session_id: session.session_id,
        authenticated_user_id: session.authenticated_user_id,
      };
    },
    signIn: signIn,
    signOut: signOut,
    // Call once on page load; invokes callback (with the up-to-date
    // session) once any pending OAuth redirect has been resolved.
    init: function (callback) {
      var urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("code")) {
        exchangeCodeForToken(urlParams.get("code"), function () { callback(session); });
      } else {
        callback(session);
      }
    },
  };
})();
