// Service worker que agrega COOP/COEP a la página para que quede "cross-origin isolated"
// sin tener que configurar el servidor. Debe estar en la MISMA carpeta que fiveplay.xhtml.
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener("fetch", function (e) {
  var r = e.request;
  if (r.cache === "only-if-cached" && r.mode !== "same-origin") return;

  var req = r.mode === "no-cors" ? new Request(r, { credentials: "omit" }) : r;

  e.respondWith(
    fetch(req).then(function (res) {
      if (res.status === 0) return res;
      var h = new Headers(res.headers);
      h.set("Cross-Origin-Embedder-Policy", "credentialless");
      h.set("Cross-Origin-Opener-Policy", "same-origin");
      return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
    }).catch(function (err) { console.error("coi-sw:", err); })
  );
});
