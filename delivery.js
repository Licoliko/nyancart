(function(){
  'use strict';
  const MODEL='q045-pages-progressive-delivery-v1',CACHE_VERSION='2026-08-01-q045-v1',RUNTIME_CACHE=`nyan-cart-runtime-${CACHE_VERSION}`,FULL_READY_KEY=`nyan-cart-full-assets-${CACHE_VERSION}`;
  const params=new URLSearchParams(location.search),savedProfile=()=>{try{return JSON.parse(localStorage.getItem('nyan-cart-settings')||'{}').deliveryProfile||'auto'}catch{return'auto'}};
  const githubPages=location.hostname.endsWith('.github.io')||params.get('qaDelivery')==='pages',connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection,slowNetwork=Boolean(connection?.saveData)||['slow-2g','2g'].includes(connection?.effectiveType),coarse=matchMedia('(pointer:coarse)').matches,memory=navigator.deviceMemory||8,cores=navigator.hardwareConcurrency||8;
  const PROFILES=Object.freeze({
    light:Object.freeze({key:'light',label:'PAGES LIGHT',cardRadius:2,courseRadius:1,raceWorkers:1,deferEnhancements:true,preloadAllRacers:false}),
    standard:Object.freeze({key:'standard',label:'STANDARD',cardRadius:5,courseRadius:2,raceWorkers:2,deferEnhancements:true,preloadAllRacers:false}),
    full:Object.freeze({key:'full',label:'FULL',cardRadius:99,courseRadius:99,raceWorkers:4,deferEnhancements:false,preloadAllRacers:true})
  });
  const requested=()=>params.get('deliveryProfile')||savedProfile();
  const automatic=()=>githubPages||slowNetwork||memory<=4||cores<=4&&coarse?'light':'standard';
  const activeKey=()=>requested()==='auto'?automatic():(PROFILES[requested()]?requested():'standard');
  const fullReady=()=>{try{return localStorage.getItem(FULL_READY_KEY)==='1'}catch{return false}};
  const state={model:MODEL,cacheVersion:CACHE_VERSION,host:githubPages?'github-pages':'standard-web',requested:requested(),active:activeKey(),reason:requested()==='auto'?(githubPages?'github-pages':slowNetwork?'network-saver':memory<=4||cores<=4&&coarse?'device':'standard-host'):'manual',phase:'common-ui',requests:0,hits:0,misses:0,unknown:0,lastAsset:'none',serviceWorker:'unsupported',fullAssetsReady:fullReady(),warm:{running:false,done:0,total:0,failed:0},extraFullAssets:[]};
  function profile(){state.requested=requested();state.active=activeKey();state.reason=state.requested==='auto'?(githubPages?'github-pages':slowNetwork?'network-saver':memory<=4||cores<=4&&coarse?'device':'standard-host'):'manual';return PROFILES[state.active]||PROFILES.standard}
  function publish(){
    const targets=[document.documentElement,document.body,document.getElementById('game')].filter(Boolean);for(const target of targets){target.dataset.deliveryModel=MODEL;target.dataset.deliveryProfile=state.active;target.dataset.deliveryRequested=state.requested;target.dataset.deliveryHost=state.host;target.dataset.deliveryReason=state.reason;target.dataset.deliveryPhase=state.phase;target.dataset.deliveryCacheHits=String(state.hits);target.dataset.deliveryCacheMisses=String(state.misses);target.dataset.deliveryCacheUnknown=String(state.unknown);target.dataset.deliveryServiceWorker=state.serviceWorker;target.dataset.deliveryFullReady=String(state.fullAssetsReady);target.dataset.deliveryWarmProgress=state.warm.total?`${state.warm.done}/${state.warm.total}`:'0/0'}
    window.dispatchEvent(new CustomEvent('nyan-delivery-state',{detail:snapshot()}))
  }
  function markPhase(phase){state.phase=phase||state.phase;publish()}
  async function observeAsset(source,phase=state.phase){
    if(!source)return'unknown';state.requests++;state.lastAsset=source;state.phase=phase||state.phase;
    if(!('caches'in window)){state.unknown++;publish();return'unsupported'}
    try{const request=new Request(new URL(source,location.href),{method:'GET'}),match=await caches.match(request,{ignoreSearch:true});if(match)state.hits++;else state.misses++;publish();return match?'hit':'miss'}catch{state.unknown++;publish();return'unknown'}
  }
  function setFullAssetSources(sources){state.extraFullAssets=[...new Set([...(state.extraFullAssets||[]),...(sources||[])].filter(Boolean))]}
  async function assetList(){
    const response=await fetch('assets/runtime-image-manifest.json',{cache:'no-cache'});if(!response.ok)throw new Error(`Runtime manifest HTTP ${response.status}`);const manifest=await response.json(),images=(manifest.assets||[]).map(asset=>asset.output).filter(Boolean);return[...new Set([...images,...state.extraFullAssets])]
  }
  async function warmFullAssets(onProgress=()=>{}){
    if(state.warm.running)return false;if(!('caches'in window))throw new Error('Cache Storage is unavailable');state.warm={running:true,done:0,total:0,failed:0};markPhase('full-download');const urls=await assetList(),cache=await caches.open(RUNTIME_CACHE);state.warm.total=urls.length;publish();onProgress({...state.warm});let cursor=0,aborted=false;
    const worker=async()=>{while(!aborted&&cursor<urls.length){const index=cursor++,source=urls[index],request=new Request(new URL(source,location.href),{method:'GET'});try{const cached=await caches.match(request,{ignoreSearch:true});if(!cached){const response=await fetch(request,{cache:'no-cache'});if(!response.ok)throw new Error(`HTTP ${response.status}`);await cache.put(request,response.clone())}state.warm.done++}catch(error){state.warm.done++;state.warm.failed++;console.info('Optional full asset cache failed',source,error?.message||error)}publish();onProgress({...state.warm,source})}};
    await Promise.all(Array.from({length:Math.min(profile().raceWorkers,4)},worker));state.warm.running=false;state.fullAssetsReady=state.warm.failed===0;if(state.fullAssetsReady)try{localStorage.setItem(FULL_READY_KEY,'1')}catch{}markPhase('full-ready');onProgress({...state.warm,complete:true});return state.fullAssetsReady
  }
  function snapshot(){return{...state,profile:{...profile()},warm:{...state.warm},connection:{saveData:Boolean(connection?.saveData),effectiveType:connection?.effectiveType||'unknown'},device:{memory,cores,coarse}}}
  async function register(){
    if(!('serviceWorker'in navigator)||!/^https?:$/.test(location.protocol)){state.serviceWorker='unsupported';publish();return}
    if(params.has('qaNoServiceWorker')){state.serviceWorker='disabled';publish();return}
    try{const registration=await navigator.serviceWorker.register(`./service-worker.js?v=${encodeURIComponent(CACHE_VERSION)}`,{scope:'./'});state.serviceWorker=navigator.serviceWorker.controller?'controlled':'registered';publish();navigator.serviceWorker.ready.then(()=>{state.serviceWorker=navigator.serviceWorker.controller?'controlled':'ready';publish()});registration.update().catch(()=>{})}catch(error){state.serviceWorker=`error:${error?.name||'registration'}`;publish()}
  }
  window.NyanDelivery={MODEL,CACHE_VERSION,profiles:PROFILES,state,profile,activeProfile:()=>profile().key,isPages:()=>githubPages,markPhase,observeAsset,setFullAssetSources,warmFullAssets,snapshot,publish,register};
  publish();addEventListener('DOMContentLoaded',publish,{once:true});register();
})();
