const CACHE='interrail-v8';
const URLS=['./',
'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(URLS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
      if(res.ok&&e.request.url.startsWith('http')){
        const cl=res.clone();
        caches.open(CACHE).then(c=>c.put(e.request,cl));
      }
      return res;
    }).catch(()=>caches.match('./')))
  );
});
