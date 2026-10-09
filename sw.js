const C='ncdc-v15';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith(C.split('-v')[0])&&k!==C).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const same=new URL(e.request.url).origin===location.origin;e.respondWith(fetch(e.request).then(res=>{if(same&&res.ok){const copy=res.clone();caches.open(C).then(c=>c.put(e.request,copy)).catch(()=>{});}return res;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./'))));});
