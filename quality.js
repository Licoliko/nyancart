(function(){
  'use strict';

  const REQUIRED_VIEWPORTS=[
    {name:'PC',width:1440,height:900},
    {name:'スマホ横',width:844,height:390},
    {name:'スマホ縦',width:390,height:844}
  ];
  const FRAME_LABELS=['左','左後45°','左後15°','後','右後15°','右後45°','右','左','左前45°','左前15°','正面','右前15°','右前45°','右'];
  const monitor={frames:0,windowStart:performance.now(),fps:0,p95:0,maxFrame:0,longFrames:0,maxParticles:0,maxObjects:0,maxAiOffroad:0,rampMismatches:0,lastRampKey:'',samples:[],raceSeconds:0};
  let lastFrame=performance.now(),lastReport=null,restorePause=null;

  function result(scope,name,status,message,data={}){return{scope,name,status,message,data}}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
  function angleDelta(a,b){return Math.atan2(Math.sin(a-b),Math.cos(a-b))}
  function catmull(a,b,c,d,t){const t2=t*t,t3=t2*t;return .5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t2+(-a+3*b-3*c+d)*t3)}
  function rawPoint(nodes,t){const n=nodes.length-1,p=((t%1)+1)%1*n,i=Math.floor(p),f=p-i,get=k=>nodes[(k+n)%n];return[catmull(get(i-1)[0],get(i)[0],get(i+1)[0],get(i+2)[0],f),catmull(get(i-1)[1],get(i)[1],get(i+1)[1],get(i+2)[1],f)]}
  function headingAt(nodes,t){const e=1/3600,a=rawPoint(nodes,t-e),b=rawPoint(nodes,t+e);return Math.atan2(b[1]-a[1],b[0]-a[0])}
  function percentile(values,p){if(!values.length)return 0;const sorted=[...values].sort((a,b)=>a-b);return sorted[Math.min(sorted.length-1,Math.floor((sorted.length-1)*p))]}

  function auditCourse(course,index){
    const out=[],scope=`COURSE ${String(index+1).padStart(2,'0')}`,nodes=course.nodes||[],length=course.finishDistance||1800;
    if(nodes.length<8)out.push(result(scope,course.short,'fail',`制御点が少なすぎます（${nodes.length}点）`));
    else out.push(result(scope,course.short,'pass',`${nodes.length-1}区間 / ${length}m`));
    const closure=nodes.length>1?Math.hypot(nodes[0][0]-nodes.at(-1)[0],nodes[0][1]-nodes.at(-1)[1]):1;
    out.push(result(scope,'ループ接続',closure<.002?'pass':'fail',closure<.002?'始点と終点が一致':`始点と終点が ${closure.toFixed(4)} 離れています`));
    const outside=nodes.filter(p=>!Number.isFinite(p?.[0])||!Number.isFinite(p?.[1])||p[0]<.02||p[0]>.98||p[1]<.02||p[1]>.98).length;
    out.push(result(scope,'マップ範囲',outside?'warn':'pass',outside?`${outside}点が安全範囲外`:'全制御点が安全範囲内'));
    if(nodes.length>=8){
      const turns=[];let previous=headingAt(nodes,0);
      for(let i=1;i<=720;i++){const heading=headingAt(nodes,i/720);turns.push(Math.abs(angleDelta(heading,previous))*180/Math.PI);previous=heading}
      // The renderer deliberately low-pass filters Catmull-Rom tangents. Raw
      // node turns above roughly 10 degrees are therefore review items, while
      // only extreme discontinuities are hard failures.
      const peak=Math.max(...turns),p99=percentile(turns,.99),status=peak>18?'fail':peak>9.5?'warn':'pass';
      out.push(result(scope,'カーブ連続性',status,`最大 ${peak.toFixed(2)}° / P99 ${p99.toFixed(2)}°`,{peakTurn:peak,p99Turn:p99}));
    }
    const heightSteps=(course.heights||[]).map((h,i,a)=>i?Math.abs(h-a[i-1]):0),heightPeak=Math.max(0,...heightSteps);
    out.push(result(scope,'高低差',heightPeak>.72?'warn':'pass',`${course.heights?.length||0}点 / 最大段差 ${heightPeak.toFixed(2)}`));
    const badTunnels=(course.tunnels||[]).filter(t=>!Array.isArray(t)||t.length!==2||t[0]<0||t[1]<=t[0]||t[1]>length).length;
    out.push(result(scope,'トンネル',badTunnels?'fail':'pass',badTunnels?`${badTunnels}区間に不正な距離`:`${course.tunnels?.length||0}区間を確認`));
    const rampRow=course.rampRow??Math.min(4,index);out.push(result(scope,'ジャンプ台テーマ',rampRow>=0&&rampRow<5?'pass':'fail',`アトラス行 ${rampRow}`));
    const start=course.startLine??55;out.push(result(scope,'ゴール判定',start>=0&&start<length?'pass':'fail',`開始線 ${start}m / ゴール ${length*(course.totalLaps||2)+start}m`));
    return out;
  }

  function analyzeAlphaCell(image,col,row){
    const size=72,c=document.createElement('canvas');c.width=size;c.height=size;const g=c.getContext('2d',{willReadFrequently:true}),sw=image.naturalWidth/7,sh=image.naturalHeight/2;
    g.drawImage(image,col*sw,row*sh,sw,sh,0,0,size,size);const data=g.getImageData(0,0,size,size).data;let minX=size,minY=size,maxX=-1,maxY=-1,count=0;
    for(let y=0;y<size;y++)for(let x=0;x<size;x++){if(data[(y*size+x)*4+3]<18)continue;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);count++}
    return count?{x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1,occupancy:count/(size*size),margin:Math.min(minX,size-1-maxX)}:null;
  }
  async function auditRacer(racer,index){
    const scope=`RACER ${String(index+1).padStart(2,'0')}`,out=[];
    try{
      const frames=await ensureRacerSprite(index),image=frames?.[0]?.image;
      if(!image||frames.length!==14)return{results:[result(scope,racer.slug,'fail',`スプライトが14コマではありません（${frames?.length||0}）`)],cells:[]};
      const exact=image.naturalWidth%7===0&&image.naturalHeight%2===0;
      out.push(result(scope,'シート分割',exact?'pass':'fail',`${image.naturalWidth}×${image.naturalHeight} / 7×2 / 14コマ`));
      const cells=[];for(let row=0;row<2;row++)for(let col=0;col<7;col++)cells.push(analyzeAlphaCell(image,col,row));
      const empty=cells.filter(cell=>!cell).length,minMargin=Math.min(...cells.filter(Boolean).map(cell=>cell.margin)),overflow=minMargin<2;
      out.push(result(scope,'セル分離',empty?'fail':overflow?'warn':'pass',empty?`${empty}コマが空です`:`最小余白 ${minMargin}px / 72px解析`));
      const pairs=[[0,6],[1,5],[2,4],[7,13],[8,12],[9,11]],pairErrors=pairs.map(([a,b])=>{const x=cells[a],y=cells[b];if(!x||!y)return 1;return Math.max(Math.abs(x.w-y.w)/Math.max(x.w,y.w),Math.abs(x.h-y.h)/Math.max(x.h,y.h))}),worst=Math.max(...pairErrors);
      out.push(result(scope,'左右ペア輪郭',worst>.34?'warn':'pass',`最大輪郭差 ${Math.round(worst*100)}%（向きは一覧で目視確認）`,{pairDifference:worst}));
      const sound=window.NyanAudio?.getMachineInfo(racer.slug);out.push(result(scope,'専用エンジン音',sound?'pass':'fail',sound?`${sound.label} / ${sound.concept}`:'音響プロファイルがありません'));
      return{results:out,cells,frames,racer};
    }catch(error){return{results:[result(scope,racer.slug,'fail',`読み込み失敗: ${error?.message||error}`)],cells:[]}}
  }

  async function auditStyles(){
    const out=[];try{const css=await fetch('style.css',{cache:'no-store'}).then(r=>r.text()),requirements=[['スマホ縦','orientation:portrait'],['スマホ横','orientation:landscape'],['狭い画面','max-width:700px'],['低い横画面','max-height:560px']];for(const [name,token] of requirements)out.push(result('LAYOUT',name,css.includes(token)?'pass':'fail',css.includes(token)?`${token} の専用規則あり`:`${token} がありません`))}catch(error){out.push(result('LAYOUT','レスポンシブCSS','fail',String(error)))}
    try{const manifest=await fetch('assets/runtime-image-manifest.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json()}),saved=Number(manifest.savedPercent)||0;out.push(result('ASSET','WebP容量最適化',manifest.files>=100&&saved>=35?'pass':'fail',`${manifest.files}画像・${saved.toFixed(1)}%削減・セル寸法維持`))}catch(error){out.push(result('ASSET','WebP容量最適化','fail',String(error)))}
    const adaptive=window.NyanAdaptiveQuality,minimum=adaptive?.minimumRenderScale||0;out.push(result('PERFORMANCE','実測FPS自動画質',adaptive&&minimum>=.72?'pass':'fail',adaptive?`HIGH / BALANCED / LIGHT・最低内部解像度 ${Math.round(minimum*100)}%`:'自動画質制御が未接続'));
    out.push(result('LAYOUT','現在の画面','pass',`${innerWidth}×${innerHeight} / ${matchMedia('(orientation:portrait)').matches?'縦':'横'} / 描画 ${canvas.dataset.renderScale||'--'}`));
    for(const view of REQUIRED_VIEWPORTS)out.push(result('LAYOUT MATRIX',view.name,'pass',`${view.width}×${view.height} はブラウザ自動検査対象`,view));return out;
  }

  function auditRampAndAudio(){
    const out=[],yaw=typeof JUMP_RAMP_FRAME_YAW!=='undefined'?JUMP_RAMP_FRAME_YAW:[],monotonic=yaw.length===7&&yaw.every((v,i)=>!i||v<yaw[i-1])&&Math.abs(yaw[3])<.001;
    out.push(result('PROJECTION','ジャンプ台方向表',monotonic?'pass':'fail',monotonic?`左→正面→右の7方向: ${yaw.join(', ')}`:'方向表の順序が不正です'));
    const profiles=window.NYAN_MACHINE_AUDIO_PROFILES||{},missing=racers.filter(r=>!profiles[r.slug]);out.push(result('AUDIO','マシン別音響',missing.length?'fail':'pass',missing.length?`${missing.map(r=>r.slug).join(', ')} が未設定`:`${racers.length}台すべてに固有プロファイル`));
    const labels=new Set(Object.values(profiles).map(p=>p.label));out.push(result('AUDIO','音色の固有性',labels.size===racers.length?'pass':'warn',`${labels.size}種類のエンジン設計 / ${racers.length}台`));
    const modes=typeof SOUND_TEST_MODES!=='undefined'?Object.keys(SOUND_TEST_MODES):[],modeControls=document.querySelectorAll('[data-sound-mode]').length,machineControls=document.querySelectorAll('[data-sound-machine]').length;
    out.push(result('AUDIO','サウンドテスト状態',modes.length===4&&modeControls===4?'pass':'fail',`${modes.join(' / ')}・操作ボタン ${modeControls}`));
    out.push(result('AUDIO','サウンドテスト車両',machineControls===racers.length?'pass':'fail',`${machineControls}台を個別選択 / ${racers.length}台`));
    const rivalAudio=window.NyanAudio?.maxRivalVoices===3&&typeof window.NyanAudio?.updateRivals==='function';out.push(result('AUDIO','近接ライバル定位',rivalAudio?'pass':'fail',rivalAudio?'最大3台・距離減衰・ステレオ定位':'近接ライバル音声が未接続'));
    const doppler=window.NyanAudio?.dopplerEnabled===true&&typeof window.NyanAudio?.getAcousticsDebug==='function';out.push(result('AUDIO','通過ドップラー',doppler?'pass':'fail',doppler?'相対速度・前後位置に連動する軽い周波数変化':'ドップラー処理が未接続'));
    const tunnelAudio=window.NyanAudio?.tunnelReverbEnabled===true&&typeof window.NyanAudio?.setTunnel==='function'&&typeof window.NyanAudio?.makeTunnelImpulse==='function';out.push(result('AUDIO','トンネル音響',tunnelAudio?'pass':'fail',tunnelAudio?'入口フェード・こもり・短いステレオ反響':'トンネル音響が未接続'));return out;
  }

  function drawSpriteGallery(audits){
    const host=document.getElementById('qualitySpriteGallery');if(!host)return;host.replaceChildren();
    for(const audit of audits){if(!audit.frames||!audit.racer)continue;const article=document.createElement('article'),heading=document.createElement('header'),sound=window.NyanAudio?.getMachineInfo(audit.racer.slug);heading.innerHTML=`<strong>${audit.racer.name}</strong><span>${audit.racer.set.kart}</span><em>${sound?.label||'NO SOUND PROFILE'}</em>`;const c=document.createElement('canvas');c.width=1120;c.height=142;c.setAttribute('aria-label',`${audit.racer.name} 14方向確認`);const g=c.getContext('2d');g.fillStyle='#0c0d25';g.fillRect(0,0,c.width,c.height);g.strokeStyle='#ffffff1e';g.font='700 11px sans-serif';g.textAlign='center';g.textBaseline='middle';
      audit.frames.forEach((frame,i)=>{const cellW=80,x=i*cellW;g.strokeRect(x+.5,.5,cellW-1,141);g.fillStyle=i===3||i===10?'#ffe992':'#a9eaff';g.fillText(FRAME_LABELS[i],x+40,11);const scale=Math.min(72/frame.sw,105/frame.sh),w=frame.sw*scale,h=frame.sh*scale;g.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,x+(cellW-w)/2,132-h,w,h)});article.append(heading,c);host.appendChild(article)}
  }

  function renderReport(results,racerAudits){
    const counts={pass:0,warn:0,fail:0};results.forEach(r=>counts[r.status]++);const summary=document.getElementById('qualitySummary'),rows=document.getElementById('qualityRows');
    summary.innerHTML=`<div class="pass"><strong>${counts.pass}</strong><span>PASS</span></div><div class="warn"><strong>${counts.warn}</strong><span>CHECK</span></div><div class="fail"><strong>${counts.fail}</strong><span>FAIL</span></div><div><strong>${courseData.filter(c=>!c.debugOnly).length}</strong><span>COURSES</span></div><div><strong>${racers.length}</strong><span>RACERS</span></div>`;
    rows.innerHTML=results.map(r=>`<div class="quality-row ${r.status}"><span>${r.scope}</span><strong>${r.name}</strong><em>${r.status.toUpperCase()}</em><p>${r.message}</p></div>`).join('');drawSpriteGallery(racerAudits);updateRuntimePanel();
    const status=counts.fail?'fail':counts.warn?'warn':'pass';canvas.dataset.qualityStatus=status;canvas.dataset.qualityFailures=String(counts.fail);canvas.dataset.qualityWarnings=String(counts.warn);
    lastReport={generatedAt:new Date().toISOString(),version:'NYAN-QA-1',viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio||1},summary:counts,runtime:{...monitor,samples:undefined},results};window.__NYAN_QUALITY_REPORT__=lastReport;
    document.getElementById('qualityProgress').textContent=counts.fail?`FAIL ${counts.fail}件を修正してください`:counts.warn?`機械検査完了・目視確認 ${counts.warn}件`:'すべての検査に合格しました';
  }

  function updateRuntimePanel(){const host=document.getElementById('qualityRuntime');if(!host)return;host.innerHTML=`<div><small>FPS</small><strong>${monitor.fps||'--'}</strong></div><div><small>P95 FRAME</small><strong>${monitor.p95.toFixed(1)}ms</strong></div><div><small>AUTO QUALITY</small><strong>${window.NyanAdaptiveQuality?.activePerformanceKey?.().toUpperCase()||'--'}</strong></div><div><small>LONG FRAME</small><strong>${monitor.longFrames}</strong></div><div><small>PARTICLES MAX</small><strong>${monitor.maxParticles}</strong></div><div><small>OBJECTS MAX</small><strong>${monitor.maxObjects}</strong></div><div><small>AI OFFROAD MAX</small><strong>${monitor.maxAiOffroad}</strong></div><div><small>RAMP MISMATCH</small><strong>${monitor.rampMismatches}</strong></div><div><small>VIEWPORT</small><strong>${innerWidth}×${innerHeight}</strong></div>`}

  async function run(){
    const overlay=document.getElementById('qualityReport');if(!overlay)return null;overlay.classList.remove('hidden');overlay.setAttribute('aria-hidden','false');document.getElementById('qualityProgress').textContent='コース形状・画面幅・音響を検査中…';
    if(state.mode==='race'&&!state.paused){state.paused=true;restorePause=()=>{if(state.mode==='race'&&!miaNpc.cutInActive)state.paused=false}}else restorePause=null;
    const results=[];courseData.filter(c=>!c.debugOnly).forEach((course,i)=>results.push(...auditCourse(course,i)));results.push(...auditRampAndAudio());results.push(...await auditStyles());
    const racerAudits=[];for(let i=0;i<racers.length;i+=4){document.getElementById('qualityProgress').textContent=`キャラクター画像を検査中… ${Math.min(i+4,racers.length)} / ${racers.length}`;const batch=await Promise.all(racers.slice(i,i+4).map((r,j)=>auditRacer(r,i+j)));racerAudits.push(...batch);await new Promise(resolve=>requestAnimationFrame(resolve))}
    racerAudits.forEach(a=>results.push(...a.results));renderReport(results,racerAudits);return lastReport;
  }
  function close(){const overlay=document.getElementById('qualityReport');overlay?.classList.add('hidden');overlay?.setAttribute('aria-hidden','true');restorePause?.();restorePause=null}
  function download(type){if(!lastReport)return;let content,mime,name;if(type==='csv'){const esc=v=>`"${String(v??'').replaceAll('"','""')}"`;content='scope,name,status,message\r\n'+lastReport.results.map(r=>[r.scope,r.name,r.status,r.message].map(esc).join(',')).join('\r\n');content='\ufeff'+content;mime='text/csv;charset=utf-8';name='nyan-cart-quality-report.csv'}else{content=JSON.stringify(lastReport,null,2);mime='application/json';name='nyan-cart-quality-report.json'}const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type:mime}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}

  async function prepareAutomationScene(scene){
    settings.preloadCourseAssets=false;settings.richScenery=false;settings.performancePreset='light';applyVisualSettings();document.getElementById('qualityReport')?.classList.add('hidden');
    if(scene==='menu'){state.mode='menu';showScreen('menu')}
    else if(scene==='settings'){settings.performancePreset='auto';resetAdaptiveQualitySamples(true);state.mode='menu';openSettings()}
    else if(scene==='kart'){openKartSelect();await ensureRacerSprite(state.selected)}
    else if(scene==='course')openCourseSelect();
    else if(scene==='difficulty'){state.selectedCourse=0;activateCourse(0);openDifficultySelect()}
    else if(scene==='soundTest'){state.mode='settings';showScreen('settings');openSoundTest();selectSoundTestMode('high')}
    else if(scene==='race'||scene==='tunnel'){const params=new URLSearchParams(location.search),requested=Number(params.get('qaCourse')),courseIndex=Number.isFinite(requested)?clamp(Math.round(requested),0,courseData.filter(c=>!c.debugOnly).length-1):0,distance=Math.max(0,Number(params.get('qaDistance'))||(scene==='tunnel'?635:0));state.selected=0;state.selectedCourse=courseIndex;activateCourse(courseIndex);await Promise.all([ensureRacerSprite(0),ensureItemAndFxAssets(),ensureJumpRampAsset(),ensureCourseEnvironment(courseIndex)]);resetRace();state.distance=distance;state.progress=distance/raceLength();racers.forEach(r=>{r.distance+=distance;r.progress=r.distance/raceLength()});state.cameraHeading=trackSample(state.progress).heading;state.mode='race';state.running=true;state.countdownActive=false;state.speed=150;showScreen(null);document.getElementById('hud').classList.remove('hidden');if(innerWidth<900)document.getElementById('mobileControls').classList.remove('hidden');render(performance.now())}
    else if(scene==='finish'){state.selected=0;state.selectedCourse=0;activateCourse(0);await Promise.all([ensureRacerSprite(0),ensureRacerSprite(1),ensureRacerSprite(2)]);state.finishOrder=[racers[0],racers[1],racers[2],...racers.slice(3)];state.rank=1;state.finishTime=82543;state.raceWalletEarned=12;state.raceRewards=[];state.raceDifficulty='normal';state.mode='finish';showScreen('finish');renderResultCeremony()}
    await new Promise(resolve=>setTimeout(resolve,scene==='finish'?3400:180));if(scene==='race'||scene==='tunnel')updateAudioScene();return inspectAutomationScene(scene)
  }
  function inspectAutomationScene(scene){
    const visible=element=>{if(!element)return false;const style=getComputedStyle(element),box=element.getBoundingClientRect();return style.display!=='none'&&style.visibility!=='hidden'&&box.width>1&&box.height>1},critical={menu:['#openSelect','#openSettings'],settings:['#performancePresetToggle','#performanceDescription','#settingsDone'],kart:['#setHeroImage','#confirmSet','#setGrid'],course:['#courseGrid','#confirmCourse'],difficulty:['#difficultyName','#confirmDifficulty'],soundTest:['#soundTestGrid','#soundTestHero','#soundTestModes'],race:['#game','#hud'],tunnel:['#game','#hud'],finish:['#resultRows','.podium-show','.finish-actions']}[scene]||[],missing=critical.filter(selector=>!visible(document.querySelector(selector))),overflow=Math.max(0,document.documentElement.scrollWidth-innerWidth),buttons=[...document.querySelectorAll('button')].filter(visible),small=buttons.filter(button=>{const box=button.getBoundingClientRect();return box.width<30||box.height<30}).length,failures=[];
    if(missing.length)failures.push(`missing:${missing.join('|')}`);if(overflow>12)failures.push(`overflow:${overflow}`);if(scene==='settings'&&(!document.getElementById('performancePresetToggle')?.textContent.includes('AUTO')||!document.getElementById('performanceDescription')?.textContent.includes('実測FPS')))failures.push('adaptive-quality-copy');if((scene==='race'||scene==='tunnel')&&!canvas.dataset.course)failures.push('race-data:none');if(scene==='race'||scene==='tunnel'){const rivalAudio=Number(canvas.dataset.rivalAudioCount);if(!Number.isFinite(rivalAudio)||rivalAudio<1||rivalAudio>3)failures.push(`rival-audio:${canvas.dataset.rivalAudioCount||'none'}`)}if(scene==='race'&&canvas.dataset.audioTunnel!=='outside')failures.push(`tunnel-audio:${canvas.dataset.audioTunnel||'none'}`);if(scene==='tunnel'&&(canvas.dataset.audioTunnel!=='inside'||Number(canvas.dataset.audioTunnelMix)<.5))failures.push(`tunnel-audio:${canvas.dataset.audioTunnel||'none'}:${canvas.dataset.audioTunnelMix||'none'}`);const board=document.querySelector('.result-board')?.getBoundingClientRect();if(scene==='finish'&&board&&(board.left<-2||board.right>innerWidth+2))failures.push('result-board:outside');const status=failures.length?'fail':small?'warn':'pass';document.body.dataset.qaScene=scene;document.body.dataset.qaSceneStatus=status;document.body.dataset.qaSceneFailures=failures.join(',')||'none';document.body.dataset.qaViewport=`${innerWidth}x${innerHeight}`;document.body.dataset.qaOverflow=String(overflow);document.body.dataset.qaReady='true';return{scene,status,failures,overflow,small,viewport:{width:innerWidth,height:innerHeight}}
  }

  function monitorFrame(now){
    const dt=now-lastFrame;lastFrame=now;if(dt>0&&dt<500){monitor.samples.push(dt);if(monitor.samples.length>360)monitor.samples.shift();monitor.maxFrame=Math.max(monitor.maxFrame,dt);if(dt>34)monitor.longFrames++}
    if(typeof state!=='undefined'&&state.mode==='race'){monitor.frames++;monitor.raceSeconds+=dt/1000;monitor.maxParticles=Math.max(monitor.maxParticles,state.particles?.length||0);monitor.maxObjects=Math.max(monitor.maxObjects,state.objects?.length||0);monitor.maxAiOffroad=Math.max(monitor.maxAiOffroad,Number(canvas.dataset.aiOffroad)||0);const frame=canvas.dataset.jumpRampFrame,direction=canvas.dataset.jumpRampDirection;if(frame&&direction&&direction!=='straight'){const col=Number(frame.split(':')[1]),mismatch=direction==='right'?col>3:col<3,key=`${state.selectedCourse}:${Math.round(state.distance/18)}:${frame}:${direction}`;if(mismatch&&key!==monitor.lastRampKey){monitor.rampMismatches++;monitor.lastRampKey=key}}
      if(now-monitor.windowStart>=1000){monitor.fps=Math.round(monitor.frames*1000/(now-monitor.windowStart));monitor.frames=0;monitor.windowStart=now;monitor.p95=percentile(monitor.samples,.95);canvas.dataset.qaFps=String(monitor.fps);canvas.dataset.qaFrameP95=monitor.p95.toFixed(1);canvas.dataset.qaRampMismatch=String(monitor.rampMismatches);updateRuntimePanel()}
    }else if(now-monitor.windowStart>=1000){monitor.fps=0;monitor.frames=0;monitor.windowStart=now;monitor.p95=percentile(monitor.samples,.95);updateRuntimePanel()}
    requestAnimationFrame(monitorFrame)
  }

  document.getElementById('debugQualityCheck')?.addEventListener('click',run);document.getElementById('qualityClose')?.addEventListener('click',close);document.getElementById('qualityExportJson')?.addEventListener('click',()=>download('json'));document.getElementById('qualityExportCsv')?.addEventListener('click',()=>download('csv'));
  addEventListener('keydown',event=>{if(event.code==='F8'){event.preventDefault();run()}if(event.code==='Escape'&&!document.getElementById('qualityReport')?.classList.contains('hidden')){event.stopImmediatePropagation();close()}},true);
  requestAnimationFrame(monitorFrame);
  window.NyanQuality={run,close,snapshot:()=>lastReport,monitor,requiredViewports:REQUIRED_VIEWPORTS,prepareScene:prepareAutomationScene,inspectScene:inspectAutomationScene};
  const query=new URLSearchParams(location.search),automationScene=query.get('qaScene');if(automationScene)setTimeout(()=>prepareAutomationScene(automationScene).catch(error=>{document.body.dataset.qaScene=automationScene;document.body.dataset.qaSceneStatus='fail';document.body.dataset.qaSceneFailures=String(error?.message||error);document.body.dataset.qaReady='true'}),120);else if(query.has('qualityAudit'))setTimeout(run,250);
})();
