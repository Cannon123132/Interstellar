importScripts("/assets/history/config.js?v=2025-04-15");
importScripts("/assets/history/worker.js?v=2025-04-15");
importScripts("/assets/mathematics/bundle.js?v=2025-04-15");
importScripts("/assets/mathematics/config.js?v=2025-04-15");
importScripts(__uv$config.sw || "/assets/mathematics/sw.js?v=2025-04-15");

const uv = new UVServiceWorker();
const dynamic = new Dynamic();

const userKey = new URL(location).searchParams.get("userkey");
self.dynamic = dynamic;

self.addEventListener("fetch", event => {
  event.respondWith(
    (async () => {
      if (await dynamic.route(event)) {
        return await dynamic.fetch(event);
      }

      // Handle Font Awesome CDN requests
      const url = new URL(event.request.url);
      if (url.hostname === "ka-f.fontawesome.com" || url.hostname === "kit.fontawesome.com") {
        const proxiedUrl = "/a/" + __uv$config.encodeUrl(event.request.url);
        const proxiedRequest = new Request(proxiedUrl, {
          method: event.request.method,
          headers: event.request.headers,
          body: event.request.body,
          mode: event.request.mode,
          credentials: event.request.credentials,
          cache: event.request.cache,
          redirect: event.request.redirect,
          referrer: event.request.referrer
        });
        return await uv.fetch({ ...event, request: proxiedRequest });
      }

      if (event.request.url.startsWith(`${location.origin}/a/`)) {
        return await uv.fetch(event);
      }

      return await fetch(event.request);
    })(),
  );
});
