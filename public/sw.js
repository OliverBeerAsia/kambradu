const CACHE_NAME = "kambradu-shell-v3";
const APP_SHELL = ["/", "/lexicon", "/stories", "/about", "/manifest.webmanifest", "/icon.svg", "/hegel.png"];
const RESTRICTED_PATHS = ["/journal", "/saved", "/contribute", "/steward", "/sign-in"];

function isRestricted(requestUrl) {
  const url = new URL(requestUrl);
  return RESTRICTED_PATHS.some((path) => url.pathname === path || url.pathname.startsWith(`${path}/`));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (isRestricted(event.request.url)) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response.ok || response.type === "opaque") {
          return response;
        }

        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/")))
  );
});
