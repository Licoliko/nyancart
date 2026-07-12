const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const $ = id => document.getElementById(id);

// Keep the original roster available as a local fallback while the cat-only
// roster is integrated. Its assets remain untouched under assets/sprites.
const legacyRacerData = [
  ['レイナ','レイナ.png','reina','#568cff'],['ルージュ','ルージュ.png','rouge','#d74149'],
  ['ユキネ','ユキネ.png','yukine','#bfeaff'],['メイメイ','メイメイ.png','meimei','#9354e8'],
  ['ミオ','ミオ.png','mio','#57cfff'],['マリン','マリン.png','marin','#1477db'],
  ['プリン','プリン.png','purin','#efb754'],['フワリ','フワリ.png','fuwari','#c0a2ff'],
  ['ビート','ビート.png','beat','#e044ff'],['ニコ','ニコ.png','nico','#e78332'],
  ['コノハ','コノハ.png','konoha','#7cbd4d'],['カエデ','カエデ.png','kaede','#ed4832']
];

const racerData = [
  ['アルカ・シャム','アルカ・シャム.png','aruka-sham','#9eb9ff'],
  ['クロネ・ナイト','クロネ・ナイト.png','kurone-night','#7e55e7'],
  ['コハク・タイガ','コハク・タイガ.png','kohaku-taiga','#f18424'],
  ['ゴース・レクス','ゴース・レクス.png','ghost-rex','#8b78d9'],
  ['ネリネ・コラット','ネリネ・コラット.png','nerine-korat','#51c6df'],
  ['フミカ・スコティ','フミカ・スコティ.png','fumika-scotty','#2c8f91'],
  ['ベル・サバンナ','ベル・サバンナ.png','bell-savanna','#d89b35'],
  ['ポポ・マンチ','ポポ・マンチ.png','popo-munch','#b4bc43'],
  ['マロン・メインクイーン','マロン・メインクイーン.png','marron-maine','#8b4b32'],
  ['ミルフィ・ラグドール','ミルフィ・ラグドール.png','milfi-ragdoll','#92c7f4'],
  ['ユキネ・シルキー','ユキネ・シルキー.png','yukine-silky','#d8ecff'],
  ['リズム・スフィン','リズム・スフィン.png','rhythm-sphynx','#d341e7'],
  ['ティック・アビシニアン','ティック・アビシニアン.png','tick-abyssinian','#d77a32'],
  ['フローラ・ターキッシュバン','フローラ・ターキッシュバン.png','flora-turkishvan','#66b84d'],
  ['レスカ・アメリカンカール','レスカ・アメリカンカール.png','reska-americancurl','#ef493a'],
  ['クレオ・マウ','クレオ・マウ.png','cleo-mau','#c8a044'],
  ['シエル・ノルウェー','シエル・ノルウェー.png','ciel-norwegian','#b9dbff'],
  ['シュクレ・ペルシャ','シュクレ・ペルシャ.png','sucre-persian','#f19ac3'],
  ['モカ・オリエンタル','モカ・オリエンタル.png','moka-oriental','#8f6c62'],
  ['ガーネット・ベンガル','ガーネット・ベンガル.png','garnet-bengal','#d26f2e'],
  ['リンカ・ソマリ','リンカ・ソマリ.png','rinka-somali','#d95a3e'],
  ['ステラ・ロシアンブルー','ステラ・ロシアンブルー.png','stella-russianblue','#9eb6df'],
  ['ハニー・ブリティッシュ','ハニー・ブリティッシュ.png','honey-british','#d9a338'],
  ['リベル・バーマン','リベル・バーマン.png','liber-birman','#d8c1a0']
];

const racerSetData = [
  {kart:'プリズム・ロイヤル',rank:'S',description:'気品と瞬発力を両立した、きらめく専用レーシングセット。',stats:{speed:82,accel:88,handling:76,boost:86,technique:72}},
  {kart:'ルナ・ファング',rank:'S',description:'夜の直線を切り裂く、最高速とブースト重視の漆黒セット。',stats:{speed:91,accel:72,handling:74,boost:93,technique:80}},
  {kart:'タイガー・クロー4X4',rank:'A',description:'荒れた路面でも力強く加速する、安定感抜群のワイルドセット。',stats:{speed:78,accel:86,handling:69,boost:80,technique:68}},
  {kart:'ファントム・コルセア',rank:'S',description:'コーナー出口から一気に伸びる、幻影のテクニカルセット。',stats:{speed:86,accel:70,handling:72,boost:91,technique:89}},
  {kart:'アクア・メデューサ',rank:'A',description:'しなやかな旋回性能でラインを外さない、水流制御セット。',stats:{speed:75,accel:86,handling:93,boost:72,technique:84}},
  {kart:'レター・ウイング',rank:'S',description:'軽快な応答と扱いやすさを備えた、万能エアメールセット。',stats:{speed:80,accel:82,handling:88,boost:78,technique:91}},
  {kart:'サバンナ・ファング',rank:'A',description:'重い車体を活かして競り合いに強い、猛獣パワーセット。',stats:{speed:89,accel:76,handling:70,boost:84,technique:74}},
  {kart:'クロックワーク・マウス',rank:'A',description:'小回りと立ち上がりの鋭さが魅力の、からくり加速セット。',stats:{speed:72,accel:93,handling:87,boost:76,technique:89}},
  {kart:'メインクーン・エクスプレス',rank:'S',description:'蒸気機関のように溜めて伸びる、玄人向け重量級セット。',stats:{speed:85,accel:68,handling:75,boost:82,technique:92}},
  {kart:'ティーパーティー・クルーザー',rank:'S',description:'優雅な見た目に反して鋭く曲がる、高加速コーナーセット。',stats:{speed:76,accel:91,handling:91,boost:74,technique:82}},
  {kart:'クリスタル・スレイ',rank:'S',description:'氷上のように滑らかなラインを描く、精密ハンドリングセット。',stats:{speed:85,accel:78,handling:95,boost:79,technique:87}},
  {kart:'ネオン・ビートボックス',rank:'S',description:'リズムに乗ってターボを連発する、超高出力ネオンセット。',stats:{speed:92,accel:83,handling:80,boost:96,technique:78}},
  {kart:'クロノ・ペンデュラム',rank:'S',description:'精密なタイミング制御でミスを取り戻す、時計仕掛けの技巧派セット。',stats:{speed:82,accel:84,handling:96,boost:78,technique:94}},
  {kart:'ブルーム・レディバード',rank:'A',description:'周回するほど花開くラインを育てる、コース育成型ガーデンセット。',stats:{speed:74,accel:78,handling:86,boost:72,technique:90}},
  {kart:'レスキュー・ニャイン',rank:'A',description:'危険地帯を突破して素早く復帰する、救助特化のタフネスセット。',stats:{speed:70,accel:88,handling:78,boost:84,technique:82}},
  {kart:'スカラベ・ディガー',rank:'S',description:'重いドリルで荒れた路面を切り開く、発掘家のショートカットセット。',stats:{speed:78,accel:86,handling:67,boost:83,technique:90}},
  {kart:'クラウド・バロメーター',rank:'S',description:'追い風と雲を読み、空中区間を軽やかに進む気象観測セット。',stats:{speed:88,accel:76,handling:90,boost:85,technique:82}},
  {kart:'スイート・ベイクオーブン',rank:'S',description:'温度を高めて加速を焼き上げる、甘くて熱い連続ブーストセット。',stats:{speed:76,accel:96,handling:78,boost:92,technique:86}},
  {kart:'クルー・トレーサー',rank:'S',description:'虫眼鏡のように最短ラインを見抜く、解析型の探偵セット。',stats:{speed:78,accel:82,handling:94,boost:76,technique:97}},
  {kart:'スカラベ・ディガーEX',rank:'S',description:'重装甲と発掘ドリルで悪路を押し切る、ベンガルのパワーセット。',stats:{speed:84,accel:78,handling:69,boost:87,technique:86}},
  {kart:'クラウド・バロメーターR',rank:'S',description:'雲の流れを読んで空中区間を伸ばす、天候予測レーシングセット。',stats:{speed:86,accel:82,handling:88,boost:83,technique:90}},
  {kart:'オーロラ・クリスタリア',rank:'S',description:'氷晶のラインで滑らかに曲がる、上級者向け精密セット。',stats:{speed:83,accel:76,handling:98,boost:82,technique:95}},
  {kart:'ハニー・コムブースター',rank:'A',description:'甘い加速と安定した復帰が魅力の、蜂蜜仕立ての万能セット。',stats:{speed:76,accel:94,handling:82,boost:88,technique:79}},
  {kart:'ファントム・ブックライナー',rank:'S',description:'幻影のようにラインをずらす、カーニバルナイトの技巧派セット。',stats:{speed:88,accel:78,handling:86,boost:92,technique:91}}
];

const racers = racerData.map((r,i)=>{const hero=`assets/select-heroes/${r[2]}.png`;return{
  name:r[0],portrait:i<12?`assets/portraits/${r[2]}.webp`:hero,slug:r[2],color:r[3],
  hero,set:racerSetData[i],progress:0,lane:((i%5)-2)*.31,pace:.034+(i%6)*.0007
}});

const spriteImages=[];
const menuEnvironment = loadImage('assets/environment/sweets-circuit-v1.png');
let environment=menuEnvironment,environmentCrop=null,courseImages=[],activeCourse=null;
const courseMapImage = loadImage('assets/ui/course-map-v2.png',()=>drawMinimap());
const spectatorSlugs=['pink-human','blond-cookie','cyan-cat','purple-witch','teal-glasses'];
const spectatorFrameSets=[];
const spectatorImages=spectatorSlugs.map((slug,index)=>loadImage(`assets/trackside/spectator-${slug}.png`,im=>spectatorFrameSets[index]=sliceSheet(im,7,2,`spectator-${slug}`)));
const candySignImage = loadImage('assets/trackside/candy-sign.png');
const cupcakeTowerImage = loadImage('assets/trackside/cupcake-tower.png');
let candySceneryFrames=[],forestSceneryFrames=[];
const candySceneryAtlas=loadImage('assets/trackside/scenery-candy-houses.png',image=>candySceneryFrames=sliceSheet(image,3,2,'scenery-candy-houses'));
const forestSceneryAtlas=loadImage('assets/trackside/scenery-forest.png',image=>forestSceneryFrames=sliceSheet(image,3,2,'scenery-forest'));
const courseScenerySlugs=['sweets','steam','neon','rain','royal','aurora','jungle','sakura','coral','phantom','lunatic'];
const courseSceneryFrames=courseScenerySlugs.map(()=>[]);
const courseSceneryAtlases=courseScenerySlugs.map((slug,index)=>loadImage(`assets/trackside/course-scenery-${slug}-gpt2.png`,image=>courseSceneryFrames[index]=sliceSheet(image,4,3,`course-scenery-${slug}-gpt2`)));
const JUMP_RAMP_COLS=7,JUMP_RAMP_ROWS=5;
let jumpRampFrames=[];
const jumpRampAtlas=loadImage('assets/trackside/jump-ramps-angled-gpt2-v2.png',image=>jumpRampFrames=sliceSheet(image,JUMP_RAMP_COLS,JUMP_RAMP_ROWS,'jump-ramps-angled-gpt2-v2'));
const coursePropSlugs=['steam','neon','rain','royal'];
const coursePropImages=Object.fromEntries(coursePropSlugs.map(slug=>[slug,Array.from({length:6},(_,index)=>loadImage(`assets/trackside/${slug}-prop-${index}.png`))]));
const coursePropHeights={
  steam:[700,820,700,470,640,540],
  neon:[660,720,690,610,390,600],
  rain:[620,700,560,520,540,620],
  royal:[720,650,630,620,600,610]
};
const itemSheet = loadImage('assets/ui/items.png', im=>{itemFrames=sliceSheet(im,4,2,'items');drawHeldItem()});
const vfxSheet = loadImage('assets/ui/vfx.png', im=>vfxFrames=sliceSheet(im,4,2,'vfx'));
const drivingFxSheet=loadImage('assets/ui/driving-vfx-gpt2.png',im=>drivingFxFrames=sliceSheet(im,3,2,'driving-vfx-gpt2'));
const particleBurstSheet=loadImage('assets/ui/particle-bursts-gpt2.png',im=>particleBurstFrames=sliceSheet(im,4,2,'particle-bursts-gpt2'));
let itemFrames=[], vfxFrames=[],drivingFxFrames=[],particleBurstFrames=[];
const raceMusicFiles=['assets/audio/n(ya)itro_cat_grand_prix.mp3','assets/audio/drigt_swing_nya.mp3'];
const raceMusic=raceMusicFiles.map(src=>{const audio=new Audio(src);audio.preload='auto';audio.loop=true;return audio});
let raceBgm=null,raceMusicIndex=0,musicError='';

const DEFAULT_SETTINGS={masterVolume:80,musicVolume:55,muted:false,richScenery:true,bindings:{accelerate:'ArrowUp',brake:'ArrowDown',left:'ArrowLeft',right:'ArrowRight',drift:'ShiftLeft',item:'Space',pause:'Escape'}};
const ACTION_LABELS={accelerate:'アクセル',brake:'ブレーキ',left:'左へ曲がる',right:'右へ曲がる',drift:'ドリフト',item:'アイテム',pause:'ポーズ'};
const KEY_LABELS={ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→',ShiftLeft:'左 SHIFT',ShiftRight:'右 SHIFT',Space:'SPACE',Escape:'ESC',Enter:'ENTER',Backspace:'BACKSPACE'};
function loadSettings(){try{const saved=JSON.parse(localStorage.getItem('nyan-cart-settings')||'{}');return{...DEFAULT_SETTINGS,...saved,bindings:{...DEFAULT_SETTINGS.bindings,...(saved.bindings||{})}}}catch{return{...DEFAULT_SETTINGS,bindings:{...DEFAULT_SETTINGS.bindings}}}}
let settings=loadSettings(),captureAction=null,settingsReturnMode='menu',settingsReturnPaused=false;
function saveSettings(){try{localStorage.setItem('nyan-cart-settings',JSON.stringify(settings))}catch{}}
function keyLabel(code){if(KEY_LABELS[code])return KEY_LABELS[code];if(code.startsWith('Key'))return code.slice(3);if(code.startsWith('Digit'))return code.slice(5);return code.replace(/(Left|Right)$/,' $1').toUpperCase()}
function applyAudioSettings(){const volume=settings.muted?0:(settings.masterVolume/100)*(settings.musicVolume/100);raceMusic.forEach(audio=>audio.volume=volume);$('masterVolume').value=settings.masterVolume;$('musicVolume').value=settings.musicVolume;$('masterVolumeValue').textContent=settings.masterVolume;$('musicVolumeValue').textContent=settings.musicVolume;const mute=$('muteToggle');mute.classList.toggle('muted',settings.muted);mute.setAttribute('aria-pressed',String(settings.muted));mute.textContent=settings.muted?'♪ サウンド OFF':'♫ サウンド ON';syncMusicButton()}
function applyVisualSettings(){const button=$('richSceneryToggle');if(!button)return;button.setAttribute('aria-pressed',String(!!settings.richScenery));button.textContent=`豪華なコース外 ${settings.richScenery?'ON':'OFF'}`}
function updateControlHints(){$('itemKeyHint').textContent=keyLabel(settings.bindings.item);$('driftKeyHint').textContent=settings.bindings.drift.startsWith('Shift')?'SHIFT':keyLabel(settings.bindings.drift)}
function renderKeyConfig(){const list=$('keyConfigList');list.innerHTML=Object.entries(ACTION_LABELS).map(([action,label])=>`<div class="key-bind"><span>${label}</span><button type="button" data-bind-action="${action}">${keyLabel(settings.bindings[action])}</button></div>`).join('');list.querySelectorAll('[data-bind-action]').forEach(button=>button.onclick=()=>beginKeyCapture(button.dataset.bindAction))}
function beginKeyCapture(action){captureAction=action;renderKeyConfig();const button=document.querySelector(`[data-bind-action="${action}"]`);button?.classList.add('capturing');if(button)button.textContent='キーを押す';$('keyCaptureHelp').textContent='割り当てるキーを押してください（BACKSPACEでキャンセル）'}
function finishKeyCapture(action,code){const previous=settings.bindings[action],conflict=Object.keys(settings.bindings).find(other=>other!==action&&settings.bindings[other]===code);if(conflict)settings.bindings[conflict]=previous;settings.bindings[action]=code;captureAction=null;saveSettings();renderKeyConfig();updateControlHints();$('keyCaptureHelp').textContent='変更したい操作を選び、割り当てるキーを押してください。'}
function setupSettings(){renderKeyConfig();applyAudioSettings();applyVisualSettings();updateControlHints();$('masterVolume').oninput=e=>{settings.masterVolume=Number(e.target.value);applyAudioSettings();saveSettings()};$('musicVolume').oninput=e=>{settings.musicVolume=Number(e.target.value);applyAudioSettings();saveSettings()};$('muteToggle').onclick=()=>{settings.muted=!settings.muted;applyAudioSettings();saveSettings()};$('richSceneryToggle').onclick=()=>{settings.richScenery=!settings.richScenery;applyVisualSettings();saveSettings()};$('resetKeys').onclick=()=>{settings.bindings={...DEFAULT_SETTINGS.bindings};captureAction=null;renderKeyConfig();updateControlHints();saveSettings()}}

const state = {
  mode:'menu', selected:0, selectedCourse:0, running:false, paused:false, elapsed:0, lap:1, progress:0,
  distance:0, speed:0, x:0, steer:0, boosting:false, turbo:0, drift:0, driftLevel:0,
  item:null, shield:0, invincible:0, coins:0, raceWalletEarned:0, shake:0, rank:6, last:0,
  objects:[], particles:[], collectFx:[], projectiles:[], trackCurve:0, centrifugal:0, suspension:0, suspensionVelocity:0, jumpY:0, jumpVelocity:0, airborne:false, cameraHeading:0, flash:0, collisionCooldown:0,
  countdownActive:false, startCharge:0, startPenalty:false, finish:false, lastRank:6, debug:{showCourseLimits:false}
};
const keyboardActions={},touchActions={},gamepadInput={accelerate:false,brake:false,left:false,right:false,drift:false,steer:0};
let gamepadPrevious={item:false,pause:false,accelerate:false},activeGamepadIndex=null;
function actionForCode(code){return Object.keys(settings.bindings).find(action=>settings.bindings[action]===code)}
function actionDown(action){return!!(keyboardActions[action]||touchActions[action]||gamepadInput[action])}
function handleStartCharge(){if(!state.countdownActive)return;const count=$('countdown').textContent;if(count==='3')state.startPenalty=true;if(count==='2')state.startCharge=Math.max(state.startCharge,1);if(count==='1')state.startCharge=2}
function togglePause(){if(state.mode!=='race')return;state.paused=!state.paused;state.paused?pauseRaceMusic():resumeRaceMusic();toast(state.paused?'PAUSE':'RACE ON!')}
function pollGamepad(){const pads=navigator.getGamepads?.()||[],pad=[...pads].find(Boolean),status=$('controllerStatus');if(!pad){activeGamepadIndex=null;Object.assign(gamepadInput,{accelerate:false,brake:false,left:false,right:false,drift:false,steer:0});if(status){status.textContent='接続待ち';status.classList.remove('connected')}return}activeGamepadIndex=pad.index;if(status){status.textContent=pad.id.replace(/\s*\([^)]*\)\s*/g,' ').trim().slice(0,30)||'接続済み';status.classList.add('connected')}const axis=Math.abs(pad.axes[0]||0)>.16?(pad.axes[0]||0):0,left=axis<0||!!pad.buttons[14]?.pressed,right=axis>0||!!pad.buttons[15]?.pressed,accelerate=(pad.buttons[7]?.value||0)>.16||!!pad.buttons[0]?.pressed||!!pad.buttons[12]?.pressed,brake=(pad.buttons[6]?.value||0)>.16||!!pad.buttons[1]?.pressed||!!pad.buttons[13]?.pressed,drift=!!pad.buttons[4]?.pressed||!!pad.buttons[5]?.pressed,item=!!pad.buttons[2]?.pressed,pause=!!pad.buttons[9]?.pressed;Object.assign(gamepadInput,{accelerate,brake,left,right,drift,steer:axis});if(accelerate&&!gamepadPrevious.accelerate)handleStartCharge();if(item&&!gamepadPrevious.item)useItem();if(pause&&!gamepadPrevious.pause)togglePause();gamepadPrevious={item,pause,accelerate}}
const TRACK_LENGTH=1800;
const TOTAL_LAPS=3;
const DEV_COURSES_ENABLED=new URLSearchParams(location.search).has('debugCourses')||localStorage.getItem('nyan-cart-debug-courses')==='1';
function raceLength(){return activeCourse?.finishDistance||TRACK_LENGTH}
function raceLaps(){return activeCourse?.totalLaps||TOTAL_LAPS}
const DRAW_DISTANCE=840;
const ROAD_SEGMENTS=96;
const ROAD_SEGMENT_LENGTH=DRAW_DISTANCE/ROAD_SEGMENTS;
const ROAD_FOV=70*Math.PI/180;
const ROAD_CAMERA_DEPTH=1/Math.tan(ROAD_FOV/2);
const ROAD_CAMERA_HEIGHT=.78;
const ROAD_WORLD_HALF_WIDTH=1.0;
const ROAD_NEAR_Z=.72;
const ELEVATION_INTENSITY=1.24;
let roadProjection=[];

function loadImage(src,onload){const im=new Image();im.onload=()=>onload?.(im);im.src=src;return im}
function syncMusicButton(){const button=$('musicToggle');if(!button)return;const paused=!raceBgm||raceBgm.paused,silent=paused||settings.muted;button.classList.toggle('muted',silent);button.textContent=silent?'♪':'♫';button.setAttribute('aria-label',paused?'BGMを再生':'BGMを停止')}
function playRaceMusic(){if(raceBgm)raceBgm.pause();raceBgm=raceMusic[raceMusicIndex++%raceMusic.length];raceBgm.currentTime=0;musicError='';const playing=raceBgm.play();syncMusicButton();playing?.then(syncMusicButton).catch(error=>{musicError=error?.name||'play-failed';syncMusicButton()})}
function pauseRaceMusic(){if(raceBgm)raceBgm.pause();syncMusicButton()}
function resumeRaceMusic(){if(raceBgm&&state.mode==='race'){const playing=raceBgm.play();playing?.then(syncMusicButton).catch(error=>{musicError=error?.name||'play-failed';syncMusicButton()})}}
function ensureRacerSprite(index){
  const racer=racers[index];if(racer.frames)return Promise.resolve(racer.frames);if(racer.spritePromise)return racer.spritePromise;
  racer.spritePromise=new Promise((resolve,reject)=>{const im=new Image();spriteImages[index]=im;im.onload=()=>{racer.frames=remapRacerFrames(racer.slug,sliceSheet(im,7,2,racer.slug));resolve(racer.frames)};im.onerror=reject;im.src=`assets/sprites/${racer.slug}.png`});
  return racer.spritePromise;
}
function ensureAllSprites(){return Promise.all(racers.map((_,i)=>ensureRacerSprite(i)))}

const RACER_FRAME_REMAPS={
  // Kurone's 15-degree cells were visually reversed compared with the shared
  // cat kart layout. Remap at load time so the source sheet can stay intact.
  'kurone-night':[0,1,4,3,2,5,6,7,8,11,10,9,12,13]
};
function remapRacerFrames(slug,frames){const map=RACER_FRAME_REMAPS[slug];return map?map.map(index=>frames[index]||frames[0]):frames}

function sliceSheet(image,cols,rows,key){
  const bounds=window.SPRITE_BOUNDS?.[key];if(bounds)return bounds.map(b=>({image,sx:b[0],sy:b[1],sw:b[2],sh:b[3]}));
  const frames=[],sw=image.naturalWidth/cols,sh=image.naturalHeight/rows;
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++)frames.push({image,sx:col*sw,sy:row*sh,sw,sh});
  return frames;
}

function resize(){const d=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*d;canvas.height=innerHeight*d;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(d,0,0,d,0,0)}
addEventListener('resize',resize);resize();

const SET_STAT_LABELS=[['speed','SPEED'],['accel','ACCEL'],['handling','HANDLING'],['boost','BOOST'],['technique','TECHNIQUE']];
const PROGRESS_KEY='nyan-cart-progress-v1',INITIAL_FREE_RACER_COUNT=18;
function loadProgress(){try{const saved=JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}');return{coins:Math.max(0,Math.floor(Number(saved.coins)||0)),unlocked:Array.isArray(saved.unlocked)?saved.unlocked.filter(value=>typeof value==='string'):[]}}catch{return{coins:0,unlocked:[]}}}
const playerProgress=loadProgress();
function saveProgress(){try{localStorage.setItem(PROGRESS_KEY,JSON.stringify(playerProgress))}catch{}}
function racerUnlockCost(index){return index<INITIAL_FREE_RACER_COUNT?0:100+(index-INITIAL_FREE_RACER_COUNT)*50}
function isRacerUnlocked(index){return racerUnlockCost(index)===0||playerProgress.unlocked.includes(racers[index]?.slug)}
function updateWalletUI(){if($('walletCoins'))$('walletCoins').textContent=String(playerProgress.coins)}
function addWalletCoins(amount){const earned=Math.max(0,Math.floor(amount));if(!earned)return;playerProgress.coins+=earned;saveProgress();updateWalletUI()}
let setNoticeTimer=0;
function showSetNotice(message){const notice=$('setNotice');if(!notice)return;notice.textContent=message;clearTimeout(setNoticeTimer);setNoticeTimer=setTimeout(()=>notice.textContent='',2400)}
const setCarousel={dragging:false,moved:false,dragDistance:0,pointerId:null,lastX:0,lastTime:0,velocity:0,inertia:0,settle:0,targetIndex:null,targetTimer:0,virtualIndex:racers.length+state.selected};
function setupSetGrid(){const rail=$('setGrid'),count=racers.length;rail.innerHTML='';setCarousel.virtualIndex=count+state.selected;for(let cycle=0;cycle<3;cycle++)racers.forEach((r,i)=>{const virtualIndex=cycle*count+i,button=document.createElement('button'),stars=r.set.rank==='S'?5:4,locked=!isRacerUnlocked(i),cost=racerUnlockCost(i),active=virtualIndex===setCarousel.virtualIndex;button.className='set-card'+(active?' selected':'')+(locked?' locked':'');button.style.setProperty('--set-color',r.color);button.dataset.setIndex=String(i);button.dataset.virtualIndex=String(virtualIndex);button.setAttribute('role','option');button.setAttribute('aria-selected',String(active));button.setAttribute('aria-setsize',String(count));button.setAttribute('aria-posinset',String(i+1));button.innerHTML=`<img src="${r.hero}" alt="${r.name}と${r.set.kart}" draggable="false"><span class="set-card-copy"><strong>${r.name}</strong><small>${r.set.kart}</small><em>★${stars}</em></span><span class="set-card-badge">${locked?'LOCKED':active?'EQUIPPED':'SELECT'}</span><span class="set-card-lock">🔒 ${cost} COINS</span>`;button.onclick=()=>{if(!setCarousel.moved)selectRacerSet(i,true,virtualIndex)};rail.appendChild(button)});rail.addEventListener('scroll',()=>{updateSetCarousel();if(setCarousel.targetIndex!==null)return;clearTimeout(setCarousel.settle);if(!setCarousel.dragging)setCarousel.settle=setTimeout(snapSetCarousel,120)},{passive:true});rail.addEventListener('pointerdown',startSetDrag);rail.addEventListener('pointermove',moveSetDrag);rail.addEventListener('pointerup',endSetDrag);rail.addEventListener('pointercancel',endSetDrag);rail.addEventListener('wheel',wheelSetCarousel,{passive:false});rail.addEventListener('keydown',keySetCarousel);if($('positionTotal'))$('positionTotal').textContent=`/${count}`;updateWalletUI()}
function cancelSetTarget(){clearTimeout(setCarousel.targetTimer);setCarousel.targetIndex=null}
function normalizeSetLoop(){const count=racers.length;let virtualIndex=setCarousel.virtualIndex;if(virtualIndex<count)virtualIndex+=count;else if(virtualIndex>=count*2)virtualIndex-=count;if(virtualIndex===setCarousel.virtualIndex)return;setCarousel.virtualIndex=virtualIndex;const rail=$('setGrid'),card=rail.querySelector(`[data-virtual-index="${virtualIndex}"]`);if(card)rail.scrollLeft=Math.max(0,card.offsetLeft-(rail.clientWidth-card.clientWidth)/2);updateSetUI();updateSetCarousel()}
function centerSelectedSetCard(smooth=false,virtualIndex=setCarousel.virtualIndex){const rail=$('setGrid'),card=rail.querySelector(`[data-virtual-index="${virtualIndex}"]`);if(!card)return;setCarousel.virtualIndex=virtualIndex;const left=Math.max(0,card.offsetLeft-(rail.clientWidth-card.clientWidth)/2);cancelAnimationFrame(setCarousel.inertia);setCarousel.velocity=0;cancelSetTarget();if(smooth){setCarousel.targetIndex=virtualIndex;rail.scrollTo({left,behavior:'smooth'});setCarousel.targetTimer=setTimeout(()=>{setCarousel.targetIndex=null;setCarousel.velocity=0;normalizeSetLoop();updateSetCarousel()},1000)}else{rail.scrollTo({left,behavior:'auto'});normalizeSetLoop()}}
function updateSetCarousel(){const rail=$('setGrid'),center=rail.scrollLeft+rail.clientWidth/2,unit=Math.max(1,rail.querySelector('.set-card')?.offsetWidth||1),speed=Math.max(-18,Math.min(18,setCarousel.velocity*.75));rail.querySelectorAll('.set-card').forEach(card=>{const cardCenter=card.offsetLeft+card.offsetWidth/2,distance=(cardCenter-center)/unit,depth=Math.min(2.4,Math.abs(distance)),rotate=Math.max(-58,Math.min(58,-distance*31+speed*Math.max(0,1-depth*.42))),scale=Math.max(.76,1-depth*.11);card.style.transform=`perspective(900px) translateZ(${-depth*72}px) rotateY(${rotate}deg) scale(${scale})`;card.style.opacity=String(Math.max(.54,1-depth*.17));card.style.zIndex=String(30-Math.round(depth*10))})}
function nearestSetIndex(){const rail=$('setGrid'),center=rail.scrollLeft+rail.clientWidth/2;let result={index:state.selected,virtualIndex:setCarousel.virtualIndex},best=Infinity;rail.querySelectorAll('.set-card').forEach(card=>{const distance=Math.abs(card.offsetLeft+card.offsetWidth/2-center);if(distance<best){best=distance;result={index:Number(card.dataset.setIndex),virtualIndex:Number(card.dataset.virtualIndex)}}});return result}
function snapSetCarousel(){if(setCarousel.dragging||setCarousel.targetIndex!==null||Math.abs(setCarousel.velocity)>.32)return;const nearest=nearestSetIndex();selectRacerSet(nearest.index,false,nearest.virtualIndex);centerSelectedSetCard(true,nearest.virtualIndex)}
function startSetDrag(event){if(event.button!==undefined&&event.button!==0)return;const rail=$('setGrid');cancelAnimationFrame(setCarousel.inertia);clearTimeout(setCarousel.settle);cancelSetTarget();setCarousel.dragging=true;setCarousel.moved=false;setCarousel.dragDistance=0;setCarousel.pointerId=event.pointerId;setCarousel.lastX=event.clientX;setCarousel.lastTime=event.timeStamp;setCarousel.velocity=0;rail.classList.add('dragging');rail.setPointerCapture?.(event.pointerId)}
function moveSetDrag(event){if(!setCarousel.dragging||event.pointerId!==setCarousel.pointerId)return;const rail=$('setGrid'),dx=event.clientX-setCarousel.lastX,dt=Math.max(8,event.timeStamp-setCarousel.lastTime);setCarousel.dragDistance+=Math.abs(dx);if(setCarousel.dragDistance>8)setCarousel.moved=true;rail.scrollLeft-=dx;setCarousel.velocity=setCarousel.velocity*.56+(dx*16.67/dt)*.44;setCarousel.lastX=event.clientX;setCarousel.lastTime=event.timeStamp;updateSetCarousel();event.preventDefault()}
function endSetDrag(event){if(!setCarousel.dragging||event.pointerId!==setCarousel.pointerId)return;const rail=$('setGrid'),wasMoved=setCarousel.moved;setCarousel.dragging=false;rail.classList.remove('dragging');rail.releasePointerCapture?.(event.pointerId);if(!wasMoved){setCarousel.velocity=0;setTimeout(()=>{setCarousel.moved=false},0);return}const glide=()=>{setCarousel.velocity*=.92;rail.scrollLeft-=setCarousel.velocity;updateSetCarousel();if(Math.abs(setCarousel.velocity)>.32)setCarousel.inertia=requestAnimationFrame(glide);else{setCarousel.velocity=0;snapSetCarousel()}};setCarousel.inertia=requestAnimationFrame(glide);setTimeout(()=>{setCarousel.moved=false},0)}
function wheelSetCarousel(event){const rail=$('setGrid'),delta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;if(!delta)return;event.preventDefault();cancelAnimationFrame(setCarousel.inertia);cancelSetTarget();rail.scrollLeft+=delta;setCarousel.velocity=-delta*.18;updateSetCarousel();clearTimeout(setCarousel.settle);setCarousel.settle=setTimeout(()=>{setCarousel.velocity=0;snapSetCarousel()},120)}
function keySetCarousel(event){if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const count=racers.length,virtualIndex=event.key==='Home'?count:event.key==='End'?count*2-1:setCarousel.virtualIndex+(event.key==='ArrowRight'?1:-1),index=((virtualIndex%count)+count)%count;selectRacerSet(index,true,virtualIndex)}
function animateStatNumbers(container){
  const started=performance.now(),duration=720;
  container.querySelectorAll('.set-stat-row em').forEach((em,i)=>{em.textContent='0';em.dataset.delay=String(i*55)});
  const tick=now=>{let running=false;container.querySelectorAll('.set-stat-row em').forEach(em=>{const delay=Number(em.dataset.delay)||0,target=Number(em.dataset.target)||0,t=Math.max(0,Math.min(1,(now-started-delay)/duration)),ease=1-Math.pow(1-t,3);em.textContent=String(Math.round(target*ease));if(t<1)running=true});if(running)requestAnimationFrame(tick)};
  requestAnimationFrame(tick);
}
function updateSetUI(){const racer=racers[state.selected],meta=racer.set,title=`${racer.name} & ${meta.kart}`,locked=!isRacerUnlocked(state.selected),cost=racerUnlockCost(state.selected),stats=$('setStats');$('setName').textContent=title;$('setStageLabel').textContent=meta.kart.toUpperCase();$('setSubtitle').textContent=`${meta.rank} RANK EXCLUSIVE SET`;$('setRank').textContent=meta.rank;$('setDescription').textContent=meta.description;$('setPosition').textContent=`${String(state.selected+1).padStart(2,'0')} / ${String(racers.length).padStart(2,'0')}`;$('setHeroImage').src=racer.hero;$('setHeroImage').alt=`${racer.name}と専用カート ${meta.kart}`;$('setHeroImage').classList.remove('changed');requestAnimationFrame(()=>$('setHeroImage').classList.add('changed'));stats.classList.remove('stat-animate');stats.innerHTML=SET_STAT_LABELS.map(([key,label],i)=>`<div class="set-stat-row"><span>${label}</span><i><b style="--stat:${meta.stats[key]}%;--delay:${i*55}ms"></b></i><em>${meta.stats[key]}</em></div>`).join('');requestAnimationFrame(()=>stats.classList.add('stat-animate'));document.querySelectorAll('.set-card').forEach(card=>{const index=Number(card.dataset.setIndex),active=Number(card.dataset.virtualIndex)===setCarousel.virtualIndex,cardLocked=!isRacerUnlocked(index);card.classList.toggle('selected',active);card.classList.toggle('locked',cardLocked);card.setAttribute('aria-selected',String(active));card.querySelector('.set-card-badge').textContent=cardLocked?'LOCKED':active?'EQUIPPED':'SELECT'});const confirm=$('confirmSet');confirm.classList.toggle('unlock',locked);confirm.querySelector('span').textContent=locked?'UNLOCK':'COURSE SELECT';confirm.querySelector('small').textContent=locked?`${cost} COINS で開放`:'このセットで決定';updateWalletUI()}
function updateSetUI(){
  const racer=racers[state.selected],meta=racer.set,title=`${racer.name} & ${meta.kart}`,locked=!isRacerUnlocked(state.selected),cost=racerUnlockCost(state.selected),stats=$('setStats');
  $('setName').textContent=title;$('setStageLabel').textContent=meta.kart.toUpperCase();$('setSubtitle').textContent=`${meta.rank} RANK EXCLUSIVE SET`;playSetRankAnimation(meta);$('setDescription').textContent=meta.description;$('setPosition').textContent=`${String(state.selected+1).padStart(2,'0')} / ${String(racers.length).padStart(2,'0')}`;
  $('setHeroImage').src=racer.hero;$('setHeroImage').alt=`${racer.name}と専用カート ${meta.kart}`;$('setHeroImage').classList.remove('changed');requestAnimationFrame(()=>$('setHeroImage').classList.add('changed'));
  stats.classList.remove('stat-animate');stats.innerHTML=SET_STAT_LABELS.map(([key,label],i)=>`<div class="set-stat-row"><span>${label}</span><i><b style="--stat:${meta.stats[key]}%;--delay:${i*55}ms"></b></i><em data-target="${meta.stats[key]}">0</em></div>`).join('');
  requestAnimationFrame(()=>{stats.classList.add('stat-animate');animateStatNumbers(stats)});
  document.querySelectorAll('.set-card').forEach(card=>{const index=Number(card.dataset.setIndex),active=Number(card.dataset.virtualIndex)===setCarousel.virtualIndex,cardLocked=!isRacerUnlocked(index);card.classList.toggle('selected',active);card.classList.toggle('locked',cardLocked);card.setAttribute('aria-selected',String(active));card.querySelector('.set-card-badge').textContent=cardLocked?'LOCKED':active?'EQUIPPED':'SELECT'});
  const confirm=$('confirmSet');confirm.classList.toggle('unlock',locked);confirm.querySelector('span').textContent=locked?'UNLOCK':'COURSE SELECT';confirm.querySelector('small').textContent=locked?`${cost} COINS で開放`:'このセットで決定';updateWalletUI();
}
function selectRacerSet(i,center=true,virtualIndex=null){const count=racers.length;state.selected=((i%count)+count)%count;if(virtualIndex===null){const candidates=[state.selected,state.selected+count,state.selected+count*2];virtualIndex=candidates.reduce((best,value)=>Math.abs(value-setCarousel.virtualIndex)<Math.abs(best-setCarousel.virtualIndex)?value:best,candidates[1])}setCarousel.virtualIndex=virtualIndex;updateSetUI();ensureRacerSprite(state.selected);if(center)centerSelectedSetCard(true,virtualIndex);updateSetCarousel()}
function openKartSelect(){state.mode='kart';showScreen('kartSelect');updateSetUI();requestAnimationFrame(()=>{centerSelectedSetCard(false,setCarousel.virtualIndex);updateSetCarousel()})}
function confirmRacerSet(){if(isRacerUnlocked(state.selected)){openCourseSelect();return}const cost=racerUnlockCost(state.selected);if(playerProgress.coins<cost){showSetNotice(`開放まであと ${cost-playerProgress.coins} COINS`);return}playerProgress.coins-=cost;playerProgress.unlocked.push(racers[state.selected].slug);saveProgress();updateSetUI();showSetNotice('レーサーセットを開放しました！')}
function setupCourseGrid(){const grid=$('courseGrid');grid.innerHTML='';courseData.forEach((course,i)=>{if(course.debugOnly&&!DEV_COURSES_ENABLED)return;const button=document.createElement('button');button.className='course-card'+(i===state.selectedCourse?' selected':'')+(course.debugOnly?' debug-course':'');button.dataset.courseIndex=String(i);button.innerHTML=`<img src="${course.art}" alt="${course.name}"><span class="course-number">${course.debugOnly?'DBG':i+1}</span><span class="course-copy"><strong>${course.name}</strong><small>${course.style}</small></span>`;button.onclick=()=>selectCourse(i);grid.appendChild(button)})}
function selectCourse(i){state.selectedCourse=i;document.querySelectorAll('.course-card').forEach(card=>card.classList.toggle('selected',Number(card.dataset.courseIndex)===i));$('selectedCourseName').textContent=courseData[i].name;$('selectedCourseInfo').textContent=`${courseData[i].style}  ・  難易度 ${courseData[i].difficulty}`;activateCourse(i)}
function activateCourse(i){const course=courseData[i];activeCourse=course;trackNodes=course.nodes;trackArc=buildTrackArc();trackHeights=course.heights;tunnelSections=course.tunnels;environment=courseImages[i]||menuEnvironment;environmentCrop=course.crop;drawMinimap()}
function openCourseSelect(){state.mode='course';showScreen('courseSelect');selectCourse(state.selectedCourse)}
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));if(id)$(id).classList.add('active')}
function openSettings(){settingsReturnMode=state.mode;settingsReturnPaused=state.paused;if(state.mode==='race'){state.paused=true;pauseRaceMusic()}state.mode='settings';captureAction=null;renderKeyConfig();applyAudioSettings();applyVisualSettings();showScreen('settings')}
function closeSettings(){captureAction=null;saveSettings();const returnMode=settingsReturnMode;state.mode=returnMode;if(returnMode==='race'){showScreen(null);state.paused=settingsReturnPaused;if(!state.paused)resumeRaceMusic()}else showScreen(returnMode==='kart'?'kartSelect':returnMode==='course'?'courseSelect':returnMode==='finish'?'finish':'menu')}
function updateDebugUI(){const enabled=state.debug.showCourseLimits,button=$('debugCourseBounds');button.setAttribute('aria-pressed',String(enabled));button.textContent=`コース枠 ${enabled?'ON':'OFF'}`;$('debugToggle').classList.toggle('active',enabled)}
function setDebugPanel(open){$('debugPanel').classList.toggle('hidden',!open);$('debugToggle').setAttribute('aria-expanded',String(open))}
$('openSelect').onclick=()=>{environment=menuEnvironment;environmentCrop=null;openKartSelect()};
$('openSettings').onclick=openSettings;$('raceSettings').onclick=openSettings;$('closeSettings').onclick=closeSettings;$('settingsDone').onclick=closeSettings;
$('backKartSelect').onclick=()=>{environment=menuEnvironment;environmentCrop=null;state.mode='menu';showScreen('menu')};$('confirmSet').onclick=confirmRacerSet;$('backCourseSelect').onclick=openKartSelect;$('confirmCourse').onclick=startRace;$('retry').onclick=startRace;
$('toMenu').onclick=()=>{environment=menuEnvironment;environmentCrop=null;state.mode='menu';pauseRaceMusic();setDebugPanel(false);showScreen('menu');$('hud').classList.add('hidden');$('mobileControls').classList.add('hidden')};
$('musicToggle').onclick=()=>{if(!raceBgm)playRaceMusic();else raceBgm.paused?resumeRaceMusic():pauseRaceMusic()};
$('debugToggle').onclick=()=>setDebugPanel($('debugPanel').classList.contains('hidden'));
$('debugClose').onclick=()=>setDebugPanel(false);
$('debugCourseBounds').onclick=()=>{state.debug.showCourseLimits=!state.debug.showCourseLimits;updateDebugUI()};
setupSettings();
setupSetGrid();
updateDebugUI();

function resetRace(){
  Object.assign(state,{running:false,paused:false,finish:false,elapsed:0,lap:1,progress:0,distance:0,speed:0,x:0,steer:0,boosting:false,turbo:0,drift:0,driftLevel:0,item:null,shield:0,invincible:0,coins:0,raceWalletEarned:0,shake:0,rank:6,lastRank:6,trackCurve:0,centrifugal:0,suspension:0,suspensionVelocity:0,jumpY:0,jumpVelocity:0,airborne:false,cameraHeading:trackSample(0).heading,flash:0,collisionCooldown:3,objects:[],particles:[],collectFx:[],projectiles:[],countdownActive:true,startCharge:0,startPenalty:false});
  const lanePattern=[-.58,.08,.58,-.3,.34,-.62,.02,.62,-.35,.31,0],length=raceLength(),laps=raceLaps();let ai=0;
  racers.forEach((r,i)=>{const player=i===state.selected;r.distance=player?0:42-ai*5.5;r.progress=r.distance/length;r.lane=player?0:lanePattern[ai%lanePattern.length];r.aiTargetLane=r.lane;r.laneTimer=.8+(ai%4)*.55;r.hit=0;r.spin=0;r.aiSpeed=150+(ai%6)*2.8;r.aiVelocity=0;r.aiCoins=0;r.aiItem=null;r.aiBoost=0;r.jumpY=0;r.jumpVelocity=0;r.airborne=false;ai+=player?0:1});
  for(let lap=0;lap<laps;lap++){
    const base=lap*length;
    for(let z=130+state.selectedCourse*17;z<length;z+=155){
      const n=Math.floor(z/155)+lap*17;
      if(n%4===1){for(let k=-2;k<=2;k++)state.objects.push({type:'coin',z:base+z+k*20,lane:[-.62,-.31,0,.31,.62][k+2],taken:false})}
      else if(n%5===2){state.objects.push({type:'pad',z:base+z,lane:[-.48,0,.48][n%3],taken:false})}
      else state.objects.push({type:'item',z:base+z,lane:[-.58,-.29,0,.29,.58][n%5],taken:false});
    }
    const rampA=92+state.selectedCourse*19,rampB=790+state.selectedCourse*37;state.objects.push({type:'ramp',z:base+rampA,lane:0,hitBy:new Set()});if(rampB<length)state.objects.push({type:'ramp',z:base+rampB,lane:((state.selectedCourse+1)%3-1)*.28,hitBy:new Set()});
  }
  drawHeldItem();updateHud();buildRank();
}
async function startRace(){
  playRaceMusic();
  const button=$('confirmCourse'),small=button.querySelector('small');button.disabled=true;small.textContent='SPRITES LOADING...';
  try{await ensureAllSprites()}catch(error){button.disabled=false;small.textContent='読み込みを再試行';toast('ASSET LOAD ERROR');return}
  button.disabled=false;small.textContent='グランプリに参加';activateCourse(state.selectedCourse);
  resetRace();$('finish').querySelector('.eyebrow').textContent=activeCourse.short;state.mode='race';showScreen(null);$('hud').classList.remove('hidden');
  if(matchMedia('(pointer:coarse)').matches)$('mobileControls').classList.remove('hidden');
  let n=3;$('countdown').textContent='3';
  const timer=setInterval(()=>{n--;if(n>0)$('countdown').textContent=n;else if(n===0){$('countdown').textContent='GO!';state.countdownActive=false;state.running=true;state.last=performance.now();if(state.startPenalty){state.speed=0;toast('TOO EARLY!')}else if(state.startCharge>=2){state.speed=115;state.turbo=1.25;toast('START DASH!');spawnVfx(0,innerWidth/2,innerHeight*.8,.8)}burst(innerWidth/2,innerHeight*.72,18,'#6feaff')}else{$('countdown').textContent='';clearInterval(timer)}},850);
}

function buildRank(){
  const sorted=[...racers].sort((a,b)=>b.distance-a.distance),player=racers[state.selected],playerIndex=sorted.indexOf(player);let shown=sorted.slice(0,6);
  if(!shown.includes(player)){shown=sorted.slice(0,4);shown.push(sorted[Math.max(4,playerIndex-1)],player);shown=[...new Set(shown)]}
  $('rankPanel').innerHTML=shown.map(r=>{const pos=sorted.indexOf(r)+1,gap=Math.round(r.distance-player.distance),label=player===r?'YOU':`${gap>0?'+':''}${gap}m`;return `<div class="rank-row ${player===r?'player':''}"><span class="pos">${pos}</span><img src="${r.portrait}"><span class="rname">${r.name}</span><b>${label}</b></div>`}).join('');
}
function fmt(ms){const m=Math.floor(ms/60000),s=Math.floor(ms/1000)%60,x=Math.floor(ms%1000);return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(x).padStart(3,'0')}`}
function updateHud(){
  $('lap').textContent=Math.min(3,state.lap);$('timer').textContent='◷ '+fmt(state.elapsed);$('speed').textContent=Math.round(state.speed);$('currentPosition').textContent=state.rank;drawSpeedGauge();
  $('coins').textContent=String(state.coins).padStart(2,'0');const charge=state.drift>0?Math.min(100,state.drift/2.25*100):state.turbo>0?100:0;$('boostBar').firstElementChild.style.width=charge+'%';
  drawMinimap();
}
function announceRank(oldRank,newRank){
  const el=$('rankChange'),improved=newRank<oldRank;el.textContent=`${improved?'▲':'▼'} ${newRank}${newRank===1?'st':newRank===2?'nd':newRank===3?'rd':'th'}`;el.className=`rank-change show ${improved?'up':'down'}`;clearTimeout(announceRank.t);announceRank.t=setTimeout(()=>el.className='rank-change',850)
}

function drawSpeedGauge(){
  const c=$('speedGauge');if(!c)return;const g=c.getContext('2d'),w=c.width,h=c.height,cx=w/2,cy=h/2,r=96,max=240,p=Math.min(1,state.speed/max),start=Math.PI*.75,end=Math.PI*2.25;
  g.clearRect(0,0,w,h);const bg=g.createRadialGradient(cx,cy,20,cx,cy,r);bg.addColorStop(0,'rgba(35,46,95,.92)');bg.addColorStop(1,'rgba(7,8,28,.96)');g.fillStyle=bg;g.beginPath();g.arc(cx,cy,r,0,7);g.fill();g.strokeStyle='rgba(171,212,255,.5)';g.lineWidth=3;g.stroke();
  g.lineCap='round';g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=16;g.beginPath();g.arc(cx,cy,78,start,end);g.stroke();
  const grad=g.createLinearGradient(25,190,210,35);grad.addColorStop(0,'#42dfff');grad.addColorStop(.68,'#6b73ff');grad.addColorStop(1,'#ff4fc8');g.strokeStyle=grad;g.shadowColor=p>.8?'#ff4fc8':'#49e8ff';g.shadowBlur=15;g.beginPath();g.arc(cx,cy,78,start,start+(end-start)*p);g.stroke();g.shadowBlur=0;
  for(let i=0;i<=12;i++){const a=start+(end-start)*i/12,inner=i%3===0?64:69;g.strokeStyle=i/12<=p?'#fff':'#6d7195';g.lineWidth=i%3===0?3:1.5;g.beginPath();g.moveTo(cx+Math.cos(a)*inner,cy+Math.sin(a)*inner);g.lineTo(cx+Math.cos(a)*72,cy+Math.sin(a)*72);g.stroke()}
  const needle=start+(end-start)*p;g.strokeStyle='#fff';g.lineWidth=3;g.shadowColor='#49e8ff';g.shadowBlur=8;g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(needle)*55,cy+Math.sin(needle)*55);g.stroke();g.shadowBlur=0;g.fillStyle='#fff';g.beginPath();g.arc(cx,cy,6,0,7);g.fill();
}

const sweetsNodes=[
  [.32,.38],[.23,.44],[.15,.47],[.105,.37],[.12,.24],[.205,.15],[.33,.13],[.43,.22],[.53,.13],[.68,.14],[.79,.22],[.82,.34],
  [.75,.43],[.61,.46],[.70,.54],[.80,.61],[.82,.73],[.74,.85],[.60,.88],[.49,.79],[.43,.67],[.34,.74],[.21,.80],[.12,.71],
  [.12,.59],[.22,.52],[.34,.51],[.44,.59],[.53,.54],[.54,.44],[.45,.38],[.32,.38]
];
const steamNodes=[
  [.49,.82],[.18,.76],[.34,.82],[.47,.73],[.43,.58],[.28,.52],[.14,.60],[.10,.44],[.18,.29],[.34,.26],[.46,.18],[.61,.20],
  [.76,.16],[.86,.30],[.82,.49],[.70,.56],[.78,.72],[.66,.85],[.49,.82]
];
const neonNodes=[
  [.14,.42],[.10,.26],[.24,.17],[.43,.22],[.58,.12],[.78,.20],[.68,.35],[.82,.45],[.78,.70],[.62,.78],[.53,.62],[.39,.74],[.19,.68],[.28,.51],[.14,.42]
];
const rainNodes=[
  [.14,.74],[.10,.56],[.18,.37],[.11,.22],[.31,.14],[.50,.17],[.68,.11],[.85,.24],[.82,.43],[.72,.55],[.82,.73],[.65,.84],[.45,.78],[.31,.86],[.16,.74],[.14,.74]
];
const royalNodes=[
  [.14,.64],[.18,.42],[.28,.24],[.48,.17],[.70,.20],[.84,.34],[.78,.52],[.86,.70],[.67,.82],[.48,.75],[.31,.85],[.16,.75],[.14,.64]
];
const auroraNodes=[
  [.13,.58],[.18,.38],[.33,.22],[.54,.15],[.74,.22],[.86,.39],[.78,.54],[.62,.49],[.70,.70],[.55,.85],[.35,.80],[.22,.67],[.13,.58]
];
const jungleNodes=[
  [.26,.54],[.14,.44],[.22,.27],[.40,.20],[.58,.30],[.76,.18],[.86,.36],[.73,.52],[.84,.70],[.66,.84],[.48,.74],[.31,.84],
  [.16,.76],[.30,.84],[.48,.76],[.42,.60],[.26,.54]
];
const sakuraNodes=[
  [.14,.67],[.20,.45],[.34,.29],[.50,.18],[.70,.24],[.82,.42],[.70,.55],[.83,.72],[.63,.84],[.49,.70],[.34,.82],[.18,.76],[.14,.67]
];
const coralNodes=[
  [.13,.70],[.20,.50],[.13,.32],[.29,.18],[.48,.22],[.66,.14],[.84,.27],[.77,.46],[.88,.63],[.72,.80],[.52,.74],[.36,.86],[.20,.78],[.13,.70]
];
const phantomNodes=[
  [.13,.50],[.18,.30],[.36,.20],[.55,.28],[.72,.17],[.87,.34],[.76,.48],[.85,.67],[.68,.82],[.51,.66],[.34,.80],[.18,.70],[.13,.50]
];
const lunaticNodes=[
  [.16,.62],[.12,.42],[.27,.24],[.45,.18],[.61,.29],[.79,.17],[.88,.34],[.78,.52],[.86,.72],[.68,.84],[.50,.76],[.33,.86],[.18,.76],[.16,.62]
];
const courseData=[
  {name:'きらめきスイーツサーキット',short:'TWINKLE SWEETS',style:'テクニカル＆トリッキー',difficulty:'★★★☆☆',art:'assets/environment/course-sweets.png',crop:{x:.47,y:.12,w:.52,h:.50},nodes:sweetsNodes,startLine:45,heights:[0,.08,.22,.48,.62,.42,.12,-.12,-.26,-.08,.24,.58,.72,.5,.18,-.1,-.3,-.14,.18,.5,.38,.1,-.2,-.08],tunnels:[[575,735],[1325,1465]],useCandyProps:true,theme:{vergeA:'#c85f91',vergeB:'#e487ad',curbA:'#fff8ef',curbB:'#f05291',roadA:'#4e4f5b',roadB:'#5d5e6a',lane:'rgba(220,240,255,.78)',accent:'#55baf4',railA:'#fff8ef',railB:'#f05291',tunnelSide:'rgba(54,27,78,.96)',tunnelSide2:'rgba(43,22,68,.97)',tunnelRoof:'rgba(28,17,57,.97)',lightA:'#ff76bd',lightB:'#72e9ff'}},
  {name:'ギアクロック・スチームサーキット',short:'GEAR CLOCK',style:'重量級テクニカル',difficulty:'★★★★☆',art:'assets/environment/course-steam.png',crop:{x:.50,y:.13,w:.49,h:.50},nodes:steamNodes,startLine:35,heights:[0,.18,.42,.28,-.12,-.32,-.05,.3,.58,.72,.4,.08,-.18,.12,.46,.68,.3,-.1,-.24,.08],tunnels:[[360,520],[1120,1275]],useCandyProps:false,theme:{vergeA:'#4e321f',vergeB:'#2f231a',curbA:'#d8903d',curbB:'#211a17',roadA:'#34363a',roadB:'#44474c',lane:'rgba(255,198,104,.72)',accent:'#55cfff',railA:'#d68b3e',railB:'#25201c',tunnelSide:'rgba(69,45,29,.98)',tunnelSide2:'rgba(46,34,28,.98)',tunnelRoof:'rgba(29,25,24,.98)',lightA:'#ff9f3f',lightB:'#61dfff'}},
  {name:'ネオンスカイラインサーキット',short:'NEON SKYLINE',style:'スピード＆テクニカル',difficulty:'★★★★☆',art:'assets/environment/course-neon.png',crop:{x:.46,y:.13,w:.53,h:.49},nodes:neonNodes,heights:[0,.22,.5,.78,.54,.16,-.2,-.4,-.08,.34,.66,.82,.4,.05,-.22,.12],tunnels:[[430,610],[980,1190]],useCandyProps:false,theme:{vergeA:'#15103d',vergeB:'#25155b',curbA:'#59e9ff',curbB:'#fa4fd0',roadA:'#171d35',roadB:'#242b4b',lane:'rgba(101,234,255,.82)',accent:'#49ecff',railA:'#52eaff',railB:'#f34cd4',tunnelSide:'rgba(21,13,61,.98)',tunnelSide2:'rgba(35,11,68,.98)',tunnelRoof:'rgba(8,8,35,.99)',lightA:'#ff45dc',lightB:'#54f4ff'}},
  {name:'レインドロップ・アンブレラサーキット',short:'RAIN UMBRELLA',style:'バランス＆ギミック',difficulty:'★★★☆☆',art:'assets/environment/course-rain.png',crop:{x:.50,y:.13,w:.49,h:.49},nodes:rainNodes,heights:[0,.1,.26,.42,.32,.08,-.12,-.26,-.08,.2,.42,.58,.36,.08,-.18,-.28,.02],tunnels:[[645,835]],useCandyProps:false,theme:{vergeA:'#91c8da',vergeB:'#b7dce7',curbA:'#f8fdff',curbB:'#4aaee7',roadA:'#526575',roadB:'#667988',lane:'rgba(230,250,255,.9)',accent:'#58cfff',railA:'#f6fbff',railB:'#5baada',tunnelSide:'rgba(128,188,216,.72)',tunnelSide2:'rgba(103,163,196,.74)',tunnelRoof:'rgba(156,213,235,.62)',lightA:'#ffffff',lightB:'#72dfff'}},
  {name:'ロイヤルスイーツ・キャッスルサーキット',short:'ROYAL CASTLE',style:'バランス＆ギミック',difficulty:'★★★☆☆',art:'assets/environment/course-royal.png',crop:{x:.51,y:.14,w:.48,h:.48},nodes:royalNodes,heights:[0,.16,.38,.56,.48,.2,-.08,-.22,.02,.32,.54,.36,.08,-.16,.04],tunnels:[[510,665],[1210,1360]],useCandyProps:true,theme:{vergeA:'#ed8fa8',vergeB:'#f5b0bf',curbA:'#fff7e5',curbB:'#e94e83',roadA:'#695650',roadB:'#7a6259',lane:'rgba(255,247,224,.84)',accent:'#65cfff',railA:'#fff5e7',railB:'#ed5b8e',tunnelSide:'rgba(91,35,65,.96)',tunnelSide2:'rgba(65,25,54,.97)',tunnelRoof:'rgba(43,18,48,.98)',lightA:'#ff79b5',lightB:'#ffe27a'}}
];
const addedCourseData=[
  {name:'オーロラクリスタルグレイシャー',short:'AURORA GLACIER',style:'ハイスピード＆アイスライン',difficulty:'★★★★☆',art:'assets/environment/course-aurora.png',crop:{x:.48,y:.12,w:.50,h:.50},nodes:auroraNodes,heights:[0,.24,.52,.82,.58,.18,-.18,-.34,.04,.42,.74,.46,.08,-.22,.12],tunnels:[[460,620],[1180,1325]],useCandyProps:false,propTheme:'rain',rampRow:3,theme:{vergeA:'#b8e8ff',vergeB:'#d8f6ff',curbA:'#f9ffff',curbB:'#6bdcff',roadA:'#455c78',roadB:'#58708c',lane:'rgba(226,252,255,.88)',accent:'#8b66ff',railA:'#ecffff',railB:'#72dfff',tunnelSide:'rgba(55,82,118,.9)',tunnelSide2:'rgba(28,54,92,.94)',tunnelRoof:'rgba(18,33,70,.96)',lightA:'#75f0ff',lightB:'#b98cff'}},
  {name:'エメラルドジャングル遺跡サーキット',short:'EMERALD RUINS',style:'ワイルド＆テクニカル',difficulty:'★★★★☆',art:'assets/environment/course-jungle.png',crop:{x:.49,y:.13,w:.50,h:.50},nodes:jungleNodes,startLine:35,heights:[0,.1,.36,.22,-.18,-.34,.08,.44,.68,.28,-.1,.32,.58,.2,-.24,.04],tunnels:[[300,470],[1040,1220]],useCandyProps:false,propTheme:'steam',rampRow:1,theme:{vergeA:'#204c2d',vergeB:'#2f7041',curbA:'#e4c45a',curbB:'#315126',roadA:'#4a4938',roadB:'#5d5a42',lane:'rgba(255,226,128,.72)',accent:'#37f0b2',railA:'#d6b553',railB:'#24411f',tunnelSide:'rgba(30,48,24,.97)',tunnelSide2:'rgba(23,38,19,.98)',tunnelRoof:'rgba(17,27,15,.98)',lightA:'#50ff9e',lightB:'#ffd96a'}},
  {name:'さくら湯けむり温泉サーキット',short:'SAKURA ONSEN',style:'フロー＆ドリフト',difficulty:'★★★☆☆',art:'assets/environment/course-sakura.png',crop:{x:.48,y:.12,w:.51,h:.50},nodes:sakuraNodes,heights:[0,.16,.34,.52,.24,-.08,-.2,.12,.38,.62,.28,-.12,-.26,.08],tunnels:[[610,780]],useCandyProps:false,propTheme:'royal',rampRow:4,theme:{vergeA:'#e78da7',vergeB:'#f5bfd0',curbA:'#fff7ee',curbB:'#e85986',roadA:'#5a504b',roadB:'#6e625b',lane:'rgba(255,244,220,.86)',accent:'#ff8fc4',railA:'#fff1df',railB:'#d97b8d',tunnelSide:'rgba(85,43,57,.93)',tunnelSide2:'rgba(61,34,48,.96)',tunnelRoof:'rgba(38,24,38,.98)',lightA:'#ff9ec7',lightB:'#ffe4a8'}},
  {name:'コーラルアクアパレスサーキット',short:'CORAL PALACE',style:'ウェーブ＆ライン取り',difficulty:'★★★★☆',art:'assets/environment/course-coral.png',crop:{x:.48,y:.12,w:.51,h:.50},nodes:coralNodes,heights:[0,.14,.34,.64,.44,.08,-.18,-.38,-.1,.26,.54,.72,.36,-.04,-.24,.12],tunnels:[[540,705],[1300,1440]],useCandyProps:false,propTheme:'rain',rampRow:3,theme:{vergeA:'#4fc7c9',vergeB:'#83e5df',curbA:'#fff5e7',curbB:'#ff8bb8',roadA:'#3b6f83',roadB:'#4f8498',lane:'rgba(219,255,255,.86)',accent:'#ff83c7',railA:'#ffe8f1',railB:'#5ee6eb',tunnelSide:'rgba(31,93,120,.86)',tunnelSide2:'rgba(24,72,99,.9)',tunnelRoof:'rgba(16,48,78,.94)',lightA:'#7df8ff',lightB:'#ff96d1'}},
  {name:'ファントムカーニバルナイトサーキット',short:'PHANTOM NIGHT',style:'ナイト＆ギミック',difficulty:'★★★★★',art:'assets/environment/course-phantom.png',crop:{x:.49,y:.12,w:.50,h:.50},nodes:phantomNodes,heights:[0,.28,.58,.38,.02,-.26,.18,.52,.8,.46,.1,-.22,.08,.36,-.18],tunnels:[[405,590],[905,1075],[1380,1510]],useCandyProps:false,propTheme:'neon',rampRow:2,theme:{vergeA:'#1b1038',vergeB:'#2d1453',curbA:'#ff9d3d',curbB:'#8e49ff',roadA:'#211f35',roadB:'#312a4d',lane:'rgba(255,180,85,.76)',accent:'#ff59e6',railA:'#ffb55b',railB:'#7436c8',tunnelSide:'rgba(26,12,52,.98)',tunnelSide2:'rgba(42,14,64,.98)',tunnelRoof:'rgba(12,8,31,.99)',lightA:'#ff7a36',lightB:'#b35cff'}},
  {name:'ルナティックコロニーサーキット',short:'LUNATIC COLONY',style:'低重力ハイスピード',difficulty:'★★★★★',art:'assets/environment/course-lunatic.png',crop:{x:.48,y:.12,w:.51,h:.50},nodes:lunaticNodes,heights:[0,.22,.54,.86,.58,.2,-.16,.24,.64,.9,.5,.08,-.24,.18,.48,-.08],tunnels:[[350,535],[760,930],[1215,1390]],useCandyProps:false,propTheme:'neon',rampRow:2,theme:{vergeA:'#232b42',vergeB:'#35405f',curbA:'#6ff1ff',curbB:'#a66bff',roadA:'#202538',roadB:'#30384f',lane:'rgba(129,242,255,.82)',accent:'#90f7ff',railA:'#6befff',railB:'#8f67ff',tunnelSide:'rgba(27,30,55,.98)',tunnelSide2:'rgba(18,22,43,.99)',tunnelRoof:'rgba(8,10,29,.99)',lightA:'#60efff',lightB:'#ad80ff'}}
];
const debugPodiumNodes=[
  [.19,.62],[.24,.40],[.42,.31],[.66,.35],[.79,.52],[.68,.71],[.42,.75],[.22,.68],[.19,.62]
];
const debugCourseData={debugOnly:true,name:'表彰台テストサーキット',short:'PODIUM TEST',style:'DEBUG / 超短距離',difficulty:'TEST',art:'assets/environment/course-sweets.png',crop:{x:.47,y:.12,w:.52,h:.50},nodes:debugPodiumNodes,startLine:28,finishDistance:280,totalLaps:1,heights:[0,.08,.18,.1,-.02,.06,0],tunnels:[],useCandyProps:true,propTheme:'sweets',rampRow:0,theme:{...courseData[0].theme,accent:'#ffe85d',lane:'rgba(255,255,255,.86)'}};
courseData.push(...addedCourseData,debugCourseData);
courseImages=courseData.map(course=>loadImage(course.art));activeCourse=courseData[0];
let trackNodes=courseData[0].nodes;
function wrap01(n){return ((n%1)+1)%1}
function catmull(a,b,c,d,t){const t2=t*t,t3=t2*t;return .5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t2+(-a+3*b-3*c+d)*t3)}
function rawTrackPoint(t){const n=trackNodes.length-1,p=wrap01(t)*n,i=Math.floor(p),f=p-i;const get=k=>trackNodes[(k+n)%n];return[catmull(get(i-1)[0],get(i)[0],get(i+1)[0],get(i+2)[0],f),catmull(get(i-1)[1],get(i)[1],get(i+1)[1],get(i+2)[1],f)]}
function buildTrackArc(){const a=[{t:0,d:0}],steps=1200;let prev=rawTrackPoint(0),total=0;for(let i=1;i<=steps;i++){const p=rawTrackPoint(i/steps);total+=Math.hypot(p[0]-prev[0],p[1]-prev[1]);a.push({t:i/steps,d:total});prev=p}for(const x of a)x.d/=total;return a}
let trackArc=buildTrackArc();setupCourseGrid();
function trackParam(progress){const d=wrap01(progress);let lo=0,hi=trackArc.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(trackArc[m].d<d)lo=m;else hi=m}const a=trackArc[lo],b=trackArc[hi],f=(d-a.d)/Math.max(.000001,b.d-a.d);return a.t+(b.t-a.t)*f}
function mapPoint(progress){return rawTrackPoint(trackParam(progress))}
function trackSample(progress){const e=.00035,p=mapPoint(progress),a=mapPoint(progress-e),b=mapPoint(progress+e),l=Math.hypot(b[0]-a[0],b[1]-a[1])||1;return{x:p[0],y:p[1],tx:(b[0]-a[0])/l,ty:(b[1]-a[1])/l,heading:Math.atan2(b[1]-a[1],b[0]-a[0])}}
function angleDelta(a,b){return Math.atan2(Math.sin(a-b),Math.cos(a-b))}
function trackBend(progress){return Math.max(-1,Math.min(1,angleDelta(trackSample(progress+.006).heading,trackSample(progress-.006).heading)*3.2))}
function drawMinimap(){
  const c=$('courseMap');if(!c)return;const m=c.getContext('2d');m.clearRect(0,0,c.width,c.height);
  const theme=activeCourse?.theme||courseData[0].theme;m.save();m.lineJoin='round';m.lineCap='round';const drawPath=()=>{m.beginPath();for(let i=0;i<=180;i++){const [px,py]=mapPoint(i/180),x=12+px*(c.width-24),y=9+py*(c.height-18);i?m.lineTo(x,y):m.moveTo(x,y)}};drawPath();m.strokeStyle='rgba(25,12,35,.9)';m.lineWidth=18;m.stroke();drawPath();m.strokeStyle=theme.curbA;m.lineWidth=12;m.stroke();drawPath();m.strokeStyle=theme.accent;m.lineWidth=4;m.stroke();m.restore();
  const sorted=[...racers].sort((a,b)=>a.distance-b.distance);
  for(const r of sorted){const [px,py]=mapPoint(r.progress),isPlayer=r===racers[state.selected],x=12+px*(c.width-24),y=9+py*(c.height-18);m.save();m.shadowColor=isPlayer?'#63eaff':'#000';m.shadowBlur=isPlayer?12:4;m.fillStyle=isPlayer?'#54e8ff':r.color;m.strokeStyle='#fff';m.lineWidth=isPlayer?3:1.5;m.beginPath();m.arc(x,y,isPlayer?7:4,0,7);m.fill();m.stroke();m.restore()}
}
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>$('toast').classList.remove('show'),900)}

addEventListener('keydown',e=>{
  if(captureAction){e.preventDefault();if(e.code==='Backspace'){captureAction=null;renderKeyConfig();$('keyCaptureHelp').textContent='キー変更をキャンセルしました。'}else finishKeyCapture(captureAction,e.code);return}
  if(state.mode==='race'&&raceBgm?.paused)resumeRaceMusic();
  const action=actionForCode(e.code);if(!action)return;keyboardActions[action]=true;e.preventDefault();
  if(action==='right')state.steer=Math.max(state.steer,.42);if(action==='left')state.steer=Math.min(state.steer,-.42);
  if(action==='accelerate'&&!e.repeat)handleStartCharge();if(action==='item'&&!e.repeat)useItem();if(action==='pause'&&!e.repeat)togglePause();
});
addEventListener('keyup',e=>{const action=actionForCode(e.code);if(action)keyboardActions[action]=false});
addEventListener('pointerdown',()=>{if(state.mode==='race'&&raceBgm?.paused)resumeRaceMusic()},{passive:true});
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key,action=k==='accel'?'accelerate':k;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);b.classList.add('pressed');touchActions[action]=true;if(action==='item')useItem();if(action==='accelerate')handleStartCharge()});['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,e=>{e.preventDefault();b.classList.remove('pressed');touchActions[action]=false}))});
$('mobileControls').addEventListener('contextmenu',e=>e.preventDefault());
$('mobileControls').addEventListener('selectstart',e=>e.preventDefault());

const itemNames=['star','rocket','shield','lightning'];
function giveItem(){
  const pool=state.rank<=2?['shield','rocket','shield','star']:state.rank>=5?['star','lightning','rocket','star']:['rocket','shield','star','lightning'];
  state.item=pool[Math.floor(Math.random()*pool.length)];drawHeldItem();toast('ITEM GET!')
}
function drawHeldItem(){
  const c=$('itemIcon');if(!c)return;const labels={star:'スター',rocket:'ロケット',shield:'シールド',lightning:'サンダー'};c.setAttribute('aria-label',state.item?`所持アイテム：${labels[state.item]}`:'アイテムなし');const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);
  if(!state.item){x.fillStyle='#fff';x.font='900 50px Fredoka';x.textAlign='center';x.fillText('?',46,64);return}
  const index=itemNames.indexOf(state.item),frame=itemFrames[index];if(frame)x.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,6,6,80,80);
}
function useItem(){
  if(state.mode!=='race'||!state.running||state.paused||!state.item)return;
  const item=state.item;state.item=null;drawHeldItem();
  const anchor=playerEffectAnchor();
  if(item==='star'){state.invincible=4.2;state.turbo=4.2;state.speed=Math.max(state.speed,205);toast('STAR DASH!');spawnVfx(4,anchor.x,anchor.y-anchor.height*.46,1.1,210,'front',true);burst(anchor.x,anchor.y-anchor.height*.52,8,'#fff2a4',3)}
  if(item==='rocket'){state.projectiles.push({z:state.distance+70,lane:state.x,speed:115,life:5});toast('ROCKET!');spawnVfx(1,anchor.x,anchor.y-anchor.height*.24,.55,170,'front',true);burst(anchor.x,anchor.y-anchor.height*.2,6,'#ffb13b',6)}
  if(item==='shield'){state.shield=7;toast('CRYSTAL SHIELD!');spawnVfx(0,anchor.x,anchor.y-anchor.height*.45,.8,205,'front',true);burst(anchor.x,anchor.y-anchor.height*.45,5,'#74ecff',0)}
  if(item==='lightning'){racers.forEach((r,i)=>{if(i!==state.selected){r.hit=3;r.spin=1}});toast('LIGHTNING!');state.flash=1;spawnVfx(5,anchor.x,anchor.y-anchor.height*.74,1,230,'front',true);burst(anchor.x,anchor.y-anchor.height*.7,10,'#74ecff',5)}
  state.shake=12;
}
function collectObject(o,targetIndex){
  if(o.taken)return;o.taken=true;o.takenBy=targetIndex;const r=racers[targetIndex],player=targetIndex===state.selected,label=o.type==='coin'?'COIN':o.type==='item'?'ITEM':'BOOST';state.collectFx.push({type:o.type,z:o.z,lane:o.lane,targetIndex,life:.78,max:.78,label});
  if(o.type==='coin'){if(player){state.coins=Math.min(10,state.coins+1);state.raceWalletEarned++;addWalletCoins(1);toast('+ COIN')}else r.aiCoins=Math.min(10,(r.aiCoins||0)+1)}
  else if(o.type==='item'){if(player)giveItem();else{r.aiItem=['star','rocket','shield'][Math.abs(Math.floor(o.z/155)+targetIndex)%3];r.aiVelocity=Math.max(r.aiVelocity,172)}}
  else if(player){state.turbo=1.25;state.speed=Math.max(state.speed,195);toast('BOOST PAD!')}else{r.aiVelocity=Math.max(r.aiVelocity,198);r.aiBoost=1.2}
}
function spawnLandingDust(){const px=innerWidth*.5+state.steer*18,py=innerHeight*.9;state.particles.push({kind:'dust',fxFrame:4,layer:'back',x:px,y:py+8,vx:0,vy:-5,life:.72,max:.72,color:'#efd1a2',size:310,rot:0,spin:0});for(let i=0;i<12;i++){const side=i%2?1:-1;state.particles.push({kind:'dust',fxFrame:i%4===0?3:5,layer:i%3?'back':'front',x:px+side*(28+Math.random()*58),y:py+8+Math.random()*8,vx:side*(45+Math.random()*150),vy:-24-Math.random()*85,life:.48+Math.random()*.42,max:.9,color:'#e8c28e',size:48+Math.random()*44,rot:(Math.random()-.5)*.28,spin:(Math.random()-.5)*.7})}}
function spawnRampTakeoffFx(){const px=innerWidth*.5+state.steer*18,py=innerHeight*.86;state.particles.push({kind:'vfx',index:1,layer:'back',x:px,y:py+10,vx:0,vy:-12,life:.5,max:.5,size:210,rot:Math.PI,spin:.15});for(let i=0;i<16;i++){const side=i%2?1:-1;state.particles.push({kind:'dust',fxFrame:i%3===0?4:3,layer:i%4?'back':'front',x:px+side*(18+Math.random()*72),y:py+14+Math.random()*10,vx:side*(65+Math.random()*155),vy:-55-Math.random()*120,life:.36+Math.random()*.34,max:.7,color:'#f1d59e',size:52+Math.random()*60,rot:(Math.random()-.5)*.34,spin:(Math.random()-.5)*.8})}}
function launchRamp(index){if(index===state.selected){if(state.airborne)return;state.airborne=true;state.jumpY=1;state.jumpVelocity=228+state.speed*.16;state.speed=Math.max(state.speed,158);state.turbo=Math.max(state.turbo,1.05);state.suspension=-13;state.suspensionVelocity=-58;state.shake=Math.max(state.shake,10);state.flash=Math.max(state.flash,.18);spawnRampTakeoffFx();toast('RAMP JUMP!')}else{const racer=racers[index];if(racer.airborne)return;racer.airborne=true;racer.jumpY=1;racer.jumpVelocity=205+(racer.aiVelocity||140)*.12;racer.aiBoost=Math.max(racer.aiBoost||0,.9)}}
function updateJumpPhysics(body,dt,player=false){if(!body.airborne)return;const gravity=player?455:420;body.jumpVelocity-=gravity*dt;body.jumpY+=body.jumpVelocity*dt;if(player&&body.jumpVelocity<0)state.speed+=Math.min(18,(-body.jumpVelocity/300)*16)*dt;if(body.jumpY<=0&&body.jumpVelocity<0){const impact=Math.min(1.25,Math.max(.35,-body.jumpVelocity/290));body.jumpY=0;body.jumpVelocity=0;body.airborne=false;if(player){state.suspension=13;state.suspensionVelocity=64;state.shake=Math.max(state.shake,10+impact*3);spawnLandingDust();toast('LANDING BOOST!');state.turbo=Math.max(state.turbo,.48+impact*.32);state.speed=Math.max(state.speed,178+impact*28)}}}
function spawnDrivingFx(dt,offroad,drifting){
  const px=innerWidth*.5+state.steer*18,py=innerHeight*.87,speed=Math.min(1,state.speed/190),room=state.particles.length<240;if(room&&state.speed>22&&Math.random()<dt*(8+speed*15)){const boost=state.boosting;state.particles.push({kind:'smoke',fxFrame:boost?1:0,layer:'back',x:px+(Math.random()-.5)*38,y:py+18,vx:(Math.random()-.5)*34,vy:-18-Math.random()*32,life:.38+Math.random()*.34,max:.72,color:boost?'#d9fbff':'#c8bed0',size:(boost?78:58)+Math.random()*26,rot:(Math.random()-.5)*.2,spin:(Math.random()-.5)*.45})}
  if(room&&state.speed>32&&Math.random()<dt*(7+speed*16)){const boost=state.boosting;state.particles.push({kind:'exhaust',layer:'back',x:px+(Math.random()-.5)*42,y:py+14,vx:(Math.random()-.5)*28,vy:55+Math.random()*75,life:boost?.35:.22,max:boost?.35:.22,color:boost?'#64efff':'#ff9d4d',size:boost?12:6,rot:0,spin:0})}
  if(room&&offroad&&Math.random()<dt*(22+speed*42)){for(const side of [-1,1])state.particles.push({kind:'dust',fxFrame:Math.random()>.28?3:5,layer:Math.random()>.78?'front':'back',x:px+side*(48+Math.random()*25),y:py+22,vx:side*(35+Math.random()*90),vy:-30-Math.random()*72,life:.54+Math.random()*.38,max:.92,color:'#e1ae81',size:72+Math.random()*58,rot:(Math.random()-.5)*.25,spin:(Math.random()-.5)*.65})}
  if(room&&drifting&&state.speed>65&&Math.random()<dt*(11+speed*15)){const side=Math.sign(state.steer)||1;state.particles.push({kind:'smoke',fxFrame:2,layer:'back',x:px-side*(54+Math.random()*18),y:py+19,vx:-side*(25+Math.random()*75),vy:-24-Math.random()*35,life:.5+Math.random()*.34,max:.84,color:'#e8d9e6',size:105+Math.random()*52,rot:-side*.08+(Math.random()-.5)*.12,spin:(Math.random()-.5)*.35})}
  if(drifting&&state.speed>65&&Math.random()<dt*(20+state.driftLevel*13)){const side=Math.sign(state.steer)||1,color=['#74ecff','#74ecff','#ffb13b','#ff52de'][state.driftLevel];state.particles.push({kind:'spark',layer:'back',x:px-side*62,y:py+10,vx:-side*(65+Math.random()*120),vy:-35-Math.random()*95,life:.22+Math.random()*.22,max:.44,color,size:2+Math.random()*3,rot:0,spin:0})}
}

function update(dt){
  if(state.mode!=='race'||!state.running||state.paused)return;
  state.elapsed+=dt*1000;state.shield=Math.max(0,state.shield-dt);state.invincible=Math.max(0,state.invincible-dt);state.turbo=Math.max(0,state.turbo-dt);state.flash=Math.max(0,state.flash-dt*2.5);state.collisionCooldown=Math.max(0,state.collisionCooldown-dt);
  const accel=actionDown('accelerate'),brake=actionDown('brake'),left=actionDown('left'),right=actionDown('right'),driftKey=actionDown('drift');
  const tune=racers[state.selected].set.stats,maxSpeed=158+tune.speed*.22+Math.min(10,state.coins)*1.5+(state.turbo>0?48+tune.boost*.08:0)+(state.invincible>0?15:0);
  if(accel)state.speed+=(66+tune.accel*.3)*dt;else state.speed-=58*dt;
  if(brake)state.speed-=145*dt;
  state.speed-=state.speed*state.speed*.00042*dt;state.speed=Math.max(0,Math.min(maxSpeed,state.speed));if(state.speed<.05)state.speed=0;
  const digitalSteer=Number(right)-Number(left),steerTarget=Math.abs(gamepadInput.steer)>.16?gamepadInput.steer:digitalSteer,steerGrip=Math.min(1,state.speed/80);
  const steerResponse=5.1+tune.handling*.025;state.steer+=(steerTarget-state.steer)*dt*(driftKey?steerResponse+2:steerResponse);state.x+=state.steer*steerGrip*dt*(driftKey?1.15+tune.handling*.0013:.79+tune.handling*.0017);
  state.trackCurve=trackBend(state.progress);
  const speedRatio=Math.min(1.2,state.speed/185),curveForce=state.trackCurve*speedRatio*speedRatio*(driftKey?.52:1.1-tune.handling*.0013);
  state.centrifugal+=(curveForce-state.centrifugal)*Math.min(1,dt*4.5);state.x-=state.centrifugal*dt*.92;
  const offroad=Math.abs(state.x)>1.02;
  if(offroad&&state.invincible<=0){state.speed=Math.max(0,state.speed-125*dt);state.shake=Math.max(state.shake,3)}
  if(Math.abs(state.x)>1.31&&state.invincible<=0&&state.collisionCooldown<=0){state.x=Math.sign(state.x)*1.25;state.speed*=.82;state.steer*=-.35;state.shake=11;state.collisionCooldown=.65;toast('GUARD RAIL!');burst(innerWidth/2+Math.sign(state.x)*innerWidth*.36,innerHeight*.72,10,'#fff2a4')}
  state.x=Math.max(-1.42,Math.min(1.42,state.x));state.x*=Math.pow(.998,dt*60);

  if(driftKey&&Math.abs(state.steer)>.18&&state.speed>65){
    state.drift=Math.min(3.2,state.drift+dt*(.58+tune.technique*.0018+Math.abs(state.steer)*.55));
    state.driftLevel=state.drift>=2.25?3:state.drift>=1.25?2:state.drift>=.5?1:0;
    const colors=['#65e9ff','#65e9ff','#ffad3d','#ff4edb'];
    if(Math.random()<dt*38)burst(innerWidth/2+state.x*150-state.steer*72,innerHeight*.88,1,colors[state.driftLevel]);
  } else if(state.drift>0){
    const level=state.driftLevel;if(level){const boostTune=.82+tune.boost*.003;state.turbo=[0,.65,1.15,1.8][level]*boostTune;state.speed=Math.max(state.speed,[0,180,196,212][level]+(tune.boost-80)*.1);toast(['','MINI TURBO!','SUPER TURBO!','ULTRA TURBO!'][level]);spawnVfx(2,innerWidth/2+state.x*150,innerHeight*.84,.65)}
    state.drift=0;state.driftLevel=0;
  }
  state.boosting=state.turbo>0||state.invincible>0;
  updateJumpPhysics(state,dt,true);const riseAhead=hillAt(state.distance+18)-hillAt(state.distance),riseBehind=hillAt(state.distance)-hillAt(state.distance-18),suspensionTarget=state.airborne?-4:-(riseAhead-riseBehind)*Math.min(1,state.speed/150)*78;state.suspensionVelocity+=(suspensionTarget-state.suspension)*38*dt;state.suspensionVelocity*=Math.exp(-8*dt);state.suspension+=state.suspensionVelocity*dt;state.suspension=Math.max(-13,Math.min(13,state.suspension));spawnDrivingFx(dt,offroad,driftKey&&Math.abs(state.steer)>.18);
  const length=raceLength(),laps=raceLaps();
  state.distance=Math.max(0,state.distance+state.speed/3.6*dt);state.progress=state.distance/length;racers[state.selected].distance=state.distance;racers[state.selected].progress=state.progress;
  racers[state.selected].lane=state.x;
  if(state.speed>1){const targetHeading=trackSample(state.progress+.008).heading,turn=angleDelta(targetHeading,state.cameraHeading),maxTurn=(.34+Math.min(1,state.speed/180)*.44)*dt;state.cameraHeading=Math.atan2(Math.sin(state.cameraHeading+Math.max(-maxTurn,Math.min(maxTurn,turn))),Math.cos(state.cameraHeading+Math.max(-maxTurn,Math.min(maxTurn,turn))))}

  racers.forEach((r,i)=>{if(i===state.selected)return;r.hit=Math.max(0,r.hit-dt);r.spin=Math.max(0,r.spin-dt);r.aiBoost=Math.max(0,(r.aiBoost||0)-dt);updateJumpPhysics(r,dt,false);const gap=state.distance-r.distance,rubber=Math.max(-21,Math.min(21,gap*.14)),aiTarget=r.aiSpeed+rubber+(r.aiBoost>0?34:0),velocityStep=Math.max(-62*dt,Math.min(54*dt,aiTarget-r.aiVelocity));r.aiVelocity=Math.max(0,r.aiVelocity+velocityStep);const aiActual=r.aiVelocity*(r.hit>0?.46:1);r.distance+=aiActual/3.6*dt;r.progress=r.distance/length;
    r.laneTimer-=dt;if(r.laneTimer<=0){const choices=[-.66,-.33,0,.33,.66],phase=Math.abs(Math.floor(r.distance/95)+i*3)%choices.length;r.aiTargetLane=choices[phase];r.laneTimer=1.4+(i%5)*.38}
    const nearby=racers.find((o,j)=>j!==i&&j!==state.selected&&Math.abs(o.distance-r.distance)<17&&Math.abs(o.lane-r.lane)<.2);if(nearby)r.aiTargetLane=Math.max(-.7,Math.min(.7,r.aiTargetLane+(i%2?.32:-.32)));
    r.lane+=(r.aiTargetLane-r.lane)*dt*.8;r.lane+=Math.sin(state.elapsed*.0011+i*1.7)*dt*.025;r.lane=Math.max(-.74,Math.min(.74,r.lane))});
  for(const r of racers.filter((_,i)=>i!==state.selected)){const rel=r.distance-state.distance;if(Math.abs(rel)<20&&Math.abs(r.lane-state.x)<.22&&state.collisionCooldown<=0){if(state.invincible>0||state.shield>0){r.hit=1.3;r.spin=1;toast('HIT!')}else{state.speed*=.72;toast('BUMP!')}state.shake=10;state.collisionCooldown=1;burst(innerWidth/2+state.x*130,innerHeight*.73,16,'#ff7abf')}}

  for(const shot of state.projectiles){shot.z+=shot.speed*dt;shot.life-=dt;const target=racers.filter((_,i)=>i!==state.selected).sort((a,b)=>a.distance-b.distance).find(r=>r.distance>state.distance);if(target)shot.lane+=(target.lane-shot.lane)*dt*2.4;for(const r of racers){if(r===racers[state.selected])continue;if(Math.abs(r.distance-shot.z)<28&&Math.abs(r.lane-shot.lane)<.26){r.hit=2.2;r.spin=1.2;shot.life=0;toast('ROCKET HIT!');const hit=projectTrackEntity(r.distance,r.lane),fxX=hit.visible?hit.x:innerWidth/2,fxY=hit.visible?hit.y-70*Math.max(.45,hit.scale):innerHeight*.5,fxSize=hit.visible?Math.max(90,180*hit.scale):160;spawnVfx(5,fxX,fxY,.6,fxSize,'front',true);burst(fxX,fxY,8,'#74ecff',5)}}}
  state.projectiles=state.projectiles.filter(s=>s.life>0&&s.z-state.distance<DRAW_DISTANCE);

  state.rank=[...racers].sort((a,b)=>b.distance-a.distance).indexOf(racers[state.selected])+1;if(state.rank!==state.lastRank&&state.elapsed>1000){announceRank(state.lastRank,state.rank);state.lastRank=state.rank}state.lap=Math.max(1,Math.floor(state.distance/length)+1);if(state.lap>laps)finishRace();
  for(const ramp of state.objects.filter(o=>o.type==='ramp')){for(let i=0;i<racers.length;i++){if(ramp.hitBy.has(i))continue;const r=racers[i],dz=r.distance-ramp.z;if(dz>=-7&&dz<=13&&Math.abs(r.lane-ramp.lane)<.34){ramp.hitBy.add(i);launchRamp(i)}}}
  for(const o of state.objects){if(o.type==='ramp'||o.taken)continue;let best=null;for(let i=0;i<racers.length;i++){const r=racers[i],dz=Math.abs(r.distance-o.z),laneGap=Math.abs(r.lane-o.lane),reach=o.type==='pad'?.28:.22;if(dz<13&&laneGap<reach&&(!best||dz+laneGap*20<best.score))best={i,score:dz+laneGap*20}}if(best)collectObject(o,best.i)}
  state.collectFx.forEach(f=>f.life-=dt);state.collectFx=state.collectFx.filter(f=>f.life>0);
  state.particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.kind==='smoke'){p.vx*=Math.exp(-1.8*dt);p.vy-=7*dt}else p.vy+=(p.kind==='dust'?58:90)*dt;p.life-=dt;p.rot+=dt*p.spin});state.particles=state.particles.filter(p=>p.life>0);state.shake*=Math.pow(.88,dt*60);
  updateHud();if(Math.floor(state.elapsed/450)!==Math.floor((state.elapsed-dt*1000)/450))buildRank();
}

const trackCurves=[.52,.68,.62,.38,-.42,-.68,-.54,.48,.64,-.52,-.72,.66,-.58,.74,-.7,.62,-.56,.68,-.64,.55,-.38,.34,.56,.52];
let trackHeights=courseData[0].heights;
function curveAt(distance){const p=((distance%TRACK_LENGTH)+TRACK_LENGTH)%TRACK_LENGTH/TRACK_LENGTH*trackCurves.length,i=Math.floor(p),t=p-i,s=t*t*(3-2*t),a=trackCurves[i%trackCurves.length],b=trackCurves[(i+1)%trackCurves.length];return a+(b-a)*s}
function hillAt(distance){const p=((distance%TRACK_LENGTH)+TRACK_LENGTH)%TRACK_LENGTH/TRACK_LENGTH*trackHeights.length,i=Math.floor(p),t=p-i,s=t*t*(3-2*t),a=trackHeights[i%trackHeights.length],b=trackHeights[(i+1)%trackHeights.length];return (a+(b-a)*s)*ELEVATION_INTENSITY+Math.sin(p*Math.PI*.5)*.035}

function playerEffectAnchor(){
  const base=roadPoint(2.5),height=Math.min(innerHeight*.29,218),x=innerWidth*.5+state.steer*18,groundY=Math.min(innerHeight*.9,base.y)+state.suspension,y=groundY-state.jumpY;
  return{x,y,groundY,height}
}
function burstFrameForColor(color){
  const c=String(color).toLowerCase();
  if(c.includes('ff7')||c.includes('ff5')||c.includes('pink'))return 1;
  if(c.includes('b13')||c.includes('f2a4')||c.includes('fff2'))return 6;
  if(c.includes('ae81')||c.includes('d1a2')||c.includes('brown'))return 2;
  if(c.includes('74ec')||c.includes('6fea')||c.includes('cyan'))return 0;
  return 3;
}
function burst(x,y,n,color,frameIndex=null){
  for(let i=0;i<n;i++){
    const size=34+Math.random()*42,life=.28+Math.random()*.42,burstFrame=frameIndex??burstFrameForColor(color);
    state.particles.push({kind:'burst',burstFrame,color,x,y,vx:(Math.random()-.5)*240,vy:(Math.random()-.84)*190,life,max:life,size,rot:(Math.random()-.5)*.7,spin:(Math.random()-.5)*2.6})
  }
}
function spawnVfx(index,x,y,life,size=160,layer='front',center=false){state.particles.push({kind:'vfx',index,x,y,vx:0,vy:-8,life,max:life,size,layer,center,rot:0,spin:(Math.random()-.5)*.7})}
function ordinal(n){return`${n}<sup>${n===1?'st':n===2?'nd':n===3?'rd':'th'}</sup>`}
function racerResultTime(rank){return fmt(state.elapsed+Math.max(0,rank-state.rank)*1700+rank*420)}
function drawPodiumRacerSprite(canvas,racer,rank){
  if(!canvas||!racer)return;
  const frame=racer.frames?.[10]||racer.frames?.[3]||racer.frames?.[0],c=canvas.getContext('2d');
  c.clearRect(0,0,canvas.width,canvas.height);
  if(!frame)return;
  const rankScale=rank===1?1.05:.94,scale=Math.min(canvas.width/frame.sw*.88,canvas.height/frame.sh*.92)*rankScale,w=frame.sw*scale,h=frame.sh*scale,x=(canvas.width-w)/2,y=canvas.height-h-2;
  c.imageSmoothingEnabled=true;c.shadowColor='rgba(0,0,0,.45)';c.shadowBlur=18;c.shadowOffsetY=12;
  c.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,x,y,w,h);
}
function renderPodiumRacer(slot,racer,rank){
  if(!slot||!racer)return;
  slot.style.setProperty('--delay',`${rank===3?760:rank===2?1420:2140}ms`);
  slot.innerHTML=`<canvas width="300" height="300" aria-label="${racer.name}"></canvas><strong>${ordinal(rank)}</strong><span>${racer.name}</span>`;
  const canvas=slot.querySelector('canvas');
  if(racer.frames)drawPodiumRacerSprite(canvas,racer,rank);
  else ensureRacerSprite(racers.indexOf(racer)).then(()=>drawPodiumRacerSprite(canvas,racer,rank));
}
function renderResultCeremony(){
  const sorted=[...racers].sort((a,b)=>b.distance-a.distance),rows=$('resultRows');
  rows.innerHTML=sorted.slice(0,6).map((r,i)=>{const rank=i+1,isPlayer=r===racers[state.selected];return`<div class="result-row ${isPlayer?'player':''}" style="--delay:${Math.max(0,6-rank)*70}ms"><strong>${ordinal(rank)}</strong><img src="${r.portrait}"><span>${r.name}</span><b>${racerResultTime(rank)}</b></div>`}).join('');
  [1,2,3].forEach(rank=>renderPodiumRacer($(`podiumSlot${rank}`),sorted[rank-1],rank));
  $('resultCourseName').textContent=activeCourse.short;$('awardCard').innerHTML=`<small>表彰状</small><strong>${racers[state.selected].name}</strong><span>第 ${state.rank} 位　${state.rank<=3?'見事な表彰台です！':'最後までよく走り切りました！'}</span>`;
}
function finishRace(){
  if(state.finish)return;state.finish=true;state.running=false;state.mode='finish';
  const bonus=state.rank===1?20:state.rank===2?15:state.rank===3?12:Math.max(3,11-state.rank);state.raceWalletEarned+=bonus;addWalletCoins(bonus);pauseRaceMusic();setDebugPanel(false);$('hud').classList.add('hidden');$('mobileControls').classList.add('hidden');
  $('finishRank').innerHTML=ordinal(state.rank);$('finishTitle').textContent=state.rank===1?'VICTORY!':'RACE CLEAR!';$('finishTime').textContent=fmt(state.elapsed);$('finishCoins').textContent=`+${state.raceWalletEarned} COINS · TOTAL ${playerProgress.coins}`;renderResultCeremony();
  setTimeout(()=>showScreen('finish'),500)
}

function coverImage(image,shift=0,crop=null){
  const w=innerWidth,h=innerHeight;if(!image.complete||!image.naturalWidth){ctx.fillStyle='#130b3b';ctx.fillRect(0,0,w,h);return}
  const rx=crop?crop.x*image.naturalWidth:0,ry=crop?crop.y*image.naturalHeight:0,rw=crop?crop.w*image.naturalWidth:image.naturalWidth,rh=crop?crop.h*image.naturalHeight:image.naturalHeight,scale=Math.max(w/rw,h/rh)*1.06,sw=w/scale,sh=h/scale;
  const sx=Math.max(rx,Math.min(rx+rw-sw,rx+(rw-sw)/2+shift*rw*.045)),sy=Math.max(ry,Math.min(ry+rh-sh,ry+(rh-sh)/2));ctx.drawImage(image,sx,sy,sw,sh,0,0,w,h);
}
function drawBackdrop(){
  const shift=state.x*.45-state.trackCurve*1.25;coverImage(environment,shift,environmentCrop);
  const shade=ctx.createLinearGradient(0,0,0,innerHeight);shade.addColorStop(0,'rgba(4,8,46,.06)');shade.addColorStop(.48,'rgba(15,8,52,.12)');shade.addColorStop(1,'rgba(5,3,24,.4)');ctx.fillStyle=shade;ctx.fillRect(0,0,innerWidth,innerHeight);
}
function buildRoadProjection(){
  const h=innerHeight,w=innerWidth,speed=Math.min(1,state.speed/220),grade=hillAt(state.distance+45)-hillAt(state.distance-20),horizon=h*(.30-speed*.014+grade*.025),base=trackSample(state.progress),cameraX=state.x*ROAD_WORLD_HALF_WIDTH*.72;
  let worldX=0,dx=0,maxY=h+1;roadProjection=[];
  for(let i=0;i<=ROAD_SEGMENTS;i++){
    const rel=i*ROAD_SEGMENT_LENGTH,distance=state.distance+rel,sample=trackSample(distance/TRACK_LENGTH);
    const before=trackSample((distance-ROAD_SEGMENT_LENGTH*1.5)/TRACK_LENGTH),after=trackSample((distance+ROAD_SEGMENT_LENGTH*1.5)/TRACK_LENGTH);
    const curve=angleDelta(after.heading,before.heading)/3;
    if(i>0){worldX+=dx;dx+=curve*.34}
    const worldY=(hillAt(distance)-hillAt(state.distance))*1.28,z=ROAD_NEAR_Z+i,scale=ROAD_CAMERA_DEPTH/z;
    const y=horizon-scale*(worldY-ROAD_CAMERA_HEIGHT)*h*.5,cx=w*.5+scale*(worldX-cameraX)*w*.5,half=scale*ROAD_WORLD_HALF_WIDTH*w*.5;
    roadProjection.push({rel,z,y,cx,half,scale,worldX,worldY,curve,tangent:dx,heading:sample.heading,relativeHeading:angleDelta(sample.heading,base.heading),visible:true,clipY:maxY});
    if(i>0){const segment=roadProjection[i-1];segment.visible=y<maxY;segment.clipY=maxY;if(segment.visible)maxY=y}
  }
  const far=roadProjection[Math.min(ROAD_SEGMENTS,Math.floor(ROAD_SEGMENTS*.72))];canvas.dataset.roadTurn=far.relativeHeading.toFixed(3);canvas.dataset.roadFarX=far.cx.toFixed(1);canvas.dataset.elevation=hillAt(state.distance).toFixed(3);canvas.dataset.grade=grade.toFixed(3);
  return roadProjection;
}
function roadPoint(rel){
  if(!roadProjection.length)buildRoadProjection();const q=Math.max(0,Math.min(ROAD_SEGMENTS,rel/DRAW_DISTANCE*ROAD_SEGMENTS)),i=Math.floor(q),a=roadProjection[i],b=roadProjection[Math.min(ROAD_SEGMENTS,i+1)],t=q-i;
  return{rel:a.rel+(b.rel-a.rel)*t,y:a.y+(b.y-a.y)*t,half:a.half+(b.half-a.half)*t,cx:a.cx+(b.cx-a.cx)*t,scale:a.scale+(b.scale-a.scale)*t,heading:a.heading,relativeHeading:a.relativeHeading+angleDelta(b.relativeHeading,a.relativeHeading)*t,tangent:a.tangent+(b.tangent-a.tangent)*t,worldX:a.worldX+(b.worldX-a.worldX)*t,visible:a.visible,clipY:a.clipY};
}

function poly(points,color){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fill()}
function drawRoad(){
  const w=innerWidth,current=trackSample(state.progress),theme=activeCourse.theme;canvas.dataset.heading=current.heading.toFixed(3);canvas.dataset.cameraHeading=(Number.isFinite(state.cameraHeading)?state.cameraHeading:current.heading).toFixed(3);
  for(let i=ROAD_SEGMENTS-1;i>=0;i--){
    const r1=i/ROAD_SEGMENTS*DRAW_DISTANCE,p1=roadProjection[i],p2=roadProjection[i+1];
    if(!p1.visible)continue;
    const band=Math.floor((state.distance+r1)/25),alt=band%2===0;
    poly([[0,p1.y],[p1.cx-p1.half*1.13,p1.y],[p2.cx-p2.half*1.13,p2.y],[0,p2.y]],alt?theme.vergeA:theme.vergeB);
    poly([[p1.cx+p1.half*1.13,p1.y],[w,p1.y],[w,p2.y],[p2.cx+p2.half*1.13,p2.y]],alt?theme.vergeA:theme.vergeB);
    poly([[p1.cx-p1.half*1.13,p1.y],[p1.cx-p1.half,p1.y],[p2.cx-p2.half,p2.y],[p2.cx-p2.half*1.13,p2.y]],alt?theme.curbA:theme.curbB);
    poly([[p1.cx+p1.half,p1.y],[p1.cx+p1.half*1.13,p1.y],[p2.cx+p2.half*1.13,p2.y],[p2.cx+p2.half,p2.y]],alt?theme.curbA:theme.curbB);
    poly([[p1.cx-p1.half,p1.y],[p1.cx+p1.half,p1.y],[p2.cx+p2.half,p2.y],[p2.cx-p2.half,p2.y]],alt?theme.roadA:theme.roadB);
    if(band%5<2){for(const lane of [-1/3,1/3]){const a1=p1.half*.011,a2=p2.half*.011;poly([[p1.cx+p1.half*lane-a1,p1.y],[p1.cx+p1.half*lane+a1,p1.y],[p2.cx+p2.half*lane+a2,p2.y],[p2.cx+p2.half*lane-a2,p2.y]],theme.lane)}}
    if(i<38&&band%6<2){for(const lane of [-.72,-.18,.48]){const a1=p1.half*.004,a2=p2.half*.004;poly([[p1.cx+p1.half*lane-a1,p1.y],[p1.cx+p1.half*lane+a1,p1.y],[p2.cx+p2.half*lane+a2,p2.y],[p2.cx+p2.half*lane-a2,p2.y]],'rgba(255,255,255,.11)')}}
    const startLine=activeCourse.startLine??55,lapZ=((state.distance+r1-startLine)%TRACK_LENGTH+TRACK_LENGTH)%TRACK_LENGTH;if(lapZ<30){for(let c=0;c<10;c++){const l1=-1+c*.2,l2=l1+.2;poly([[p1.cx+p1.half*l1,p1.y],[p1.cx+p1.half*l2,p1.y],[p2.cx+p2.half*l2,p2.y],[p2.cx+p2.half*l1,p2.y]],(c+band)%2?'#fff':'#1a153a')}}
  }
}
function drawRoadSurfaceDetails(){
  for(let i=ROAD_SEGMENTS-1;i>=0;i--){const p1=roadProjection[i],p2=roadProjection[i+1];if(!p1.visible)continue;const band=Math.floor((state.distance+p1.rel)/18);if(band%7===0){for(const lane of [-.62,.08,.57]){const width1=Math.max(.35,p1.half*.0035),width2=Math.max(.25,p2.half*.0035);poly([[p1.cx+p1.half*lane-width1,p1.y],[p1.cx+p1.half*lane+width1,p1.y],[p2.cx+p2.half*lane+width2,p2.y],[p2.cx+p2.half*lane-width2,p2.y]],'rgba(255,255,255,.045)')}}if(band%13===2){const lane=Math.sin(band*2.17)*.5,w1=p1.half*.035,w2=p2.half*.035;poly([[p1.cx+p1.half*lane-w1,p1.y],[p1.cx+p1.half*lane+w1,p1.y],[p2.cx+p2.half*lane+w2,p2.y],[p2.cx+p2.half*lane-w2,p2.y]],'rgba(105,226,255,.075)')}}
  const markPhase=95,firstMark=Math.ceil((state.distance+28-markPhase)/260)*260+markPhase;for(let start=firstMark;start<state.distance+DRAW_DISTANCE;start+=260){const lane=Math.sin(start*.017)*.38;for(let d=0;d<78;d+=9){const p1=roadPoint(start+d-state.distance),p2=roadPoint(start+d+10-state.distance);if(!p1.visible)continue;for(const tyre of [-.085,.085]){const x1=p1.cx+p1.half*(lane+tyre),x2=p2.cx+p2.half*(lane+tyre),w1=Math.max(.6,p1.half*.009),w2=Math.max(.45,p2.half*.009);poly([[x1-w1,p1.y],[x1+w1,p1.y],[x2+w2,p2.y],[x2-w2,p2.y]],'rgba(18,17,30,.34)')}}}
  const speed=Math.min(1,state.speed/190);if(speed>.18){ctx.save();ctx.lineCap='round';ctx.strokeStyle=`rgba(174,241,255,${.08+speed*.22})`;for(let i=0;i<20;i++){const rel=22+((i*53-state.distance*(1.2+speed*2.8))%430+430)%430,p1=roadPoint(rel),p2=roadPoint(rel+18+speed*55),lane=((i*37)%100/100-.5)*1.45;if(!p1.visible||!p2.visible)continue;ctx.lineWidth=Math.max(.5,p1.half*.006);ctx.beginPath();ctx.moveTo(p2.cx+p2.half*lane,p2.y);ctx.lineTo(p1.cx+p1.half*lane,p1.y);ctx.stroke()}ctx.restore()}
}
function drawVergeSurfaceDetails(){
  const palettes=[['#fff2a8','#69edff','#ff75bd'],['#e3a75c','#72d9e8','#6c4930'],['#50efff','#ff4ed5','#7869ff'],['#dff8ff','#62c9f4','#bcecff'],['#ffe08a','#ff79ad','#fff6d6']],colors=palettes[state.selectedCourse]||palettes[0];ctx.save();ctx.globalAlpha=.42;
  for(let i=ROAD_SEGMENTS-1;i>=1;i--){const p1=roadProjection[i],p2=roadProjection[i+1];if(!p1.visible)continue;const band=Math.floor((state.distance+p1.rel)/15);if(band%3!==0)continue;for(const side of [-1,1]){const offset=1.22+(Math.abs(band*17)%24)*.01,w1=Math.max(.45,p1.half*(band%9===0?.034:.018)),w2=Math.max(.3,p2.half*(band%9===0?.034:.018)),x1=p1.cx+side*p1.half*offset,x2=p2.cx+side*p2.half*offset;poly([[x1-w1,p1.y],[x1+w1,p1.y],[x2+w2,p2.y],[x2-w2,p2.y]],colors[Math.abs(band+side)%colors.length])}}
  ctx.globalAlpha=.24;for(let z=Math.ceil((state.distance+35)/125)*125;z<state.distance+DRAW_DISTANCE;z+=125){const p=roadPoint(z-state.distance);if(!p.visible)continue;for(const side of [-1,1]){const x=p.cx+side*p.half*1.38,r=Math.max(1.5,p.half*.026);ctx.fillStyle=colors[Math.abs(Math.floor(z/125)+side)%colors.length];ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=Math.max(2,r*.7);ctx.beginPath();ctx.ellipse(x,p.y-r*.18,r*1.8,r*.42,0,0,Math.PI*2);ctx.fill()}}ctx.restore();
}
function trackPhase(distance){return((distance%TRACK_LENGTH)+TRACK_LENGTH)%TRACK_LENGTH}
let tunnelSections=courseData[0].tunnels;
let tunnelClipCount=0;
function tunnelSectionAt(distance){const p=trackPhase(distance);return tunnelSections.find(([start,end])=>p>=start&&p<=end)}
function tunnelAt(distance){return!!tunnelSectionAt(distance)}
function firstTunnelPortalBetween(distance){const from=state.distance+3,to=distance-3;if(to<=from)return null;let portal=null;const firstLap=Math.floor(from/TRACK_LENGTH)-1,lastLap=Math.ceil(to/TRACK_LENGTH)+1;for(let lap=firstLap;lap<=lastLap;lap++){const base=lap*TRACK_LENGTH;for(const section of tunnelSections){for(const edge of section){const boundary=base+edge;if(boundary>from&&boundary<to&&(portal===null||boundary<portal))portal=boundary}}}return portal}
function traceTunnelOpening(p){const half=p.half*1.16,top=p.y-p.half*.98,left=p.cx-half,right=p.cx+half;ctx.beginPath();ctx.moveTo(left,p.y+2);ctx.lineTo(left,top+p.half*.34);ctx.bezierCurveTo(left,top-p.half*.18,right,top-p.half*.18,right,top+p.half*.34);ctx.lineTo(right,p.y+2);ctx.closePath()}
function drawThroughTunnelPortal(distance,draw){const portal=firstTunnelPortalBetween(distance);if(portal===null){draw();return}tunnelClipCount++;const p=roadPoint(portal-state.distance);if(!p.visible)return;ctx.save();traceTunnelOpening(p);ctx.clip();draw();ctx.restore()}
function distanceFadeAlpha(rel,near=520,far=DRAW_DISTANCE*.96){return rel<=near?1:Math.max(0,Math.min(1,(far-rel)/Math.max(1,far-near)))}
function clamp01(v){return Math.max(0,Math.min(1,v))}
function colorAlpha(color,alpha){if(/^#([0-9a-f]{6})$/i.test(color)){const n=parseInt(color.slice(1),16);return`rgba(${n>>16&255},${n>>8&255},${n&255},${alpha})`}return`rgba(244,248,255,${alpha})`}
function sceneryFogAmount(rel){return settings.richScenery?clamp01((rel-185)/520):0}
function sceneryFilter(rel){return 'none'}
function drawFrameHeightFiltered(frame,x,y,height,alpha=1,rotation=0,filter='none'){if(!frame)return;const width=height*frame.sw/frame.sh;ctx.save();ctx.globalAlpha=alpha;ctx.filter=filter;ctx.translate(x,y);ctx.rotate(rotation);ctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,-width/2,-height,width,height);ctx.restore()}
function drawDistanceFog(){
  if(!settings.richScenery)return;
  const h=innerHeight,w=innerWidth,theme=activeCourse.theme,horizon=h*.29;
  ctx.save();ctx.globalCompositeOperation='source-over';
  const fog=ctx.createLinearGradient(0,horizon,0,h*.74);
  fog.addColorStop(0,colorAlpha(theme.lightB,.22));
  fog.addColorStop(.42,'rgba(244,248,255,.13)');
  fog.addColorStop(1,'rgba(244,248,255,0)');
  ctx.fillStyle=fog;ctx.fillRect(0,horizon,w,h*.5);
  ctx.globalAlpha=.18;ctx.fillStyle=theme.vergeB;ctx.fillRect(0,horizon,w,h*.18);
  ctx.restore();
}
function drawTunnelPortalFrame(boundary,emphasis=1){
  const p=roadPoint(boundary-state.distance);if(!p.visible)return;
  const theme=activeCourse.theme,half=p.half*1.2,top=p.y-p.half*1.02,left=p.cx-half,right=p.cx+half;
  ctx.save();ctx.lineCap='round';ctx.strokeStyle='rgba(8,5,24,.94)';ctx.lineWidth=Math.max(5,p.half*.17)*emphasis;ctx.beginPath();ctx.moveTo(left,p.y);ctx.lineTo(left,top+p.half*.34);ctx.bezierCurveTo(left,top-p.half*.2,right,top-p.half*.2,right,top+p.half*.34);ctx.lineTo(right,p.y);ctx.stroke();
  ctx.strokeStyle=theme.curbA;ctx.lineWidth=Math.max(2,p.half*.058)*emphasis;ctx.shadowColor=theme.lightB;ctx.shadowBlur=Math.max(6,p.half*.13);ctx.stroke();
  ctx.strokeStyle=theme.lightA;ctx.lineWidth=Math.max(1,p.half*.02)*emphasis;ctx.globalAlpha=.86;ctx.stroke();ctx.restore();
}
function drawGuardrails(){
  const theme=activeCourse.theme;for(let i=ROAD_SEGMENTS-1;i>=0;i--){const p1=roadProjection[i],p2=roadProjection[i+1],distance=state.distance+(p1.rel+p2.rel)*.5;if(!p1.visible||tunnelAt(distance))continue;const band=Math.floor(distance/35),color=band%2?theme.railA:theme.railB;
    for(const side of [-1,1]){const x1=p1.cx+side*p1.half*1.12,x2=p2.cx+side*p2.half*1.12,h1=Math.max(1.5,p1.half*.105),h2=Math.max(1.2,p2.half*.105);poly([[x1,p1.y-h1],[x1,p1.y-h1*.43],[x2,p2.y-h2*.43],[x2,p2.y-h2]],color);poly([[x1,p1.y-h1],[x1,p1.y-h1*.82],[x2,p2.y-h2*.82],[x2,p2.y-h2]],'rgba(255,255,255,.68)');
      if(i%6===0){ctx.save();ctx.strokeStyle='#743453';ctx.lineWidth=Math.max(1,p1.half*.018);ctx.beginPath();ctx.moveTo(x1,p1.y);ctx.lineTo(x1,p1.y-h1*.88);ctx.stroke();ctx.restore()}}
  }
}
function drawTunnel(){
  const theme=activeCourse.theme;let inside=false,lastPanel=-1;
  const phase=trackPhase(state.distance);
  for(const [start,end] of tunnelSections){for(const boundary of [start,end]){const rel=(boundary-phase+TRACK_LENGTH)%TRACK_LENGTH;if(rel<7||rel>DRAW_DISTANCE)continue;drawTunnelPortalFrame(state.distance+rel,.82)}}
  for(let i=ROAD_SEGMENTS-1;i>=0;i--){const p1=roadProjection[i],p2=roadProjection[i+1],distance=state.distance+(p1.rel+p2.rel)*.5;if(!p1.visible||!tunnelAt(distance))continue;inside=true;const half1=p1.half*1.18,half2=p2.half*1.18,left1=p1.cx-half1,right1=p1.cx+half1,left2=p2.cx-half2,right2=p2.cx+half2,top1=p1.y-p1.half*1.0,top2=p2.y-p2.half*1.0,panel=Math.floor(distance/34),alternate=panel%2===0;
    poly([[left1,p1.y],[left1,top1],[left2,top2],[left2,p2.y]],theme.tunnelSide);poly([[right1,top1],[right1,p1.y],[right2,p2.y],[right2,top2]],theme.tunnelSide2);poly([[left1,top1],[right1,top1],[right2,top2],[left2,top2]],theme.tunnelRoof);
    const depthShade=Math.min(.32,.08+p1.rel/DRAW_DISTANCE*.22);if(alternate){poly([[left1,p1.y],[left1,top1],[left2,top2],[left2,p2.y]],`rgba(255,255,255,${.025+depthShade*.04})`);poly([[right1,top1],[right1,p1.y],[right2,p2.y],[right2,top2]],`rgba(0,0,0,${.06+depthShade})`)}
    for(const side of [-1,1]){const x1=p1.cx+side*p1.half*.98,x2=p2.cx+side*p2.half*.98,edge1=p1.half*.035,edge2=p2.half*.035;poly([[x1-side*edge1,p1.y],[x1+side*edge1,p1.y],[x2+side*edge2,p2.y],[x2-side*edge2,p2.y]],side<0?'rgba(255,255,255,.09)':'rgba(0,0,0,.2)')}
    for(const lane of [-.48,.48]){const x1=p1.cx+p1.half*lane,x2=p2.cx+p2.half*lane,w1=Math.max(.5,p1.half*.012),w2=Math.max(.35,p2.half*.012);poly([[x1-w1,top1],[x1+w1,top1],[x2+w2,top2],[x2-w2,top2]],'rgba(255,255,255,.055)')}
    if(panel!==lastPanel){lastPanel=panel;ctx.save();const color=panel%3===0?theme.lightB:theme.lightA;ctx.strokeStyle=color;ctx.lineWidth=Math.max(1.5,p1.half*.026);ctx.shadowColor=color;ctx.shadowBlur=Math.max(3,p1.half*.07);ctx.globalAlpha=.58;ctx.beginPath();ctx.moveTo(left1,p1.y);ctx.lineTo(left1,top1+p1.half*.34);ctx.bezierCurveTo(left1,top1-p1.half*.18,right1,top1-p1.half*.18,right1,top1+p1.half*.34);ctx.lineTo(right1,p1.y);ctx.stroke();ctx.restore();const poolAlpha=.035+Math.min(.14,p1.scale*.36);poly([[p1.cx-p1.half*.72,p1.y],[p1.cx+p1.half*.72,p1.y],[p2.cx+p2.half*.34,p2.y],[p2.cx-p2.half*.34,p2.y]],`rgba(145,235,255,${poolAlpha})`)}
    if(panel%3===0){const lampW=p1.half*.3,lampH=Math.max(1.5,p1.half*.035);ctx.save();ctx.fillStyle=panel%2?theme.lightA:theme.lightB;ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=Math.max(5,p1.half*.12);ctx.globalAlpha=.9;ctx.fillRect(p1.cx-lampW/2,top1+p1.half*.11,lampW,lampH);ctx.restore()}}
  const section=tunnelSectionAt(state.distance);if(section){const phase=trackPhase(state.distance),edge=Math.max(0,Math.min(1,Math.min((phase-section[0])/42,(section[1]-phase)/42))),shade=ctx.createRadialGradient(innerWidth*.5,innerHeight*.64,innerWidth*.1,innerWidth*.5,innerHeight*.52,innerWidth*.75);shade.addColorStop(0,`rgba(20,10,45,${.06*edge})`);shade.addColorStop(1,`rgba(8,4,25,${.72*edge})`);ctx.fillStyle=shade;ctx.fillRect(0,0,innerWidth,innerHeight);const exitDistance=section[1]-phase;if(exitDistance<78){const p=roadPoint(Math.max(8,exitDistance)),radius=Math.max(45,p.half*1.7),glow=ctx.createRadialGradient(p.cx,p.y-p.half*.28,0,p.cx,p.y-p.half*.28,radius);glow.addColorStop(0,`rgba(255,255,245,${.62*(1-exitDistance/78)})`);glow.addColorStop(.35,`rgba(157,243,255,${.24*(1-exitDistance/78)})`);glow.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=glow;ctx.fillRect(p.cx-radius,p.y-radius,radius*2,radius*2)}}
  canvas.dataset.tunnel=inside?'visible':'none';
}
function drawTunnelForeground(){
  const phase=trackPhase(state.distance);let drawn=0;
  for(const [start] of tunnelSections){const rel=(start-phase+TRACK_LENGTH)%TRACK_LENGTH;if(rel<5||rel>112||tunnelAt(state.distance+4))continue;drawTunnelPortalFrame(state.distance+rel,1.08);drawn++}
  canvas.dataset.tunnelForeground=String(drawn);
}
function drawTracksideDecorations(){
  const propTheme=activeCourse?.propTheme||['sweets','steam','neon','rain','royal'][state.selectedCourse]||'sweets';
  const useLegacyProps=state.selectedCourse<5,propImages=useLegacyProps?(propTheme==='sweets'?[candySignImage,cupcakeTowerImage]:(coursePropImages[propTheme]||[])):[],propHeights=useLegacyProps?(propTheme==='sweets'?[520,720]:coursePropHeights[propTheme]):[];
  const assets=[];for(let i=0;i<Math.max(propImages.length,spectatorSlugs.length);i++){if(propImages[i])assets.push({kind:'prop',image:propImages[i],prop:i,height:propHeights[i],offset:i%3===1?1.66:1.55});if(i<spectatorSlugs.length)assets.push({kind:'spectator',spectator:i,height:610,offset:1.44+i%2*.03})}
  const phase=52+state.selectedCourse*13,spacing=76,first=Math.ceil((state.distance-28-phase)/spacing)*spacing+phase,props=[];for(let z=first;z<state.distance+DRAW_DISTANCE;z+=spacing)props.push(z);
  canvas.dataset.coursePropTheme=propTheme;
  const drawAsset=(asset,z,p,side,size=1)=>{const rel=z-state.distance,height=Math.max(13,Math.min(innerHeight*.38,asset.height*p.scale*size)),rawX=p.cx+side*p.half*(asset.offset+(size<1?.12:0)),x=rel<48?Math.max(-height*.32,Math.min(innerWidth+height*.32,rawX)):rawX;if(x<-height*1.35||x>innerWidth+height*1.35)return;const groundY=p.y+Math.max(2,height*.075),passFade=rel<4?Math.max(0,Math.min(1,(rel+28)/32)):1,farFade=distanceFadeAlpha(rel,430,760),visible=passFade*farFade;if(visible<=.32)return;ctx.save();ctx.globalAlpha=.32;ctx.fillStyle='rgba(18,8,38,.34)';ctx.beginPath();ctx.ellipse(x,groundY,Math.max(5,height*.3),Math.max(2,height*.055),0,0,Math.PI*2);ctx.fill();ctx.restore();if(asset.kind==='spectator'){const viewTurn=Math.max(-3,Math.min(3,Math.round(-side*1.7+p.tangent*5))),frameIndex=viewTurn<=-3?0:viewTurn>=3?6:10+viewTurn,frames=spectatorFrameSets[asset.spectator],frame=frames?.[frameIndex];drawFrameHeight(frame,x,groundY,height,1);canvas.dataset.spectatorFrame=String(frameIndex);canvas.dataset.spectatorCharacter=spectatorSlugs[asset.spectator]}else if(asset.image.complete&&asset.image.naturalWidth){ctx.save();const width=height*asset.image.naturalWidth/Math.max(1,asset.image.naturalHeight);ctx.drawImage(asset.image,x-width*.5,groundY-height,width,height);ctx.restore();canvas.dataset.courseProp=`${propTheme}-${asset.prop}`}};
  for(let i=props.length-1;i>=0;i--){const z=props[i],rel=z-state.distance,p=roadPoint(rel);if(!p.visible||tunnelAt(z))continue;const slot=Math.abs(Math.floor((z-phase)/spacing)),index=slot%assets.length,side=slot%2?1:-1;drawAsset(assets[index],z,p,side,1);if(slot%3===0)drawAsset(assets[(index+3)%assets.length],z+2,p,-side,.78)}
}
function drawDistantScenery(){
  const themed=courseSceneryFrames[state.selectedCourse]||[],fallback=state.selectedCourse===3?forestSceneryFrames:[...candySceneryFrames,...forestSceneryFrames.slice(0,4)],frames=themed.length?themed:fallback;if(!frames.length){canvas.dataset.sceneryCount='0';return}
  const rich=!!settings.richScenery,density=rich?.72:1.18,clarity=rich?1:.72;
  const layerConfigs=[
    {row:0,spacing:168*density,phase:43,offset:1.9,base:1180,scale:.64,alpha:.52*clarity,fadeNear:155,fadeStart:360,fadeEnd:820},
    {row:1,spacing:124*density,phase:71,offset:1.6,base:1040,scale:.8,alpha:.74*clarity,fadeNear:92,fadeStart:340,fadeEnd:780},
    {row:2,spacing:86*density,phase:29,offset:1.34,base:850,scale:.95,alpha:.94,fadeNear:46,fadeStart:310,fadeEnd:720}
  ];
  let drawn=0;
  const frameAt=(row,slot)=>themed.length?frames[row*4+slot%4]:frames[(slot+row*2)%frames.length];
  const drawLayerProp=(frame,p,rel,side,slot,layer)=>{if(!frame)return;const fog=sceneryFogAmount(rel),height=Math.max(8,Math.min(innerHeight*.48,layer.base*p.scale*layer.scale)),x=p.cx+side*p.half*(layer.offset+(slot%3)*.08);if(x<-height*1.15||x>innerWidth+height*1.15)return;const groundY=p.y+Math.max(3,height*.08),passFade=rel<layer.fadeNear?Math.max(0,rel/layer.fadeNear):1,farFade=distanceFadeAlpha(rel,layer.fadeStart,layer.fadeEnd),visibility=passFade*farFade;if(visibility<=.34)return;ctx.save();ctx.globalAlpha=.26;ctx.fillStyle=rich?'rgba(13,9,29,.74)':'rgba(13,9,29,.6)';ctx.beginPath();ctx.ellipse(x,groundY,Math.max(5,height*.33),Math.max(2,height*.052),0,0,Math.PI*2);ctx.fill();ctx.restore();drawFrameHeightFiltered(frame,x,groundY,height,1,0,sceneryFilter(rel));if(rich&&rel<280&&layer.row===2){ctx.save();ctx.globalAlpha=.18;ctx.strokeStyle=activeCourse.theme.lightB;ctx.lineWidth=Math.max(1,height*.012);ctx.shadowColor=activeCourse.theme.lightB;ctx.shadowBlur=Math.max(4,height*.045);ctx.beginPath();ctx.ellipse(x,groundY-height*.42,height*.42,height*.33,0,0,Math.PI*2);ctx.stroke();ctx.restore()}drawn++};
  for(const layer of layerConfigs){const phase=layer.phase+state.selectedCourse*17,first=Math.ceil((state.distance+30-phase)/layer.spacing)*layer.spacing+phase,placements=[];for(let z=first;z<state.distance+DRAW_DISTANCE;z+=layer.spacing)placements.push(z);for(let i=placements.length-1;i>=0;i--){const z=placements[i],rel=z-state.distance,p=roadPoint(rel);if(!p.visible||tunnelAt(z))continue;const slot=Math.abs(Math.floor((z-phase)/layer.spacing)),side=slot%2?1:-1;drawLayerProp(frameAt(layer.row,slot),p,rel,side,slot,layer);if((rich&&slot%2===0)||(!rich&&layer.row>0&&slot%4===0))drawLayerProp(frameAt(layer.row,slot+2),p,rel,-side,slot,{...layer,scale:layer.scale*(rich?0.64:0.58),offset:layer.offset+(rich?0.22:0.18),alpha:layer.alpha*(rich?0.68:0.52)})}}
  canvas.dataset.sceneryCount=String(drawn);canvas.dataset.sceneryLayers=themed.length?'course-atlas':'fallback';
}
function drawVergeDetails(){
  const theme=activeCourse.theme,spacing=38,first=Math.ceil((state.distance+18)/spacing)*spacing,details=[];for(let z=first;z<state.distance+DRAW_DISTANCE;z+=spacing)details.push(z);
  for(let i=details.length-1;i>=0;i--){const z=details[i],rel=z-state.distance,p=roadPoint(rel);if(!p.visible||tunnelAt(z))continue;const slot=Math.abs(Math.floor(z/spacing)),s=Math.max(.22,Math.min(1.15,p.scale*1.55)),alpha=Math.min(.9,.18+p.scale*3.2)*distanceFadeAlpha(rel,420,730);if(alpha<=.02)continue;for(const side of [-1,1]){const offset=1.29+(slot%4)*.075,x=p.cx+side*p.half*offset,y=p.y,size=15*s;if(x<-80||x>innerWidth+80)continue;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.strokeStyle=slot%2?theme.lightA:theme.lightB;ctx.fillStyle=slot%3?theme.accent:theme.curbA;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=6*s;ctx.lineWidth=Math.max(1,2.2*s);if(state.selectedCourse===0){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-35*s);ctx.stroke();ctx.beginPath();ctx.arc(0,-43*s,10*s,0,Math.PI*2);ctx.fill();ctx.stroke()}else if(state.selectedCourse===1){ctx.beginPath();ctx.moveTo(-7*s,0);ctx.lineTo(-7*s,-28*s);ctx.quadraticCurveTo(0,-38*s,9*s,-28*s);ctx.lineTo(9*s,0);ctx.stroke();ctx.beginPath();ctx.arc(1*s,-32*s,7*s,0,Math.PI*2);ctx.stroke()}else if(state.selectedCourse===2){ctx.fillRect(-3*s,-42*s,6*s,42*s);ctx.beginPath();ctx.moveTo(-13*s,-35*s);ctx.lineTo(0,-51*s);ctx.lineTo(13*s,-35*s);ctx.closePath();ctx.stroke()}else if(state.selectedCourse===3){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-34*s);ctx.stroke();ctx.beginPath();ctx.arc(0,-35*s,15*s,Math.PI,Math.PI*2);ctx.lineTo(15*s,-35*s);ctx.quadraticCurveTo(8*s,-28*s,0,-35*s);ctx.quadraticCurveTo(-8*s,-28*s,-15*s,-35*s);ctx.fill()}else{ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-45*s);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-44*s);ctx.lineTo(side*22*s,-37*s);ctx.lineTo(0,-29*s);ctx.closePath();ctx.fill()}ctx.globalAlpha*=.38;ctx.fillStyle=theme.vergeB;ctx.beginPath();ctx.ellipse(0,1,size*1.4,size*.32,0,0,Math.PI*2);ctx.fill();ctx.restore()}}
}
function drawStartArch(){
  const line=activeCourse.startLine??55,arches=[],firstLap=Math.floor((state.distance-line)/TRACK_LENGTH);for(let lap=firstLap;lap<=firstLap+2;lap++){const z=lap*TRACK_LENGTH+line,rel=z-state.distance;if(rel>6&&rel<DRAW_DISTANCE)arches.push({z,rel})}
  const theme=activeCourse.theme;arches.sort((a,b)=>b.rel-a.rel);for(const arch of arches){const p=roadPoint(arch.rel);if(!p.visible)continue;const half=p.half*1.18,height=p.half*.83,left=p.cx-half,right=p.cx+half,top=p.y-height,pillar=Math.max(3,p.half*.11);ctx.save();ctx.shadowColor=theme.lightB;ctx.shadowBlur=Math.max(5,p.half*.11);ctx.strokeStyle=theme.curbA;ctx.lineWidth=pillar;ctx.beginPath();ctx.moveTo(left,p.y);ctx.lineTo(left,top+height*.22);ctx.quadraticCurveTo(p.cx,top-height*.18,right,top+height*.22);ctx.lineTo(right,p.y);ctx.stroke();ctx.shadowColor=theme.lightA;ctx.strokeStyle=theme.curbB;ctx.lineWidth=Math.max(2,pillar*.45);ctx.stroke();const bannerW=half*1.26,bannerH=Math.max(10,height*.24);ctx.fillStyle='#16112f';ctx.strokeStyle=theme.curbA;ctx.lineWidth=Math.max(1,pillar*.22);ctx.beginPath();ctx.roundRect(p.cx-bannerW/2,top+height*.12,bannerW,bannerH,bannerH*.28);ctx.fill();ctx.stroke();ctx.fillStyle=theme.lightB;ctx.font=`900 ${Math.max(8,Math.min(30,p.half*.16))}px Fredoka`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(activeCourse.short,p.cx,top+height*.12+bannerH*.52);ctx.restore()}
}
function drawMode7Texture(){
  const h=innerHeight,horizon=h*(.30-Math.min(1,state.speed/220)*.018);ctx.save();const glow=ctx.createLinearGradient(0,horizon,0,horizon+120);glow.addColorStop(0,'rgba(94,220,255,.13)');glow.addColorStop(1,'rgba(94,220,255,0)');ctx.fillStyle=glow;ctx.fillRect(0,horizon,innerWidth,120);
  ctx.globalAlpha=.72;for(let z=Math.ceil((state.distance+100)/240)*240;z<state.distance+DRAW_DISTANCE;z+=240){const p=roadPoint(z-state.distance);if(!p.visible)continue;const before=trackSample((z-60)/TRACK_LENGTH).heading,after=trackSample((z+60)/TRACK_LENGTH).heading,dir=Math.sign(angleDelta(after,before))||1,x=p.cx+p.half*(dir>0?.72:-.72),s=Math.max(.28,p.scale);ctx.save();ctx.translate(x,p.y-8*s);ctx.scale(dir,1);ctx.fillStyle=activeCourse.theme.accent;ctx.shadowColor='#fff';ctx.shadowBlur=8*s;ctx.beginPath();ctx.moveTo(-26*s,-10*s);ctx.lineTo(4*s,-10*s);ctx.lineTo(4*s,-21*s);ctx.lineTo(30*s,0);ctx.lineTo(4*s,21*s);ctx.lineTo(4*s,10*s);ctx.lineTo(-26*s,10*s);ctx.closePath();ctx.fill();ctx.restore()}
  ctx.restore();
}
function drawTrackside(){
  const theme=activeCourse.theme,first=Math.ceil((state.distance+80)/170)*170,posts=[];for(let z=first;z<state.distance+DRAW_DISTANCE;z+=170)posts.push(z);
  for(let i=posts.length-1;i>=0;i--){const z=posts[i],rel=z-state.distance,p=roadPoint(rel);if(!p.visible||tunnelAt(z))continue;const s=p.scale,alpha=(.3+s*.7)*distanceFadeAlpha(rel,420,750);if(alpha<=.02)continue;const xL=p.cx-p.half*1.24,xR=p.cx+p.half*1.24;for(const x of [xL,xR]){ctx.save();ctx.translate(x,p.y);ctx.globalAlpha=alpha;ctx.strokeStyle=z%340===0?theme.railA:theme.railB;ctx.lineWidth=Math.max(2,8*s);ctx.shadowColor=theme.lightA;ctx.shadowBlur=8*s;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-82*s);ctx.stroke();ctx.fillStyle=[theme.lightA,theme.lightB,theme.accent][Math.abs(Math.floor(z/170))%3];ctx.strokeStyle=theme.curbA;ctx.lineWidth=Math.max(1,3*s);ctx.beginPath();ctx.arc(0,-91*s,15*s,0,7);ctx.fill();ctx.stroke();ctx.restore()}}
}
function drawGates(){
  const theme=activeCourse.theme,gates=[];for(let z=Math.ceil((state.distance+110)/430)*430;z<state.distance+DRAW_DISTANCE;z+=430)gates.push(z);
  for(let i=gates.length-1;i>=0;i--){const rel=gates[i]-state.distance,p=roadPoint(rel);if(!p.visible||tunnelAt(gates[i]))continue;const s=p.scale,alpha=(.28+s*.72)*distanceFadeAlpha(rel,460,790);if(alpha<=.02)continue;const left=p.cx-p.half*1.12,right=p.cx+p.half*1.12,top=p.y-155*s;ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=gates[i]%860===0?theme.lightA:theme.lightB;ctx.lineWidth=Math.max(2,9*s);ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=18*s;ctx.beginPath();ctx.moveTo(left,p.y);ctx.lineTo(left,top+32*s);ctx.quadraticCurveTo(p.cx,top-65*s,right,top+32*s);ctx.lineTo(right,p.y);ctx.stroke();ctx.fillStyle=theme.accent;for(let k=-2;k<=2;k++){ctx.beginPath();ctx.arc(p.cx+k*45*s,top-18*s+Math.abs(k)*8*s,6*s,0,7);ctx.fill()}ctx.restore()}
}
function drawRoadMotion(){
  if(state.speed<45)return;const power=Math.min(1,(state.speed-40)/145),cycle=690,travel=state.distance*(1.45+power*2.8);ctx.save();ctx.lineCap='round';ctx.globalCompositeOperation='screen';
  for(let i=0;i<26;i++){const rel=18+((i*79-travel)%cycle+cycle)%cycle,lane=((i*47)%101/100-.5)*1.56,length=22+power*72,pNear=roadPoint(rel),pMid=roadPoint(rel+length*.52),pFar=roadPoint(rel+length);if(!pNear.visible||!pMid.visible||!pFar.visible)continue;const xNear=pNear.cx+pNear.half*lane,xMid=pMid.cx+pMid.half*lane,xFar=pFar.cx+pFar.half*lane,gradient=ctx.createLinearGradient(xFar,pFar.y,xNear,pNear.y);gradient.addColorStop(0,'rgba(180,246,255,0)');gradient.addColorStop(.45,`rgba(180,246,255,${.08+power*.14})`);gradient.addColorStop(1,`rgba(255,255,255,${.13+power*.28})`);ctx.strokeStyle=gradient;ctx.lineWidth=Math.max(.55,Math.min(4.2,pNear.half*(.0038+power*.0038)));ctx.beginPath();ctx.moveTo(xFar,pFar.y);ctx.quadraticCurveTo(xMid,pMid.y,xNear,pNear.y);ctx.stroke()}
  ctx.restore();canvas.dataset.speedFlow='road-projected';
}

function drawFrame(frame,x,y,width,alpha=1,rotation=0){if(!frame)return;const height=width*frame.sh/frame.sw;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(rotation);ctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,-width/2,-height,width,height);ctx.restore()}
function drawFrameCentered(frame,x,y,width,alpha=1,rotation=0){if(!frame)return;const height=width*frame.sh/frame.sw;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(rotation);ctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,-width/2,-height/2,width,height);ctx.restore()}
function drawFrameHeight(frame,x,y,height,alpha=1,rotation=0){if(!frame)return;const width=height*frame.sw/frame.sh;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(rotation);ctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,-width/2,-height,width,height);ctx.restore()}
function drawKartShadow(x,y,w,alpha=.32){ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='#050310';ctx.beginPath();ctx.ellipse(x,y-3,w,.24*w,0,0,7);ctx.fill();ctx.restore()}
function drawOpponentTag(x,y,r,rank){const text=`${rank}  ${r.name}`;ctx.save();ctx.font="900 12px 'Noto Sans JP'";const width=Math.max(60,ctx.measureText(text).width+18);ctx.fillStyle='rgba(10,8,32,.82)';ctx.strokeStyle=r.color;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x-width/2,y-18,width,25,12);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,x,y-5);ctx.restore()}
function courseCamera(){
  const iw=courseMapImage.naturalWidth||1254,ih=courseMapImage.naturalHeight||1254,s=trackSample(state.progress),zoom=1.88+Math.min(1,state.speed/210)*.18,cameraHeading=Number.isFinite(state.cameraHeading)?state.cameraHeading:s.heading;
  return{...s,iw,ih,wx:s.x*iw,wy:s.y*ih,zoom,ys:.70,screenX:innerWidth*.5,screenY:innerHeight*.86,cameraHeading,rotation:-cameraHeading-Math.PI/2,roadHalf:50};
}
function drawCourseWorld(){
  const c=courseCamera(),w=innerWidth,h=innerHeight;canvas.dataset.trackX=c.x.toFixed(3);canvas.dataset.trackY=c.y.toFixed(3);canvas.dataset.heading=c.heading.toFixed(3);canvas.dataset.cameraHeading=c.cameraHeading.toFixed(3);
  if(!courseMapImage.complete||!courseMapImage.naturalWidth)return c;
  ctx.save();ctx.translate(c.screenX,c.screenY);ctx.scale(c.zoom,c.zoom*c.ys);ctx.rotate(c.rotation);ctx.translate(-c.wx,-c.wy);
  ctx.fillStyle='rgba(12,7,39,.82)';ctx.fillRect(-c.iw,-c.ih,c.iw*3,c.ih*3);
  ctx.save();ctx.globalAlpha=.16;ctx.strokeStyle='#7759d8';ctx.lineWidth=.45;for(let x=-c.iw;x<c.iw*2;x+=55){ctx.beginPath();ctx.moveTo(x,-c.ih);ctx.lineTo(x,c.ih*2);ctx.stroke()}for(let y=-c.ih;y<c.ih*2;y+=55){ctx.beginPath();ctx.moveTo(-c.iw,y);ctx.lineTo(c.iw*2,y);ctx.stroke()}ctx.restore();
  ctx.shadowColor='#5deaff';ctx.shadowBlur=13;ctx.drawImage(courseMapImage,0,0,c.iw,c.ih);ctx.restore();
  const fade=ctx.createLinearGradient(0,0,0,h);fade.addColorStop(0,'rgba(7,5,29,.46)');fade.addColorStop(.24,'rgba(7,5,29,.06)');fade.addColorStop(1,'rgba(4,2,20,.08)');ctx.fillStyle=fade;ctx.fillRect(0,0,w,h);
  return c;
}
function projectTrackEntity(distance,lane=0){
  const rel=distance-state.distance,depth=Math.max(4,8+rel),p=roadPoint(depth),s=trackSample(distance/TRACK_LENGTH),base=trackSample(state.progress);
  return{x:p.cx+p.half*lane*.78,y:p.y,half:p.half,heading:s.heading,cameraHeading:base.heading,relativeHeading:p.relativeHeading,tangent:p.tangent,scale:Math.max(.11,Math.min(1.02,p.scale*1.28)),visible:p.visible};
}
function drawCourseLimits(){
  const danger=Math.max(0,Math.min(1,(Math.abs(state.x)-.68)/.34)),nearSide=Math.sign(state.x)||1,distances=[35,80,145,230,340,500,690];ctx.save();ctx.lineCap='round';ctx.setLineDash([]);
  for(const side of [-1,1]){const points=distances.map(d=>{const p=roadPoint(d);return{x:p.cx+p.half*side*1.01,y:p.y}});ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));const hot=danger>0&&side===nearSide;ctx.strokeStyle=hot?`rgba(255,55,125,${.68+danger*.3})`:'rgba(255,250,241,.76)';ctx.lineWidth=hot?5:3;ctx.shadowColor=hot?'#ff397d':'#7b294e';ctx.shadowBlur=hot?18:7;ctx.stroke()}
  ctx.setLineDash([]);if(danger>.12){const p=roadPoint(120);ctx.globalAlpha=.45+danger*.5;ctx.fillStyle='#ff66bd';ctx.font="900 13px 'Noto Sans JP'";ctx.textAlign='center';ctx.fillText('COURSE EDGE',p.cx+nearSide*p.half*.78,p.y-20)}ctx.restore();
}
function jumpRampFrameFor(p,ramp){
  if(!jumpRampFrames.length)return null;
  const row=Math.max(0,Math.min(JUMP_RAMP_ROWS-1,activeCourse?.rampRow??state.selectedCourse));
  const rel=ramp.z-state.distance,before=roadPoint(Math.max(2,rel-38)),after=roadPoint(Math.min(DRAW_DISTANCE,rel+62));
  const beforeX=before.cx+before.half*ramp.lane*.78,afterX=after.cx+after.half*ramp.lane*.78,dx=afterX-beforeX,dy=Math.max(18,Math.abs(after.y-before.y));
  const localCurve=angleDelta(trackSample((ramp.z+52)/TRACK_LENGTH).heading,trackSample((ramp.z-52)/TRACK_LENGTH).heading);
  const score=-Math.max(-1,Math.min(1,dx/(dy*5+p.half*5)+localCurve*.04));
  const col=score<-0.88?0:score<-0.44?1:score<-0.16?2:score<0.16?3:score<0.44?4:score<0.88?5:6;
  return{frame:jumpRampFrames[row*JUMP_RAMP_COLS+col]||jumpRampFrames[row*JUMP_RAMP_COLS+3],row,col,score,dx,dy,localCurve};
}
function drawJumpRamps(){
  const ramps=state.objects.filter(o=>o.type==='ramp'&&o.z-state.distance>-18&&o.z-state.distance<DRAW_DISTANCE).sort((a,b)=>b.z-a.z);
  for(const ramp of ramps){const p=projectTrackEntity(ramp.z,ramp.lane),picked=jumpRampFrameFor(p,ramp),frame=picked?.frame;if(!p.visible||!frame)continue;const rel=ramp.z-state.distance,fade=distanceFadeAlpha(rel,520,790);if(fade<=.02)continue;const height=Math.max(6,Math.min(innerHeight*.32,p.half*.58)),width=height*frame.sw/frame.sh,groundY=p.y+Math.max(2,height*.035),tilt=Math.max(-.035,Math.min(.035,picked.score*.018));drawThroughTunnelPortal(ramp.z,()=>{drawKartShadow(p.x,groundY+3,Math.max(4,width*.36),.28*fade);drawFrameHeight(frame,p.x,groundY+4,height,fade,tilt)});canvas.dataset.jumpRampFrame=`${picked.row}:${picked.col}`;canvas.dataset.jumpRampAngleScore=picked.score.toFixed(3);canvas.dataset.jumpRampVector=`${picked.dx.toFixed(1)},${picked.dy.toFixed(1)},${picked.localCurve.toFixed(3)}`;canvas.dataset.jumpRampSize=height.toFixed(1)}
}
function drawObjects(){
  const visible=state.objects.filter(o=>o.type!=='ramp'&&!o.taken&&o.z-state.distance>-18&&o.z-state.distance<760).sort((a,b)=>b.z-a.z);
  for(const o of visible){const p=projectTrackEntity(o.z,o.lane);if(p.x<-100||p.x>innerWidth+100||p.y<-100||p.y>innerHeight+80)continue;let frame,width;
    if(!p.visible)continue;if(o.type==='coin'){frame=itemFrames[4];width=58*p.scale}else if(o.type==='item'){frame=itemFrames[6];width=86*p.scale}else{frame=itemFrames[7];width=98*p.scale}
    const rel=o.z-state.distance,alpha=distanceFadeAlpha(rel,500,735);if(alpha<=.02)continue;const bob=Math.sin(state.elapsed*.005+o.z*30)*5*p.scale;drawThroughTunnelPortal(o.z,()=>drawFrame(frame,p.x,p.y+bob,width,alpha,o.type==='coin'?Math.sin(state.elapsed*.004)*.15:0));
  }
}
function drawCollectFx(){
  for(const f of state.collectFx){const r=racers[f.targetIndex],targetRel=r.distance-state.distance;if(f.targetIndex!==state.selected&&(targetRel<-20||targetRel>DRAW_DISTANCE))continue;const start=projectTrackEntity(f.z,f.lane),target=f.targetIndex===state.selected?{x:innerWidth*.5,y:Math.min(innerHeight*.9,roadPoint(2.5).y)+state.suspension,scale:1}:projectTrackEntity(r.distance,r.lane);if(!target||!Number.isFinite(target.x))continue;const t=1-f.life/f.max,ease=1-Math.pow(1-t,3),arc=Math.sin(t*Math.PI)*Math.min(80,Math.abs(target.x-start.x)*.18+34),x=start.x+(target.x-start.x)*ease,y=start.y+(target.y-start.y)*ease-arc,frame=f.type==='coin'?itemFrames[4]:f.type==='item'?itemFrames[6]:itemFrames[7],size=(f.type==='coin'?58:82)*(1-t*.45)*Math.max(.45,start.scale);drawThroughTunnelPortal(f.z,()=>{ctx.save();ctx.strokeStyle=f.type==='coin'?'rgba(255,224,76,.7)':f.type==='item'?'rgba(111,239,255,.72)':'rgba(255,91,195,.72)';ctx.lineWidth=Math.max(2,size*.08);ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(start.x,start.y);ctx.quadraticCurveTo((start.x+target.x)/2,(start.y+target.y)/2-arc*1.35,x,y);ctx.stroke();ctx.restore();drawFrame(frame,x,y,size,Math.min(1,f.life/.12),t*6);
    if(t>.42){const label=`${r.name}  ${f.label}`;ctx.save();ctx.globalAlpha=Math.min(1,(t-.42)*3)*(f.life/.22<1?f.life/.22:1);ctx.font="900 12px 'Noto Sans JP'";const width=Math.max(78,ctx.measureText(label).width+20),ly=target.y-112*Math.max(.45,target.scale||1);ctx.fillStyle='rgba(12,8,35,.88)';ctx.strokeStyle=r.color;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(target.x-width/2,ly-16,width,25,12);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,target.x,ly-3);ctx.restore()}})}
}
function drawOpponents(){
  const order=[...racers].sort((a,b)=>b.distance-a.distance),visible=racers.map((r,i)=>({r,i,rel:r.distance-state.distance,rank:order.indexOf(r)+1})).filter(o=>o.i!==state.selected&&o.rel>-8&&o.rel<480).sort((a,b)=>b.rel-a.rel);
  for(const o of visible){const side=o.rel<0?(o.i%2?.1:-.1):0,p=projectTrackEntity(o.r.distance,o.r.lane+side);if(!p.visible||p.x<-160||p.x>innerWidth+160||p.y<-180||p.y>innerHeight+120)continue;const alpha=distanceFadeAlpha(o.rel,330,470);if(alpha<=.02)continue;const laneTurn=(o.r.aiTargetLane-o.r.lane)*2.5,turn=Math.max(-3,Math.min(3,Math.round(p.tangent*9+laneTurn))),col=3+turn,frame=o.r.frames?.[col];
    const height=Math.max(24,Math.min(178,166*p.scale)),jump=(o.r.jumpY||0)*Math.max(.45,p.scale),spriteY=p.y+6-jump;drawThroughTunnelPortal(o.r.distance,()=>{drawKartShadow(p.x,p.y,Math.max(9,height*.38)*(1-Math.min(.24,jump/180)),Math.max(.08,.16+p.scale*.18-jump*.0015)*alpha);drawFrameHeight(frame,p.x,spriteY,height,(o.r.hit>0?.62:1)*alpha,(o.r.spin>0?Math.sin(state.elapsed*.025)*.25:turn*.025));if(o.rel<300&&height>44&&alpha>.28)drawOpponentTag(p.x,spriteY-height-9,o.r,o.rank)});
  }
}
function drawProjectiles(){for(const shot of state.projectiles){const rel=shot.z-state.distance;if(rel<-12||rel>650)continue;const p=projectTrackEntity(shot.z,shot.lane),alpha=distanceFadeAlpha(rel,420,630);if(p.visible&&alpha>.02)drawThroughTunnelPortal(shot.z,()=>drawFrame(itemFrames[1],p.x,p.y,62*p.scale,alpha,-.25))}}
function drawPlayer(){
  const r=racers[state.selected],hard=state.drift>.4?2:Math.abs(state.steer)>.78?3:2,col=Math.max(0,Math.min(6,3+Math.round(state.steer*hard))),frame=r.frames?.[col];
  canvas.dataset.player=r.slug;canvas.dataset.frame=String(col);canvas.dataset.speed=String(Math.round(state.speed));canvas.dataset.distance=state.distance.toFixed(1);canvas.dataset.drift=String(state.driftLevel);canvas.dataset.centrifugal=state.centrifugal.toFixed(3);canvas.dataset.jump=state.jumpY.toFixed(1);canvas.dataset.airborne=String(state.airborne);
  const base=roadPoint(2.5),x=innerWidth*.5+state.steer*18+(Math.random()-.5)*state.shake,groundY=Math.min(innerHeight*.9,base.y)+state.suspension+(Math.random()-.5)*state.shake,y=groundY-state.jumpY,bob=Math.sin(state.elapsed*(.012+state.speed*.00008))*(1.2+state.speed*.008),squash=1-Math.min(.055,Math.abs(state.suspension)*.0035),height=Math.min(innerHeight*.29,218)*squash,jumpScale=1-Math.min(.23,state.jumpY/190);
  drawKartShadow(x,groundY-state.suspension*.45,Math.min(92,height*.4)*jumpScale,Math.max(.12,.42-Math.min(.2,state.jumpY*.003)));if(state.boosting||state.invincible>0){const v=vfxFrames[state.invincible>0?4:1],effectY=state.invincible>0?y-height*.46:y-height*.12;drawFrameCentered(v,x,effectY,state.invincible>0?218:176,state.invincible>0?.68:.86,state.invincible>0?0:Math.PI)}
  drawFrameHeight(frame,x,y+bob,height,1,-state.steer*(state.drift>0?.085:.04)+state.centrifugal*.018);
  if(state.shield>0){ctx.save();ctx.strokeStyle='#77efff';ctx.lineWidth=5;ctx.globalAlpha=.5+.25*Math.sin(state.elapsed*.01);ctx.shadowColor='#46eaff';ctx.shadowBlur=25;ctx.beginPath();ctx.ellipse(x,y-height*.42,Math.min(innerWidth*.15,165),height*.46,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
}
function drawParticles(layer='front'){for(const p of state.particles){if((p.layer||'front')!==layer)continue;const a=Math.max(0,p.life/p.max);if(p.fxFrame!==undefined&&drivingFxFrames[p.fxFrame]){drawFrame(drivingFxFrames[p.fxFrame],p.x,p.y,p.size*(1+(1-a)*.28),Math.min(1,a*1.25),p.rot)}else if(p.kind==='burst'&&particleBurstFrames[p.burstFrame]){drawFrameCentered(particleBurstFrames[p.burstFrame],p.x,p.y,p.size*(1+(1-a)*.42),Math.min(1,a*1.45),p.rot)}else if(p.kind==='dot'){const fallback=particleBurstFrames[burstFrameForColor(p.color)];if(fallback)drawFrameCentered(fallback,p.x,p.y,p.size*8,Math.min(1,a*1.2),p.rot);else{ctx.save();ctx.globalAlpha=a;ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=9;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,7);ctx.fill();ctx.restore()}}else if(p.kind==='smoke'){ctx.save();ctx.globalAlpha=a*.5;ctx.fillStyle=p.color;ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.scale(1.18+(1-a)*.8,.82+(1-a)*.45);ctx.beginPath();ctx.arc(0,0,p.size*(1+(1-a)*1.35),0,7);ctx.fill();ctx.globalAlpha*=.38;ctx.beginPath();ctx.arc(-p.size*.55,-p.size*.2,p.size*.72,0,7);ctx.arc(p.size*.58,-p.size*.08,p.size*.62,0,7);ctx.fill();ctx.restore()}else if(p.kind==='dust'){ctx.save();ctx.globalAlpha=a*.72;ctx.fillStyle=p.color;ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.scale(1.7-a*.45,.7+a*.25);ctx.beginPath();ctx.arc(0,0,p.size*(1+(1-a)*.95),0,7);ctx.fill();ctx.restore()}else if(p.kind==='exhaust'){ctx.save();ctx.globalAlpha=a;ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=18;ctx.translate(p.x,p.y);ctx.rotate(Math.PI*.25);ctx.fillRect(-p.size*a,-p.size*a,p.size*a*2,p.size*a*2.5);ctx.restore()}else if(p.kind==='spark'){ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=12;ctx.lineWidth=p.size;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*.05,p.y-p.vy*.05);ctx.stroke();ctx.restore()}else{const frame=vfxFrames[p.index];if(p.center)drawFrameCentered(frame,p.x,p.y,p.size,a,p.rot);else drawFrame(frame,p.x,p.y,p.size,a,p.rot)}}}
function drawRace(){
  const roll=state.drift>0?-state.steer*.008:0,bob=Math.sin(state.elapsed*.012)*Math.min(1.5,state.speed/135)-state.suspension*.28;roadProjection=[];tunnelClipCount=0;buildRoadProjection();canvas.dataset.course=activeCourse.short;canvas.dataset.bgm=raceBgm?(raceBgm.paused?`paused:${musicError||'waiting'}`:'playing'):'none';canvas.dataset.taken=String(state.objects.filter(o=>o.taken).length);canvas.dataset.collectFx=String(state.collectFx.length);canvas.dataset.suspension=state.suspension.toFixed(2);canvas.dataset.nextTunnelPortal=String(firstTunnelPortalBetween(state.distance+DRAW_DISTANCE)??'none');
  ctx.save();ctx.translate(innerWidth/2,innerHeight/2+bob);ctx.rotate(roll);ctx.translate(-innerWidth/2,-innerHeight/2);ctx.translate((Math.random()-.5)*state.shake,(Math.random()-.5)*state.shake);drawBackdrop();drawRoad();drawVergeSurfaceDetails();drawRoadSurfaceDetails();drawRoadMotion();drawMode7Texture();drawGuardrails();drawDistantScenery();drawVergeDetails();drawTracksideDecorations();drawTrackside();drawGates();drawStartArch();drawDistanceFog();drawTunnel();if(state.debug.showCourseLimits)drawCourseLimits();drawJumpRamps();drawObjects();drawProjectiles();drawOpponents();drawCollectFx();drawTunnelForeground();ctx.restore();canvas.dataset.tunnelOcclusion=String(tunnelClipCount);drawParticles('back');drawPlayer();drawParticles('front');if(state.flash>0){ctx.fillStyle=`rgba(255,255,255,${state.flash*.65})`;ctx.fillRect(0,0,innerWidth,innerHeight)}
}
// Every cat sheet was verified against this shared layout: rear arc (0..6),
// then front arc (7..13). The two side views are duplicated at row boundaries,
// so the turntable follows the twelve unique yaw angles without a visual jump.
const RACER_TURN_STEPS=[
  {frame:3,yaw:180},{frame:4,yaw:160},{frame:5,yaw:135},{frame:6,yaw:90},
  {frame:12,yaw:45},{frame:11,yaw:20},{frame:10,yaw:0},{frame:9,yaw:-20},
  {frame:8,yaw:-45},{frame:7,yaw:-90},{frame:1,yaw:-135},{frame:2,yaw:-160}
];
function turntableState(t){const phase=(t/500)%RACER_TURN_STEPS.length,index=Math.floor(phase),raw=phase-index,blend=raw*raw*(3-2*raw),a=RACER_TURN_STEPS[index],b=RACER_TURN_STEPS[(index+1)%RACER_TURN_STEPS.length];return{a:a.frame,b:b.frame,yaw:a.yaw+angleDelta(b.yaw*Math.PI/180,a.yaw*Math.PI/180)*180/Math.PI*blend,blend}}
function drawTurnFrame(pctx,preview,frame,alpha){if(!frame||alpha<=.001)return;const scale=Math.min(preview.width/frame.sw,preview.height/frame.sh)*1.06,dw=frame.sw*scale,dh=frame.sh*scale;pctx.globalAlpha=alpha;pctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,(preview.width-dw)/2,preview.height-dh-5,dw,dh)}
function drawMenu(t){coverImage(environment,Math.sin(t*.00015)*.5,environmentCrop);ctx.fillStyle=state.mode==='course'?'rgba(6,4,25,.48)':'rgba(9,4,36,.42)';ctx.fillRect(0,0,innerWidth,innerHeight)}
function render(t){ctx.clearRect(0,0,innerWidth,innerHeight);if(state.mode==='race')drawRace();else drawMenu(t)}
function loop(t){const dt=Math.min(.033,(t-(state.last||t))/1000);state.last=t;pollGamepad();update(dt);render(t);requestAnimationFrame(loop)}
requestAnimationFrame(loop);

let setRankAnimationTimer=null;
function playSetRankAnimation(meta){
  const current=$('setRank'),next=current.cloneNode(false);
  clearTimeout(setRankAnimationTimer);
  next.id='setRank';next.textContent=meta.rank;next.className=`rank-badge rank-${meta.rank.toLowerCase()} rank-animating`;
  current.replaceWith(next);
  setRankAnimationTimer=setTimeout(()=>next.classList.remove('rank-animating'),980);
}
