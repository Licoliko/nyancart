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

const RACER_HERO_PRESENTATION={
  'aruka-sham':{scale:1.085,y:0},'garnet-bengal':{scale:1.091,y:0},
  'kohaku-taiga':{scale:.929,y:0},'yukine-silky':{scale:.934,y:0},
  'rhythm-sphynx':{scale:.911,y:0},'reska-americancurl':{scale:.914,y:0},
  'cleo-mau':{scale:.895,y:0},'sucre-persian':{scale:.9,y:0}
};
const racers = racerData.map((r,i)=>{const hero=`assets/select-heroes/${r[2]}.webp`;return{
  name:r[0],portrait:i<12?`assets/portraits/${r[2]}.webp`:hero,slug:r[2],color:r[3],
  hero,heroPresentation:RACER_HERO_PRESENTATION[r[2]]||{scale:1,y:0},set:racerSetData[i],progress:0,lane:((i%5)-2)*.31,pace:.034+(i%6)*.0007
}});

// Each set gets a readable specialty from its strongest stat.  The same data
// is also used by the handling code below, so this is not merely menu copy.
const TRAIT_COPY={
  speed:['STRAIGHT ACE','最高速が伸びる直線番長。長いストレートでじわじわ引き離す。'],
  accel:['QUICK LAUNCH','加速の立ち上がりが鋭い。減速や着地からの復帰が得意。'],
  handling:['DRIFT ARTIST','曲がりながら速度を保つドリフト巧者。外へ流されにくい。'],
  boost:['NITRO CAT','ブーストが濃く長い。加速床・ミニターボを最大限に活かす。'],
  technique:['ITEM TACTICIAN','アイテムと悪路の扱いが上手い、安定感のあるテクニシャン。']
};
function buildRacerTrait(racer){
  const stats=racer.set.stats,keys=Object.keys(stats).sort((a,b)=>stats[b]-stats[a]);
  const primary=keys[0],secondary=keys[1],strength=Math.max(0,stats[primary]-72);
  const bonus=.018+strength*.0014;
  return{
    key:primary,secondary,value:stats[primary],label:TRAIT_COPY[primary][0],copy:TRAIT_COPY[primary][1],
    topSpeed:primary==='speed'?1+bonus:1,
    acceleration:primary==='accel'?1+bonus*1.8:1,
    curveGrip:primary==='handling'?1+bonus*1.35:1,
    boostDuration:primary==='boost'?1+bonus*2.2:1,
    driftCharge:primary==='technique'||secondary==='technique'?1+bonus*1.05:1,
    offroadGrip:primary==='technique'?1+bonus*1.55:1
  };
}
const AI_PERSONALITY_PRESETS={
  speed:{key:'charger',label:'OUTSIDE CHARGER',jp:'大外一気',copy:'直線まで待ち、外側から最高速で抜き切る。',aggression:.78,decisionTempo:1.08,passWidth:.48,lineGrip:.62,objectInterest:.42,trafficAvoidance:.76,boostThreshold:.7},
  accel:{key:'sprinter',label:'QUICK SPRINTER',jp:'先手必勝',copy:'小さな隙間へ早めに仕掛け、立ち上がりで前へ出る。',aggression:.94,decisionTempo:.72,passWidth:.39,lineGrip:.78,objectInterest:.68,trafficAvoidance:.9,boostThreshold:.57},
  handling:{key:'apex',label:'APEX HUNTER',jp:'イン刺し職人',copy:'カーブの内側を守り、頂点で鋭く追い抜く。',aggression:.84,decisionTempo:.8,passWidth:.31,lineGrip:1.18,objectInterest:.62,trafficAvoidance:1.02,boostThreshold:.64},
  boost:{key:'booster',label:'BOOST AMBUSH',jp:'ブースト奇襲',copy:'相手の背後で溜め、射程に入ると一気に加速する。',aggression:.9,decisionTempo:.86,passWidth:.43,lineGrip:.76,objectInterest:.9,trafficAvoidance:.86,boostThreshold:.42},
  technique:{key:'tactician',label:'LINE TACTICIAN',jp:'ラインの魔術師',copy:'混雑とアイテム位置を読み、空いたラインへ先回りする。',aggression:.72,decisionTempo:.76,passWidth:.35,lineGrip:.96,objectInterest:1.22,trafficAvoidance:1.34,boostThreshold:.62}
};
function buildAiPersonality(racer,index){
  const preset=AI_PERSONALITY_PRESETS[racer.trait.key]||AI_PERSONALITY_PRESETS.technique,stats=racer.set.stats;
  let hash=0;for(const ch of racer.slug)hash=(hash*31+ch.charCodeAt(0))>>>0;
  const passSide=hash%2?1:-1,temper=((hash>>3)%9-4)*.018,rhythm=.9+((hash>>7)%11)*.018;
  return{...preset,passSide,rhythm,aggression:clamp(preset.aggression+temper+(stats.accel-82)*.002,.58,1.08),boostThreshold:clamp(preset.boostThreshold-(stats.boost-82)*.0025,.3,.82),signature:`${preset.jp} / ${passSide<0?'LEFT':'RIGHT'} ATTACK`,index};
}
racers.forEach((racer,index)=>{racer.trait=buildRacerTrait(racer);racer.aiPersonality=buildAiPersonality(racer,index)});

// Mia is a mid-race boss challenger. She is deliberately kept outside
// racerData so she can never appear in the playable set carousel.
const miaNpc={
  name:'ミア・シャルム',slug:'mia-charme',color:'#ff42a5',portrait:'assets/ui/mia-charme-boss-portrait-gpt2.webp',
  frames:null,spritePromise:null,active:false,triggered:false,cutInActive:false,leaderTime:0,
  distance:0,progress:0,lane:0,aiTargetLane:0,aiVelocity:0,hit:0,spin:0,jumpY:0,jumpVelocity:0,airborne:false,landed:false
};
function raceContestants(){return miaNpc.active?[...racers,miaNpc]:racers}

const spriteImages=[];
const menuEnvironment = loadImage('assets/environment/sweets-circuit-v1.webp');
let environment=menuEnvironment,environmentCrop=null,courseImages=[],courseImagePromises=[],activeCourse=null;
const courseMapImage = loadImage('assets/ui/course-map-v2.webp',()=>drawMinimap());
const spectatorSlugs=['pink-human','blond-cookie','cyan-cat','purple-witch','teal-glasses'];
const spectatorFrameSets=[];
const spectatorImages=spectatorSlugs.map(()=>null),spectatorPromises=spectatorSlugs.map(()=>null);
let candySignImage=null,cupcakeTowerImage=null,candyAssetPromise=null;
let candySceneryFrames=[],forestSceneryFrames=[];
let candySceneryAtlas=null,forestSceneryAtlas=null;
const courseScenerySlugs=['sweets','steam','neon','rain','royal','aurora','jungle','sakura','coral','phantom','lunatic'];
const courseSceneryFrames=courseScenerySlugs.map(()=>[]);
const courseSceneryAtlases=courseScenerySlugs.map(()=>null),courseSceneryPromises=courseScenerySlugs.map(()=>null);
const JUMP_RAMP_COLS=7,JUMP_RAMP_ROWS=5;
// Measured from the generated art: positive values point from the entry edge
// toward screen-right. Keeping this table explicit prevents label/column
// assumptions from flipping a ramp on a curve.
const JUMP_RAMP_FRAME_YAW=[1,.58,.24,0,-.24,-.58,-1];
let jumpRampFrames=[];
let jumpRampAtlas=null,jumpRampPromise=null;
const coursePropSlugs=['steam','neon','rain','royal'];
const coursePropImages=Object.fromEntries(coursePropSlugs.map(slug=>[slug,Array(6).fill(null)])),coursePropPromises={};
const coursePropHeights={
  steam:[700,820,700,470,640,540],
  neon:[660,720,690,610,390,600],
  rain:[620,700,560,520,540,620],
  royal:[720,650,630,620,600,610]
};
const FX_ANIM_COLS=6,FX_ANIM_ROWS=6;
let itemFrames=[],drivingFxFrames=[],itemFxFrames=[];
let itemSheet=null,drivingFxAnimationSheet=null,itemFxAnimationSheet=null,itemFxAssetPromise=null;
const raceMusicFiles=['assets/audio/n(ya)itro_cat_grand_prix.mp3','assets/audio/drigt_swing_nya.mp3'];
const raceMusic=raceMusicFiles.map(src=>{const audio=new Audio(src);audio.preload='metadata';audio.loop=true;return audio});
let raceBgm=null,raceMusicIndex=0,musicError='';

const DIFFICULTY_PROFILES={
  easy:{label:'EASY',jp:'イージー',kicker:'RELAXED RACE',badge:'BEGINNER',dock:'気軽に走れる入門グランプリ',summary:'NPCの速度と追走力を抑え、コースやドリフト操作を覚えやすくした難易度です。',differences:['NPCは最高速と加速が控えめ。ミスをしても追いつきやすい','順位補正が弱く、一度リードすると安定して逃げやすい','ミアは14m先へ乱入するが、プレイヤーより少し遅く走る'],aiSpeed:.96,rubberGain:.1,rubberLimit:18,aiAccel:.9,aiBoost:.88,miaBase:166,miaOffset:-4,miaTargetGap:-3,miaCatchup:.65,miaCatchLimit:14,miaHitFactor:.48,miaSpawnGap:14},
  normal:{label:'NORMAL',jp:'ノーマル',kicker:'GRAND PRIX',badge:'RECOMMENDED',dock:'競り合いながら勝利を狙えるグランプリ',summary:'NPCはプレイヤーより少し控えめ。ミスを立て直しながら勝利を狙える標準難易度です。',differences:['NPCの最高速を99%に抑え、丁寧に走れば前へ出られる','追走補正を18km/hまでに抑え、理不尽な追い上げを軽減','ミアは22m先へ乱入し、同速域で直接競り合う'],aiSpeed:.99,rubberGain:.11,rubberLimit:18,aiAccel:.96,aiBoost:.94,miaBase:174,miaOffset:0,miaTargetGap:0,miaCatchup:.8,miaCatchLimit:20,miaHitFactor:.5,miaSpawnGap:22},
  hard:{label:'HARD',jp:'ハード',kicker:'BOSS CHALLENGE',badge:'EXPERT',dock:'最速NPCとミアに挑むボスレース',summary:'NPCが最速ラインを維持し、ミアも本気で勝利を奪いに来る上級者向け難易度です。',differences:['NPCの最高速は基準の114%。加速とアイテムブーストも強化','最大40km/hの強い追走補正で、終盤まで順位が入れ替わる','ミアは約18mのリードを狙い、被弾しても速度を維持しやすい'],aiSpeed:1.14,rubberGain:.23,rubberLimit:40,aiAccel:1.22,aiBoost:1.2,miaBase:202,miaOffset:26,miaTargetGap:18,miaCatchup:2.35,miaCatchLimit:64,miaHitFactor:.74,miaSpawnGap:38}
};
const DEFAULT_SETTINGS={masterVolume:80,musicVolume:55,effectsVolume:72,muted:false,richScenery:true,performancePreset:'auto',reducedEffects:false,preloadCourseAssets:true,cameraMotion:1,screenShake:1,speedLines:1,screenFlash:1,raceDifficulty:'normal',bindings:{accelerate:'ArrowUp',brake:'ArrowDown',left:'ArrowLeft',right:'ArrowRight',drift:'ShiftLeft',item:'Space',pause:'Escape'}};
const ACTION_LABELS={accelerate:'アクセル',brake:'ブレーキ',left:'左へ曲がる',right:'右へ曲がる',drift:'ドリフト',item:'アイテム',pause:'ポーズ'};
const KEY_LABELS={ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→',ShiftLeft:'左 SHIFT',ShiftRight:'右 SHIFT',Space:'SPACE',Escape:'ESC',Enter:'ENTER',Backspace:'BACKSPACE'};
function loadSettings(){try{const saved=JSON.parse(localStorage.getItem('nyan-cart-settings')||'{}');return{...DEFAULT_SETTINGS,...saved,bindings:{...DEFAULT_SETTINGS.bindings,...(saved.bindings||{})}}}catch{return{...DEFAULT_SETTINGS,bindings:{...DEFAULT_SETTINGS.bindings}}}}
let settings=loadSettings(),captureAction=null,settingsReturnMode='menu',settingsReturnPaused=false;
function saveSettings(){try{localStorage.setItem('nyan-cart-settings',JSON.stringify(settings))}catch{}}
function keyLabel(code){if(KEY_LABELS[code])return KEY_LABELS[code];if(code.startsWith('Key'))return code.slice(3);if(code.startsWith('Digit'))return code.slice(5);return code.replace(/(Left|Right)$/,' $1').toUpperCase()}
function applyAudioSettings(){const volume=settings.muted?0:(settings.masterVolume/100)*(settings.musicVolume/100);raceMusic.forEach(audio=>audio.volume=volume);window.NyanAudio?.setMix(settings.masterVolume/100,settings.effectsVolume/100,settings.muted);$('masterVolume').value=settings.masterVolume;$('musicVolume').value=settings.musicVolume;$('effectsVolume').value=settings.effectsVolume;$('masterVolumeValue').textContent=settings.masterVolume;$('musicVolumeValue').textContent=settings.musicVolume;$('effectsVolumeValue').textContent=settings.effectsVolume;const mute=$('muteToggle');mute.classList.toggle('muted',settings.muted);mute.setAttribute('aria-pressed',String(settings.muted));mute.textContent=settings.muted?'♪ サウンド OFF':'♫ サウンド ON';syncMusicButton()}
const PERFORMANCE_ORDER=['light','balanced','high'];
const PERFORMANCE_PROFILES={high:{label:'HIGH',renderScale:1,segments:132,effects:1,scenery:1},balanced:{label:'BALANCED',renderScale:.9,segments:112,effects:.7,scenery:.68},light:{label:'LIGHT',renderScale:.74,segments:88,effects:.42,scenery:.4}};
const adaptiveQuality={key:null,lastFrame:0,windowStart:0,samples:[],fps:0,p90:0,lowWindows:0,highWindows:0,lastChanged:0,upgradeBlockedUntil:0,reason:'device'};
function hardwarePerformanceKey(){const memory=navigator.deviceMemory||8,cores=navigator.hardwareConcurrency||8,coarse=matchMedia('(pointer:coarse)').matches;if(memory<=4||cores<=4&&coarse)return'light';if(memory<=8||cores<=6||coarse)return'balanced';return'high'}
adaptiveQuality.key=hardwarePerformanceKey();
function autoPerformanceKey(){return adaptiveQuality.key||hardwarePerformanceKey()}
function activePerformanceKey(){return settings.performancePreset==='auto'?autoPerformanceKey():(PERFORMANCE_PROFILES[settings.performancePreset]?settings.performancePreset:'balanced')}
function performanceProfile(){return PERFORMANCE_PROFILES[activePerformanceKey()]}
function effectDensity(){return performanceProfile().effects*(settings.reducedEffects?.55:1)}
function effectiveRichScenery(){return!!settings.richScenery&&activePerformanceKey()!=='light'}
const MOTION_LEVELS=[1,.45,0];
function motionLevel(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(1,n)):1}
function motionLabel(value){const level=motionLevel(value);return level>.75?'標準':level>.1?'ひかえめ':'OFF'}
function cycleMotionSetting(key){const current=motionLevel(settings[key]),index=MOTION_LEVELS.findIndex(value=>Math.abs(value-current)<.08);settings[key]=MOTION_LEVELS[(index+1+MOTION_LEVELS.length)%MOTION_LEVELS.length];applyVisualSettings();saveSettings()}
function resetAdaptiveQualitySamples(useHardware=false){if(useHardware){adaptiveQuality.key=hardwarePerformanceKey();adaptiveQuality.reason='device';adaptiveQuality.lastChanged=performance.now();adaptiveQuality.upgradeBlockedUntil=0}Object.assign(adaptiveQuality,{lastFrame:0,windowStart:0,samples:[],lowWindows:0,highWindows:0})}
function changeAdaptiveQuality(next,reason,now=performance.now()){
  if(!PERFORMANCE_PROFILES[next]||next===adaptiveQuality.key)return;const previous=adaptiveQuality.key,upgrade=PERFORMANCE_ORDER.indexOf(next)>PERFORMANCE_ORDER.indexOf(previous);if(!upgrade)adaptiveQuality.upgradeBlockedUntil=now+30000;adaptiveQuality.key=next;adaptiveQuality.reason=reason;adaptiveQuality.lastChanged=now;resetAdaptiveQualitySamples();applyVisualSettings();canvas.dataset.autoQuality=next;canvas.dataset.autoQualityReason=reason;
  if(upgrade&&state.mode==='race'&&settings.richScenery)setTimeout(()=>preloadRacePackage(state.selectedCourse,false).catch(()=>{}),0)
}
function updateAdaptiveQuality(now){
  if(settings.performancePreset!=='auto'||state.mode!=='race'||!state.running||state.paused||state.countdownActive||document.hidden){adaptiveQuality.lastFrame=now;adaptiveQuality.windowStart=0;adaptiveQuality.samples=[];return}
  if(!adaptiveQuality.lastFrame){adaptiveQuality.lastFrame=now;adaptiveQuality.windowStart=now;return}const frameTime=now-adaptiveQuality.lastFrame;adaptiveQuality.lastFrame=now;if(frameTime>=7&&frameTime<120)adaptiveQuality.samples.push(frameTime);if(now-adaptiveQuality.windowStart<2600)return;
  const elapsed=Math.max(1,now-adaptiveQuality.windowStart),sorted=[...adaptiveQuality.samples].sort((a,b)=>a-b);adaptiveQuality.fps=adaptiveQuality.samples.length*1000/elapsed;adaptiveQuality.p90=sorted.length?sorted[Math.min(sorted.length-1,Math.floor(sorted.length*.9))]:0;canvas.dataset.adaptiveFps=adaptiveQuality.fps.toFixed(1);canvas.dataset.adaptiveP90=adaptiveQuality.p90.toFixed(1);canvas.dataset.autoQuality=adaptiveQuality.key;
  const low=adaptiveQuality.fps<48||adaptiveQuality.p90>25,high=adaptiveQuality.fps>56&&adaptiveQuality.p90>0&&adaptiveQuality.p90<20;adaptiveQuality.lowWindows=low?adaptiveQuality.lowWindows+1:0;adaptiveQuality.highWindows=high?adaptiveQuality.highWindows+1:0;adaptiveQuality.samples=[];adaptiveQuality.windowStart=now;if(now-adaptiveQuality.lastChanged<8000)return;
  const index=PERFORMANCE_ORDER.indexOf(adaptiveQuality.key);if(adaptiveQuality.lowWindows>=2&&index>0)changeAdaptiveQuality(PERFORMANCE_ORDER[index-1],'fps-down',now);else if(adaptiveQuality.highWindows>=4&&now>=adaptiveQuality.upgradeBlockedUntil&&index<PERFORMANCE_ORDER.length-1)changeAdaptiveQuality(PERFORMANCE_ORDER[index+1],'fps-up',now)
}
window.NyanAdaptiveQuality={profiles:PERFORMANCE_PROFILES,state:adaptiveQuality,minimumRenderScale:PERFORMANCE_PROFILES.light.renderScale,hardwarePerformanceKey,activePerformanceKey,reset:()=>resetAdaptiveQualitySamples(true)};
function applyVisualSettings(){
  const rich=$('richSceneryToggle'),preset=$('performancePresetToggle'),effects=$('reducedEffectsToggle'),preload=$('preloadAssetsToggle'),profile=performanceProfile();if(!rich)return;
  rich.setAttribute('aria-pressed',String(!!settings.richScenery));rich.textContent=`豪華なコース外 ${settings.richScenery?'ON':'OFF'}`;
  preset.setAttribute('aria-pressed',String(settings.performancePreset!=='light'));preset.textContent=`描画品質 ${settings.performancePreset==='auto'?`AUTO / ${profile.label}`:profile.label}`;
  effects.setAttribute('aria-pressed',String(!!settings.reducedEffects));effects.textContent=`エフェクト軽量化 ${settings.reducedEffects?'ON':'OFF'}`;
  preload.setAttribute('aria-pressed',String(!!settings.preloadCourseAssets));preload.textContent=`レース素材先読み ${settings.preloadCourseAssets?'ON':'OFF'}`;
  const motionButtons=[['cameraMotionToggle','cameraMotion','カメラ上下'],['screenShakeToggle','screenShake','画面揺れ'],['speedLinesToggle','speedLines','速度流線'],['screenFlashToggle','screenFlash','白フラッシュ']];for(const [id,key,label] of motionButtons){const button=$(id);if(!button)continue;const value=motionLevel(settings[key]);button.textContent=`${label} ${motionLabel(value)}`;button.setAttribute('aria-pressed',String(value>0));button.dataset.level=value>.75?'full':value>.1?'low':'off'}
  document.body.dataset.cameraMotion=motionLabel(settings.cameraMotion);document.body.dataset.screenShake=motionLabel(settings.screenShake);document.body.dataset.speedLines=motionLabel(settings.speedLines);document.body.dataset.screenFlash=motionLabel(settings.screenFlash);
  const measured=settings.performancePreset==='auto'&&adaptiveQuality.fps?`・実測 ${Math.round(adaptiveQuality.fps)} FPS`:'',autoCopy=settings.performancePreset==='auto'?'端末性能から開始し、実測FPSで自動調整します。':'手動設定を固定します。';$('performanceDescription').textContent=`内部解像度 ${Math.round(profile.renderScale*100)}%・道路 ${profile.segments} セグメント${measured}。${autoCopy}`;
  ROAD_SEGMENTS=profile.segments;ROAD_SEGMENT_LENGTH=DRAW_DISTANCE/ROAD_SEGMENTS;if(canvas.width)resize();
}
function difficultyProfile(){return DIFFICULTY_PROFILES[settings.raceDifficulty]||DIFFICULTY_PROFILES.normal}
function applyDifficultySettings(){const profile=difficultyProfile();document.querySelectorAll('[data-difficulty]').forEach(button=>{const active=button.dataset.difficulty===settings.raceDifficulty;button.classList.toggle('active',active);button.setAttribute('aria-checked',String(active))});if(!$('difficultyName'))return;$('difficultyKicker').textContent=profile.kicker;$('difficultyName').textContent=`${profile.label} / ${profile.jp}`;$('difficultyBadge').textContent=profile.badge;$('difficultySummary').textContent=profile.summary;$('difficultyNpcSpeed').textContent=`${Math.round(profile.aiSpeed*100)}%`;$('difficultyChase').textContent=`±${profile.rubberLimit}`;$('difficultyMiaLead').textContent=String(profile.miaTargetGap);$('difficultyDifferences').innerHTML=profile.differences.map(text=>`<li>${text}</li>`).join('');$('difficultyDockName').textContent=profile.label;$('difficultyDockCopy').textContent=profile.dock}
function selectRaceDifficulty(key){if(!DIFFICULTY_PROFILES[key])return;settings.raceDifficulty=key;applyDifficultySettings();saveSettings();if(state.mode==='difficulty')syncControllerFocus()}
function setupDifficultySelection(){document.querySelectorAll('.difficulty-card[data-difficulty]').forEach(button=>button.onclick=()=>selectRaceDifficulty(button.dataset.difficulty));applyDifficultySettings()}
function updateControlHints(){$('itemKeyHint').textContent=keyLabel(settings.bindings.item);$('driftKeyHint').textContent=settings.bindings.drift.startsWith('Shift')?'SHIFT':keyLabel(settings.bindings.drift)}
function renderKeyConfig(){const list=$('keyConfigList');list.innerHTML=Object.entries(ACTION_LABELS).map(([action,label])=>`<div class="key-bind"><span>${label}</span><button type="button" data-bind-action="${action}">${keyLabel(settings.bindings[action])}</button></div>`).join('');list.querySelectorAll('[data-bind-action]').forEach(button=>button.onclick=()=>beginKeyCapture(button.dataset.bindAction))}
function beginKeyCapture(action){captureAction=action;renderKeyConfig();const button=document.querySelector(`[data-bind-action="${action}"]`);button?.classList.add('capturing');if(button)button.textContent='キーを押す';$('keyCaptureHelp').textContent='割り当てるキーを押してください（BACKSPACEでキャンセル）'}
function finishKeyCapture(action,code){const previous=settings.bindings[action],conflict=Object.keys(settings.bindings).find(other=>other!==action&&settings.bindings[other]===code);if(conflict)settings.bindings[conflict]=previous;settings.bindings[action]=code;captureAction=null;saveSettings();renderKeyConfig();updateControlHints();$('keyCaptureHelp').textContent='変更したい操作を選び、割り当てるキーを押してください。'}
function setupSettings(){renderKeyConfig();applyAudioSettings();applyVisualSettings();updateControlHints();$('masterVolume').oninput=e=>{settings.masterVolume=Number(e.target.value);applyAudioSettings();saveSettings()};$('musicVolume').oninput=e=>{settings.musicVolume=Number(e.target.value);applyAudioSettings();saveSettings()};$('effectsVolume').oninput=e=>{settings.effectsVolume=Number(e.target.value);applyAudioSettings();saveSettings()};$('muteToggle').onclick=()=>{settings.muted=!settings.muted;applyAudioSettings();saveSettings()};$('richSceneryToggle').onclick=()=>{settings.richScenery=!settings.richScenery;applyVisualSettings();saveSettings()};$('performancePresetToggle').onclick=()=>{const order=['auto','high','balanced','light'],i=order.indexOf(settings.performancePreset);settings.performancePreset=order[(i+1)%order.length];if(settings.performancePreset==='auto')resetAdaptiveQualitySamples(true);applyVisualSettings();saveSettings()};$('reducedEffectsToggle').onclick=()=>{settings.reducedEffects=!settings.reducedEffects;applyVisualSettings();saveSettings()};$('preloadAssetsToggle').onclick=()=>{settings.preloadCourseAssets=!settings.preloadCourseAssets;applyVisualSettings();saveSettings()};$('cameraMotionToggle').onclick=()=>cycleMotionSetting('cameraMotion');$('screenShakeToggle').onclick=()=>cycleMotionSetting('screenShake');$('speedLinesToggle').onclick=()=>cycleMotionSetting('speedLines');$('screenFlashToggle').onclick=()=>cycleMotionSetting('screenFlash');$('resetKeys').onclick=()=>{settings.bindings={...DEFAULT_SETTINGS.bindings};captureAction=null;renderKeyConfig();updateControlHints();saveSettings()}}

const SOUND_TEST_MODES={
  idle:{label:'STOP / IDLE',speed:0,power:.12,accelerating:false,boosting:false,turbo:0},
  low:{label:'LOW SPEED',speed:65,power:.38,accelerating:true,boosting:false,turbo:0},
  high:{label:'HIGH SPEED',speed:175,power:.76,accelerating:true,boosting:false,turbo:0},
  boost:{label:'FULL BOOST',speed:225,power:1,accelerating:true,boosting:true,turbo:1}
};
const soundTestState={selected:0,mode:'idle',active:false};
function setupSoundTest(){
  const grid=$('soundTestGrid');if(!grid)return;
  grid.innerHTML=racers.map((racer,index)=>{const sound=window.NyanAudio?.getMachineInfo(racer.slug);return `<button class="sound-test-machine" type="button" role="option" data-sound-machine="${index}" aria-selected="false" style="--machine-color:${racer.color}"><img src="${racer.hero}" alt="" loading="lazy" decoding="async"><span><b>${racer.name}</b><small>${sound?.label||racer.set.kart}</small></span><em>${String(index+1).padStart(2,'0')}</em></button>`}).join('');
  grid.querySelectorAll('[data-sound-machine]').forEach(button=>button.onclick=()=>selectSoundTestMachine(Number(button.dataset.soundMachine),true));
  $('soundTestModes').querySelectorAll('[data-sound-mode]').forEach(button=>button.onclick=()=>selectSoundTestMode(button.dataset.soundMode));
  $('openSoundTest').onclick=openSoundTest;$('closeSoundTest').onclick=closeSoundTest;
}
function soundTestMode(){return SOUND_TEST_MODES[soundTestState.mode]||SOUND_TEST_MODES.idle}
function updateSoundTestUI(machineChanged=false){
  const racer=racers[soundTestState.selected],sound=window.NyanAudio?.getMachineInfo(racer.slug),mode=soundTestMode(),visual=$('soundTestVisual');if(!racer||!visual)return;
  $('soundTestCounter').textContent=`${String(soundTestState.selected+1).padStart(2,'0')} / ${String(racers.length).padStart(2,'0')}`;$('soundTestHero').src=racer.hero;$('soundTestHero').alt=`${racer.name}と${racer.set.kart}`;
  $('soundTestMachineName').textContent=sound?.label||racer.set.kart.toUpperCase();$('soundTestSetName').textContent=`${racer.name} / ${racer.set.kart}`;$('soundTestConcept').textContent=sound?.concept||racer.set.description;$('soundTestStateLabel').textContent=mode.label;$('soundTestSpeed').textContent=String(mode.speed);$('soundTestTach').style.setProperty('--sound-power',mode.power);
  visual.style.setProperty('--motion',mode.power);visual.className=`sound-test-visual mode-${soundTestState.mode}`;if(machineChanged){visual.classList.add('machine-changed');setTimeout(()=>visual.classList.remove('machine-changed'),430)}
  document.querySelectorAll('[data-sound-machine]').forEach(button=>{const active=Number(button.dataset.soundMachine)===soundTestState.selected;button.classList.toggle('selected',active);button.setAttribute('aria-selected',String(active))});
  document.querySelectorAll('[data-sound-mode]').forEach(button=>{const active=button.dataset.soundMode===soundTestState.mode;button.classList.toggle('active',active);button.setAttribute('aria-checked',String(active))});
}
function selectSoundTestMachine(index,scroll=false){
  soundTestState.selected=((index%racers.length)+racers.length)%racers.length;const racer=racers[soundTestState.selected];window.NyanAudio?.startEngine(racer.slug,racer.set.stats,{silent:true});updateSoundTestUI(true);const card=document.querySelector(`[data-sound-machine="${soundTestState.selected}"]`);if(scroll)card?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});if(state.mode==='soundTest')requestAnimationFrame(syncControllerFocus)
}
function selectSoundTestMode(mode){if(!SOUND_TEST_MODES[mode])return;soundTestState.mode=mode;updateSoundTestUI();if(mode==='boost')playSfx('boost',{intensity:.65});if(state.mode==='soundTest')requestAnimationFrame(syncControllerFocus)}
function openSoundTest(){soundTestState.active=true;soundTestState.selected=state.selected;state.mode='soundTest';showScreen('soundTest');selectSoundTestMachine(soundTestState.selected,false)}
function closeSoundTest(){soundTestState.active=false;window.NyanAudio?.stopEngine();state.mode='settings';showScreen('settings')}
function updateSoundTestMeter(){
  const racer=racers[soundTestState.selected],sound=window.NyanAudio?.getMachineInfo(racer?.slug),mode=soundTestMode(),now=performance.now(),pulse=(sound?.pulse||3)*.00035,rough=sound?.roughness||.1,air=sound?.air||.1;
  $('soundTestMeter')?.querySelectorAll('i').forEach((bar,index)=>{const wave=(Math.sin(now*(.004+pulse)+index*1.31)+Math.sin(now*.0023+index*.71)+2)*.25,shape=.3+Math.sin((index+1)*.83+now*.0008)*.16,height=10+mode.power*52+wave*(18+rough*32)+shape*air*35;bar.style.height=`${Math.max(8,Math.min(100,height))}%`});
}

const state = {
  mode:'menu', selected:0, selectedCourse:0, running:false, paused:false, elapsed:0, lap:1, progress:0,
  distance:0, speed:0, x:0, steer:0, boosting:false, turbo:0, drift:0, driftLevel:0,
  item:null, shield:0, invincible:0, coins:0, raceWalletEarned:0, shake:0, rank:6, last:0,
  objects:[], particles:[], collectFx:[], projectiles:[], trackCurve:0, centrifugal:0, surface:'road', offroadAmount:0, suspension:0, suspensionVelocity:0, jumpY:0, jumpVelocity:0, jumpView:0, landingBounce:0, landingBounceVelocity:0, airborne:false, cameraHeading:0, flash:0, collisionCooldown:0,
  countdownActive:false, startCharge:0, startPenalty:false, finish:false, finishTime:0, finishCoast:0, finishOrder:null, lastRank:6,
  raceDifficulty:'normal',raceRewards:[],overtakeUiCooldown:0,rocketWarningCooldown:0,debug:{showCourseLimits:false}
};
const keyboardActions={},touchActions={},gamepadInput={accelerate:false,brake:false,left:false,right:false,drift:false,steer:0};
let gamepadPrevious={item:false,pause:false,accelerate:false,confirm:false,back:false},activeGamepadIndex=null;
const controllerUi={indexes:{menu:0,settings:0,soundTest:0,finish:0},activeElement:null,repeat:{left:0,right:0,up:0,down:0}};
function actionForCode(code){return Object.keys(settings.bindings).find(action=>settings.bindings[action]===code)}
function actionDown(action){return!!(keyboardActions[action]||touchActions[action]||gamepadInput[action])}
function handleStartCharge(){if(!state.countdownActive)return;const count=$('countdown').textContent;if(count==='3')state.startPenalty=true;if(count==='2')state.startCharge=Math.max(state.startCharge,1);if(count==='1')state.startCharge=2}
function togglePause(){if(state.mode!=='race'||miaNpc.cutInActive)return;state.paused=!state.paused;state.paused?pauseRaceMusic():resumeRaceMusic();playSfx(state.paused?'uiBack':'uiConfirm');toast(state.paused?'PAUSE':'RACE ON!')}
function gamepadDirectionPulse(direction,active,now){if(!active){controllerUi.repeat[direction]=0;return false}const next=controllerUi.repeat[direction];if(!next){controllerUi.repeat[direction]=now+330;return true}if(now>=next){controllerUi.repeat[direction]=now+125;return true}return false}
function setControllerConnected(connected){document.body.classList.toggle('controller-connected',connected);const hint=$('controllerMenuHint');if(hint){const visible=connected&&state.mode!=='race';hint.classList.toggle('hidden',!visible);hint.setAttribute('aria-hidden',String(!visible))}}
function pollGamepad(){
  const pads=navigator.getGamepads?.()||[],pad=[...pads].find(Boolean),status=$('controllerStatus');
  if(!pad){activeGamepadIndex=null;Object.assign(gamepadInput,{accelerate:false,brake:false,left:false,right:false,drift:false,steer:0});Object.keys(controllerUi.repeat).forEach(key=>controllerUi.repeat[key]=0);gamepadPrevious={item:false,pause:false,accelerate:false,confirm:false,back:false};setControllerConnected(false);if(status){status.textContent='接続待ち';status.classList.remove('connected')}return}
  activeGamepadIndex=pad.index;setControllerConnected(true);if(status){status.textContent=pad.id.replace(/\s*\([^)]*\)\s*/g,' ').trim().slice(0,30)||'接続済み';status.classList.add('connected')}
  const rawX=pad.axes[0]||0,rawY=pad.axes[1]||0,axis=Math.abs(rawX)>.16?rawX:0,left=rawX<-.52||!!pad.buttons[14]?.pressed,right=rawX>.52||!!pad.buttons[15]?.pressed,up=rawY<-.52||!!pad.buttons[12]?.pressed,down=rawY>.52||!!pad.buttons[13]?.pressed;
  const confirm=!!pad.buttons[0]?.pressed,back=!!pad.buttons[1]?.pressed,accelerate=(pad.buttons[7]?.value||0)>.16||confirm||up,brake=(pad.buttons[6]?.value||0)>.16||back||down,drift=!!pad.buttons[4]?.pressed||!!pad.buttons[5]?.pressed,item=!!pad.buttons[2]?.pressed,pause=!!pad.buttons[9]?.pressed;
  Object.assign(gamepadInput,{accelerate,brake,left,right,drift,steer:axis});
  if(state.mode==='race'){
    if(accelerate&&!gamepadPrevious.accelerate)handleStartCharge();if(item&&!gamepadPrevious.item)useItem();if(pause&&!gamepadPrevious.pause)togglePause();
  }else{
    const now=performance.now();for(const [direction,active] of Object.entries({left,right,up,down}))if(gamepadDirectionPulse(direction,active,now))navigateController(direction);
    if(confirm&&!gamepadPrevious.confirm)activateControllerSelection();if(back&&!gamepadPrevious.back)controllerBack();if(pause&&!gamepadPrevious.pause&&state.mode==='settings')closeSettings();
  }
  gamepadPrevious={item,pause,accelerate,confirm,back};
}
const TRACK_LENGTH=1800;
const TOTAL_LAPS=2;
const DEV_COURSES_ENABLED=new URLSearchParams(location.search).has('debugCourses')||localStorage.getItem('nyan-cart-debug-courses')==='1';
const MIA_DEBUG_ENABLED=new URLSearchParams(location.search).has('miaDebug');
function raceLength(){return activeCourse?.finishDistance||TRACK_LENGTH}
function raceLaps(){return activeCourse?.totalLaps||TOTAL_LAPS}
function finishLineOffset(){return Math.max(0,Math.min(raceLength()-.001,activeCourse?.startLine??55))}
function finishLineDistance(){return raceLength()*raceLaps()+finishLineOffset()}
function raceLapAt(distance){const completed=Math.max(0,Math.floor((distance-finishLineOffset())/raceLength()));return Math.min(raceLaps(),completed+1)}
const DRAW_DISTANCE=840;
let ROAD_SEGMENTS=132;
let ROAD_SEGMENT_LENGTH=DRAW_DISTANCE/ROAD_SEGMENTS;
const ROAD_FOV=70*Math.PI/180;
const ROAD_CAMERA_DEPTH=1/Math.tan(ROAD_FOV/2);
const ROAD_CAMERA_HEIGHT=.78;
const ROAD_WORLD_HALF_WIDTH=1.0;
const ROAD_NEAR_Z=.72;
const ELEVATION_INTENSITY=1.24;
// The rail is drawn at ±2.16.  Keep a kart's centre just inside it, which
// leaves the full shoulder / grass / sand strip playable without letting a
// sprite visually pass through the barrier.
const GUARDRAIL_LANE=2.16;
const COURSE_OUT_LIMIT=2.08;
const COURSE_SOFT_WALL=2.03;
const SURFACE_PROFILES={
  road:{id:'road',amount:0,accel:1,grip:1,steer:1,lateral:1,drag:0,roll:0,maxFactor:1,shake:0,dust:0,color:'#c8bed0'},
  shoulder:{id:'shoulder',amount:.28,accel:.93,grip:.9,steer:.94,lateral:.92,drag:.00004,roll:.02,maxFactor:.9,shake:1.1,dust:.42,color:'#d8bd83'},
  grass:{id:'grass',amount:.66,accel:.72,grip:.66,steer:.78,lateral:.72,drag:.00012,roll:.065,maxFactor:.7,shake:3.2,dust:.9,color:'#9cc878'},
  deep:{id:'deep',amount:1,accel:.62,grip:.58,steer:.72,lateral:.64,drag:.00014,roll:.08,maxFactor:.62,shake:4.6,dust:1.18,color:'#c99a6a'}
};
const OFFROAD_PALETTES=[
  {shoulderA:'#e8d38e',shoulderB:'#d9bb78',grassA:'#9bd47a',grassB:'#7fc061',deepA:'#d4a06b',deepB:'#bd8758'},
  {shoulderA:'#c99a67',shoulderB:'#a9774f',grassA:'#8ea06a',grassB:'#6f8552',deepA:'#77503b',deepB:'#5e3e30'},
  {shoulderA:'#7bd7e6',shoulderB:'#58b9cd',grassA:'#776dff',grassB:'#5f55d2',deepA:'#3b2f85',deepB:'#29225f'},
  {shoulderA:'#dff6ff',shoulderB:'#b8e5f6',grassA:'#76b66d',grassB:'#5b9459',deepA:'#3d6a48',deepB:'#2d5138'},
  {shoulderA:'#f3d078',shoulderB:'#d8ae5f',grassA:'#f1a1c9',grassB:'#df77ac',deepA:'#d7b988',deepB:'#b69368'}
];
let roadProjection=[];

function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function surfaceAtLane(lane,distance=state.distance){
  const a=Math.abs(lane);
  const route=routeGeometryAt(distance);if(route?.fork>.08){const nearest=Math.min(...Object.values(route.branches).map(path=>Math.abs(lane-path.laneCenter))),edge=route.laneHalf;if(nearest<=edge)return SURFACE_PROFILES.road;if(nearest<=edge+.18)return SURFACE_PROFILES.shoulder;if(nearest<=edge+.62)return SURFACE_PROFILES.grass;return SURFACE_PROFILES.deep}
  if(a<=.98)return SURFACE_PROFILES.road;
  if(a<=1.18)return SURFACE_PROFILES.shoulder;
  if(a<=1.72)return SURFACE_PROFILES.grass;
  return SURFACE_PROFILES.deep;
}
function offroadPalette(theme){
  const palette=OFFROAD_PALETTES[state.selectedCourse%OFFROAD_PALETTES.length]||OFFROAD_PALETTES[0];
  return{...palette,shoulderA:palette.shoulderA||theme.vergeA,shoulderB:palette.shoulderB||theme.vergeB};
}

function loadImage(src,onload){const im=new Image();im.onload=()=>onload?.(im);im.src=src;return im}
function loadImageAsync(src,onload){return new Promise((resolve,reject)=>{const image=new Image();image.decoding='async';image.onload=()=>{onload?.(image);resolve(image)};image.onerror=()=>reject(new Error(`Image load failed: ${src}`));image.src=src})}
function ensureSpectatorAssets(){return Promise.all(spectatorSlugs.map((slug,index)=>{if(spectatorFrameSets[index]?.length)return Promise.resolve(spectatorImages[index]);if(spectatorPromises[index])return spectatorPromises[index];spectatorPromises[index]=loadImageAsync(`assets/trackside/spectator-${slug}.webp`,image=>{spectatorImages[index]=image;spectatorFrameSets[index]=sliceSheet(image,7,2,`spectator-${slug}`)});return spectatorPromises[index]}))}
function ensureCandyAssets(){if(candyAssetPromise)return candyAssetPromise;candyAssetPromise=Promise.all([loadImageAsync('assets/trackside/candy-sign.webp',image=>candySignImage=image),loadImageAsync('assets/trackside/cupcake-tower.webp',image=>cupcakeTowerImage=image),loadImageAsync('assets/trackside/scenery-candy-houses.webp',image=>{candySceneryAtlas=image;candySceneryFrames=sliceSheet(image,3,2,'scenery-candy-houses')}),loadImageAsync('assets/trackside/scenery-forest.webp',image=>{forestSceneryAtlas=image;forestSceneryFrames=sliceSheet(image,3,2,'scenery-forest')})]);return candyAssetPromise}
function ensureCourseScenery(index){if(index<0||index>=courseScenerySlugs.length)return Promise.resolve(null);if(courseSceneryFrames[index]?.length)return Promise.resolve(courseSceneryAtlases[index]);if(courseSceneryPromises[index])return courseSceneryPromises[index];const slug=courseScenerySlugs[index];courseSceneryPromises[index]=loadImageAsync(`assets/trackside/course-scenery-${slug}-gpt2.webp`,image=>{courseSceneryAtlases[index]=image;courseSceneryFrames[index]=sliceSheet(image,4,3,`course-scenery-${slug}-gpt2`)});return courseSceneryPromises[index]}
function ensureJumpRampAsset(){if(jumpRampFrames.length)return Promise.resolve(jumpRampAtlas);if(jumpRampPromise)return jumpRampPromise;jumpRampPromise=loadImageAsync('assets/trackside/jump-ramps-angled-gpt2-v2.webp',image=>{jumpRampAtlas=image;jumpRampFrames=sliceSheet(image,JUMP_RAMP_COLS,JUMP_RAMP_ROWS,'jump-ramps-angled-gpt2-v2')});return jumpRampPromise}
function ensureCourseProps(theme){if(theme==='sweets')return ensureCandyAssets();if(!coursePropImages[theme])return Promise.resolve([]);if(coursePropPromises[theme])return coursePropPromises[theme];coursePropPromises[theme]=Promise.all(coursePropImages[theme].map((image,index)=>image?Promise.resolve(image):loadImageAsync(`assets/trackside/${theme}-prop-${index}.webp`,loaded=>coursePropImages[theme][index]=loaded)));return coursePropPromises[theme]}
function ensureItemAndFxAssets(){if(itemFrames.length&&drivingFxFrames.length&&itemFxFrames.length)return Promise.resolve();if(itemFxAssetPromise)return itemFxAssetPromise;itemFxAssetPromise=Promise.all([loadImageAsync('assets/ui/items.webp',image=>{itemSheet=image;itemFrames=sliceSheet(image,4,2,'items');drawHeldItem()}),loadImageAsync('assets/ui/driving-vfx-animated-gpt2-v1.webp',image=>{drivingFxAnimationSheet=image;drivingFxFrames=sliceSheet(image,FX_ANIM_COLS,FX_ANIM_ROWS,'driving-vfx-animated-gpt2-v1')}),loadImageAsync('assets/ui/item-vfx-animated-gpt2-v1.webp',image=>{itemFxAnimationSheet=image;itemFxFrames=sliceSheet(image,FX_ANIM_COLS,FX_ANIM_ROWS,'item-vfx-animated-gpt2-v1')})]);return itemFxAssetPromise}
function ensureCourseEnvironment(index){if(courseImages[index])return Promise.resolve(courseImages[index]);if(courseImagePromises[index])return courseImagePromises[index];const course=courseData[index];if(!course)return Promise.resolve(menuEnvironment);courseImagePromises[index]=loadImageAsync(course.art,image=>{courseImages[index]=image;if(state.selectedCourse===index){environment=image;environmentCrop=course.crop}});return courseImagePromises[index]}
function setAssetPreloadStatus(stateName,label,progress=0){const status=$('assetPreloadStatus');if(!status)return;status.className=`asset-preload-status ${stateName}`;status.style.setProperty('--preload-progress',`${Math.round(progress*100)}%`);const text=status.querySelector('span');if(text)text.textContent=label}
async function runPreloadTasks(tasks,onDone){let cursor=0;const results=Array(tasks.length),workers=Array.from({length:Math.min(4,tasks.length)},async()=>{while(cursor<tasks.length){const index=cursor++;results[index]=await tasks[index]();onDone?.()}});await Promise.all(workers);return results}
let racePackagePromise=null,racePackageKey='';
function preloadRacePackage(index,showProgress=true){
  const packageKey=`${index}:${activePerformanceKey()}:${effectiveRichScenery()}`;if(racePackagePromise&&racePackageKey===packageKey)return racePackagePromise;const course=courseData[index],tasks=[...racers.map((_,i)=>()=>ensureRacerSprite(i)),()=>ensureMiaSprite(),()=>ensureCourseEnvironment(index),()=>ensureItemAndFxAssets(),()=>ensureJumpRampAsset()];
  if(effectiveRichScenery())tasks.push(()=>ensureCourseScenery(index));if(activePerformanceKey()!=='light'){if(index<5){const propTheme=course?.propTheme||['sweets','steam','neon','rain','royal'][index]||'sweets';tasks.push(()=>ensureCourseProps(propTheme))}tasks.push(()=>ensureSpectatorAssets())}
  racePackageKey=packageKey;let done=0;if(showProgress)setAssetPreloadStatus('loading','レース素材を先読み中…',0);
  racePackagePromise=runPreloadTasks(tasks,()=>{done++;if(showProgress)setAssetPreloadStatus('loading',`レース素材を先読み中… ${done} / ${tasks.length}`,done/tasks.length)}).then(values=>{if(showProgress)setAssetPreloadStatus('ready','レース素材の準備ができました',1);return values}).catch(error=>{racePackagePromise=null;if(showProgress)setAssetPreloadStatus('error','素材の読み込みに失敗しました。再試行できます',done/tasks.length);throw error});return racePackagePromise;
}
function syncMusicButton(){const button=$('musicToggle');if(!button)return;const paused=!raceBgm||raceBgm.paused,silent=paused||settings.muted;button.classList.toggle('muted',silent);button.textContent=silent?'♪':'♫';button.setAttribute('aria-label',paused?'BGMを再生':'BGMを停止')}
function playRaceMusic(){if(raceBgm)raceBgm.pause();raceBgm=raceMusic[raceMusicIndex++%raceMusic.length];raceBgm.currentTime=0;musicError='';const playing=raceBgm.play();syncMusicButton();playing?.then(syncMusicButton).catch(error=>{musicError=error?.name||'play-failed';syncMusicButton()})}
function pauseRaceMusic(){if(raceBgm)raceBgm.pause();syncMusicButton()}
function resumeRaceMusic(){if(raceBgm&&state.mode==='race'){const playing=raceBgm.play();playing?.then(syncMusicButton).catch(error=>{musicError=error?.name||'play-failed';syncMusicButton()})}}
function playSfx(name,options){window.NyanAudio?.play(name,options)}
let nearbyRivalAudioSlugs=new Set();
function nearbyRivalAudioPayload(){
  const player=racers[state.selected],maxDistance=125,candidates=racers.filter(racer=>racer!==player).map(racer=>{const relativeDistance=racer.distance-state.distance,distance=Math.abs(relativeDistance),sticky=nearbyRivalAudioSlugs.has(racer.slug);return{racer,relativeDistance,distance,score:distance-(sticky?14:0)}}).filter(candidate=>candidate.relativeDistance>=-90&&candidate.relativeDistance<=maxDistance).sort((a,b)=>a.score-b.score).slice(0,3);
  nearbyRivalAudioSlugs=new Set(candidates.map(candidate=>candidate.racer.slug));return candidates.map(({racer,relativeDistance})=>{const rivalSpeed=Math.max(0,(racer.aiVelocity||racer.aiSpeed||0)*(racer.hit>0?.46:1));return{slug:racer.slug,stats:racer.set.stats,speed:rivalSpeed,relativeSpeed:rivalSpeed-state.speed,relativeDistance,pan:clamp((racer.lane-state.x)*.82,-1,1),boosting:racer.aiBoost>0,airborne:racer.airborne,hit:racer.hit>0,maxDistance}});
}
function updateAudioScene(){
  if(state.mode==='soundTest'){
    const mode=soundTestMode();window.NyanAudio?.updateEngine({speed:mode.speed,accelerating:mode.accelerating,braking:false,drifting:false,steer:0,boosting:mode.boosting,turbo:mode.turbo,surface:'road',airborne:false,running:true,paused:false});window.NyanAudio?.updateRivals([],{running:false});window.NyanAudio?.setTunnel(false);updateSoundTestMeter();return;
  }
  const racer=racers[state.selected];if(!racer){window.NyanAudio?.setTunnel(false);return}const running=state.mode==='race'&&state.running&&!state.finish,paused=state.paused||miaNpc.cutInActive,rivals=running&&!paused?nearbyRivalAudioPayload():[],tunnelMix=running&&!paused?audioTunnelMix(state.distance):0;window.NyanAudio?.updateEngine({speed:state.speed,accelerating:actionDown('accelerate')||Boolean(activeCourse?.autoDrive),braking:actionDown('brake'),drifting:state.drift>0,steer:state.steer,boosting:state.boosting,turbo:state.turbo,surface:state.surface,airborne:state.airborne,running,paused});window.NyanAudio?.updateRivals(rivals,{running,paused});window.NyanAudio?.setTunnel(tunnelMix>0,tunnelMix);canvas.dataset.rivalAudioCount=String(rivals.length);canvas.dataset.rivalAudio=rivals.map(rival=>rival.slug).join(',');canvas.dataset.rivalAudioPan=rivals.map(rival=>rival.pan.toFixed(2)).join(',');canvas.dataset.rivalAudioRelativeSpeed=rivals.map(rival=>rival.relativeSpeed.toFixed(1)).join(',');canvas.dataset.audioTunnel=tunnelMix>0?'inside':'outside';canvas.dataset.audioTunnelMix=tunnelMix.toFixed(2)
}
function ensureRacerSprite(index){
  const racer=racers[index];if(!racer)return Promise.reject(new Error(`Unknown racer sprite index: ${index}`));if(racer.frames)return Promise.resolve(racer.frames);if(racer.spritePromise)return racer.spritePromise;
  racer.spritePromise=new Promise((resolve,reject)=>{const im=new Image();spriteImages[index]=im;im.onload=()=>{racer.frames=remapRacerFrames(racer.slug,sliceSheet(im,7,2,racer.slug));resolve(racer.frames)};im.onerror=error=>{racer.spritePromise=null;reject(error)};im.src=`assets/sprites/${racer.slug}.webp`});
  return racer.spritePromise;
}
function ensureMiaSprite(){
  if(miaNpc.frames)return Promise.resolve(miaNpc.frames);if(miaNpc.spritePromise)return miaNpc.spritePromise;
  miaNpc.spritePromise=new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{miaNpc.frames=sliceSheet(im,7,2,miaNpc.slug);resolve(miaNpc.frames)};im.onerror=error=>{miaNpc.spritePromise=null;reject(error)};im.src='assets/sprites/mia-charme.webp'});
  return miaNpc.spritePromise;
}
function ensureContestantSprite(racer){if(racer===miaNpc)return ensureMiaSprite();const index=racers.indexOf(racer);return index>=0?ensureRacerSprite(index):Promise.reject(new Error('Unknown race contestant'))}
function ensureAllSprites(){return Promise.all([...racers.map((_,i)=>ensureRacerSprite(i)),ensureMiaSprite()])}

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

function resize(){const d=Math.min(devicePixelRatio||1,2),quality=performanceProfile().renderScale,pixel=d*quality;canvas.width=Math.max(1,Math.round(innerWidth*pixel));canvas.height=Math.max(1,Math.round(innerHeight*pixel));canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(pixel,0,0,pixel,0,0);canvas.dataset.renderScale=quality.toFixed(2)}
addEventListener('resize',resize);resize();

const SET_STAT_LABELS=[['speed','SPEED'],['accel','ACCEL'],['handling','HANDLING'],['boost','BOOST'],['technique','TECHNIQUE']];
const PROGRESS_KEY='nyan-cart-progress-v1',INITIAL_FREE_RACER_COUNT=18;
function loadProgress(){try{const saved=JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}');return{coins:Math.max(0,Math.floor(Number(saved.coins)||0)),unlocked:Array.isArray(saved.unlocked)?saved.unlocked.filter(value=>typeof value==='string'):[],hardClears:Array.isArray(saved.hardClears)?saved.hardClears.filter(value=>typeof value==='string'):[],miaDefeats:Array.isArray(saved.miaDefeats)?saved.miaDefeats.filter(value=>typeof value==='string'):[]}}catch{return{coins:0,unlocked:[],hardClears:[],miaDefeats:[]}}}
const playerProgress=loadProgress();
function saveProgress(){try{localStorage.setItem(PROGRESS_KEY,JSON.stringify(playerProgress))}catch{}}
function racerUnlockCost(index){return index<INITIAL_FREE_RACER_COUNT?0:100+(index-INITIAL_FREE_RACER_COUNT)*50}
function isRacerUnlocked(index){return racerUnlockCost(index)===0||playerProgress.unlocked.includes(racers[index]?.slug)}
function updateWalletUI(){if($('walletCoins'))$('walletCoins').textContent=String(playerProgress.coins)}
function addWalletCoins(amount){const earned=Math.max(0,Math.floor(amount));if(!earned)return;playerProgress.coins+=earned;saveProgress();updateWalletUI()}
let setNoticeTimer=0;
function showSetNotice(message){const notice=$('setNotice');if(!notice)return;notice.textContent=message;clearTimeout(setNoticeTimer);setNoticeTimer=setTimeout(()=>notice.textContent='',2400)}
function makeConfetti(container,count=34){
  if(!container)return;
  container.innerHTML=Array.from({length:count},(_,i)=>`<i style="--x:${Math.random()*100}%;--delay:${Math.random()*.42}s;--dur:${.85+Math.random()*.85}s;--rot:${Math.random()*720-360}deg;--c:${['#ff4fc8','#48dcff','#ffe34f','#ffffff','#ff9b42'][i%5]}"></i>`).join('');
}
function playUnlockAnimation(racer,cost){
  const fx=$('unlockFx');if(!fx||!racer)return;
  $('unlockHero').src=racer.hero;$('unlockHero').alt=racer.name;$('unlockName').textContent=racer.name;$('unlockCopy').textContent=`${cost} COINSで専用セットを開放！`;
  makeConfetti($('unlockConfetti'),42);
  fx.classList.remove('hidden','show');void fx.offsetWidth;fx.classList.add('show');
  clearTimeout(playUnlockAnimation.t);playUnlockAnimation.t=setTimeout(()=>{fx.classList.add('hidden');fx.classList.remove('show');$('unlockConfetti').innerHTML=''},2100);
}
const setCarousel={dragging:false,moved:false,dragDistance:0,pointerId:null,pointerType:'mouse',lastX:0,lastTime:0,velocity:0,inertia:0,settle:0,targetIndex:null,targetTimer:0,virtualIndex:racers.length+state.selected};
function setupSetGrid(){const rail=$('setGrid'),count=racers.length;rail.innerHTML='';setCarousel.virtualIndex=count+state.selected;for(let cycle=0;cycle<3;cycle++)racers.forEach((r,i)=>{const virtualIndex=cycle*count+i,button=document.createElement('button'),stars=r.set.rank==='S'?5:4,locked=!isRacerUnlocked(i),cost=racerUnlockCost(i),active=virtualIndex===setCarousel.virtualIndex;button.className='set-card'+(active?' selected':'')+(locked?' locked':'');button.style.setProperty('--set-color',r.color);button.style.setProperty('--hero-scale',r.heroPresentation.scale);button.dataset.setIndex=String(i);button.dataset.virtualIndex=String(virtualIndex);button.setAttribute('role','option');button.setAttribute('aria-selected',String(active));button.setAttribute('aria-setsize',String(count));button.setAttribute('aria-posinset',String(i+1));button.innerHTML=`<img src="${r.hero}" alt="${r.name}と${r.set.kart}" draggable="false" loading="lazy" decoding="async"><span class="set-card-copy"><strong>${r.name}</strong><small>${r.set.kart}</small><em>★${stars}</em></span><span class="set-card-badge">${locked?'LOCKED':active?'EQUIPPED':'SELECT'}</span><span class="set-card-lock">🔒 ${cost} COINS</span>`;button.onclick=()=>{if(!setCarousel.moved)selectRacerSet(i,true,virtualIndex)};rail.appendChild(button)});rail.addEventListener('scroll',()=>{updateSetCarousel();if(setCarousel.targetIndex!==null)return;clearTimeout(setCarousel.settle);if(!setCarousel.dragging)setCarousel.settle=setTimeout(snapSetCarousel,120)},{passive:true});rail.addEventListener('pointerdown',startSetDrag);rail.addEventListener('pointermove',moveSetDrag);rail.addEventListener('pointerup',endSetDrag);rail.addEventListener('pointercancel',endSetDrag);rail.addEventListener('wheel',wheelSetCarousel,{passive:false});rail.addEventListener('keydown',keySetCarousel);if($('positionTotal'))$('positionTotal').textContent=`/${count}`;updateWalletUI()}
function cancelSetTarget(){clearTimeout(setCarousel.targetTimer);setCarousel.targetIndex=null}
function normalizeSetLoop(){const count=racers.length;let virtualIndex=setCarousel.virtualIndex;if(virtualIndex<count)virtualIndex+=count;else if(virtualIndex>=count*2)virtualIndex-=count;if(virtualIndex===setCarousel.virtualIndex)return;setCarousel.virtualIndex=virtualIndex;const rail=$('setGrid'),card=rail.querySelector(`[data-virtual-index="${virtualIndex}"]`);if(card)rail.scrollLeft=Math.max(0,card.offsetLeft-(rail.clientWidth-card.clientWidth)/2);updateSetUI();updateSetCarousel()}
function centerSelectedSetCard(smooth=false,virtualIndex=setCarousel.virtualIndex){const rail=$('setGrid'),card=rail.querySelector(`[data-virtual-index="${virtualIndex}"]`);if(!card)return;setCarousel.virtualIndex=virtualIndex;const left=Math.max(0,card.offsetLeft-(rail.clientWidth-card.clientWidth)/2);cancelAnimationFrame(setCarousel.inertia);setCarousel.velocity=0;cancelSetTarget();if(smooth){setCarousel.targetIndex=virtualIndex;rail.scrollTo({left,behavior:'smooth'});setCarousel.targetTimer=setTimeout(()=>{setCarousel.targetIndex=null;setCarousel.velocity=0;normalizeSetLoop();updateSetCarousel()},1000)}else{rail.scrollTo({left,behavior:'auto'});normalizeSetLoop()}}
function updateSetCarousel(){const rail=$('setGrid'),center=rail.scrollLeft+rail.clientWidth/2,unit=Math.max(1,rail.querySelector('.set-card')?.offsetWidth||1),speed=Math.max(-18,Math.min(18,setCarousel.velocity*.75));rail.querySelectorAll('.set-card').forEach(card=>{const cardCenter=card.offsetLeft+card.offsetWidth/2,distance=(cardCenter-center)/unit,depth=Math.min(2.4,Math.abs(distance)),rotate=Math.max(-58,Math.min(58,-distance*31+speed*Math.max(0,1-depth*.42))),scale=Math.max(.76,1-depth*.11);card.style.transform=`perspective(900px) translateZ(${-depth*72}px) rotateY(${rotate}deg) scale(${scale})`;card.style.opacity=String(Math.max(.54,1-depth*.17));card.style.zIndex=String(30-Math.round(depth*10))})}
function nearestSetIndex(){const rail=$('setGrid'),center=rail.scrollLeft+rail.clientWidth/2;let result={index:state.selected,virtualIndex:setCarousel.virtualIndex},best=Infinity;rail.querySelectorAll('.set-card').forEach(card=>{const distance=Math.abs(card.offsetLeft+card.offsetWidth/2-center);if(distance<best){best=distance;result={index:Number(card.dataset.setIndex),virtualIndex:Number(card.dataset.virtualIndex)}}});return result}
function snapSetCarousel(){if(setCarousel.dragging||setCarousel.targetIndex!==null||Math.abs(setCarousel.velocity)>.32)return;const nearest=nearestSetIndex();selectRacerSet(nearest.index,false,nearest.virtualIndex);centerSelectedSetCard(true,nearest.virtualIndex)}
function startSetDrag(event){if(event.button!==undefined&&event.button!==0)return;const rail=$('setGrid');cancelAnimationFrame(setCarousel.inertia);clearTimeout(setCarousel.settle);cancelSetTarget();setCarousel.dragging=true;setCarousel.moved=false;setCarousel.dragDistance=0;setCarousel.pointerId=event.pointerId;setCarousel.pointerType=event.pointerType||'mouse';setCarousel.lastX=event.clientX;setCarousel.lastTime=event.timeStamp;setCarousel.velocity=0;rail.classList.add('dragging');rail.setPointerCapture?.(event.pointerId)}
function moveSetDrag(event){if(!setCarousel.dragging||event.pointerId!==setCarousel.pointerId)return;const rail=$('setGrid'),dx=event.clientX-setCarousel.lastX,dt=Math.max(6,event.timeStamp-setCarousel.lastTime),touch=setCarousel.pointerType==='touch'||setCarousel.pointerType==='pen';setCarousel.dragDistance+=Math.abs(dx);if(setCarousel.dragDistance>(touch?5:8))setCarousel.moved=true;rail.scrollLeft-=dx;const instant=dx*16.667/dt,gain=touch?.68:.48;setCarousel.velocity=setCarousel.velocity*(1-gain)+instant*gain;setCarousel.lastX=event.clientX;setCarousel.lastTime=event.timeStamp;updateSetCarousel();if(setCarousel.moved)event.preventDefault()}
function endSetDrag(event){if(!setCarousel.dragging||event.pointerId!==setCarousel.pointerId)return;const rail=$('setGrid'),wasMoved=setCarousel.moved,touch=setCarousel.pointerType==='touch'||setCarousel.pointerType==='pen';setCarousel.dragging=false;rail.classList.remove('dragging');rail.releasePointerCapture?.(event.pointerId);if(!wasMoved){setCarousel.velocity=0;setTimeout(()=>{setCarousel.moved=false},0);return}setCarousel.velocity*=touch?1.22:1;const friction=touch?.944:.915,minimum=touch?.22:.32;const glide=()=>{setCarousel.velocity*=friction;rail.scrollLeft-=setCarousel.velocity;updateSetCarousel();if(Math.abs(setCarousel.velocity)>minimum)setCarousel.inertia=requestAnimationFrame(glide);else{setCarousel.velocity=0;snapSetCarousel()}};setCarousel.inertia=requestAnimationFrame(glide);setTimeout(()=>{setCarousel.moved=false},0)}
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
  const racer=racers[state.selected],meta=racer.set,trait=racer.trait,title=`${racer.name} & ${meta.kart}`,locked=!isRacerUnlocked(state.selected),cost=racerUnlockCost(state.selected),stats=$('setStats');
  $('setName').textContent=title;$('setStageLabel').textContent=meta.kart.toUpperCase();$('setSubtitle').textContent=`${meta.rank} RANK EXCLUSIVE SET`;playSetRankAnimation(meta);$('setDescription').textContent=meta.description;$('setPosition').textContent=`${String(state.selected+1).padStart(2,'0')} / ${String(racers.length).padStart(2,'0')}`;
  const machineSound=window.NyanAudio?.getMachineInfo(racer.slug);$('setTrait').innerHTML=`<b>${trait.label}</b><span>${trait.copy}</span>${machineSound?`<small>ENGINE SOUND · ${machineSound.label}<em>${machineSound.concept}</em></small>`:''}`;window.NyanAudio?.previewMachine(racer.slug,meta.stats);
  const hero=$('setHeroImage');hero.src=racer.hero;hero.alt=`${racer.name}と専用カート ${meta.kart}`;hero.style.setProperty('--hero-scale',racer.heroPresentation.scale);hero.style.setProperty('--hero-y',`${racer.heroPresentation.y}px`);hero.classList.remove('changed');requestAnimationFrame(()=>hero.classList.add('changed'));
  stats.classList.remove('stat-animate');stats.innerHTML=SET_STAT_LABELS.map(([key,label],i)=>`<div class="set-stat-row"><span>${label}</span><i><b style="--stat:${meta.stats[key]}%;--delay:${i*55}ms"></b></i><em data-target="${meta.stats[key]}">0</em></div>`).join('');
  requestAnimationFrame(()=>{stats.classList.add('stat-animate');animateStatNumbers(stats)});
  document.querySelectorAll('.set-card').forEach(card=>{const index=Number(card.dataset.setIndex),active=Number(card.dataset.virtualIndex)===setCarousel.virtualIndex,cardLocked=!isRacerUnlocked(index);card.classList.toggle('selected',active);card.classList.toggle('locked',cardLocked);card.setAttribute('aria-selected',String(active));card.querySelector('.set-card-badge').textContent=cardLocked?'LOCKED':active?'EQUIPPED':'SELECT'});
  const confirm=$('confirmSet');confirm.classList.toggle('unlock',locked);confirm.querySelector('span').textContent=locked?'UNLOCK':'COURSE SELECT';confirm.querySelector('small').textContent=locked?`${cost} COINS で開放`:'このセットで決定';updateWalletUI();
}
function selectRacerSet(i,center=true,virtualIndex=null){const count=racers.length;state.selected=((i%count)+count)%count;if(virtualIndex===null){const candidates=[state.selected,state.selected+count,state.selected+count*2];virtualIndex=candidates.reduce((best,value)=>Math.abs(value-setCarousel.virtualIndex)<Math.abs(best-setCarousel.virtualIndex)?value:best,candidates[1])}setCarousel.virtualIndex=virtualIndex;updateSetUI();ensureRacerSprite(state.selected);if(center)centerSelectedSetCard(true,virtualIndex);updateSetCarousel();if(state.mode==='kart')syncControllerFocus()}
function openKartSelect(){state.mode='kart';showScreen('kartSelect');updateSetUI();requestAnimationFrame(()=>{centerSelectedSetCard(false,setCarousel.virtualIndex);updateSetCarousel()})}
function confirmRacerSet(){if(isRacerUnlocked(state.selected)){openCourseSelect();return}const cost=racerUnlockCost(state.selected);if(playerProgress.coins<cost){showSetNotice(`開放まであと ${cost-playerProgress.coins} COINS`);return}const racer=racers[state.selected];playerProgress.coins-=cost;playerProgress.unlocked.push(racer.slug);saveProgress();updateSetUI();showSetNotice('レーサーセットを開放しました！');playUnlockAnimation(racer,cost)}
function setupCourseGrid(){const grid=$('courseGrid');grid.innerHTML='';courseData.forEach((course,i)=>{if(course.debugOnly&&!DEV_COURSES_ENABLED)return;const button=document.createElement('button');button.className='course-card'+(i===state.selectedCourse?' selected':'')+(course.debugOnly?' debug-course':'');button.dataset.courseIndex=String(i);button.innerHTML=`<img src="${course.art}" alt="${course.name}" loading="lazy" decoding="async"><span class="course-number">${course.debugOnly?'DBG':i+1}</span><span class="course-copy"><strong>${course.name}</strong><small>${course.style}</small></span>`;button.onclick=()=>selectCourse(i);grid.appendChild(button)})}
function selectCourse(i){state.selectedCourse=i;document.querySelectorAll('.course-card').forEach(card=>card.classList.toggle('selected',Number(card.dataset.courseIndex)===i));$('selectedCourseName').textContent=courseData[i].name;$('selectedCourseInfo').textContent=`${courseData[i].style}  ・  難易度 ${courseData[i].difficulty}`;activateCourse(i);if(state.mode==='course')syncControllerFocus()}
function activateCourse(i){const course=courseData[i];activeCourse=course;trackNodes=course.nodes;trackArc=buildTrackArc();trackHeights=course.heights;tunnelSections=course.tunnels;environment=courseImages[i]||menuEnvironment;environmentCrop=course.crop;drawMinimap();ensureCourseEnvironment(i).then(image=>{if(state.selectedCourse===i)environment=image}).catch(error=>console.warn('Course environment load failed',error))}
function openCourseSelect(){state.mode='course';showScreen('courseSelect');selectCourse(state.selectedCourse)}
function openDifficultySelect(){activateCourse(state.selectedCourse);const course=activeCourse;$('difficultyCourseArt').src=course.art;$('difficultyCourseArt').alt=course.name;$('difficultyCourseName').textContent=course.name;$('difficultyCourseStyle').textContent=`${course.style} ・ コース難易度 ${course.difficulty}`;state.mode='difficulty';applyDifficultySettings();showScreen('difficultySelect');if(settings.preloadCourseAssets)preloadRacePackage(state.selectedCourse,true).catch(()=>{});else setAssetPreloadStatus('idle','スタート時にレース素材を読み込みます',0)}
function controllerFocusElement(element,scroll=false){document.querySelectorAll('.controller-focus').forEach(node=>node.classList.remove('controller-focus'));controllerUi.activeElement=element||null;if(!element)return;element.classList.add('controller-focus');try{element.focus({preventScroll:true})}catch{}if(scroll)element.scrollIntoView?.({block:'nearest',inline:'nearest',behavior:'smooth'})}
function visibleControllerElements(selector,root=document){return[...root.querySelectorAll(selector)].filter(element=>!element.disabled&&element.getClientRects().length&&getComputedStyle(element).visibility!=='hidden')}
function controllerList(mode=state.mode){if(mode==='menu')return[$('openSelect'),$('openSettings')].filter(Boolean);if(mode==='settings')return visibleControllerElements('button,input[type="range"]',$('settings'));if(mode==='soundTest')return visibleControllerElements('button',$('soundTest'));if(mode==='finish')return[$('retry'),$('toMenu')].filter(Boolean);return[]}
function syncControllerFocus(){
  if(activeGamepadIndex===null){controllerFocusElement(null);setControllerConnected(false);return}
  if(state.mode==='kart'){controllerFocusElement($('setGrid')?.querySelector(`[data-virtual-index="${setCarousel.virtualIndex}"]`));return}
  if(state.mode==='course'){controllerFocusElement($('courseGrid')?.querySelector(`[data-course-index="${state.selectedCourse}"]`),true);return}
  if(state.mode==='difficulty'){controllerFocusElement(document.querySelector(`[data-difficulty="${settings.raceDifficulty}"]`),true);return}
  const list=controllerList(),index=Math.max(0,Math.min(list.length-1,controllerUi.indexes[state.mode]||0));controllerUi.indexes[state.mode]=index;controllerFocusElement(list[index],state.mode==='settings')
}
function adjustControllerRange(input,direction){const step=Number(input.step)||1,min=Number(input.min)||0,max=Number(input.max)||100;input.value=String(Math.max(min,Math.min(max,Number(input.value)+(direction==='right'?step*5:-step*5))));input.dispatchEvent(new Event('input',{bubbles:true}))}
function spatialControllerMove(list,direction,current){if(!list.length)return null;if(!current||!list.includes(current))return list[0];const rect=current.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2,vector={left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]}[direction];let best=null,bestScore=Infinity;for(const candidate of list){if(candidate===current)continue;const box=candidate.getBoundingClientRect(),dx=box.left+box.width/2-cx,dy=box.top+box.height/2-cy,primary=dx*vector[0]+dy*vector[1];if(primary<=4)continue;const cross=Math.abs(dx*vector[1]-dy*vector[0]),score=primary+cross*1.7;if(score<bestScore){best=candidate;bestScore=score}}return best}
function moveControllerList(mode,direction){const list=controllerList(mode);if(!list.length)return;let index=controllerUi.indexes[mode]||0,current=list[index];if(mode==='settings'&&current?.matches('input[type="range"]')&&(direction==='left'||direction==='right')){adjustControllerRange(current,direction);return}const next=mode==='settings'?spatialControllerMove(list,direction,current):list[(index+(direction==='left'||direction==='up'?-1:1)+list.length)%list.length];if(!next)return;index=list.indexOf(next);controllerUi.indexes[mode]=index;controllerFocusElement(next,mode==='settings')}
function moveCourseController(direction){const cards=visibleControllerElements('.course-card',$('courseGrid')),current=cards.find(card=>Number(card.dataset.courseIndex)===state.selectedCourse)||cards[0],next=spatialControllerMove(cards,direction,current);if(next){selectCourse(Number(next.dataset.courseIndex));next.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'})}}
function navigateController(direction){
  if(state.mode==='menu'||state.mode==='settings'||state.mode==='soundTest'||state.mode==='finish'){moveControllerList(state.mode,direction);return}
  if(state.mode==='kart'&&(direction==='left'||direction==='right')){const step=direction==='right'?1:-1,virtualIndex=setCarousel.virtualIndex+step,index=((virtualIndex%racers.length)+racers.length)%racers.length;selectRacerSet(index,true,virtualIndex);return}
  if(state.mode==='course'){moveCourseController(direction);return}
  if(state.mode==='difficulty'){const keys=Object.keys(DIFFICULTY_PROFILES),current=Math.max(0,keys.indexOf(settings.raceDifficulty)),step=direction==='left'||direction==='up'?-1:1;selectRaceDifficulty(keys[(current+step+keys.length)%keys.length])}
}
function activateControllerSelection(){
  if(state.mode==='kart'){confirmRacerSet();return}if(state.mode==='course'){openDifficultySelect();return}if(state.mode==='difficulty'){$('confirmDifficulty')?.click();return}
  const list=controllerList(),element=controllerUi.activeElement&&list.includes(controllerUi.activeElement)?controllerUi.activeElement:list[controllerUi.indexes[state.mode]||0];if(element&&!element.matches('input[type="range"]'))element.click()
}
function controllerBack(){
  if(captureAction){captureAction=null;renderKeyConfig();$('keyCaptureHelp').textContent='キー変更をキャンセルしました。';requestAnimationFrame(syncControllerFocus);return}
  if(state.mode==='kart')$('backKartSelect')?.click();else if(state.mode==='course')$('backCourseSelect')?.click();else if(state.mode==='difficulty')$('backDifficultySelect')?.click();else if(state.mode==='soundTest')closeSoundTest();else if(state.mode==='settings')closeSettings();else if(state.mode==='finish')$('toMenu')?.click()
}
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));if(id)$(id).classList.add('active');setControllerConnected(activeGamepadIndex!==null);requestAnimationFrame(syncControllerFocus)}
function openSettings(){settingsReturnMode=state.mode;settingsReturnPaused=state.paused;if(state.mode==='race'){state.paused=true;pauseRaceMusic()}state.mode='settings';captureAction=null;renderKeyConfig();applyAudioSettings();applyVisualSettings();showScreen('settings')}
function closeSettings(){captureAction=null;saveSettings();const returnMode=settingsReturnMode;state.mode=returnMode;if(returnMode==='race'){const racer=racers[state.selected];window.NyanAudio?.startEngine(racer.slug,racer.set.stats,{silent:true});showScreen(null);state.paused=settingsReturnPaused;if(!state.paused)resumeRaceMusic()}else showScreen(returnMode==='kart'?'kartSelect':returnMode==='course'?'courseSelect':returnMode==='difficulty'?'difficultySelect':returnMode==='finish'?'finish':'menu')}
function updateDebugUI(){const enabled=state.debug.showCourseLimits,button=$('debugCourseBounds');button.setAttribute('aria-pressed',String(enabled));button.textContent=`コース枠 ${enabled?'ON':'OFF'}`;$('debugToggle').classList.toggle('active',enabled)}
function setDebugPanel(open){$('debugPanel').classList.toggle('hidden',!open);$('debugToggle').setAttribute('aria-expanded',String(open))}
$('openSelect').onclick=()=>{environment=menuEnvironment;environmentCrop=null;openKartSelect()};
$('openSettings').onclick=openSettings;$('raceSettings').onclick=openSettings;$('closeSettings').onclick=closeSettings;$('settingsDone').onclick=closeSettings;
$('backKartSelect').onclick=()=>{environment=menuEnvironment;environmentCrop=null;state.mode='menu';showScreen('menu')};$('confirmSet').onclick=confirmRacerSet;$('backCourseSelect').onclick=openKartSelect;$('confirmCourse').onclick=openDifficultySelect;$('backDifficultySelect').onclick=openCourseSelect;$('confirmDifficulty').onclick=startRace;$('retry').onclick=startRace;
$('toMenu').onclick=()=>{environment=menuEnvironment;environmentCrop=null;state.mode='menu';pauseRaceMusic();window.NyanAudio?.stopEngine();setDebugPanel(false);showScreen('menu');$('hud').classList.add('hidden');$('mobileControls').classList.add('hidden')};
$('musicToggle').onclick=()=>{if(!raceBgm)playRaceMusic();else raceBgm.paused?resumeRaceMusic():pauseRaceMusic()};
$('debugToggle').onclick=()=>setDebugPanel($('debugPanel').classList.contains('hidden'));
$('debugClose').onclick=()=>setDebugPanel(false);
$('debugCourseBounds').onclick=()=>{state.debug.showCourseLimits=!state.debug.showCourseLimits;updateDebugUI()};
setupSettings();
setupSoundTest();
setupDifficultySelection();
setupSetGrid();
updateDebugUI();
addEventListener('click',event=>{const button=event.target.closest?.('button');if(!button||button.closest('#mobileControls')||button.id==='musicToggle')return;if(button.classList.contains('icon-btn')||button.id.includes('Close')||button.id.startsWith('back'))playSfx('uiBack');else if(button.matches('.set-card,.course-card,.difficulty-card,[data-difficulty],.sound-test-machine,[data-sound-mode]'))playSfx('uiMove');else playSfx('uiConfirm')});

function resetMiaNpc(){
  clearTimeout(miaNpc.cutInTimer);
  Object.assign(miaNpc,{active:false,triggered:false,cutInActive:false,leaderTime:0,distance:0,progress:0,lane:0,aiTargetLane:0,aiVelocity:0,hit:0,spin:0,shield:0,invincible:0,aiItem:null,aiItemAge:0,jumpY:0,jumpVelocity:0,airborne:false,landed:false,routeChoice:null,routeLap:-1,routeMerged:false,routePhysicalProgress:0,routeNormalizedProgress:0,routeComparableDistance:0});
  const overlay=$('miaIntrusion');if(overlay)overlay.className='mia-intrusion hidden';
  if($('positionTotal'))$('positionTotal').textContent=`/${racers.length}`;
  delete canvas.dataset.miaBoss;delete canvas.dataset.miaGap;delete canvas.dataset.miaAirborne;delete canvas.dataset.miaFreezeDelta;
}
function addGimmickObject(type,z,lane,meta={}){const object={type,z,lane,...meta};if(type==='ramp')object.hitBy=new Set();else object.taken=false;state.objects.push(object);return object}
function addGimmickRow(base,row,layoutId,lap){const[z,type,patternName]=row,lanes=GIMMICK_LANE_PATTERNS[patternName]||GIMMICK_LANE_PATTERNS.center;for(let i=0;i<lanes.length;i++)addGimmickObject(type,base+z,lanes[i],{layoutId,layoutLap:lap,row:z,rowIndex:i})}
function spawnCourseGimmicks(length,laps){
  const layout=activeCourse?.gimmicks,graph=activeCourse?.routeGraph;if(!layout){for(let lap=0;lap<laps;lap++){const base=lap*length;addGimmickObject('coin',base+length*.32,0,{layoutId:'debug',layoutLap:lap});if(length>70)addGimmickObject('ramp',base+length*.58,0,{layoutId:'debug',layoutLap:lap})}return}
  for(let lap=0;lap<laps;lap++){
    const base=lap*length;for(const row of layout.rows)addGimmickRow(base,row,layout.id,lap);for(const[at,lane]of layout.ramps)if(at>24&&at<length-24)addGimmickObject('ramp',base+at,lane,{layoutId:layout.id,layoutLap:lap,row:at});
    if(graph){const branchZ=graph.start+(graph.end-graph.start)*.38,exitZ=graph.start+(graph.end-graph.start)*.7;for(const lane of[-1.08,-.86,-.64])addGimmickObject('item',base+branchZ,lane,{layoutId:layout.id,layoutLap:lap,route:'left',graphId:graph.id});for(const lane of[.64,.86,1.08])addGimmickObject('pad',base+branchZ,lane,{layoutId:layout.id,layoutLap:lap,route:'right',graphId:graph.id});for(const lane of[-1.02,-.72,.72,1.02])addGimmickObject('coin',base+exitZ,lane,{layoutId:layout.id,layoutLap:lap,route:lane<0?'left':'right',graphId:graph.id})}
  }
  canvas.dataset.gimmickLayout=layout.id;canvas.dataset.gimmickRows=String(layout.rows.length);canvas.dataset.gimmickRamps=String(layout.ramps.length);canvas.dataset.routeGraph=graph?.id||'none';
}
function resetRace(){
  clearTimeout(finishRace.timer);
  resetMiaNpc();
  resetAdaptiveQualitySamples();
  nearbyRivalAudioSlugs=new Set();canvas.dataset.rivalAudioCount='0';canvas.dataset.rivalAudio='';canvas.dataset.rivalAudioPan='';
  Object.assign(state,{running:false,paused:false,finish:false,finishTime:0,finishCoast:0,finishOrder:null,elapsed:0,lap:1,progress:0,distance:0,speed:0,x:0,steer:0,boosting:false,turbo:0,drift:0,driftLevel:0,item:null,shield:0,invincible:0,coins:0,raceWalletEarned:0,shake:0,rank:6,lastRank:6,trackCurve:0,centrifugal:0,surface:'road',offroadAmount:0,suspension:0,suspensionVelocity:0,jumpY:0,jumpVelocity:0,jumpView:0,landingBounce:0,landingBounceVelocity:0,airborne:false,cameraHeading:trackSample(0).heading,flash:0,collisionCooldown:3,objects:[],particles:[],collectFx:[],projectiles:[],countdownActive:true,startCharge:0,startPenalty:false,raceDifficulty:settings.raceDifficulty,raceRewards:[],overtakeUiCooldown:0,rocketWarningCooldown:0,routeChoice:null,routeLap:-1,routeMerged:false,routeCameraElevation:0});
  const overtake=$('overtakeCallout'),lockWarning=$('lockOnWarning');if(overtake)overtake.className='overtake-callout';if(lockWarning)lockWarning.className='lock-on-warning';$('hud')?.classList.remove('rocket-locked');
  Object.assign(itemRoulette,{active:false,time:0,final:null});$('itemIcon')?.closest('.item-box')?.classList.remove('rolling');$('goalFx')?.classList.add('hidden');$('app').classList.remove('goal-slow');
  const lanePattern=[-.62,.62,-.31,.31,0,-.7,.7,-.18,.18],length=raceLength(),laps=raceLaps();let ai=0;
  racers.forEach((r,i)=>{const player=i===state.selected,trait=r.trait,personality=r.aiPersonality;r.distance=player?0:38-ai*5.8;r.progress=r.distance/length;r.lane=player?0:lanePattern[ai%lanePattern.length];r.aiTargetLane=r.lane;r.laneTimer=(.48+(ai%4)*.16)*personality.rhythm;r.aiDecisionSeed=(i*7+state.selectedCourse*3)%11;r.aiBoostCooldown=1.1+(i%5)*.23;r.aiPassCommit=0;r.aiPassTarget=null;r.hit=0;r.spin=0;r.shield=0;r.invincible=0;r.aiSpeed=(136+r.set.stats.speed*.26+(ai%6)*2.2)*trait.topSpeed;r.aiAcceleration=trait.acceleration;r.aiVelocity=0;r.aiCoins=0;r.aiItem=null;r.aiItemAge=0;r.aiBoost=0;r.jumpY=0;r.jumpVelocity=0;r.airborne=false;r.lastPlayerGap=r.distance;r.routeChoice=null;r.routeLap=-1;r.routeMerged=false;r.routePhysicalProgress=0;r.routeNormalizedProgress=0;r.routeComparableDistance=r.distance;ai+=player?0:1});
  canvas.dataset.aiPersonalities=[...new Set(racers.map(r=>r.aiPersonality.key))].join(',');
  canvas.dataset.rocketLaunches='0';canvas.dataset.rocketHits='0';canvas.dataset.rocketOwner='';canvas.dataset.rocketTarget='';canvas.dataset.rocketHitOwner='';canvas.dataset.rocketHitTarget='';canvas.dataset.rocketHitBlocked='false';
  canvas.dataset.rocketWarning='none';canvas.dataset.aiItemUses='0';canvas.dataset.aiLastItem='';canvas.dataset.aiLastItemUser='';
  spawnCourseGimmicks(length,laps);
  const routeGuide=$('routeGuide');if(routeGuide)routeGuide.className='route-guide';
  drawHeldItem();updateHud();buildRank();
}
function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
function pickIntroRivals(){
  return racers
    .map((r,i)=>({r,i,score:r.set.stats.speed*1.05+r.set.stats.boost*.8+r.set.stats.handling*.55+Math.sin((i+1)*(state.selectedCourse+3))*7}))
    .filter(x=>x.i!==state.selected)
    .sort((a,b)=>b.score-a.score)
    .slice(0,3)
    .map(x=>x.r);
}
function drawIntroCourseMap(){
  const canvas=$('introCourseMap');if(!canvas)return;
  const g=canvas.getContext('2d'),theme=activeCourse.theme;
  const drawPath=()=>{
    g.beginPath();
    for(let i=0;i<=220;i++){
      const [px,py]=mapPoint(i/220),x=30+px*(canvas.width-60),y=20+py*(canvas.height-40);
      i?g.lineTo(x,y):g.moveTo(x,y);
    }
  };
  g.clearRect(0,0,canvas.width,canvas.height);
  g.save();
  const bg=g.createLinearGradient(0,0,canvas.width,canvas.height);
  bg.addColorStop(0,'rgba(13,12,46,.96)');
  bg.addColorStop(1,'rgba(52,19,82,.88)');
  g.fillStyle=bg;g.fillRect(0,0,canvas.width,canvas.height);
  g.lineJoin='round';g.lineCap='round';
  drawPath();g.strokeStyle='rgba(0,0,0,.72)';g.lineWidth=30;g.stroke();
  drawPath();g.strokeStyle=theme.curbA;g.lineWidth=22;g.stroke();
  drawPath();g.strokeStyle=theme.roadA;g.lineWidth=15;g.stroke();
  drawPath();g.strokeStyle=theme.accent;g.lineWidth=4;g.stroke();
  const start=trackSample(0),sx=30+start.x*(canvas.width-60),sy=20+start.y*(canvas.height-40);
  g.shadowColor=theme.lightB;g.shadowBlur=16;g.fillStyle='#fff';g.strokeStyle=theme.accent;g.lineWidth=3;
  g.beginPath();g.arc(sx,sy,9,0,7);g.fill();g.stroke();
  g.restore();
}
function drawIntroRacerCanvas(canvas,racer,frameIndex=3){
  if(!canvas||!racer)return;
  const frame=racer.frames?.[frameIndex]||racer.frames?.[10]||racer.frames?.[0],g=canvas.getContext('2d');
  g.clearRect(0,0,canvas.width,canvas.height);
  if(!frame)return;
  const scale=Math.min(canvas.width/frame.sw*.9,canvas.height/frame.sh*.96),w=frame.sw*scale,h=frame.sh*scale,x=(canvas.width-w)/2,y=canvas.height-h+5;
  g.imageSmoothingEnabled=true;
  g.shadowColor='rgba(0,0,0,.55)';g.shadowBlur=18;g.shadowOffsetY=10;
  g.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,x,y,w,h);
}
function renderIntroCourse(){
  const course=activeCourse;
  $('introCourseArt').src=course.art;
  $('introCourseArt').alt=course.name;
  $('introCourseName').textContent=course.name;
  $('introCourseStyle').textContent=`${course.style}  /  DIFFICULTY ${course.difficulty}`;
  drawIntroCourseMap();
}
function renderIntroRivals(rivals){
  $('introRivals').innerHTML=rivals.map((r,i)=>{const power=Math.min(100,Math.round((r.set.stats.speed+r.set.stats.boost+r.set.stats.technique)/3)),ai=r.aiPersonality;return`<article class="intro-rival-card ${i===0?'featured':''}" style="--rival-color:${r.color};--power:${power}%" data-index="RIVAL 0${i+1}"><div class="rival-lock">TARGET LOCK</div><img src="${r.portrait}" alt="${r.name}"><strong>${r.name}</strong><span>${ai.label} / ${ai.jp}</span><i><b></b></i><em>THREAT ${power}</em></article>`}).join('');
}
async function playRaceIntroSequence(){
  const overlay=$('raceIntro'),counter=$('introCount'),rivals=pickIntroRivals();
  overlay.className='race-intro course-phase';
  counter.textContent='';
  counter.className='intro-count';
  renderIntroCourse();
  await sleep(1450);
  overlay.className='race-intro rivals-phase';
  renderIntroRivals(rivals);
  await sleep(1650);
  overlay.className='race-intro grid-phase';
  await sleep(1180);
  for(const label of ['3','2','1','GO!']){
    $('countdown').textContent=label;
    counter.textContent=label;
    counter.className=`intro-count show ${label==='GO!'?'go':''}`;
    playSfx(label==='GO!'?'go':'countdown',{variant:label==='1'?1:0});
    await sleep(label==='GO!'?620:760);
    counter.className='intro-count';
  }
  overlay.className='race-intro hidden';
  $('countdown').textContent='';
  state.countdownActive=false;
  state.running=true;
  state.last=performance.now();
  if(state.startPenalty){
    state.speed=0;
    playSfx('collision',{intensity:.7});
    toast('TOO EARLY!');
  }else if(state.startCharge>=2){
    state.speed=115;
    state.turbo=1.25;
    playSfx('boost',{intensity:1.15});
    toast('START DASH!');
    spawnVfx(0,innerWidth/2,innerHeight*.8,.8);
  }
  burst(innerWidth/2,innerHeight*.72,18,'#6feaff');
}
async function startRace(){
  playRaceMusic();
  const fromResult=state.mode==='finish',button=fromResult?$('retry'):$('confirmDifficulty'),small=button.querySelector('small'),readyText=fromResult?'RETRY':'この難易度でスタート';button.disabled=true;small.textContent='RACE DATA LOADING...';
  try{await preloadRacePackage(state.selectedCourse,!fromResult)}catch(error){button.disabled=false;small.textContent='読み込みを再試行';toast('ASSET LOAD ERROR');return}
  button.disabled=false;small.textContent=readyText;activateCourse(state.selectedCourse);
  resetRace();$('finish').querySelector('.eyebrow').textContent=activeCourse.short;state.mode='race';showScreen(null);$('hud').classList.remove('hidden');
  const selected=racers[state.selected];window.NyanAudio?.startEngine(selected.slug,selected.set.stats);
  if(matchMedia('(pointer:coarse)').matches)$('mobileControls').classList.remove('hidden');
  await playRaceIntroSequence();
}

function raceComparableDistance(racer){return Number(racer?.distance)||0}
function raceOrder(){return[...raceContestants()].sort((a,b)=>raceComparableDistance(b)-raceComparableDistance(a))}
function buildRank(){
  const sorted=raceOrder(),player=racers[state.selected],playerIndex=sorted.indexOf(player);let shown=sorted.slice(0,6);
  if(!shown.includes(player)){shown=sorted.slice(0,4);shown.push(sorted[Math.max(4,playerIndex-1)],player);shown=[...new Set(shown)]}
  $('rankPanel').innerHTML=shown.map(r=>{const pos=sorted.indexOf(r)+1,gap=Math.round(r.distance-player.distance),label=player===r?'YOU':r===miaNpc?'BOSS':`${gap>0?'+':''}${gap}m`;return `<div class="rank-row ${player===r?'player':''}${r===miaNpc?' boss':''}"><span class="pos">${pos}</span><img src="${r.portrait}"><span class="rname">${r.name}</span><b>${label}</b></div>`}).join('');
}
function fmt(ms){const m=Math.floor(ms/60000),s=Math.floor(ms/1000)%60,x=Math.floor(ms%1000);return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(x).padStart(3,'0')}`}
function updateHud(){
  $('lap').textContent=Math.min(raceLaps(),state.lap);$('lapTotal').textContent=`/${raceLaps()}`;$('timer').textContent='◷ '+fmt(state.elapsed);$('speed').textContent=Math.round(state.speed);$('currentPosition').textContent=state.rank;drawSpeedGauge();
  $('coins').textContent=String(state.coins).padStart(2,'0');const charge=state.drift>0?Math.min(100,state.drift/2.25*100):state.turbo>0?100:0;$('boostBar').firstElementChild.style.width=charge+'%';
  drawMinimap();
}
function announceRank(oldRank,newRank){
  const el=$('rankChange'),improved=newRank<oldRank;playSfx(improved?'rankUp':'rankDown');el.textContent=`${improved?'▲':'▼'} ${newRank}${newRank===1?'st':newRank===2?'nd':newRank===3?'rd':'th'}`;el.className=`rank-change show ${improved?'up':'down'}`;clearTimeout(announceRank.t);announceRank.t=setTimeout(()=>el.className='rank-change',850)
}
function showOvertakeCallout(racer,playerPassed){
  const el=$('overtakeCallout');if(!el||!racer)return;
  const ai=racer.aiPersonality||{label:'BOSS ATTACK',jp:'乱入勝負',copy:'一気に仕掛けてきた。'},side=racer.lane<state.x?'left':'right';
  el.style.setProperty('--rival-color',racer.color||'#ff42a5');el.querySelector('img').src=racer.portrait;el.querySelector('img').alt=racer.name;
  el.querySelector('small').textContent=playerPassed?'OVERTAKE!':`${ai.label}!`;el.querySelector('strong').textContent=playerPassed?`${racer.name}をかわした!`:`${racer.name}が仕掛けた!`;el.querySelector('span').textContent=playerPassed?`${ai.jp}を攻略`:`${ai.jp}・${side==='left'?'左':'右'}から接近`;
  el.className=`overtake-callout show ${playerPassed?'player-pass':'rival-pass'} from-${side}`;clearTimeout(showOvertakeCallout.t);showOvertakeCallout.t=setTimeout(()=>el.className='overtake-callout',950);state.overtakeUiCooldown=.72;
}
function updatePlayerOvertakes(){
  const player=racers[state.selected],events=[];
  for(const racer of raceContestants()){
    if(racer===player)continue;const gap=racer.distance-state.distance,previous=racer.lastPlayerGap;
    if(state.elapsed>1250&&Number.isFinite(previous)){if(previous>=0&&gap<0)events.push({racer,playerPassed:true,gap});else if(previous<=0&&gap>0)events.push({racer,playerPassed:false,gap})}racer.lastPlayerGap=gap;
  }
  if(state.overtakeUiCooldown<=0&&events.length){events.sort((a,b)=>Math.abs(a.gap)-Math.abs(b.gap));showOvertakeCallout(events[0].racer,events[0].playerPassed)}
}
function aiTrafficScore(racer,lane,range=78){
  let score=Math.abs(lane)*.035;
  for(const other of raceContestants()){if(other===racer)continue;const dz=other.distance-racer.distance;if(dz<-8||dz>range)continue;const laneGap=Math.abs(other.lane-lane);score+=Math.max(0,1-laneGap/.42)*(1-dz/(range+12))}
  return score;
}
function aiOpenPassLane(racer,blocker,bendAhead,safeLimit){
  const ai=racer.aiPersonality,curveSide=Math.sign(bendAhead),inside=curveSide||ai.passSide,outside=curveSide?-curveSide:-ai.passSide;
  let candidates;if(ai.key==='apex')candidates=[inside*.58,inside*.36,outside*.52];else if(ai.key==='charger')candidates=[outside*.72,outside*.5,inside*.42];else if(ai.key==='sprinter')candidates=[-Math.sign(blocker?.lane||-ai.passSide)*.48,ai.passSide*.62,-ai.passSide*.62];else candidates=[ai.passSide*.64,-ai.passSide*.64,inside*.42];
  candidates=candidates.map(lane=>clamp(lane,-safeLimit,safeLimit));candidates.sort((a,b)=>aiTrafficScore(racer,a)-aiTrafficScore(racer,b));return candidates[0];
}
function aiDesiredRaceLine(racer,bendAhead,safeLimit){
  const ai=racer.aiPersonality,curveLine=clamp(bendAhead*.46*ai.lineGrip,-safeLimit,safeLimit);
  if(ai.key==='charger'&&Math.abs(bendAhead)<.24)return clamp(ai.passSide*.18,-safeLimit,safeLimit);
  if(ai.key==='booster')return clamp(curveLine*.62+ai.passSide*.12,-safeLimit,safeLimit);
  if(ai.key==='sprinter')return clamp(curveLine*.78+ai.passSide*.08,-safeLimit,safeLimit);
  return curveLine;
}

function drawSpeedGauge(){
  const c=$('speedGauge');if(!c)return;const g=c.getContext('2d'),w=c.width,h=c.height,cx=w/2,cy=h/2,r=96,max=240,p=Math.min(1,state.speed/max),start=Math.PI*.75,end=Math.PI*2.25;
  g.clearRect(0,0,w,h);const bg=g.createRadialGradient(cx,cy,20,cx,cy,r);bg.addColorStop(0,'rgba(35,46,95,.92)');bg.addColorStop(1,'rgba(7,8,28,.96)');g.fillStyle=bg;g.beginPath();g.arc(cx,cy,r,0,7);g.fill();g.strokeStyle='rgba(171,212,255,.5)';g.lineWidth=3;g.stroke();
  g.lineCap='round';g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=16;g.beginPath();g.arc(cx,cy,78,start,end);g.stroke();
  const grad=g.createLinearGradient(25,190,210,35);grad.addColorStop(0,'#42dfff');grad.addColorStop(.68,'#6b73ff');grad.addColorStop(1,'#ff4fc8');g.strokeStyle=grad;g.shadowColor=p>.8?'#ff4fc8':'#49e8ff';g.shadowBlur=15;g.beginPath();g.arc(cx,cy,78,start,start+(end-start)*p);g.stroke();g.shadowBlur=0;
  for(let i=0;i<=12;i++){const a=start+(end-start)*i/12,inner=i%3===0?64:69;g.strokeStyle=i/12<=p?'#fff':'#6d7195';g.lineWidth=i%3===0?3:1.5;g.beginPath();g.moveTo(cx+Math.cos(a)*inner,cy+Math.sin(a)*inner);g.lineTo(cx+Math.cos(a)*72,cy+Math.sin(a)*72);g.stroke()}
  const needle=start+(end-start)*p;g.strokeStyle='#fff';g.lineWidth=3;g.shadowColor='#49e8ff';g.shadowBlur=8;g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(needle)*55,cy+Math.sin(needle)*55);g.stroke();g.shadowBlur=0;g.fillStyle='#fff';g.beginPath();g.arc(cx,cy,6,0,7);g.fill();
}

// Corner-cut only the three loops that previously concentrated an entire
// hairpin in a single control point.  The 22% split keeps the course layout
// recognizable while turning the sharp tangent flip into a short, readable
// arc for the pseudo-3D projection.
function smoothLoopNodes(nodes,ratio=.22){
  const loop=nodes.slice(0,-1),smoothed=[];
  for(let i=0;i<loop.length;i++){
    const a=loop[i],b=loop[(i+1)%loop.length];
    smoothed.push(
      [a[0]*(1-ratio)+b[0]*ratio,a[1]*(1-ratio)+b[1]*ratio],
      [a[0]*ratio+b[0]*(1-ratio),a[1]*ratio+b[1]*(1-ratio)]
    );
  }
  smoothed.push([...smoothed[0]]);return smoothed;
}
const sweetsNodes=smoothLoopNodes([
  [.32,.38],[.23,.44],[.15,.47],[.105,.37],[.12,.24],[.205,.15],[.33,.13],[.43,.22],[.53,.13],[.68,.14],[.79,.22],[.82,.34],
  [.75,.43],[.63,.48],[.68,.55],[.80,.61],[.82,.73],[.74,.85],[.60,.88],[.49,.79],[.43,.67],[.34,.74],[.21,.80],[.12,.71],
  [.12,.59],[.22,.52],[.34,.51],[.44,.59],[.53,.54],[.54,.44],[.45,.38],[.32,.38]
]);
const steamNodes=smoothLoopNodes([
  [.49,.82],[.32,.84],[.18,.76],[.25,.65],[.43,.58],[.31,.51],[.16,.58],[.10,.44],[.18,.29],[.34,.26],[.46,.18],[.61,.20],
  [.76,.16],[.86,.30],[.82,.49],[.70,.56],[.78,.72],[.66,.85],[.49,.82]
]);
const neonNodes=[
  [.14,.42],[.10,.26],[.24,.17],[.43,.22],[.58,.12],[.78,.20],[.68,.35],[.82,.45],[.78,.70],[.62,.78],[.53,.62],[.39,.74],[.19,.68],[.28,.51],[.14,.42]
];
const rainNodes=[
  [.14,.74],[.10,.56],[.18,.37],[.11,.22],[.31,.14],[.50,.17],[.68,.11],[.85,.24],[.82,.43],[.72,.55],[.82,.73],[.65,.84],[.45,.78],[.31,.86],[.14,.74]
];
const royalNodes=[
  [.14,.64],[.18,.42],[.28,.24],[.48,.17],[.70,.20],[.84,.34],[.78,.52],[.86,.70],[.67,.82],[.48,.75],[.31,.85],[.16,.75],[.14,.64]
];
const auroraNodes=smoothLoopNodes([
  [.13,.58],[.18,.38],[.33,.22],[.54,.15],[.74,.22],[.86,.39],[.78,.54],[.62,.49],[.70,.70],[.55,.85],[.35,.80],[.22,.67],[.13,.58]
]);
const jungleNodes=[
  [.26,.54],[.14,.44],[.22,.27],[.40,.20],[.58,.30],[.76,.18],[.86,.36],[.73,.52],[.84,.70],[.66,.84],[.48,.74],[.38,.84],
  [.22,.86],[.12,.76],[.16,.62],[.26,.54]
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
  {name:'きらめきスイーツサーキット',short:'TWINKLE SWEETS',style:'テクニカル＆トリッキー',difficulty:'★★★☆☆',art:'assets/environment/course-sweets.webp',crop:{x:.47,y:.12,w:.52,h:.50},nodes:sweetsNodes,startLine:45,heights:[0,.08,.22,.48,.62,.42,.12,-.12,-.26,-.08,.24,.58,.72,.5,.18,-.1,-.3,-.14,.18,.5,.38,.1,-.2,-.08],tunnels:[[575,735],[1325,1465]],useCandyProps:true,theme:{vergeA:'#c85f91',vergeB:'#e487ad',curbA:'#fff8ef',curbB:'#f05291',roadA:'#4e4f5b',roadB:'#5d5e6a',lane:'rgba(220,240,255,.78)',accent:'#55baf4',railA:'#fff8ef',railB:'#f05291',tunnelSide:'rgba(54,27,78,.96)',tunnelSide2:'rgba(43,22,68,.97)',tunnelRoof:'rgba(28,17,57,.97)',lightA:'#ff76bd',lightB:'#72e9ff'}},
  {name:'ギアクロック・スチームサーキット',short:'GEAR CLOCK',style:'重量級テクニカル',difficulty:'★★★★☆',art:'assets/environment/course-steam.webp',crop:{x:.50,y:.13,w:.49,h:.50},nodes:steamNodes,startLine:35,heights:[0,.18,.42,.28,-.12,-.32,-.05,.3,.58,.72,.4,.08,-.18,.12,.46,.68,.3,-.1,-.24,.08],tunnels:[[360,520],[1120,1275]],useCandyProps:false,theme:{vergeA:'#4e321f',vergeB:'#2f231a',curbA:'#d8903d',curbB:'#211a17',roadA:'#34363a',roadB:'#44474c',lane:'rgba(255,198,104,.72)',accent:'#55cfff',railA:'#d68b3e',railB:'#25201c',tunnelSide:'rgba(69,45,29,.98)',tunnelSide2:'rgba(46,34,28,.98)',tunnelRoof:'rgba(29,25,24,.98)',lightA:'#ff9f3f',lightB:'#61dfff'}},
  {name:'ネオンスカイラインサーキット',short:'NEON SKYLINE',style:'スピード＆テクニカル',difficulty:'★★★★☆',art:'assets/environment/course-neon.webp',crop:{x:.46,y:.13,w:.53,h:.49},nodes:neonNodes,heights:[0,.22,.5,.78,.54,.16,-.2,-.4,-.08,.34,.66,.82,.4,.05,-.22,.12],tunnels:[[430,610],[980,1190]],useCandyProps:false,theme:{vergeA:'#15103d',vergeB:'#25155b',curbA:'#59e9ff',curbB:'#fa4fd0',roadA:'#171d35',roadB:'#242b4b',lane:'rgba(101,234,255,.82)',accent:'#49ecff',railA:'#52eaff',railB:'#f34cd4',tunnelSide:'rgba(21,13,61,.98)',tunnelSide2:'rgba(35,11,68,.98)',tunnelRoof:'rgba(8,8,35,.99)',lightA:'#ff45dc',lightB:'#54f4ff'}},
  {name:'レインドロップ・アンブレラサーキット',short:'RAIN UMBRELLA',style:'バランス＆ギミック',difficulty:'★★★☆☆',art:'assets/environment/course-rain.webp',crop:{x:.50,y:.13,w:.49,h:.49},nodes:rainNodes,heights:[0,.1,.26,.42,.32,.08,-.12,-.26,-.08,.2,.42,.58,.36,.08,-.18,-.28,.02],tunnels:[[645,835]],useCandyProps:false,theme:{vergeA:'#91c8da',vergeB:'#b7dce7',curbA:'#f8fdff',curbB:'#4aaee7',roadA:'#526575',roadB:'#667988',lane:'rgba(230,250,255,.9)',accent:'#58cfff',railA:'#f6fbff',railB:'#5baada',tunnelSide:'rgba(128,188,216,.72)',tunnelSide2:'rgba(103,163,196,.74)',tunnelRoof:'rgba(156,213,235,.62)',lightA:'#ffffff',lightB:'#72dfff'}},
  {name:'ロイヤルスイーツ・キャッスルサーキット',short:'ROYAL CASTLE',style:'バランス＆ギミック',difficulty:'★★★☆☆',art:'assets/environment/course-royal.webp',crop:{x:.51,y:.14,w:.48,h:.48},nodes:royalNodes,heights:[0,.16,.38,.56,.48,.2,-.08,-.22,.02,.32,.54,.36,.08,-.16,.04],tunnels:[[510,665],[1210,1360]],useCandyProps:true,theme:{vergeA:'#ed8fa8',vergeB:'#f5b0bf',curbA:'#fff7e5',curbB:'#e94e83',roadA:'#695650',roadB:'#7a6259',lane:'rgba(255,247,224,.84)',accent:'#65cfff',railA:'#fff5e7',railB:'#ed5b8e',tunnelSide:'rgba(91,35,65,.96)',tunnelSide2:'rgba(65,25,54,.97)',tunnelRoof:'rgba(43,18,48,.98)',lightA:'#ff79b5',lightB:'#ffe27a'}}
];
const addedCourseData=[
  {name:'オーロラクリスタルグレイシャー',short:'AURORA GLACIER',style:'ハイスピード＆アイスライン',difficulty:'★★★★☆',art:'assets/environment/course-aurora.webp',crop:{x:.48,y:.12,w:.50,h:.50},nodes:auroraNodes,heights:[0,.24,.52,.82,.58,.18,-.18,-.34,.04,.42,.74,.46,.08,-.22,.12],tunnels:[[460,620],[1180,1325]],useCandyProps:false,propTheme:'rain',rampRow:3,theme:{vergeA:'#b8e8ff',vergeB:'#d8f6ff',curbA:'#f9ffff',curbB:'#6bdcff',roadA:'#455c78',roadB:'#58708c',lane:'rgba(226,252,255,.88)',accent:'#8b66ff',railA:'#ecffff',railB:'#72dfff',tunnelSide:'rgba(55,82,118,.9)',tunnelSide2:'rgba(28,54,92,.94)',tunnelRoof:'rgba(18,33,70,.96)',lightA:'#75f0ff',lightB:'#b98cff'}},
  {name:'エメラルドジャングル遺跡サーキット',short:'EMERALD RUINS',style:'ワイルド＆テクニカル',difficulty:'★★★★☆',art:'assets/environment/course-jungle.webp',crop:{x:.49,y:.13,w:.50,h:.50},nodes:jungleNodes,startLine:35,heights:[0,.1,.36,.22,-.18,-.34,.08,.44,.68,.28,-.1,.32,.58,.2,-.24,.04],tunnels:[[300,470],[1040,1220]],useCandyProps:false,propTheme:'steam',rampRow:1,theme:{vergeA:'#204c2d',vergeB:'#2f7041',curbA:'#e4c45a',curbB:'#315126',roadA:'#4a4938',roadB:'#5d5a42',lane:'rgba(255,226,128,.72)',accent:'#37f0b2',railA:'#d6b553',railB:'#24411f',tunnelSide:'rgba(30,48,24,.97)',tunnelSide2:'rgba(23,38,19,.98)',tunnelRoof:'rgba(17,27,15,.98)',lightA:'#50ff9e',lightB:'#ffd96a'}},
  {name:'さくら湯けむり温泉サーキット',short:'SAKURA ONSEN',style:'フロー＆ドリフト',difficulty:'★★★☆☆',art:'assets/environment/course-sakura.webp',crop:{x:.48,y:.12,w:.51,h:.50},nodes:sakuraNodes,heights:[0,.16,.34,.52,.24,-.08,-.2,.12,.38,.62,.28,-.12,-.26,.08],tunnels:[[610,780]],useCandyProps:false,propTheme:'royal',rampRow:4,theme:{vergeA:'#e78da7',vergeB:'#f5bfd0',curbA:'#fff7ee',curbB:'#e85986',roadA:'#5a504b',roadB:'#6e625b',lane:'rgba(255,244,220,.86)',accent:'#ff8fc4',railA:'#fff1df',railB:'#d97b8d',tunnelSide:'rgba(85,43,57,.93)',tunnelSide2:'rgba(61,34,48,.96)',tunnelRoof:'rgba(38,24,38,.98)',lightA:'#ff9ec7',lightB:'#ffe4a8'}},
  {name:'コーラルアクアパレスサーキット',short:'CORAL PALACE',style:'ウェーブ＆ライン取り',difficulty:'★★★★☆',art:'assets/environment/course-coral.webp',crop:{x:.48,y:.12,w:.51,h:.50},nodes:coralNodes,heights:[0,.14,.34,.64,.44,.08,-.18,-.38,-.1,.26,.54,.72,.36,-.04,-.24,.12],tunnels:[[540,705],[1300,1440]],useCandyProps:false,propTheme:'rain',rampRow:3,theme:{vergeA:'#4fc7c9',vergeB:'#83e5df',curbA:'#fff5e7',curbB:'#ff8bb8',roadA:'#3b6f83',roadB:'#4f8498',lane:'rgba(219,255,255,.86)',accent:'#ff83c7',railA:'#ffe8f1',railB:'#5ee6eb',tunnelSide:'rgba(31,93,120,.86)',tunnelSide2:'rgba(24,72,99,.9)',tunnelRoof:'rgba(16,48,78,.94)',lightA:'#7df8ff',lightB:'#ff96d1'}},
  {name:'ファントムカーニバルナイトサーキット',short:'PHANTOM NIGHT',style:'ナイト＆ギミック',difficulty:'★★★★★',art:'assets/environment/course-phantom.webp',crop:{x:.49,y:.12,w:.50,h:.50},nodes:phantomNodes,heights:[0,.28,.58,.38,.02,-.26,.18,.52,.8,.46,.1,-.22,.08,.36,-.18],tunnels:[[405,590],[905,1075],[1380,1510]],useCandyProps:false,propTheme:'neon',rampRow:2,theme:{vergeA:'#1b1038',vergeB:'#2d1453',curbA:'#ff9d3d',curbB:'#8e49ff',roadA:'#211f35',roadB:'#312a4d',lane:'rgba(255,180,85,.76)',accent:'#ff59e6',railA:'#ffb55b',railB:'#7436c8',tunnelSide:'rgba(26,12,52,.98)',tunnelSide2:'rgba(42,14,64,.98)',tunnelRoof:'rgba(12,8,31,.99)',lightA:'#ff7a36',lightB:'#b35cff'}},
  {name:'ルナティックコロニーサーキット',short:'LUNATIC COLONY',style:'低重力ハイスピード',difficulty:'★★★★★',art:'assets/environment/course-lunatic.webp',crop:{x:.48,y:.12,w:.51,h:.50},nodes:lunaticNodes,heights:[0,.22,.54,.86,.58,.2,-.16,.24,.64,.9,.5,.08,-.24,.18,.48,-.08],tunnels:[[350,535],[760,930],[1215,1390]],useCandyProps:false,propTheme:'neon',rampRow:2,theme:{vergeA:'#232b42',vergeB:'#35405f',curbA:'#6ff1ff',curbB:'#a66bff',roadA:'#202538',roadB:'#30384f',lane:'rgba(129,242,255,.82)',accent:'#90f7ff',railA:'#6befff',railB:'#8f67ff',tunnelSide:'rgba(27,30,55,.98)',tunnelSide2:'rgba(18,22,43,.99)',tunnelRoof:'rgba(8,10,29,.99)',lightA:'#60efff',lightB:'#ad80ff'}}
];
const debugPodiumNodes=[
  [.19,.62],[.24,.40],[.42,.31],[.66,.35],[.79,.52],[.68,.71],[.42,.75],[.22,.68],[.19,.62]
];
const debugCourseData={debugOnly:true,autoDrive:true,name:'表彰台テストサーキット',short:'PODIUM TEST',style:'DEBUG / 超短距離',difficulty:'TEST',art:'assets/environment/course-sweets.webp',crop:{x:.47,y:.12,w:.52,h:.50},nodes:debugPodiumNodes,startLine:28,finishDistance:50,totalLaps:1,heights:[0,.08,.18,.1,-.02,.06,0],tunnels:[],useCandyProps:true,propTheme:'sweets',rampRow:0,theme:{...courseData[0].theme,accent:'#ffe85d',lane:'rgba(255,255,255,.86)'}};
courseData.push(...addedCourseData,debugCourseData);
const GIMMICK_LANE_PATTERNS={wide:[-.62,-.31,0,.31,.62],triple:[-.5,0,.5],split:[-.58,-.26,.26,.58],left:[-.72,-.5,-.28],right:[.28,.5,.72],center:[0]};
const COURSE_GIMMICK_LAYOUTS=[
  {id:'sweets',ramps:[[230,-.18],[1040,.32]],rows:[[140,'coin','wide'],[360,'item','triple'],[520,'pad','split'],[790,'coin','right'],[930,'item','split'],[1170,'pad','triple'],[1510,'coin','wide'],[1680,'item','triple']]},
  {id:'steam',ramps:[[210,.2],[890,-.3]],rows:[[140,'coin','wide'],[300,'item','triple'],[560,'pad','split'],[710,'coin','left'],[980,'item','split'],[1080,'coin','right'],[1305,'pad','triple'],[1540,'item','wide'],[1700,'coin','wide']]},
  {id:'neon',ramps:[[220,-.22],[820,.28]],rows:[[150,'coin','wide'],[330,'item','triple'],[650,'pad','split'],[750,'coin','right'],[900,'item','split'],[1230,'coin','left'],[1450,'pad','triple'],[1650,'item','wide']]},
  {id:'rain',ramps:[[240,.18],[1040,-.3]],rows:[[150,'coin','wide'],[350,'item','triple'],[560,'pad','split'],[870,'coin','left'],[1010,'item','split'],[1220,'pad','triple'],[1450,'coin','wide'],[1660,'item','wide']]},
  {id:'royal',ramps:[[230,-.2],[900,.3]],rows:[[150,'coin','wide'],[350,'item','triple'],[700,'pad','split'],[820,'coin','right'],[1040,'item','split'],[1160,'coin','left'],[1400,'pad','triple'],[1600,'item','wide']]},
  {id:'aurora',ramps:[[230,.2],[900,-.3]],rows:[[150,'coin','wide'],[350,'item','triple'],[660,'pad','split'],[810,'coin','left'],[1010,'item','split'],[1120,'coin','right'],[1360,'pad','triple'],[1600,'item','wide']]},
  {id:'jungle',ramps:[[180,-.18],[850,.3]],rows:[[130,'coin','wide'],[270,'item','triple'],[510,'pad','split'],[680,'coin','right'],[900,'item','split'],[990,'coin','left'],[1260,'pad','triple'],[1510,'item','wide'],[1690,'coin','wide']]},
  {id:'sakura',ramps:[[240,.2],[1050,-.28]],rows:[[150,'coin','wide'],[350,'item','triple'],[560,'pad','split'],[820,'coin','left'],[980,'item','split'],[1180,'pad','triple'],[1450,'coin','wide'],[1650,'item','wide']]},
  {id:'coral',ramps:[[240,-.2],[990,.3]],rows:[[150,'coin','wide'],[360,'item','triple'],[500,'pad','split'],[740,'coin','right'],[900,'item','split'],[1120,'pad','triple'],[1260,'coin','left'],[1480,'item','wide'],[1680,'coin','wide']]},
  {id:'phantom',ramps:[[220,.2],[760,-.3]],rows:[[150,'coin','wide'],[350,'item','triple'],[630,'pad','split'],[790,'coin','left'],[860,'item','split'],[1110,'coin','right'],[1300,'pad','triple'],[1540,'item','wide'],[1700,'coin','wide']]},
  {id:'lunatic',ramps:[[210,-.2],[1080,.3]],rows:[[140,'coin','wide'],[300,'item','triple'],[570,'pad','split'],[700,'coin','right'],[960,'item','split'],[1120,'coin','left'],[1420,'pad','triple'],[1600,'item','wide'],[1720,'coin','wide']]}
];
const ROUTE_EDGE_PROFILES=[
  {left:[1.12,-.16,.22],right:[.91,.11,-.08]},
  {left:[1.08,.13,.18],right:[.93,-.18,-.12]},
  {left:[1.15,-.2,-.08],right:[.89,.16,.2]},
  {left:[1.1,.18,.14],right:[.92,-.12,-.18]},
  {left:[1.13,-.14,.24],right:[.9,.2,-.06]},
  {left:[1.11,.16,.28],right:[.92,-.17,-.16]},
  {left:[1.16,-.22,.2],right:[.88,.13,-.2]},
  {left:[1.09,.2,.16],right:[.94,-.15,-.1]},
  {left:[1.14,-.18,-.12],right:[.9,.18,.22]},
  {left:[1.12,.14,-.2],right:[.91,-.2,.12]},
  {left:[1.17,-.2,.26],right:[.87,.17,-.14]}
];
function makeRouteGraph(id,start,end,leftLabel,rightLabel,profileIndex=0){
  const span=end-start,profile=ROUTE_EDGE_PROFILES[profileIndex]||ROUTE_EDGE_PROFILES[0],makeBranch=(route,side,label,perk)=>{const [lengthScale,curveBias,hillBias]=profile[route];return{id:route,side,label,perk,lengthScale,physicalLength:span*lengthScale,curveBias,hillBias,timeDelta:Math.round(span*(lengthScale-1))}};
  return{id,start,end,geometry:{model:'independent-route-edges-v3',visualGap:.31,visualSpread:.25,laneGap:.36,laneSpread:.34},nodes:[{id:`${id}-entry`,type:'entry',at:start},{id:`${id}-left`,type:'branch',side:-1,at:(start+end)/2},{id:`${id}-right`,type:'branch',side:1,at:(start+end)/2},{id:`${id}-merge`,type:'merge',at:end}],edges:[{from:`${id}-entry`,to:`${id}-left`,route:'left',length:span*profile.left[0]*.5},{from:`${id}-entry`,to:`${id}-right`,route:'right',length:span*profile.right[0]*.5},{from:`${id}-left`,to:`${id}-merge`,route:'left',length:span*profile.left[0]*.5},{from:`${id}-right`,to:`${id}-merge`,route:'right',length:span*profile.right[0]*.5}],branches:{left:makeBranch('left',-1,leftLabel,'ITEM / SCENIC'),right:makeBranch('right',1,rightLabel,'SHORT / BOOST')}}
}
const COURSE_ROUTE_GRAPHS=[
  makeRouteGraph('sugar-split',820,1010,'SUGAR ARC','CREAM DASH',0),makeRouteGraph('gear-split',690,900,'GEAR LINE','STEAM BOOST',1),makeRouteGraph('neon-split',690,880,'LASER ARC','NITRO LANE',2),makeRouteGraph('rain-split',900,1090,'AQUA CURVE','RAIN DASH',3),makeRouteGraph('royal-split',760,950,'CROWN ARC','GOLD BOOST',4),makeRouteGraph('aurora-split',740,930,'CRYSTAL ARC','AURORA DASH',5),makeRouteGraph('jungle-split',620,820,'RUINS PATH','VINE BOOST',6),makeRouteGraph('sakura-split',900,1090,'SAKURA ARC','ONSEN DASH',7),makeRouteGraph('coral-split',810,1010,'CORAL ARC','BUBBLE DASH',8),makeRouteGraph('phantom-split',630,830,'GHOST PATH','NIGHT BOOST',9),makeRouteGraph('lunatic-split',970,1160,'MOON ARC','ORBIT DASH',10)
];
for(let i=0;i<Math.min(11,courseData.length);i++){courseData[i].gimmicks=COURSE_GIMMICK_LAYOUTS[i];courseData[i].routeGraph=COURSE_ROUTE_GRAPHS[i]}
// The jungle loop has back-to-back S bends.  Give its distant projection a
// slightly longer look-ahead than the standard courses so the road reads as
// one continuous curve instead of twitching at the horizon.
const emeraldRuinsCourse=courseData.find(course=>course.short==='EMERALD RUINS');
if(emeraldRuinsCourse)emeraldRuinsCourse.projection={window:4.8,response:.31,clamp:.072,gain:.27};
courseImages=courseData.map(()=>null);courseImagePromises=courseData.map(()=>null);activeCourse=courseData[0];
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
function routeDistanceInfo(distance){const graph=activeCourse?.routeGraph,length=raceLength();if(!graph||length<=0)return null;const lap=Math.max(0,Math.floor(Math.max(0,distance)/length)),phase=distance-lap*length;return{graph,lap,phase,start:lap*length+graph.start,end:lap*length+graph.end}}
function routeGeometryAt(distance){
  const info=routeDistanceInfo(distance);if(!info||info.phase<info.graph.start||info.phase>info.graph.end)return null;
  const t=clamp((info.phase-info.graph.start)/Math.max(1,info.graph.end-info.graph.start),0,1),fork=Math.pow(Math.max(0,Math.sin(t*Math.PI)),.82),model=info.graph.geometry||{},visualInner=(model.visualGap??.31)*fork,visualOuter=1+(model.visualSpread??.25)*fork,laneInner=(model.laneGap??.36)*fork,laneOuter=1+(model.laneSpread??.34)*fork,visualHalf=(visualOuter-visualInner)*.5,laneHalf=(laneOuter-laneInner)*.5,visualCenter=(visualInner+visualOuter)*.5,laneCenter=(laneInner+laneOuter)*.5;
  const branches={};for(const branch of Object.values(info.graph.branches)){const curveWave=branch.curveBias*fork*Math.sin(t*Math.PI*2),elevation=branch.hillBias*Math.pow(Math.sin(t*Math.PI),2);branches[branch.id]={...branch,visualCenter:branch.side*visualCenter+curveWave,laneCenter:branch.side*laneCenter+curveWave*.62,visualHalf,laneHalf,elevation,mapOffset:branch.side*fork*.065+curveWave*.025,normalizedProgress:t,physicalProgress:t*branch.physicalLength}}
  return{...info,t,fork,visualInner,visualOuter,visualCenter,laneInner,laneOuter,laneCenter,visualHalf,laneHalf,branches}
}
function chooseRouteForRacer(racer,distance,player=false){const info=routeDistanceInfo(distance);if(!info||info.phase<info.graph.start-34||info.phase>info.graph.end)return null;if(racer.routeLap!==info.lap){let side;if(player){const lane=Math.abs(state.x)>.06?state.x:state.steer;side=lane<0?-1:1}else{const ai=racer.aiPersonality,key=ai?.key;side=key==='apex'||key==='tactician'?-1:key==='charger'||key==='booster'?1:((racer.aiDecisionSeed||0)+info.lap+state.selectedCourse)%2?-1:1}racer.routeChoice=side<0?'left':'right';racer.routeLap=info.lap;racer.routeMerged=false;if(player){state.routeChoice=racer.routeChoice;state.routeLap=info.lap;state.routeMerged=false;const branch=info.graph.branches[racer.routeChoice],delta=branch.timeDelta;toast(`${branch.label} / ${delta>0?`+${delta}m`:`${delta}m`}`);playSfx('uiMove',{intensity:.68})}}return info}
function routeStateForRacer(racer,distance){const info=routeDistanceInfo(distance);if(!info)return null;chooseRouteForRacer(racer,distance,racer===racers[state.selected]);const geometry=routeGeometryAt(distance),branch=racer.routeLap===info.lap?info.graph.branches[racer.routeChoice]:null,path=branch&&geometry?geometry.branches[branch.id]:null,active=!!path&&info.phase>=info.graph.start&&info.phase<=info.graph.end,t=geometry?.t??clamp((info.phase-info.graph.start)/Math.max(1,info.graph.end-info.graph.start),0,1);return{...info,geometry,branch,path,active,t,center:path?.laneCenter||0,physicalProgress:path?.physicalProgress||0,comparableDistance:distance}}
function advanceRouteDistance(racer,distance,physicalDelta,player=false){
  if(!(physicalDelta>0))return distance;const info=routeDistanceInfo(distance);if(!info)return distance+physicalDelta;chooseRouteForRacer(racer,distance,player);const branch=racer.routeLap===info.lap?info.graph.branches[racer.routeChoice]:null;
  let next=distance;if(info.phase<info.graph.start){const toFork=info.graph.start-info.phase;if(physicalDelta<=toFork)return distance+physicalDelta;next=info.start+(physicalDelta-toFork)/(branch?.lengthScale||1)}else if(info.phase<=info.graph.end&&branch){const toMergeCanonical=info.graph.end-info.phase,toMergePhysical=toMergeCanonical*branch.lengthScale;if(physicalDelta<=toMergePhysical)next=distance+physicalDelta/branch.lengthScale;else next=info.end+(physicalDelta-toMergePhysical)}else next=distance+physicalDelta;
  const nextInfo=routeDistanceInfo(next),sameLap=nextInfo?.lap===info.lap;if(branch&&sameLap&&nextInfo.phase>=info.graph.start&&nextInfo.phase<=info.graph.end){const t=clamp((nextInfo.phase-info.graph.start)/(info.graph.end-info.graph.start),0,1);racer.routePhysicalProgress=t*branch.physicalLength;racer.routeNormalizedProgress=t;racer.routeComparableDistance=next}else if(branch&&next>=info.end){racer.routePhysicalProgress=branch.physicalLength;racer.routeNormalizedProgress=1;racer.routeComparableDistance=next;racer.routeMerged=true}
  return next
}
function sameActiveRouteEdge(a,aDistance,b,bDistance){const ai=routeDistanceInfo(aDistance),bi=routeDistanceInfo(bDistance);if(!ai||!bi||ai.lap!==bi.lap||ai.graph!==bi.graph)return true;const aActive=ai.phase>=ai.graph.start&&ai.phase<=ai.graph.end,bActive=bi.phase>=bi.graph.start&&bi.phase<=bi.graph.end;if(!aActive||!bActive)return true;return a.routeLap===ai.lap&&b.routeLap===bi.lap&&a.routeChoice===b.routeChoice}
function updateRouteGuide(){const guide=$('routeGuide'),info=routeDistanceInfo(state.distance);if(!guide||!info){guide?.classList.remove('show','active','choice-left','choice-right');return}const approach=info.graph.start-info.phase,show=approach<245&&info.phase<info.graph.end+22;if(!show){guide.classList.remove('show','active','choice-left','choice-right');return}const player=racers[state.selected],choice=player.routeLap===info.lap?player.routeChoice:null,left=info.graph.branches.left,right=info.graph.branches.right,metric=branch=>`${branch.timeDelta>0?'+':''}${branch.timeDelta}m`;guide.className=`route-guide show${choice?` active choice-${choice}`:''}`;guide.querySelector('.route-left').textContent=`‹ ${left.label} ${metric(left)}`;guide.querySelector('.route-right').textContent=`${right.label} ${metric(right)} ›`;guide.querySelector('strong').textContent=choice?`${info.graph.branches[choice].perk} · ${metric(info.graph.branches[choice])}`:approach>0?`${Math.ceil(approach)}m`:'CHOOSE'}
function updatePlayerRoute(previousDistance,dt){
  const player=racers[state.selected],route=routeStateForRacer(player,state.distance);if(!route){canvas.dataset.routeMerged=String(!!player.routeMerged);updateRouteGuide();return}
  if(route.active&&route.path&&route.geometry?.fork>.035){const min=route.path.laneCenter-route.path.laneHalf+.025,max=route.path.laneCenter+route.path.laneHalf-.025,inner=route.branch.side<0?max:min;if(route.branch.side*state.x<route.branch.side*inner){const target=inner+route.branch.side*.045;state.x+=(target-state.x)*Math.min(1,dt*(5.8+route.geometry.fork*3.4))}state.x=clamp(state.x,min-.05,max+.05)}
  if(player.routeLap===route.lap&&route.phase>route.graph.end&&!player.routeMerged){player.routeMerged=true;state.routeMerged=true;toast('ROUTE MERGE!')}
  canvas.dataset.routeChoice=player.routeChoice||'none';canvas.dataset.routeLap=String(player.routeLap);canvas.dataset.routePhase=route.phase.toFixed(1);canvas.dataset.routeMerged=String(!!player.routeMerged);canvas.dataset.routeGap=(route.geometry?.fork||0).toFixed(3);canvas.dataset.routePhysicalProgress=(player.routePhysicalProgress||0).toFixed(1);canvas.dataset.routeComparableDistance=(player.routeComparableDistance??state.distance).toFixed(1);updateRouteGuide()
}
function drawMinimap(){
  const c=$('courseMap');if(!c)return;const m=c.getContext('2d');m.clearRect(0,0,c.width,c.height);
  const theme=activeCourse?.theme||courseData[0].theme;m.save();m.lineJoin='round';m.lineCap='round';const drawPath=()=>{m.beginPath();for(let i=0;i<=180;i++){const [px,py]=mapPoint(i/180),x=12+px*(c.width-24),y=9+py*(c.height-18);i?m.lineTo(x,y):m.moveTo(x,y)}};drawPath();m.strokeStyle='rgba(25,12,35,.9)';m.lineWidth=18;m.stroke();drawPath();m.strokeStyle=theme.curbA;m.lineWidth=12;m.stroke();drawPath();m.strokeStyle=theme.accent;m.lineWidth=4;m.stroke();const graph=activeCourse?.routeGraph;if(graph){for(const branch of Object.values(graph.branches)){m.beginPath();for(let i=0;i<=32;i++){const t=i/32,distance=graph.start+(graph.end-graph.start)*t,progress=distance/raceLength(),sample=trackSample(progress),geometry=routeGeometryAt(distance),offset=geometry?.branches[branch.id]?.mapOffset??branch.side*Math.sin(t*Math.PI)*.065,px=sample.x-sample.ty*offset,py=sample.y+sample.tx*offset,x=12+px*(c.width-24),y=9+py*(c.height-18);i?m.lineTo(x,y):m.moveTo(x,y)}m.strokeStyle=branch.side<0?theme.lightA:theme.lightB;m.lineWidth=6;m.stroke()}}m.restore();
  const sorted=[...raceContestants()].sort((a,b)=>a.distance-b.distance);
  for(const r of sorted){const sample=trackSample(r.progress),geometry=routeGeometryAt(r.distance),routePath=geometry&&r.routeLap===geometry.lap?geometry.branches[r.routeChoice]:null,offset=routePath?.mapOffset||0,px=sample.x-sample.ty*offset,py=sample.y+sample.tx*offset,isPlayer=r===racers[state.selected],isMia=r===miaNpc,x=12+px*(c.width-24),y=9+py*(c.height-18);m.save();m.shadowColor=isPlayer?'#63eaff':isMia?'#ff3f9f':'#000';m.shadowBlur=isPlayer?12:isMia?16:4;m.fillStyle=isPlayer?'#54e8ff':r.color;m.strokeStyle=isMia?'#fff0fa':'#fff';m.lineWidth=isPlayer?3:isMia?2.5:1.5;m.beginPath();if(isMia){m.moveTo(x,y-8);m.lineTo(x+7,y+5);m.lineTo(x-7,y+5);m.closePath()}else m.arc(x,y,isPlayer?7:4,0,7);m.fill();m.stroke();m.restore()}
  canvas.dataset.routeMinimapModel='independent-branches-v1';canvas.dataset.routeRankingModel='normalized-merge-v1';
}
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>$('toast').classList.remove('show'),900)}

addEventListener('keydown',e=>{
  if(captureAction){e.preventDefault();if(e.code==='Backspace'){captureAction=null;renderKeyConfig();$('keyCaptureHelp').textContent='キー変更をキャンセルしました。'}else finishKeyCapture(captureAction,e.code);return}
  if(state.mode==='soundTest'&&e.code==='Escape'){e.preventDefault();closeSoundTest();return}
  if(state.mode==='race'&&raceBgm?.paused&&!miaNpc.cutInActive)resumeRaceMusic();
  const action=actionForCode(e.code);if(!action)return;keyboardActions[action]=true;e.preventDefault();
  if(action==='right')state.steer=Math.max(state.steer,.42);if(action==='left')state.steer=Math.min(state.steer,-.42);
  if(action==='accelerate'&&!e.repeat)handleStartCharge();if(action==='item'&&!e.repeat)useItem();if(action==='pause'&&!e.repeat)togglePause();
});
addEventListener('keyup',e=>{const action=actionForCode(e.code);if(action)keyboardActions[action]=false});
addEventListener('pointerdown',()=>{if(state.mode==='race'&&raceBgm?.paused&&!miaNpc.cutInActive)resumeRaceMusic()},{passive:true});
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key,action=k==='accel'?'accelerate':k;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);b.classList.add('pressed');touchActions[action]=true;if(action==='item')useItem();if(action==='accelerate')handleStartCharge()});['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,e=>{e.preventDefault();b.classList.remove('pressed');touchActions[action]=false}))});
document.querySelectorAll('.mobile-controls button').forEach(b=>['contextmenu','selectstart','dragstart'].forEach(ev=>b.addEventListener(ev,e=>e.preventDefault())));
$('mobileControls').addEventListener('contextmenu',e=>e.preventDefault());
$('mobileControls').addEventListener('selectstart',e=>e.preventDefault());

const itemNames=['star','rocket','shield','lightning'];
const itemRoulette={active:false,time:0,duration:1.18,final:null};
function currentRouletteItem(){const pace=14+itemRoulette.time*13,index=Math.floor(itemRoulette.time*pace)%itemNames.length;return itemNames[index]}
function startItemRoulette(finalItem){
  state.item=null;
  Object.assign(itemRoulette,{active:true,time:0,duration:1.18,final:finalItem});
  $('itemIcon')?.closest('.item-box')?.classList.add('rolling');
  drawHeldItem();
}
function updateItemRoulette(dt){
  if(!itemRoulette.active)return;
  itemRoulette.time+=dt;
  playSfx('roulette',{variant:Math.floor(itemRoulette.time*16)%4,intensity:.72});
  if(itemRoulette.time>=itemRoulette.duration){
    itemRoulette.active=false;
    state.item=itemRoulette.final;
    itemRoulette.final=null;
    $('itemIcon')?.closest('.item-box')?.classList.remove('rolling');
    playSfx('itemGet');
    toast('ITEM GET!');
  }
  drawHeldItem();
}
function giveItem(){
  const pool=state.rank<=2?['shield','rocket','shield','star']:state.rank>=5?['star','lightning','rocket','star']:['rocket','shield','star','lightning'];
  startItemRoulette(pool[Math.floor(Math.random()*pool.length)]);
}
function drawHeldItem(){
  const c=$('itemIcon');if(!c)return;const labels={star:'スター',rocket:'ロケット',shield:'シールド',lightning:'サンダー'};c.setAttribute('aria-label',state.item?`所持アイテム：${labels[state.item]}`:'アイテムなし');const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);
  if(itemRoulette.active){const roll=currentRouletteItem(),frame=itemFrames[itemNames.indexOf(roll)],pulse=1+Math.sin(itemRoulette.time*38)*.08;x.save();x.translate(46,46);x.scale(pulse,pulse);if(frame)x.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,-40,-40,80,80);x.restore();x.strokeStyle='#ffe34f';x.lineWidth=5;x.shadowColor='#48dcff';x.shadowBlur=16;x.beginPath();x.arc(46,46,39,0,Math.PI*2);x.stroke();return}
  if(!state.item){x.fillStyle='#fff';x.font='900 50px Fredoka';x.textAlign='center';x.fillText('?',46,64);return}
  const index=itemNames.indexOf(state.item),frame=itemFrames[index];if(frame)x.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,6,6,80,80);
}
function contestantKey(racer){return racer===miaNpc?'mia-charme':racer?.slug||'unknown'}
function contestantVelocity(racer){return racer===racers[state.selected]?state.speed:Number(racer?.aiVelocity)||0}
function selectRocketTarget(owner,fromZ=owner?.distance||0){
  return raceContestants().filter(racer=>racer!==owner&&racer.distance>fromZ+3).sort((a,b)=>(a.distance-fromZ)-(b.distance-fromZ))[0]||null
}
function launchRocket(owner,options={}){
  if(!owner)return null;const player=racers[state.selected];if(owner===player){owner.distance=state.distance;owner.progress=state.progress;owner.lane=state.x}
  const target=options.target||selectRocketTarget(owner),ownerKey=contestantKey(owner),targetKey=target?contestantKey(target):'',speed=Math.max(112,contestantVelocity(owner)/3.6+78),approachSide=target?Math.sign(owner.lane-target.lane)||(owner.aiPersonality?.passSide||0):0,shot={kind:'rocket',owner,ownerKey,shooter:owner,shooterKey:ownerKey,ownerName:owner.name||'RACER',target,targetKey,approachSide,z:owner.distance+18,lane:owner.lane,speed,life:6.5,age:0,turnRate:3.25,routeChoice:owner.routeChoice||null,routeLap:Number.isFinite(owner.routeLap)?owner.routeLap:-1,routeMerged:!!owner.routeMerged,routePhysicalProgress:owner.routePhysicalProgress||0};state.projectiles.push(shot);
  const launches=Number(canvas.dataset.rocketLaunches||0)+1;canvas.dataset.rocketLaunches=String(launches);canvas.dataset.rocketOwner=ownerKey;canvas.dataset.rocketTarget=targetKey||'none';
  const nearPlayer=Math.abs(owner.distance-state.distance)<300||target===player,anchor=owner===player?playerEffectAnchor():projectTrackEntity(owner.distance,owner.lane);if(nearPlayer){playSfx('rocket',{intensity:owner===player?1:.82});toast(owner===player?'ROCKET!':`${owner.name} ROCKET!`)}
  if(anchor&&Number.isFinite(anchor.x)){const y=owner===player?anchor.y-anchor.height*.24:anchor.y-40*Math.max(.5,anchor.scale||1);spawnVfx(1,anchor.x,y,.48,owner===player?170:115,'front',true);burst(anchor.x,y,5,owner.color||'#ffb13b',6)}
  return shot
}
function applyRocketHit(shot,target){
  const player=racers[state.selected],isPlayer=target===player,shield=isPlayer?state.shield:Number(target.shield)||0,invincible=isPlayer?state.invincible:Number(target.invincible)||0,blocked=shield>0||invincible>0;
  if(shield>0){if(isPlayer)state.shield=0;else target.shield=0}
  if(!blocked){if(isPlayer){state.speed*=.54;state.shake=Math.max(state.shake,17);state.flash=Math.max(state.flash,.42);state.collisionCooldown=Math.max(state.collisionCooldown,1.1)}else{target.hit=Math.max(target.hit||0,2.2);target.spin=Math.max(target.spin||0,1.2);target.aiVelocity*=.68}}
  shot.life=0;const hits=Number(canvas.dataset.rocketHits||0)+1;canvas.dataset.rocketHits=String(hits);canvas.dataset.rocketHitOwner=shot.ownerKey;canvas.dataset.rocketHitTarget=contestantKey(target);canvas.dataset.rocketHitBlocked=String(blocked);
  const visible=isPlayer?playerEffectAnchor():projectTrackEntity(target.distance,target.lane),fxX=visible?.visible===false?innerWidth/2:visible?.x??innerWidth/2,fxY=isPlayer?visible.y-visible.height*.42:(visible?.y??innerHeight*.5)-70*Math.max(.45,visible?.scale||1),fxSize=isPlayer?210:Math.max(90,180*(visible?.scale||1));playSfx(blocked?'shield':'collision',{intensity:target===miaNpc?1.25:1});spawnVfx(blocked?2:1,fxX,fxY,.65,fxSize,'front',true);burst(fxX,fxY,9,blocked?'#74ecff':target.color||'#ffb13b',blocked?0:6);
  const involved=isPlayer||shot.owner===player||Math.abs(target.distance-state.distance)<300;if(involved)toast(`${shot.ownerName} → ${target.name} ${blocked?'BLOCK!':'HIT!'}`)
}
function updateRocketLockWarning(dt){
  const player=racers[state.selected],warning=$('lockOnWarning'),hud=$('hud'),incoming=state.projectiles.filter(shot=>shot.life>0&&shot.target===player&&shot.owner!==player).sort((a,b)=>Math.abs(state.distance-a.z)-Math.abs(state.distance-b.z))[0];state.rocketWarningCooldown=Math.max(0,state.rocketWarningCooldown-dt);
  if(!warning||!incoming){if(warning)warning.className='lock-on-warning';hud?.classList.remove('rocket-locked');canvas.dataset.rocketWarning='none';return}
  hud?.classList.add('rocket-locked');
  const gap=Math.max(0,Math.round(Math.abs(state.distance-incoming.z))),side=Math.sign(incoming.lane-state.x)||incoming.approachSide||0,direction=side<0?'left':side>0?'right':'center',danger=gap<36?'critical':gap<78?'danger':'tracking';warning.className=`lock-on-warning show direction-${direction} ${danger}`;$('lockOnDetail').textContent=`${direction==='left'?'LEFT':direction==='right'?'RIGHT':'BEHIND'} • ${gap}m`;canvas.dataset.rocketWarning=`${direction}:${gap}`;canvas.dataset.rocketWarningOwner=incoming.ownerKey;
  if(state.rocketWarningCooldown<=0){playSfx('lockWarning',{variant:danger==='critical'?2:danger==='danger'?1:0,intensity:danger==='critical'?1:.76});state.rocketWarningCooldown=danger==='critical'?.2:danger==='danger'?.34:.52}
}
function updateRockets(dt){
  for(const shot of state.projectiles){shot.age=(shot.age||0)+dt;shot.life-=dt;let target=shot.target;if(!target||target===shot.owner||target.distance<shot.z-34){target=selectRocketTarget(shot.owner,shot.z-12);shot.target=target;shot.targetKey=target?contestantKey(target):'';if(target)canvas.dataset.rocketTarget=shot.targetKey}
    if(target){const shared=sameActiveRouteEdge(shot,shot.z,target,target.distance),shotRoute=routeStateForRacer(shot,shot.z),mergeBlend=!shared&&shotRoute?.active?clamp((shotRoute.t-.72)/.28,0,1):1,targetLane=shared?target.lane:(shotRoute?.center||shot.lane)*(1-mergeBlend)+target.lane*mergeBlend;canvas.dataset.rocketRouteMode=shared?'direct':'merge-converge';shot.lane+=(targetLane-shot.lane)*Math.min(1,dt*(shot.turnRate||3.25));const gap=target.distance-shot.z;shot.speed+=clamp(118+Math.max(-10,Math.min(24,gap*.08))-shot.speed,-34*dt,42*dt)}
    shot.z=advanceRouteDistance(shot,shot.z,shot.speed*dt);if(shot.age<.11)continue;const collision=raceContestants().filter(racer=>racer!==shot.owner&&sameActiveRouteEdge(shot,shot.z,racer,racer.distance)).map(racer=>({racer,dz:Math.abs(racer.distance-shot.z),lane:Math.abs(racer.lane-shot.lane)})).filter(hit=>hit.dz<22&&hit.lane<.24).sort((a,b)=>a.dz+a.lane*28-(b.dz+b.lane*28))[0];if(collision)applyRocketHit(shot,collision.racer)
  }
  state.projectiles=state.projectiles.filter(shot=>shot.life>0&&shot.z-state.distance<DRAW_DISTANCE);canvas.dataset.rocketActive=String(state.projectiles.length);updateRocketLockWarning(dt)
}
function announceAiItemUse(racer,item){
  canvas.dataset.aiItemUses=String(Number(canvas.dataset.aiItemUses||0)+1);canvas.dataset.aiLastItem=item;canvas.dataset.aiLastItemUser=contestantKey(racer);if(Math.abs(racer.distance-state.distance)>300)return;const p=projectTrackEntity(racer.distance,racer.lane),size=Math.max(100,150*(p.scale||1));playSfx(item,{intensity:.72});if(p.visible){spawnVfx(item==='star'?4:2,p.x,p.y-size*.28,.65,size,'front',true);burst(p.x,p.y-size*.25,7,item==='star'?'#fff2a4':'#74ecff',item==='star'?3:0)}toast(`${racer.name} ${item==='star'?'STAR DASH!':'SHIELD!'}`)
}
function useAiStar(racer){racer.invincible=4.2;racer.aiBoost=Math.max(racer.aiBoost||0,1.65);racer.aiVelocity=Math.max(racer.aiVelocity||0,205);racer.hit=0;racer.spin=0;racer.aiItem=null;racer.aiItemAge=0;announceAiItemUse(racer,'star')}
function useAiShield(racer){racer.shield=7;racer.aiItem=null;racer.aiItemAge=0;announceAiItemUse(racer,'shield')}
function updateAiItemUse(racer,dt){
  if(!racer.aiItem)return;racer.aiItemAge=(racer.aiItemAge||0)+dt;const ai=racer.aiPersonality||{aggression:.82,key:'boss'},player=racers[state.selected],order=raceOrder(),rank=order.indexOf(racer)+1,target=selectRocketTarget(racer,racer.distance),gap=target?target.distance-racer.distance:Infinity;
  if(racer.aiItem==='rocket'){const ready=racer.aiItemAge>.48+(1-ai.aggression)*.9,window=gap>17&&gap<290;if(ready&&window&&!racer.airborne){launchRocket(racer,{target});racer.aiItem=null;racer.aiItemAge=0;racer.aiBoostCooldown=Math.max(racer.aiBoostCooldown||0,.7)}return}
  if(racer.aiItem==='shield'){const incoming=state.projectiles.some(shot=>shot.target===racer&&shot.owner!==racer&&shot.z<racer.distance&&racer.distance-shot.z<220),rearThreat=raceContestants().some(other=>other!==racer&&racer.distance-other.distance>4&&racer.distance-other.distance<64&&Math.abs(other.lane-racer.lane)<.44),ready=racer.aiItemAge>.42,maxHold=racer.aiItemAge>4.8;if(ready&&(incoming||maxHold||(rank<=8&&rearThreat&&racer.aiItemAge>1.1)))useAiShield(racer);return}
  if(racer.aiItem==='star'){const emergency=(racer.hit||0)>.05||(racer.spin||0)>.05||Math.abs(racer.lane)>.96,slow=(racer.aiVelocity||0)<(racer.aiSpeed||150)*.76,attack=gap>12&&gap<175&&(ai.key==='booster'||ai.key==='sprinter'||ai.key==='charger'),maxHold=racer.aiItemAge>4.35;if(racer.aiItemAge>.38&&(emergency||maxHold||(racer.aiItemAge>.72&&(slow||attack||rank>12))))useAiStar(racer)}
}
function updateAiRocketUse(racer,dt){updateAiItemUse(racer,dt)}
function useItem(){
  if(state.mode!=='race'||!state.running||state.paused||!state.item)return;
  const item=state.item;state.item=null;drawHeldItem();
  const anchor=playerEffectAnchor();
  if(item==='star'){state.invincible=4.2;state.turbo=4.2;state.speed=Math.max(state.speed,205);playSfx('star');toast('STAR DASH!');spawnVfx(4,anchor.x,anchor.y-anchor.height*.46,1.1,210,'front',true);burst(anchor.x,anchor.y-anchor.height*.52,8,'#fff2a4',3)}
  if(item==='rocket')launchRocket(racers[state.selected]);
  if(item==='shield'){state.shield=7;playSfx('shield');toast('CRYSTAL SHIELD!');spawnVfx(2,anchor.x,anchor.y-anchor.height*.45,.8,205,'front',true);burst(anchor.x,anchor.y-anchor.height*.45,5,'#74ecff',0)}
  if(item==='lightning'){racers.forEach((r,i)=>{if(i===state.selected||r.invincible>0)return;if(r.shield>0){r.shield=0;return}r.hit=3;r.spin=1});playSfx('lightning');toast('LIGHTNING!');state.flash=1;spawnVfx(3,anchor.x,anchor.y-anchor.height*.74,1,230,'front',true);burst(anchor.x,anchor.y-anchor.height*.7,10,'#74ecff',5)}
  state.shake=12;
}
function collectObject(o,targetIndex){
  if(o.taken)return;o.taken=true;o.takenBy=targetIndex;const r=racers[targetIndex],player=targetIndex===state.selected,label=o.type==='coin'?'COIN':o.type==='item'?'ITEM':'BOOST';state.collectFx.push({type:o.type,z:o.z,lane:o.lane,targetIndex,life:.78,max:.78,label});
  if(o.type==='coin'){if(player){state.coins=Math.min(10,state.coins+1);state.raceWalletEarned++;addWalletCoins(1);playSfx('coin');toast('+ COIN')}else r.aiCoins=Math.min(10,(r.aiCoins||0)+1)}
  else if(o.type==='item'){if(player)giveItem();else{r.aiItem=['star','rocket','shield'][Math.abs(Math.floor(o.z/155)+targetIndex)%3];r.aiItemAge=0;r.aiVelocity=Math.max(r.aiVelocity,172)}}
  else if(player){state.turbo=1.25;state.speed=Math.max(state.speed,195);playSfx('boost');toast('BOOST PAD!')}else{r.aiVelocity=Math.max(r.aiVelocity,198);r.aiBoost=1.2}
}
function spawnLandingDust(impact=1){const drop=jumpCameraDrop(),surface=SURFACE_PROFILES[state.surface]||SURFACE_PROFILES.road,dustColor=surface.id==='road'?'#efd1a2':surface.color,px=innerWidth*.5+state.steer*18,py=Math.min(innerHeight*.96,innerHeight*.89+drop*.58),power=Math.max(.6,Math.min(1.45,impact)),count=Math.max(8,Math.round(26*effectDensity()));state.particles.push({kind:'shockwave',layer:'front',x:px,y:py+10,vx:0,vy:0,life:.38,max:.38,color:'rgba(255,244,196,.9)',size:105+power*64,rot:0,spin:0});state.particles.push({kind:'dust',fxFrame:4,layer:'back',x:px,y:py+10,vx:0,vy:-4,life:.82,max:.82,color:dustColor,size:330+power*110,rot:0,spin:0});for(let i=0;i<count;i++){const side=i%2?1:-1,front=i%4===0;state.particles.push({kind:'dust',fxFrame:i%5===0?4:i%3===0?3:5,layer:front?'front':'back',x:px+side*(20+Math.random()*84),y:py+8+Math.random()*14,vx:side*(80+Math.random()*230)*power,vy:-28-Math.random()*112*power,life:.42+Math.random()*.44,max:.88,color:i%3?dustColor:'#fff1bd',size:52+Math.random()*76+power*20,rot:(Math.random()-.5)*.34,spin:(Math.random()-.5)*.9})}}
function spawnRampTakeoffFx(){const px=innerWidth*.5+state.steer*18,py=innerHeight*.86,count=Math.max(6,Math.round(16*effectDensity()));state.particles.push({kind:'dust',fxFrame:4,layer:'back',x:px,y:py+10,vx:0,vy:-12,life:.5,max:.5,size:210,rot:0,spin:.15});for(let i=0;i<count;i++){const side=i%2?1:-1;state.particles.push({kind:'dust',fxFrame:i%3===0?4:3,layer:i%4?'back':'front',x:px+side*(18+Math.random()*72),y:py+14+Math.random()*10,vx:side*(65+Math.random()*155),vy:-55-Math.random()*120,life:.36+Math.random()*.34,max:.7,color:'#f1d59e',size:52+Math.random()*60,rot:(Math.random()-.5)*.34,spin:(Math.random()-.5)*.8})}}
function launchRamp(index){if(index===state.selected){if(state.airborne)return;state.airborne=true;state.jumpY=1;state.jumpVelocity=228+state.speed*.16;state.jumpView=Math.max(state.jumpView,.16);state.speed=Math.max(state.speed,158);state.turbo=Math.max(state.turbo,1.05);state.suspension=-13;state.suspensionVelocity=-58;state.shake=Math.max(state.shake,10);state.flash=Math.max(state.flash,.18);playSfx('ramp',{intensity:1.1});spawnRampTakeoffFx();toast('RAMP JUMP!')}else{const racer=racers[index];if(racer.airborne)return;racer.airborne=true;racer.jumpY=1;racer.jumpVelocity=205+(racer.aiVelocity||140)*.12;racer.aiBoost=Math.max(racer.aiBoost||0,.9)}}
function updateJumpPhysics(body,dt,player=false){if(!body.airborne)return;const gravity=player?455:420;body.jumpVelocity-=gravity*dt;body.jumpY+=body.jumpVelocity*dt;if(player&&body.jumpVelocity<0)state.speed+=Math.min(18,(-body.jumpVelocity/300)*16)*dt;if(body.jumpY<=0&&body.jumpVelocity<0){const impact=Math.min(1.25,Math.max(.35,-body.jumpVelocity/290));body.jumpY=0;body.jumpVelocity=0;body.airborne=false;if(player){state.suspension=13;state.suspensionVelocity=64;state.landingBounce=Math.max(state.landingBounce,11+impact*9);state.landingBounceVelocity=Math.min(state.landingBounceVelocity,-135-impact*58);state.shake=Math.max(state.shake,10+impact*3);playSfx('land',{intensity:impact});spawnLandingDust(impact);toast('LANDING BOOST!');state.turbo=Math.max(state.turbo,.48+impact*.32);state.speed=Math.max(state.speed,178+impact*28)}}}
function spawnDrivingFx(dt,surfaceInfo,drifting){
  const surface=typeof surfaceInfo==='object'?surfaceInfo:(SURFACE_PROFILES[surfaceInfo]||surfaceAtLane(state.x)),offroad=surface.id!=='road';
  const density=effectDensity(),px=innerWidth*.5+state.steer*18,py=innerHeight*.87,speed=Math.min(1,state.speed/190),room=state.particles.length<Math.round(260*density);if(room&&state.speed>22&&Math.random()<dt*(8+speed*15)*density){const boost=state.boosting;state.particles.push({kind:'smoke',fxFrame:boost?1:0,layer:'back',x:px+(Math.random()-.5)*38,y:py+18,vx:(Math.random()-.5)*34,vy:-18-Math.random()*32,life:.38+Math.random()*.34,max:.72,color:boost?'#d9fbff':'#c8bed0',size:(boost?78:58)+Math.random()*26,rot:(Math.random()-.5)*.2,spin:(Math.random()-.5)*.45})}
  if(room&&state.speed>32&&Math.random()<dt*(7+speed*16)*density){const boost=state.boosting;state.particles.push({kind:'exhaust',layer:'back',x:px+(Math.random()-.5)*42,y:py+14,vx:(Math.random()-.5)*28,vy:55+Math.random()*75,life:boost?.35:.22,max:boost?.35:.22,color:boost?'#64efff':'#ff9d4d',size:boost?12:6,rot:0,spin:0})}
  if(room&&offroad&&Math.random()<dt*((18+speed*48)*surface.dust)*density){for(const side of [-1,1])state.particles.push({kind:'dust',fxFrame:surface.id==='shoulder'?5:(Math.random()>.28?3:5),layer:Math.random()>.76?'front':'back',x:px+side*(45+Math.random()*30),y:py+22,vx:side*(34+Math.random()*105),vy:-26-Math.random()*80,life:.5+Math.random()*.42,max:.92,color:surface.color,size:62+surface.amount*42+Math.random()*58,rot:(Math.random()-.5)*.25,spin:(Math.random()-.5)*.65})}
  if(room&&drifting&&state.speed>65&&Math.random()<dt*(11+speed*15)*density){const side=Math.sign(state.steer)||1;state.particles.push({kind:'smoke',fxFrame:2,layer:'back',x:px-side*(54+Math.random()*18),y:py+19,vx:-side*(25+Math.random()*75),vy:-24-Math.random()*35,life:.5+Math.random()*.34,max:.84,color:'#e8d9e6',size:105+Math.random()*52,rot:-side*.08+(Math.random()-.5)*.12,spin:(Math.random()-.5)*.35})}
  if(drifting&&state.speed>65&&Math.random()<dt*(20+state.driftLevel*13)*density){const side=Math.sign(state.steer)||1,color=['#74ecff','#74ecff','#ffb13b','#ff52de'][state.driftLevel];state.particles.push({kind:'spark',layer:'back',x:px-side*62,y:py+10,vx:-side*(65+Math.random()*120),vy:-35-Math.random()*95,life:.22+Math.random()*.22,max:.44,color,size:2+Math.random()*3,rot:0,spin:0})}
}

function startMiaIntrusion(){
  if(miaNpc.triggered||miaNpc.cutInActive||state.finish)return;
  miaNpc.triggered=true;miaNpc.cutInActive=true;miaNpc.freezeElapsed=state.elapsed;state.paused=true;pauseRaceMusic();playSfx('mia',{intensity:1.2});
  const overlay=$('miaIntrusion');overlay.classList.remove('hidden','show');void overlay.offsetWidth;overlay.classList.add('show');
  canvas.dataset.miaBoss='cut-in';
  clearTimeout(miaNpc.cutInTimer);miaNpc.cutInTimer=setTimeout(()=>{
    overlay.classList.remove('show');overlay.classList.add('hidden');miaNpc.cutInActive=false;canvas.dataset.miaFreezeDelta=(state.elapsed-miaNpc.freezeElapsed).toFixed(0);
    if(state.mode!=='race'||state.finish){state.paused=false;return}
    spawnMiaNpc();state.paused=false;state.last=performance.now();resumeRaceMusic();
  },2650);
}
function spawnMiaNpc(){
  const difficulty=difficultyProfile();
  const side=Math.sin(state.elapsed*.0017)>0?-1:1;
  const spawnGap=difficulty.miaSpawnGap??38;Object.assign(miaNpc,{active:true,distance:state.distance+spawnGap,progress:(state.distance+spawnGap)/raceLength(),lane:clamp(state.x+side*.5,-1.25,1.25),aiTargetLane:clamp(state.x-side*.18,-1.1,1.1),aiVelocity:Math.max(difficulty.miaBase,state.speed+difficulty.miaOffset),hit:0,spin:0,jumpY:255,jumpVelocity:-30,airborne:true,landed:false,routeChoice:null,routeLap:-1,routeMerged:false,routePhysicalProgress:0,routeNormalizedProgress:0,routeComparableDistance:state.distance+spawnGap});
  if($('positionTotal'))$('positionTotal').textContent=`/${racers.length+1}`;
  state.flash=Math.max(state.flash,.5);state.shake=Math.max(state.shake,13);canvas.dataset.miaBoss='air-drop';toast('MIA CHALLENGER!');buildRank();
}
function spawnMiaLandingFx(){
  const p=projectTrackEntity(miaNpc.distance,miaNpc.lane);if(!p.visible)return;
  const size=Math.max(150,270*Math.max(.55,p.scale));
  state.particles.push({kind:'dust',fxFrame:4,layer:'back',x:p.x,y:p.y+5,vx:0,vy:-8,life:.72,max:.72,color:'#ff91c8',size,rot:0,spin:.18});
  state.particles.push({kind:'shockwave',layer:'front',x:p.x,y:p.y+8,vx:0,vy:0,life:.46,max:.46,color:'rgba(255,85,177,.96)',size:size*.48,rot:0,spin:0});
  burst(p.x,p.y-12,14,'#ff52ae',1);playSfx('land',{intensity:1.3});state.shake=Math.max(state.shake,15);state.flash=Math.max(state.flash,.32);toast('MIA HAS LANDED!');
}
function updateMiaNpc(dt,length,laps){
  const difficulty=difficultyProfile();
  if(!miaNpc.triggered){
    const player=racers[state.selected],nearest=Math.max(...racers.filter(r=>r!==player).map(r=>r.distance)),gap=player.distance-nearest,raceFraction=state.distance/Math.max(1,finishLineDistance());
    const dominant=MIA_DEBUG_ENABLED?state.elapsed>250:state.rank===1&&gap>=7&&raceFraction>.18&&raceFraction<.82;
    miaNpc.leaderTime=dominant?miaNpc.leaderTime+dt:Math.max(0,miaNpc.leaderTime-dt*1.6);
    canvas.dataset.miaLeadTime=miaNpc.leaderTime.toFixed(2);canvas.dataset.miaLeadGap=gap.toFixed(1);
    if(miaNpc.leaderTime>=(MIA_DEBUG_ENABLED?0.15:5.2))startMiaIntrusion();
  }
  if(!miaNpc.active)return;
  miaNpc.hit=Math.max(0,miaNpc.hit-dt);miaNpc.spin=Math.max(0,miaNpc.spin-dt);
  const gap=miaNpc.distance-state.distance,targetGap=difficulty.miaTargetGap+Math.sin(state.elapsed*.0013)*5,targetSpeed=Math.max(difficulty.miaBase,state.speed+difficulty.miaOffset)+clamp((targetGap-gap)*difficulty.miaCatchup,-24,difficulty.miaCatchLimit),effectiveTarget=targetSpeed*(miaNpc.hit>0?difficulty.miaHitFactor:1);
  miaNpc.aiVelocity+=clamp(effectiveTarget-miaNpc.aiVelocity,-70*dt,58*dt);miaNpc.distance=advanceRouteDistance(miaNpc,miaNpc.distance,Math.max(0,miaNpc.aiVelocity)/3.6*dt);miaNpc.progress=miaNpc.distance/length;
  const miaRoute=routeStateForRacer(miaNpc,miaNpc.distance);miaNpc.aiTargetLane=miaRoute?.active?miaRoute.center:clamp(Math.sin(state.elapsed*.00145)*.72+trackBend(miaNpc.progress)*.22,-1.25,1.25);miaNpc.lane+=(miaNpc.aiTargetLane-miaNpc.lane)*dt*(miaNpc.airborne?1.2:2.05);
  if(miaNpc.airborne){miaNpc.jumpVelocity-=520*dt;miaNpc.jumpY+=miaNpc.jumpVelocity*dt;if(miaNpc.jumpY<=0&&miaNpc.jumpVelocity<0){miaNpc.jumpY=0;miaNpc.jumpVelocity=0;miaNpc.airborne=false;miaNpc.landed=true;spawnMiaLandingFx();canvas.dataset.miaBoss='racing'}}
  canvas.dataset.miaGap=(miaNpc.distance-state.distance).toFixed(1);canvas.dataset.miaAirborne=String(miaNpc.airborne);
}

function updateRaceParticles(dt){
  state.particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.kind==='shockwave'){p.vx*=Math.exp(-5*dt);p.vy*=Math.exp(-5*dt)}else if(p.kind==='smoke'){p.vx*=Math.exp(-1.8*dt);p.vy-=7*dt}else p.vy+=(p.kind==='dust'?58:90)*dt;p.life-=dt;p.rot+=dt*p.spin});state.particles=state.particles.filter(p=>p.life>0);state.shake*=Math.pow(.88,dt*60);
}
function updateFinishCoast(dt){
  state.finishCoast+=dt;state.speed*=Math.exp(-.72*dt);const player=racers[state.selected];state.distance=advanceRouteDistance(player,state.distance,state.speed/3.6*dt,true);state.progress=state.distance/raceLength();player.distance=state.distance;player.progress=state.progress;player.lane=state.x;
  racers.forEach((r,i)=>{if(i===state.selected)return;r.distance=advanceRouteDistance(r,r.distance,Math.max(0,r.aiVelocity||r.aiSpeed)/3.6*dt);r.progress=r.distance/raceLength()});
  if(miaNpc.active){miaNpc.distance=advanceRouteDistance(miaNpc,miaNpc.distance,Math.max(0,miaNpc.aiVelocity)/3.6*dt);miaNpc.progress=miaNpc.distance/raceLength()}
  state.collectFx.forEach(f=>f.life-=dt);state.collectFx=state.collectFx.filter(f=>f.life>0);updateRaceParticles(dt);updateHud();canvas.dataset.finishCoast=state.finishCoast.toFixed(2);
}
function update(dt){
  if(state.mode!=='race'||!state.running||state.paused)return;
  if(state.finish){updateFinishCoast(dt);return}
  const selectedRacer=racers[state.selected],trait=selectedRacer.trait;
  state.elapsed+=dt*1000;state.shield=Math.max(0,state.shield-dt);state.invincible=Math.max(0,state.invincible-dt);state.turbo=Math.max(0,state.turbo-dt/trait.boostDuration);state.flash=Math.max(0,state.flash-dt*2.5);state.collisionCooldown=Math.max(0,state.collisionCooldown-dt);
  updateItemRoulette(dt);
  const accel=actionDown('accelerate')||Boolean(activeCourse?.autoDrive),brake=actionDown('brake'),left=actionDown('left'),right=actionDown('right'),driftKey=actionDown('drift');
  const tune=selectedRacer.set.stats,baseMaxSpeed=(158+tune.speed*.22+Math.min(10,state.coins)*1.5+(state.turbo>0?48+tune.boost*.08:0)+(state.invincible>0?15:0))*trait.topSpeed,entrySurface=surfaceAtLane(state.x),penaltySurface=state.invincible>0||state.airborne?SURFACE_PROFILES.road:entrySurface,maxSpeed=baseMaxSpeed*penaltySurface.maxFactor;
  if(accel)state.speed+=(66+tune.accel*.3)*trait.acceleration*penaltySurface.accel*dt;else state.speed-=(48+penaltySurface.roll*420)*dt;
  if(brake)state.speed-=145*dt;
  state.speed-=state.speed*state.speed*(.00042+penaltySurface.drag)*dt;state.speed=Math.max(0,Math.min(maxSpeed,state.speed));if(state.speed<.05)state.speed=0;
  const digitalSteer=Number(right)-Number(left),steerTarget=Math.abs(gamepadInput.steer)>.16?gamepadInput.steer:digitalSteer,steerGrip=Math.min(1,state.speed/80)*penaltySurface.grip*(penaltySurface.id==='road'?trait.curveGrip:trait.offroadGrip);
  const steerResponse=(5.1+tune.handling*.025)*penaltySurface.steer;state.steer+=(steerTarget-state.steer)*dt*(driftKey?steerResponse+2:steerResponse);state.x+=state.steer*steerGrip*dt*(driftKey?1.15+tune.handling*.0013:.79+tune.handling*.0017)*penaltySurface.lateral;
  state.trackCurve=trackBend(state.progress);
  const speedRatio=Math.min(1.2,state.speed/185),curveForce=state.trackCurve*speedRatio*speedRatio*(driftKey?.52:1.1-tune.handling*.0013)/trait.curveGrip;
  state.centrifugal+=(curveForce-state.centrifugal)*Math.min(1,dt*4.5);state.x-=state.centrifugal*dt*.92*(1+(1-penaltySurface.grip)*.55);
  if(state.airborne){const airGrip=Math.min(1,state.speed/160),airControl=(.34+tune.handling*.0014)*airGrip;state.x+=steerTarget*airControl*dt;state.steer+=steerTarget*dt*.16}
  const surface=surfaceAtLane(state.x),activePenalty=state.invincible>0||state.airborne?SURFACE_PROFILES.road:surface;state.surface=surface.id;state.offroadAmount=surface.amount;canvas.dataset.surface=surface.id;canvas.dataset.offroadAmount=surface.amount.toFixed(2);
  if(activePenalty.id!=='road'){state.speed=Math.min(state.speed,baseMaxSpeed*activePenalty.maxFactor);state.shake=Math.max(state.shake,activePenalty.shake*Math.min(1,state.speed/145))}
  if(activePenalty.id!=='road'&&accel&&state.speed<30){state.speed=Math.min(baseMaxSpeed*activePenalty.maxFactor,Math.max(state.speed,18)+42*trait.offroadGrip*dt);if(activePenalty.id==='deep'&&Math.abs(state.x)>1.85)state.x-=Math.sign(state.x)*.38*trait.offroadGrip*dt}
  if(Math.abs(state.x)>COURSE_SOFT_WALL&&state.invincible<=0&&state.collisionCooldown<=0){state.x=Math.sign(state.x)*COURSE_SOFT_WALL;state.speed*=.74;state.steer*=-.28;state.shake=12;state.collisionCooldown=.55;playSfx('collision',{intensity:.85});toast('COURSE EDGE!');burst(innerWidth/2+Math.sign(state.x)*innerWidth*.42,innerHeight*.74,10,'#fff2a4')}
  state.x=clamp(state.x,-COURSE_OUT_LIMIT,COURSE_OUT_LIMIT);state.x*=Math.pow(surface.id==='road'?.998:.9994,dt*60);

  if(driftKey&&Math.abs(state.steer)>.18&&state.speed>65){
    const previousDriftLevel=state.driftLevel;
    state.drift=Math.min(3.2,state.drift+dt*(.58+tune.technique*.0018+Math.abs(state.steer)*.55)*trait.driftCharge);
    state.driftLevel=state.drift>=2.25?3:state.drift>=1.25?2:state.drift>=.5?1:0;
    if(state.driftLevel>previousDriftLevel)playSfx('driftCharge',{variant:state.driftLevel,intensity:.85+state.driftLevel*.08});
    const colors=['#65e9ff','#65e9ff','#ffad3d','#ff4edb'];
    if(Math.random()<dt*38)burst(innerWidth/2+state.x*150-state.steer*72,innerHeight*.88,1,colors[state.driftLevel]);
  } else if(state.drift>0){
    const level=state.driftLevel;if(level){const boostTune=.82+tune.boost*.003;state.turbo=[0,.65,1.15,1.8][level]*boostTune;state.speed=Math.max(state.speed,[0,180,196,212][level]+(tune.boost-80)*.1);playSfx('boost',{intensity:.75+level*.18});toast(['','MINI TURBO!','SUPER TURBO!','ULTRA TURBO!'][level]);spawnVfx(2,innerWidth/2+state.x*150,innerHeight*.84,.65)}
    state.drift=0;state.driftLevel=0;
  }
  state.boosting=state.turbo>0||state.invincible>0;
  updateJumpPhysics(state,dt,true);const jumpTarget=state.airborne?clamp(state.jumpY/145+Math.max(0,state.jumpVelocity)*.0012,0,1):0;state.jumpView+=(jumpTarget-state.jumpView)*Math.min(1,dt*(state.airborne?7.2:5.4));if(!state.airborne&&state.jumpView<.01)state.jumpView=0;const riseAhead=hillAt(state.distance+18)-hillAt(state.distance),riseBehind=hillAt(state.distance)-hillAt(state.distance-18),suspensionTarget=state.airborne?-4:-(riseAhead-riseBehind)*Math.min(1,state.speed/150)*78;state.suspensionVelocity+=(suspensionTarget-state.suspension)*38*dt;state.suspensionVelocity*=Math.exp(-8*dt);state.suspension+=state.suspensionVelocity*dt;state.suspension=Math.max(-13,Math.min(13,state.suspension));spawnDrivingFx(dt,surface,driftKey&&Math.abs(state.steer)>.18);
  const length=raceLength(),laps=raceLaps(),previousDistance=state.distance;
  state.distance=Math.max(0,advanceRouteDistance(selectedRacer,state.distance,state.speed/3.6*dt,true));state.progress=state.distance/length;racers[state.selected].distance=state.distance;racers[state.selected].progress=state.progress;
  racers[state.selected].lane=state.x;
  updatePlayerRoute(previousDistance,dt);racers[state.selected].lane=state.x;
  if(state.speed>1){const targetHeading=trackSample(state.progress+.008).heading,turn=angleDelta(targetHeading,state.cameraHeading),maxTurn=(.34+Math.min(1,state.speed/180)*.44)*dt;state.cameraHeading=Math.atan2(Math.sin(state.cameraHeading+Math.max(-maxTurn,Math.min(maxTurn,turn))),Math.cos(state.cameraHeading+Math.max(-maxTurn,Math.min(maxTurn,turn))))}

  racers.forEach((r,i)=>{if(i===state.selected)return;
    const aiTrait=r.trait,ai=r.aiPersonality,difficulty=difficultyProfile();r.hit=Math.max(0,r.hit-dt);r.spin=Math.max(0,r.spin-dt);r.shield=Math.max(0,(r.shield||0)-dt);r.invincible=Math.max(0,(r.invincible||0)-dt);r.aiBoost=Math.max(0,(r.aiBoost||0)-dt/aiTrait.boostDuration);r.aiBoostCooldown=Math.max(0,(r.aiBoostCooldown||0)-dt);r.aiPassCommit=Math.max(0,(r.aiPassCommit||0)-dt);updateJumpPhysics(r,dt,false);
    const lookAhead=55+Math.min(95,r.aiVelocity*.36),bendAhead=trackBend((r.distance+lookAhead)/length),route=routeStateForRacer(r,r.distance),safeLimit=route?.active?1.34:.86-Math.min(.16,Math.abs(bendAhead)*.13),routeMin=route?.active?route.center-(route.path?.laneHalf||.42)+.07:-safeLimit,routeMax=route?.active?route.center+(route.path?.laneHalf||.42)-.07:safeLimit;let raceLine=route?.active?clamp(route.center,routeMin,routeMax):aiDesiredRaceLine(r,bendAhead,safeLimit);const offRoad=surfaceAtLane(r.lane,r.distance).id!=='road';
    const blockers=raceContestants().filter(o=>o!==r&&sameActiveRouteEdge(r,r.distance,o,o.distance)&&o.distance>=r.distance-3&&o.distance-r.distance<38).sort((a,b)=>a.distance-b.distance),blocker=blockers.find(o=>Math.abs(o.lane-r.lane)<.34)||blockers[0],blockerGap=blocker?blocker.distance-r.distance:Infinity;
    if(blocker&&blockerGap>2&&blockerGap<31&&r.aiPassCommit<=0){r.aiTargetLane=aiOpenPassLane(r,blocker,bendAhead,safeLimit);r.aiPassTarget=blocker.slug||'player';r.aiPassCommit=.55+ai.aggression*.72}
    const passReady=blocker&&blockerGap>3&&blockerGap<30&&(Math.abs(bendAhead)<.34||ai.key==='apex'||ai.key==='booster');
    if(passReady&&r.aiBoostCooldown<=0&&r.aiVelocity>105){const trigger=ai.boostThreshold-(state.rank>8?.08:0);if(ai.aggression>=trigger){r.aiBoost=.46+r.set.stats.boost*.0065;r.aiBoostCooldown=2.25+(1-ai.aggression)*2.1;r.aiPassCommit=Math.max(r.aiPassCommit,.9);r.aiTargetLane=aiOpenPassLane(r,blocker,bendAhead,safeLimit)}}
    const gap=state.distance-r.distance,rubber=clamp(gap*difficulty.rubberGain,-difficulty.rubberLimit,difficulty.rubberLimit),personalityPace=ai.key==='charger'&&Math.abs(bendAhead)<.22?3.5:ai.key==='apex'&&Math.abs(bendAhead)>.42?2.8:0,aiTarget=r.aiSpeed*difficulty.aiSpeed+rubber+personalityPace+(r.aiBoost>0?34*difficulty.aiBoost:0),velocityStep=Math.max(-62*difficulty.aiAccel*dt,Math.min(54*aiTrait.acceleration*difficulty.aiAccel*dt,aiTarget-r.aiVelocity));r.aiVelocity=Math.max(0,r.aiVelocity+velocityStep);
    const aiSurface=r.airborne||r.invincible>0?SURFACE_PROFILES.road:surfaceAtLane(r.lane,r.distance),aiActual=r.aiVelocity*(r.hit>0&&r.invincible<=0?.46:1)*aiSurface.maxFactor;r.distance=advanceRouteDistance(r,r.distance,aiActual/3.6*dt);r.progress=r.distance/length;
    r.laneTimer-=dt;if(r.laneTimer<=0&&r.aiPassCommit<=0){
      const choices=[-.7,-.36,0,.36,.7],phase=Math.abs(Math.floor(r.distance/(78+ai.decisionTempo*18))+(r.aiDecisionSeed||i*3))%choices.length;let target=raceLine+choices[phase]*(ai.key==='tactician'?.14:.24),best=null,bestScore=Infinity;
      for(const object of state.objects){if(object.taken||object.route&&route?.active&&object.route!==r.routeChoice)continue;const dz=object.z-r.distance;if(dz<25||dz>155||Math.abs(object.lane)>safeLimit)continue;const interest=object.type==='ramp'?.82:object.type==='item'?ai.objectInterest:ai.objectInterest*.72,pattern=((i+Math.floor(object.z/(object.type==='ramp'?90:120)))%5)/4;if(pattern>interest*.72)continue;const traffic=aiTrafficScore(r,object.lane,62)*34/ai.trafficAvoidance,score=dz+traffic+(object.type==='ramp'?-24:0);if(score<bestScore){best=object;bestScore=score}}
      if(best)target=best.lane*.76+raceLine*.24;else if(ai.key==='tactician'){const candidates=[-.62,-.31,0,.31,.62].map(lane=>clamp(lane+raceLine*.38,routeMin,routeMax));candidates.sort((a,b)=>aiTrafficScore(r,a)-aiTrafficScore(r,b));target=candidates[0]}
      r.aiTargetLane=clamp(target,routeMin,routeMax);r.laneTimer=(.48+ai.decisionTempo*.32+(i%4)*.08)*ai.rhythm;
    }
    if(offRoad){r.aiTargetLane=route?.active?raceLine:clamp(raceLine,-.44,.44);r.aiPassCommit=0}const laneResponse=offRoad?5.2:(1.55+r.set.stats.handling*.009)*(1.12/ai.decisionTempo);r.lane+=(r.aiTargetLane-r.lane)*Math.min(1,dt*laneResponse);if(!offRoad&&r.aiPassCommit<=0)r.lane+=Math.sin(state.elapsed*.0011+i*1.7)*dt*.006;r.lane=clamp(r.lane,route?.active?routeMin:-1.08,route?.active?routeMax:1.08);updateAiRocketUse(r,dt)
  });
  canvas.dataset.aiOffroad=String(racers.filter((r,i)=>i!==state.selected&&surfaceAtLane(r.lane,r.distance).id!=='road').length);
  canvas.dataset.routeAiLeft=String(racers.filter((r,i)=>i!==state.selected&&r.routeChoice==='left').length);canvas.dataset.routeAiRight=String(racers.filter((r,i)=>i!==state.selected&&r.routeChoice==='right').length);
  updateMiaNpc(dt,length,laps);
  state.overtakeUiCooldown=Math.max(0,state.overtakeUiCooldown-dt);updatePlayerOvertakes();
  for(const r of raceContestants().filter(r=>r!==racers[state.selected]&&sameActiveRouteEdge(selectedRacer,state.distance,r,r.distance))){const rel=r.distance-state.distance;if(Math.abs(rel)<20&&Math.abs(r.lane-state.x)<.22&&state.collisionCooldown<=0){if(state.invincible>0||state.shield>0){r.hit=1.3;r.spin=1;toast('HIT!')}else{state.speed*=.72;toast(r===miaNpc?'MIA BUMP!':'BUMP!')}playSfx('collision',{intensity:r===miaNpc?1.2:1});state.shake=10;state.collisionCooldown=1;burst(innerWidth/2+state.x*130,innerHeight*.73,16,r===miaNpc?'#ff52ae':'#ff7abf')}}

  updateRockets(dt);

  state.rank=raceOrder().indexOf(racers[state.selected])+1;if(state.rank!==state.lastRank&&state.elapsed>1000){announceRank(state.lastRank,state.rank);state.lastRank=state.rank}state.lap=raceLapAt(state.distance);const finishAt=finishLineDistance();canvas.dataset.finishLineDistance=finishAt.toFixed(1);canvas.dataset.finishDistanceRemaining=Math.max(0,finishAt-state.distance).toFixed(1);if(previousDistance<finishAt&&state.distance>=finishAt){finishRace();return}
  for(const ramp of state.objects.filter(o=>o.type==='ramp')){for(let i=0;i<racers.length;i++){if(ramp.hitBy.has(i))continue;const r=racers[i],dz=r.distance-ramp.z;if(dz>=-7&&dz<=13&&Math.abs(r.lane-ramp.lane)<.34){ramp.hitBy.add(i);launchRamp(i)}}}
  for(const o of state.objects){if(o.type==='ramp'||o.taken)continue;let best=null;for(let i=0;i<racers.length;i++){const r=racers[i],dz=Math.abs(r.distance-o.z),laneGap=Math.abs(r.lane-o.lane),reach=o.type==='pad'?.28:.22;if(dz<13&&laneGap<reach&&(!best||dz+laneGap*20<best.score))best={i,score:dz+laneGap*20}}if(best)collectObject(o,best.i)}
  state.collectFx.forEach(f=>f.life-=dt);state.collectFx=state.collectFx.filter(f=>f.life>0);
  state.landingBounceVelocity+=(0-state.landingBounce)*72*dt;state.landingBounceVelocity*=Math.exp(-8.6*dt);state.landingBounce+=state.landingBounceVelocity*dt;if(Math.abs(state.landingBounce)<.035&&Math.abs(state.landingBounceVelocity)<.08){state.landingBounce=0;state.landingBounceVelocity=0}
  updateRaceParticles(dt);
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
  n=Math.max(2,Math.round(n*effectDensity()));
  for(let i=0;i<n;i++){
    const size=34+Math.random()*42,life=.28+Math.random()*.42,burstFrame=frameIndex??burstFrameForColor(color);
    state.particles.push({kind:'burst',burstFrame,color,x,y,vx:(Math.random()-.5)*240,vy:(Math.random()-.84)*190,life,max:life,size,rot:(Math.random()-.5)*.7,spin:(Math.random()-.5)*2.6})
  }
}
function spawnVfx(index,x,y,life,size=160,layer='front',center=false){state.particles.push({kind:'vfx',index,x,y,vx:0,vy:-8,life,max:life,size,layer,center,rot:0,spin:(Math.random()-.5)*.7})}
const DRIVING_FX_ROW=[0,1,2,3,4,3];
const BURST_FX_ROW={0:5,1:5,3:4,4:5,5:3,6:1,7:5};
function animatedFxFrame(frames,row,progress){
  if(!frames?.length)return null;
  const safeRow=((Math.floor(row)||0)%FX_ANIM_ROWS+FX_ANIM_ROWS)%FX_ANIM_ROWS,t=Math.max(0,Math.min(.9999,progress||0)),col=Math.min(FX_ANIM_COLS-1,Math.floor(t*FX_ANIM_COLS));
  return frames[safeRow*FX_ANIM_COLS+col]||null;
}
function particleFxProgress(p){return 1-Math.max(0,Math.min(1,p.life/Math.max(.001,p.max)))}
function burstAnimationFrame(p,progress){
  if(p.burstFrame===2)return animatedFxFrame(drivingFxFrames,3,progress);
  return animatedFxFrame(itemFxFrames,BURST_FX_ROW[p.burstFrame]??5,progress);
}
function ordinal(n){return`${n}<sup>${n===1?'st':n===2?'nd':n===3?'rd':'th'}</sup>`}
function racerResultTime(rank){return fmt((state.finishTime||state.elapsed)+Math.max(0,rank-state.rank)*1700+rank*420)}
function raceRewardCourseKey(){return `${state.selectedCourse}:${activeCourse?.short||'course'}`}
function calculateRaceRewards(sorted){
  if(state.raceDifficulty!=='hard'||activeCourse?.debugOnly)return[];
  const key=raceRewardCourseKey(),player=racers[state.selected],playerRank=sorted.indexOf(player),miaRank=sorted.indexOf(miaNpc),rewards=[];
  const firstHard=!playerProgress.hardClears.includes(key);if(firstHard)playerProgress.hardClears.push(key);rewards.push({type:'hard',label:'HARD CLEAR',detail:firstHard?'初回制覇ボーナス':'ハード完走報酬',coins:30,new:firstHard});
  if(miaNpc.active&&miaRank>=0&&playerRank>=0&&playerRank<miaRank){const firstMia=!playerProgress.miaDefeats.includes(key);if(firstMia)playerProgress.miaDefeats.push(key);rewards.push({type:'mia',label:'MIA DEFEATED',detail:firstMia?'初回撃破ボーナス':'ミア撃破報酬',coins:50,new:firstMia})}
  saveProgress();return rewards;
}
const podiumFrameBoundsCache=new Map();
function podiumVisibleBounds(frame){
  if(!frame)return frame;
  const key=`${frame.image.currentSrc||frame.image.src}|${frame.sx}|${frame.sy}|${frame.sw}|${frame.sh}`;
  if(podiumFrameBoundsCache.has(key))return podiumFrameBoundsCache.get(key);
  const probe=document.createElement('canvas'),pw=Math.max(1,Math.round(frame.sw)),ph=Math.max(1,Math.round(frame.sh));probe.width=pw;probe.height=ph;
  const pc=probe.getContext('2d',{willReadFrequently:true});pc.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,0,0,pw,ph);
  const pixels=pc.getImageData(0,0,pw,ph).data;let minX=pw,minY=ph,maxX=-1,maxY=-1;
  for(let y=0;y<ph;y++)for(let x=0;x<pw;x++){if(pixels[(y*pw+x)*4+3]<12)continue;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y)}
  const bounds=maxX<minX?frame:{...frame,sx:frame.sx+minX/pw*frame.sw,sy:frame.sy+minY/ph*frame.sh,sw:(maxX-minX+1)/pw*frame.sw,sh:(maxY-minY+1)/ph*frame.sh};
  podiumFrameBoundsCache.set(key,bounds);return bounds;
}
function drawPodiumRacerSprite(canvas,racer,rank){
  if(!canvas||!racer)return false;
  const sourceFrame=racer.frames?.[10]||racer.frames?.[3]||racer.frames?.[0],frame=podiumVisibleBounds(sourceFrame),c=canvas.getContext('2d');
  c.clearRect(0,0,canvas.width,canvas.height);
  if(!frame||!frame.image||!frame.image.complete||!frame.image.naturalWidth)return false;
  const rankScale=rank===1?1.04:.94,scale=Math.min(canvas.width/frame.sw*.9,canvas.height/frame.sh*.97)*rankScale,w=frame.sw*scale,h=frame.sh*scale,x=(canvas.width-w)/2,y=canvas.height-h;
  c.imageSmoothingEnabled=true;c.shadowColor='rgba(0,0,0,.45)';c.shadowBlur=18;c.shadowOffsetY=12;
  c.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,x,y,w,h);canvas.dataset.painted='sprite';return true;
}
function podiumSpriteReady(racer){const frame=racer?.frames?.[10]||racer?.frames?.[3]||racer?.frames?.[0];return!!(frame?.image?.complete&&frame.image.naturalWidth&&frame.sw>0&&frame.sh>0)}
async function ensurePodiumSprite(racer){if(!podiumSpriteReady(racer))await ensureContestantSprite(racer);if(!podiumSpriteReady(racer))throw new Error(`Podium frame unavailable: ${racer?.slug||'unknown'}`);return racer.frames}
function drawPodiumPortraitFallback(canvas,racer,rank){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{const c=canvas.getContext('2d'),scale=Math.min(canvas.width/image.naturalWidth*.88,canvas.height/image.naturalHeight*.95)*(rank===1?1.04:.94),w=image.naturalWidth*scale,h=image.naturalHeight*scale;c.clearRect(0,0,canvas.width,canvas.height);c.drawImage(image,(canvas.width-w)/2,canvas.height-h,w,h);canvas.dataset.painted='portrait-fallback';resolve(true)};image.onerror=reject;image.src=racer.portrait})}
function drawResultFaceSprite(canvas,racer){
  if(!canvas||!racer)return;
  const frame=racer.frames?.[10]||racer.frames?.[3]||racer.frames?.[0],c=canvas.getContext('2d');
  c.clearRect(0,0,canvas.width,canvas.height);
  if(!frame)return;
  const cropX=frame.sx+frame.sw*.18,cropY=frame.sy+frame.sh*.01,cropW=frame.sw*.64,cropH=frame.sh*.56;
  c.save();
  c.beginPath();c.arc(canvas.width/2,canvas.height/2,canvas.width*.47,0,Math.PI*2);c.clip();
  c.fillStyle='#14122e';c.fillRect(0,0,canvas.width,canvas.height);
  c.imageSmoothingEnabled=true;
  c.drawImage(frame.image,cropX,cropY,cropW,cropH,0,0,canvas.width,canvas.height);
  c.restore();
  c.save();
  c.strokeStyle='#fff';c.lineWidth=4;c.beginPath();c.arc(canvas.width/2,canvas.height/2,canvas.width*.45,0,Math.PI*2);c.stroke();
  c.restore();
}
function resetPodiumRacer(slot){
  if(!slot)return;clearTimeout(slot._podiumTimer);clearTimeout(slot._podiumFallbackTimer);slot._podiumTimer=0;slot._podiumFallbackTimer=0;if(slot._podiumFinishHandler)slot.removeEventListener('animationend',slot._podiumFinishHandler);slot._podiumFinishHandler=null;slot.replaceChildren();slot.classList.remove('boss','podium-staged','podium-jumping','podium-ready');delete slot.dataset.racer;delete slot.dataset.podiumPhase
}
function renderPodiumRacer(slot,racer,rank){
  if(!slot)return;resetPodiumRacer(slot);if(!racer)return;slot.classList.toggle('boss',racer===miaNpc);slot.dataset.racer=racer.slug;slot.dataset.podiumPhase='loading';
  const delay=rank===3?520:rank===2?1480:2440;slot.style.setProperty('--jump-rotate',rank===2?'-4deg':rank===3?'4deg':'0deg');
  slot.innerHTML=`<canvas width="300" height="300" aria-label="${racer.name}"></canvas><strong>${ordinal(rank)}</strong><span>${racer.name}</span>`;
  const canvas=slot.querySelector('canvas');
  const finishJump=()=>{if(!slot.isConnected||slot.dataset.racer!==racer.slug)return;if(slot._podiumFinishHandler)slot.removeEventListener('animationend',slot._podiumFinishHandler);slot._podiumFinishHandler=null;slot.classList.remove('podium-jumping');slot.classList.add('podium-ready');slot.dataset.podiumPhase='ready'};
  const stage=()=>{if(!slot.isConnected||slot.dataset.racer!==racer.slug||!canvas.dataset.painted)return;slot.classList.add('podium-staged');slot.dataset.podiumPhase='staged';void slot.offsetWidth;slot._podiumTimer=setTimeout(()=>{if(!slot.isConnected||slot.dataset.racer!==racer.slug)return;slot.classList.remove('podium-staged');slot.classList.add('podium-jumping');slot.dataset.podiumPhase='jumping';playSfx('uiMove',{intensity:rank===1?.82:.58});const onEnd=event=>{if(event.animationName!=='podiumCeremonyJump'||event.pseudoElement||slot.dataset.racer!==racer.slug)return;finishJump()};slot._podiumFinishHandler=onEnd;slot.addEventListener('animationend',onEnd);slot._podiumFallbackTimer=setTimeout(finishJump,1150)},delay)};
  ensurePodiumSprite(racer).then(()=>{if(!slot.isConnected||slot.dataset.racer!==racer.slug)return;if(!drawPodiumRacerSprite(canvas,racer,rank))throw new Error(`Podium canvas stayed blank: ${racer.slug}`);stage()}).catch(error=>{console.warn(`Podium sprite failed: ${racer.slug}`,error);drawPodiumPortraitFallback(canvas,racer,rank).then(stage).catch(fallbackError=>{console.error(`Podium fallback failed: ${racer.slug}`,fallbackError);slot.dataset.podiumPhase='failed'})});
}
function renderResultCeremony(){
  const recorded=Array.isArray(state.finishOrder)?state.finishOrder.filter(Boolean):[],remaining=raceOrder().filter(racer=>!recorded.includes(racer)),sorted=[...recorded,...remaining],rows=$('resultRows');
  const topRows=sorted.slice(0,6);
  rows.innerHTML=topRows.map((r,i)=>{const rank=i+1,isPlayer=r===racers[state.selected],isMia=r===miaNpc;return`<div class="result-row ${isPlayer?'player':''}${isMia?' boss':''}" style="--delay:${Math.max(0,6-rank)*70}ms"><strong>${ordinal(rank)}</strong><canvas class="result-face" width="72" height="72" aria-label="${r.name}"></canvas><span>${r.name}${isMia?' · BOSS':''}</span><b>${isMia?'':racerResultTime(rank)}</b></div>`}).join('');
  rows.querySelectorAll('.result-face').forEach((canvas,i)=>{const racer=topRows[i],draw=()=>{try{drawResultFaceSprite(canvas,racer)}catch(error){console.warn(`Result face failed: ${racer.slug}`,error)}};if(racer.frames)draw();else ensureContestantSprite(racer).then(draw).catch(error=>console.warn(`Result face load failed: ${racer.slug}`,error))});
  [1,2,3].forEach(rank=>renderPodiumRacer($(`podiumSlot${rank}`),sorted[rank-1],rank));
  const profile=DIFFICULTY_PROFILES[state.raceDifficulty]||DIFFICULTY_PROFILES.normal,badge=$('clearDifficultyBadge'),defeatedMia=state.raceRewards.some(reward=>reward.type==='mia');
  badge.className=`clear-difficulty-badge ${state.raceDifficulty}`;badge.innerHTML=`<small>${profile.kicker}</small><strong>${profile.label} CLEAR</strong><span>${state.raceDifficulty==='hard'?'CHALLENGE COMPLETE':'DIFFICULTY BADGE'}</span>`;
  $('resultRewards').innerHTML=state.raceRewards.length?state.raceRewards.map(reward=>`<div class="reward-chip ${reward.type}"><span>${reward.new?'NEW':''}</span><div><strong>${reward.label}</strong><small>${reward.detail}</small></div><b>+${reward.coins}</b></div>`).join(''):`<div class="reward-empty"><strong>${profile.label} CLEAR</strong><span>${state.raceDifficulty==='hard'?'ミアより上位でゴールすると撃破報酬 +50 COINS':'HARDでは制覇報酬とミア撃破報酬を獲得できます'}</span></div>`;
  $('resultCourseName').textContent=activeCourse.short;$('awardCard').innerHTML=`<small>${profile.label} GRAND PRIX 表彰状</small><strong>${racers[state.selected].name}</strong><span>第 ${state.rank} 位　${defeatedMia?'ミア・シャルム撃破！':state.rank<=3?'見事な表彰台です！':'最後までよく走り切りました！'}</span>`;
}
function showGoalFx(rank){
  const fx=$('goalFx');if(!fx)return;
  const stamp=$('goalStamp'),label=`${rank}${rank===1?'st':rank===2?'nd':rank===3?'rd':'th'}`;
  stamp.innerHTML=`<strong>${label}</strong><span>FINISH!</span>`;
  makeConfetti($('goalConfetti'),64);
  $('app').classList.add('goal-slow');
  fx.classList.remove('hidden','show');void fx.offsetWidth;fx.classList.add('show');
  clearTimeout(showGoalFx.t);showGoalFx.t=setTimeout(()=>{fx.classList.add('hidden');fx.classList.remove('show');$('goalConfetti').innerHTML='';$('app').classList.remove('goal-slow')},1500);
}
function finishRace(){
  if(state.finish)return;state.finish=true;state.finishTime=state.elapsed;state.finishCoast=0;state.finishOrder=raceOrder();state.rank=state.finishOrder.indexOf(racers[state.selected])+1;state.running=true;
  const bonus=state.rank===1?20:state.rank===2?15:state.rank===3?12:Math.max(3,11-state.rank);state.raceRewards=calculateRaceRewards(state.finishOrder);const challengeBonus=state.raceRewards.reduce((sum,reward)=>sum+reward.coins,0),totalBonus=bonus+challengeBonus;state.raceWalletEarned+=totalBonus;addWalletCoins(totalBonus);pauseRaceMusic();window.NyanAudio?.stopEngine();playSfx('finish',{intensity:state.rank===1?1.25:1});setDebugPanel(false);$('mobileControls').classList.add('hidden');showGoalFx(state.rank);
  $('finishRank').innerHTML=ordinal(state.rank);$('finishTitle').textContent=state.rank===1?'VICTORY!':'RACE CLEAR!';$('finishTime').textContent=fmt(state.finishTime);$('finishCoins').textContent=`+${state.raceWalletEarned} COINS · TOTAL ${playerProgress.coins}`;
  clearTimeout(finishRace.timer);finishRace.timer=setTimeout(()=>{state.running=false;state.mode='finish';$('hud').classList.add('hidden');$('resultRows').replaceChildren();[1,2,3].forEach(rank=>resetPodiumRacer($(`podiumSlot${rank}`)));showScreen('finish');requestAnimationFrame(()=>{try{renderResultCeremony()}catch(error){console.error('Result ceremony render failed',error)}})},1350)
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
  const h=innerHeight,w=innerWidth,speed=Math.min(1,state.speed/220),grade=hillAt(state.distance+45)-hillAt(state.distance-20),horizon=h*(.30-speed*.014+grade*.025),base=trackSample(state.progress),cameraLane=clamp(state.x,-1.58,1.58),cameraX=cameraLane*ROAD_WORLD_HALF_WIDTH*.64;state.routeCameraElevation=routeCameraElevation();
  // Raw Catmull-Rom tangents can change very quickly on tight S bends.  Feed
  // a wider heading sample through a small low-pass filter before integrating
  // it.  The visible curve now follows the map without far-road jitter.
  const projection=activeCourse?.projection||{},windowSegments=projection.window||4.15,curveResponse=projection.response||.38,curveClamp=projection.clamp||.088,curveGain=projection.gain||.29,curveWindow=ROAD_SEGMENT_LENGTH*windowSegments;
  let worldX=0,dx=0,smoothedCurve=0,maxY=h+1;roadProjection=[];
  for(let i=0;i<=ROAD_SEGMENTS;i++){
    const rel=i*ROAD_SEGMENT_LENGTH,distance=state.distance+rel,sample=trackSample(distance/TRACK_LENGTH);
    const before=trackSample((distance-curveWindow)/TRACK_LENGTH),after=trackSample((distance+curveWindow)/TRACK_LENGTH);
    const curve=clamp(angleDelta(after.heading,before.heading)/(windowSegments*2),-curveClamp,curveClamp);
    smoothedCurve+=(curve-smoothedCurve)*curveResponse;
    if(i>0){dx+=smoothedCurve*curveGain;dx*=.996;worldX+=dx}
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
function roadBandPoly(p1,p2,left1,right1,left2,right2,color){poly([[p1.cx+p1.half*left1,p1.y],[p1.cx+p1.half*right1,p1.y],[p2.cx+p2.half*right2,p2.y],[p2.cx+p2.half*left2,p2.y]],color)}
function routeCameraElevation(){const geometry=routeGeometryAt(state.distance),player=racers[state.selected];return geometry&&player?.routeLap===geometry.lap?geometry.branches[player.routeChoice]?.elevation||0:0}
function routePathY(point,path){return point.y-((path?.elevation||0)-(state.routeCameraElevation||0))*point.half*.32}
function routePathBandPoly(p1,p2,path1,path2,left1,right1,left2,right2,color){const y1=routePathY(p1,path1),y2=routePathY(p2,path2);poly([[p1.cx+p1.half*(path1.visualCenter+left1),y1],[p1.cx+p1.half*(path1.visualCenter+right1),y1],[p2.cx+p2.half*(path2.visualCenter+right2),y2],[p2.cx+p2.half*(path2.visualCenter+left2),y2]],color)}
function drawSplitRoadSegment(p1,p2,distance1,distance2,band,alt,theme,terrain){
  const a=routeGeometryAt(distance1),b=routeGeometryAt(distance2),fork=Math.max(a?.fork||0,b?.fork||0);if(fork<=.055)return false;
  const ga=a||b,gb=b||a,leftA=ga.branches.left,rightA=ga.branches.right,leftB=gb.branches.left,rightB=gb.branches.right,outerA=Math.max(Math.abs(leftA.visualCenter)+leftA.visualHalf,Math.abs(rightA.visualCenter)+rightA.visualHalf),outerB=Math.max(Math.abs(leftB.visualCenter)+leftB.visualHalf,Math.abs(rightB.visualCenter)+rightB.visualHalf);
  poly([[0,p1.y],[p1.cx-p1.half*(outerA+1.05),p1.y],[p2.cx-p2.half*(outerB+1.05),p2.y],[0,p2.y]],terrain.deepA);poly([[p1.cx+p1.half*(outerA+1.05),p1.y],[innerWidth,p1.y],[innerWidth,p2.y],[p2.cx+p2.half*(outerB+1.05),p2.y]],terrain.deepB);
  const leftInnerA=leftA.visualCenter+leftA.visualHalf,rightInnerA=rightA.visualCenter-rightA.visualHalf,leftInnerB=leftB.visualCenter+leftB.visualHalf,rightInnerB=rightB.visualCenter-rightB.visualHalf;
  poly([[p1.cx+p1.half*leftInnerA,routePathY(p1,leftA)],[p1.cx+p1.half*rightInnerA,routePathY(p1,rightA)],[p2.cx+p2.half*rightInnerB,routePathY(p2,rightB)],[p2.cx+p2.half*leftInnerB,routePathY(p2,leftB)]],alt?terrain.grassA:terrain.grassB);
  const roadColor=alt?theme.roadA:theme.roadB,curbColor=alt?theme.curbA:theme.curbB,curbAlt=alt?theme.curbB:theme.curbA;
  for(const id of['left','right']){const pa=ga.branches[id],pb=gb.branches[id],halfA=pa.visualHalf,halfB=pb.visualHalf;routePathBandPoly(p1,p2,pa,pb,-halfA-.8,-halfA-.28,-halfB-.8,-halfB-.28,id==='left'?terrain.grassA:terrain.grassB);routePathBandPoly(p1,p2,pa,pb,halfA+.28,halfA+.8,halfB+.28,halfB+.8,id==='left'?terrain.grassB:terrain.grassA);routePathBandPoly(p1,p2,pa,pb,-halfA-.28,-halfA-.08,-halfB-.28,-halfB-.08,alt?terrain.shoulderA:terrain.shoulderB);routePathBandPoly(p1,p2,pa,pb,halfA+.08,halfA+.28,halfB+.08,halfB+.28,alt?terrain.shoulderB:terrain.shoulderA);routePathBandPoly(p1,p2,pa,pb,-halfA,halfA,-halfB,halfB,roadColor);routePathBandPoly(p1,p2,pa,pb,-halfA-.075,-halfA,-halfB-.075,-halfB,curbColor);routePathBandPoly(p1,p2,pa,pb,halfA,halfA+.075,halfB,halfB+.075,curbAlt);if(band%5<2){const w1=Math.max(.004,p1.half*.011)/Math.max(1,p1.half),w2=Math.max(.004,p2.half*.011)/Math.max(1,p2.half);routePathBandPoly(p1,p2,pa,pb,-w1,w1,-w2,w2,theme.lane)}}
  return true
}
function drawRoad(){
  const w=innerWidth,current=trackSample(state.progress),theme=activeCourse.theme,terrain=offroadPalette(theme);canvas.dataset.heading=current.heading.toFixed(3);canvas.dataset.cameraHeading=(Number.isFinite(state.cameraHeading)?state.cameraHeading:current.heading).toFixed(3);
  for(let i=ROAD_SEGMENTS-1;i>=0;i--){
    const r1=i/ROAD_SEGMENTS*DRAW_DISTANCE,p1=roadProjection[i],p2=roadProjection[i+1];
    if(!p1.visible)continue;
    const distance1=state.distance+p1.rel,distance2=state.distance+p2.rel,band=Math.floor((state.distance+r1)/25),alt=band%2===0;
    const shoulder=alt?terrain.shoulderA:terrain.shoulderB,grass=alt?terrain.grassA:terrain.grassB,deep=alt?terrain.deepA:terrain.deepB;
    if(drawSplitRoadSegment(p1,p2,distance1,distance2,band,alt,theme,terrain))continue;
    const bandPoly=(side,inner,outer,color)=>{if(side<0)poly([[p1.cx-p1.half*outer,p1.y],[p1.cx-p1.half*inner,p1.y],[p2.cx-p2.half*inner,p2.y],[p2.cx-p2.half*outer,p2.y]],color);else poly([[p1.cx+p1.half*inner,p1.y],[p1.cx+p1.half*outer,p1.y],[p2.cx+p2.half*outer,p2.y],[p2.cx+p2.half*inner,p2.y]],color)};
    poly([[0,p1.y],[p1.cx-p1.half*2.36,p1.y],[p2.cx-p2.half*2.36,p2.y],[0,p2.y]],deep);
    poly([[p1.cx+p1.half*2.36,p1.y],[w,p1.y],[w,p2.y],[p2.cx+p2.half*2.36,p2.y]],deep);
    for(const side of [-1,1]){bandPoly(side,1.36,2.36,grass);bandPoly(side,1.13,1.36,shoulder)}
    poly([[p1.cx-p1.half*1.13,p1.y],[p1.cx-p1.half,p1.y],[p2.cx-p2.half,p2.y],[p2.cx-p2.half*1.13,p2.y]],alt?theme.curbA:theme.curbB);
    poly([[p1.cx+p1.half,p1.y],[p1.cx+p1.half*1.13,p1.y],[p2.cx+p2.half*1.13,p2.y],[p2.cx+p2.half,p2.y]],alt?theme.curbA:theme.curbB);
    poly([[p1.cx-p1.half,p1.y],[p1.cx+p1.half,p1.y],[p2.cx+p2.half,p2.y],[p2.cx-p2.half,p2.y]],alt?theme.roadA:theme.roadB);
    if(band%5<2){for(const lane of [-1/3,1/3]){const a1=p1.half*.011,a2=p2.half*.011;poly([[p1.cx+p1.half*lane-a1,p1.y],[p1.cx+p1.half*lane+a1,p1.y],[p2.cx+p2.half*lane+a2,p2.y],[p2.cx+p2.half*lane-a2,p2.y]],theme.lane)}}
    if(i<38&&band%6<2){for(const lane of [-.72,-.18,.48]){const a1=p1.half*.004,a2=p2.half*.004;poly([[p1.cx+p1.half*lane-a1,p1.y],[p1.cx+p1.half*lane+a1,p1.y],[p2.cx+p2.half*lane+a2,p2.y],[p2.cx+p2.half*lane-a2,p2.y]],'rgba(255,255,255,.11)')}}
    const startLine=finishLineOffset(),lapLength=raceLength(),lapZ=((state.distance+r1-startLine)%lapLength+lapLength)%lapLength;if(lapZ<30){for(let c=0;c<10;c++){const l1=-1+c*.2,l2=l1+.2;poly([[p1.cx+p1.half*l1,p1.y],[p1.cx+p1.half*l2,p1.y],[p2.cx+p2.half*l2,p2.y],[p2.cx+p2.half*l1,p2.y]],(c+band)%2?'#fff':'#1a153a')}}
  }
}
function drawRoadSurfaceDetails(){
  for(let i=ROAD_SEGMENTS-1;i>=0;i--){const p1=roadProjection[i],p2=roadProjection[i+1];if(!p1.visible)continue;const distance=state.distance+p1.rel,route=routeGeometryAt(distance),band=Math.floor(distance/18),lanes=route?.fork>.055?[-route.visualCenter,route.visualCenter]:[-.62,.08,.57];if(band%7===0){for(const lane of lanes){const width1=Math.max(.35,p1.half*.0035),width2=Math.max(.25,p2.half*.0035);poly([[p1.cx+p1.half*lane-width1,p1.y],[p1.cx+p1.half*lane+width1,p1.y],[p2.cx+p2.half*lane+width2,p2.y],[p2.cx+p2.half*lane-width2,p2.y]],'rgba(255,255,255,.045)')}}if(band%13===2){const lane=route?.fork>.055?(band%2?-route.visualCenter:route.visualCenter):Math.sin(band*2.17)*.5,w1=p1.half*.035,w2=p2.half*.035;poly([[p1.cx+p1.half*lane-w1,p1.y],[p1.cx+p1.half*lane+w1,p1.y],[p2.cx+p2.half*lane+w2,p2.y],[p2.cx+p2.half*lane-w2,p2.y]],'rgba(105,226,255,.075)')}}
  const markPhase=95,firstMark=Math.ceil((state.distance+28-markPhase)/260)*260+markPhase;for(let start=firstMark;start<state.distance+DRAW_DISTANCE;start+=260){const route=routeGeometryAt(start),lane=route?.fork>.055?(Math.floor(start/260)%2?-route.visualCenter:route.visualCenter):Math.sin(start*.017)*.38;for(let d=0;d<78;d+=9){const p1=roadPoint(start+d-state.distance),p2=roadPoint(start+d+10-state.distance);if(!p1.visible)continue;for(const tyre of [-.085,.085]){const x1=p1.cx+p1.half*(lane+tyre),x2=p2.cx+p2.half*(lane+tyre),w1=Math.max(.6,p1.half*.009),w2=Math.max(.45,p2.half*.009);poly([[x1-w1,p1.y],[x1+w1,p1.y],[x2+w2,p2.y],[x2-w2,p2.y]],'rgba(18,17,30,.34)')}}}
  const speed=Math.min(1,state.speed/190);if(speed>.18){ctx.save();ctx.lineCap='round';ctx.strokeStyle=`rgba(174,241,255,${.08+speed*.22})`;for(let i=0;i<20;i++){const rel=22+((i*53-state.distance*(1.2+speed*2.8))%430+430)%430,p1=roadPoint(rel),p2=roadPoint(rel+18+speed*55),lane=((i*37)%100/100-.5)*1.45;if(!p1.visible||!p2.visible)continue;ctx.lineWidth=Math.max(.5,p1.half*.006);ctx.beginPath();ctx.moveTo(p2.cx+p2.half*lane,p2.y);ctx.lineTo(p1.cx+p1.half*lane,p1.y);ctx.stroke()}ctx.restore()}
}
function drawVergeSurfaceDetails(){
  const terrain=offroadPalette(activeCourse.theme),colors=[terrain.shoulderA,terrain.grassA,terrain.grassB,terrain.deepA,terrain.deepB];ctx.save();ctx.globalAlpha=.3;
  for(let i=ROAD_SEGMENTS-1;i>=1;i--){const p1=roadProjection[i],p2=roadProjection[i+1];if(!p1.visible)continue;const band=Math.floor((state.distance+p1.rel)/15);if(band%3!==0)continue;for(const side of [-1,1]){const offset=1.2+(Math.abs(band*17)%82)*.014,w1=Math.max(.4,p1.half*(band%9===0?.038:.014)),w2=Math.max(.28,p2.half*(band%9===0?.038:.014)),x1=p1.cx+side*p1.half*offset,x2=p2.cx+side*p2.half*offset;poly([[x1-w1,p1.y],[x1+w1,p1.y],[x2+w2,p2.y],[x2-w2,p2.y]],colors[Math.abs(band+side)%colors.length])}}
  ctx.globalAlpha=.22;for(let z=Math.ceil((state.distance+35)/105)*105;z<state.distance+DRAW_DISTANCE;z+=105){const p=roadPoint(z-state.distance);if(!p.visible)continue;for(const side of [-1,1]){const offset=1.42+(Math.abs(Math.floor(z/105)*5)%8)*.1,x=p.cx+side*p.half*offset,r=Math.max(1.5,p.half*.026);ctx.fillStyle=colors[Math.abs(Math.floor(z/105)+side)%colors.length];ctx.shadowColor='rgba(25,15,45,.28)';ctx.shadowBlur=Math.max(1,r*.45);ctx.beginPath();ctx.ellipse(x,p.y-r*.18,r*1.9,r*.38,0,0,Math.PI*2);ctx.fill()}}ctx.restore();
}
function trackPhase(distance){return((distance%TRACK_LENGTH)+TRACK_LENGTH)%TRACK_LENGTH}
let tunnelSections=courseData[0].tunnels;
let tunnelClipCount=0;
const TUNNEL_COLLAR_LENGTH=14;
function tunnelSectionAt(distance){const p=trackPhase(distance);return tunnelSections.find(([start,end])=>p>=start-TUNNEL_COLLAR_LENGTH&&p<=end+TUNNEL_COLLAR_LENGTH)}
function tunnelAt(distance){return!!tunnelSectionAt(distance)}
function audioTunnelMix(distance){const phase=trackPhase(distance),blendDistance=22;for(const [start,end] of tunnelSections){if(phase<start||phase>end)continue;return clamp(Math.min((phase-start)/blendDistance,(end-phase)/blendDistance,1),0,1)}return 0}
function firstTunnelPortalBetween(distance){const from=state.distance+3,to=distance-3;if(to<=from)return null;let portal=null;const firstLap=Math.floor(from/TRACK_LENGTH)-1,lastLap=Math.ceil(to/TRACK_LENGTH)+1;for(let lap=firstLap;lap<=lastLap;lap++){const base=lap*TRACK_LENGTH;for(const section of tunnelSections){for(const edge of section){const boundary=base+edge;if(boundary>from&&boundary<to&&(portal===null||boundary<portal))portal=boundary}}}return portal}
function traceTunnelOpening(p){const half=p.half*1.16,top=p.y-p.half*.98,left=p.cx-half,right=p.cx+half;ctx.beginPath();ctx.moveTo(left,p.y+2);ctx.lineTo(left,top+p.half*.34);ctx.bezierCurveTo(left,top-p.half*.18,right,top-p.half*.18,right,top+p.half*.34);ctx.lineTo(right,p.y+2);ctx.closePath()}
function drawThroughTunnelPortal(source,draw){const distance=typeof source==='number'?source:source.z,portal=typeof source==='number'?firstTunnelPortalBetween(distance):source.portal;if(portal===null){draw();return}tunnelClipCount++;const p=roadPoint(portal-state.distance);if(!p.visible)return;ctx.save();traceTunnelOpening(p);ctx.clip();draw();ctx.restore()}
function distanceFadeAlpha(rel,near=520,far=DRAW_DISTANCE*.96){return rel<=near?1:Math.max(0,Math.min(1,(far-rel)/Math.max(1,far-near)))}
function clamp01(v){return Math.max(0,Math.min(1,v))}
function colorAlpha(color,alpha){if(/^#([0-9a-f]{6})$/i.test(color)){const n=parseInt(color.slice(1),16);return`rgba(${n>>16&255},${n>>8&255},${n&255},${alpha})`}return`rgba(244,248,255,${alpha})`}
function sceneryFogAmount(rel){return settings.richScenery?clamp01((rel-185)/520):0}
function sceneryFilter(rel){const fog=sceneryFogAmount(rel);return fog<=.02?'none':`saturate(${1-fog*.34}) brightness(${1+fog*.18})`}
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
  const theme=activeCourse.theme,half=p.half*1.24,top=p.y-p.half*1.04,left=p.cx-half,right=p.cx+half;
  // A filled, wider collar overlaps the first tunnel panel.  It removes the
  // thin background seam that used to appear between portal and tunnel walls.
  ctx.save();ctx.globalAlpha=.94;ctx.fillStyle='rgba(10,6,30,.88)';ctx.beginPath();ctx.moveTo(left,p.y+2);ctx.lineTo(left,top+p.half*.34);ctx.bezierCurveTo(left,top-p.half*.2,right,top-p.half*.2,right,top+p.half*.34);ctx.lineTo(right,p.y+2);ctx.lineTo(right-p.half*.1,p.y+2);ctx.lineTo(right-p.half*.1,top+p.half*.4);ctx.bezierCurveTo(right-p.half*.1,top+2,left+p.half*.1,top+2,left+p.half*.1,top+p.half*.4);ctx.lineTo(left+p.half*.1,p.y+2);ctx.closePath();ctx.fill();ctx.globalAlpha=1;ctx.lineCap='round';ctx.strokeStyle='rgba(8,5,24,.96)';ctx.lineWidth=Math.max(5,p.half*.19)*emphasis;ctx.beginPath();ctx.moveTo(left,p.y);ctx.lineTo(left,top+p.half*.34);ctx.bezierCurveTo(left,top-p.half*.2,right,top-p.half*.2,right,top+p.half*.34);ctx.lineTo(right,p.y);ctx.stroke();
  ctx.strokeStyle=theme.curbA;ctx.lineWidth=Math.max(2,p.half*.058)*emphasis;ctx.shadowColor=theme.lightB;ctx.shadowBlur=Math.max(6,p.half*.13);ctx.stroke();
  ctx.strokeStyle=theme.lightA;ctx.lineWidth=Math.max(1,p.half*.02)*emphasis;ctx.globalAlpha=.86;ctx.stroke();ctx.restore();
}
function drawGuardrails(){
  const theme=activeCourse.theme;for(let i=ROAD_SEGMENTS-1;i>=0;i--){const p1=roadProjection[i],p2=roadProjection[i+1],distance=state.distance+(p1.rel+p2.rel)*.5;if(!p1.visible||tunnelAt(distance))continue;const band=Math.floor(distance/35),color=band%2?theme.railA:theme.railB;
    for(const side of [-1,1]){const x1=p1.cx+side*p1.half*GUARDRAIL_LANE,x2=p2.cx+side*p2.half*GUARDRAIL_LANE,h1=Math.max(1.5,p1.half*.12),h2=Math.max(1.2,p2.half*.12);poly([[x1,p1.y-h1],[x1,p1.y-h1*.43],[x2,p2.y-h2*.43],[x2,p2.y-h2]],color);poly([[x1,p1.y-h1],[x1,p1.y-h1*.82],[x2,p2.y-h2*.82],[x2,p2.y-h2]],'rgba(255,255,255,.68)');
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
  // Keep the playable shoulder, grass and sand strip clear.  These objects
  // are deliberately placed on the far side of the guardrail.
  const rich=effectiveRichScenery(),assets=[];for(let i=0;i<Math.max(propImages.length,spectatorSlugs.length);i++){if(propImages[i])assets.push({kind:'prop',image:propImages[i],prop:i,height:propHeights[i],offset:i%3===1?2.72:2.52});if(i<spectatorSlugs.length&&spectatorFrameSets[i]?.length)assets.push({kind:'spectator',spectator:i,height:610,offset:2.34+i%2*.12})}
  const phase=52+state.selectedCourse*13,spacing=rich?58/Math.max(.4,performanceProfile().scenery):96,first=Math.ceil((state.distance-28-phase)/spacing)*spacing+phase,props=[];for(let z=first;z<state.distance+DRAW_DISTANCE;z+=spacing)props.push(z);
  canvas.dataset.coursePropTheme=propTheme;
  const drawAsset=(asset,z,p,side,size=1,extraOffset=0)=>{const rel=z-state.distance,height=Math.max(13,Math.min(innerHeight*.38,asset.height*p.scale*size)),rawX=p.cx+side*p.half*(asset.offset+extraOffset+(size<1?.12:0)),x=rel<48?Math.max(-height*.32,Math.min(innerWidth+height*.32,rawX)):rawX;if(x<-height*1.35||x>innerWidth+height*1.35)return;const groundY=p.y+Math.max(2,height*.075),passFade=rel<4?Math.max(0,Math.min(1,(rel+28)/32)):1,farFade=distanceFadeAlpha(rel,500,835),visible=passFade*farFade;if(visible<=.045)return;ctx.save();ctx.globalAlpha=.32*visible;ctx.fillStyle='rgba(18,8,38,.34)';ctx.beginPath();ctx.ellipse(x,groundY,Math.max(5,height*.3),Math.max(2,height*.055),0,0,Math.PI*2);ctx.fill();ctx.restore();if(asset.kind==='spectator'){const viewTurn=Math.max(-3,Math.min(3,Math.round(-side*1.7+p.tangent*5))),frameIndex=viewTurn<=-3?0:viewTurn>=3?6:10+viewTurn,frames=spectatorFrameSets[asset.spectator],frame=frames?.[frameIndex];drawFrameHeight(frame,x,groundY,height,visible);canvas.dataset.spectatorFrame=String(frameIndex);canvas.dataset.spectatorCharacter=spectatorSlugs[asset.spectator]}else if(asset.image.complete&&asset.image.naturalWidth){ctx.save();ctx.globalAlpha=visible;const width=height*asset.image.naturalWidth/Math.max(1,asset.image.naturalHeight);ctx.drawImage(asset.image,x-width*.5,groundY-height,width,height);ctx.restore();canvas.dataset.courseProp=`${propTheme}-${asset.prop}`}};
  for(let i=props.length-1;i>=0;i--){const z=props[i],rel=z-state.distance,p=roadPoint(rel);if(!p.visible||tunnelAt(z)||!assets.length)continue;const slot=Math.abs(Math.floor((z-phase)/spacing)),index=slot%assets.length,side=slot%2?1:-1;drawAsset(assets[index],z,p,side,1);if(slot%3===0)drawAsset(assets[(index+3)%assets.length],z+2,p,-side,.78,.18);if(rich&&slot%4===1)drawAsset(assets[(index+5)%assets.length],z+5,p,side,.62,.46)}
}
function drawDistantScenery(){
  const themed=courseSceneryFrames[state.selectedCourse]||[],fallback=state.selectedCourse===3?forestSceneryFrames:[...candySceneryFrames,...forestSceneryFrames.slice(0,4)],frames=themed.length?themed:fallback;if(!frames.length){canvas.dataset.sceneryCount='0';return}
  const rich=effectiveRichScenery(),density=rich?.62/Math.max(.4,performanceProfile().scenery):1.18,clarity=rich?1:.72;
  const layerConfigs=rich?[
    {row:0,spacing:178*density,phase:43,offset:3.0,base:1260,scale:.52,alpha:.42*clarity,fadeNear:165,fadeStart:320,fadeEnd:780},
    {row:1,spacing:132*density,phase:71,offset:2.7,base:1140,scale:.68,alpha:.62*clarity,fadeNear:105,fadeStart:300,fadeEnd:760},
    {row:2,spacing:92*density,phase:29,offset:2.42,base:930,scale:.92,alpha:.86,fadeNear:54,fadeStart:270,fadeEnd:720},
    {row:1,spacing:70*density,phase:11,offset:2.58,base:860,scale:.74,alpha:.7,fadeNear:40,fadeStart:220,fadeEnd:640}
  ]:[
    {row:0,spacing:168*density,phase:43,offset:2.78,base:1180,scale:.64,alpha:.52*clarity,fadeNear:155,fadeStart:360,fadeEnd:820},
    {row:1,spacing:124*density,phase:71,offset:2.52,base:1040,scale:.8,alpha:.74*clarity,fadeNear:92,fadeStart:340,fadeEnd:780},
    {row:2,spacing:86*density,phase:29,offset:2.32,base:850,scale:.95,alpha:.94,fadeNear:46,fadeStart:310,fadeEnd:720}
  ];
  let drawn=0;
  const frameAt=(row,slot)=>themed.length?frames[row*4+slot%4]:frames[(slot+row*2)%frames.length];
  const drawLayerProp=(frame,p,rel,side,slot,layer)=>{if(!frame)return;const fog=sceneryFogAmount(rel),height=Math.max(8,Math.min(innerHeight*.5,layer.base*p.scale*layer.scale)),x=p.cx+side*p.half*(layer.offset+(slot%3)*.08);if(x<-height*1.15||x>innerWidth+height*1.15)return;const groundY=p.y+Math.max(3,height*.08),passFade=rel<layer.fadeNear?Math.max(0,rel/layer.fadeNear):1,farFade=distanceFadeAlpha(rel,layer.fadeStart,Math.min(DRAW_DISTANCE*.98,layer.fadeEnd+90)),visibility=passFade*farFade*layer.alpha;if(visibility<=.04)return;ctx.save();ctx.globalAlpha=.18+visibility*.12;ctx.fillStyle=rich?'rgba(13,9,29,.74)':'rgba(13,9,29,.6)';ctx.beginPath();ctx.ellipse(x,groundY,Math.max(5,height*.33),Math.max(2,height*.052),0,0,Math.PI*2);ctx.fill();ctx.restore();drawFrameHeightFiltered(frame,x,groundY,height,visibility*(1-fog*.18),0,sceneryFilter(rel));if(rich&&rel<280&&layer.row===2){ctx.save();ctx.globalAlpha=.18;ctx.strokeStyle=activeCourse.theme.lightB;ctx.lineWidth=Math.max(1,height*.012);ctx.shadowColor=activeCourse.theme.lightB;ctx.shadowBlur=Math.max(4,height*.045);ctx.beginPath();ctx.ellipse(x,groundY-height*.42,height*.42,height*.33,0,0,Math.PI*2);ctx.stroke();ctx.restore()}drawn++};
  for(const layer of layerConfigs){const phase=layer.phase+state.selectedCourse*17,first=Math.ceil((state.distance+30-phase)/layer.spacing)*layer.spacing+phase,placements=[];for(let z=first;z<state.distance+DRAW_DISTANCE;z+=layer.spacing)placements.push(z);for(let i=placements.length-1;i>=0;i--){const z=placements[i],rel=z-state.distance,p=roadPoint(rel);if(!p.visible||tunnelAt(z))continue;const slot=Math.abs(Math.floor((z-phase)/layer.spacing)),side=slot%2?1:-1;drawLayerProp(frameAt(layer.row,slot),p,rel,side,slot,layer);if((rich&&slot%2===0)||(!rich&&layer.row>0&&slot%4===0))drawLayerProp(frameAt(layer.row,slot+2),p,rel,-side,slot,{...layer,scale:layer.scale*(rich?0.64:0.58),offset:layer.offset+(rich?0.22:0.18),alpha:layer.alpha*(rich?0.68:0.52)})}}
  canvas.dataset.sceneryCount=String(drawn);canvas.dataset.sceneryLayers=themed.length?'course-atlas':'fallback';
}
function drawVergeDetails(){
  const theme=activeCourse.theme,spacing=38,first=Math.ceil((state.distance+18)/spacing)*spacing,details=[];for(let z=first;z<state.distance+DRAW_DISTANCE;z+=spacing)details.push(z);
  for(let i=details.length-1;i>=0;i--){const z=details[i],rel=z-state.distance,p=roadPoint(rel);if(!p.visible||tunnelAt(z))continue;const slot=Math.abs(Math.floor(z/spacing)),s=Math.max(.22,Math.min(1.15,p.scale*1.55)),alpha=Math.min(.9,.18+p.scale*3.2)*distanceFadeAlpha(rel,420,730);if(alpha<=.02)continue;for(const side of [-1,1]){const offset=2.27+(slot%4)*.075,x=p.cx+side*p.half*offset,y=p.y,size=15*s;if(x<-80||x>innerWidth+80)continue;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.strokeStyle=slot%2?theme.lightA:theme.lightB;ctx.fillStyle=slot%3?theme.accent:theme.curbA;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=6*s;ctx.lineWidth=Math.max(1,2.2*s);if(state.selectedCourse===0){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-35*s);ctx.stroke();ctx.beginPath();ctx.arc(0,-43*s,10*s,0,Math.PI*2);ctx.fill();ctx.stroke()}else if(state.selectedCourse===1){ctx.beginPath();ctx.moveTo(-7*s,0);ctx.lineTo(-7*s,-28*s);ctx.quadraticCurveTo(0,-38*s,9*s,-28*s);ctx.lineTo(9*s,0);ctx.stroke();ctx.beginPath();ctx.arc(1*s,-32*s,7*s,0,Math.PI*2);ctx.stroke()}else if(state.selectedCourse===2){ctx.fillRect(-3*s,-42*s,6*s,42*s);ctx.beginPath();ctx.moveTo(-13*s,-35*s);ctx.lineTo(0,-51*s);ctx.lineTo(13*s,-35*s);ctx.closePath();ctx.stroke()}else if(state.selectedCourse===3){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-34*s);ctx.stroke();ctx.beginPath();ctx.arc(0,-35*s,15*s,Math.PI,Math.PI*2);ctx.lineTo(15*s,-35*s);ctx.quadraticCurveTo(8*s,-28*s,0,-35*s);ctx.quadraticCurveTo(-8*s,-28*s,-15*s,-35*s);ctx.fill()}else{ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-45*s);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-44*s);ctx.lineTo(side*22*s,-37*s);ctx.lineTo(0,-29*s);ctx.closePath();ctx.fill()}ctx.globalAlpha*=.38;ctx.fillStyle=theme.vergeB;ctx.beginPath();ctx.ellipse(0,1,size*1.4,size*.32,0,0,Math.PI*2);ctx.fill();ctx.restore()}}
}
function drawStartArch(){
  const line=finishLineOffset(),lapLength=raceLength(),arches=[],firstLap=Math.floor((state.distance-line)/lapLength);for(let lap=firstLap;lap<=firstLap+Math.ceil(DRAW_DISTANCE/lapLength)+1;lap++){const z=lap*lapLength+line,rel=z-state.distance;if(rel>6&&rel<DRAW_DISTANCE)arches.push({z,rel})}
  const theme=activeCourse.theme;arches.sort((a,b)=>b.rel-a.rel);for(const arch of arches){const p=roadPoint(arch.rel);if(!p.visible)continue;const half=p.half*1.18,height=p.half*.83,left=p.cx-half,right=p.cx+half,top=p.y-height,pillar=Math.max(3,p.half*.11);ctx.save();ctx.shadowColor=theme.lightB;ctx.shadowBlur=Math.max(5,p.half*.11);ctx.strokeStyle=theme.curbA;ctx.lineWidth=pillar;ctx.beginPath();ctx.moveTo(left,p.y);ctx.lineTo(left,top+height*.22);ctx.quadraticCurveTo(p.cx,top-height*.18,right,top+height*.22);ctx.lineTo(right,p.y);ctx.stroke();ctx.shadowColor=theme.lightA;ctx.strokeStyle=theme.curbB;ctx.lineWidth=Math.max(2,pillar*.45);ctx.stroke();const bannerW=half*1.26,bannerH=Math.max(10,height*.24);ctx.fillStyle='#16112f';ctx.strokeStyle=theme.curbA;ctx.lineWidth=Math.max(1,pillar*.22);ctx.beginPath();ctx.roundRect(p.cx-bannerW/2,top+height*.12,bannerW,bannerH,bannerH*.28);ctx.fill();ctx.stroke();ctx.fillStyle=theme.lightB;ctx.font=`900 ${Math.max(8,Math.min(30,p.half*.16))}px Fredoka`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(activeCourse.short,p.cx,top+height*.12+bannerH*.52);ctx.restore()}
}
function drawMode7Texture(){
  const h=innerHeight,horizon=h*(.30-Math.min(1,state.speed/220)*.018);ctx.save();const glow=ctx.createLinearGradient(0,horizon,0,horizon+120);glow.addColorStop(0,'rgba(94,220,255,.13)');glow.addColorStop(1,'rgba(94,220,255,0)');ctx.fillStyle=glow;ctx.fillRect(0,horizon,innerWidth,120);
  ctx.globalAlpha=.72;for(let z=Math.ceil((state.distance+100)/240)*240;z<state.distance+DRAW_DISTANCE;z+=240){const p=roadPoint(z-state.distance);if(!p.visible)continue;const before=trackSample((z-60)/TRACK_LENGTH).heading,after=trackSample((z+60)/TRACK_LENGTH).heading,dir=Math.sign(angleDelta(after,before))||1,x=p.cx+p.half*(dir>0?.72:-.72),s=Math.max(.28,p.scale);ctx.save();ctx.translate(x,p.y-8*s);ctx.scale(dir,1);ctx.fillStyle=activeCourse.theme.accent;ctx.shadowColor='#fff';ctx.shadowBlur=8*s;ctx.beginPath();ctx.moveTo(-26*s,-10*s);ctx.lineTo(4*s,-10*s);ctx.lineTo(4*s,-21*s);ctx.lineTo(30*s,0);ctx.lineTo(4*s,21*s);ctx.lineTo(4*s,10*s);ctx.lineTo(-26*s,10*s);ctx.closePath();ctx.fill();ctx.restore()}
  ctx.restore();
}
function drawTrackside(){
  const theme=activeCourse.theme,first=Math.ceil((state.distance+80)/170)*170,posts=[];for(let z=first;z<state.distance+DRAW_DISTANCE;z+=170)posts.push(z);
  for(let i=posts.length-1;i>=0;i--){const z=posts[i],rel=z-state.distance,p=roadPoint(rel);if(!p.visible||tunnelAt(z))continue;const s=p.scale,alpha=(.3+s*.7)*distanceFadeAlpha(rel,420,750);if(alpha<=.02)continue;const xL=p.cx-p.half*2.38,xR=p.cx+p.half*2.38;for(const x of [xL,xR]){ctx.save();ctx.translate(x,p.y);ctx.globalAlpha=alpha;ctx.strokeStyle=z%340===0?theme.railA:theme.railB;ctx.lineWidth=Math.max(2,8*s);ctx.shadowColor=theme.lightA;ctx.shadowBlur=8*s;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-82*s);ctx.stroke();ctx.fillStyle=[theme.lightA,theme.lightB,theme.accent][Math.abs(Math.floor(z/170))%3];ctx.strokeStyle=theme.curbA;ctx.lineWidth=Math.max(1,3*s);ctx.beginPath();ctx.arc(0,-91*s,15*s,0,7);ctx.fill();ctx.stroke();ctx.restore()}}
}
function drawGates(){
  const theme=activeCourse.theme,gates=[];for(let z=Math.ceil((state.distance+110)/430)*430;z<state.distance+DRAW_DISTANCE;z+=430)gates.push(z);
  for(let i=gates.length-1;i>=0;i--){const rel=gates[i]-state.distance,p=roadPoint(rel);if(!p.visible||tunnelAt(gates[i]))continue;const s=p.scale,alpha=(.28+s*.72)*distanceFadeAlpha(rel,460,790);if(alpha<=.02)continue;const left=p.cx-p.half*1.12,right=p.cx+p.half*1.12,top=p.y-155*s;ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=gates[i]%860===0?theme.lightA:theme.lightB;ctx.lineWidth=Math.max(2,9*s);ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=18*s;ctx.beginPath();ctx.moveTo(left,p.y);ctx.lineTo(left,top+32*s);ctx.quadraticCurveTo(p.cx,top-65*s,right,top+32*s);ctx.lineTo(right,p.y);ctx.stroke();ctx.fillStyle=theme.accent;for(let k=-2;k<=2;k++){ctx.beginPath();ctx.arc(p.cx+k*45*s,top-18*s+Math.abs(k)*8*s,6*s,0,7);ctx.fill()}ctx.restore()}
}
function drawRoadMotion(){
  const comfort=motionLevel(settings.speedLines);if(state.speed<45||comfort<=0){canvas.dataset.speedFlow='off';return}const power=Math.min(1,(state.speed-40)/145),cycle=690,travel=state.distance*(1.45+power*2.8);ctx.save();ctx.lineCap='round';ctx.globalCompositeOperation='screen';ctx.globalAlpha=comfort;
  const count=Math.max(7,Math.round(26*comfort));for(let i=0;i<count;i++){const rel=18+((i*79-travel)%cycle+cycle)%cycle,route=routeGeometryAt(state.distance+rel);let lane=((i*47)%101/100-.5)*1.56;if(route?.fork>.055&&(Math.abs(lane)<route.visualInner+.06||Math.abs(lane)>route.visualOuter-.04))lane=(i%2?-1:1)*route.visualCenter;const length=22+power*72,pNear=roadPoint(rel),pMid=roadPoint(rel+length*.52),pFar=roadPoint(rel+length);if(!pNear.visible||!pMid.visible||!pFar.visible)continue;const xNear=pNear.cx+pNear.half*lane,xMid=pMid.cx+pMid.half*lane,xFar=pFar.cx+pFar.half*lane,gradient=ctx.createLinearGradient(xFar,pFar.y,xNear,pNear.y);gradient.addColorStop(0,'rgba(180,246,255,0)');gradient.addColorStop(.45,`rgba(180,246,255,${.08+power*.14})`);gradient.addColorStop(1,`rgba(255,255,255,${.13+power*.28})`);ctx.strokeStyle=gradient;ctx.lineWidth=Math.max(.55,Math.min(4.2,pNear.half*(.0038+power*.0038)));ctx.beginPath();ctx.moveTo(xFar,pFar.y);ctx.quadraticCurveTo(xMid,pMid.y,xNear,pNear.y);ctx.stroke()}
  ctx.restore();canvas.dataset.speedFlow=comfort<.75?'road-projected-low':'road-projected';
}

function drawProjectedRouteArrow(z,side,color,label){
  const rel=z-state.distance;if(rel<18||rel>DRAW_DISTANCE-24)return false;const near=roadPoint(rel-15),far=roadPoint(rel+18);if(!near.visible||!far.visible)return false;const lane=side*.56,nx=near.cx+near.half*lane,ny=near.y,fx=far.cx+far.half*lane,fy=far.y,dx=fx-nx,dy=fy-ny,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len,px=-uy,py=ux,line=Math.max(3,near.half*.075),head=Math.max(8,near.half*.2);ctx.save();ctx.globalAlpha=distanceFadeAlpha(rel,470,780)*.88;ctx.strokeStyle=color;ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=Math.max(5,line*1.8);ctx.lineCap='round';ctx.lineWidth=line;ctx.beginPath();ctx.moveTo(nx,ny);ctx.lineTo(fx-ux*head*.5,fy-uy*head*.5);ctx.stroke();ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx-ux*head+px*head*.62,fy-uy*head+py*head*.62);ctx.lineTo(fx-ux*head-px*head*.62,fy-uy*head-py*head*.62);ctx.closePath();ctx.fill();ctx.shadowBlur=5;ctx.fillStyle='#fff';ctx.font=`900 ${Math.max(7,Math.min(16,near.half*.095))}px Fredoka`;ctx.textAlign='center';ctx.textBaseline='bottom';ctx.fillText(label,nx,ny-line*.8);ctx.restore();return true
}
function drawRouteDecisionGate(z,graph,lap){
  const rel=z-state.distance;if(rel<18||rel>DRAW_DISTANCE-30)return false;const p=roadPoint(rel);if(!p.visible)return false;const theme=activeCourse.theme,alpha=distanceFadeAlpha(rel,470,790),selected=racers[state.selected]?.routeLap===lap?racers[state.selected].routeChoice:null,panelW=Math.max(42,p.half*.68),panelH=Math.max(18,p.half*.25),panelY=p.y-Math.max(34,p.half*.64),poleTop=panelY+panelH*.5;ctx.save();ctx.globalAlpha=alpha;ctx.lineWidth=Math.max(2,p.half*.045);ctx.strokeStyle=theme.curbA;ctx.shadowColor=theme.lightB;ctx.shadowBlur=Math.max(5,p.half*.08);for(const side of[-1,1]){const x=p.cx+side*p.half*.48,branch=side<0?graph.branches.left:graph.branches.right,color=side<0?theme.lightA:theme.lightB;ctx.beginPath();ctx.moveTo(x-side*panelW*.34,p.y);ctx.lineTo(x-side*panelW*.34,poleTop);ctx.stroke();ctx.fillStyle='rgba(10,8,35,.94)';ctx.strokeStyle=selected===branch.id?'#fff36e':color;ctx.lineWidth=Math.max(2,p.half*.025);ctx.beginPath();ctx.roundRect(x-panelW/2,panelY,panelW,panelH,Math.max(4,panelH*.2));ctx.fill();ctx.stroke();ctx.fillStyle=selected===branch.id?'#fff36e':'#fff';ctx.font=`900 ${Math.max(7,Math.min(18,p.half*.11))}px Fredoka`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(`${side<0?'←':'→'} ${branch.label}`,x,panelY+panelH*.38,panelW*.9);ctx.fillStyle=color;ctx.font=`900 ${Math.max(5,Math.min(10,p.half*.06))}px Fredoka`;ctx.fillText(branch.perk,x,panelY+panelH*.73,panelW*.88)}ctx.restore();return true
}
function drawRouteGraphRoad(){
  const graph=activeCourse?.routeGraph;if(!graph)return;const length=raceLength(),theme=activeCourse.theme,firstLap=Math.max(0,Math.floor((state.distance-graph.end-190)/length)),lastLap=Math.ceil((state.distance+DRAW_DISTANCE-graph.start+190)/length);let visibleForks=0,visibleGates=0;
  for(let lap=firstLap;lap<=lastLap;lap++){
    const start=lap*length+graph.start,end=lap*length+graph.end,selected=racers[state.selected]?.routeLap===lap?racers[state.selected].routeChoice:null;
    for(const warning of[165,105,52])for(const branch of Object.values(graph.branches))drawProjectedRouteArrow(start-warning,branch.side,selected===branch.id?'#fff36e':branch.side<0?theme.lightA:theme.lightB,branch.side<0?'ITEM':'BOOST');
    if(drawRouteDecisionGate(start-82,graph,lap))visibleGates++;
    const from=Math.max(start,state.distance+2),to=Math.min(end,state.distance+DRAW_DISTANCE);if(to<=from)continue;visibleForks++;
  }
  canvas.dataset.routeForkVisible=String(visibleForks);canvas.dataset.routeGraphEdges=String(graph.edges.length);canvas.dataset.routeRoadModel=graph.geometry?.model||'none';canvas.dataset.routeDecisionGate=visibleGates?'visible':'none';
}

function drawFrame(frame,x,y,width,alpha=1,rotation=0){if(!frame)return;const height=width*frame.sh/frame.sw;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(rotation);ctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,-width/2,-height,width,height);ctx.restore()}
function drawFrameCentered(frame,x,y,width,alpha=1,rotation=0){if(!frame)return;const height=width*frame.sh/frame.sw;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(rotation);ctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,-width/2,-height/2,width,height);ctx.restore()}
function drawFrameHeight(frame,x,y,height,alpha=1,rotation=0){if(!frame)return;const width=height*frame.sw/frame.sh;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(rotation);ctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,-width/2,-height,width,height);ctx.restore()}
function drawKartShadow(x,y,w,alpha=.32){ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='#050310';ctx.beginPath();ctx.ellipse(x,y-3,w,.24*w,0,0,7);ctx.fill();ctx.restore()}
function drawOpponentTag(x,y,r,rank){const text=r===miaNpc?`BOSS  ${r.name}`:`${rank}  ${r.name}`;ctx.save();ctx.font="900 12px 'Noto Sans JP'";const width=Math.max(60,ctx.measureText(text).width+18);ctx.fillStyle=r===miaNpc?'rgba(43,2,34,.9)':'rgba(10,8,32,.82)';ctx.strokeStyle=r.color;ctx.lineWidth=r===miaNpc?3:2;ctx.shadowColor=r===miaNpc?r.color:'transparent';ctx.shadowBlur=r===miaNpc?15:0;ctx.beginPath();ctx.roundRect(x-width/2,y-18,width,25,12);ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,x,y-5);ctx.restore()}
function jumpCameraDrop(){return(state.jumpView||0)*(innerHeight*.07+Math.min(62,state.speed*.2))*motionLevel(settings.cameraMotion)}
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
function projectedRoutePath(distance,lane=0){const geometry=routeGeometryAt(distance);if(!geometry||geometry.fork<=.055)return null;return Object.values(geometry.branches).sort((a,b)=>Math.abs(lane-a.laneCenter)-Math.abs(lane-b.laneCenter))[0]||null}
function projectedRouteLane(distance,lane=0){const path=projectedRoutePath(distance,lane);if(!path)return lane*.78;const local=clamp((lane-path.laneCenter)/Math.max(.001,path.laneHalf),-1.35,1.35);return path.visualCenter+local*path.visualHalf}
function projectTrackEntity(distance,lane=0){
  const rel=distance-state.distance,depth=Math.max(4,8+rel),p=roadPoint(depth),s=trackSample(distance/TRACK_LENGTH),base=trackSample(state.progress);
  const path=projectedRoutePath(distance,lane);return{x:p.cx+p.half*projectedRouteLane(distance,lane),y:routePathY(p,path),half:p.half,heading:s.heading,cameraHeading:base.heading,relativeHeading:p.relativeHeading+(path?.curveBias||0)*.34,tangent:p.tangent+(path?.curveBias||0)*.2,scale:Math.max(.11,Math.min(1.02,p.scale*1.28)),visible:p.visible,routePath:path};
}
const TRACK_ENTITY_STYLE={
  coin:{roadHeight:.31,minHeight:9,maxHeight:.13,fadeNear:500,fadeFar:748,float:.18},
  item:{roadHeight:.46,minHeight:12,maxHeight:.18,fadeNear:510,fadeFar:758,float:.08},
  pad:{roadHeight:.29,minHeight:10,maxHeight:.13,fadeNear:520,fadeFar:770,float:0},
  ramp:{roadHeight:.58,minHeight:7,maxHeight:.32,fadeNear:535,fadeFar:798,float:0}
};
function projectTrackEntityDescriptor(object){
  const style=TRACK_ENTITY_STYLE[object.type]||TRACK_ENTITY_STYLE.item,rel=object.z-state.distance,p=projectTrackEntity(object.z,object.lane),height=Math.max(style.minHeight,Math.min(innerHeight*style.maxHeight,p.half*style.roadHeight)),groundY=p.y+Math.max(1.5,height*.035),alpha=distanceFadeAlpha(rel,style.fadeNear,style.fadeFar),portal=firstTunnelPortalBetween(object.z);
  return{object,type:object.type,z:object.z,rel,p,height,groundY,alpha,portal,tunnel:tunnelAt(object.z),visible:p.visible&&alpha>.02&&p.x>-innerWidth*.18&&p.x<innerWidth*1.18&&groundY>-innerHeight*.15&&groundY<innerHeight*1.12,style};
}
function drawCourseLimits(){
  const danger=clamp((Math.abs(state.x)-1.72)/(COURSE_SOFT_WALL-1.72),0,1),nearSide=Math.sign(state.x)||1,distances=[35,80,145,230,340,500,690];ctx.save();ctx.lineCap='round';ctx.setLineDash([]);
  for(const side of [-1,1]){const points=distances.map(d=>{const p=roadPoint(d);return{x:p.cx+p.half*side*COURSE_SOFT_WALL,y:p.y}});ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));const hot=danger>0&&side===nearSide;ctx.strokeStyle=hot?`rgba(255,55,125,${.68+danger*.3})`:'rgba(255,250,241,.5)';ctx.lineWidth=hot?5:2.4;ctx.shadowColor=hot?'#ff397d':'#7b294e';ctx.shadowBlur=hot?18:7;ctx.stroke()}
  ctx.setLineDash([]);if(danger>.12){const p=roadPoint(120);ctx.globalAlpha=.45+danger*.5;ctx.fillStyle='#ff66bd';ctx.font="900 13px 'Noto Sans JP'";ctx.textAlign='center';ctx.fillText('COURSE EDGE',p.cx+nearSide*p.half*1.66,p.y-20)}ctx.restore();
}
function jumpRampFrameFor(p,ramp){
  if(!jumpRampFrames.length)return null;
  const row=Math.max(0,Math.min(JUMP_RAMP_ROWS-1,activeCourse?.rampRow??state.selectedCourse));
  // Select the art from the road that is actually on screen.  World-space
  // curve signs can be opposite to the projected direction depending on the
  // loop heading, and they also miss the perspective of an off-centre ramp.
  const rel=ramp.z-state.distance,near=roadPoint(Math.max(4,rel-18)),far=roadPoint(rel+18),lane=ramp.lane||0;
  const nearX=near.cx+near.half*projectedRouteLane(ramp.z-18,lane),farX=far.cx+far.half*projectedRouteLane(ramp.z+18,lane),screenDx=farX-nearX,screenDy=Math.max(5,near.y-far.y);
  const worldDx=far.worldX-near.worldX,relativeYaw=p?.relativeHeading??roadPoint(rel).relativeHeading,before=trackSample((ramp.z-24)/TRACK_LENGTH),after=trackSample((ramp.z+24)/TRACK_LENGTH),courseTurn=angleDelta(after.heading,before.heading);
  let targetScore=clamp(Math.atan2(screenDx,screenDy)/(Math.PI*.5),-1,1);if(Math.abs(targetScore)<.045)targetScore=0;
  const signChanged=Number.isFinite(ramp.frameScore)&&Math.sign(ramp.frameScore)!==Math.sign(targetScore)&&Math.abs(targetScore)>.07;
  if(!Number.isFinite(ramp.frameScore)||signChanged)ramp.frameScore=targetScore;else ramp.frameScore+=(targetScore-ramp.frameScore)*.7;
  const score=ramp.frameScore,direction=Math.sign(score);let col=3,best=Infinity;for(let i=0;i<JUMP_RAMP_FRAME_YAW.length;i++){const error=Math.abs(JUMP_RAMP_FRAME_YAW[i]-score);if(error<best){best=error;col=i}}
  if(Number.isInteger(ramp.frameCol)&&ramp.frameCol!==col&&Math.sign(JUMP_RAMP_FRAME_YAW[ramp.frameCol])===direction){const heldError=Math.abs(JUMP_RAMP_FRAME_YAW[ramp.frameCol]-score);if(best+.055>=heldError)col=ramp.frameCol}ramp.frameCol=col;
  return{frame:jumpRampFrames[row*JUMP_RAMP_COLS+col]||jumpRampFrames[row*JUMP_RAMP_COLS+3],row,col,score,dx:screenDx,dy:screenDy,worldDx,relativeYaw,courseTurn,direction};
}
function drawRampTrackEntity(entry){
  const ramp=entry.object,picked=jumpRampFrameFor(entry.p,ramp),frame=picked?.frame;if(!frame)return;const width=entry.height*frame.sw/frame.sh;drawThroughTunnelPortal(entry,()=>{drawKartShadow(entry.p.x,entry.groundY+3,Math.max(4,width*.36),.28*entry.alpha);drawFrameHeight(frame,entry.p.x,entry.groundY+4,entry.height,entry.alpha,0)});canvas.dataset.jumpRampFrame=`${picked.row}:${picked.col}`;canvas.dataset.jumpRampAngleScore=picked.score.toFixed(3);canvas.dataset.jumpRampVector=`${picked.dx.toFixed(3)},${picked.dy.toFixed(3)},${picked.worldDx.toFixed(4)},${picked.relativeYaw.toFixed(3)},${picked.courseTurn.toFixed(4)}`;canvas.dataset.jumpRampDirection=picked.direction>0?'right':picked.direction<0?'left':'straight';canvas.dataset.jumpRampSize=entry.height.toFixed(1)
}
function drawPickupTrackEntity(entry){
  const o=entry.object,frame=o.type==='coin'?itemFrames[4]:o.type==='item'?itemFrames[6]:itemFrames[7];if(!frame)return;const bob=Math.sin(state.elapsed*.005+o.z*.03)*entry.height*.055,baseY=entry.groundY-entry.height*entry.style.float+bob,rotation=o.type==='coin'?Math.sin(state.elapsed*.004)*.15:0,width=entry.height*frame.sw/frame.sh;drawThroughTunnelPortal(entry,()=>{if(o.type!=='pad')drawKartShadow(entry.p.x,entry.groundY+2,Math.max(3,width*.3),.18*entry.alpha);drawFrameHeight(frame,entry.p.x,baseY,entry.height,entry.alpha,rotation)})
}
function drawTrackEntities(){
  const entries=state.objects.filter(o=>(o.type==='ramp'||!o.taken)&&o.z-state.distance>-18&&o.z-state.distance<DRAW_DISTANCE).map(projectTrackEntityDescriptor).filter(entry=>entry.visible).sort((a,b)=>b.rel-a.rel||Number(a.type==='ramp')-Number(b.type==='ramp'));
  for(const entry of entries){if(entry.type==='ramp')drawRampTrackEntity(entry);else drawPickupTrackEntity(entry)}
  canvas.dataset.trackEntityCount=String(entries.length);canvas.dataset.trackEntityOrder='far-to-near';canvas.dataset.trackEntityProjection='shared-road-tunnel-v1';canvas.dataset.trackEntityTunnel=String(entries.filter(entry=>entry.tunnel).length)
}
function drawCollectFx(){
  for(const f of state.collectFx){const r=racers[f.targetIndex],targetRel=r.distance-state.distance;if(f.targetIndex!==state.selected&&(targetRel<-20||targetRel>DRAW_DISTANCE))continue;const start=projectTrackEntity(f.z,f.lane),target=f.targetIndex===state.selected?{x:innerWidth*.5,y:Math.min(innerHeight*.9,roadPoint(2.5).y)+state.suspension,scale:1}:projectTrackEntity(r.distance,r.lane);if(!target||!Number.isFinite(target.x))continue;const t=1-f.life/f.max,ease=1-Math.pow(1-t,3),arc=Math.sin(t*Math.PI)*Math.min(80,Math.abs(target.x-start.x)*.18+34),x=start.x+(target.x-start.x)*ease,y=start.y+(target.y-start.y)*ease-arc,frame=f.type==='coin'?itemFrames[4]:f.type==='item'?itemFrames[6]:itemFrames[7],size=(f.type==='coin'?58:82)*(1-t*.45)*Math.max(.45,start.scale);drawThroughTunnelPortal(f.z,()=>{ctx.save();ctx.strokeStyle=f.type==='coin'?'rgba(255,224,76,.7)':f.type==='item'?'rgba(111,239,255,.72)':'rgba(255,91,195,.72)';ctx.lineWidth=Math.max(2,size*.08);ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(start.x,start.y);ctx.quadraticCurveTo((start.x+target.x)/2,(start.y+target.y)/2-arc*1.35,x,y);ctx.stroke();ctx.restore();drawFrame(frame,x,y,size,Math.min(1,f.life/.12),t*6);
    if(t>.42){const label=`${r.name}  ${f.label}`;ctx.save();ctx.globalAlpha=Math.min(1,(t-.42)*3)*(f.life/.22<1?f.life/.22:1);ctx.font="900 12px 'Noto Sans JP'";const width=Math.max(78,ctx.measureText(label).width+20),ly=target.y-112*Math.max(.45,target.scale||1);ctx.fillStyle='rgba(12,8,35,.88)';ctx.strokeStyle=r.color;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(target.x-width/2,ly-16,width,25,12);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,target.x,ly-3);ctx.restore()}})}
}
function drawOpponentItemAura(racer,x,y,height,alpha){
  if(racer.invincible>0){const frame=animatedFxFrame(itemFxFrames,4,(state.elapsed*.0022)%1);drawFrameCentered(frame,x,y-height*.43,height*1.32,alpha*.72,0)}
  if(racer.shield>0){ctx.save();ctx.globalAlpha=alpha*(.5+.18*Math.sin(state.elapsed*.011));ctx.strokeStyle='#78efff';ctx.lineWidth=Math.max(2,height*.028);ctx.shadowColor='#46eaff';ctx.shadowBlur=Math.max(8,height*.15);ctx.beginPath();ctx.ellipse(x,y-height*.43,height*.48,height*.56,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
}
function drawOpponents(){
  const player=racers[state.selected],order=raceOrder(),visible=raceContestants().map((r,i)=>({r,i,rel:r.distance-state.distance,rank:order.indexOf(r)+1})).filter(o=>o.r!==player&&o.rel>-8&&o.rel<480).sort((a,b)=>b.rel-a.rel);
  for(const o of visible){const isMia=o.r===miaNpc,side=o.rel<0?(o.i%2?.1:-.1):0,p=projectTrackEntity(o.r.distance,o.r.lane+side);if(!p.visible||p.x<-160||p.x>innerWidth+160||p.y<-260||p.y>innerHeight+120)continue;const alpha=distanceFadeAlpha(o.rel,330,470);if(alpha<=.02)continue;const laneTurn=(o.r.aiTargetLane-o.r.lane)*2.5,turn=Math.max(-3,Math.min(3,Math.round(p.tangent*9+laneTurn))),col=3+turn,frameIndex=col,frame=o.r.frames?.[frameIndex];
    const height=Math.max(24,Math.min(isMia?194:178,(isMia?178:166)*p.scale)),jump=(o.r.jumpY||0)*Math.max(.45,p.scale),spriteY=p.y+6-jump;drawThroughTunnelPortal(o.r.distance,()=>{if(isMia){ctx.save();ctx.globalAlpha=alpha*(.3+.16*Math.sin(state.elapsed*.012));ctx.fillStyle='#ff4da8';ctx.shadowColor='#ff2d99';ctx.shadowBlur=35;ctx.beginPath();ctx.ellipse(p.x,spriteY-height*.46,height*.56,height*.68,0,0,7);ctx.fill();ctx.restore()}drawKartShadow(p.x,p.y,Math.max(9,height*.38)*(1-Math.min(.24,jump/180)),Math.max(.08,.16+p.scale*.18-jump*.0015)*alpha);drawOpponentItemAura(o.r,p.x,spriteY,height,alpha);drawFrameHeight(frame,p.x,spriteY,height,(o.r.hit>0?.62:1)*alpha,(o.r.spin>0?Math.sin(state.elapsed*.025)*.25:turn*.025));if(o.rel<300&&height>44&&alpha>.28)drawOpponentTag(p.x,spriteY-height-9,o.r,o.rank)});
  }
}
function drawProjectiles(){for(const shot of state.projectiles){const rel=shot.z-state.distance;if(rel<-12||rel>650)continue;const p=projectTrackEntity(shot.z,shot.lane),alpha=distanceFadeAlpha(rel,420,630);if(p.visible&&alpha>.02)drawThroughTunnelPortal(shot.z,()=>drawFrame(itemFrames[1],p.x,p.y,62*p.scale,alpha,-.25))}}
function drawPlayer(){
  const mobileRace=matchMedia('(pointer:coarse)').matches||innerWidth<820,r=racers[state.selected],hard=mobileRace?(state.drift>.4?1.75:Math.abs(state.steer)>.78?2.25:1.7):(state.drift>.4?2:Math.abs(state.steer)>.78?3:2),col=Math.max(0,Math.min(6,3+Math.round(state.steer*hard))),frame=r.frames?.[col];
  canvas.dataset.player=r.slug;canvas.dataset.frame=String(col);canvas.dataset.speed=String(Math.round(state.speed));canvas.dataset.distance=state.distance.toFixed(1);canvas.dataset.drift=String(state.driftLevel);canvas.dataset.centrifugal=state.centrifugal.toFixed(3);canvas.dataset.jump=state.jumpY.toFixed(1);canvas.dataset.airborne=String(state.airborne);
  const shakeFactor=motionLevel(settings.screenShake),cameraDrop=jumpCameraDrop(),base=roadPoint(2.5),x=innerWidth*.5+state.steer*18+(Math.random()-.5)*state.shake*shakeFactor,groundY=Math.min(innerHeight*.9,base.y)+state.suspension+(Math.random()-.5)*state.shake*shakeFactor,shadowY=groundY+cameraDrop-state.suspension*.45,y=groundY-state.jumpY,bob=Math.sin(state.elapsed*(.012+state.speed*.00008))*(1.2+state.speed*.008)*motionLevel(settings.cameraMotion),squash=1-Math.min(.055,Math.abs(state.suspension)*.0035),targetHeight=mobileRace?Math.min(214,Math.max(156,innerHeight*.34)):Math.min(innerHeight*.29,218),height=targetHeight*squash,jumpScale=1-Math.min(.23,(state.jumpY+cameraDrop*.55)/190);
  drawKartShadow(x,shadowY,Math.min(92,height*.4)*jumpScale,Math.max(.08,.42-Math.min(.25,(state.jumpY+cameraDrop*.55)*.003)));if(state.boosting||state.invincible>0){const row=state.invincible>0?4:0,v=animatedFxFrame(itemFxFrames,row,(state.elapsed*.0022)%1),effectY=state.invincible>0?y-height*.46:y-height*.12;drawFrameCentered(v,x,effectY,state.invincible>0?218:176,state.invincible>0?.78:.92,state.invincible>0?0:Math.PI)}
  drawFrameHeight(frame,x,y+bob,height,1,-state.steer*(state.drift>0?.085:.04)+state.centrifugal*.018);
  if(state.shield>0){ctx.save();ctx.strokeStyle='#77efff';ctx.lineWidth=5;ctx.globalAlpha=.5+.25*Math.sin(state.elapsed*.01);ctx.shadowColor='#46eaff';ctx.shadowBlur=25;ctx.beginPath();ctx.ellipse(x,y-height*.42,Math.min(innerWidth*.15,165),height*.46,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
}
function drawParticles(layer='front'){
  for(const p of state.particles){
    if((p.layer||'front')!==layer)continue;
    const a=Math.max(0,p.life/p.max),progress=particleFxProgress(p);
    if(p.fxFrame!==undefined){
      const row=DRIVING_FX_ROW[p.fxFrame]??0,frame=animatedFxFrame(drivingFxFrames,row,progress);
      drawFrame(frame,p.x,p.y,p.size,Math.min(1,a*1.55),p.rot);
    }else if(p.kind==='burst'){
      const frame=burstAnimationFrame(p,progress);
      drawFrameCentered(frame,p.x,p.y,p.size,Math.min(1,a*1.7),p.rot);
    }else if(p.kind==='dot'){
      const frame=burstAnimationFrame({burstFrame:burstFrameForColor(p.color)},progress);
      if(frame)drawFrameCentered(frame,p.x,p.y,p.size*8,Math.min(1,a*1.4),p.rot);
      else{ctx.save();ctx.globalAlpha=a;ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=9;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,7);ctx.fill();ctx.restore()}
    }else if(p.kind==='smoke'){
      ctx.save();ctx.globalAlpha=a*.5;ctx.fillStyle=p.color;ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.scale(1.18+(1-a)*.8,.82+(1-a)*.45);ctx.beginPath();ctx.arc(0,0,p.size*(1+(1-a)*1.35),0,7);ctx.fill();ctx.globalAlpha*=.38;ctx.beginPath();ctx.arc(-p.size*.55,-p.size*.2,p.size*.72,0,7);ctx.arc(p.size*.58,-p.size*.08,p.size*.62,0,7);ctx.fill();ctx.restore();
    }else if(p.kind==='shockwave'){
      ctx.save();ctx.globalAlpha=a*.78;ctx.strokeStyle=p.color;ctx.lineWidth=Math.max(2,p.size*.028*a);ctx.shadowColor='#fff0a8';ctx.shadowBlur=18*a;ctx.beginPath();ctx.ellipse(p.x,p.y,p.size*(1.15+(1-a)*1.35),p.size*(.18+(1-a)*.16),0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha*=.35;ctx.lineWidth=Math.max(1,p.size*.012);ctx.beginPath();ctx.ellipse(p.x,p.y,p.size*(.72+(1-a)*.85),p.size*(.1+(1-a)*.1),0,0,Math.PI*2);ctx.stroke();ctx.restore();
    }else if(p.kind==='dust'){
      ctx.save();ctx.globalAlpha=a*.72;ctx.fillStyle=p.color;ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.scale(1.7-a*.45,.7+a*.25);ctx.beginPath();ctx.arc(0,0,p.size*(1+(1-a)*.95),0,7);ctx.fill();ctx.restore();
    }else if(p.kind==='exhaust'){
      ctx.save();ctx.globalAlpha=a;ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=18;ctx.translate(p.x,p.y);ctx.rotate(Math.PI*.25);ctx.fillRect(-p.size*a,-p.size*a,p.size*a*2,p.size*a*2.5);ctx.restore();
    }else if(p.kind==='spark'){
      ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=12;ctx.lineWidth=p.size;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*.05,p.y-p.vy*.05);ctx.stroke();ctx.restore();
    }else{
      const frame=animatedFxFrame(itemFxFrames,p.index??5,progress);
      if(p.center)drawFrameCentered(frame,p.x,p.y,p.size,Math.min(1,a*1.5),p.rot);else drawFrame(frame,p.x,p.y,p.size,Math.min(1,a*1.5),p.rot);
    }
  }
}
function drawRace(){
  const cameraMotion=motionLevel(settings.cameraMotion),shakeFactor=motionLevel(settings.screenShake),roll=(state.drift>0?-state.steer*.008:0)*shakeFactor,bob=(Math.sin(state.elapsed*.012)*Math.min(1.5,state.speed/135)-state.suspension*.28+state.landingBounce)*cameraMotion,cameraDrop=jumpCameraDrop();
  roadProjection=[];tunnelClipCount=0;buildRoadProjection();canvas.dataset.course=activeCourse.short;canvas.dataset.bgm=raceBgm?(raceBgm.paused?`paused:${musicError||'waiting'}`:'playing'):'none';canvas.dataset.taken=String(state.objects.filter(o=>o.taken).length);canvas.dataset.collectFx=String(state.collectFx.length);canvas.dataset.suspension=state.suspension.toFixed(2);canvas.dataset.nextTunnelPortal=String(firstTunnelPortalBetween(state.distance+DRAW_DISTANCE)??'none');canvas.dataset.jumpCamera=cameraDrop.toFixed(1);
  ctx.save();ctx.translate(innerWidth/2,innerHeight/2+bob);ctx.rotate(roll);ctx.translate(-innerWidth/2,-innerHeight/2);ctx.translate((Math.random()-.5)*state.shake*shakeFactor,(Math.random()-.5)*state.shake*shakeFactor);drawBackdrop();if(cameraDrop>0)ctx.translate(0,cameraDrop);drawRoad();drawVergeSurfaceDetails();drawRoadSurfaceDetails();drawRoadMotion();drawRouteGraphRoad();drawMode7Texture();drawGuardrails();drawDistantScenery();drawVergeDetails();drawTracksideDecorations();drawTrackside();drawGates();drawStartArch();drawDistanceFog();drawTunnel();if(state.debug.showCourseLimits)drawCourseLimits();drawTrackEntities();drawProjectiles();drawOpponents();drawCollectFx();drawTunnelForeground();ctx.restore();canvas.dataset.tunnelOcclusion=String(tunnelClipCount);drawParticles('back');drawPlayer();drawParticles('front');const flashFactor=motionLevel(settings.screenFlash);if(state.flash>0&&flashFactor>0){ctx.fillStyle=`rgba(255,255,255,${state.flash*.65*flashFactor})`;ctx.fillRect(0,0,innerWidth,innerHeight)}
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
function loop(t){const dt=Math.min(.033,(t-(state.last||t))/1000);state.last=t;updateAdaptiveQuality(t);pollGamepad();update(dt);updateAudioScene();render(t);if($('debugLiveMetrics'))$('debugLiveMetrics').textContent=`FPS ${canvas.dataset.qaFps||canvas.dataset.adaptiveFps||'--'} / P95 ${canvas.dataset.qaFrameP95||canvas.dataset.adaptiveP90||'--'}ms / ${activePerformanceKey().toUpperCase()}`;requestAnimationFrame(loop)}
requestAnimationFrame(loop);

let setRankAnimationTimer=null;
function playSetRankAnimation(meta){
  const current=$('setRank'),next=current.cloneNode(false);
  clearTimeout(setRankAnimationTimer);
  next.id='setRank';next.textContent=meta.rank;next.className=`rank-badge rank-${meta.rank.toLowerCase()} rank-animating`;
  current.replaceWith(next);
  setRankAnimationTimer=setTimeout(()=>next.classList.remove('rank-animating'),980);
}
