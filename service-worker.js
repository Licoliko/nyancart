'use strict';
const VERSION='2026-08-08-grid-queen-batch2-mobile-audio-v5';
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
function audioRangeBounds(value,size){const match=/^bytes=(\d*)-(\d*)$/i.exec(value||'');if(!match)return null;let start=match[1]?Number(match[1]):null,end=match[2]?Number(match[2]):null;if(start===null){const suffix=Math.max(0,end||0);start=Math.max(0,size-suffix);end=size-1}else{end=end===null?size-1:Math.min(end,size-1)}if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||start>=size||end<start)return null;return{start,end}}
async function sliceAudioRange(response,range){const buffer=await response.arrayBuffer(),bounds=audioRangeBounds(range,buffer.byteLength);if(!bounds)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${buffer.byteLength}`,'Accept-Ranges':'bytes'}});const headers=new Headers(response.headers);headers.delete('Content-Encoding');headers.set('Accept-Ranges','bytes');headers.set('Content-Range',`bytes ${bounds.start}-${bounds.end}/${buffer.byteLength}`);headers.set('Content-Length',String(bounds.end-bounds.start+1));return new Response(buffer.slice(bounds.start,bounds.end+1),{status:206,statusText:'Partial Content',headers})}
async function audioStream(request){
  const range=request.headers.get('range');if(!range)return cacheFirst(request);const fullRequest=new Request(request.url,{method:'GET',credentials:request.credentials,mode:'same-origin'}),hit=await cached(fullRequest);if(hit?.ok&&hit.status===200)return sliceAudioRange(hit,range);
  try{const response=await fetch(request);if(response.status===206)return response;if(response.ok&&response.status===200){const copy=response.clone();await cacheResponse(RUNTIME_CACHE,fullRequest,copy);return sliceAudioRange(response,range)}return response}catch(error){const fallback=await cached(fullRequest);if(fallback?.ok&&fallback.status===200)return sliceAudioRange(fallback,range);throw error}
}
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){event.respondWith(networkFirst(request));return}
  if(['script','style','worker'].includes(request.destination)){event.respondWith(networkFirst(request));return}
  if(request.destination==='audio'||url.pathname.includes('/assets/audio/')){event.respondWith(audioStream(request));return}
  if(['image','font'].includes(request.destination)||url.pathname.includes('/assets/')){event.respondWith(cacheFirst(request));return}
  event.respondWith(networkFirst(request));
});
