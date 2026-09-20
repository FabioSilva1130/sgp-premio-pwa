const CACHE_NAME='sgp-premio-2.0.4';
const APP_SHELL=['./','./index.html','./manifest.json','./config.json'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req,{cache:'no-store'}).then(r=>{const c=r.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',c));return r}).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(fetch(req,{cache:'no-store'}).then(r=>{if(new URL(req.url).origin===self.location.origin){const c=r.clone();caches.open(CACHE_NAME).then(cache=>cache.put(req,c))}return r}).catch(()=>caches.match(req)));
});
