'use strict';
const VERSION='2026-08-01-q045-v1';
const CORE_CACHE=`nyan-cart-core-${VERSION}`;
const RUNTIME_CACHE=`nyan-cart-runtime-${VERSION}`;
const CORE=[
  './','./index.html','./style.css','./delivery.js','./audio.js','./game.js','./quality.js','./assets/sprite-bounds.js',
  './assets/environment/sweets-circuit-v1.webp','./assets/ui/course-map-v2.webp','./assets/ui/mobile-controls-gpt2.webp'
];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CORE_CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('nyan-cart-')&&!key.endsWith(VERSION)).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
async function cached(request){return caches.match(request,{ignoreSearch:true})}
async function cacheResponse(cacheName,request,response){if(response?.ok&&request.method==='GET'){const cache=await caches.open(cacheName);await cache.put(request,response.clone())}return response}
async function networkFirst(request){try{return await cacheResponse(CORE_CACHE,request,await fetch(request))}catch(error){return(await cached(request))||Promise.reject(error)}}
async function cacheFirst(request){const hit=await cached(request);if(hit)return hit;return cacheResponse(RUNTIME_CACHE,request,await fetch(request))}
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){event.respondWith(networkFirst(request));return}
  if(['script','style','worker'].includes(request.destination)){event.respondWith(networkFirst(request));return}
  if(['image','audio','font'].includes(request.destination)||url.pathname.includes('/assets/')){event.respondWith(cacheFirst(request));return}
  event.respondWith(networkFirst(request));
});
