const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const $ = id => document.getElementById(id);
$('hud')?.setAttribute('data-broadcast-layout','separated-status-lanes-v2');

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
  ['リベル・バーマン','リベル・バーマン.png','liber-birman','#d8c1a0'],
  ['マスカ・シャルトリュー','マスカ・シャルトリュー.png','masuka-chartreux','#b9d95a'],
  ['ソーイ・トンキニーズ','ソーイ・トンキニーズ.png','soyi-tonkinese','#9b78c7'],
  ['シノ・コーニッシュ','シノ・コーニッシュ.png','shino-cornish','#5d3c88'],
  ['アロマ・バリニーズ','アロマ・バリニーズ.png','aroma-balinese','#c5a8e7'],
  ['マツリ・ジャパニーズボブテイル','マツリ・ジャパニーズボブテイル.png','matsuri-japanese-bobtail','#e2442d']
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
  {kart:'ファントム・ブックライナー',rank:'S',description:'幻影のようにラインをずらす、カーニバルナイトの技巧派セット。',stats:{speed:88,accel:78,handling:86,boost:92,technique:91}},
  {kart:'ジュエル・マスカットグライダー',rank:'S',description:'果汁バリアと軽やかな滑走を両立する、宝石仕立てのマスカットセット。',stats:{speed:88,accel:82,handling:91,boost:86,technique:88}},
  {kart:'ステッチ・クチュール',rank:'S',description:'理想ラインを縫い上げて旋回性能を高める、精密仕立ての技巧派セット。',stats:{speed:78,accel:80,handling:98,boost:76,technique:96}},
  {kart:'シャドウ・マキモノ',rank:'S',description:'影へ溶けて狭いラインを切り抜ける、軽量忍者レーシングセット。',stats:{speed:88,accel:90,handling:91,boost:86,technique:94}},
  {kart:'パルファム・ミラージュ',rank:'S',description:'香りの軌跡でライバルを惑わせる、優雅なミラージュセット。',stats:{speed:80,accel:90,handling:90,boost:84,technique:96}},
  {kart:'タコニャキ・フェス号',rank:'A',description:'観客の熱気を力に変えて加速する、にぎやかな屋台祭りセット。',stats:{speed:82,accel:92,handling:82,boost:90,technique:94}}
];

const RACER_HERO_PRESENTATION={
  'aruka-sham':{scale:1.085,y:0},'garnet-bengal':{scale:1.091,y:0},
  'kohaku-taiga':{scale:.929,y:0},'yukine-silky':{scale:.934,y:0},
  'rhythm-sphynx':{scale:.911,y:0},'reska-americancurl':{scale:.914,y:0},
  'cleo-mau':{scale:.895,y:0},'sucre-persian':{scale:.9,y:0}
};
const racers = racerData.map((r,i)=>{const hero=`assets/select-heroes/${r[2]}.webp`,selectHero=`assets/select-chibis/${r[2]}.webp`;return{
  name:r[0],portrait:i<12?`assets/portraits/${r[2]}.webp`:hero,slug:r[2],color:r[3],
  hero,selectHero,heroPresentation:RACER_HERO_PRESENTATION[r[2]]||{scale:1,y:0},selectPresentation:{scale:1,y:0},set:racerSetData[i],progress:0,lane:((i%5)-2)*.31,pace:.034+(i%6)*.0007
}});

// Each set gets a readable specialty from its strongest stat.  The same data
// is also used by the handling code below, so this is not merely menu copy.
const TRAIT_COPY={
  speed:['STRAIGHT ACE','最高速が伸びる直線番長。長いストレートでじわじわ引き離す。'],
  accel:['QUICK LAUNCH','加速の立ち上がりが鋭い。減速や着地からの復帰が得意。'],
  handling:['DRIFT ARTIST','曲がりながら速度を保つドリフト巧者。外へ流されにくい。'],
  boost:['NITRO CAT','ブーストが濃く長い。加速床・ミニターボを最大限に活かす。'],
  technique:['CAN TACTICIAN','猫缶ギアと悪路の扱いが上手い、安定感のあるテクニシャン。']
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
  technique:{key:'tactician',label:'LINE TACTICIAN',jp:'ラインの魔術師',copy:'混雑と猫缶の位置を読み、空いたラインへ先回りする。',aggression:.72,decisionTempo:.76,passWidth:.35,lineGrip:.96,objectInterest:1.22,trafficAvoidance:1.34,boostThreshold:.62}
};
function buildAiPersonality(racer,index){
  const preset=AI_PERSONALITY_PRESETS[racer.trait.key]||AI_PERSONALITY_PRESETS.technique,stats=racer.set.stats;
  let hash=0;for(const ch of racer.slug)hash=(hash*31+ch.charCodeAt(0))>>>0;
  const passSide=hash%2?1:-1,temper=((hash>>3)%9-4)*.018,rhythm=.9+((hash>>7)%11)*.018;
  return{...preset,passSide,rhythm,aggression:clamp(preset.aggression+temper+(stats.accel-82)*.002,.58,1.08),boostThreshold:clamp(preset.boostThreshold-(stats.boost-82)*.0025,.3,.82),signature:`${preset.jp} / ${passSide<0?'LEFT':'RIGHT'} ATTACK`,index};
}
racers.forEach((racer,index)=>{racer.trait=buildRacerTrait(racer);racer.aiPersonality=buildAiPersonality(racer,index)});

// Every playable racer owns one race signature. These are deliberately
// separate from the always-on stat trait above: a signature has a readable
// trigger, a short active window, a cooldown, performance modifiers and an
// identifying race effect. NPCs use exactly the same data as the player.
function racerSignature(label,jp,copy,trigger,cooldown,duration,color,color2,glyph,visual,performance={},launch={}){
  return Object.freeze({label,jp,copy,trigger,cooldown,duration,color,color2,glyph,visual,performance:Object.freeze(performance),launch:Object.freeze(launch)});
}
const RACER_SIGNATURES=Object.freeze({
  'aruka-sham':racerSignature('PRISM ROYAL','プリズム・ロイヤル','追い抜きとドリフト解放で、加速と全性能が短時間きらめく。','overtake',13.5,3.2,'#7cecff','#ff72db','♕','prism',{speed:1.055,accel:1.12,grip:1.05,drift:1.08,boost:1.1},{turbo:.85}),
  'kurone-night':racerSignature('LUNAR PHASE','月影フェイズ','ロックオンや接触の直前に月影へ溶け、攻撃をすり抜ける。','defense',17,2.25,'#a67bff','#4b2bbd','☾','shadow',{speed:1.07,grip:1.08,ram:1.15},{invincible:1.05,cleanse:true}),
  'kohaku-taiga':racerSignature('TIGER CHARGE','猛虎チャージ','悪路や密集地帯を力強く突破し、接触でも失速しにくい。','offroad',14,3.6,'#ffbd48','#f06422','虎','claw',{accel:1.16,offroad:1.2,ram:1.45},{turbo:.55}),
  'ghost-rex':racerSignature('PHANTOM SHIFT','幻影シフト','被弾や大きな減速から瞬時に復帰し、幻影で短く無敵になる。','recovery',16,2.6,'#b59aff','#694fd1','✦','phantom',{speed:1.06,accel:1.2,grip:1.06},{invincible:.75,cleanse:true,turbo:.65}),
  'nerine-korat':racerSignature('AQUA VEIL','アクアヴェール','雨天で水の膜をまとい、滑りを抑えてラインを守る。','weather',13,3.8,'#5ff4ff','#278fd6','≋','wave',{grip:1.18,accel:1.08,weather:1.35},{shield:2.5}),
  'fumika-scotty':racerSignature('AIRMAIL DRAFT','エアメール・ドラフト','ジャンプ中の姿勢制御と着地加速を高める追い風を起こす。','air',12.5,3.4,'#8dfff0','#2aa59e','➤','wing',{speed:1.05,accel:1.12,air:1.5,boost:1.12},{turbo:.7}),
  'bell-savanna':racerSignature('SAVANNA ROAR','サバンナ・ロア','競り合う相手を咆哮で押し返し、直線の主導権を奪う。','crowd',15,3,'#ffd16a','#bc6b20','♬','roar',{speed:1.09,ram:1.5,accel:1.07},{pulse:.13,turbo:.6}),
  'popo-munch':racerSignature('CLOCKWORK BURST','クロックワーク・バースト','低速になると歯車が噛み合い、鋭い再加速を得る。','recovery',12,3.15,'#ecf36b','#8ca433','⚙','clock',{accel:1.28,grip:1.08,drift:1.06},{cleanse:true,turbo:.5}),
  'marron-maine':racerSignature('EXPRESS MOMENTUM','エクスプレス・モメンタム','高速の直線で蒸気圧を解放し、重い車体の最高速を伸ばす。','straight',15.5,4,'#ffb26a','#7b3c24','◆','steam',{speed:1.12,ram:1.42,boost:1.08},{turbo:.45}),
  'milfi-ragdoll':racerSignature('TEA TIME RECOVERY','ティータイム・リカバリー','被弾やコースアウトを優雅に立て直し、守りと加速を得る。','recovery',14.5,3.4,'#c5ebff','#719edb','♨','tea',{accel:1.2,grip:1.1,offroad:1.14},{shield:2.2,cleanse:true}),
  'yukine-silky':racerSignature('CRYSTAL EDGE','クリスタル・エッジ','雪面とカーブで氷晶のエッジを立て、鋭い旋回を維持する。','corner',13.5,3.65,'#e8fbff','#7dbff4','❄','crystal',{grip:1.24,drift:1.16,weather:1.32},{turbo:.4}),
  'rhythm-sphynx':racerSignature('NEON BEAT','ネオン・ビート','ドリフト解放をビートへ変え、長いミニターボを鳴らす。','drift',11.5,3.25,'#ff68f2','#713cff','♫','note',{speed:1.06,drift:1.25,boost:1.32},{turbo:1.05}),
  'tick-abyssinian':racerSignature('TIME SLIP','タイム・スリップ','攻撃の接近を察知して時をずらし、失速前の勢いを取り戻す。','defense',16,2.4,'#ffd268','#d66e2b','⌛','clock',{accel:1.18,grip:1.1},{invincible:.9,cleanse:true,turbo:.45}),
  'flora-turkishvan':racerSignature('BLOOM TRAIL','ブルーム・トレイル','草地を花道に変え、路外でも速度と操作性を保つ。','offroad',12.5,4.1,'#8dff8a','#36a957','✿','bloom',{speed:1.04,offroad:1.32,grip:1.14},{turbo:.5}),
  'reska-americancurl':racerSignature('RESCUE NINE','レスキュー・ニャイン','下位や被弾時に救助モードへ入り、安全に集団へ復帰する。','backmarker',16,4,'#ff7568','#d53539','✚','rescue',{accel:1.22,offroad:1.2,grip:1.08},{shield:2.8,cleanse:true,turbo:.65}),
  'cleo-mau':racerSignature('SCARAB DRILL','スカラベ・ドリル','悪路を掘り進み、密集したライバルを重いドリルで押し切る。','offroad',14.5,3.7,'#ffe080','#a47b20','◇','scarab',{offroad:1.28,ram:1.55,accel:1.11},{turbo:.55}),
  'ciel-norwegian':racerSignature('TAILWIND FORECAST','テイルウィンド予報','ジャンプと長い直線で追い風を読み、最高速へ滑らかにつなぐ。','air',13,3.8,'#d9f2ff','#659fe6','☁','wind',{speed:1.11,air:1.42,accel:1.08},{turbo:.62}),
  'sucre-persian':racerSignature('OVEN OVERDRIVE','オーブン・オーバードライブ','猫缶やコインの取得で熱を上げ、甘く強い連続加速を焼き上げる。','pickup',12,3.55,'#ffadd5','#e65a9b','♥','flame',{accel:1.2,boost:1.25,speed:1.05},{turbo:.9}),
  'moka-oriental':racerSignature('CREW TRACE','クルー・トレース','前走者のラインを解析し、スリップストリームで追いつく。','chase',12.5,3.7,'#d8b9a8','#79564c','⌕','trace',{speed:1.08,accel:1.16,grip:1.12},{turbo:.55}),
  'garnet-bengal':racerSignature('BENGAL BREAKER','ベンガル・ブレイカー','カーブの競り合いで装甲を活かし、ラインをこじ開ける。','crowd',14.5,3.35,'#ff9a55','#9e3f20','✹','claw',{grip:1.13,ram:1.6,speed:1.07},{turbo:.48}),
  'rinka-somali':racerSignature('CLOUD LINE','クラウド・ライン','天候を読み切り、雨雪でも晴天と同じラインを描く。','weather',12.5,4.2,'#ff8a70','#49c8e4','☀','cloud',{weather:1.45,grip:1.18,boost:1.13},{turbo:.55}),
  'stella-russianblue':racerSignature('AURORA ARC','オーロラ・アーク','先頭争いと雪面でオーロラをまとい、速度と防御を両立する。','leader',15.5,3.55,'#b9d7ff','#795ad9','✧','aurora',{speed:1.1,grip:1.12,weather:1.3},{shield:2}),
  'honey-british':racerSignature('HONEYCOMB GUARD','ハニカム・ガード','攻撃を六角バリアで受け止め、近い相手の加速を鈍らせる。','defense',17.5,3.2,'#ffe36f','#d99324','⬡','hex',{grip:1.12,ram:1.25},{shield:3.2,pulse:.08}),
  'liber-birman':racerSignature('BOOKLINER ILLUSION','ブックライナー幻影','分岐と攻撃の気配で幻のラインを作り、滑らかに抜け出す。','route',14,3.3,'#f2dfc1','#8d65ca','頁','page',{grip:1.2,speed:1.06,drift:1.12},{invincible:.65,turbo:.48}),
  'masuka-chartreux':racerSignature('FRUIT BARRIER','果汁バリア','猫缶・コイン取得で果実の膜を張り、次の競り合いに備える。','pickup',13,3.6,'#d8ff72','#78ad2f','●','fruit',{accel:1.12,grip:1.1,boost:1.1},{shield:2.7,turbo:.45}),
  'soyi-tonkinese':racerSignature('STITCH LINE','ステッチ・ライン','カーブの理想線を縫い、ドリフト蓄積と旋回を高める。','corner',11.5,3.8,'#d4b1ff','#744caf','✂','stitch',{grip:1.25,drift:1.27,boost:1.12},{turbo:.45}),
  'shino-cornish':racerSignature('SHADOW HIDE','影隠れ','ロックオンと被弾の瞬間に影へ隠れ、短い無敵で反撃する。','defense',15.5,2.6,'#a77be8','#25164c','忍','shadow',{speed:1.08,accel:1.13,grip:1.08},{invincible:1,cleanse:true}),
  'aroma-balinese':racerSignature('AROMA FIELD','アロマ・フィールド','香りの輪で近いライバルを惑わせ、自分の操作を安定させる。','crowd',14,3.9,'#e8c9ff','#9d69cf','✾','aroma',{grip:1.2,accel:1.1,drift:1.1},{pulse:.1,turbo:.42}),
  'matsuri-japanese-bobtail':racerSignature('FESTIVAL TENSION','お祭りテンション','取得物と追い上げで観客の熱気を集め、連続加速へ変える。','backmarker',12,3.75,'#ff6554','#ffbd42','祭','festival',{speed:1.07,accel:1.22,boost:1.2},{turbo:.95})
});
racers.forEach((racer,index)=>{racer.signature=RACER_SIGNATURES[racer.slug];racer.signatureIndex=index});
const RACER_SIGNATURE_CUTINS=Object.freeze(Object.fromEntries(
  racers.map(racer=>[racer.slug,`assets/skill-cutins/${racer.slug}.webp`])
));
racers.forEach(racer=>racer.signatureCutin=RACER_SIGNATURE_CUTINS[racer.slug]);
const SIGNATURE_FEEDBACK_FAMILIES=Object.freeze({
  sparkle:{flash:.3,duration:.42,shake:5.5,haptic:[[0,82,.38,.72],[92,105,.62,.42]]},
  impact:{flash:.34,duration:.38,shake:9,haptic:[[0,118,.86,.45],[126,82,.5,.76]]},
  phase:{flash:.25,duration:.5,shake:3.5,haptic:[[0,58,.28,.68],[76,58,.28,.68],[154,92,.54,.34]]},
  guard:{flash:.28,duration:.55,shake:4.5,haptic:[[0,145,.42,.64],[168,115,.66,.38]]},
  flow:{flash:.27,duration:.48,shake:4,haptic:[[0,72,.32,.58],[85,72,.38,.66],[170,86,.5,.44]]},
  recovery:{flash:.29,duration:.58,shake:4.5,haptic:[[0,105,.3,.48],[132,165,.6,.42]]}
});
const SIGNATURE_FEEDBACK_FAMILY_BY_VISUAL=Object.freeze({
  prism:'sparkle',note:'sparkle',crystal:'sparkle',festival:'sparkle',
  claw:'impact',roar:'impact',steam:'impact',scarab:'impact',flame:'impact',
  shadow:'phase',phantom:'phase',clock:'phase',page:'phase',trace:'phase',
  wave:'guard',tea:'guard',rescue:'guard',aurora:'guard',hex:'guard',fruit:'guard',
  wing:'flow',wind:'flow',cloud:'flow',stitch:'flow',
  bloom:'recovery',aroma:'recovery'
});

// Mia is a mid-race boss challenger. She is deliberately kept outside
// racerData so she can never appear in the playable set carousel.
const miaNpc={
  name:'ミア・シャルム',slug:'mia-charme',color:'#ff42a5',portrait:'assets/ui/mia-charme-boss-portrait-gpt2.webp',
  frames:null,throwFrames:null,spritePromise:null,active:false,triggered:false,cutInActive:false,leaderTime:0,
  distance:0,progress:0,lane:0,aiTargetLane:0,aiVelocity:0,hit:0,spin:0,jumpY:0,jumpVelocity:0,airborne:false,landed:false,
  throwCooldown:0,throwAnim:0,throwDuration:0,throwReleaseAt:0,throwKind:null,throwReleased:false
};
const MIA_THROW_TELEGRAPHS=Object.freeze({
  bone:{label:'BONE',color:'#ffe16a',glow:'rgba(255,205,52,.88)',dark:'#6c3d00',audio:'miaBoneTell',frame:8},
  can:{label:'CAN',color:'#68edff',glow:'rgba(45,210,255,.88)',dark:'#063d62',audio:'miaCanTell',frame:9}
});
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
let jungleNearAtlas=null,jungleNearFrames=[],jungleNearPromise=null,jungleGimmickAtlas=null,jungleGimmickFrames=[],jungleGimmickPromise=null;
let courseGimmickAtlas=null,courseGimmickFrames=[],courseGimmickPromise=null;
let tunnelPortalAtlas=null,tunnelPortalFrames=[],tunnelPortalPromise=null;
let tunnelInteriorAtlas=null,tunnelInteriorFrames=[],tunnelInteriorPromise=null;
const COURSE_VFX_TYPES=['rain','steam','bubbles','sakura','snow','fireflies','stardust'];
const courseVfxAtlases=Object.fromEntries(COURSE_VFX_TYPES.map(type=>[type,null])),courseVfxFrames=Object.fromEntries(COURSE_VFX_TYPES.map(type=>[type,[]])),courseVfxPromises={};
const DEDICATED_NEAR_SLUGS={5:'aurora',7:'sakura',8:'coral',9:'phantom',10:'lunatic'};
const dedicatedNearAtlases=Array(courseScenerySlugs.length).fill(null),dedicatedNearFrames=courseScenerySlugs.map(()=>[]),dedicatedNearPromises=Array(courseScenerySlugs.length).fill(null);
// Row three of every course scenery atlas contains small, groundable props.
// These profiles keep the split median unmistakably themed without adding a
// second atlas or another request during a race.
const ROUTE_MEDIAN_PROFILES=[
  {id:'sweets',label:'SWEET',frame:10,secondary:11},
  {id:'steam',label:'GEAR',frame:9,secondary:10},
  {id:'neon',label:'NEON',frame:8,secondary:11},
  {id:'rain',label:'AQUA',frame:11,secondary:9},
  {id:'royal',label:'CROWN',frame:10,secondary:11},
  {id:'aurora',label:'CRYSTAL',frame:9,secondary:11},
  {id:'jungle',label:'RUINS',frame:10,secondary:11},
  {id:'sakura',label:'SAKURA',frame:10,secondary:9},
  {id:'coral',label:'CORAL',frame:10,secondary:11},
  {id:'phantom',label:'GHOST',frame:10,secondary:8},
  {id:'lunatic',label:'ORBIT',frame:9,secondary:10}
];
const ROUTE_OCCLUSION_PROFILES=[
  {id:'sweets',label:'CANDY HEDGE',frames:[10,11,8,9],spacing:27,fill:.72,base:760},
  {id:'steam',label:'GEARWORK WALL',frames:[9,10,8,11],spacing:26,fill:.74,base:790},
  {id:'neon',label:'NEON BARRIER',frames:[8,11,9,10],spacing:28,fill:.7,base:800},
  {id:'rain',label:'FOREST BANK',frames:[11,9,8,10],spacing:25,fill:.74,base:770},
  {id:'royal',label:'ROYAL GARDEN',frames:[10,11,8,9],spacing:27,fill:.72,base:790},
  {id:'aurora',label:'CRYSTAL RIDGE',frames:[9,11,10,8],spacing:28,fill:.72,base:820},
  {id:'jungle',label:'DENSE JUNGLE',frames:[0,8,3,9,0,8],spacing:23,fill:.9,base:920,jungle:true},
  {id:'sakura',label:'SAKURA GROVE',frames:[10,9,8,11],spacing:25,fill:.74,base:800},
  {id:'coral',label:'CORAL REEF',frames:[10,11,9,8],spacing:26,fill:.76,base:820},
  {id:'phantom',label:'GHOST PARADE',frames:[10,8,11,9],spacing:27,fill:.72,base:830},
  {id:'lunatic',label:'ORBITAL DIVIDE',frames:[9,10,11,8],spacing:28,fill:.72,base:850}
];
// Every public course already owns a GPT Image 2.0 scenery sheet. These
// profiles promote the middle/small rows into grounded near-field landmarks
// instead of leaving courses 6-11 with distant scenery only.
const COURSE_NEAR_PROFILES=[
  {frames:[4,5,8,9,10,11],spacing:132,offset:2.62,scale:.9},
  {frames:[4,6,7,8,9,11],spacing:124,offset:2.58,scale:.94},
  {frames:[4,5,6,8,9,11],spacing:118,offset:2.6,scale:.93},
  {frames:[4,5,7,8,10,11],spacing:122,offset:2.56,scale:.9},
  {frames:[4,5,6,8,9,10],spacing:126,offset:2.62,scale:.94},
  {frames:[4,5,6,7,8,9,10,11],spacing:82,offset:2.55,scale:1.02},
  {frames:[4,5,6,8,10,11],spacing:136,offset:2.62,scale:.86},
  {frames:[4,5,6,7,8,9,10,11],spacing:80,offset:2.55,scale:1.02},
  {frames:[4,5,6,7,8,9,10,11],spacing:76,offset:2.58,scale:1.04},
  {frames:[4,5,6,7,8,9,10,11],spacing:84,offset:2.58,scale:1},
  {frames:[4,5,6,7,8,9,10,11],spacing:78,offset:2.57,scale:1.03}
];
const JUNGLE_BIOME_ZONES=[
  {id:'waterfall-basin',start:0,end:260,spacing:76,canopy:.48,far:[0,3],mid:[4,8,11],near:[8,9,10],fog:'#b8f2cf'},
  {id:'temple-vault',start:260,end:470,spacing:70,canopy:.68,far:[2,5],mid:[5,6,10],near:[9,10,11],fog:'#9de3b4'},
  {id:'canopy-bridge',start:470,end:620,spacing:82,canopy:.82,far:[0,1],mid:[3,8,9],near:[8,9,11],fog:'#c9f7ca'},
  {id:'split-ruins',start:620,end:840,spacing:64,canopy:.72,far:[0,5],mid:[4,6,10],near:[8,10,11],fog:'#8ee8ad'},
  {id:'root-marsh',start:840,end:1040,spacing:58,canopy:.9,far:[0,3],mid:[3,8,9],near:[8,9,11],fog:'#96d9a3'},
  {id:'statue-corridor',start:1040,end:1220,spacing:72,canopy:.76,far:[2,5],mid:[4,5,10],near:[9,10,11],fog:'#a5e4b6'},
  {id:'gorge-bridge',start:1220,end:1435,spacing:84,canopy:.5,far:[0,1],mid:[3,6,8],near:[8,9,11],fog:'#c5f1d5'},
  {id:'ancient-plaza',start:1435,end:1800,spacing:78,canopy:.56,far:[2,5],mid:[4,6,10],near:[9,10,11],fog:'#b8edc5'}
];
function biomeHash(seed){const value=Math.sin(seed*12.9898+78.233)*43758.5453;return value-Math.floor(value)}
const JUNGLE_BIOME_CLUSTERS=JUNGLE_BIOME_ZONES.flatMap((zone,zoneIndex)=>{const clusters=[];for(let anchor=zone.start+24,slot=0;anchor<zone.end-18;anchor+=zone.spacing,slot++){const seed=zoneIndex*997+slot*37,side=biomeHash(seed)>.5?1:-1,prop=(layer,index,frames,offset,scale,zOffset)=>({layer,frame:frames[Math.floor(biomeHash(seed+index*11)*frames.length)%frames.length],side:index%2?side:-side,offset:offset+biomeHash(seed+index*17)*.28,scale:scale*(.86+biomeHash(seed+index*23)*.3),zOffset:zOffset+(biomeHash(seed+index*31)-.5)*10});clusters.push({zone:zone.id,zoneIndex,anchor,props:[prop('far',0,zone.far,3.08,1.12,8),prop('mid',1,zone.mid,2.58,1,0),prop('mid',2,zone.mid,2.42,.82,-7),prop('mid',3,zone.mid,2.72,.72,7),prop('near',4,zone.near,2.24,.82,-3),prop('near',5,zone.near,2.36,.68,5)]})}return clusters});
const BIOME_VOLUME_PROFILES=[
  {id:'sweets',seed:1103,spacing:88,zoneNames:['candy-village','cream-gardens','lollipop-woods','grand-bakery'],canopy:[.28,.42,.55,.34],fog:['#ffe4f2','#fff0cf','#f6c7ff','#ffd9ea'],shade:'#4b183f'},
  {id:'steam',seed:2207,spacing:82,zoneNames:['boiler-quarter','gearworks','smoke-foundry','clock-plaza'],canopy:[.48,.62,.72,.44],fog:['#d7b08a','#c89568','#aa8d78','#f1cc91'],shade:'#2d211b'},
  {id:'neon',seed:3313,spacing:78,zoneNames:['holo-district','skyrail-canyon','laser-avenue','tower-core'],canopy:[.3,.44,.58,.36],fog:['#3eeaff','#8f66ff','#ff4fd8','#5df6ff'],shade:'#090d35'},
  {id:'rain',seed:4409,spacing:76,zoneNames:['mist-forest','umbrella-grove','riverbank','storm-garden'],canopy:[.68,.78,.56,.84],fog:['#bfe7ff','#a8d8ee','#d4f2ff','#90b9d4'],shade:'#112c3d'},
  {id:'royal',seed:5519,spacing:90,zoneNames:['rose-gardens','crown-village','palace-wall','cake-court'],canopy:[.34,.46,.58,.4],fog:['#ffe1c7','#ffd3ec','#fff0bd','#ffcfe5'],shade:'#4b2342'},
  {id:'aurora',seed:6619,spacing:84,zoneNames:['ice-cavern','crystal-ridge','snowfield','aurora-gate'],canopy:[.62,.48,.3,.58],fog:['#c8f5ff','#a8dfff','#e8fbff','#c8b8ff'],shade:'#17364f'},
  {id:'jungle',seed:7727,spacing:68,zoneNames:JUNGLE_BIOME_ZONES.map(zone=>zone.id),canopy:JUNGLE_BIOME_ZONES.map(zone=>zone.canopy),fog:JUNGLE_BIOME_ZONES.map(zone=>zone.fog),shade:'#061a0f'},
  {id:'sakura',seed:8803,spacing:78,zoneNames:['lantern-lane','bamboo-grove','hot-spring','blossom-hill'],canopy:[.5,.72,.44,.82],fog:['#ffdce9','#d6efcf','#fff0e1','#ffc4df'],shade:'#412333'},
  {id:'coral',seed:9907,spacing:76,zoneNames:['reef-garden','shell-village','pearl-palace','bubble-trench'],canopy:[.54,.42,.64,.7],fog:['#baf7ff','#97e9f8','#d8ffff','#7fd7ea'],shade:'#123b54'},
  {id:'phantom',seed:10111,spacing:82,zoneNames:['haunted-midway','ghost-woods','moon-circus','parade-gate'],canopy:[.6,.78,.5,.68],fog:['#bea6e8','#786b9d','#d6a7ff','#9e72c6'],shade:'#21122e'},
  {id:'lunatic',seed:11117,spacing:92,zoneNames:['moonbase','satellite-field','crater-lab','orbital-port'],canopy:[.22,.38,.3,.46],fog:['#a6c4ff','#7defff','#b99cff','#d1ddff'],shade:'#080f2c'}
];
const BIOME_ZONE_LABELS=[
  ['キャンディ・ビレッジ','クリーム・ガーデン','ロリポップ・ウッズ','グランド・ベーカリー'],
  ['ボイラー街区','ギアワークス','スモーク鋳造所','クロック・プラザ'],
  ['ホロ・ディストリクト','スカイレール峡谷','レーザー・アベニュー','タワー・コア'],
  ['霧の森','アンブレラ・グローブ','リバーバンク','ストーム・ガーデン'],
  ['ローズ・ガーデン','クラウン・ビレッジ','パレス・ウォール','ケーキ・コート'],
  ['アイス・ケイブ','クリスタル・リッジ','スノーフィールド','オーロラ・ゲート'],
  ['滝つぼ盆地','神殿ヴォールト','樹冠ブリッジ','分岐遺跡','根の湿地','石像回廊','峡谷ブリッジ','古代広場'],
  ['ランタン小路','竹林回廊','湯けむり温泉','桜花ヒル'],
  ['リーフ・ガーデン','シェル・ビレッジ','パール・パレス','バブル・トレンチ'],
  ['ホーンテッド・ミッドウェイ','ゴースト・ウッズ','ムーン・サーカス','パレード・ゲート'],
  ['ムーンベース','サテライト・フィールド','クレーター・ラボ','オービタル・ポート']
];
function biomeZoneIndex(zone,index=state.selectedCourse){return Math.max(0,biomeVolumeZones(index).findIndex(entry=>entry.id===zone?.id))}
function biomeZoneDisplayName(zone,index=state.selectedCourse){return BIOME_ZONE_LABELS[index]?.[biomeZoneIndex(zone,index)]||String(zone?.id||'LANDMARK').replaceAll('-',' ').toUpperCase()}
function showBiomeZoneCallout(zone){
  const panel=$('zoneEntryCallout');if(!panel||!zone)return;const zoneIndex=biomeZoneIndex(zone),name=biomeZoneDisplayName(zone);$('zoneEntryName').textContent=name;$('zoneEntryCourse').textContent=activeCourse?.short||courseScenerySlugs[state.selectedCourse]?.toUpperCase()||'NYAN CIRCUIT';$('zoneEntryNumber').textContent=String(zoneIndex+1).padStart(2,'0');panel.style.setProperty('--zone-color',zone.fog||'#65efff');panel.className='zone-entry-callout';panel.setAttribute('aria-hidden','false');void panel.offsetWidth;panel.classList.add('show');clearTimeout(showBiomeZoneCallout.timer);showBiomeZoneCallout.timer=setTimeout(()=>{panel.classList.remove('show');panel.setAttribute('aria-hidden','true')},1850);playSfx('uiMove',{intensity:.42,variant:zoneIndex%2});canvas.dataset.biomeZoneCalloutModel='compact-landmark-broadcast-v1';canvas.dataset.biomeZoneCalloutName=name;canvas.dataset.biomeZoneCalloutZone=zone.id;canvas.dataset.biomeZoneCalloutCount=String(Number(canvas.dataset.biomeZoneCalloutCount||0)+1)
}
const BIOME_VOLUME_CLUSTER_CACHE=new Map();
function biomeVolumeZones(index=state.selectedCourse,length=raceLength()){
  const profile=BIOME_VOLUME_PROFILES[index]||BIOME_VOLUME_PROFILES[0];
  if(index===6){const scale=length/1800;return JUNGLE_BIOME_ZONES.map(zone=>({...zone,start:zone.start*scale,end:zone.end*scale,spacing:zone.spacing*Math.max(.82,scale)}))}
  const count=profile.zoneNames.length;return profile.zoneNames.map((id,zoneIndex)=>{const start=length*zoneIndex/count,end=length*(zoneIndex+1)/count,shift=zoneIndex%4;return{id,start,end,spacing:profile.spacing*(zoneIndex%2?.92:1.08),canopy:profile.canopy[zoneIndex],fog:profile.fog[zoneIndex],far:[shift,(shift+1)%4],mid:[4+shift,4+(shift+2)%4,8+(shift+1)%4],near:[8+shift,8+(shift+2)%4,4+(shift+1)%4]}})
}
function biomeVolumeClusters(index=state.selectedCourse,length=raceLength()){
  const key=`${index}:${Math.round(length)}`;if(BIOME_VOLUME_CLUSTER_CACHE.has(key))return BIOME_VOLUME_CLUSTER_CACHE.get(key);
  if(index===6&&Math.abs(length-1800)<1){BIOME_VOLUME_CLUSTER_CACHE.set(key,JUNGLE_BIOME_CLUSTERS);return JUNGLE_BIOME_CLUSTERS}
  const profile=BIOME_VOLUME_PROFILES[index]||BIOME_VOLUME_PROFILES[0],zones=biomeVolumeZones(index,length),clusters=zones.flatMap((zone,zoneIndex)=>{const result=[];for(let anchor=zone.start+22,slot=0;anchor<zone.end-16;anchor+=zone.spacing,slot++){const seed=profile.seed+zoneIndex*997+slot*37,side=biomeHash(seed)>.5?1:-1,prop=(layer,propIndex,frames,offset,scale,zOffset)=>({layer,frame:frames[Math.floor(biomeHash(seed+propIndex*11)*frames.length)%frames.length],side:propIndex%2?side:-side,offset:offset+biomeHash(seed+propIndex*17)*.3,scale:scale*(.84+biomeHash(seed+propIndex*23)*.34),zOffset:zOffset+(biomeHash(seed+propIndex*31)-.5)*11});result.push({zone:zone.id,zoneIndex,anchor,props:[prop('far',0,zone.far,3.1,1.08,8),prop('mid',1,zone.mid,2.68,.96,0),prop('mid',2,zone.mid,2.5,.76,-7),prop('near',3,zone.near,2.38,.78,-3),prop('near',4,zone.near,2.52,.64,6)]})}return result});
  BIOME_VOLUME_CLUSTER_CACHE.set(key,clusters);return clusters
}
function biomeVolumeFrames(index=state.selectedCourse,layer='mid'){
  if(index===6&&jungleNearFrames.length)return jungleNearFrames;
  if(layer!=='far'&&dedicatedNearFrames[index]?.length)return dedicatedNearFrames[index];
  return courseSceneryFrames[index]||[]
}
function biomeVolumeZoneAt(distance=state.distance,index=state.selectedCourse){const length=raceLength(),phase=((distance%length)+length)%length,zones=biomeVolumeZones(index,length);return zones.find(zone=>phase>=zone.start&&phase<zone.end)||zones[0]}
function jungleBiomeZoneAt(distance=state.distance){return biomeVolumeZoneAt(distance,6)}
const biomeZoneTransition={course:-1,key:'none',zone:'none',previousZone:'none',fromColor:'#ffffff',toColor:'#ffffff',age:1.45,duration:1.45,serial:0};
function resetBiomeZoneTransition(){
  const zone=biomeVolumeZoneAt(),key=`${state.selectedCourse}:${zone.id}`;Object.assign(biomeZoneTransition,{course:state.selectedCourse,key,zone:zone.id,previousZone:zone.id,fromColor:zone.fog,toColor:zone.fog,age:biomeZoneTransition.duration})
}
function updateBiomeZoneTransition(dt=0){
  const zone=biomeVolumeZoneAt(),key=`${state.selectedCourse}:${zone.id}`;if(key!==biomeZoneTransition.key){const sameCourse=biomeZoneTransition.course===state.selectedCourse,fromColor=sameCourse?biomeZoneTransition.toColor:zone.fog,previousZone=sameCourse?biomeZoneTransition.zone:zone.id;Object.assign(biomeZoneTransition,{course:state.selectedCourse,key,zone:zone.id,previousZone,fromColor,toColor:zone.fog,age:0,serial:biomeZoneTransition.serial+(sameCourse?1:0)});if(sameCourse&&state.mode==='race'&&state.running&&!state.paused&&!state.countdownActive)showBiomeZoneCallout(zone)}else biomeZoneTransition.age=Math.min(biomeZoneTransition.duration,biomeZoneTransition.age+Math.max(0,dt));
  const mix=clamp(biomeZoneTransition.age/biomeZoneTransition.duration,0,1);canvas.dataset.biomeZoneTransitionModel='landmark-audio-light-sync-v1';canvas.dataset.biomeZoneTransitionFrom=biomeZoneTransition.previousZone;canvas.dataset.biomeZoneTransitionTo=biomeZoneTransition.zone;canvas.dataset.biomeZoneTransitionMix=mix.toFixed(3);canvas.dataset.biomeZoneTransitionSerial=String(biomeZoneTransition.serial);return{zone,mix}
}
// Far and middle scenery are intentionally not distributed uniformly. Each
// course gets a recognisable skyline rhythm while adaptive quality only
// changes the amount, never the theme.
const COURSE_DEPTH_PROFILES=[
  {id:'sweets',far:{density:1.12,scale:1.08,alpha:1.04},mid:{density:1.02,scale:1.0,alpha:1.0},near:{density:.9,scale:.96,alpha:1},fogStart:210,fogSpan:540,fog:'#ffe0f2',fogAlpha:.2},
  {id:'steam',far:{density:1.35,scale:1.12,alpha:.9},mid:{density:1.28,scale:1.05,alpha:1},near:{density:.82,scale:1.0,alpha:.94},fogStart:165,fogSpan:470,fog:'#d8b38d',fogAlpha:.25},
  {id:'neon',far:{density:1.58,scale:1.15,alpha:1.08},mid:{density:1.24,scale:1.05,alpha:1.08},near:{density:.74,scale:1.02,alpha:1},fogStart:235,fogSpan:590,fog:'#4ce8ff',fogAlpha:.15},
  {id:'rain',far:{density:1.06,scale:1.02,alpha:.82},mid:{density:1.24,scale:1.0,alpha:.9},near:{density:.88,scale:.98,alpha:.92},fogStart:130,fogSpan:410,fog:'#c8e7ff',fogAlpha:.3},
  {id:'royal',far:{density:.76,scale:1.26,alpha:1.02},mid:{density:.86,scale:1.2,alpha:1.04},near:{density:.78,scale:1.08,alpha:1},fogStart:230,fogSpan:570,fog:'#ffe5af',fogAlpha:.18},
  {id:'aurora',far:{density:.94,scale:1.18,alpha:.86},mid:{density:1.38,scale:1.08,alpha:1.08},near:{density:.9,scale:1.06,alpha:1},fogStart:170,fogSpan:490,fog:'#d7f8ff',fogAlpha:.26},
  {id:'jungle',far:{density:1.52,scale:1.18,alpha:.82},mid:{density:1.62,scale:1.1,alpha:.94},near:{density:1.32,scale:1.06,alpha:1},fogStart:120,fogSpan:390,fog:'#86bd92',fogAlpha:.31},
  {id:'sakura',far:{density:.92,scale:1.25,alpha:.86},mid:{density:1.42,scale:1.06,alpha:1.04},near:{density:1.08,scale:1.02,alpha:1},fogStart:185,fogSpan:510,fog:'#ffe2ed',fogAlpha:.22},
  {id:'coral',far:{density:1.18,scale:1.12,alpha:.88},mid:{density:1.42,scale:1.1,alpha:1.06},near:{density:1.14,scale:1.04,alpha:1},fogStart:160,fogSpan:475,fog:'#c8f8ff',fogAlpha:.26},
  {id:'phantom',far:{density:1.16,scale:1.15,alpha:.78},mid:{density:1.04,scale:1.12,alpha:.96},near:{density:.76,scale:1.05,alpha:.94},fogStart:145,fogSpan:455,fog:'#b9a3d9',fogAlpha:.29},
  {id:'lunatic',far:{density:.86,scale:1.34,alpha:.92},mid:{density:1.2,scale:1.12,alpha:1.04},near:{density:.78,scale:1.05,alpha:1},fogStart:245,fogSpan:610,fog:'#9ebeff',fogAlpha:.14}
];
const TUNNEL_INTERIOR_PROFILES=[
  {id:'sweets',side:'#5a284b',side2:'#431f43',roof:'#2a1637',trim:'#fff0c8',lamp:'#ff77bd',lamp2:'#75e9ff',pattern:'sprinkles',panelEvery:3},
  {id:'steam',side:'#49352b',side2:'#30251f',roof:'#211b18',trim:'#d9a85f',lamp:'#ffc66f',lamp2:'#88e7e2',pattern:'rivets',panelEvery:3},
  {id:'neon',side:'#191744',side2:'#11102e',roof:'#090b21',trim:'#39eaff',lamp:'#ff35d3',lamp2:'#31f7ff',pattern:'circuit',panelEvery:2},
  {id:'rain',side:'#1d4057',side2:'#163245',roof:'#102335',trim:'#b8eaff',lamp:'#75cfff',lamp2:'#e4fbff',pattern:'rain',panelEvery:3},
  {id:'royal',side:'#4e2948',side2:'#351d3b',roof:'#25152f',trim:'#ffd36c',lamp:'#ffefac',lamp2:'#92ddff',pattern:'royal',panelEvery:2},
  {id:'aurora',side:'#24465c',side2:'#193649',roof:'#10283b',trim:'#c7fbff',lamp:'#8ff6ff',lamp2:'#b68cff',pattern:'facets',panelEvery:3},
  {id:'jungle',side:'#27371d',side2:'#172719',roof:'#0e1b11',trim:'#79b657',lamp:'#5affae',lamp2:'#ffd26b',pattern:'vines',panelEvery:4},
  {id:'sakura',side:'#55333e',side2:'#3c2734',roof:'#271c2c',trim:'#ffd3df',lamp:'#ff9ebd',lamp2:'#ffe6a6',pattern:'petals',panelEvery:3},
  {id:'coral',side:'#23516a',side2:'#173a52',roof:'#10283e',trim:'#ffb99e',lamp:'#8af8ff',lamp2:'#ffe7a5',pattern:'bubbles',panelEvery:3},
  {id:'phantom',side:'#342143',side2:'#21162f',roof:'#150e24',trim:'#d2a0ff',lamp:'#ae6cff',lamp2:'#ffca61',pattern:'marquee',panelEvery:2},
  {id:'lunatic',side:'#202941',side2:'#151c31',roof:'#0b1023',trim:'#91b7ff',lamp:'#70eaff',lamp2:'#b79cff',pattern:'orbit',panelEvery:3}
];
// Each course has a distinct ambience rhythm. Assets are shared only where
// the motion, tint and density make the result visually different.
const COURSE_AMBIENCE_PROFILES=[
  {id:'sweets',effects:[{type:'stardust',motion:'float',count:7,size:92,alpha:.58,speed:.0048,drift:34,filter:'hue-rotate(-18deg) saturate(1.18) brightness(1.12)'}]},
  {id:'steam',effects:[{type:'steam',motion:'rise',count:9,size:184,alpha:.72,speed:.0042,offset:2.18,rise:112,parallax:.24}]},
  {id:'neon',effects:[{type:'rain',motion:'fall',count:7,size:116,alpha:.34,speed:.0086,drift:-54,filter:'hue-rotate(38deg) saturate(1.25)'},{type:'stardust',motion:'float',count:3,size:72,alpha:.28,speed:.006,drift:48,filter:'hue-rotate(72deg) saturate(1.45)'}]},
  {id:'rain',effects:[{type:'rain',motion:'fall',count:12,size:126,alpha:.46,speed:.0092,drift:-68}]},
  {id:'royal',effects:[{type:'stardust',motion:'float',count:5,size:88,alpha:.43,speed:.0038,drift:20,filter:'hue-rotate(-35deg) saturate(1.02) brightness(1.1)'}]},
  {id:'aurora',effects:[{type:'snow',motion:'fall',count:10,size:104,alpha:.5,speed:.0044,drift:28}]},
  {id:'jungle',effects:[{type:'fireflies',motion:'float',count:9,size:88,alpha:.7,speed:.0034,drift:24,filter:'hue-rotate(10deg) saturate(1.45) brightness(1.25)'}]},
  {id:'sakura',effects:[{type:'sakura',motion:'fall',count:9,size:104,alpha:.48,speed:.0052,drift:74}]},
  {id:'coral',effects:[{type:'bubbles',motion:'rise',count:10,size:166,alpha:.68,speed:.0048,offset:2.08,rise:134,parallax:.2}]},
  {id:'phantom',effects:[{type:'fireflies',motion:'float',count:5,size:72,alpha:.38,speed:.0048,drift:-36,filter:'hue-rotate(235deg) saturate(1.35)'},{type:'stardust',motion:'float',count:4,size:78,alpha:.3,speed:.0056,drift:42,filter:'hue-rotate(105deg) saturate(1.25)'}]},
  {id:'lunatic',effects:[{type:'stardust',motion:'float',count:8,size:102,alpha:.6,speed:.0042,drift:-18,filter:'hue-rotate(68deg) saturate(1.4) brightness(1.18)'}]}
];
function courseHasAmbience(type){return!!(COURSE_AMBIENCE_PROFILES[state.selectedCourse]?.effects||[]).some(effect=>effect.type===type)}
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
let itemFrames=[],catCanFrames=[],drivingFxFrames=[],itemFxFrames=[],weatherDrivingFxFrames=[];
let itemSheet=null,catCanSheet=null,drivingFxAnimationSheet=null,itemFxAnimationSheet=null,weatherDrivingFxSheet=null,itemFxAssetPromise=null;
const defaultRaceMusicFiles=['assets/audio/n(ya)itro_cat_grand_prix.mp3','assets/audio/drigt_swing_nya.mp3'];
const defaultRaceMusicTitles=Object.freeze({'assets/audio/n(ya)itro_cat_grand_prix.mp3':'N(YA)ITRO CAT GRAND PRIX','assets/audio/drigt_swing_nya.mp3':'DRIFT SWING NYA'});
const courseRaceMusicFiles=Object.freeze({sweets:'assets/audio/CARAMEL_OVERDRIVE.mp3',steam:'assets/audio/clockwork_claw.mp3',neon:'assets/audio/over_clock_nyaight_city.mp3',rain:'assets/audio/rainbow_prism_overdrive.mp3',royal:'assets/audio/crown_sugar_overdrive.mp3',aurora:'assets/audio/aurora_prism_break.mp3',jungle:'assets/audio/EMERALD_CLAW.mp3',sakura:'assets/audio/yukemuri_overdrive.mp3',coral:'assets/audio/ABYSSAL_PEARL_OVERDRIVE.mp3',phantom:'assets/audio/phantom_gear_parade.mp3',lunatic:'assets/audio/lunar_gravity_break.mp3'});
const courseRaceMusicTitles=Object.freeze({sweets:'CARAMEL OVERDRIVE',steam:'CLOCKWORK CLAW ― 秒針を噛み砕け',neon:'OVER_CLOCK NYAIGHT CITY',rain:'虹雨プリズム・オーバードライブ',royal:'CROWN SUGAR OVERDRIVE',aurora:'オーロラ・プリズムブレイク',jungle:'EMERALD_CLAW',sakura:'湯煙オーバードライブ',coral:'ABYSSAL PEARL OVERDRIVE',phantom:'PHANTOM GEAR PARADE',lunatic:'LUNAR GRAVITY BREAK'});
const unassignedCourseRaceMusic=Object.freeze(courseScenerySlugs.filter(slug=>!courseRaceMusicFiles[slug]));
const raceMusicFiles=[...new Set([...defaultRaceMusicFiles,...Object.values(courseRaceMusicFiles)])];
window.NyanDelivery?.setFullAssetSources?.(raceMusicFiles);
const raceMusic=raceMusicFiles.map(src=>{const audio=new Audio();audio.preload='none';audio.loop=true;audio.dataset.source=src;return audio});
const raceMusicByFile=new Map(raceMusicFiles.map((src,index)=>[src,raceMusic[index]]));
let raceBgm=null,raceMusicIndex=0,musicError='';
const coursePreviewAudio=new Audio();
coursePreviewAudio.preload='metadata';
let coursePreviewCourse=-1,coursePreviewTimer=0;
function courseMusicInfo(index=state.selectedCourse){const slug=courseScenerySlugs[index]||'sweets',source=courseRaceMusicFiles[slug]||defaultRaceMusicFiles[index%defaultRaceMusicFiles.length];return{slug,source,title:courseRaceMusicTitles[slug]||defaultRaceMusicTitles[source]||source.split('/').pop().replace(/\.[^.]+$/,'')}}
function updateCourseMusicPreviewUI(index=state.selectedCourse){
  const button=$('courseMusicPreview');if(!button)return;const info=courseMusicInfo(index),playing=coursePreviewCourse===index&&!coursePreviewAudio.paused;button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-label',`${info.title}を${playing?'停止':'試聴'}`);button.classList.toggle('playing',playing);button.querySelector('.course-music-preview-icon').textContent=playing?'Ⅱ':'▶';$('courseMusicTitle').textContent=info.title;$('courseMusicState').textContent=playing?'NOW PLAYING':'PREVIEW';const screen=$('courseSelect');screen.dataset.musicPreviewModel='course-select-preview-v1';screen.dataset.musicPreviewTrack=info.source.split('/').pop();screen.dataset.musicPreviewTitle=info.title;screen.dataset.musicPreviewState=playing?'playing':'ready';screen.dataset.musicDedicatedCount=String(courseScenerySlugs.length-unassignedCourseRaceMusic.length);screen.dataset.musicUnassigned=unassignedCourseRaceMusic.join(',')
}
function stopCourseMusicPreview(reset=true){
  clearTimeout(coursePreviewTimer);coursePreviewTimer=0;coursePreviewAudio.pause();if(reset){try{coursePreviewAudio.currentTime=0}catch{}}coursePreviewCourse=-1;updateCourseMusicPreviewUI()
}
function toggleCourseMusicPreview(){
  const index=state.selectedCourse,info=courseMusicInfo(index);if(coursePreviewCourse===index&&!coursePreviewAudio.paused){stopCourseMusicPreview();playSfx('uiBack',{intensity:.35});return}stopCourseMusicPreview();coursePreviewCourse=index;observeDeliveryAsset(info.source,'selected-course');coursePreviewAudio.src=info.source;coursePreviewAudio.volume=settings.muted?0:(settings.masterVolume/100)*(settings.musicVolume/100);coursePreviewAudio.currentTime=0;const playing=coursePreviewAudio.play();updateCourseMusicPreviewUI(index);playSfx('uiConfirm',{intensity:.45});playing?.then(()=>{if(coursePreviewCourse!==index)return;updateCourseMusicPreviewUI(index);coursePreviewTimer=setTimeout(()=>stopCourseMusicPreview(),25000)}).catch(error=>{coursePreviewCourse=-1;updateCourseMusicPreviewUI(index);$('courseMusicState').textContent=error?.name==='NotAllowedError'?'TAP TO PLAY':'LOAD ERROR'})
}

const DIFFICULTY_PROFILES={
  easy:{label:'EASY',jp:'イージー',kicker:'RELAXED RACE',badge:'BEGINNER',dock:'気軽に走れる入門グランプリ',summary:'NPCの速度と追走力を抑え、コースやドリフト操作を覚えやすくした難易度です。',differences:['NPCは最高速と加速が控えめ。ミスをしても追いつきやすい','順位補正が弱く、一度リードすると安定して逃げやすい','ミアの投擲は予備動作0.88秒・間隔11〜15秒で、落ち着いて避けられる'],aiSpeed:.96,rubberGain:.1,rubberLimit:18,aiAccel:.9,aiBoost:.88,miaBase:166,miaOffset:-4,miaTargetGap:-3,miaCatchup:.65,miaCatchLimit:14,miaHitFactor:.48,miaSpawnGap:14,miaThrowDuration:1.3,miaThrowRelease:.88,miaThrowInitialMin:7.8,miaThrowInitialMax:10.5,miaThrowCooldownMin:11,miaThrowCooldownMax:15,miaThrowGapMin:48,miaThrowGapMax:176},
  normal:{label:'NORMAL',jp:'ノーマル',kicker:'GRAND PRIX',badge:'RECOMMENDED',dock:'競り合いながら勝利を狙えるグランプリ',summary:'NPCはプレイヤーより少し控えめ。ミスを立て直しながら勝利を狙える標準難易度です。',differences:['NPCの最高速を99%に抑え、丁寧に走れば前へ出られる','追走補正を18km/hまでに抑え、理不尽な追い上げを軽減','ミアの投擲は予備動作0.72秒・間隔8.5〜12秒。見てから避けられる'],aiSpeed:.99,rubberGain:.11,rubberLimit:18,aiAccel:.96,aiBoost:.94,miaBase:174,miaOffset:0,miaTargetGap:0,miaCatchup:.8,miaCatchLimit:20,miaHitFactor:.5,miaSpawnGap:22,miaThrowDuration:1.14,miaThrowRelease:.72,miaThrowInitialMin:6.4,miaThrowInitialMax:8.6,miaThrowCooldownMin:8.5,miaThrowCooldownMax:12,miaThrowGapMin:44,miaThrowGapMax:190},
  hard:{label:'HARD',jp:'ハード',kicker:'BOSS CHALLENGE',badge:'EXPERT',dock:'最速NPCとミアに挑むボスレース',summary:'NPCが最速ラインを維持し、ミアも本気で勝利を奪いに来る上級者向け難易度です。',differences:['NPCの最高速は基準の114%。加速と猫缶ギア判断も強化','最大40km/hの強い追走補正で、終盤まで順位が入れ替わる','ミアの投擲は予備動作0.42秒・間隔3.2〜5.2秒。連続回避が勝負になる'],aiSpeed:1.14,rubberGain:.23,rubberLimit:40,aiAccel:1.22,aiBoost:1.2,miaBase:202,miaOffset:26,miaTargetGap:18,miaCatchup:2.35,miaCatchLimit:64,miaHitFactor:.74,miaSpawnGap:38,miaThrowDuration:.78,miaThrowRelease:.42,miaThrowInitialMin:2.8,miaThrowInitialMax:4,miaThrowCooldownMin:3.2,miaThrowCooldownMax:5.2,miaThrowGapMin:28,miaThrowGapMax:220}
};
const DEFAULT_SETTINGS={masterVolume:80,musicVolume:55,effectsVolume:72,muted:false,richScenery:true,performancePreset:'auto',deliveryProfile:'auto',reducedEffects:false,preloadCourseAssets:true,controllerVibration:true,cameraMotion:1,screenShake:1,speedLines:1,screenFlash:1,raceDifficulty:'normal',bindings:{accelerate:'ArrowUp',brake:'ArrowDown',left:'ArrowLeft',right:'ArrowRight',drift:'ShiftLeft',item:'Space',pause:'Escape'}};
const ACTION_LABELS={accelerate:'アクセル',brake:'ブレーキ',left:'左へ曲がる',right:'右へ曲がる',drift:'ドリフト',item:'猫缶ギア',pause:'ポーズ'};
const KEY_LABELS={ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→',ShiftLeft:'左 SHIFT',ShiftRight:'右 SHIFT',Space:'SPACE',Escape:'ESC',Enter:'ENTER',Backspace:'BACKSPACE'};
function loadSettings(){try{const saved=JSON.parse(localStorage.getItem('nyan-cart-settings')||'{}');return{...DEFAULT_SETTINGS,...saved,bindings:{...DEFAULT_SETTINGS.bindings,...(saved.bindings||{})}}}catch{return{...DEFAULT_SETTINGS,bindings:{...DEFAULT_SETTINGS.bindings}}}}
let settings=loadSettings(),captureAction=null,settingsReturnMode='menu',settingsReturnPaused=false;
function saveSettings(){try{localStorage.setItem('nyan-cart-settings',JSON.stringify(settings))}catch{}}
function keyLabel(code){if(KEY_LABELS[code])return KEY_LABELS[code];if(code.startsWith('Key'))return code.slice(3);if(code.startsWith('Digit'))return code.slice(5);return code.replace(/(Left|Right)$/,' $1').toUpperCase()}
function applyAudioSettings(){const volume=settings.muted?0:(settings.masterVolume/100)*(settings.musicVolume/100);raceMusic.forEach(audio=>audio.volume=volume);coursePreviewAudio.volume=volume;window.NyanAudio?.setMix(settings.masterVolume/100,settings.effectsVolume/100,settings.muted);$('masterVolume').value=settings.masterVolume;$('musicVolume').value=settings.musicVolume;$('effectsVolume').value=settings.effectsVolume;$('masterVolumeValue').textContent=settings.masterVolume;$('musicVolumeValue').textContent=settings.musicVolume;$('effectsVolumeValue').textContent=settings.effectsVolume;const mute=$('muteToggle');mute.classList.toggle('muted',settings.muted);mute.setAttribute('aria-pressed',String(settings.muted));mute.textContent=settings.muted?'♪ サウンド OFF':'♫ サウンド ON';syncMusicButton();updateCourseMusicPreviewUI()}
function applyControllerSettings(){const vibration=$('controllerVibrationToggle');if(!vibration)return;vibration.setAttribute('aria-pressed',String(!!settings.controllerVibration));vibration.textContent=`SLIP VIBRATION ${settings.controllerVibration?'ON':'OFF'}`}
const PERFORMANCE_ORDER=['light','balanced','high'];
const PERFORMANCE_PROFILES={high:{label:'HIGH',renderScale:1,segments:132,effects:1,scenery:1},balanced:{label:'BALANCED',renderScale:.9,segments:112,effects:.7,scenery:.68},light:{label:'LIGHT',renderScale:.74,segments:88,effects:.42,scenery:.4}};
const adaptiveQuality={key:null,lastFrame:0,windowStart:0,samples:[],fps:0,p90:0,lowWindows:0,highWindows:0,lastChanged:0,upgradeBlockedUntil:0,reason:'device'};
function hardwarePerformanceKey(){const memory=navigator.deviceMemory||8,cores=navigator.hardwareConcurrency||8,coarse=matchMedia('(pointer:coarse)').matches,delivery=window.NyanDelivery?.activeProfile?.();if(delivery==='light')return memory<=4||cores<=4||coarse?'light':'balanced';if(memory<=4||cores<=4&&coarse)return'light';if(memory<=8||cores<=6||coarse)return'balanced';return'high'}
adaptiveQuality.key=hardwarePerformanceKey();
function autoPerformanceKey(){return adaptiveQuality.key||hardwarePerformanceKey()}
function activePerformanceKey(){return settings.performancePreset==='auto'?autoPerformanceKey():(PERFORMANCE_PROFILES[settings.performancePreset]?settings.performancePreset:'balanced')}
function performanceProfile(){return PERFORMANCE_PROFILES[activePerformanceKey()]}
function effectDensity(){return performanceProfile().effects*(settings.reducedEffects?.55:1)}
const VFX_RENDER_CONTRACT=Object.freeze({model:'animated-atlas-blend-lod-v2',atlas:'gpt-image-2-uniform-6x6',caps:Object.freeze({high:240,balanced:168,light:104}),protected:Object.freeze(['shockwave','catCanImpact','burst','vfx','weatherTrail'])});
function effectParticleLimit(){const base=VFX_RENDER_CONTRACT.caps[activePerformanceKey()]||VFX_RENDER_CONTRACT.caps.balanced;return Math.max(56,Math.round(base*(settings.reducedEffects?.72:1)))}
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
const DELIVERY_SETTING_ORDER=['auto','light','full'];
function deliveryProfile(){return window.NyanDelivery?.profile?.()||{key:'standard',label:'STANDARD',cardRadius:5,courseRadius:2,raceWorkers:2,deferEnhancements:true,preloadAllRacers:false}}
function applyDeliverySettings(){
  const button=$('deliveryProfileToggle'),download=$('downloadFullAssets'),description=$('deliveryDescription'),status=$('deliveryDownloadStatus'),profile=deliveryProfile(),delivery=window.NyanDelivery?.snapshot?.();if(!button)return;
  button.textContent=`配信プロファイル ${settings.deliveryProfile==='auto'?`AUTO / ${profile.label}`:profile.label}`;button.setAttribute('aria-pressed',String(profile.key!=='light'));button.dataset.profile=profile.key;document.documentElement.dataset.deliveryProfile=profile.key;canvas.dataset.deliveryProfile=profile.key;canvas.dataset.deliveryModel=window.NyanDelivery?.MODEL||'unavailable';
  if(description)description.textContent=profile.key==='light'?'共通UI → 選択キャラ → 選択コース → 景観の順に読み込み、通信量と画像メモリを抑えます。':profile.key==='full'?'全キャラと選択コースの高密度素材を先読みします。':'端末と配信元に合わせて段階ロード量を調整します。';
  if(download){download.classList.toggle('ready',Boolean(delivery?.fullAssetsReady));download.disabled=Boolean(delivery?.warm?.running);download.style.setProperty('--delivery-download',delivery?.warm?.total?`${Math.round(delivery.warm.done/delivery.warm.total*100)}%`:delivery?.fullAssetsReady?'100%':'0%')}
  if(status)status.textContent=delivery?.warm?.running?`${delivery.warm.done} / ${delivery.warm.total}`:delivery?.fullAssetsReady?'保存済み・2回目からキャッシュ':'任意ダウンロード';window.NyanDelivery?.publish?.()
}
async function downloadFullDeliveryAssets(){
  const button=$('downloadFullAssets'),status=$('deliveryDownloadStatus');if(!button||!window.NyanDelivery?.warmFullAssets)return;button.disabled=true;button.classList.add('downloading');if(status)status.textContent='準備中…';
  try{const ready=await window.NyanDelivery.warmFullAssets(progress=>{const ratio=progress.total?progress.done/progress.total:0;button.style.setProperty('--delivery-download',`${Math.round(ratio*100)}%`);if(status)status.textContent=progress.complete?(progress.failed?'一部を軽量表示で補完':'保存完了'):`${progress.done} / ${progress.total}`});if(ready){settings.deliveryProfile='full';saveSettings();resetAdaptiveQualitySamples(true);racePackageStates.clear();raceEnhancementStates.clear();applyVisualSettings()}}
  catch(error){if(status)status.textContent='保存失敗・再試行できます';console.warn('Full delivery cache failed',error)}finally{button.disabled=false;button.classList.remove('downloading');applyDeliverySettings()}
}
function applyVisualSettings(){
  const rich=$('richSceneryToggle'),preset=$('performancePresetToggle'),effects=$('reducedEffectsToggle'),preload=$('preloadAssetsToggle'),profile=performanceProfile();if(!rich)return;
  rich.setAttribute('aria-pressed',String(!!settings.richScenery));rich.textContent=`豪華なコース外 ${settings.richScenery?'ON':'OFF'}`;
  preset.setAttribute('aria-pressed',String(settings.performancePreset!=='light'));preset.textContent=`描画品質 ${settings.performancePreset==='auto'?`AUTO / ${profile.label}`:profile.label}`;
  effects.setAttribute('aria-pressed',String(!!settings.reducedEffects));effects.textContent=`エフェクト軽量化 ${settings.reducedEffects?'ON':'OFF'}`;
  preload.setAttribute('aria-pressed',String(!!settings.preloadCourseAssets));preload.textContent=`レース素材先読み ${settings.preloadCourseAssets?'ON':'OFF'}`;
  const motionButtons=[['cameraMotionToggle','cameraMotion','カメラ上下'],['screenShakeToggle','screenShake','画面揺れ'],['speedLinesToggle','speedLines','速度流線'],['screenFlashToggle','screenFlash','画面フラッシュ']];for(const [id,key,label] of motionButtons){const button=$(id);if(!button)continue;const value=motionLevel(settings[key]);button.textContent=`${label} ${motionLabel(value)}`;button.setAttribute('aria-pressed',String(value>0));button.dataset.level=value>.75?'full':value>.1?'low':'off'}
  document.body.dataset.cameraMotion=motionLabel(settings.cameraMotion);document.body.dataset.screenShake=motionLabel(settings.screenShake);document.body.dataset.speedLines=motionLabel(settings.speedLines);document.body.dataset.screenFlash=motionLabel(settings.screenFlash);
  const measured=settings.performancePreset==='auto'&&adaptiveQuality.fps?`・実測 ${Math.round(adaptiveQuality.fps)} FPS`:'',autoCopy=settings.performancePreset==='auto'?'端末性能から開始し、実測FPSで自動調整します。':'手動設定を固定します。';$('performanceDescription').textContent=`内部解像度 ${Math.round(profile.renderScale*100)}%・道路 ${profile.segments} セグメント${measured}。${autoCopy}`;
  applyDeliverySettings();ROAD_SEGMENTS=profile.segments;ROAD_SEGMENT_LENGTH=DRAW_DISTANCE/ROAD_SEGMENTS;window.NyanTrackCache?.refresh?.();if(canvas.width)resize();
}
function difficultyProfile(){return DIFFICULTY_PROFILES[settings.raceDifficulty]||DIFFICULTY_PROFILES.normal}
function randomMiaThrowDelay(profile,phase='cooldown'){const min=profile[phase==='initial'?'miaThrowInitialMin':'miaThrowCooldownMin'],max=profile[phase==='initial'?'miaThrowInitialMax':'miaThrowCooldownMax'];return min+Math.random()*Math.max(0,max-min)}
function exposeMiaThrowProfile(profile=difficultyProfile()){
  canvas.dataset.miaThrowDifficulty=settings.raceDifficulty;
  canvas.dataset.miaThrowTelegraphMs=String(Math.round(profile.miaThrowRelease*1000));
  canvas.dataset.miaThrowAnimationMs=String(Math.round(profile.miaThrowDuration*1000));
  canvas.dataset.miaThrowCooldownRange=`${profile.miaThrowCooldownMin}-${profile.miaThrowCooldownMax}`;
  canvas.dataset.miaThrowSafeGap=`${profile.miaThrowGapMin}-${profile.miaThrowGapMax}`;
}
function exposeMiaThrowTell(kind,progress=0){
  const tell=MIA_THROW_TELEGRAPHS[kind];if(!tell)return;
  canvas.dataset.miaThrowTellStyle='typed-color-icon-audio-v1';
  canvas.dataset.miaThrowTellLabel=tell.label;
  canvas.dataset.miaThrowTellColor=tell.color;
  canvas.dataset.miaThrowTellAudio=tell.audio;
  canvas.dataset.miaThrowTellProgress=clamp(progress,0,1).toFixed(3);
}
function applyDifficultySettings(){const profile=difficultyProfile();document.querySelectorAll('[data-difficulty]').forEach(button=>{const active=button.dataset.difficulty===settings.raceDifficulty;button.classList.toggle('active',active);button.setAttribute('aria-checked',String(active))});if(!$('difficultyName'))return;$('difficultyKicker').textContent=profile.kicker;$('difficultyName').textContent=`${profile.label} / ${profile.jp}`;$('difficultyBadge').textContent=profile.badge;$('difficultySummary').textContent=profile.summary;$('difficultyNpcSpeed').textContent=`${Math.round(profile.aiSpeed*100)}%`;$('difficultyChase').textContent=`±${profile.rubberLimit}`;$('difficultyMiaLead').textContent=String(profile.miaTargetGap);$('difficultyDifferences').innerHTML=profile.differences.map(text=>`<li>${text}</li>`).join('');$('difficultyDockName').textContent=profile.label;$('difficultyDockCopy').textContent=profile.dock}
function selectRaceDifficulty(key){if(!DIFFICULTY_PROFILES[key])return;settings.raceDifficulty=key;applyDifficultySettings();saveSettings();if(state.mode==='difficulty')syncControllerFocus()}
function setupDifficultySelection(){document.querySelectorAll('.difficulty-card[data-difficulty]').forEach(button=>button.onclick=()=>selectRaceDifficulty(button.dataset.difficulty));applyDifficultySettings()}
function updateControlHints(){$('itemKeyHint').textContent=keyLabel(settings.bindings.item);$('driftKeyHint').textContent=settings.bindings.drift.startsWith('Shift')?'SHIFT':keyLabel(settings.bindings.drift)}
function renderKeyConfig(){const list=$('keyConfigList');list.innerHTML=Object.entries(ACTION_LABELS).map(([action,label])=>`<div class="key-bind"><span>${label}</span><button type="button" data-bind-action="${action}">${keyLabel(settings.bindings[action])}</button></div>`).join('');list.querySelectorAll('[data-bind-action]').forEach(button=>button.onclick=()=>beginKeyCapture(button.dataset.bindAction))}
function beginKeyCapture(action){captureAction=action;renderKeyConfig();const button=document.querySelector(`[data-bind-action="${action}"]`);button?.classList.add('capturing');if(button)button.textContent='キーを押す';$('keyCaptureHelp').textContent='割り当てるキーを押してください（BACKSPACEでキャンセル）'}
function finishKeyCapture(action,code){const previous=settings.bindings[action],conflict=Object.keys(settings.bindings).find(other=>other!==action&&settings.bindings[other]===code);if(conflict)settings.bindings[conflict]=previous;settings.bindings[action]=code;captureAction=null;saveSettings();renderKeyConfig();updateControlHints();$('keyCaptureHelp').textContent='変更したい操作を選び、割り当てるキーを押してください。'}
function setupSettings(){renderKeyConfig();applyAudioSettings();applyVisualSettings();applyControllerSettings();updateControlHints();$('masterVolume').oninput=e=>{settings.masterVolume=Number(e.target.value);applyAudioSettings();saveSettings()};$('musicVolume').oninput=e=>{settings.musicVolume=Number(e.target.value);applyAudioSettings();saveSettings()};$('effectsVolume').oninput=e=>{settings.effectsVolume=Number(e.target.value);applyAudioSettings();saveSettings()};$('muteToggle').onclick=()=>{settings.muted=!settings.muted;applyAudioSettings();saveSettings()};$('richSceneryToggle').onclick=()=>{settings.richScenery=!settings.richScenery;applyVisualSettings();saveSettings()};$('performancePresetToggle').onclick=()=>{const order=['auto','high','balanced','light'],i=order.indexOf(settings.performancePreset);settings.performancePreset=order[(i+1)%order.length];if(settings.performancePreset==='auto')resetAdaptiveQualitySamples(true);applyVisualSettings();saveSettings()};$('deliveryProfileToggle').onclick=()=>{const i=DELIVERY_SETTING_ORDER.indexOf(settings.deliveryProfile);settings.deliveryProfile=DELIVERY_SETTING_ORDER[(i+1)%DELIVERY_SETTING_ORDER.length];saveSettings();racePackageStates.clear();resetAdaptiveQualitySamples(true);applyVisualSettings();if(state.mode==='kart')hydrateSetCardWindow(setCarousel.virtualIndex);if(state.mode==='course')hydrateCourseCardWindow(courseCarousel.virtualIndex)};$('downloadFullAssets').onclick=downloadFullDeliveryAssets;$('reducedEffectsToggle').onclick=()=>{settings.reducedEffects=!settings.reducedEffects;applyVisualSettings();saveSettings()};$('preloadAssetsToggle').onclick=()=>{settings.preloadCourseAssets=!settings.preloadCourseAssets;applyVisualSettings();saveSettings()};$('controllerVibrationToggle').onclick=()=>{settings.controllerVibration=!settings.controllerVibration;applyControllerSettings();saveSettings()};$('cameraMotionToggle').onclick=()=>cycleMotionSetting('cameraMotion');$('screenShakeToggle').onclick=()=>cycleMotionSetting('screenShake');$('speedLinesToggle').onclick=()=>cycleMotionSetting('speedLines');$('screenFlashToggle').onclick=()=>cycleMotionSetting('screenFlash');$('resetKeys').onclick=()=>{settings.bindings={...DEFAULT_SETTINGS.bindings};captureAction=null;renderKeyConfig();updateControlHints();saveSettings()}}

const SOUND_TEST_MODES={
  idle:{label:'STOP / IDLE',speed:0,power:.12,accelerating:false,boosting:false,turbo:0},
  low:{label:'LOW SPEED',speed:65,power:.38,accelerating:true,boosting:false,turbo:0},
  high:{label:'HIGH SPEED',speed:175,power:.76,accelerating:true,boosting:false,turbo:0},
  boost:{label:'FULL BOOST',speed:225,power:1,accelerating:true,boosting:true,turbo:1},
  signature:{label:'SIGNATURE READY',speed:0,power:.62,accelerating:false,boosting:false,turbo:0,signature:true}
};
const soundTestState={selected:0,mode:'idle',active:false,signaturePlays:0};
function setupSoundTest(){
  const grid=$('soundTestGrid');if(!grid)return;
  grid.innerHTML=racers.map((racer,index)=>{const sound=window.NyanAudio?.getMachineInfo(racer.slug);return `<button class="sound-test-machine" type="button" role="option" data-sound-machine="${index}" aria-selected="false" style="--machine-color:${racer.color}"><img src="${racer.hero}" alt="" loading="lazy" decoding="async"><span><b>${racer.name}</b><small>${sound?.label||racer.set.kart}</small></span><em>${String(index+1).padStart(2,'0')}</em></button>`}).join('');
  grid.querySelectorAll('[data-sound-machine]').forEach(button=>button.onclick=()=>selectSoundTestMachine(Number(button.dataset.soundMachine),true));
  $('soundTestModes').querySelectorAll('[data-sound-mode]').forEach(button=>button.onclick=()=>selectSoundTestMode(button.dataset.soundMode));
  $('soundTestSignaturePlay').onclick=playSoundTestSignature;
  $('openSoundTest').onclick=openSoundTest;$('closeSoundTest').onclick=closeSoundTest;
}
function soundTestMode(){return SOUND_TEST_MODES[soundTestState.mode]||SOUND_TEST_MODES.idle}
function soundTestHapticLabel(){
  if(!settings.controllerVibration)return'VIBRATION · OFF';
  const pads=navigator.getGamepads?.()||[],pad=activeGamepadIndex!==null?pads[activeGamepadIndex]:[...pads].find(Boolean),actuator=pad?.vibrationActuator||pad?.hapticActuators?.[0];
  return actuator?'VIBRATION · READY':'VIBRATION · CONNECT PAD';
}
function updateSoundTestUI(machineChanged=false){
  const racer=racers[soundTestState.selected],sound=window.NyanAudio?.getMachineInfo(racer.slug),mode=soundTestMode(),signature=racer?.signature,signatureMode=!!mode.signature,visual=$('soundTestVisual'),screen=$('soundTest');if(!racer||!visual)return;
  const profile=signatureFeedbackFor(racer),tach=$('soundTestTach');$('soundTestCounter').textContent=`${String(soundTestState.selected+1).padStart(2,'0')} / ${String(racers.length).padStart(2,'0')}`;$('soundTestHero').src=signatureMode?racer.signatureCutin:racer.hero;$('soundTestHero').alt=signatureMode?`${racer.name} ${signature.jp}の固有能力カットイン`:`${racer.name}と${racer.set.kart}`;
  $('soundTestProfileKicker').textContent=signatureMode?'SELECTED SIGNATURE PROFILE':'SELECTED ENGINE PROFILE';$('soundTestMachineName').textContent=signatureMode?signature.label:(sound?.label||racer.set.kart.toUpperCase());$('soundTestSetName').textContent=signatureMode?`${racer.name} / ${signature.jp}`:`${racer.name} / ${racer.set.kart}`;$('soundTestConcept').textContent=signatureMode?signature.copy:(sound?.concept||racer.set.description);$('soundTestStateLabel').textContent=mode.label;$('soundTestSpeed').textContent=signatureMode?signature.glyph:String(mode.speed);tach.style.setProperty('--sound-power',mode.power);tach.querySelector('small').textContent=signatureMode?'SKILL':'ENGINE';tach.querySelector('span').textContent=signatureMode?'SYNC':'KM/H';
  visual.style.setProperty('--motion',mode.power);visual.style.setProperty('--signature-color',signature.color);visual.style.setProperty('--signature-color2',signature.color2);visual.className=`sound-test-visual mode-${soundTestState.mode}${signatureMode?' signature-preview':''}`;screen.dataset.labMode=signatureMode?'signature':'engine';screen.style.setProperty('--signature-color',signature.color);screen.style.setProperty('--signature-color2',signature.color2);$('soundTestModes').style.setProperty('--signature-color',signature.color);$('soundTestModes').style.setProperty('--signature-color2',signature.color2);
  $('soundTestSignatureName').textContent=signature.jp;$('soundTestSignatureCopy').textContent=signature.copy;$('soundTestSignatureAudio').textContent=`AUDIO · ${profile.cue.toUpperCase()}`;$('soundTestSignatureColor').textContent=`FLASH · ${signature.color.toUpperCase()}`;$('soundTestSignatureHaptic').textContent=soundTestHapticLabel();const panel=$('soundTestSignaturePanel');panel.style.setProperty('--signature-color',signature.color);panel.style.setProperty('--signature-color2',signature.color2);
  if(machineChanged){visual.classList.add('machine-changed');setTimeout(()=>visual.classList.remove('machine-changed'),430)}
  document.querySelectorAll('[data-sound-machine]').forEach(button=>{const active=Number(button.dataset.soundMachine)===soundTestState.selected;button.classList.toggle('selected',active);button.setAttribute('aria-selected',String(active))});
  document.querySelectorAll('[data-sound-mode]').forEach(button=>{const active=button.dataset.soundMode===soundTestState.mode;button.classList.toggle('active',active);button.setAttribute('aria-checked',String(active))});
  canvas.dataset.soundTestLabMode=signatureMode?'signature':'engine';canvas.dataset.soundTestSignatureRacer=racer.slug;canvas.dataset.soundTestSignatureCue=profile.cue;canvas.dataset.soundTestSignatureFamily=profile.family;canvas.dataset.soundTestSignatureColor=signature.color;canvas.dataset.soundTestSignatureColor2=signature.color2
}
function selectSoundTestMachine(index,scroll=false){
  soundTestState.selected=((index%racers.length)+racers.length)%racers.length;const racer=racers[soundTestState.selected];if(soundTestMode().signature)window.NyanAudio?.stopEngine();else window.NyanAudio?.startEngine(racer.slug,racer.set.stats,{silent:true});updateSoundTestUI(true);const card=document.querySelector(`[data-sound-machine="${soundTestState.selected}"]`);if(scroll)card?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});if(state.mode==='soundTest')requestAnimationFrame(syncControllerFocus)
}
function playSoundTestSignature(){
  const racer=racers[soundTestState.selected];if(!racer?.signature)return;if(soundTestState.mode!=='signature'){soundTestState.mode='signature';window.NyanAudio?.stopEngine();updateSoundTestUI()}
  const signature=racer.signature,profile=signatureFeedbackFor(racer),flash=$('soundTestSignatureFlash'),visual=$('soundTestVisual'),panel=$('soundTestSignaturePanel');startSignatureFeedback(racer);playSfx('signature',{cue:profile.cue,variant:racer.signatureIndex,intensity:1.12,role:'player'});soundTestState.signaturePlays++;
  const flashEnabled=motionLevel(settings.screenFlash)>0;flash.style.setProperty('--signature-color',signature.color);flash.style.setProperty('--signature-color2',signature.color2);flash.classList.remove('show');visual.classList.remove('signature-testing');panel.classList.remove('testing');void flash.offsetWidth;if(flashEnabled)flash.classList.add('show');visual.classList.add('signature-testing');panel.classList.add('testing');$('soundTestStateLabel').textContent='SIGNATURE SYNC!';
  canvas.dataset.soundTestSignatureModel='29-racer-av-haptic-preview-v1';canvas.dataset.soundTestSignaturePlays=String(soundTestState.signaturePlays);canvas.dataset.soundTestSignatureAudio=profile.cue;canvas.dataset.soundTestSignatureHaptic=profile.haptic.map(([delay,duration,strong,weak])=>`${delay}:${duration}:${strong.toFixed(2)}:${weak.toFixed(2)}`).join('|');canvas.dataset.soundTestSignatureFlash=flashEnabled?signature.color:'off';
  clearTimeout(playSoundTestSignature.timer);playSoundTestSignature.timer=setTimeout(()=>{flash.classList.remove('show');visual.classList.remove('signature-testing');panel.classList.remove('testing');if(soundTestState.mode==='signature')$('soundTestStateLabel').textContent='SIGNATURE READY';$('soundTestSignatureHaptic').textContent=soundTestHapticLabel()},720)
}
function selectSoundTestMode(mode){if(!SOUND_TEST_MODES[mode])return;soundTestState.mode=mode;if(mode==='signature'){window.NyanAudio?.stopEngine();updateSoundTestUI();playSoundTestSignature()}else{const racer=racers[soundTestState.selected];window.NyanAudio?.startEngine(racer.slug,racer.set.stats,{silent:true});updateSoundTestUI();if(mode==='boost')playSfx('boost',{intensity:.65})}if(state.mode==='soundTest')requestAnimationFrame(syncControllerFocus)}
function openSoundTest(){soundTestState.active=true;soundTestState.selected=state.selected;state.mode='soundTest';showScreen('soundTest');selectSoundTestMachine(soundTestState.selected,false)}
function closeSoundTest(){soundTestState.active=false;clearSignatureHaptics();$('soundTestSignatureFlash')?.classList.remove('show');window.NyanAudio?.stopEngine();state.mode='settings';showScreen('settings')}
function updateSoundTestMeter(){
  const racer=racers[soundTestState.selected],sound=window.NyanAudio?.getMachineInfo(racer?.slug),mode=soundTestMode(),now=performance.now(),pulse=(sound?.pulse||3)*.00035,rough=sound?.roughness||.1,air=sound?.air||.1;
  $('soundTestMeter')?.querySelectorAll('i').forEach((bar,index)=>{const wave=(Math.sin(now*(.004+pulse)+index*1.31)+Math.sin(now*.0023+index*.71)+2)*.25,shape=.3+Math.sin((index+1)*.83+now*.0008)*.16,height=10+mode.power*52+wave*(18+rough*32)+shape*air*35;bar.style.height=`${Math.max(8,Math.min(100,height))}%`});
}

const state = {
  mode:'menu', raceMode:'single', selected:0, selectedCourse:0, running:false, paused:false, elapsed:0, lap:1, progress:0,
  distance:0, speed:0, x:0, steer:0, boosting:false, turbo:0, drift:0, driftLevel:0,
  item:null, shield:0, invincible:0, coins:0, raceWalletEarned:0, shake:0, rank:6, last:0,
  objects:[], courseHazards:[], particles:[], collectFx:[], projectiles:[], snowTracks:[], snowTrackCursor:{}, weatherSlip:0, weatherSurface:'dry', trackCurve:0, centrifugal:0, surface:'road', trackMaterial:'asphalt', offroadAmount:0, suspension:0, suspensionVelocity:0, jumpY:0, jumpVelocity:0, jumpView:0, landingBounce:0, landingBounceVelocity:0, airborne:false, cameraHeading:0, cameraLane:0, routeCameraVelocity:0, flash:0, collisionCooldown:0,
  countdownActive:false, startCharge:0, startPenalty:false, finish:false, finishTime:0, finishCoast:0, finishOrder:null, lastRank:6,
  raceDifficulty:'normal',raceRewards:[],raceWalletStart:0,finishCoinBonus:0,resultRecord:null,overtakeUiCooldown:0,rocketWarningCooldown:0,routeSelectionPulse:0,routeSelectionSide:null,routeSelectionLap:-1,routeSelectionSerial:0,debug:{showCourseLimits:false}
};
const CUP_RACE_COUNT=3;
const CUP_POINTS=Object.freeze([15,12,10,9,8,7,6,5,4,3,2,1]);
const cupState={
  active:false,startCourse:0,courseIndexes:[],results:[],standings:new Map(),walletStart:0,totalCoins:0,totalTime:0,final:false
};
const keyboardActions={},touchActions={},gamepadInput={accelerate:false,brake:false,left:false,right:false,drift:false,steer:0};
let gamepadPrevious={item:false,pause:false,accelerate:false,confirm:false,back:false},activeGamepadIndex=null;
const controllerUi={indexes:{menu:0,settings:0,soundTest:0,cupStandings:1,finish:0},activeElement:null,repeat:{left:0,right:0,up:0,down:0}};
const surfaceHaptics={wasSliding:false,cooldown:0,count:0,lastSurface:'dry'};
const signatureFeedbackState={life:0,duration:0,strength:0,color:'#ffffff',color2:'#ffffff',family:'none',cue:'none',racer:'none',serial:0};
const signatureHapticTimers=new Set();
function pulseController(duration,strong,weak){
  const pads=navigator.getGamepads?.()||[],pad=activeGamepadIndex!==null?pads[activeGamepadIndex]:[...pads].find(Boolean),actuator=pad?.vibrationActuator||pad?.hapticActuators?.[0];canvas.dataset.controllerHaptics=actuator?'supported':'unsupported';if(!settings.controllerVibration||!actuator)return false;
  try{if(typeof actuator.playEffect==='function')actuator.playEffect('dual-rumble',{startDelay:0,duration,strongMagnitude:clamp(strong,0,1),weakMagnitude:clamp(weak,0,1)}).catch?.(()=>{});else if(typeof actuator.pulse==='function')actuator.pulse(clamp(Math.max(strong,weak),0,1),duration);else return false;return true}catch{return false}
}
function signatureFeedbackFor(racer){
  const cue=racer?.signature?.visual||'prism',family=SIGNATURE_FEEDBACK_FAMILY_BY_VISUAL[cue]||'sparkle',base=SIGNATURE_FEEDBACK_FAMILIES[family],variation=1+(((racer?.signatureIndex||0)%5)-2)*.025;
  return{...base,family,cue,flash:clamp(base.flash*variation,.2,.4),shake:base.shake*variation,haptic:base.haptic.map(([delay,duration,strong,weak])=>[delay,duration,clamp(strong*variation,0,1),clamp(weak*(2-variation),0,1)])}
}
function clearSignatureHaptics(){for(const timer of signatureHapticTimers)clearTimeout(timer);signatureHapticTimers.clear()}
function queueSignatureHaptics(racer,profile){
  clearSignatureHaptics();const pattern=profile.haptic||[];canvas.dataset.signatureHapticFamily=profile.family;canvas.dataset.signatureHapticPattern=pattern.map(([delay,duration,strong,weak])=>`${delay}:${duration}:${strong.toFixed(2)}:${weak.toFixed(2)}`).join('|');canvas.dataset.signatureHapticPulses=String(pattern.length);canvas.dataset.signatureHapticDelivered='0';
  for(const [delay,duration,strong,weak]of pattern){const fire=()=>{const delivered=pulseController(duration,strong,weak);if(delivered)canvas.dataset.signatureHapticDelivered=String(Number(canvas.dataset.signatureHapticDelivered||0)+1)};if(delay<=0)fire();else{const timer=setTimeout(()=>{signatureHapticTimers.delete(timer);fire()},delay);signatureHapticTimers.add(timer)}}
}
function startSignatureFeedback(racer){
  const signature=racer?.signature;if(!signature)return;const profile=signatureFeedbackFor(racer),reduced=settings.reducedEffects?.78:1;Object.assign(signatureFeedbackState,{life:profile.duration,duration:profile.duration,strength:profile.flash*reduced,color:signature.color,color2:signature.color2,family:profile.family,cue:profile.cue,racer:racer.slug,serial:signatureFeedbackState.serial+1});state.shake=Math.max(state.shake,profile.shake*reduced);queueSignatureHaptics(racer,profile);
  canvas.dataset.signatureFeedbackModel='color-audio-haptic-v1';canvas.dataset.signatureFeedbackFamily=profile.family;canvas.dataset.signatureFeedbackCue=profile.cue;canvas.dataset.signatureFeedbackColor=signature.color;canvas.dataset.signatureFeedbackColor2=signature.color2;canvas.dataset.signatureFeedbackSerial=String(signatureFeedbackState.serial);canvas.dataset.signatureFeedbackLife=profile.duration.toFixed(3)
}
function updateSurfaceHaptics(dt){
  surfaceHaptics.cooldown=Math.max(0,surfaceHaptics.cooldown-dt);const weather=state.weatherSurface||'dry',active=state.mode==='race'&&state.running&&!state.paused&&!state.airborne&&state.surface==='road'&&weather!=='dry'&&state.speed>48,signal=Math.abs(state.weatherSlip)*2.6+(state.drift>0?Math.abs(state.steer)*.19:0)+Math.abs(state.centrifugal)*(weather==='snow'?.15:.09),threshold=weather==='snow'?.075:weather==='wet'?.09:.1,sliding=active&&signal>threshold;
  if(sliding&&!surfaceHaptics.wasSliding&&surfaceHaptics.cooldown<=0){const intensity=clamp(.24+(signal-threshold)*2.8,.24,.82),delivered=pulseController(weather==='snow'?135:95,intensity,weather==='snow'?intensity*.72:intensity*.46);if(delivered)surfaceHaptics.count++;surfaceHaptics.cooldown=weather==='snow'?.72:.58}
  surfaceHaptics.wasSliding=sliding;surfaceHaptics.lastSurface=weather;canvas.dataset.hapticModel='slip-onset-v1';canvas.dataset.hapticState=sliding?'sliding':'ready';canvas.dataset.hapticSignal=signal.toFixed(3);canvas.dataset.hapticCount=String(surfaceHaptics.count);canvas.dataset.hapticEnabled=String(!!settings.controllerVibration)
}
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
  const loadingActive=!$('courseLoading')?.classList.contains('hidden');if(loadingActive){if(confirm&&!gamepadPrevious.confirm&&!$('courseLoadingRetry')?.classList.contains('hidden'))$('courseLoadingRetry')?.click();gamepadPrevious={item,pause,accelerate,confirm,back};return}
  if(state.mode==='race'){
    if(accelerate&&!gamepadPrevious.accelerate)handleStartCharge();if(item&&!gamepadPrevious.item)useItem();if(pause&&!gamepadPrevious.pause)togglePause();
  }else{
    const now=performance.now();for(const [direction,active] of Object.entries({left,right,up,down}))if(gamepadDirectionPulse(direction,active,now))navigateController(direction);
    if(confirm&&!gamepadPrevious.confirm)activateControllerSelection();if(back&&!gamepadPrevious.back)controllerBack();if(item&&!gamepadPrevious.item&&state.mode==='kart')openWardrobe();else if(item&&!gamepadPrevious.item&&state.mode==='wardrobe'&&wardrobeState.inspectionMode)toggleWardrobeFrameIssue();else if(item&&!gamepadPrevious.item&&state.mode==='course')toggleCourseMusicPreview();if(pause&&!gamepadPrevious.pause&&state.mode==='settings')closeSettings();
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
const SURFACE_PROFILES={
  road:{id:'road',amount:0,accel:1,grip:1,steer:1,lateral:1,drag:0,roll:0,maxFactor:1,shake:0,dust:0,color:'#c8bed0'},
  shoulder:{id:'shoulder',amount:.28,accel:.93,grip:.9,steer:.94,lateral:.92,drag:.00004,roll:.02,maxFactor:.9,shake:1.1,dust:.42,color:'#d8bd83'},
  grass:{id:'grass',amount:.66,accel:.72,grip:.66,steer:.78,lateral:.72,drag:.00012,roll:.065,maxFactor:.7,shake:3.2,dust:.9,color:'#9cc878'},
  deep:{id:'deep',amount:1,accel:.62,grip:.58,steer:.72,lateral:.64,drag:.00014,roll:.08,maxFactor:.62,shake:4.6,dust:1.18,color:'#c99a6a'}
};
const WEATHER_DRIVE_PROFILES={
  dry:{id:'dry',accel:1,grip:1,steer:1,brake:1,maxFactor:1,drag:0,driftSlip:0,coastSlip:0,curveSlip:0,recovery:9},
  damp:{id:'damp',accel:.98,grip:.94,steer:.97,brake:.9,maxFactor:.985,drag:.000008,driftSlip:.13,coastSlip:.012,curveSlip:.035,recovery:4.2},
  wet:{id:'wet',accel:.95,grip:.89,steer:.94,brake:.82,maxFactor:.97,drag:.000015,driftSlip:.24,coastSlip:.025,curveSlip:.07,recovery:3.2},
  snow:{id:'snow',accel:.88,grip:.78,steer:.86,brake:.72,maxFactor:.91,drag:.000025,driftSlip:.34,coastSlip:.055,curveSlip:.12,recovery:2.35}
};
function weatherDriveAt(distance=state.distance,surface=SURFACE_PROFILES.road){
  if(surface?.id!=='road'||tunnelAt(distance))return WEATHER_DRIVE_PROFILES.dry;const ambience=COURSE_AMBIENCE_PROFILES[state.selectedCourse];
  if(ambience?.effects?.some(effect=>effect.type==='snow'))return WEATHER_DRIVE_PROFILES.snow;
  if(ambience?.effects?.some(effect=>effect.type==='rain'))return ambience.id==='rain'?WEATHER_DRIVE_PROFILES.wet:WEATHER_DRIVE_PROFILES.damp;
  return WEATHER_DRIVE_PROFILES.dry;
}
const SIGNATURE_NEUTRAL=Object.freeze({speed:1,accel:1,grip:1,drift:1,boost:1,offroad:1,air:1,ram:1,weather:1});
function signaturePerformance(racer){return racer?.signatureActive>0?{...SIGNATURE_NEUTRAL,...racer.signature.performance}:SIGNATURE_NEUTRAL}
function signatureResistance(base,multiplier){return clamp(1-(1-base)/Math.max(1,multiplier||1),base,1)}
function signaturePlayer(racer){return racer===racers[state.selected]}
function signatureVelocity(racer){return signaturePlayer(racer)?state.speed:Number(racer?.aiVelocity)||0}
function signatureLane(racer){return signaturePlayer(racer)?state.x:Number(racer?.lane)||0}
function signatureSurface(racer){return surfaceAtLane(signatureLane(racer),signaturePlayer(racer)?state.distance:racer.distance)}
function signatureRank(racer){return raceOrder().indexOf(racer)+1}
function signatureNearby(racer,range=58){
  return raceContestants().filter(other=>other!==racer&&sameActiveRouteEdge(racer,racer.distance,other,other.distance)&&Math.abs(other.distance-racer.distance)<range);
}
function signatureEventMatches(trigger,event){
  if(event==='incoming')return trigger==='defense';
  if(event==='hit')return trigger==='recovery'||trigger==='defense'||trigger==='backmarker';
  if(event==='pickup')return trigger==='pickup'||trigger==='backmarker';
  if(event==='air')return trigger==='air';
  if(event==='driftRelease')return trigger==='drift';
  if(event==='overtake')return trigger==='overtake'||trigger==='chase';
  if(event==='route')return trigger==='route';
  return event==='auto';
}
function signatureAutoReady(racer){
  const signature=racer.signature;if(!signature||state.elapsed<2400)return false;
  const velocity=signatureVelocity(racer),rank=signatureRank(racer),field=Math.max(2,raceContestants().length),bend=Math.abs(trackBend((racer.distance+48)/Math.max(1,raceLength()))),surface=signatureSurface(racer),weather=weatherDriveAt(racer.distance,surface),nearby=signatureNearby(racer,54),ahead=nearby.filter(other=>other.distance>racer.distance).sort((a,b)=>a.distance-b.distance)[0],incoming=state.projectiles?.some(shot=>shot.kind==='rocket'&&shot.target===racer&&shot.life>0&&racer.distance-shot.z<230);
  switch(signature.trigger){
    case'defense':return incoming||nearby.some(other=>other.distance<racer.distance&&racer.distance-other.distance<34);
    case'recovery':return velocity<82||(racer.hit||0)>0||(racer.spin||0)>0;
    case'offroad':return surface.id!=='road'&&velocity>28;
    case'weather':return weather.id!=='dry'?velocity>70:bend>.34&&velocity>128;
    case'air':return !!racer.airborne;
    case'crowd':return nearby.length>=2&&velocity>90;
    case'straight':return bend<.17&&velocity>145;
    case'corner':return bend>.39&&velocity>105;
    case'backmarker':return rank>Math.ceil(field*.54)||velocity<78;
    case'leader':return rank<=3&&velocity>128;
    case'chase':return !!ahead&&ahead.distance-racer.distance<46&&velocity>100;
    case'route':return !!routeStateForRacer(racer,racer.distance)?.active;
    case'overtake':return !!ahead&&ahead.distance-racer.distance<27&&velocity>118;
    case'drift':return !signaturePlayer(racer)&&bend>.34&&velocity>118;
    case'pickup':return false;
    default:return false;
  }
}
function applySignaturePulse(racer,strength){
  let affected=0;for(const target of signatureNearby(racer,96)){if((target.invincible||0)>0)continue;const factor=clamp(1-Number(strength||0),.74,.96);if(signaturePlayer(target)){if(state.shield>0)continue;state.speed*=factor;state.weatherSlip=clamp(state.weatherSlip+(signatureLane(target)-signatureLane(racer))*.035,-.3,.3)}else{if(target.shield>0)continue;target.aiVelocity*=factor;target.hit=Math.max(target.hit||0,.26)}affected++}
  return affected;
}
function showSignatureCallout(racer,reason){
  const element=$('signatureCallout');if(!element)return;const signature=racer.signature,art=$('signatureCalloutArt'),hasArt=Boolean(racer.signatureCutin);element.style.setProperty('--signature-color',signature.color);element.style.setProperty('--signature-color2',signature.color2);element.classList.toggle('has-art',hasArt);element.dataset.visual=hasArt?'gpt-image-2-chibi-roster-v1':'procedural';if(art){art.src=hasArt?racer.signatureCutin:'';art.alt=hasArt?`${racer.name} ${signature.jp} カットイン`:''}$('signatureCalloutGlyph').textContent=signature.glyph;$('signatureCalloutName').textContent=signature.jp;$('signatureCalloutCopy').textContent=signature.copy;element.classList.remove('show');void element.offsetWidth;element.classList.add('show');clearTimeout(showSignatureCallout.timer);showSignatureCallout.timer=setTimeout(()=>element.classList.remove('show'),hasArt?1850:1550);element.dataset.reason=reason;element.dataset.racer=racer.slug
}
function activateRacerSignature(racer,reason='auto'){
  const signature=racer?.signature;if(!signature||racer.signatureActive>0||racer.signatureCooldown>0)return false;
  racer.signatureActive=signature.duration;racer.signatureCooldown=signature.duration+signature.cooldown;racer.signatureUseCount=(racer.signatureUseCount||0)+1;racer.signatureReason=reason;racer.signaturePulse=1;
  const player=signaturePlayer(racer),launch=signature.launch||{};if(player){
    if(launch.turbo)state.turbo=Math.max(state.turbo,launch.turbo);
    if(launch.shield)state.shield=Math.max(state.shield,launch.shield);
    if(launch.invincible)state.invincible=Math.max(state.invincible,launch.invincible);
    if(launch.cleanse){state.collisionCooldown=Math.min(state.collisionCooldown,.18);state.weatherSlip*=.25;state.speed=Math.max(state.speed,128)}
  }else{
    if(launch.turbo)racer.aiBoost=Math.max(racer.aiBoost||0,launch.turbo);
    if(launch.shield)racer.shield=Math.max(racer.shield||0,launch.shield);
    if(launch.invincible)racer.invincible=Math.max(racer.invincible||0,launch.invincible);
    if(launch.cleanse){racer.hit=0;racer.spin=0;racer.aiVelocity=Math.max(racer.aiVelocity||0,126)}
  }
  const affected=launch.pulse?applySignaturePulse(racer,launch.pulse):0;
  if(player){const anchor=playerEffectAnchor();showSignatureCallout(racer,reason);startSignatureFeedback(racer);playSfx('signature',{cue:signature.visual,variant:racer.signatureIndex,intensity:1.12,role:'player'});burst(anchor.x,anchor.y-anchor.height*.42,8,signature.color,racer.signatureIndex%7)}
  else if(Math.abs(racer.distance-state.distance)<260){const point=projectTrackEntity(racer.distance,racer.lane);playSfx('signature',{cue:signature.visual,variant:racer.signatureIndex,intensity:.52,role:'rival'});if(point?.visible)burst(point.x,point.y-52*Math.max(.5,point.scale||1),4,signature.color,racer.signatureIndex%7)}
  canvas.dataset.signatureLast=racer.slug;canvas.dataset.signatureLastName=signature.label;canvas.dataset.signatureLastReason=reason;canvas.dataset.signatureLastAffected=String(affected);canvas.dataset.signatureActivations=String(Number(canvas.dataset.signatureActivations||0)+1);return true
}
function tryActivateRacerSignature(racer,event='auto'){
  if(!racer?.signature||racer.signatureActive>0||racer.signatureCooldown>0||!signatureEventMatches(racer.signature.trigger,event))return false;
  if(event==='auto'&&!signatureAutoReady(racer))return false;
  return activateRacerSignature(racer,event);
}
function updateRacerSignatures(dt){
  for(const racer of racers){racer.signatureActive=Math.max(0,(racer.signatureActive||0)-dt);racer.signatureCooldown=Math.max(0,(racer.signatureCooldown||0)-dt);racer.signaturePulse=Math.max(0,(racer.signaturePulse||0)-dt*2.4);if(!racer.signatureActive&&racer.signatureCooldown<=0)tryActivateRacerSignature(racer,'auto')}
  const player=racers[state.selected],active=player.signatureActive>0;canvas.dataset.signatureModel='29-unique-shared-runtime-v1';canvas.dataset.signatureCount=String(Object.keys(RACER_SIGNATURES).length);canvas.dataset.signatureActive=active?player.signature.label:'none';canvas.dataset.signatureCooldown=(player.signatureCooldown||0).toFixed(2)
}
function updateSignatureHud(){
  const racer=racers[state.selected],signature=racer?.signature,element=$('signatureHud');if(!signature||!element)return;const active=racer.signatureActive>0,remaining=Math.max(0,(racer.signatureCooldown||0)-(racer.signatureActive||0)),progress=active?100:clamp(1-remaining/signature.cooldown,0,1)*100;element.style.setProperty('--signature-color',signature.color);element.style.setProperty('--signature-color2',signature.color2);element.classList.toggle('active',active);element.classList.toggle('ready',!active&&remaining<=0);$('signatureGlyph').textContent=signature.glyph;$('signatureName').textContent=signature.jp;$('signatureStatus').textContent=active?`ACTIVE ${racer.signatureActive.toFixed(1)}s`:remaining>0?`CHARGE ${Math.ceil(remaining)}s`:'READY';$('signatureMeter').style.width=`${progress.toFixed(1)}%`
}
// Track materials are visual/physical skins for the projected road. A course
// can swap them by distance without changing its curve, hill, branch or
// minimap data. Future train roofs, house roofs and pastry platforms use the
// same contract as the jungle stone, mud and bridge sections below.
const TRACK_SURFACE_MATERIALS={
  asphalt:{id:'asphalt',detail:'asphalt',roadA:null,roadB:null,curbA:null,curbB:null,lane:null,drive:SURFACE_PROFILES.road},
  jungleStone:{id:'jungle-stone',detail:'stone',roadA:'#454a36',roadB:'#566047',curbA:'#a98b3f',curbB:'#334c27',lane:'rgba(116,255,178,.18)',side:'#27321f',drive:{...SURFACE_PROFILES.road,material:'jungle-stone',shake:.28,roll:.007}},
  jungleMud:{id:'jungle-mud',detail:'mud',roadA:'#493923',roadB:'#5a452b',curbA:'#74613a',curbB:'#2d4c29',lane:null,side:'#2d251b',drive:{...SURFACE_PROFILES.road,material:'jungle-mud',accel:.9,grip:.82,steer:.9,lateral:.86,drag:.000035,roll:.024,maxFactor:.9,shake:1.5,dust:.32,color:'#80613a'}},
  jungleWood:{id:'jungle-wood',detail:'wood',roadA:'#6c4c2b',roadB:'#795936',curbA:'#bd9553',curbB:'#382d1d',lane:'rgba(255,222,139,.16)',side:'#2c2118',sideDepth:.2,elevated:true,guardrailLane:1.1,drive:{...SURFACE_PROFILES.road,material:'jungle-wood',grip:.95,roll:.018,shake:.7}},
  jungleEmerald:{id:'jungle-emerald',detail:'emerald',roadA:'#394a3b',roadB:'#425846',curbA:'#37e8a2',curbB:'#c6a94b',lane:'rgba(91,255,185,.46)',side:'#1d3025',sideDepth:.07,drive:{...SURFACE_PROFILES.road,material:'jungle-emerald',grip:1.03,steer:1.02}},
  trainRoof:{id:'train-roof',detail:'metal',roadA:'#4b5260',roadB:'#5b6472',curbA:'#e1b852',curbB:'#303844',lane:'rgba(215,239,255,.42)',side:'#262d38',sideDepth:.24,elevated:true,guardrailLane:1.1,drive:{...SURFACE_PROFILES.road,material:'train-roof',grip:.96,roll:.012,shake:.45}},
  houseRoof:{id:'house-roof',detail:'tiles',roadA:'#83453f',roadB:'#974e45',curbA:'#f1c27c',curbB:'#50302b',lane:null,side:'#41251f',sideDepth:.2,elevated:true,guardrailLane:1.1,drive:{...SURFACE_PROFILES.road,material:'house-roof',grip:.91,roll:.018,shake:.6}},
  donut:{id:'donut',detail:'pastry',roadA:'#e58aaa',roadB:'#f2a1bd',curbA:'#fff0c5',curbB:'#b85386',lane:'rgba(255,255,255,.24)',side:'#b76545',sideDepth:.24,elevated:true,guardrailLane:1.08,drive:{...SURFACE_PROFILES.road,material:'donut',grip:.9,roll:.028,shake:.55}}
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
function trackMaterialForCourse(course,distance=0){const sections=course?.surfaceSections;if(!sections?.length)return TRACK_SURFACE_MATERIALS.asphalt;const length=course?.finishDistance||TRACK_LENGTH,phase=((distance%length)+length)%length,section=sections.find(entry=>phase>=entry.start&&phase<entry.end);return TRACK_SURFACE_MATERIALS[section?.material]||TRACK_SURFACE_MATERIALS.asphalt}
function trackMaterialAt(distance=state.distance){return trackMaterialForCourse(activeCourse,distance)}
function surfaceAtLane(lane,distance=state.distance){
  const a=Math.abs(lane),roadSurface=trackMaterialAt(distance).drive||SURFACE_PROFILES.road;
  const route=routeGeometryAt(distance);if(route?.fork>.08){const nearest=Math.min(...Object.values(route.branches).map(path=>Math.abs(lane-path.laneCenter))),edge=route.laneHalf;if(nearest<=edge)return roadSurface;if(nearest<=edge+.18)return SURFACE_PROFILES.shoulder;if(nearest<=edge+.62)return SURFACE_PROFILES.grass;return SURFACE_PROFILES.deep}
  if(a<=.98)return roadSurface;
  if(a<=1.18)return SURFACE_PROFILES.shoulder;
  if(a<=1.72)return SURFACE_PROFILES.grass;
  return SURFACE_PROFILES.deep;
}
function offroadPalette(theme){
  const palette=OFFROAD_PALETTES[state.selectedCourse%OFFROAD_PALETTES.length]||OFFROAD_PALETTES[0];
  return{...palette,shoulderA:palette.shoulderA||theme.vergeA,shoulderB:palette.shoulderB||theme.vergeB};
}

function observeDeliveryAsset(src,phase){return window.NyanDelivery?.observeAsset?.(src,phase)||Promise.resolve('untracked')}
function assignDeliveryImage(image,src,phase='selected-character'){
  if(!image||!src)return;if(image.dataset.deliveryResolved===src&&image.getAttribute('src')||image.dataset.deliveryPending===src)return;image.dataset.deliverySrc=src;image.dataset.deliveryPending=src;const serial=String((Number(image.dataset.deliverySerial)||0)+1);image.dataset.deliverySerial=serial;Promise.resolve(observeDeliveryAsset(src,phase)).finally(()=>{if(image.dataset.deliverySerial!==serial)return;image.src=src;image.dataset.deliveryResolved=src;delete image.dataset.deliveryPending})
}
function loadImage(src,onload){const im=new Image();im.onload=()=>onload?.(im);observeDeliveryAsset(src,'common-ui');im.src=src;return im}
function loadImageAsync(src,onload,attempts=3){
  return new Promise((resolve,reject)=>{
    let attempt=0;
    const retryOrReject=error=>{if(attempt<attempts)setTimeout(load,140*attempt);else reject(error)};
    const load=()=>{attempt++;const image=new Image();image.decoding='async';image.onload=()=>{const decoded=typeof image.decode==='function'?image.decode().catch(()=>{}):Promise.resolve();decoded.then(()=>{try{onload?.(image);resolve(image)}catch(error){retryOrReject(error)}})};image.onerror=()=>retryOrReject(new Error(`Image load failed after ${attempt} attempts: ${src}`));const source=attempt===1?src:`${src}${src.includes('?')?'&':'?'}assetRetry=${attempt}`;Promise.resolve(observeDeliveryAsset(src,window.NyanDelivery?.state?.phase||'selected-course')).finally(()=>image.src=source)};
    load();
  })
}
function ensureSpectatorAssets(){return Promise.all(spectatorSlugs.map((slug,index)=>{if(spectatorFrameSets[index]?.length)return Promise.resolve(spectatorImages[index]);if(spectatorPromises[index])return spectatorPromises[index];spectatorPromises[index]=loadImageAsync(`assets/trackside/spectator-${slug}.webp`,image=>{spectatorImages[index]=image;spectatorFrameSets[index]=sliceSheet(image,7,2,`spectator-${slug}`)}).catch(error=>{spectatorPromises[index]=null;throw error});return spectatorPromises[index]}))}
function ensureCandyAssets(){if(candyAssetPromise)return candyAssetPromise;candyAssetPromise=Promise.all([loadImageAsync('assets/trackside/candy-sign.webp',image=>candySignImage=image),loadImageAsync('assets/trackside/cupcake-tower.webp',image=>cupcakeTowerImage=image),loadImageAsync('assets/trackside/scenery-candy-houses.webp',image=>{candySceneryAtlas=image;candySceneryFrames=sliceSheet(image,3,2,'scenery-candy-houses')}),loadImageAsync('assets/trackside/scenery-forest.webp',image=>{forestSceneryAtlas=image;forestSceneryFrames=sliceSheet(image,3,2,'scenery-forest')})]).catch(error=>{candyAssetPromise=null;throw error});return candyAssetPromise}
function ensureCourseScenery(index){if(index<0||index>=courseScenerySlugs.length)return Promise.resolve(null);if(courseSceneryFrames[index]?.length)return Promise.resolve(courseSceneryAtlases[index]);if(courseSceneryPromises[index])return courseSceneryPromises[index];const slug=courseScenerySlugs[index];courseSceneryPromises[index]=loadImageAsync(`assets/trackside/course-scenery-${slug}-gpt2.webp`,image=>{courseSceneryAtlases[index]=image;courseSceneryFrames[index]=sliceSheet(image,4,3,`course-scenery-${slug}-gpt2`)}).catch(error=>{courseSceneryPromises[index]=null;throw error});return courseSceneryPromises[index]}
function ensureJungleNearScenery(){if(jungleNearFrames.length)return Promise.resolve(jungleNearAtlas);if(jungleNearPromise)return jungleNearPromise;jungleNearPromise=loadImageAsync('assets/trackside/course-scenery-jungle-near-gpt2-v1.webp',image=>{jungleNearAtlas=image;jungleNearFrames=sliceSheet(image,4,3,'course-scenery-jungle-near-gpt2-v1')}).catch(error=>{jungleNearPromise=null;throw error});return jungleNearPromise}
function ensureJungleGimmickAssets(){if(jungleGimmickFrames.length)return Promise.resolve(jungleGimmickAtlas);if(jungleGimmickPromise)return jungleGimmickPromise;jungleGimmickPromise=loadImageAsync('assets/trackside/jungle-dual-gimmicks-gpt2-v1.webp',image=>{jungleGimmickAtlas=image;jungleGimmickFrames=sliceSheet(image,4,2,'jungle-dual-gimmicks-gpt2-v1')}).catch(error=>{jungleGimmickPromise=null;throw error});return jungleGimmickPromise}
function ensureCourseGimmickAssets(){if(courseGimmickFrames.length)return Promise.resolve(courseGimmickAtlas);if(courseGimmickPromise)return courseGimmickPromise;courseGimmickPromise=loadImageAsync('assets/trackside/course-dynamic-gimmicks-gpt2-v1.webp',image=>{courseGimmickAtlas=image;courseGimmickFrames=sliceSheet(image,4,4,'course-dynamic-gimmicks-gpt2-v1')}).catch(error=>{courseGimmickPromise=null;throw error});return courseGimmickPromise}
function ensureTunnelPortalAssets(){if(tunnelPortalFrames.length)return Promise.resolve(tunnelPortalAtlas);if(tunnelPortalPromise)return tunnelPortalPromise;tunnelPortalPromise=loadImageAsync('assets/trackside/course-tunnel-portals-gpt2-v1.webp',image=>{tunnelPortalAtlas=image;tunnelPortalFrames=sliceSheet(image,4,3,'course-tunnel-portals-gpt2-v1')}).catch(error=>{tunnelPortalPromise=null;throw error});return tunnelPortalPromise}
function ensureTunnelInteriorAssets(){if(tunnelInteriorFrames.length)return Promise.resolve(tunnelInteriorAtlas);if(tunnelInteriorPromise)return tunnelInteriorPromise;tunnelInteriorPromise=loadImageAsync('assets/trackside/course-tunnel-interiors-gpt2-v1.webp',image=>{tunnelInteriorAtlas=image;tunnelInteriorFrames=sliceSheet(image,4,3,'course-tunnel-interiors-gpt2-v1')}).catch(error=>{tunnelInteriorPromise=null;throw error});return tunnelInteriorPromise}
function ensureCourseVfxAsset(type){if(!COURSE_VFX_TYPES.includes(type))return Promise.resolve(null);if(courseVfxFrames[type]?.length)return Promise.resolve(courseVfxAtlases[type]);if(courseVfxPromises[type])return courseVfxPromises[type];courseVfxPromises[type]=loadImageAsync(`assets/trackside/course-vfx-${type}-gpt2-v1.webp`,image=>{courseVfxAtlases[type]=image;courseVfxFrames[type]=sliceSheet(image,3,2,`course-vfx-${type}-gpt2-v1`)}).catch(error=>{delete courseVfxPromises[type];throw error});return courseVfxPromises[type]}
function ensureCourseEnvironmentFx(index){const profile=COURSE_AMBIENCE_PROFILES[index]||COURSE_AMBIENCE_PROFILES[0],types=[...new Set(profile.effects.map(effect=>effect.type))];return Promise.all(types.map(ensureCourseVfxAsset))}
function ensureDedicatedNearScenery(index){const slug=DEDICATED_NEAR_SLUGS[index];if(!slug)return Promise.resolve(null);if(dedicatedNearFrames[index]?.length)return Promise.resolve(dedicatedNearAtlases[index]);if(dedicatedNearPromises[index])return dedicatedNearPromises[index];dedicatedNearPromises[index]=loadImageAsync(`assets/trackside/course-scenery-${slug}-near-gpt2-v1.webp`,image=>{dedicatedNearAtlases[index]=image;dedicatedNearFrames[index]=sliceSheet(image,4,3,`course-scenery-${slug}-near-gpt2-v1`)}).catch(error=>{dedicatedNearPromises[index]=null;throw error});return dedicatedNearPromises[index]}
function ensureJumpRampAsset(){if(jumpRampFrames.length)return Promise.resolve(jumpRampAtlas);if(jumpRampPromise)return jumpRampPromise;jumpRampPromise=loadImageAsync('assets/trackside/jump-ramps-angled-gpt2-v2.webp',image=>{jumpRampAtlas=image;jumpRampFrames=sliceSheet(image,JUMP_RAMP_COLS,JUMP_RAMP_ROWS,'jump-ramps-angled-gpt2-v2')}).catch(error=>{jumpRampPromise=null;throw error});return jumpRampPromise}
function ensureCourseProps(theme){if(theme==='sweets')return ensureCandyAssets();if(!coursePropImages[theme])return Promise.resolve([]);if(coursePropPromises[theme])return coursePropPromises[theme];coursePropPromises[theme]=Promise.all(coursePropImages[theme].map((image,index)=>image?Promise.resolve(image):loadImageAsync(`assets/trackside/${theme}-prop-${index}.webp`,loaded=>coursePropImages[theme][index]=loaded))).catch(error=>{delete coursePropPromises[theme];throw error});return coursePropPromises[theme]}
function ensureItemAndFxAssets(){if(itemFrames.length&&catCanFrames.length&&drivingFxFrames.length&&itemFxFrames.length&&weatherDrivingFxFrames.length)return Promise.resolve();if(itemFxAssetPromise)return itemFxAssetPromise;itemFxAssetPromise=Promise.all([loadImageAsync('assets/ui/items.webp',image=>{itemSheet=image;itemFrames=sliceSheet(image,4,2,'items')}),loadImageAsync('assets/ui/cat-can-gears-gpt2-v1.webp',image=>{catCanSheet=image;catCanFrames=sliceCroppedSheet(image,4,3,[{x:55,y:35,w:280,h:275},{x:34,y:24,w:312,h:292},{x:44,y:24,w:300,h:272}]);drawHeldItem()}),loadImageAsync('assets/ui/driving-vfx-animated-gpt2-v1.webp',image=>{drivingFxAnimationSheet=image;drivingFxFrames=sliceSheet(image,FX_ANIM_COLS,FX_ANIM_ROWS,'driving-vfx-animated-gpt2-v1')}),loadImageAsync('assets/ui/item-vfx-animated-gpt2-v1.webp',image=>{itemFxAnimationSheet=image;itemFxFrames=sliceSheet(image,FX_ANIM_COLS,FX_ANIM_ROWS,'item-vfx-animated-gpt2-v1')}),loadImageAsync('assets/ui/weather-driving-vfx-gpt2-v1.webp',image=>{weatherDrivingFxSheet=image;weatherDrivingFxFrames=sliceSheet(image,6,2,'weather-driving-vfx-gpt2-v1')})]).catch(error=>{itemFxAssetPromise=null;throw error});return itemFxAssetPromise}
function ensureCourseEnvironment(index){if(courseImages[index])return Promise.resolve(courseImages[index]);if(courseImagePromises[index])return courseImagePromises[index];const course=courseData[index];if(!course)return Promise.resolve(menuEnvironment);courseImagePromises[index]=loadImageAsync(course.art,image=>{courseImages[index]=image;if(state.selectedCourse===index){environment=image;environmentCrop=course.crop}}).catch(error=>{courseImagePromises[index]=null;throw error});return courseImagePromises[index]}
function setAssetPreloadStatus(stateName,label,progress=0){const status=$('assetPreloadStatus');if(!status)return;status.className=`asset-preload-status ${stateName}`;status.style.setProperty('--preload-progress',`${Math.round(progress*100)}%`);const text=status.querySelector('span');if(text)text.textContent=label}
const COURSE_LOADING_PROFILES=[
  {theme:'sweets',kicker:'SUGAR SPARK PACKAGE',hint:'ドーナツ路面は中央を保ち、分岐前では早めに走るラインを決めよう。'},
  {theme:'steam',kicker:'STEAMWORK PACKAGE',hint:'重いカーブは進入前に減速。歯車トンネルの出口で一気に加速しよう。'},
  {theme:'neon',kicker:'NIGHT DRIVE PACKAGE',hint:'ネオンの案内光は次のカーブ方向。長い直線でブーストを使おう。'},
  {theme:'rain',kicker:'WET WEATHER PACKAGE',hint:'濡れた路面はドリフトが長く滑る。早めに姿勢を戻すと安定する。'},
  {theme:'royal',kicker:'ROYAL TOUR PACKAGE',hint:'屋根とお菓子の道で接地感が変わる。着地後の加速を狙おう。'},
  {theme:'aurora',kicker:'ICE LINE PACKAGE',hint:'雪上はグリップが低い。小さく舵を切って最短ラインをつなごう。'},
  {theme:'jungle',kicker:'EXPEDITION PACKAGE',hint:'石畳・泥・木橋で操作感が変化する。路面表示を見てラインを選ぼう。'},
  {theme:'sakura',kicker:'DRIFT FLOW PACKAGE',hint:'桜吹雪の向こうでも路肩を意識。連続カーブは一定のリズムで抜けよう。'},
  {theme:'coral',kicker:'AQUA WAVE PACKAGE',hint:'起伏の先で道幅が変わる。丘の頂点では中央へ戻しておこう。'},
  {theme:'phantom',kicker:'MIDNIGHT TRICK PACKAGE',hint:'暗いトンネルほど出口の発光マーカーを確認。ギミックの連続に備えよう。'},
  {theme:'lunatic',kicker:'LOW GRAVITY PACKAGE',hint:'ジャンプ中も左右へ少し動ける。着地点を見ながら空中で微調整しよう。'}
];
function constrainedAssetDevice(){
  const memory=navigator.deviceMemory||8,cores=navigator.hardwareConcurrency||8;
  return deliveryProfile().key==='light'||matchMedia('(pointer:coarse)').matches||Math.min(innerWidth,innerHeight)<640||memory<=4||cores<=4||activePerformanceKey()==='light'
}
function raceStarterSpriteIndexes(){
  const selected=state.selected,grid=racers.map((_,index)=>index).filter(index=>index!==selected).slice(0,8),spotlight=pickIntroRivals().map(racer=>racers.indexOf(racer));
  return[...new Set([selected,...grid,...spotlight].filter(index=>index>=0))]
}
async function runPreloadTasks(tasks,onDone,workerLimit=4){
  let cursor=0,aborted=false;const results=Array(tasks.length),workers=Array.from({length:Math.min(workerLimit,tasks.length)},async()=>{
    while(!aborted&&cursor<tasks.length){
      const index=cursor++,task=tasks[index],run=typeof task==='function'?task:task.run;
      try{results[index]=await run();task.done=true}
      catch(error){
        task.done=true;task.error=error instanceof Error?error:new Error(String(error));
        if(task.critical!==false){task.error.assetGroup=task.group||'RACE DATA';aborted=true;throw task.error}
        console.info(`Optional race asset recovered: ${task.group}`,task.error.message)
      }
      onDone?.(task,index)
    }
  });await Promise.all(workers);return results
}
const racePackageStates=new Map();
let racePackagePromise=null,racePackageKey='';
function racePackageSnapshot(pack){const groups=[...new Set(pack.tasks.map(task=>task.group))].map(group=>{const tasks=pack.tasks.filter(task=>task.group===group),done=tasks.filter(task=>task.done).length,recovered=tasks.filter(task=>task.error&&task.critical===false).length;return{group,done,total:tasks.length,recovered,state:done===tasks.length?(recovered?'recovered':'ready'):done?'active':'pending'}});return{key:pack.key,index:pack.index,status:pack.status,progress:pack.progress,label:pack.label,groups,cached:pack.cached,error:pack.error||null,recoveries:pack.recoveries||0,streaming:pack.streaming,workers:pack.workers,deliveryProfile:pack.deliveryProfile,phase:pack.phase||'selected-course'}}
function emitRacePackage(pack){const snapshot=racePackageSnapshot(pack);if(pack.showProgress){const label=pack.status==='ready'?(pack.recoveries?`レース素材の準備完了（${pack.recoveries}件を軽量表示で補完）`:'レース素材の準備ができました'):pack.status==='error'?`${pack.error?.assetGroup||'素材'}の読み込みに失敗しました。再試行できます`:`${pack.label} ${pack.done} / ${pack.tasks.length}`;setAssetPreloadStatus(pack.status,label,pack.progress)}pack.listeners.forEach(listener=>listener(snapshot))}
function buildRacePackageTasks(index){
  const course=courseData[index],delivery=deliveryProfile(),streaming=!delivery.preloadAllRacers&&constrainedAssetDevice(),racerIndexes=delivery.preloadAllRacers?racers.map((_,i)=>i):raceStarterSpriteIndexes(),task=(group,run,critical=false)=>({group,run,critical,done:false,error:null}),tasks=[...racerIndexes.map(i=>task('RACER SET',()=>ensureRacerSprite(i),i===state.selected)),task('COURSE ART',()=>ensureCourseEnvironment(index),true),task('ITEMS & FX',()=>ensureItemAndFxAssets(),true),task('COURSE GIMMICKS',()=>ensureCourseGimmickAssets(),true),task('JUMP RAMPS',()=>ensureJumpRampAsset())];
  if(course?.tunnels?.length){tasks.push(task('TUNNEL',()=>ensureTunnelPortalAssets(),true));tasks.push(task('TUNNEL',()=>ensureTunnelInteriorAssets(),true))}if(course?.short==='EMERALD RUINS')tasks.push(task('GIMMICKS',()=>ensureJungleGimmickAssets(),true));
  if(!delivery.deferEnhancements)tasks.push(...buildRaceEnhancementTasks(index,true));tasks.streaming=streaming;tasks.deliveryProfile=delivery.key;return tasks
}
const raceEnhancementStates=new Map();
function buildRaceEnhancementTasks(index,includeFull=false){const course=courseData[index],profile=deliveryProfile(),task=(group,run)=>({group,run,critical:false,done:false,error:null}),tasks=[task('WEATHER',()=>ensureCourseEnvironmentFx(index)),task('SCENERY',()=>ensureCourseScenery(index)),task('BOSS DATA',()=>ensureMiaSprite())];if(course?.short==='EMERALD RUINS')tasks.push(task('SCENERY',()=>ensureJungleNearScenery()));if(DEDICATED_NEAR_SLUGS[index])tasks.push(task('SCENERY',()=>ensureDedicatedNearScenery(index)));if(includeFull||profile.key!=='light'){if(index<5){const propTheme=course?.propTheme||['sweets','steam','neon','rain','royal'][index]||'sweets';tasks.push(task('TRACK PROPS',()=>ensureCourseProps(propTheme)))}tasks.push(task('CROWD',()=>ensureSpectatorAssets()))}return tasks}
function preloadRaceEnhancements(index){const profile=deliveryProfile();if(!profile.deferEnhancements)return Promise.resolve([]);const key=`${index}:${profile.key}`,existing=raceEnhancementStates.get(key);if(existing)return existing;const tasks=buildRaceEnhancementTasks(index),started=performance.now();window.NyanDelivery?.markPhase?.('race-enhancement');canvas.dataset.deliveryEnhancement='loading';canvas.dataset.deliveryEnhancementTasks=String(tasks.length);const promise=runPreloadTasks(tasks,task=>{canvas.dataset.deliveryEnhancementProgress=`${tasks.filter(entry=>entry.done).length}/${tasks.length}`},Math.max(1,profile.raceWorkers)).then(values=>{canvas.dataset.deliveryEnhancement='ready';canvas.dataset.deliveryEnhancementMs=String(Math.round(performance.now()-started));window.NyanDelivery?.markPhase?.('race-ready');return values}).catch(error=>{canvas.dataset.deliveryEnhancement='fallback';window.NyanDelivery?.markPhase?.('race-ready');console.info('Race enhancement package recovered',error?.message||error);return[]});raceEnhancementStates.set(key,promise);return promise}
function preloadRacePackage(index,showProgress=true,onProgress=null){
  const delivery=deliveryProfile(),packageKey=`${index}:${activePerformanceKey()}:${effectiveRichScenery()}:${delivery.key}`,existing=racePackageStates.get(packageKey);window.NyanDelivery?.markPhase?.('selected-course');if(existing){existing.showProgress=existing.showProgress||showProgress;if(onProgress)existing.listeners.add(onProgress);existing.cached=existing.status==='ready';emitRacePackage(existing);racePackageKey=packageKey;racePackagePromise=existing.promise;return existing.promise}
  const tasks=buildRacePackageTasks(index),streaming=!!tasks.streaming,workers=delivery.raceWorkers,pack={key:packageKey,index,tasks,listeners:new Set(onProgress?[onProgress]:[]),status:'loading',progress:0,label:delivery.key==='light'?'PAGES LIGHTの必須素材を準備中…':streaming?'端末向け分割ロードを開始…':'コースデータを読み込み中…',done:0,cached:false,error:null,recoveries:0,streaming,workers,showProgress,deliveryProfile:delivery.key,phase:'selected-course'};racePackageStates.set(packageKey,pack);racePackageKey=packageKey;if(showProgress)setAssetPreloadStatus('loading',delivery.key==='light'?'必須素材だけを先に読み込み中…':streaming?'端末向けに素材を分割して先読み中…':'レース素材を先読み中…',0);emitRacePackage(pack);
  pack.promise=runPreloadTasks(tasks,task=>{pack.done++;pack.recoveries=tasks.filter(entry=>entry.error&&entry.critical===false).length;pack.progress=pack.done/tasks.length;pack.label=task.error?`${task.group} LIGHT FALLBACK`:`${task.group} READY`;emitRacePackage(pack)},workers).then(values=>{pack.status='ready';pack.progress=1;pack.label=pack.recoveries?'RACE DATA READY · LIGHT FALLBACK':delivery.deferEnhancements?'RACE CORE READY · SCENERY STREAMING':'ALL RACE DATA READY';emitRacePackage(pack);return values}).catch(error=>{pack.status='error';pack.error=error;pack.label='LOAD ERROR';emitRacePackage(pack);racePackageStates.delete(packageKey);if(racePackageKey===packageKey)racePackagePromise=null;throw error});racePackagePromise=pack.promise;return pack.promise
}
function courseLoadingProfile(index){return COURSE_LOADING_PROFILES[index]||COURSE_LOADING_PROFILES[0]}
function renderCourseLoadingProgress(snapshot){
  const overlay=$('courseLoading');if(!overlay||!snapshot)return;const progress=clamp(Number(snapshot.progress)||0,0,1),percent=Math.round(progress*100),delivery=window.NyanDelivery?.snapshot?.();overlay.style.setProperty('--load-progress',`${percent}%`);$('courseLoadingPercent').textContent=`${percent}%`;$('courseLoadingTask').textContent=snapshot.cached&&snapshot.status==='ready'?'キャッシュ済みデータを確認しました':snapshot.label;$('courseLoadingTasks').innerHTML=snapshot.groups.map(group=>`<span class="course-loading-task ${group.state}">${group.group} ${group.done}/${group.total}${group.recovered?` · ${group.recovered} LIGHT`:''}</span>`).join('');overlay.dataset.packageKey=snapshot.key;overlay.dataset.cache=snapshot.cached?'memory-hit':delivery?.hits?'storage-hit':'miss';overlay.dataset.progress=String(percent);overlay.dataset.loadState=snapshot.status;overlay.dataset.assetStreaming=snapshot.streaming?'staged':'full';overlay.dataset.assetWorkers=String(snapshot.workers||0);overlay.dataset.assetRecoveries=String(snapshot.recoveries||0);overlay.dataset.deliveryProfile=snapshot.deliveryProfile||deliveryProfile().key;overlay.dataset.deliveryPhase=snapshot.phase||'selected-course';overlay.dataset.deliveryCacheHits=String(delivery?.hits||0);overlay.dataset.deliveryCacheMisses=String(delivery?.misses||0);overlay.setAttribute('aria-busy',String(snapshot.status==='loading'))
}
function showCourseLoading(index){
  const overlay=$('courseLoading'),course=courseData[index],profile=courseLoadingProfile(index);if(!overlay||!course)return;window.NyanDelivery?.markPhase?.('selected-course');overlay.className=`course-loading theme-${profile.theme}`;overlay.style.setProperty('--load-accent',course.theme?.accent||'#59eaff');overlay.style.setProperty('--load-accent2',course.theme?.lightA||'#ff58bb');overlay.style.setProperty('--load-progress','0%');overlay.dataset.theme=profile.theme;overlay.dataset.loadingModel='q045-progressive-course-package-v1';overlay.dataset.deliveryProfile=deliveryProfile().key;assignDeliveryImage($('courseLoadingArt'),course.art,'selected-course');$('courseLoadingArt').alt=`${course.name}のコースイメージ`;$('courseLoadingKicker').textContent=`${profile.kicker} · ${String(index+1).padStart(2,'0')}`;$('courseLoadingName').textContent=course.short;$('courseLoadingStyle').textContent=`${course.style} · ${course.difficulty}`;$('courseLoadingHint').textContent=profile.hint;$('courseLoadingPercent').textContent='0%';$('courseLoadingTask').textContent='コースデータを確認中…';$('courseLoadingTasks').replaceChildren();$('courseLoadingRetry').classList.add('hidden');overlay.setAttribute('aria-busy','true')
}
async function completeCourseLoading(){const overlay=$('courseLoading');if(!overlay)return;overlay.classList.remove('error');overlay.classList.add('ready');overlay.setAttribute('aria-busy','false');playSfx('loadReady',{intensity:.78});await sleep(matchMedia('(prefers-reduced-motion: reduce)').matches?90:480);overlay.className='course-loading hidden'}
function failCourseLoading(error=null){const overlay=$('courseLoading');if(!overlay)return;const group=error?.assetGroup;overlay.classList.add('error');overlay.classList.remove('ready');overlay.setAttribute('aria-busy','false');overlay.dataset.failedGroup=group||'unknown';$('courseLoadingTask').textContent=group?`${group}を読み込めませんでした。失敗状態を破棄したので再試行できます。`:'素材を読み込めませんでした。失敗状態を破棄したので再試行できます。';$('courseLoadingRetry').classList.remove('hidden')}
function syncMusicButton(){const button=$('musicToggle');if(!button)return;const paused=!raceBgm||raceBgm.paused,silent=paused||settings.muted,title=canvas.dataset.bgmTitle;button.classList.toggle('muted',silent);button.textContent=silent?'♪':'♫';button.setAttribute('aria-label',title?`BGM「${title}」を${paused?'再生':'停止'}`:paused?'BGMを再生':'BGMを停止')}
function playRaceMusic(){stopCourseMusicPreview();if(raceBgm)raceBgm.pause();const courseKey=courseScenerySlugs[state.selectedCourse],override=courseRaceMusicFiles[courseKey],source=override||defaultRaceMusicFiles[raceMusicIndex++%defaultRaceMusicFiles.length];raceBgm=raceMusicByFile.get(source)||raceMusic[0];if(raceBgm.dataset.loadedSource!==source){raceBgm.src=source;raceBgm.dataset.loadedSource=source;observeDeliveryAsset(source,'selected-course')}raceBgm.currentTime=0;musicError='';canvas.dataset.bgmCourse=courseKey||'debug';canvas.dataset.bgmTrack=source.split('/').pop();canvas.dataset.bgmTitle=courseRaceMusicTitles[courseKey]||defaultRaceMusicTitles[source]||source.split('/').pop().replace(/\.[^.]+$/,'');canvas.dataset.bgmMode=override?'course-exclusive':'grand-prix-rotation';const playing=raceBgm.play();syncMusicButton();playing?.then(syncMusicButton).catch(error=>{musicError=error?.name||'play-failed';syncMusicButton()})}
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
    const mode=soundTestMode();window.NyanAudio?.updateEngine({speed:mode.speed,accelerating:mode.accelerating,braking:false,drifting:false,steer:0,boosting:mode.boosting,turbo:mode.turbo,surface:'road',weatherSurface:'dry',weatherSlip:0,surfacePan:0,enginePan:0,airborne:false,running:true,paused:false});window.NyanAudio?.updateRivals([],{running:false});window.NyanAudio?.updateBiomeAmbience({course:'sweets',zone:'sound-test',running:false});window.NyanAudio?.setTunnel(false);updateSoundTestMeter();return;
  }
  const racer=racers[state.selected];if(!racer){window.NyanAudio?.updateBiomeAmbience({course:'sweets',zone:'none',running:false});window.NyanAudio?.setTunnel(false);return}const running=state.mode==='race'&&state.running&&!state.finish,paused=state.paused||miaNpc.cutInActive,rivals=running&&!paused?nearbyRivalAudioPayload():[],tunnelMix=running&&!paused?audioTunnelMix(state.distance):0,surfacePan=clamp(state.steer*.3+state.weatherSlip*2.15,-.82,.82),enginePan=clamp(state.steer*.1+state.centrifugal*.08,-.22,.22),zoneState=updateBiomeZoneTransition(0),zones=biomeVolumeZones(state.selectedCourse),zoneIndex=Math.max(0,zones.findIndex(zone=>zone.id===zoneState.zone.id)),courseKey=courseScenerySlugs[state.selectedCourse]||'sweets';window.NyanAudio?.updateEngine({speed:state.speed,accelerating:actionDown('accelerate')||Boolean(activeCourse?.autoDrive),braking:actionDown('brake'),drifting:state.drift>0,steer:state.steer,boosting:state.boosting,turbo:state.turbo,surface:state.surface,weatherSurface:state.weatherSurface,weatherSlip:state.weatherSlip,surfacePan,enginePan,trackMaterial:state.trackMaterial,airborne:state.airborne,running,paused});window.NyanAudio?.updateRivals(rivals,{running,paused});window.NyanAudio?.setTunnel(tunnelMix>0,tunnelMix);window.NyanAudio?.updateBiomeAmbience({course:courseKey,zone:zoneState.zone.id,zoneIndex,running,paused,tunnelMix});const acoustics=window.NyanAudio?.getAcousticsDebug?.()||{},biomeAudio=acoustics.biomeAmbience||window.NyanAudio?.getBiomeAmbienceDebug?.()||{};canvas.dataset.rivalAudioCount=String(rivals.length);canvas.dataset.rivalAudio=rivals.map(rival=>rival.slug).join(',');canvas.dataset.rivalAudioPan=rivals.map(rival=>rival.pan.toFixed(2)).join(',');canvas.dataset.rivalAudioRelativeSpeed=rivals.map(rival=>rival.relativeSpeed.toFixed(1)).join(',');canvas.dataset.audioTunnel=tunnelMix>0?'inside':'outside';canvas.dataset.audioTunnelMix=tunnelMix.toFixed(2);canvas.dataset.surfaceAudio=acoustics.surfaceAudio||'dry';canvas.dataset.surfaceAudioLevel=Number(acoustics.surfaceAudioLevel||0).toFixed(3);canvas.dataset.surfaceAudioPan=Number(acoustics.surfacePan??surfacePan).toFixed(3);canvas.dataset.engineAudioPan=Number(acoustics.enginePan??enginePan).toFixed(3);canvas.dataset.signatureAudioCue=acoustics.lastPlayerSignatureCue||'none';canvas.dataset.signatureAudioCount=String(acoustics.playerSignatureCueCount||0);canvas.dataset.signatureWorldAudioCue=acoustics.lastSignatureCue||'none';canvas.dataset.biomeAudioModel=biomeAudio.model||'dual-bus-zone-crossfade-v1';canvas.dataset.biomeAudioCourse=biomeAudio.course||courseKey;canvas.dataset.biomeAudioZone=biomeAudio.zone||zoneState.zone.id;canvas.dataset.biomeAudioLabel=biomeAudio.label||'none';canvas.dataset.biomeAudioMix=Number(biomeAudio.mix||0).toFixed(3)
}
function ensureRacerSprite(index){
  const racer=racers[index];if(!racer)return Promise.reject(new Error(`Unknown racer sprite index: ${index}`));const costume=activeCostume(racer),costumeId=costume.id;if(racer.frames&&racer.loadedCostume===costumeId)return Promise.resolve(racer.frames);if(racer.spritePromise&&racer.loadingCostume===costumeId)return racer.spritePromise;
  racer.frames=null;racer.spritePromise=null;racer.loadingCostume=costumeId;const source=costume.sprite||`assets/sprites/${racer.slug}.webp`,boundsKey=costumeId==='standard'?racer.slug:`${racer.slug}-${costumeId}`;
  racer.spritePromise=loadImageAsync(source,im=>{spriteImages[index]=im;racer.frames=remapRacerFrames(racer.slug,sliceSheet(im,7,2,boundsKey),costumeId);racer.loadedCostume=costumeId}).then(()=>racer.frames).catch(error=>{racer.spritePromise=null;racer.loadingCostume=null;throw error});
  return racer.spritePromise;
}
function ensureMiaSprite(){
  if(miaNpc.frames&&miaNpc.throwFrames)return Promise.resolve(miaNpc.frames);if(miaNpc.spritePromise)return miaNpc.spritePromise;
  miaNpc.spritePromise=Promise.all([loadImageAsync('assets/sprites/mia-charme.webp',im=>miaNpc.frames=sliceSheet(im,7,2,miaNpc.slug)),loadImageAsync('assets/sprites/mia-throw-gpt2-v1.webp',im=>miaNpc.throwFrames=sliceCroppedSheet(im,2,2,[{x:110,y:35,w:370,h:425},{x:110,y:35,w:370,h:425}]))]).then(()=>miaNpc.frames).catch(error=>{miaNpc.spritePromise=null;throw error});
  return miaNpc.spritePromise;
}
function ensureContestantSprite(racer){if(racer===miaNpc)return ensureMiaSprite();const index=racers.indexOf(racer);return index>=0?ensureRacerSprite(index):Promise.reject(new Error('Unknown race contestant'))}
function ensureAllSprites(){return Promise.all([...racers.map((_,i)=>ensureRacerSprite(i)),ensureMiaSprite()])}
const racerSpriteLoadQueue=[];
let racerSpriteLoadsActive=0;
function pumpRacerSpriteQueue(){
  const limit=constrainedAssetDevice()?1:2;
  while(racerSpriteLoadsActive<limit&&racerSpriteLoadQueue.length){
    const job=racerSpriteLoadQueue.shift(),racer=racers[job.index];racerSpriteLoadsActive++;
    ensureRacerSprite(job.index).then(job.resolve).catch(error=>{if(racer)racer.spriteRetryAt=performance.now()+2400;job.reject(error)}).finally(()=>{racerSpriteLoadsActive--;if(racer)racer.queuedSpritePromise=null;pumpRacerSpriteQueue()})
  }
}
function queueRacerSprite(index){
  const racer=racers[index];if(!racer)return Promise.reject(new Error(`Unknown queued racer sprite index: ${index}`));if(racer.frames)return Promise.resolve(racer.frames);if(racer.spritePromise)return racer.spritePromise;if(racer.queuedSpritePromise)return racer.queuedSpritePromise;if((racer.spriteRetryAt||0)>performance.now())return Promise.resolve(null);
  racer.queuedSpritePromise=new Promise((resolve,reject)=>{racerSpriteLoadQueue.push({index,resolve,reject});pumpRacerSpriteQueue()});return racer.queuedSpritePromise
}

const RACER_FRAME_REMAPS={
  // Kurone's 15-degree cells were visually reversed compared with the shared
  // cat kart layout. Remap at load time so the source sheet can stay intact.
  'kurone-night':[0,1,4,3,2,5,6,7,8,11,10,9,12,13]
};
function remapRacerFrames(slug,frames,costumeId='standard'){const map=costumeId==='standard'?RACER_FRAME_REMAPS[slug]:null;return map?map.map(index=>frames[index]||frames[0]):frames}

// Q-048: measured transparent padding at the bottom of every scenery cell.
// Using the real alpha edge instead of a single guessed offset keeps props
// planted on the projected terrain even when atlases use different margins.
const SCENERY_CELL_GROUND_PADS=Object.freeze({
  'course-scenery-sweets-gpt2':Object.freeze([.1693,.1927,.1615,.1927,.0703,.1406,.1615,.1849,.0625,.2161,.2708,.1276]),
  'course-scenery-steam-gpt2':Object.freeze([.0625,.0938,.1354,.0911,.1016,.099,.0625,.1979,.0625,.1406,.2135,.0625]),
  'course-scenery-neon-gpt2':Object.freeze([.0964,.1094,.1615,.0911,.0625,.0625,.2135,.0625,.1875,.1797,.1615,.0625]),
  'course-scenery-rain-gpt2':Object.freeze([.1146,.1615,.1302,.138,.0703,.0625,.1667,.0625,.1667,.0859,.0625,.099]),
  'course-scenery-royal-gpt2':Object.freeze([.1224,.099,.1901,.2135,.1276,.0625,.2109,.0625,.0729,.1771,.1198,.0677]),
  'course-scenery-aurora-gpt2':Object.freeze([.0938,.1094,.1302,.1172,.151,.1094,.1901,.0625,.0625,.1797,.0625,.0625]),
  'course-scenery-jungle-gpt2':Object.freeze([.1354,.1042,.1172,.138,.1146,.0911,.1328,.0885,.0625,.1667,.0964,.0911]),
  'course-scenery-sakura-gpt2':Object.freeze([.151,.1562,.1615,.1875,.1198,.1094,.1302,.0859,.0625,.0625,.1432,.1172]),
  'course-scenery-coral-gpt2':Object.freeze([.1224,.1068,.1536,.0625,.1406,.1042,.1406,.0625,.0625,.1797,.0625,.0625]),
  'course-scenery-phantom-gpt2':Object.freeze([.1458,.1328,.1667,.1901,.0625,.1302,.1875,.0625,.099,.2318,.2161,.125]),
  'course-scenery-lunatic-gpt2':Object.freeze([.138,.1432,.1536,.1354,.1667,.1745,.1094,.1406,.1536,.2344,.1042,.1484]),
  'course-scenery-aurora-near-gpt2-v1':Object.freeze([.0028,0,0,0,.0939,.0635,.0856,.0801,.1354,.1354,.1381,.1685]),
  'course-scenery-jungle-near-gpt2-v1':Object.freeze([0,0,.0147,.0029,.088,.0499,.0645,0,.1496,.1378,.1378,.1378]),
  'course-scenery-sakura-near-gpt2-v1':Object.freeze([.0276,.0276,.0055,0,0,.1492,0,.1077,.2155,.2486,.2044,.2017]),
  'course-scenery-coral-near-gpt2-v1':Object.freeze([0,0,0,0,.0552,0,0,.0718,.1685,.174,.1685,.174]),
  'course-scenery-phantom-near-gpt2-v1':Object.freeze([.047,.0276,.0055,.0442,.1243,0,0,0,.2155,.1657,.1519,.1657]),
  'course-scenery-lunatic-near-gpt2-v1':Object.freeze([.0304,.0055,.0138,0,.1436,.1326,0,.1215,.2072,.1878,.163,.163]),
  'scenery-candy-houses':Object.freeze([0,.0449,0,.0977,.0938,.084]),
  'scenery-forest':Object.freeze([.0742,.0645,.0645,.1973,.1934,.1953]),
  'spectator-blond-cookie':Object.freeze([.0371,.0371,.0415,.0415,.0415,.0393,.0371,.107,.107,.107,.1048,.107,.1004,.107]),
  'spectator-cyan-cat':Object.freeze([.0633,.0591,.0612,.0591,.0591,.0591,.0633,.1329,.1287,.1287,.1287,.1287,.1287,.1287]),
  'spectator-pink-human':Object.freeze([0,0,0,0,0,0,0,.1445,.1406,.1406,.1484,.1523,.1445,.1445]),
  'spectator-purple-witch':Object.freeze([.055,.055,.0465,.0444,.0444,.0444,.0423,.1311,.1247,.1247,.1226,.1226,.1226,.1247]),
  'spectator-teal-glasses':Object.freeze([.0744,.0721,.0721,.0721,.0744,.0721,.0721,.1,.1023,.1,.0953,.0977,.0977,.0977])
});

function sliceSheet(image,cols,rows,key){
  const groundPads=SCENERY_CELL_GROUND_PADS[key],bounds=window.SPRITE_BOUNDS?.[key];if(bounds)return bounds.map((b,index)=>({image,sx:b[0],sy:b[1],sw:b[2],sh:b[3],sheetKey:key,frameIndex:index,groundPad:groundPads?.[index]??0,scenery:!!groundPads}));
  const frames=[],sw=image.naturalWidth/cols,sh=image.naturalHeight/rows;
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const index=row*cols+col;frames.push({image,sx:col*sw,sy:row*sh,sw,sh,sheetKey:key,frameIndex:index,groundPad:groundPads?.[index]??0,scenery:!!groundPads})}
  return frames;
}
function sliceCroppedSheet(image,cols,rows,rowCrops){
  const frames=[],cellW=image.naturalWidth/cols,cellH=image.naturalHeight/rows;
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
    const crop=rowCrops[row]||{x:0,y:0,w:cellW,h:cellH};frames.push({image,sx:col*cellW+crop.x,sy:row*cellH+crop.y,sw:crop.w,sh:crop.h});
  }
  return frames
}

const RESPONSIVE_LAYOUT_CONTRACT=Object.freeze({
  model:'q046-responsive-contract-v1',minControlPx:30,overflowTolerancePx:2,
  screens:Object.freeze(['menu','kart','wardrobe','course','difficulty','settings','race','finish']),
  viewports:Object.freeze([
    Object.freeze({name:'desktop-fhd',width:1920,height:1080}),Object.freeze({name:'desktop',width:1440,height:900}),Object.freeze({name:'desktop-hd',width:1280,height:720}),Object.freeze({name:'laptop',width:1366,height:768}),
    Object.freeze({name:'tablet-landscape',width:1180,height:820}),Object.freeze({name:'tablet-compact',width:1024,height:768}),Object.freeze({name:'tablet-portrait',width:820,height:1180}),Object.freeze({name:'tablet-portrait-compact',width:768,height:1024}),
    Object.freeze({name:'phone-landscape-wide',width:932,height:430}),Object.freeze({name:'phone-landscape',width:844,height:390}),Object.freeze({name:'phone-portrait-wide',width:430,height:932}),Object.freeze({name:'phone-portrait',width:390,height:844})
  ])
});
function updateResponsiveLayoutContract(){
  const viewport=window.visualViewport,width=Math.round(viewport?.width||innerWidth),height=Math.round(viewport?.height||innerHeight),orientation=width>=height?'landscape':'portrait',device=width<600?'phone':width<1024?'tablet':'desktop',short=height<560;
  const root=document.documentElement;root.style.setProperty('--app-height',`${height}px`);root.style.setProperty('--app-width',`${width}px`);root.dataset.responsiveContract=RESPONSIVE_LAYOUT_CONTRACT.model;root.dataset.viewportDevice=device;root.dataset.viewportOrientation=orientation;root.dataset.viewportShort=String(short);root.dataset.viewportSize=`${width}x${height}`;const activeScreen=document.querySelector('.screen.active');if(activeScreen)activeScreen.dataset.layoutContract=RESPONSIVE_LAYOUT_CONTRACT.model;
  canvas.dataset.responsiveContract=RESPONSIVE_LAYOUT_CONTRACT.model;canvas.dataset.responsiveViewport=`${device}-${orientation}${short?'-short':''}`
}
window.NyanResponsiveContract=RESPONSIVE_LAYOUT_CONTRACT;
function resize(){updateResponsiveLayoutContract();const width=Math.round(window.visualViewport?.width||innerWidth),height=Math.round(window.visualViewport?.height||innerHeight),d=Math.min(devicePixelRatio||1,2),quality=performanceProfile().renderScale,pixel=d*quality;canvas.width=Math.max(1,Math.round(width*pixel));canvas.height=Math.max(1,Math.round(height*pixel));canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(pixel,0,0,pixel,0,0);canvas.dataset.renderScale=quality.toFixed(2)}
addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);window.visualViewport?.addEventListener('scroll',updateResponsiveLayoutContract);resize();

const SET_STAT_LABELS=[['speed','SPEED'],['accel','ACCEL'],['handling','HANDLING'],['boost','BOOST'],['technique','TECHNIQUE']];
const COSTUME_CATALOG=Object.freeze({
  'aruka-sham':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'プリズム・ロイヤルと調和する、アルカのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/aruka-sham.webp',sprite:'assets/sprites/aruka-sham.webp',source:'ORIGINAL'}),
    Object.freeze({id:'cup-champion',name:'CUP CHAMPION',kicker:'3 COURSE CUP REWARD',description:'白とネイビーを基調に、チェッカーフラッグと優勝杯をあしらったカップ制覇記念レーシングウェア。性能は通常衣装と同じです。',unlockLabel:'アルカで3 COURSE CUPを完走',select:'assets/costumes/aruka-sham/cup-champion/select.webp',sprite:'assets/costumes/aruka-sham/cup-champion/sprite.webp',source:'GPT IMAGE 2.0',unlock:'cup-clear'})
  ]),
  'kurone-night':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'月影のマシンに合わせた、クロネのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/kurone-night.webp',sprite:'assets/sprites/kurone-night.webp',source:'ORIGINAL'}),
    Object.freeze({id:'moonlight-ace',name:'MOONLIGHT ACE',kicker:'LUNAR RACING COLLECTION',description:'銀、ミッドナイトネイビー、紫を重ねた月光仕様。三日月のケープレットが夜のコースで輝きます。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/kurone-night/moonlight-ace/select.webp',sprite:'assets/costumes/kurone-night/moonlight-ace/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'kohaku-taiga':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'タイガーマシンを乗りこなす、コハクのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/kohaku-taiga.webp',sprite:'assets/sprites/kohaku-taiga.webp',source:'ORIGINAL'}),
    Object.freeze({id:'sunset-rally',name:'SUNSET RALLY',kicker:'OFFROAD CHAMPION COLLECTION',description:'クリームホワイトと夕焼けオレンジのラリー仕様。虎柄の袖とチェッカースカーフで荒野を駆けます。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/kohaku-taiga/sunset-rally/select.webp',sprite:'assets/costumes/kohaku-taiga/sunset-rally/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'ghost-rex':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'幽霊船カートと調和する、ゴースのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/ghost-rex.webp',sprite:'assets/sprites/ghost-rex.webp',source:'ORIGINAL'}),
    Object.freeze({id:'phantom-gala',name:'PHANTOM GALA',kicker:'MIDNIGHT CARNIVAL COLLECTION',description:'深い紫とアンティークシルバーをまとった夜会仕様。仮面のブローチと端正なレーシングコートが特徴です。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/ghost-rex/phantom-gala/select.webp',sprite:'assets/costumes/ghost-rex/phantom-gala/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'nerine-korat':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'クラゲカートと調和する、ネリネのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/nerine-korat.webp',sprite:'assets/sprites/nerine-korat.webp',source:'ORIGINAL'}),
    Object.freeze({id:'aqua-parade',name:'AQUA PARADE',kicker:'CORAL OCEAN COLLECTION',description:'真珠色とアクアブルーに珊瑚色を差した海のパレード仕様。小さなフィン飾りが水上コースで映えます。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/nerine-korat/aqua-parade/select.webp',sprite:'assets/costumes/nerine-korat/aqua-parade/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'fumika-scotty':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'エアメール・カートと調和する、フミカのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/fumika-scotty.webp',sprite:'assets/sprites/fumika-scotty.webp',source:'ORIGINAL'}),
    Object.freeze({id:'sunrise-airmail',name:'SUNRISE AIRMAIL',kicker:'SKY COURIER COLLECTION',description:'アイボリーとコーラルにネイビーを重ねた、朝焼けの航空便仕様。翼形フェアリングと郵便章がジャンプ中に映えます。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/fumika-scotty/sunrise-airmail/select.webp',sprite:'assets/costumes/fumika-scotty/sunrise-airmail/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'bell-savanna':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'サバンナマシンに合わせた、ベルのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/bell-savanna.webp',sprite:'assets/sprites/bell-savanna.webp',source:'ORIGINAL'}),
    Object.freeze({id:'sunset-huntress',name:'SUNSET HUNTRESS',kicker:'SAVANNA CHAMPION COLLECTION',description:'深紅と黒、金の装甲をまとった夕陽のハントレス仕様。力強い猫科フェイスのカートで直線を制します。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/bell-savanna/sunset-huntress/select.webp',sprite:'assets/costumes/bell-savanna/sunset-huntress/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'popo-munch':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'ぜんまいマウスカートと調和する、ポポのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/popo-munch.webp',sprite:'assets/sprites/popo-munch.webp',source:'ORIGINAL'}),
    Object.freeze({id:'berry-clockwork',name:'BERRY CLOCKWORK',kicker:'SWEET GEAR COLLECTION',description:'ラズベリーとクリームに真鍮の歯車を添えた、甘い時計仕掛け仕様。大きなぜんまいが再加速の瞬間を飾ります。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/popo-munch/berry-clockwork/select.webp',sprite:'assets/costumes/popo-munch/berry-clockwork/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'marron-maine':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'重厚な列車カートに合わせた、マロンのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/marron-maine.webp',sprite:'assets/sprites/marron-maine.webp',source:'ORIGINAL'}),
    Object.freeze({id:'winter-express',name:'WINTER EXPRESS',kicker:'ROYAL RAIL COLLECTION',description:'ネイビーと白、バーガンディを金縁で引き締めた冬の車掌仕様。機関車型カートの威厳をさらに高めます。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/marron-maine/winter-express/select.webp',sprite:'assets/costumes/marron-maine/winter-express/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'milfi-ragdoll':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'ティーカップカートと調和する、ミルフィのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/milfi-ragdoll.webp',sprite:'assets/sprites/milfi-ragdoll.webp',source:'ORIGINAL'}),
    Object.freeze({id:'rose-tea-party',name:'ROSE TEA PARTY',kicker:'ROYAL TEA COLLECTION',description:'ローズピンクとクリームを金細工で包んだ、華やかなティーパーティー仕様。リボンと猫足ティーカップが優雅にきらめきます。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/milfi-ragdoll/rose-tea-party/select.webp',sprite:'assets/costumes/milfi-ragdoll/rose-tea-party/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'yukine-silky':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'氷晶カートに合わせた、ユキネのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/yukine-silky.webp',sprite:'assets/sprites/yukine-silky.webp',source:'ORIGINAL'}),
    Object.freeze({id:'aurora-nocturne',name:'AURORA NOCTURNE',kicker:'CRYSTAL NIGHT COLLECTION',description:'漆黒とネイビーへシアンと紫のオーロラを重ねた夜氷仕様。銀の雪結晶と光るランナーが雪原を照らします。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/yukine-silky/aurora-nocturne/select.webp',sprite:'assets/costumes/yukine-silky/aurora-nocturne/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'rhythm-sphynx':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'DJターンテーブルカートに合わせた、リズムのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/rhythm-sphynx.webp',sprite:'assets/sprites/rhythm-sphynx.webp',source:'ORIGINAL'}),
    Object.freeze({id:'pulse-idol',name:'PULSE IDOL',kicker:'CYBER STAGE COLLECTION',description:'パールホワイトにホットピンクとシアンを走らせた、未来のステージ衣装。ホログラム調のイコライザーがドリフトのビートを彩ります。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/rhythm-sphynx/pulse-idol/select.webp',sprite:'assets/costumes/rhythm-sphynx/pulse-idol/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'tick-abyssinian':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'精密な時計仕掛けカートに合わせた、ティックのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/tick-abyssinian.webp',sprite:'assets/sprites/tick-abyssinian.webp',source:'ORIGINAL'}),
    Object.freeze({id:'ivory-chronomancer',name:'IVORY CHRONOMANCER',kicker:'TIMEKEEPER COLLECTION',description:'アイボリーと深いティールをアンティークゴールドで結んだ時の術師仕様。淡い時計光が精密機関を浮かび上がらせます。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/tick-abyssinian/ivory-chronomancer/select.webp',sprite:'assets/costumes/tick-abyssinian/ivory-chronomancer/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'flora-turkishvan':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'花咲くレディバードカートと調和する、フローラのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/flora-turkishvan.webp',sprite:'assets/sprites/flora-turkishvan.webp',source:'ORIGINAL'}),
    Object.freeze({id:'moonlit-botanica',name:'MOONLIT BOTANICA',kicker:'MOON GARDEN COLLECTION',description:'深いエメラルドと夜藍に銀の蔓と月花をあしらった、夜の植物園仕様。紫に光るムーンビートルが花道を駆けます。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/flora-turkishvan/moonlit-botanica/select.webp',sprite:'assets/costumes/flora-turkishvan/moonlit-botanica/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'reska-americancurl':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'レスキュージープに合わせた、レスカのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/reska-americancurl.webp',sprite:'assets/sprites/reska-americancurl.webp',source:'ORIGINAL'}),
    Object.freeze({id:'arctic-rescue',name:'ARCTIC RESCUE',kicker:'SNOW RESCUE COLLECTION',description:'白と氷河ブルーにコーラルの警戒色を添えた極地救助仕様。凍結路を照らすシアンランプと防寒装備で仲間を救います。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/reska-americancurl/arctic-rescue/select.webp',sprite:'assets/costumes/reska-americancurl/arctic-rescue/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'cleo-mau':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'スカラベ・ドリルカートに合わせた、クレオのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/cleo-mau.webp',sprite:'assets/sprites/cleo-mau.webp',source:'ORIGINAL'}),
    Object.freeze({id:'azure-sun-empress',name:'AZURE SUN EMPRESS',kicker:'SOLAR TEMPLE COLLECTION',description:'象牙色へラピスとターコイズを重ねた太陽女帝仕様。黄金の翼とスカラベ装飾がドリルの突進を鮮やかに飾ります。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/cleo-mau/azure-sun-empress/select.webp',sprite:'assets/costumes/cleo-mau/azure-sun-empress/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'ciel-norwegian':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'気象観測カートに合わせた、シエルのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/ciel-norwegian.webp',sprite:'assets/sprites/ciel-norwegian.webp',source:'ORIGINAL'}),
    Object.freeze({id:'storm-navigator',name:'STORM NAVIGATOR',kicker:'WEATHER COMMAND COLLECTION',description:'ミッドナイトネイビーとコバルトに銀の航路を描いた嵐のナビゲーター仕様。青い気象灯とコンパス装飾が進路を示します。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/ciel-norwegian/storm-navigator/select.webp',sprite:'assets/costumes/ciel-norwegian/storm-navigator/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'sucre-persian':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'スイーツオーブンカートに合わせた、シュクレのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/sucre-persian.webp',sprite:'assets/sprites/sucre-persian.webp',source:'ORIGINAL'}),
    Object.freeze({id:'midnight-patissier',name:'MIDNIGHT PATISSIER',kicker:'NOCTURNE SWEETS COLLECTION',description:'黒カカオとバーガンディにミントとローズゴールドを添えた夜のパティシエ仕様。月夜のオーブンから甘い加速を焼き上げます。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/sucre-persian/midnight-patissier/select.webp',sprite:'assets/costumes/sucre-persian/midnight-patissier/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'moka-oriental':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'捜査ライトカートに合わせた、モカのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/moka-oriental.webp',sprite:'assets/sprites/moka-oriental.webp',source:'ORIGINAL'}),
    Object.freeze({id:'aqua-forensic',name:'AQUA FORENSIC',kicker:'DETECTIVE LAB COLLECTION',description:'アイボリーとネイビーをアクアの分析光で結んだ科学捜査仕様。銀の探照灯でライバルの走行ラインを見抜きます。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/moka-oriental/aqua-forensic/select.webp',sprite:'assets/costumes/moka-oriental/aqua-forensic/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'garnet-bengal':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'重装クローラーに合わせた、ガーネットのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/garnet-bengal.webp',sprite:'assets/sprites/garnet-bengal.webp',source:'ORIGINAL'}),
    Object.freeze({id:'white-tiger-siege',name:'WHITE TIGER SIEGE',kicker:'FROST ARMOR COLLECTION',description:'真珠白と霜色の装甲へ氷青の機関と深紅の爪痕を刻んだ白虎攻城仕様。重い履帯で競り合いの道を切り開きます。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/garnet-bengal/white-tiger-siege/select.webp',sprite:'assets/costumes/garnet-bengal/white-tiger-siege/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'rinka-somali':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'雲と時計のカートに合わせた、リンカのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/rinka-somali.webp',sprite:'assets/sprites/rinka-somali.webp',source:'ORIGINAL'}),
    Object.freeze({id:'sky-festival',name:'SKY FESTIVAL',kicker:'CELESTIAL PARADE COLLECTION',description:'ターコイズと真珠白に珊瑚色のリボンと金の星を散りばめた空祭り仕様。雲をまとった時計盤が晴天のラインを刻みます。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/rinka-somali/sky-festival/select.webp',sprite:'assets/costumes/rinka-somali/sky-festival/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'stella-russianblue':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'星晶カートに合わせた、ステラのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/stella-russianblue.webp',sprite:'assets/sprites/stella-russianblue.webp',source:'ORIGINAL'}),
    Object.freeze({id:'rose-quartz-nova',name:'ROSE QUARTZ NOVA',kicker:'CRYSTAL BLOOM COLLECTION',description:'パールブラッシュと白をローズゴールドで縁取り、紅紫の結晶を咲かせた星晶仕様。ローズクォーツの輝きが加速を彩ります。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/stella-russianblue/rose-quartz-nova/select.webp',sprite:'assets/costumes/stella-russianblue/rose-quartz-nova/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'honey-british':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'ハニカム探検カートに合わせた、ハニーのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/honey-british.webp',sprite:'assets/sprites/honey-british.webp',source:'ORIGINAL'}),
    Object.freeze({id:'lavender-hive-royal',name:'LAVENDER HIVE ROYAL',kicker:'ROYAL APIARY COLLECTION',description:'アイボリーとラベンダーへローズゴールドの蜂の巣細工を施した王立養蜂仕様。琥珀色の灯りが甘いラインを照らします。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/honey-british/lavender-hive-royal/select.webp',sprite:'assets/costumes/honey-british/lavender-hive-royal/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'liber-birman':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'星城カートに合わせた、リベルのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/liber-birman.webp',sprite:'assets/sprites/liber-birman.webp',source:'ORIGINAL'}),
    Object.freeze({id:'dawn-celestial',name:'DAWN CELESTIAL',kicker:'SUNRISE KINGDOM COLLECTION',description:'真珠白と淡いアクアをローズゴールドで結んだ天空の朝焼け仕様。星城の窓へ桃色の雲と金の光を映します。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/liber-birman/dawn-celestial/select.webp',sprite:'assets/costumes/liber-birman/dawn-celestial/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'masuka-chartreux':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'葡萄葉カートに合わせた、マスカのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/masuka-chartreux.webp',sprite:'assets/sprites/masuka-chartreux.webp',source:'ORIGINAL'}),
    Object.freeze({id:'crimson-vine-royal',name:'CRIMSON VINE ROYAL',kicker:'ROYAL VINEYARD COLLECTION',description:'深いバーガンディと象牙色へエメラルドの蔓と古金を重ねた王立葡萄園仕様。ルビー色の葡萄ホイールが秋の道を彩ります。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/masuka-chartreux/crimson-vine-royal/select.webp',sprite:'assets/costumes/masuka-chartreux/crimson-vine-royal/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'soyi-tonkinese':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'絹糸機関カートに合わせた、ソイのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/soyi-tonkinese.webp',sprite:'assets/sprites/soyi-tonkinese.webp',source:'ORIGINAL'}),
    Object.freeze({id:'snow-silk-couture',name:'SNOW SILK COUTURE',kicker:'WINTER ATELIER COLLECTION',description:'真珠白と淡いライラックへ氷青の絹糸とローズゴールドを織り込んだ冬のクチュール仕様。雪結晶の糸巻きが静かに輝きます。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/soyi-tonkinese/snow-silk-couture/select.webp',sprite:'assets/costumes/soyi-tonkinese/snow-silk-couture/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'shino-cornish':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'影走りカートに合わせた、シノのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/shino-cornish.webp',sprite:'assets/sprites/shino-cornish.webp',source:'ORIGINAL'}),
    Object.freeze({id:'azure-fox-shinobi',name:'AZURE FOX SHINOBI',kicker:'MOON FOX COLLECTION',description:'月白と濃紺の忍装束へ鮮やかな蒼光と銀狐の紋を走らせた月影仕様。シアンのスカーフが残像のようになびきます。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/shino-cornish/azure-fox-shinobi/select.webp',sprite:'assets/costumes/shino-cornish/azure-fox-shinobi/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'aroma-balinese':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'香水瓶カートに合わせた、アロマのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/aroma-balinese.webp',sprite:'assets/sprites/aroma-balinese.webp',source:'ORIGINAL'}),
    Object.freeze({id:'noir-rose-perfumer',name:'NOIR ROSE PERFUMER',kicker:'MIDNIGHT PARFUM COLLECTION',description:'黒と深いワインレッドをローズゴールドで包んだ夜会の調香師仕様。後部ボトルへ薔薇色の香気を満たします。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/aroma-balinese/noir-rose-perfumer/select.webp',sprite:'assets/costumes/aroma-balinese/noir-rose-perfumer/sprite.webp',source:'GPT IMAGE 2.0'})
  ]),
  'matsuri-japanese-bobtail':Object.freeze([
    Object.freeze({id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:'たこ焼き祭カートに合わせた、マツリのいつものレーシングスタイル。',unlockLabel:'最初から使用できます',select:'assets/select-chibis/matsuri-japanese-bobtail.webp',sprite:'assets/sprites/matsuri-japanese-bobtail.webp',source:'ORIGINAL'}),
    Object.freeze({id:'aqua-summer-matsuri',name:'AQUA SUMMER MATSURI',kicker:'SEASIDE FESTIVAL COLLECTION',description:'鮮やかなアクアと白へ珊瑚色と金の波紋を添えた海辺の夏祭り仕様。肉球提灯と祭太鼓が賑やかに揺れます。性能は通常衣装と同じです。',unlockLabel:'最初から使用できます',select:'assets/costumes/matsuri-japanese-bobtail/aqua-summer-matsuri/select.webp',sprite:'assets/costumes/matsuri-japanese-bobtail/aqua-summer-matsuri/sprite.webp',source:'GPT IMAGE 2.0'})
  ])
});
function costumesFor(racer){
  return COSTUME_CATALOG[racer.slug]||[{id:'standard',name:'STANDARD',kicker:'ORIGINAL RACING SUIT',description:`${racer.name}の専用レーシングスタイル。`,unlockLabel:'最初から使用できます',select:racer.selectHero,sprite:`assets/sprites/${racer.slug}.webp`,source:'ORIGINAL'}]
}
function costumeKey(racer,costumeId){return`${racer.slug}:${costumeId}`}
function costumeNeedsPodium(costume){return!!costume&&costume.id!=='standard'}
function costumeUnlockLabel(racer,costume){return costumeNeedsPodium(costume)?`${racer.name}で、いずれかのコースを3位以内で完走`:(costume?.unlockLabel||'最初から使用できます')}
function costumeDisplayKicker(costume){return costumeNeedsPodium(costume)?'PODIUM TOP 3 REWARD':costume.kicker}
function isCostumeUnlocked(racer,costume){return!costumeNeedsPodium(costume)||playerProgress.costumeUnlocks.includes(costumeKey(racer,costume.id))}
function activeCostumeId(racer){
  const requested=playerProgress.equippedCostumes[racer.slug]||'standard',costumes=costumesFor(racer),costume=costumes.find(entry=>entry.id===requested);return costume&&isCostumeUnlocked(racer,costume)?requested:'standard'
}
function activeCostume(racer){const id=activeCostumeId(racer);return costumesFor(racer).find(costume=>costume.id===id)||costumesFor(racer)[0]}
function racerSelectHero(racer){return activeCostume(racer).select||racer.selectHero}
function resetRacerCostumeVisual(racer){
  const index=racers.indexOf(racer);racer.frames=null;racer.spritePromise=null;racer.queuedSpritePromise=null;racer.loadingCostume=null;racer.loadedCostume=null;if(index>=0)spriteImages[index]=null
}
const PROGRESS_KEY='nyan-cart-progress-v1',INITIAL_FREE_RACER_COUNT=18,RACER_UNLOCK_COST=150;
function loadProgress(){
  const empty={coins:0,unlocked:[],hardClears:[],miaDefeats:[],cupClears:[],podiumClears:[],costumeUnlocks:[],equippedCostumes:{},tutorialComplete:false,bestTimes:{}};
  try{
    const saved=JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}'),bestTimes=saved.bestTimes&&typeof saved.bestTimes==='object'?Object.fromEntries(Object.entries(saved.bestTimes).filter(([,value])=>Number.isFinite(Number(value))&&Number(value)>0).map(([key,value])=>[key,Number(value)])):{};
    return{coins:Math.max(0,Math.floor(Number(saved.coins)||0)),unlocked:Array.isArray(saved.unlocked)?saved.unlocked.filter(value=>typeof value==='string'):[],hardClears:Array.isArray(saved.hardClears)?saved.hardClears.filter(value=>typeof value==='string'):[],miaDefeats:Array.isArray(saved.miaDefeats)?saved.miaDefeats.filter(value=>typeof value==='string'):[],cupClears:Array.isArray(saved.cupClears)?saved.cupClears.filter(value=>typeof value==='string'):[],podiumClears:Array.isArray(saved.podiumClears)?saved.podiumClears.filter(value=>typeof value==='string'):[],costumeUnlocks:Array.isArray(saved.costumeUnlocks)?saved.costumeUnlocks.filter(value=>typeof value==='string'):[],equippedCostumes:saved.equippedCostumes&&typeof saved.equippedCostumes==='object'?Object.fromEntries(Object.entries(saved.equippedCostumes).filter(([slug,id])=>typeof slug==='string'&&typeof id==='string')):{},tutorialComplete:!!saved.tutorialComplete,bestTimes}
  }catch{return empty}
}
const playerProgress=loadProgress();
function saveProgress(){try{localStorage.setItem(PROGRESS_KEY,JSON.stringify(playerProgress))}catch{}}
function migrateCostumeUnlockProgress(){
  let changed=false;for(const [slug,costumeId]of Object.entries(playerProgress.equippedCostumes)){if(costumeId==='standard')continue;const racer=racers.find(entry=>entry.slug===slug),costume=racer&&costumesFor(racer).find(entry=>entry.id===costumeId),key=racer&&costume&&costumeKey(racer,costume.id);if(key&&!playerProgress.costumeUnlocks.includes(key)){playerProgress.costumeUnlocks.push(key);changed=true}}
  for(const clearKey of playerProgress.cupClears){const slug=String(clearKey).split(':')[0],racer=racers.find(entry=>entry.slug===slug);if(!racer)continue;for(const costume of costumesFor(racer).filter(costumeNeedsPodium)){const key=costumeKey(racer,costume.id);if(!playerProgress.costumeUnlocks.includes(key)){playerProgress.costumeUnlocks.push(key);changed=true}}}
  if(changed)saveProgress();return changed
}
migrateCostumeUnlockProgress();
function racerUnlockCost(index){return index<INITIAL_FREE_RACER_COUNT?0:RACER_UNLOCK_COST}
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
  fx.dataset.unlockType='racer';fx.style.setProperty('--unlock-color',racer.color||'#48dcff');$('unlockEyebrow').textContent='NEW RACER UNLOCKED';$('unlockHero').src=racerSelectHero(racer);$('unlockHero').alt=racer.name;$('unlockName').textContent=racer.name;$('unlockCopy').textContent=`${cost} COINSで専用セットを開放！`;
  makeConfetti($('unlockConfetti'),42);
  fx.classList.remove('hidden','show');void fx.offsetWidth;fx.classList.add('show');
  clearTimeout(playUnlockAnimation.t);playUnlockAnimation.t=setTimeout(()=>{fx.classList.add('hidden');fx.classList.remove('show');$('unlockConfetti').innerHTML=''},2100);
}
function playCostumeUnlockAnimation(racer,costume){
  const fx=$('unlockFx');if(!fx||!racer||!costume)return 0;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,duration=reduced?980:2700;
  fx.dataset.unlockType='costume';fx.style.setProperty('--unlock-color',racer.color||'#ff5dc8');$('unlockEyebrow').textContent='NEW OUTFIT ACQUIRED';$('unlockHero').src=costume.select;$('unlockHero').alt=`${racer.name} ${costume.name}`;$('unlockName').textContent=costume.name;$('unlockCopy').textContent=`${racer.name}の新しいレーシングスタイルを解放！`;
  makeConfetti($('unlockConfetti'),58);fx.classList.remove('hidden','show');void fx.offsetWidth;fx.classList.add('show');playSfx('resultStamp',{intensity:1.05});navigator.vibrate?.([55,35,110]);canvas.dataset.costumeUnlockAnimation=`${racer.slug}:${costume.id}`;canvas.dataset.costumeUnlockFx='outfit-card-orbit-scan-v1';
  clearTimeout(playCostumeUnlockAnimation.t);playCostumeUnlockAnimation.t=setTimeout(()=>{fx.classList.add('hidden');fx.classList.remove('show');$('unlockConfetti').innerHTML=''},duration);return duration
}
const setCarousel={dragging:false,springing:false,moved:false,dragDistance:0,pointerId:null,pointerType:'mouse',lastX:0,lastTime:0,velocity:0,inertia:0,settle:0,targetIndex:null,targetTimer:0,virtualIndex:racers.length+state.selected,previewVirtualIndex:racers.length+state.selected,lastPreviewAt:0,motionStartedAt:0};
function hydrateSetCardWindow(center=setCarousel.virtualIndex){const radius=deliveryProfile().cardRadius;let hydrated=0;document.querySelectorAll('#setGrid .set-card').forEach(card=>{if(Math.abs(Number(card.dataset.virtualIndex)-center)>radius)return;const image=card.querySelector('img'),racer=racers[Number(card.dataset.setIndex)],source=racer&&racerSelectHero(racer);if(image&&source){assignDeliveryImage(image,source,'selected-character');hydrated++}});const rail=$('setGrid');if(rail){rail.dataset.deliveryHydrated=String(hydrated);rail.dataset.deliveryTotal=String(rail.querySelectorAll('.set-card img').length);rail.dataset.deliveryRadius=String(radius)}return hydrated}
function setupSetGrid(){const rail=$('setGrid'),count=racers.length;rail.innerHTML='';setCarousel.virtualIndex=count+state.selected;setCarousel.previewVirtualIndex=setCarousel.virtualIndex;rail.dataset.motionSystem='nyan-motion-v1';for(let cycle=0;cycle<3;cycle++)racers.forEach((r,i)=>{const virtualIndex=cycle*count+i,button=document.createElement('button'),stars=r.set.rank==='S'?5:4,locked=!isRacerUnlocked(i),cost=racerUnlockCost(i),active=virtualIndex===setCarousel.virtualIndex;button.className='set-card'+(active?' selected':'')+(locked?' locked':'');button.style.setProperty('--set-color',r.color);button.style.setProperty('--hero-scale',r.selectPresentation.scale);button.dataset.setIndex=String(i);button.dataset.virtualIndex=String(virtualIndex);button.setAttribute('role','option');button.setAttribute('aria-selected',String(active));button.setAttribute('aria-setsize',String(count));button.setAttribute('aria-posinset',String(i+1));button.innerHTML=`<img data-delivery-src="${racerSelectHero(r)}" alt="${r.name}と${r.set.kart}" draggable="false" loading="lazy" decoding="async"><span class="set-card-copy"><strong>${r.name}</strong><small>${r.set.kart}</small><em>★${stars}</em></span><span class="set-card-badge">${locked?'LOCKED':active?'EQUIPPED':'SELECT'}</span><span class="set-card-lock">🔒 ${cost} COINS</span>`;button.onclick=()=>{if(!setCarousel.moved)selectRacerSet(i,true,virtualIndex)};rail.appendChild(button)});rail.addEventListener('scroll',()=>{updateSetCarousel();if(setCarousel.targetIndex!==null)return;clearTimeout(setCarousel.settle);if(!setCarousel.dragging)setCarousel.settle=setTimeout(snapSetCarousel,120)},{passive:true});rail.addEventListener('pointerdown',startSetDrag);rail.addEventListener('pointermove',moveSetDrag);rail.addEventListener('pointerup',endSetDrag);rail.addEventListener('pointercancel',endSetDrag);rail.addEventListener('wheel',wheelSetCarousel,{passive:false});rail.addEventListener('keydown',keySetCarousel);if($('positionTotal'))$('positionTotal').textContent=`/${count}`;updateWalletUI()}
function cancelSetTarget(){clearTimeout(setCarousel.targetTimer);cancelAnimationFrame(setCarousel.inertia);setCarousel.inertia=0;setCarousel.targetIndex=null;setCarousel.springing=false;$('setGrid')?.classList.remove('springing','moving')}
function normalizeSetLoop(){const count=racers.length;let virtualIndex=setCarousel.virtualIndex;if(virtualIndex<count)virtualIndex+=count;else if(virtualIndex>=count*2)virtualIndex-=count;if(virtualIndex===setCarousel.virtualIndex)return;setCarousel.virtualIndex=virtualIndex;setCarousel.previewVirtualIndex=virtualIndex;const rail=$('setGrid'),card=rail.querySelector(`[data-virtual-index="${virtualIndex}"]`);if(card)rail.scrollLeft=Math.max(0,card.offsetLeft-(rail.clientWidth-card.clientWidth)/2);updateSetUI();updateSetCarousel()}
function centerSelectedSetCard(smooth=false,virtualIndex=setCarousel.virtualIndex){const rail=$('setGrid'),card=rail.querySelector(`[data-virtual-index="${virtualIndex}"]`);if(!card)return;setCarousel.virtualIndex=virtualIndex;if(smooth){springSetCarouselTo(virtualIndex,0);return}cancelSetTarget();setCarousel.velocity=0;rail.scrollTo({left:Math.max(0,card.offsetLeft-(rail.clientWidth-card.clientWidth)/2),behavior:'auto'});normalizeSetLoop();updateSetCarousel()}
function nearestSetIndexAt(scrollLeft=$('setGrid')?.scrollLeft||0){const rail=$('setGrid'),center=scrollLeft+rail.clientWidth/2;let result={index:state.selected,virtualIndex:setCarousel.virtualIndex,distance:Infinity},best=Infinity;rail.querySelectorAll('.set-card').forEach(card=>{const distance=Math.abs(card.offsetLeft+card.offsetWidth/2-center);if(distance<best){best=distance;result={index:Number(card.dataset.setIndex),virtualIndex:Number(card.dataset.virtualIndex),distance}}});return result}
function previewSetCarouselSelection(candidate,force=false){if(!candidate||candidate.virtualIndex===setCarousel.previewVirtualIndex)return;const now=performance.now();if(!force&&now-setCarousel.lastPreviewAt<58)return;setCarousel.lastPreviewAt=now;setCarousel.previewVirtualIndex=candidate.virtualIndex;setCarousel.virtualIndex=candidate.virtualIndex;const changed=state.selected!==candidate.index;state.selected=candidate.index;updateSetUI();ensureRacerSprite(state.selected);if(changed&&state.mode==='kart')playSfx('uiMove',{intensity:.42});uiMotionDirector.select($('setGrid')?.querySelector(`[data-virtual-index="${candidate.virtualIndex}"]`),'carousel')}
function updateSetCarousel(){const rail=$('setGrid'),center=rail.scrollLeft+rail.clientWidth/2,unit=Math.max(1,rail.querySelector('.set-card')?.offsetWidth||1),speed=clamp(setCarousel.velocity*.9,-22,22),moving=setCarousel.dragging||setCarousel.springing||Math.abs(setCarousel.velocity)>.18;let closest=null,best=Infinity;rail.classList.toggle('moving',moving);rail.dataset.motionModel='predictive-spring-coverflow-v2';rail.dataset.motionState=setCarousel.dragging?'drag':setCarousel.springing?'spring':moving?'glide':'settled';rail.style.setProperty('--flick-power',Math.min(1,Math.abs(speed)/18).toFixed(3));rail.style.setProperty('--flick-direction',String(Math.sign(speed)||0));const stage=$('kartSelect');stage?.style.setProperty('--flick-x',`${clamp(speed*-1.15,-24,24).toFixed(1)}px`);stage?.style.setProperty('--flick-tilt',`${clamp(speed*.11,-2.4,2.4).toFixed(2)}deg`);
  rail.querySelectorAll('.set-card').forEach(card=>{const cardCenter=card.offsetLeft+card.offsetWidth/2,distance=(cardCenter-center)/unit,absolute=Math.abs(distance),depth=Math.min(2.7,absolute),focus=Math.max(0,1-absolute),rotate=clamp(-distance*34+speed*Math.max(0,1-depth*.36),-62,62),scale=Math.max(.72,1-depth*.105+focus*.018),lift=focus*(6+Math.min(7,Math.abs(speed)*.22));card.style.setProperty('--cover-distance',distance.toFixed(3));card.style.setProperty('--cover-focus',focus.toFixed(3));card.style.setProperty('--cover-speed',Math.min(1,Math.abs(speed)/18).toFixed(3));card.style.transform=`perspective(940px) translateY(${-lift}px) translateZ(${-depth*78}px) rotateY(${rotate}deg) scale(${scale})`;card.style.opacity=String(Math.max(.45,1-depth*.19));card.style.filter=`brightness(${(.76+focus*.28).toFixed(3)}) saturate(${(.78+focus*.3).toFixed(3)})`;card.style.zIndex=String(40-Math.round(depth*11));if(absolute<best){best=absolute;closest={index:Number(card.dataset.setIndex),virtualIndex:Number(card.dataset.virtualIndex),distance:absolute}}});
  hydrateSetCardWindow(setCarousel.virtualIndex);if(moving&&closest&&closest.distance<.43)previewSetCarouselSelection(closest)
}
function nearestSetIndex(){return nearestSetIndexAt()}
function springSetCarouselTo(virtualIndex,releaseVelocity=setCarousel.velocity){const rail=$('setGrid'),card=rail.querySelector(`[data-virtual-index="${virtualIndex}"]`);if(!card)return;cancelSetTarget();setCarousel.targetIndex=virtualIndex;setCarousel.springing=true;setCarousel.motionStartedAt=performance.now();rail.classList.add('springing','moving');const target=Math.max(0,card.offsetLeft-(rail.clientWidth-card.clientWidth)/2);let position=rail.scrollLeft,velocity=-releaseVelocity*60,last=performance.now();const tick=now=>{const dt=Math.min(.032,Math.max(.008,(now-last)/1000));last=now;const delta=target-position,stiffness=165,damping=20.5;velocity+=(delta*stiffness-velocity*damping)*dt;position+=velocity*dt;rail.scrollLeft=position;setCarousel.velocity=-velocity/60;updateSetCarousel();if((Math.abs(delta)<.32&&Math.abs(velocity)<7)||now-setCarousel.motionStartedAt>1050){rail.scrollLeft=target;setCarousel.velocity=0;setCarousel.springing=false;setCarousel.targetIndex=null;rail.classList.remove('springing','moving');previewSetCarouselSelection({index:Number(card.dataset.setIndex),virtualIndex},true);normalizeSetLoop();updateSetCarousel();uiMotionDirector.settle(rail);return}setCarousel.inertia=requestAnimationFrame(tick)};setCarousel.inertia=requestAnimationFrame(tick)}
function snapSetCarousel(){if(setCarousel.dragging||setCarousel.springing)return;const nearest=nearestSetIndex();selectRacerSet(nearest.index,false,nearest.virtualIndex);springSetCarouselTo(nearest.virtualIndex,0)}
function startSetDrag(event){if(event.button!==undefined&&event.button!==0)return;const rail=$('setGrid');cancelAnimationFrame(setCarousel.inertia);clearTimeout(setCarousel.settle);cancelSetTarget();setCarousel.dragging=true;setCarousel.moved=false;setCarousel.dragDistance=0;setCarousel.pointerId=event.pointerId;setCarousel.pointerType=event.pointerType||'mouse';setCarousel.lastX=event.clientX;setCarousel.lastTime=event.timeStamp;setCarousel.velocity=0;rail.classList.add('dragging');rail.setPointerCapture?.(event.pointerId)}
function moveSetDrag(event){if(!setCarousel.dragging||event.pointerId!==setCarousel.pointerId)return;const rail=$('setGrid'),dx=event.clientX-setCarousel.lastX,dt=Math.max(6,event.timeStamp-setCarousel.lastTime),touch=setCarousel.pointerType==='touch'||setCarousel.pointerType==='pen';setCarousel.dragDistance+=Math.abs(dx);if(setCarousel.dragDistance>(touch?5:8))setCarousel.moved=true;rail.scrollLeft-=dx;const instant=dx*16.667/dt,gain=touch?.68:.48;setCarousel.velocity=setCarousel.velocity*(1-gain)+instant*gain;setCarousel.lastX=event.clientX;setCarousel.lastTime=event.timeStamp;updateSetCarousel();if(setCarousel.moved)event.preventDefault()}
function endSetDrag(event){if(!setCarousel.dragging||event.pointerId!==setCarousel.pointerId)return;const rail=$('setGrid'),wasMoved=setCarousel.moved,touch=setCarousel.pointerType==='touch'||setCarousel.pointerType==='pen';setCarousel.dragging=false;rail.classList.remove('dragging');rail.releasePointerCapture?.(event.pointerId);if(!wasMoved){setCarousel.velocity=0;updateSetCarousel();setTimeout(()=>{setCarousel.moved=false},0);return}setCarousel.velocity*=touch?1.18:1;const travel=setCarousel.velocity*(touch?15:11),predicted=clamp(rail.scrollLeft-travel,0,Math.max(0,rail.scrollWidth-rail.clientWidth)),target=nearestSetIndexAt(predicted);previewSetCarouselSelection(target,true);springSetCarouselTo(target.virtualIndex,setCarousel.velocity);setTimeout(()=>{setCarousel.moved=false},0)}
function wheelSetCarousel(event){const rail=$('setGrid'),delta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;if(!delta)return;event.preventDefault();cancelSetTarget();rail.scrollLeft+=delta;setCarousel.velocity=-delta*.18;updateSetCarousel();clearTimeout(setCarousel.settle);setCarousel.settle=setTimeout(()=>{const predicted=clamp(rail.scrollLeft-setCarousel.velocity*9,0,Math.max(0,rail.scrollWidth-rail.clientWidth)),target=nearestSetIndexAt(predicted);previewSetCarouselSelection(target,true);springSetCarouselTo(target.virtualIndex,setCarousel.velocity)},92)}
function keySetCarousel(event){if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const count=racers.length,virtualIndex=event.key==='Home'?count:event.key==='End'?count*2-1:setCarousel.virtualIndex+(event.key==='ArrowRight'?1:-1),index=((virtualIndex%count)+count)%count;selectRacerSet(index,true,virtualIndex)}
function animateStatNumbers(container){
  const started=performance.now(),duration=720;
  container.querySelectorAll('.set-stat-row em').forEach((em,i)=>{em.textContent='0';em.dataset.delay=String(i*55)});
  const tick=now=>{let running=false;container.querySelectorAll('.set-stat-row em').forEach(em=>{const delay=Number(em.dataset.delay)||0,target=Number(em.dataset.target)||0,t=Math.max(0,Math.min(1,(now-started-delay)/duration)),ease=1-Math.pow(1-t,3);em.textContent=String(Math.round(target*ease));if(t<1)running=true});if(running)requestAnimationFrame(tick)};
  requestAnimationFrame(tick);
}
function updateSetUI(){const racer=racers[state.selected],meta=racer.set,title=`${racer.name} & ${meta.kart}`,locked=!isRacerUnlocked(state.selected),cost=racerUnlockCost(state.selected),stats=$('setStats');$('setName').textContent=title;$('setStageLabel').textContent=meta.kart.toUpperCase();$('setSubtitle').textContent=`${meta.rank} RANK EXCLUSIVE SET`;$('setRank').textContent=meta.rank;$('setDescription').textContent=meta.description;$('setPosition').textContent=`${String(state.selected+1).padStart(2,'0')} / ${String(racers.length).padStart(2,'0')}`;assignDeliveryImage($('setHeroImage'),racer.selectHero,'selected-character');$('setHeroImage').alt=`${racer.name}と専用カート ${meta.kart}`;$('setHeroImage').classList.remove('changed');requestAnimationFrame(()=>$('setHeroImage').classList.add('changed'));stats.classList.remove('stat-animate');stats.innerHTML=SET_STAT_LABELS.map(([key,label],i)=>`<div class="set-stat-row"><span>${label}</span><i><b style="--stat:${meta.stats[key]}%;--delay:${i*55}ms"></b></i><em>${meta.stats[key]}</em></div>`).join('');requestAnimationFrame(()=>stats.classList.add('stat-animate'));document.querySelectorAll('.set-card').forEach(card=>{const index=Number(card.dataset.setIndex),active=Number(card.dataset.virtualIndex)===setCarousel.virtualIndex,cardLocked=!isRacerUnlocked(index);card.classList.toggle('selected',active);card.classList.toggle('locked',cardLocked);card.setAttribute('aria-selected',String(active));card.querySelector('.set-card-badge').textContent=cardLocked?'LOCKED':active?'EQUIPPED':'SELECT'});const confirm=$('confirmSet');confirm.classList.toggle('unlock',locked);confirm.querySelector('span').textContent=locked?'UNLOCK':'COURSE SELECT';confirm.querySelector('small').textContent=locked?`${cost} COINS で開放`:'このセットで決定';updateWalletUI()}
function updateSetUI(){
  const racer=racers[state.selected],meta=racer.set,trait=racer.trait,signature=racer.signature,title=`${racer.name} & ${meta.kart}`,locked=!isRacerUnlocked(state.selected),cost=racerUnlockCost(state.selected),stats=$('setStats');
  $('setName').textContent=title;$('setStageLabel').textContent=meta.kart.toUpperCase();$('setSubtitle').textContent=`${meta.rank} RANK EXCLUSIVE SET`;playSetRankAnimation(meta);$('setDescription').textContent=meta.description;$('setPosition').textContent=`${String(state.selected+1).padStart(2,'0')} / ${String(racers.length).padStart(2,'0')}`;
  const machineSound=window.NyanAudio?.getMachineInfo(racer.slug);$('setTrait').style.setProperty('--signature-color',signature.color);$('setTrait').innerHTML=`<b>${signature.glyph} ${signature.label}</b><span>${signature.copy}</span><small>PASSIVE · ${trait.label}<em>${trait.copy}</em></small>${machineSound?`<small>ENGINE SOUND · ${machineSound.label}<em>${machineSound.concept}</em></small>`:''}`;window.NyanAudio?.previewMachine(racer.slug,meta.stats);
  const costume=activeCostume(racer),hero=$('setHeroImage');assignDeliveryImage(hero,racerSelectHero(racer),'selected-character');hero.alt=`${racer.name}と専用カート ${meta.kart}・${costume.name}`;hero.style.setProperty('--hero-scale',racer.selectPresentation.scale);hero.style.setProperty('--hero-y',`${racer.selectPresentation.y}px`);hero.classList.remove('changed');requestAnimationFrame(()=>hero.classList.add('changed'));if($('wardrobeCurrentLabel'))$('wardrobeCurrentLabel').textContent=costume.name;
  stats.classList.remove('stat-animate');stats.innerHTML=SET_STAT_LABELS.map(([key,label],i)=>`<div class="set-stat-row"><span>${label}</span><i><b style="--stat:${meta.stats[key]}%;--delay:${i*55}ms"></b></i><em data-target="${meta.stats[key]}">0</em></div>`).join('');
  requestAnimationFrame(()=>{stats.classList.add('stat-animate');animateStatNumbers(stats)});
  document.querySelectorAll('.set-card').forEach(card=>{const index=Number(card.dataset.setIndex),active=Number(card.dataset.virtualIndex)===setCarousel.virtualIndex,cardLocked=!isRacerUnlocked(index),cardRacer=racers[index],cardImage=card.querySelector('img');card.classList.toggle('selected',active);card.classList.toggle('locked',cardLocked);card.setAttribute('aria-selected',String(active));card.querySelector('.set-card-badge').textContent=cardLocked?'LOCKED':active?'EQUIPPED':'SELECT';if(cardImage&&cardRacer)cardImage.dataset.deliverySrc=racerSelectHero(cardRacer)});hydrateSetCardWindow();
  const confirm=$('confirmSet');confirm.classList.toggle('unlock',locked);confirm.querySelector('span').textContent=locked?'UNLOCK':'COURSE SELECT';confirm.querySelector('small').textContent=locked?`${cost} COINS で開放`:'このセットで決定';updateWalletUI();
}
// Walk around the outside of the 7x2 sheet instead of jumping through its
// centre: top row left→right (rear arc), then bottom row right→left (front arc).
// This makes the two duplicated side profiles the natural hinges of one 360° turn.
const WARDROBE_ROTATION_ORDER=Object.freeze([0,1,2,3,4,5,6,13,12,11,10,9,8,7]);
const WARDROBE_ROTATION_LABELS=Object.freeze(['LEFT · REAR','REAR · L45°','REAR · L15°','REAR','REAR · R15°','REAR · R45°','RIGHT · REAR','RIGHT · FRONT','FRONT · R45°','FRONT · R15°','FRONT','FRONT · L15°','FRONT · L45°','LEFT · FRONT']);
const WARDROBE_ROTATION_INTERVAL=340,wardrobeSpritePreviewCache=new Map();
const WARDROBE_REVIEW_KEY='nyan-cart-costume-frame-review-v1';
function loadWardrobeReview(){
  try{const saved=JSON.parse(localStorage.getItem(WARDROBE_REVIEW_KEY)||'{}'),marks={};for(const[key,frames]of Object.entries(saved.marks||{})){if(typeof key!=='string'||!Array.isArray(frames))continue;marks[key]=[...new Set(frames.map(Number).filter(frame=>Number.isInteger(frame)&&frame>=0&&frame<14))].sort((a,b)=>a-b)}return{marks}}catch{return{marks:{}}}
}
const wardrobeReview=loadWardrobeReview();
function saveWardrobeReview(){if(new URLSearchParams(location.search).has('qaScene'))return;try{localStorage.setItem(WARDROBE_REVIEW_KEY,JSON.stringify(wardrobeReview))}catch{}}
const wardrobeState={previewId:'standard',previewSource:'',previewImage:null,previewFrame:-1,previewStarted:0,rotationPaused:false,inspectionMode:false,manualSteps:0,loadToken:0};
function wardrobeReviewKey(racer=racers[state.selected],costume=selectedWardrobeCostume()){return`${racer.slug}:${costume.id}`}
function markedWardrobeFrames(racer=racers[state.selected],costume=selectedWardrobeCostume()){return new Set(wardrobeReview.marks[wardrobeReviewKey(racer,costume)]||[])}
function loadWardrobePreviewImage(source){
  if(wardrobeSpritePreviewCache.has(source))return wardrobeSpritePreviewCache.get(source);
  const promise=new Promise((resolve,reject)=>{const image=new Image();image.decoding='async';image.onload=()=>resolve(image);image.onerror=()=>reject(new Error(`Wardrobe sprite unavailable: ${source}`));image.src=source});wardrobeSpritePreviewCache.set(source,promise);return promise
}
function renderWardrobeFrameStrip(){
  const strip=$('wardrobeFrameStrip');if(!strip)return;const marked=markedWardrobeFrames();strip.innerHTML=WARDROBE_ROTATION_ORDER.map((frameIndex,sequenceIndex)=>`<button type="button" class="wardrobe-frame-button ${marked.has(frameIndex)?'issue':''}" data-sequence="${sequenceIndex}" data-frame="${frameIndex}" role="option" aria-selected="${sequenceIndex===wardrobeState.previewFrame}" aria-label="${String(sequenceIndex+1).padStart(2,'0')} ${WARDROBE_ROTATION_LABELS[sequenceIndex]}${marked.has(frameIndex)?' 問題あり':''}">${String(sequenceIndex+1).padStart(2,'0')}</button>`).join('');strip.querySelectorAll('.wardrobe-frame-button').forEach(button=>button.onclick=()=>selectWardrobeInspectionFrame(Number(button.dataset.sequence)));updateWardrobeInspectionSelection()
}
function updateWardrobeInspectionSelection(){
  const screen=$('wardrobe'),marked=markedWardrobeFrames(),sequenceIndex=Math.max(0,wardrobeState.previewFrame),frameIndex=WARDROBE_ROTATION_ORDER[sequenceIndex]??0,currentMarked=marked.has(frameIndex);$('wardrobeFrameStrip')?.querySelectorAll('.wardrobe-frame-button').forEach(button=>{const current=Number(button.dataset.sequence)===sequenceIndex,issue=marked.has(Number(button.dataset.frame));button.classList.toggle('current',current);button.classList.toggle('issue',issue);button.setAttribute('aria-selected',String(current));button.setAttribute('aria-label',`${button.textContent} ${WARDROBE_ROTATION_LABELS[Number(button.dataset.sequence)]}${issue?' 問題あり':''}`)});
  const mark=$('wardrobeMarkIssue');if(mark){mark.setAttribute('aria-pressed',String(currentMarked));mark.setAttribute('aria-label',`${WARDROBE_ROTATION_LABELS[sequenceIndex]}を${currentMarked?'問題なしへ戻す':'問題ありとしてマーク'}`);mark.querySelector('span').textContent=currentMarked?'UNMARK ISSUE':'⚠ MARK ISSUE';$('wardrobeIssueCount').textContent=`ISSUES ${String(marked.size).padStart(2,'0')}`}document.querySelector('.wardrobe-angle-readout')?.classList.toggle('current-issue',currentMarked);
  if(screen){screen.dataset.inspectionMode=wardrobeState.inspectionMode?'on':'off';screen.dataset.inspectionIssues=String(marked.size);screen.dataset.inspectionCurrentMarked=String(currentMarked);screen.dataset.inspectionMarkedFrames=[...marked].sort((a,b)=>a-b).join(',')||'none';screen.dataset.inspectionManualSteps=String(wardrobeState.manualSteps)}updateWardrobeReviewReportUI()
}
function setWardrobeInspectionMode(enabled,{silent=false}={}){
  wardrobeState.inspectionMode=!!enabled;wardrobeState.rotationPaused=wardrobeState.inspectionMode;const stage=document.querySelector('.wardrobe-hero-stage'),panel=$('wardrobeInspectionPanel'),toggle=$('wardrobeInspectionToggle');stage?.classList.toggle('inspection-active',wardrobeState.inspectionMode);panel?.setAttribute('aria-hidden',String(!wardrobeState.inspectionMode));toggle?.setAttribute('aria-pressed',String(wardrobeState.inspectionMode));toggle?.setAttribute('aria-label',wardrobeState.inspectionMode?'検品モードを終了':'14方向の検品モードを開始');if(toggle){toggle.querySelector('span').textContent=wardrobeState.inspectionMode?'✓':'◎';toggle.querySelector('b').textContent=wardrobeState.inspectionMode?'INSPECTING':'INSPECT';toggle.querySelector('small').textContent=wardrobeState.inspectionMode?'MANUAL REVIEW':'FRAME REVIEW'}if(wardrobeState.inspectionMode){if(wardrobeState.previewFrame<0&&wardrobeState.previewImage)drawWardrobeRotationFrame(0);renderWardrobeFrameStrip()}else{wardrobeState.previewStarted=performance.now()-Math.max(0,wardrobeState.previewFrame)*WARDROBE_ROTATION_INTERVAL}updateWardrobeRotationToggle();updateWardrobeInspectionSelection();if(!silent)playSfx(wardrobeState.inspectionMode?'uiConfirm':'uiBack',{intensity:.4})
}
function toggleWardrobeInspection(){setWardrobeInspectionMode(!wardrobeState.inspectionMode)}
function selectWardrobeInspectionFrame(sequenceIndex){
  if(!wardrobeState.previewImage)return;if(!wardrobeState.inspectionMode)setWardrobeInspectionMode(true,{silent:true});wardrobeState.rotationPaused=true;wardrobeState.manualSteps++;drawWardrobeRotationFrame(sequenceIndex);updateWardrobeRotationToggle();playSfx('uiMove',{intensity:.3})
}
function stepWardrobeInspectionFrame(direction){
  const current=Math.max(0,wardrobeState.previewFrame),next=(current+(direction<0?-1:1)+WARDROBE_ROTATION_ORDER.length)%WARDROBE_ROTATION_ORDER.length;selectWardrobeInspectionFrame(next)
}
function toggleWardrobeFrameIssue(){
  if(!wardrobeState.previewImage)return;if(!wardrobeState.inspectionMode)setWardrobeInspectionMode(true,{silent:true});const racer=racers[state.selected],costume=selectedWardrobeCostume(),key=wardrobeReviewKey(racer,costume),sequenceIndex=Math.max(0,wardrobeState.previewFrame),frameIndex=WARDROBE_ROTATION_ORDER[sequenceIndex],marked=markedWardrobeFrames(racer,costume);if(marked.has(frameIndex))marked.delete(frameIndex);else marked.add(frameIndex);wardrobeReview.marks[key]=[...marked].sort((a,b)=>a-b);saveWardrobeReview();renderWardrobeFrameStrip();drawWardrobeRotationFrame(sequenceIndex);playSfx(marked.has(frameIndex)?'resultStamp':'uiBack',{intensity:.52})
}
const WARDROBE_REVIEW_COLUMNS=Object.freeze([
  ['racerName','キャラ名'],['racerSlug','キャラID'],['costumeName','衣装名'],['costumeId','衣装ID'],['direction','方向'],['sequenceNumber','回転順'],['sourceCell','元セル番号'],['sourceRow','元行'],['sourceColumn','元列'],['sprite','スプライト画像']
]);
function buildWardrobeReviewRows(){
  const rows=[];for(const[key,markedFrames]of Object.entries(wardrobeReview.marks)){if(!Array.isArray(markedFrames)||!markedFrames.length)continue;const separator=key.indexOf(':'),racerSlug=separator>=0?key.slice(0,separator):key,costumeId=separator>=0?key.slice(separator+1):'standard',racer=racers.find(entry=>entry.slug===racerSlug);if(!racer)continue;const costumes=costumesFor(racer),costume=costumes.find(entry=>entry.id===costumeId);if(!costume)continue;for(const frameIndex of markedFrames){const sequenceIndex=WARDROBE_ROTATION_ORDER.indexOf(frameIndex);if(sequenceIndex<0)continue;rows.push({racerName:racer.name,racerSlug,costumeName:costume.name,costumeId:costume.id,direction:WARDROBE_ROTATION_LABELS[sequenceIndex],sequenceNumber:sequenceIndex+1,sourceCell:frameIndex+1,sourceRow:Math.floor(frameIndex/7)+1,sourceColumn:frameIndex%7+1,sprite:costume.sprite,frameIndex,racerOrder:racers.indexOf(racer),costumeOrder:costumes.indexOf(costume)})}}
  return rows.sort((a,b)=>a.racerOrder-b.racerOrder||a.costumeOrder-b.costumeOrder||a.sequenceNumber-b.sequenceNumber)
}
function wardrobeCsvCell(value){const text=String(value??'');return/[",\r\n]/.test(text)?`"${text.replaceAll('"','""')}"`:text}
function wardrobeReportDate(){return new Date().toISOString().slice(0,10)}
function downloadWardrobeBlob(blob,filename){const anchor=document.createElement('a'),url=URL.createObjectURL(blob);anchor.href=url;anchor.download=filename;document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1400)}
function updateWardrobeReviewReportUI(message=''){
  const rows=buildWardrobeReviewRows(),count=$('wardrobeReportCount'),status=$('wardrobeReportStatus'),csv=$('wardrobeExportCsv'),sheet=$('wardrobeExportSheet');if(count)count.textContent=`${String(rows.length).padStart(2,'0')} FRAMES`;if(csv)csv.disabled=!rows.length;if(sheet)sheet.disabled=!rows.length;if(status)status.textContent=message||(rows.length?`${new Set(rows.map(row=>`${row.racerSlug}:${row.costumeId}`)).size}衣装・${rows.length}コマを出力できます。`:'問題コマをマークすると、全キャラ・全衣装をまとめて出力できます。');const screen=$('wardrobe');if(screen){screen.dataset.reviewReportRows=String(rows.length);screen.dataset.reviewReportOutfits=String(new Set(rows.map(row=>`${row.racerSlug}:${row.costumeId}`)).size)}return rows
}
function buildWardrobeReviewCsv(rows=buildWardrobeReviewRows()){const header=WARDROBE_REVIEW_COLUMNS.map(([,label])=>wardrobeCsvCell(label)).join(','),body=rows.map(row=>WARDROBE_REVIEW_COLUMNS.map(([key])=>wardrobeCsvCell(row[key])).join(',')).join('\r\n');return`\uFEFF${header}\r\n${body}${body?'\r\n':''}`}
function exportWardrobeReviewCsv(){
  const rows=buildWardrobeReviewRows();if(!rows.length){updateWardrobeReviewReportUI('出力する問題コマがありません。');playSfx('uiBack',{intensity:.35});return false}downloadWardrobeBlob(new Blob([buildWardrobeReviewCsv(rows)],{type:'text/csv;charset=utf-8'}),`nyan-cart-frame-review-${wardrobeReportDate()}.csv`);updateWardrobeReviewReportUI(`CSVへ${rows.length}コマを書き出しました。`);playSfx('resultStamp',{intensity:.64});return true
}
function wardrobeContactSheetCard(context,row,image,x,y,width,height){
  context.save();context.fillStyle='#101c35';context.strokeStyle='#5be9ff66';context.lineWidth=2;context.beginPath();context.roundRect?.(x,y,width,height,18);if(!context.roundRect)context.rect(x,y,width,height);context.fill();context.stroke();
  context.fillStyle='#67edff';context.font='900 15px Fredoka, sans-serif';context.fillText(row.racerName,x+18,y+26);context.fillStyle='#ffffff';context.font='900 24px Fredoka, Noto Sans JP, sans-serif';context.fillText(row.costumeName,x+18,y+54);
  const frameX=x+18,frameY=y+70,frameW=width-36,frameH=174;context.fillStyle='#07111f';context.fillRect(frameX,frameY,frameW,frameH);context.strokeStyle='#ffffff18';context.strokeRect(frameX+.5,frameY+.5,frameW-1,frameH-1);
  if(image?.naturalWidth){const cellW=image.naturalWidth/7,cellH=image.naturalHeight/2,sx=(row.frameIndex%7)*cellW,sy=Math.floor(row.frameIndex/7)*cellH,scale=Math.min((frameW-14)/cellW,(frameH-10)/cellH),drawW=cellW*scale,drawH=cellH*scale;context.drawImage(image,sx,sy,cellW,cellH,frameX+(frameW-drawW)/2,frameY+(frameH-drawH)/2,drawW,drawH)}
  context.fillStyle='#ffe170';context.font='900 18px Fredoka, sans-serif';context.fillText(row.direction,x+18,y+271);context.fillStyle='#ff7dbd';context.font='900 14px Fredoka, sans-serif';context.fillText(`SOURCE CELL ${String(row.sourceCell).padStart(2,'0')}  ·  ROW ${row.sourceRow} / COL ${row.sourceColumn}`,x+18,y+299);context.fillStyle='#b5c9dc';context.font='700 11px Fredoka, sans-serif';context.fillText(`${row.racerSlug} / ${row.costumeId}`,x+18,y+320);context.restore()
}
async function buildWardrobeReviewContactSheets(rows=buildWardrobeReviewRows()){
  if(!rows.length)return[];const sources=[...new Set(rows.map(row=>row.sprite))],images=new Map(await Promise.all(sources.map(async source=>{try{return[source,await loadWardrobePreviewImage(source)]}catch{return[source,null]}}))),columns=4,rowsPerPage=12,cardsPerPage=columns*rowsPerPage,width=1600,margin=42,gap=16,headerHeight=142,cardWidth=(width-margin*2-gap*(columns-1))/columns,cardHeight=338,pages=[];
  for(let offset=0,pageIndex=0;offset<rows.length;offset+=cardsPerPage,pageIndex++){const pageRows=rows.slice(offset,offset+cardsPerPage),rowCount=Math.ceil(pageRows.length/columns),height=headerHeight+margin+rowCount*cardHeight+Math.max(0,rowCount-1)*gap+46,canvasSheet=document.createElement('canvas');canvasSheet.width=width;canvasSheet.height=height;const context=canvasSheet.getContext('2d'),gradient=context.createLinearGradient(0,0,width,height);gradient.addColorStop(0,'#060b18');gradient.addColorStop(.55,'#111d38');gradient.addColorStop(1,'#281333');context.fillStyle=gradient;context.fillRect(0,0,width,height);context.fillStyle='#55edff';context.fillRect(0,0,width,10);context.fillStyle='#ffffff';context.font='900 46px Fredoka, Noto Sans JP, sans-serif';context.fillText('NYAN CART · FRAME REVIEW',margin,67);context.fillStyle='#ff7bc9';context.font='900 18px Fredoka, Noto Sans JP, sans-serif';context.fillText(`GPT Image 2.0 作り直し対象 · ${rows.length} MARKED FRAMES`,margin,101);context.textAlign='right';context.fillStyle='#ffe478';context.font='900 22px Fredoka, sans-serif';context.fillText(`PAGE ${String(pageIndex+1).padStart(2,'0')} / ${String(Math.ceil(rows.length/cardsPerPage)).padStart(2,'0')}`,width-margin,68);context.fillStyle='#9cb4cc';context.font='700 14px Fredoka, sans-serif';context.fillText(wardrobeReportDate(),width-margin,100);context.textAlign='left';pageRows.forEach((row,index)=>{const column=index%columns,line=Math.floor(index/columns),x=margin+column*(cardWidth+gap),y=headerHeight+line*(cardHeight+gap);wardrobeContactSheetCard(context,row,images.get(row.sprite),x,y,cardWidth,cardHeight)});canvasSheet.dataset.reviewCards=String(pageRows.length);canvasSheet.dataset.reviewPage=String(pageIndex+1);pages.push(canvasSheet)}
  return pages
}
function downloadWardrobeCanvas(canvasSheet,filename){return new Promise((resolve,reject)=>canvasSheet.toBlob(blob=>{if(!blob){reject(new Error('PNG encoding failed'));return}downloadWardrobeBlob(blob,filename);resolve(blob)},'image/png'))}
async function exportWardrobeReviewContactSheets(){
  const rows=buildWardrobeReviewRows();if(!rows.length){updateWardrobeReviewReportUI('出力する問題コマがありません。');playSfx('uiBack',{intensity:.35});return false}const button=$('wardrobeExportSheet');if(button)button.disabled=true;updateWardrobeReviewReportUI('コンタクトシート画像を作成中…');try{const sheets=await buildWardrobeReviewContactSheets(rows);for(let index=0;index<sheets.length;index++)await downloadWardrobeCanvas(sheets[index],`nyan-cart-frame-review-${wardrobeReportDate()}-${String(index+1).padStart(2,'0')}.png`);updateWardrobeReviewReportUI(`PNGへ${rows.length}コマを書き出しました${sheets.length>1?`（${sheets.length}枚）`:''}。`);playSfx('resultStamp',{intensity:.7});return true}catch(error){console.warn('Wardrobe review contact sheet failed',error);updateWardrobeReviewReportUI('PNGの作成に失敗しました。もう一度お試しください。');playSfx('uiBack',{intensity:.4});return false}finally{if(button)button.disabled=!buildWardrobeReviewRows().length}
}
function drawWardrobeRotationFrame(sequenceIndex=0){
  const canvasPreview=$('wardrobeSpritePreview'),image=wardrobeState.previewImage;if(!canvasPreview||!image?.naturalWidth)return false;
  const cols=7,rows=2,cellW=image.naturalWidth/cols,cellH=image.naturalHeight/rows;if(!Number.isInteger(cellW)||!Number.isInteger(cellH))return false;
  const slot=((sequenceIndex%WARDROBE_ROTATION_ORDER.length)+WARDROBE_ROTATION_ORDER.length)%WARDROBE_ROTATION_ORDER.length,frameIndex=WARDROBE_ROTATION_ORDER[slot],col=frameIndex%cols,row=Math.floor(frameIndex/cols),context=canvasPreview.getContext('2d'),scale=Math.min(canvasPreview.width*.91/cellW,canvasPreview.height*.92/cellH),width=cellW*scale,height=cellH*scale,x=(canvasPreview.width-width)/2,y=canvasPreview.height-height-5;
  context.clearRect(0,0,canvasPreview.width,canvasPreview.height);context.imageSmoothingEnabled=true;context.drawImage(image,col*cellW,row*cellH,cellW,cellH,x,y,width,height);
  wardrobeState.previewFrame=slot;$('wardrobeAngleLabel').textContent=WARDROBE_ROTATION_LABELS[slot];$('wardrobeFrameCounter').textContent=`${String(slot+1).padStart(2,'0')} / 14`;
  canvasPreview.dataset.previewModel='sheet-perimeter-360-v2';canvasPreview.dataset.frameCount='14';canvasPreview.dataset.sequenceFrame=String(slot);canvasPreview.dataset.sheetFrame=String(frameIndex);canvasPreview.dataset.direction=WARDROBE_ROTATION_LABELS[slot];canvasPreview.dataset.cellWidth=String(cellW);canvasPreview.dataset.cellHeight=String(cellH);canvasPreview.dataset.source=wardrobeState.previewSource;
  const screen=$('wardrobe');screen.dataset.rotationFrame=String(frameIndex);screen.dataset.rotationSequence=String(slot);screen.dataset.rotationDirection=WARDROBE_ROTATION_LABELS[slot];updateWardrobeInspectionSelection();return true
}
function updateWardrobeRotation(now=performance.now()){
  if(state.mode!=='wardrobe'||!wardrobeState.previewImage)return;
  const sequenceIndex=wardrobeState.rotationPaused?Math.max(0,wardrobeState.previewFrame):Math.floor((now-wardrobeState.previewStarted)/WARDROBE_ROTATION_INTERVAL)%WARDROBE_ROTATION_ORDER.length;if(sequenceIndex!==wardrobeState.previewFrame)drawWardrobeRotationFrame(sequenceIndex)
}
function updateWardrobeRotationToggle(){
  const toggle=$('wardrobeRotationToggle');if(!toggle)return;const inspecting=wardrobeState.inspectionMode;toggle.setAttribute('aria-pressed',String(wardrobeState.rotationPaused));toggle.setAttribute('aria-label',inspecting?'検品モードを終了して自動回転を再開':wardrobeState.rotationPaused?'14方向の自動回転を再開':'14方向の自動回転を一時停止');toggle.querySelector('span').textContent=wardrobeState.rotationPaused?'▶':'Ⅱ';toggle.querySelector('b').textContent=inspecting?'EXIT + AUTO':wardrobeState.rotationPaused?'RESUME':'AUTO ROTATE';toggle.querySelector('small').textContent=inspecting?'LEAVE REVIEW':wardrobeState.rotationPaused?'ANGLE CHECK PAUSED':'14 DIRECTIONS';$('wardrobe').dataset.rotation=wardrobeState.rotationPaused?'paused':'running'
}
function toggleWardrobeRotation(){
  if(wardrobeState.inspectionMode){setWardrobeInspectionMode(false);return}wardrobeState.rotationPaused=!wardrobeState.rotationPaused;if(!wardrobeState.rotationPaused)wardrobeState.previewStarted=performance.now()-Math.max(0,wardrobeState.previewFrame)*WARDROBE_ROTATION_INTERVAL;updateWardrobeRotationToggle();playSfx(wardrobeState.rotationPaused?'uiBack':'uiConfirm',{intensity:.34})
}
function ensureWardrobeRotationPreview(){
  const racer=racers[state.selected],costume=selectedWardrobeCostume(),source=costume.sprite,stage=document.querySelector('.wardrobe-hero-stage'),canvasPreview=$('wardrobeSpritePreview'),token=++wardrobeState.loadToken;wardrobeState.previewSource=source;wardrobeState.previewImage=null;wardrobeState.previewFrame=-1;wardrobeState.previewStarted=performance.now();wardrobeState.rotationPaused=wardrobeState.inspectionMode;stage?.classList.remove('sprite-ready','sprite-error');if(canvasPreview){canvasPreview.getContext('2d').clearRect(0,0,canvasPreview.width,canvasPreview.height);canvasPreview.dataset.previewModel='loading';canvasPreview.dataset.source=source}updateWardrobeRotationToggle();
  return loadWardrobePreviewImage(source).then(image=>{if(token!==wardrobeState.loadToken||state.mode!=='wardrobe')return false;const cellW=image.naturalWidth/7,cellH=image.naturalHeight/2;if(!Number.isInteger(cellW)||!Number.isInteger(cellH))throw new Error(`Wardrobe sprite grid must be 7x2: ${source}`);wardrobeState.previewImage=image;wardrobeState.previewStarted=performance.now();stage?.classList.add('sprite-ready');drawWardrobeRotationFrame(0);renderWardrobeFrameStrip();setWardrobeInspectionMode(wardrobeState.inspectionMode,{silent:true});$('wardrobe').dataset.rotationModel='sheet-perimeter-360-v2';$('wardrobe').dataset.rotationOrder=WARDROBE_ROTATION_ORDER.join(',');$('wardrobe').dataset.rotationFrames='14';$('wardrobe').dataset.rotationCostume=costume.id;return true}).catch(error=>{if(token!==wardrobeState.loadToken)return false;stage?.classList.add('sprite-error');if(canvasPreview)canvasPreview.dataset.previewModel='error';$('wardrobe').dataset.rotation='error';console.warn('Wardrobe rotation preview failed',error);return false})
}
function selectedWardrobeCostume(){
  const racer=racers[state.selected],costumes=costumesFor(racer);return costumes.find(costume=>costume.id===wardrobeState.previewId)||costumes[0]
}
function renderWardrobe(){
  const racer=racers[state.selected],costumes=costumesFor(racer),costume=selectedWardrobeCostume(),unlocked=isCostumeUnlocked(racer,costume),equipped=activeCostumeId(racer)===costume.id,index=Math.max(0,costumes.indexOf(costume)),hero=$('wardrobeHero');document.querySelector('.wardrobe-hero-stage')?.setAttribute('data-layout-model','dual-showcase-v1');
  $('wardrobeCounter').textContent=`${String(index+1).padStart(2,'0')} / ${String(costumes.length).padStart(2,'0')}`;$('wardrobeRacerName').textContent=racer.name;$('wardrobeKicker').textContent=costumeDisplayKicker(costume);$('wardrobeName').textContent=costume.name;$('wardrobeDescription').textContent=costume.description;$('wardrobeStatus').textContent=equipped?'EQUIPPED':unlocked?'AVAILABLE':'LOCKED';$('wardrobeStatus').classList.toggle('locked',!unlocked);
  const condition=$('wardrobeUnlockCondition'),unlockCopy=costumeUnlockLabel(racer,costume);condition.classList.toggle('locked',!unlocked);condition.querySelector('b').textContent=unlocked?'UNLOCKED':'CLEAR CONDITION';condition.querySelector('span').textContent=unlockCopy;hero.src=costume.select;hero.alt=`${racer.name} ${costume.name}`;hero.classList.remove('changed');requestAnimationFrame(()=>hero.classList.add('changed'));
  $('wardrobeGrid').innerHTML=costumes.map(entry=>{const entryUnlocked=isCostumeUnlocked(racer,entry),selected=entry.id===costume.id;return`<button type="button" class="wardrobe-card ${selected?'selected':''} ${entryUnlocked?'':'locked'}" data-costume="${entry.id}" role="option" aria-selected="${selected}" aria-label="${entry.name} ${entryUnlocked?'使用可能':'未解放'}"><img src="${entry.select}" alt="" draggable="false"><span><small>${entry.source}</small><strong>${entry.name}</strong><em>${entryUnlocked?'READY':'TOP 3'}</em></span></button>`}).join('');
  $('wardrobeGrid').querySelectorAll('.wardrobe-card').forEach(card=>card.onclick=()=>selectWardrobeCostume(card.dataset.costume));
  const equip=$('wardrobeEquip');equip.disabled=!unlocked||equipped;equip.querySelector('span').textContent=equipped?'EQUIPPED':unlocked?'USE THIS OUTFIT':'LOCKED';equip.querySelector('small').textContent=equipped?'現在使用中の衣装です':unlocked?'衣装を装備する':unlockCopy;
  $('wardrobe').dataset.racer=racer.slug;$('wardrobe').dataset.preview=costume.id;$('wardrobe').dataset.equipped=activeCostumeId(racer);$('wardrobe').dataset.unlocked=String(unlocked);$('wardrobe').dataset.unlockModel='any-course-top3-v1';ensureWardrobeRotationPreview()
}
function selectWardrobeCostume(costumeId){
  const racer=racers[state.selected],costume=costumesFor(racer).find(entry=>entry.id===costumeId);if(!costume)return;wardrobeState.previewId=costume.id;renderWardrobe();uiMotionDirector.select($('wardrobeGrid').querySelector(`[data-costume="${costume.id}"]`),'outfit');if(state.mode==='wardrobe')syncControllerFocus()
}
function openWardrobe(){
  const racer=racers[state.selected];wardrobeState.previewId=activeCostumeId(racer);wardrobeState.inspectionMode=false;wardrobeState.manualSteps=0;document.querySelector('.wardrobe-hero-stage')?.classList.remove('inspection-active');$('wardrobeInspectionPanel')?.setAttribute('aria-hidden','true');state.mode='wardrobe';showScreen('wardrobe');renderWardrobe()
}
function closeWardrobe(){wardrobeState.inspectionMode=false;wardrobeState.rotationPaused=false;document.querySelector('.wardrobe-hero-stage')?.classList.remove('inspection-active');state.mode='kart';showScreen('kartSelect');updateSetUI();requestAnimationFrame(()=>syncControllerFocus())}
function equipWardrobeCostume(){
  const racer=racers[state.selected],costume=selectedWardrobeCostume();if(!isCostumeUnlocked(racer,costume))return;playerProgress.equippedCostumes[racer.slug]=costume.id;saveProgress();resetRacerCostumeVisual(racer);ensureRacerSprite(state.selected).catch(error=>console.warn('Costume sprite load failed',error));renderWardrobe();updateSetUI();playSfx('resultStamp',{intensity:.82});uiMotionDirector.reward($('wardrobeHero'));canvas.dataset.playerCostume=costume.id
}
function unlockPodiumCostumes(racer,courseIndex,rank,options={}){
  const course=courseData[courseIndex],validRank=Number(rank)>=1&&Number(rank)<=3;if(!racer||!course||course.debugOnly||!validRank)return[];const persist=options.persist??!new URLSearchParams(location.search).has('qaScene'),clearKey=`${racer.slug}:${courseScenerySlugs[courseIndex]||courseIndex}`;let changed=false;if(!playerProgress.podiumClears.includes(clearKey)){playerProgress.podiumClears.push(clearKey);changed=true}const rewards=[];for(const costume of costumesFor(racer).filter(costumeNeedsPodium)){const key=costumeKey(racer,costume.id);if(playerProgress.costumeUnlocks.includes(key))continue;playerProgress.costumeUnlocks.push(key);changed=true;rewards.push({type:'costume',label:`${costume.name} UNLOCKED`,detail:`${racer.name}でコース3位以内を達成`,coins:0,new:true,costume:costume.id,course:courseIndex})}if(changed&&persist)saveProgress();canvas.dataset.costumeUnlockModel='any-course-top3-v1';canvas.dataset.costumeUnlockRank=String(rank);canvas.dataset.costumeUnlockCourse=courseScenerySlugs[courseIndex]||String(courseIndex);canvas.dataset.costumeUnlockRewards=String(rewards.length);return rewards
}
// Legacy audit hook: cup completion by itself no longer unlocks costumes.
function unlockCupCostume(){return[]}
window.NyanCostumes={model:'any-course-top3-v1',unlockForPodium:(racerIndex=0,courseIndex=0,rank=3)=>unlockPodiumCostumes(racers[clamp(Math.round(racerIndex),0,racers.length-1)],clamp(Math.round(courseIndex),0,courseData.length-1),rank,{persist:false}),isUnlocked:(racerIndex=0,costumeId='standard')=>{const racer=racers[clamp(Math.round(racerIndex),0,racers.length-1)],costume=costumesFor(racer).find(entry=>entry.id===costumeId);return!!costume&&isCostumeUnlocked(racer,costume)},snapshot:(racerIndex=0)=>{const racer=racers[clamp(Math.round(racerIndex),0,racers.length-1)];return{racer:racer.slug,podiumClears:playerProgress.podiumClears.filter(key=>key.startsWith(`${racer.slug}:`)),costumes:costumesFor(racer).map(costume=>({id:costume.id,unlocked:isCostumeUnlocked(racer,costume),condition:costumeUnlockLabel(racer,costume)}))}}};
function selectRacerSet(i,center=true,virtualIndex=null){const count=racers.length,previous=state.selected;state.selected=((i%count)+count)%count;if(virtualIndex===null){const candidates=[state.selected,state.selected+count,state.selected+count*2];virtualIndex=candidates.reduce((best,value)=>Math.abs(value-setCarousel.virtualIndex)<Math.abs(best-setCarousel.virtualIndex)?value:best,candidates[1])}setCarousel.virtualIndex=virtualIndex;setCarousel.previewVirtualIndex=virtualIndex;updateSetUI();ensureRacerSprite(state.selected);if(previous!==state.selected)uiMotionDirector.select($('setGrid')?.querySelector(`[data-virtual-index="${virtualIndex}"]`),'carousel');if(center)centerSelectedSetCard(true,virtualIndex);updateSetCarousel();if(state.mode==='kart')syncControllerFocus()}
function openKartSelect(){window.NyanDelivery?.markPhase?.('selected-character');state.mode='kart';showScreen('kartSelect');updateSetUI();ensureRacerSprite(state.selected).catch(()=>{});hydrateSetCardWindow();const settle=()=>{if(state.mode!=='kart')return;centerSelectedSetCard(false,setCarousel.virtualIndex);hydrateSetCardWindow(setCarousel.virtualIndex);updateSetCarousel()};requestAnimationFrame(settle);setTimeout(settle,180)}
function confirmRacerSet(){if(isRacerUnlocked(state.selected)){openCourseSelect();return}const cost=racerUnlockCost(state.selected);if(playerProgress.coins<cost){showSetNotice(`開放まであと ${cost-playerProgress.coins} COINS`);return}const racer=racers[state.selected];playerProgress.coins-=cost;playerProgress.unlocked.push(racer.slug);saveProgress();updateSetUI();showSetNotice('レーサーセットを開放しました！');playUnlockAnimation(racer,cost)}
const COURSE_SHOWCASE_META=[
  {raceType:'TECHNICAL',surface:'CANDY ROAD',description:'きらめきと分岐が交差する、お菓子の街のテクニカルコース。'},
  {raceType:'POWER TECH',surface:'IRON ROAD',description:'歯車と蒸気機関がうなる工業都市を、重量級マシンで駆け抜ける。'},
  {raceType:'HIGH SPEED',surface:'NEON ASPHALT',description:'光の摩天楼を切り裂く高速ライン。夜景の先に連続ブーストが待つ。'},
  {raceType:'BALANCED',surface:'WET ROAD',description:'雨粒と傘の街を走るウェットレース。滑る路面で丁寧な操作が試される。'},
  {raceType:'GRAND PRIX',surface:'ROYAL STONE',description:'お菓子の王城を巡る華やかなコース。長い直線と技巧的な分岐を併せ持つ。'},
  {raceType:'ICE SPEED',surface:'SNOW & ICE',description:'オーロラの氷河を走る高速コース。雪上グリップとジャンプの判断が鍵。'},
  {raceType:'WILD TECH',surface:'RUINS & WOOD',description:'密林、古代遺跡、吊り橋を抜ける冒険ルート。路面変化が最も激しい。'},
  {raceType:'DRIFT FLOW',surface:'ONSEN ROAD',description:'桜吹雪と湯けむりをくぐり、流れるようなドリフトを楽しむ温泉街。'},
  {raceType:'WAVE LINE',surface:'AQUA ROAD',description:'珊瑚宮殿と泡の回廊を走る水上ライン。高低差と分岐選択が勝負を分ける。'},
  {raceType:'NIGHT TRICK',surface:'PHANTOM ROAD',description:'幻影と星屑が揺れる夜の遊園地。仕掛けの多い難関ナイトレース。'},
  {raceType:'ZERO-G SPEED',surface:'LUNAR DECK',description:'低重力コロニーを周回する最速クラス。大ジャンプと軌道分岐を攻略する。'}
];
const COURSE_WEATHER_LABELS={stardust:'STAR DUST',steam:'STEAM',rain:'RAIN',snow:'SNOW',fireflies:'FIREFLIES',sakura:'SAKURA',bubbles:'BUBBLES'};
const courseCarousel={indexes:[],dragging:false,moved:false,dragDistance:0,pointerId:null,pointerType:'mouse',lastX:0,lastTime:0,velocity:0,inertia:0,settle:0,targetIndex:null,targetTimer:0,virtualIndex:0,revealStart:0};
function visibleCourseIndexes(){return courseData.map((course,index)=>({course,index})).filter(({course})=>!course.debugOnly||DEV_COURSES_ENABLED).map(({index})=>index)}
function releaseCourseIndexes(){return courseData.map((course,index)=>({course,index})).filter(({course})=>!course.debugOnly).map(({index})=>index)}
function cupCourseSequence(startIndex=state.selectedCourse){
  const available=releaseCourseIndexes(),startPosition=Math.max(0,available.indexOf(startIndex));
  return Array.from({length:CUP_RACE_COUNT},(_,offset)=>available[(startPosition+offset)%available.length])
}
function clearCupState(){
  cupState.active=false;cupState.startCourse=state.selectedCourse;cupState.courseIndexes=[];cupState.results=[];cupState.standings=new Map();cupState.walletStart=playerProgress.coins;cupState.totalCoins=0;cupState.totalTime=0;cupState.final=false;canvas.dataset.cupMode='single';canvas.dataset.cupRound='0';canvas.dataset.cupCourses='';canvas.dataset.cupStandings=''
}
function beginCup(startIndex=state.selectedCourse){
  const sequence=cupCourseSequence(startIndex);Object.assign(cupState,{active:true,startCourse:sequence[0],courseIndexes:sequence,results:[],standings:new Map(),walletStart:playerProgress.coins,totalCoins:0,totalTime:0,final:false});
  racers.forEach((racer,index)=>cupState.standings.set(racer.slug,{racer,points:0,wins:0,podiums:0,positionSum:0,lastRank:racers.length,index,races:[]}));
  state.selectedCourse=sequence[0];canvas.dataset.cupMode='three-course-points-v1';canvas.dataset.cupRound='1';canvas.dataset.cupCourses=sequence.map(index=>courseScenerySlugs[index]).join(',');canvas.dataset.cupStandings='ready'
}
function setRaceMode(mode='single'){
  state.raceMode=mode==='cup'?'cup':'single';if(state.raceMode==='single')clearCupState();else{cupState.active=false;cupState.results=[];cupState.final=false;canvas.dataset.cupMode='three-course-points-v1'}
  document.documentElement.dataset.raceMode=state.raceMode
}
function updateCupCoursePreview(index=state.selectedCourse){
  const cup=state.raceMode==='cup',sequence=cupCourseSequence(index),preview=$('cupRoutePreview'),guide=document.querySelector('.course-dock-guide'),dock=document.querySelector('.course-dock'),confirm=$('confirmCourse');
  dock?.classList.toggle('cup-mode',cup);guide?.classList.toggle('hidden',cup);preview?.classList.toggle('hidden',!cup);
  if(cup&&preview)preview.innerHTML=sequence.map((courseIndex,round)=>{const course=courseData[courseIndex];return`<span><img src="${course.art}" alt=""><i><b>RACE ${round+1}</b><em>${course.short}</em></i></span>`}).join('');
  if(confirm){confirm.querySelector('span').textContent=cup?'SELECT CUP START':'RACE THIS CIRCUIT';confirm.querySelector('small').textContent=cup?'この3コースで難易度選択へ':'難易度選択へ進む'}
  if($('courseSelectTitle'))$('courseSelectTitle').textContent=cup?'カップの第1コースを選ぼう！':'レース会場を選ぼう！';
  if($('courseSelect')){$('courseSelect').dataset.raceMode=state.raceMode;$('courseSelect').dataset.cupCourses=cup?sequence.map(courseIndex=>courseScenerySlugs[courseIndex]).join(','):''}
}
function coursePosition(index){const position=courseCarousel.indexes.indexOf(index);return position<0?0:position}
function courseWeatherType(index){return COURSE_AMBIENCE_PROFILES[index]?.effects?.[0]?.type||'stardust'}
function buildCourseWeather(type){const weather=$('courseWeatherFx');if(!weather)return;weather.className=`course-showcase-weather weather-${type}`;weather.innerHTML=Array.from({length:type==='rain'?18:type==='steam'?7:13},(_,i)=>{const x=(i*37+11)%101,y=(i*53+17)%83,size=type==='rain'?2:type==='steam'?34:4+(i*7)%11,duration=(type==='rain'?1.1:type==='steam'?5.8:3.8)+(i%5)*.47,delay=-(i%9)*.53;return`<i style="--x:${x}%;--y:${y}%;--size:${size}px;--duration:${duration}s;--delay:${delay}s"></i>`}).join('')}
function renderCourseZoneSequence(index){
  const sequence=$('courseZoneSequence'),course=courseData[index];if(!sequence||!course)return;const zones=biomeVolumeZones(index,course.finishDistance||TRACK_LENGTH),many=zones.length>4;sequence.classList.toggle('many',many);sequence.style.setProperty('--zone-count',String(many?4:zones.length));sequence.innerHTML=zones.map((zone,zoneIndex)=>`<span style="--zone-color:${zone.fog}" title="${biomeZoneDisplayName(zone,index)}"><b>${String(zoneIndex+1).padStart(2,'0')}</b><em>${biomeZoneDisplayName(zone,index)}</em></span>`).join('');sequence.dataset.zoneCount=String(zones.length);sequence.dataset.zoneOrder=zones.map(zone=>zone.id).join(',');sequence.setAttribute('aria-label',`${course.name}の景観順: ${zones.map(zone=>biomeZoneDisplayName(zone,index)).join('、')}`)
}
function updateCourseShowcase(index){
  const course=courseData[index],meta=COURSE_SHOWCASE_META[index]||{raceType:'SPECIAL',surface:'CUSTOM ROAD',description:course.style},position=coursePosition(index),count=courseCarousel.indexes.length,theme=course.theme||courseData[0].theme,effect=courseWeatherType(index),graph=course.routeGraph,ramps=course.gimmicks?.ramps?.length||0,tunnels=course.tunnels?.length||0;
  const screen=$('courseSelect');screen.style.setProperty('--course-accent',theme.accent||'#55baf4');screen.style.setProperty('--course-light',theme.lightA||theme.curbA||'#ff76bd');screen.style.setProperty('--course-light-2',theme.lightB||theme.curbB||'#72e9ff');screen.dataset.course=course.short;screen.dataset.courseIndex=String(index);screen.dataset.showcase='live-circuit-v1';
  const art=$('courseShowcaseArt'),backdrop=$('courseShowcaseBackdrop');for(const image of[art,backdrop]){assignDeliveryImage(image,course.art,'selected-course');image.classList.remove('changed');requestAnimationFrame(()=>image.classList.add('changed'))}art.alt=`${course.name}のコースプレビュー`;backdrop.alt='';
  $('courseShowcaseNumber').textContent=course.debugOnly?'DBG':String(position+1).padStart(2,'0');$('courseShowcaseShort').textContent=course.short;$('selectedCourseName').textContent=course.name;$('selectedCourseInfo').textContent=`${course.style}  ・  難易度 ${course.difficulty}`;$('courseShowcaseDescription').textContent=meta.description;$('courseRaceType').textContent=meta.raceType;$('courseDistance').textContent=`${Math.round(course.finishDistance||TRACK_LENGTH)}m × ${course.totalLaps||2}`;$('courseRating').textContent=course.difficulty;$('courseWeatherLabel').textContent=COURSE_WEATHER_LABELS[effect]||effect.toUpperCase();$('courseSelectCounter').textContent=`${String(position+1).padStart(2,'0')} / ${String(count).padStart(2,'0')}`;$('courseDockPosition').textContent=String(position+1).padStart(2,'0');$('courseDockTotal').textContent=`/ ${String(count).padStart(2,'0')}`;
  $('courseFeatureChips').innerHTML=[meta.surface,`${ramps} JUMP RAMPS`,`${tunnels} TUNNELS`,graph?'SPLIT ROUTE':'ONE WAY'].map(label=>`<span>${label}</span>`).join('');
  const left=graph?.branches?.left,right=graph?.branches?.right;$('courseLeftRoute').textContent=left?.label||'STANDARD LINE';$('courseRightRoute').textContent=right?.label||'STANDARD LINE';$('courseLeftMetric').textContent=left?`${left.perk} · ${left.timeDelta>0?'+':''}${left.timeDelta}m`:'NO BRANCH';$('courseRightMetric').textContent=right?`${right.perk} · ${right.timeDelta>0?'+':''}${right.timeDelta}m`:'NO BRANCH';
  buildCourseWeather(effect);renderCourseZoneSequence(index);updateCourseMusicPreviewUI(index);updateCupCoursePreview(index);courseCarousel.revealStart=performance.now();
  document.querySelectorAll('.course-card').forEach(card=>{const active=Number(card.dataset.virtualIndex)===courseCarousel.virtualIndex;card.classList.toggle('selected',active);card.setAttribute('aria-selected',String(active));const badge=card.querySelector('.course-card-status');if(badge)badge.textContent=active?'NOW VIEWING':'PREVIEW'});
}
function hydrateCourseCardWindow(center=courseCarousel.virtualIndex){const radius=deliveryProfile().courseRadius;let hydrated=0;document.querySelectorAll('#courseGrid .course-card').forEach(card=>{if(Math.abs(Number(card.dataset.virtualIndex)-center)>radius)return;const image=card.querySelector('img'),course=courseData[Number(card.dataset.courseIndex)];if(image&&course){assignDeliveryImage(image,course.art,'selected-course');hydrated++}});const rail=$('courseGrid');if(rail){rail.dataset.deliveryHydrated=String(hydrated);rail.dataset.deliveryTotal=String(rail.querySelectorAll('.course-card img').length);rail.dataset.deliveryRadius=String(radius)}return hydrated}
function setupCourseGrid(){
  const rail=$('courseGrid');rail.innerHTML='';courseCarousel.indexes=visibleCourseIndexes();const count=courseCarousel.indexes.length,position=coursePosition(state.selectedCourse);courseCarousel.virtualIndex=count+position;
  for(let cycle=0;cycle<3;cycle++)courseCarousel.indexes.forEach((courseIndex,positionIndex)=>{const course=courseData[courseIndex],virtualIndex=cycle*count+positionIndex,active=virtualIndex===courseCarousel.virtualIndex,button=document.createElement('button');button.type='button';button.className='course-card'+(active?' selected':'')+(course.debugOnly?' debug-course':'');button.dataset.courseIndex=String(courseIndex);button.dataset.virtualIndex=String(virtualIndex);button.setAttribute('role','option');button.setAttribute('aria-selected',String(active));button.setAttribute('aria-setsize',String(count));button.setAttribute('aria-posinset',String(positionIndex+1));button.innerHTML=`<img data-delivery-src="${course.art}" alt="${course.name}" draggable="false" loading="lazy" decoding="async"><span class="course-number">${course.debugOnly?'DBG':String(positionIndex+1).padStart(2,'0')}</span><span class="course-card-status">${active?'NOW VIEWING':'PREVIEW'}</span><span class="course-copy"><strong>${course.name}</strong><small>${course.short} · ${course.style}</small></span>`;button.onclick=()=>{if(!courseCarousel.moved)selectCourse(courseIndex,true,virtualIndex)};rail.appendChild(button)});
  rail.addEventListener('scroll',()=>{updateCourseCarousel();if(courseCarousel.targetIndex!==null)return;clearTimeout(courseCarousel.settle);if(!courseCarousel.dragging)courseCarousel.settle=setTimeout(snapCourseCarousel,125)},{passive:true});rail.addEventListener('pointerdown',startCourseDrag);rail.addEventListener('pointermove',moveCourseDrag);rail.addEventListener('pointerup',endCourseDrag);rail.addEventListener('pointercancel',endCourseDrag);rail.addEventListener('wheel',wheelCourseCarousel,{passive:false});rail.addEventListener('keydown',keyCourseCarousel);$('coursePrev').onclick=()=>stepCourseCarousel(-1);$('courseNext').onclick=()=>stepCourseCarousel(1)
}
function cancelCourseTarget(){clearTimeout(courseCarousel.targetTimer);courseCarousel.targetIndex=null}
function courseCardContentLeft(rail,card){return card.offsetLeft-rail.offsetLeft}
function normalizeCourseLoop(){const count=courseCarousel.indexes.length;let virtualIndex=courseCarousel.virtualIndex;if(virtualIndex<count)virtualIndex+=count;else if(virtualIndex>=count*2)virtualIndex-=count;if(virtualIndex===courseCarousel.virtualIndex)return;courseCarousel.virtualIndex=virtualIndex;const rail=$('courseGrid'),card=rail.querySelector(`[data-virtual-index="${virtualIndex}"]`);if(card)rail.scrollLeft=Math.max(0,courseCardContentLeft(rail,card)-(rail.clientWidth-card.clientWidth)/2);updateCourseShowcase(state.selectedCourse);updateCourseCarousel()}
function centerSelectedCourseCard(smooth=false,virtualIndex=courseCarousel.virtualIndex){const rail=$('courseGrid'),card=rail.querySelector(`[data-virtual-index="${virtualIndex}"]`);if(!card)return;courseCarousel.virtualIndex=virtualIndex;const left=Math.max(0,courseCardContentLeft(rail,card)-(rail.clientWidth-card.clientWidth)/2);cancelAnimationFrame(courseCarousel.inertia);courseCarousel.velocity=0;cancelCourseTarget();if(smooth){courseCarousel.targetIndex=virtualIndex;rail.scrollTo({left,behavior:'smooth'});courseCarousel.targetTimer=setTimeout(()=>{courseCarousel.targetIndex=null;courseCarousel.velocity=0;normalizeCourseLoop();updateCourseCarousel()},620)}else{rail.scrollTo({left,behavior:'auto'});normalizeCourseLoop()}}
function updateCourseCarousel(){const rail=$('courseGrid'),center=rail.scrollLeft+rail.clientWidth/2,unit=Math.max(1,rail.querySelector('.course-card')?.offsetWidth||1),speed=clamp(courseCarousel.velocity*.5,-10,10);rail.querySelectorAll('.course-card').forEach(card=>{const cardCenter=courseCardContentLeft(rail,card)+card.offsetWidth/2,distance=(cardCenter-center)/unit,depth=Math.min(2.6,Math.abs(distance)),rotate=clamp(-distance*18+speed*Math.max(0,1-depth*.35),-39,39),scale=Math.max(.78,1-depth*.085);card.style.transform=`perspective(820px) translateZ(${-depth*48}px) rotateY(${rotate}deg) scale(${scale})`;card.style.opacity=String(Math.max(.48,1-depth*.2));card.style.zIndex=String(30-Math.round(depth*8))});hydrateCourseCardWindow(courseCarousel.virtualIndex)}
function nearestCourseIndex(){const rail=$('courseGrid'),center=rail.scrollLeft+rail.clientWidth/2;let result={index:state.selectedCourse,virtualIndex:courseCarousel.virtualIndex},best=Infinity;rail.querySelectorAll('.course-card').forEach(card=>{const distance=Math.abs(courseCardContentLeft(rail,card)+card.offsetWidth/2-center);if(distance<best){best=distance;result={index:Number(card.dataset.courseIndex),virtualIndex:Number(card.dataset.virtualIndex)}}});return result}
function snapCourseCarousel(){if(courseCarousel.dragging||courseCarousel.targetIndex!==null||Math.abs(courseCarousel.velocity)>.3)return;const nearest=nearestCourseIndex();selectCourse(nearest.index,false,nearest.virtualIndex);centerSelectedCourseCard(true,nearest.virtualIndex)}
function startCourseDrag(event){if(event.button!==undefined&&event.button!==0)return;const rail=$('courseGrid');cancelAnimationFrame(courseCarousel.inertia);clearTimeout(courseCarousel.settle);cancelCourseTarget();courseCarousel.dragging=true;courseCarousel.moved=false;courseCarousel.dragDistance=0;courseCarousel.pointerId=event.pointerId;courseCarousel.pointerType=event.pointerType||'mouse';courseCarousel.lastX=event.clientX;courseCarousel.lastTime=event.timeStamp;courseCarousel.velocity=0;rail.classList.add('dragging');rail.setPointerCapture?.(event.pointerId)}
function moveCourseDrag(event){if(!courseCarousel.dragging||event.pointerId!==courseCarousel.pointerId)return;const rail=$('courseGrid'),dx=event.clientX-courseCarousel.lastX,dt=Math.max(6,event.timeStamp-courseCarousel.lastTime),touch=courseCarousel.pointerType==='touch'||courseCarousel.pointerType==='pen';courseCarousel.dragDistance+=Math.abs(dx);if(courseCarousel.dragDistance>(touch?5:8))courseCarousel.moved=true;rail.scrollLeft-=dx;const instant=dx*16.667/dt,gain=touch?.68:.5;courseCarousel.velocity=courseCarousel.velocity*(1-gain)+instant*gain;courseCarousel.lastX=event.clientX;courseCarousel.lastTime=event.timeStamp;updateCourseCarousel();if(courseCarousel.moved)event.preventDefault()}
function endCourseDrag(event){if(!courseCarousel.dragging||event.pointerId!==courseCarousel.pointerId)return;const rail=$('courseGrid'),moved=courseCarousel.moved,touch=courseCarousel.pointerType==='touch'||courseCarousel.pointerType==='pen';courseCarousel.dragging=false;rail.classList.remove('dragging');rail.releasePointerCapture?.(event.pointerId);if(!moved){courseCarousel.velocity=0;setTimeout(()=>courseCarousel.moved=false,0);return}courseCarousel.velocity*=touch?1.18:1;const friction=touch?.943:.917,minimum=touch?.2:.3;const glide=()=>{courseCarousel.velocity*=friction;rail.scrollLeft-=courseCarousel.velocity;updateCourseCarousel();if(Math.abs(courseCarousel.velocity)>minimum)courseCarousel.inertia=requestAnimationFrame(glide);else{courseCarousel.velocity=0;snapCourseCarousel()}};courseCarousel.inertia=requestAnimationFrame(glide);setTimeout(()=>courseCarousel.moved=false,0)}
function wheelCourseCarousel(event){const rail=$('courseGrid'),delta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;if(!delta)return;event.preventDefault();cancelAnimationFrame(courseCarousel.inertia);cancelCourseTarget();rail.scrollLeft+=delta;courseCarousel.velocity=-delta*.15;updateCourseCarousel();clearTimeout(courseCarousel.settle);courseCarousel.settle=setTimeout(()=>{courseCarousel.velocity=0;snapCourseCarousel()},130)}
function keyCourseCarousel(event){if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const count=courseCarousel.indexes.length,virtualIndex=event.key==='Home'?count:event.key==='End'?count*2-1:courseCarousel.virtualIndex+(event.key==='ArrowRight'?1:-1),position=((virtualIndex%count)+count)%count;selectCourse(courseCarousel.indexes[position],true,virtualIndex)}
function stepCourseCarousel(direction){const count=courseCarousel.indexes.length,virtualIndex=courseCarousel.virtualIndex+direction,position=((virtualIndex%count)+count)%count;selectCourse(courseCarousel.indexes[position],true,virtualIndex)}
addEventListener('resize',()=>{if(state.mode==='course')requestAnimationFrame(()=>{centerSelectedCourseCard(false,courseCarousel.virtualIndex);updateCourseCarousel()})});
function selectCourse(i,center=true,virtualIndex=null){const count=courseCarousel.indexes.length,position=coursePosition(i);if(i!==state.selectedCourse)stopCourseMusicPreview();if(virtualIndex===null){const candidates=[position,position+count,position+count*2];virtualIndex=candidates.reduce((best,value)=>Math.abs(value-courseCarousel.virtualIndex)<Math.abs(best-courseCarousel.virtualIndex)?value:best,candidates[1])}courseCarousel.virtualIndex=virtualIndex;state.selectedCourse=i;activateCourse(i);updateCourseShowcase(i);if(center)centerSelectedCourseCard(true,virtualIndex);updateCourseCarousel();if(state.mode==='course')syncControllerFocus()}
function activateCourse(i){const course=courseData[i];activeCourse=course;trackNodes=course.nodes;trackArc=buildTrackArc(course);trackHeights=course.heights;tunnelSections=course.tunnels;rebuildTrackSampleCache();const signature=courseGeometrySignature(course,i);canvas.dataset.courseGeometryModel=signature.model;canvas.dataset.courseGeometrySignature=signature.hash;canvas.dataset.courseTrackSignature=signature.components.track;canvas.dataset.courseElevationSignature=signature.components.elevation;canvas.dataset.courseRouteSignature=signature.components.route;canvas.dataset.courseLandmarkSignature=signature.components.landmarks;environment=courseImages[i]||menuEnvironment;environmentCrop=course.crop;drawMinimap();ensureCourseEnvironment(i).then(image=>{if(state.selectedCourse===i)environment=image}).catch(error=>console.warn('Course environment load failed',error))}
function openCourseSelect(){window.NyanDelivery?.markPhase?.('selected-course');state.mode='course';showScreen('courseSelect');selectCourse(state.selectedCourse,false,courseCarousel.virtualIndex);hydrateCourseCardWindow();const settle=()=>{if(state.mode!=='course')return;centerSelectedCourseCard(false,courseCarousel.virtualIndex);hydrateCourseCardWindow(courseCarousel.virtualIndex);updateCourseCarousel()};requestAnimationFrame(settle);setTimeout(settle,180)}
function openDifficultySelect(){
  stopCourseMusicPreview();activateCourse(state.selectedCourse);const course=activeCourse,cup=state.raceMode==='cup',sequence=cupCourseSequence(state.selectedCourse),route=$('cupDifficultyRoute'),confirm=$('confirmDifficulty');
  $('difficultyCourseArt').src=course.art;$('difficultyCourseArt').alt=course.name;$('difficultyCourseName').textContent=cup?'3 COURSE CUP':course.name;$('difficultyCourseStyle').textContent=cup?'3コースの合計ポイントで総合優勝を競います':`${course.style} ・ コース難易度 ${course.difficulty}`;
  route?.classList.toggle('hidden',!cup);if(cup&&route)route.innerHTML=sequence.map((courseIndex,round)=>`<span><b>${round+1}</b><strong>${courseData[courseIndex].name}</strong><em>${round===0?'START':round===2?'FINAL':'NEXT'}</em></span>`).join('');
  if(confirm){confirm.querySelector('span').textContent=cup?'START 3 COURSE CUP!':'START GRAND PRIX!';confirm.querySelector('small').textContent=cup?'第1戦をスタート':'この難易度でスタート'}
  $('difficultySelect').dataset.raceMode=state.raceMode;$('difficultySelect').dataset.cupCourses=cup?sequence.map(index=>courseScenerySlugs[index]).join(','):'';
  state.mode='difficulty';applyDifficultySettings();showScreen('difficultySelect');if(settings.preloadCourseAssets)preloadRacePackage(state.selectedCourse,true).catch(()=>{});else setAssetPreloadStatus('idle','スタート時にレース素材を読み込みます',0)
}
function controllerFocusElement(element,scroll=false){document.querySelectorAll('.controller-focus').forEach(node=>node.classList.remove('controller-focus'));controllerUi.activeElement=element||null;if(!element)return;element.classList.add('controller-focus');try{element.focus({preventScroll:true})}catch{}if(scroll)element.scrollIntoView?.({block:'nearest',inline:'nearest',behavior:'smooth'})}
function visibleControllerElements(selector,root=document){return[...root.querySelectorAll(selector)].filter(element=>!element.disabled&&element.getClientRects().length&&getComputedStyle(element).visibility!=='hidden')}
function controllerList(mode=state.mode){if(mode==='menu')return[$('openSelect'),$('openCupSelect'),$('openSettings')].filter(Boolean);if(mode==='settings')return visibleControllerElements('button,input[type="range"]',$('settings'));if(mode==='soundTest')return visibleControllerElements('button',$('soundTest'));if(mode==='wardrobe')return visibleControllerElements('button',$('wardrobe'));if(mode==='cupStandings')return[$('cupToMenu'),$('cupNextRace')].filter(Boolean);if(mode==='finish')return[$('retry'),$('toMenu')].filter(Boolean);return[]}
function syncControllerFocus(){
  if(activeGamepadIndex===null){controllerFocusElement(null);setControllerConnected(false);return}
  if(state.mode==='kart'){controllerFocusElement($('setGrid')?.querySelector(`[data-virtual-index="${setCarousel.virtualIndex}"]`));return}
  if(state.mode==='course'){controllerFocusElement($('courseGrid')?.querySelector(`[data-virtual-index="${courseCarousel.virtualIndex}"]`),true);return}
  if(state.mode==='difficulty'){controllerFocusElement(document.querySelector(`[data-difficulty="${settings.raceDifficulty}"]`),true);return}
  const list=controllerList(),index=Math.max(0,Math.min(list.length-1,controllerUi.indexes[state.mode]||0));controllerUi.indexes[state.mode]=index;controllerFocusElement(list[index],state.mode==='settings')
}
function adjustControllerRange(input,direction){const step=Number(input.step)||1,min=Number(input.min)||0,max=Number(input.max)||100;input.value=String(Math.max(min,Math.min(max,Number(input.value)+(direction==='right'?step*5:-step*5))));input.dispatchEvent(new Event('input',{bubbles:true}))}
function spatialControllerMove(list,direction,current){if(!list.length)return null;if(!current||!list.includes(current))return list[0];const rect=current.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2,vector={left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]}[direction];let best=null,bestScore=Infinity;for(const candidate of list){if(candidate===current)continue;const box=candidate.getBoundingClientRect(),dx=box.left+box.width/2-cx,dy=box.top+box.height/2-cy,primary=dx*vector[0]+dy*vector[1];if(primary<=4)continue;const cross=Math.abs(dx*vector[1]-dy*vector[0]),score=primary+cross*1.7;if(score<bestScore){best=candidate;bestScore=score}}return best}
function moveControllerList(mode,direction){const list=controllerList(mode);if(!list.length)return;let index=controllerUi.indexes[mode]||0,current=list[index];if(mode==='settings'&&current?.matches('input[type="range"]')&&(direction==='left'||direction==='right')){adjustControllerRange(current,direction);return}const next=mode==='settings'?spatialControllerMove(list,direction,current):list[(index+(direction==='left'||direction==='up'?-1:1)+list.length)%list.length];if(!next)return;index=list.indexOf(next);controllerUi.indexes[mode]=index;controllerFocusElement(next,mode==='settings')}
function moveCourseController(direction){if(direction==='left')stepCourseCarousel(-1);else if(direction==='right')stepCourseCarousel(1)}
function navigateController(direction){
  if(screenTransitionState.busy)return;
  if(state.mode==='menu'||state.mode==='settings'||state.mode==='soundTest'||state.mode==='wardrobe'||state.mode==='cupStandings'||state.mode==='finish'){moveControllerList(state.mode,direction);return}
  if(state.mode==='kart'&&(direction==='left'||direction==='right')){const step=direction==='right'?1:-1,virtualIndex=setCarousel.virtualIndex+step,index=((virtualIndex%racers.length)+racers.length)%racers.length;selectRacerSet(index,true,virtualIndex);return}
  if(state.mode==='course'){moveCourseController(direction);return}
  if(state.mode==='difficulty'){const keys=Object.keys(DIFFICULTY_PROFILES),current=Math.max(0,keys.indexOf(settings.raceDifficulty)),step=direction==='left'||direction==='up'?-1:1;selectRaceDifficulty(keys[(current+step+keys.length)%keys.length])}
}
function activateControllerSelection(){
  if(screenTransitionState.busy)return;
  if(state.mode==='kart'){confirmRacerSet();return}if(state.mode==='course'){openDifficultySelect();return}if(state.mode==='difficulty'){$('confirmDifficulty')?.click();return}
  const list=controllerList(),element=controllerUi.activeElement&&list.includes(controllerUi.activeElement)?controllerUi.activeElement:list[controllerUi.indexes[state.mode]||0];if(element&&!element.matches('input[type="range"]'))element.click()
}
function controllerBack(){
  if(screenTransitionState.busy)return;
  if(captureAction){captureAction=null;renderKeyConfig();$('keyCaptureHelp').textContent='キー変更をキャンセルしました。';requestAnimationFrame(syncControllerFocus);return}
  if(state.mode==='kart')$('backKartSelect')?.click();else if(state.mode==='wardrobe')closeWardrobe();else if(state.mode==='course')$('backCourseSelect')?.click();else if(state.mode==='difficulty')$('backDifficultySelect')?.click();else if(state.mode==='soundTest')closeSoundTest();else if(state.mode==='settings')closeSettings();else if(state.mode==='cupStandings')$('cupToMenu')?.click();else if(state.mode==='finish')$('toMenu')?.click()
}
const UI_MOTION_SYSTEM={
  version:'nyan-motion-v1',
  duration:{instant:90,fast:160,standard:280,showcase:460},
  easing:{drive:'cubic-bezier(.16,.86,.24,1)',snap:'cubic-bezier(.18,1.12,.28,1)',glide:'cubic-bezier(.22,.72,.18,1)'}
};
function restartUiMotion(element,className,duration=UI_MOTION_SYSTEM.duration.standard){
  if(!element)return;
  element.classList.remove(className);void element.offsetWidth;element.classList.add(className);
  clearTimeout(element._nyanMotionTimer);element._nyanMotionTimer=setTimeout(()=>element.classList.remove(className),duration);
}
const uiMotionDirector={
  enter(element){if(!element)return;element.dataset.uiMotion='enter';restartUiMotion(element,'ui-screen-enter',UI_MOTION_SYSTEM.duration.showcase)},
  exit(element){if(!element)return;element.dataset.uiMotion='exit';restartUiMotion(element,'ui-screen-exit',UI_MOTION_SYSTEM.duration.standard)},
  select(element,kind='option'){if(!element)return;element.dataset.uiMotion=kind;restartUiMotion(element,'ui-select-pulse',UI_MOTION_SYSTEM.duration.standard)},
  confirm(element){restartUiMotion(element,'ui-confirm-pulse',UI_MOTION_SYSTEM.duration.standard)},
  settle(element){if(!element)return;element.dataset.motionState='settled';restartUiMotion(element,'ui-settle-pulse',UI_MOTION_SYSTEM.duration.standard)},
  reward(element){restartUiMotion(element,'ui-reward-pulse',720)}
};
window.NyanUiMotion={...UI_MOTION_SYSTEM,director:uiMotionDirector};
document.documentElement.dataset.uiMotionSystem=UI_MOTION_SYSTEM.version;
document.addEventListener('pointerdown',event=>{const target=event.target.closest('button,[role="option"]');if(target)target.classList.add('ui-pressed')},{passive:true});
for(const type of ['pointerup','pointercancel'])document.addEventListener(type,()=>document.querySelectorAll('.ui-pressed').forEach(element=>element.classList.remove('ui-pressed')),{passive:true});
document.addEventListener('click',event=>{const target=event.target.closest('.screen button');if(!target)return;if(target.matches('.primary-btn,.set-confirm-btn,.difficulty-card'))uiMotionDirector.confirm(target);else if(target.matches('.icon-btn,.course-card,.set-card,.wardrobe-card,.setting-toggle'))uiMotionDirector.select(target)},{capture:true});
const screenTransitionState={busy:false,serial:0,swapTimer:0,endTimer:0,count:0};
const SCREEN_FLOW_ORDER={menu:0,kartSelect:1,wardrobe:1.5,courseSelect:2,difficultySelect:3,race:4,cupStandings:5,finish:6,settings:7,soundTest:7};
function applyScreenState(next,id){
  document.querySelectorAll('.screen').forEach(screen=>screen.classList.remove('active','ui-screen-enter','ui-screen-exit'));
  if(next){next.classList.add('active');next.dataset.layoutContract=RESPONSIVE_LAYOUT_CONTRACT.model;uiMotionDirector.enter(next)}
  updateResponsiveLayoutContract();document.documentElement.dataset.activeScreen=id||'race';setControllerConnected(activeGamepadIndex!==null);requestAnimationFrame(syncControllerFocus)
}
function showScreen(id,options={}){
  const screens=[...document.querySelectorAll('.screen')],next=screens.find(screen=>screen.id===id)||null,current=screens.find(screen=>screen.classList.contains('active'))||null,nextName=id||'race',previousName=current?.id||document.documentElement.dataset.activeScreen||'',reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(options.immediate||reduced||current===next&&previousName===nextName||!previousName){clearTimeout(screenTransitionState.swapTimer);clearTimeout(screenTransitionState.endTimer);screenTransitionState.busy=false;applyScreenState(next,id);return}
  const serial=++screenTransitionState.serial,overlay=$('screenTransition'),backward=(SCREEN_FLOW_ORDER[nextName]??5)<(SCREEN_FLOW_ORDER[previousName]??0);screenTransitionState.busy=true;screenTransitionState.count++;clearTimeout(screenTransitionState.swapTimer);clearTimeout(screenTransitionState.endTimer);if(current)uiMotionDirector.exit(current);if(overlay){overlay.className=`screen-transition running ${backward?'backward':'forward'}`;overlay.dataset.from=previousName;overlay.dataset.to=nextName;void overlay.offsetWidth}document.documentElement.dataset.uiTransition='running';document.documentElement.dataset.uiTransitionModel='exit-wipe-enter-v1';document.documentElement.dataset.uiTransitionCount=String(screenTransitionState.count);
  screenTransitionState.swapTimer=setTimeout(()=>{if(serial!==screenTransitionState.serial)return;applyScreenState(next,id)},150);
  screenTransitionState.endTimer=setTimeout(()=>{if(serial!==screenTransitionState.serial)return;screenTransitionState.busy=false;if(overlay)overlay.className='screen-transition';delete document.documentElement.dataset.uiTransition;requestAnimationFrame(syncControllerFocus)},540)
}
function openSettings(){settingsReturnMode=state.mode;settingsReturnPaused=state.paused;if(state.mode==='race'){state.paused=true;pauseRaceMusic()}state.mode='settings';captureAction=null;renderKeyConfig();applyAudioSettings();applyVisualSettings();showScreen('settings')}
function closeSettings(){captureAction=null;saveSettings();const returnMode=settingsReturnMode;state.mode=returnMode;if(returnMode==='race'){const racer=racers[state.selected];window.NyanAudio?.startEngine(racer.slug,racer.set.stats,{silent:true});showScreen(null);state.paused=settingsReturnPaused;if(!state.paused)resumeRaceMusic()}else showScreen(returnMode==='kart'?'kartSelect':returnMode==='course'?'courseSelect':returnMode==='difficulty'?'difficultySelect':returnMode==='finish'?'finish':'menu')}
function updateDebugUI(){const enabled=state.debug.showCourseLimits,button=$('debugCourseBounds');button.setAttribute('aria-pressed',String(enabled));button.textContent=`コース枠 ${enabled?'ON':'OFF'}`;$('debugToggle').classList.toggle('active',enabled)}
function setDebugPanel(open){$('debugPanel').classList.toggle('hidden',!open);$('debugToggle').setAttribute('aria-expanded',String(open))}
function returnToMenu(){window.NyanDelivery?.markPhase?.('common-ui');environment=menuEnvironment;environmentCrop=null;state.mode='menu';pauseRaceMusic();window.NyanAudio?.stopEngine();setDebugPanel(false);setRaceMode('single');showScreen('menu');$('hud').classList.add('hidden');$('mobileControls').classList.add('hidden')}
$('openSelect').onclick=()=>{environment=menuEnvironment;environmentCrop=null;setRaceMode('single');openKartSelect()};
$('openCupSelect').onclick=()=>{environment=menuEnvironment;environmentCrop=null;setRaceMode('cup');openKartSelect()};
$('openSettings').onclick=openSettings;$('raceSettings').onclick=openSettings;$('closeSettings').onclick=closeSettings;$('settingsDone').onclick=closeSettings;
$('backKartSelect').onclick=returnToMenu;$('openWardrobe').onclick=openWardrobe;$('backWardrobe').onclick=closeWardrobe;$('wardrobeInspectionToggle').onclick=toggleWardrobeInspection;$('wardrobeRotationToggle').onclick=toggleWardrobeRotation;$('wardrobePrevFrame').onclick=()=>stepWardrobeInspectionFrame(-1);$('wardrobeNextFrame').onclick=()=>stepWardrobeInspectionFrame(1);$('wardrobeMarkIssue').onclick=toggleWardrobeFrameIssue;$('wardrobeExportCsv').onclick=exportWardrobeReviewCsv;$('wardrobeExportSheet').onclick=exportWardrobeReviewContactSheets;$('wardrobeEquip').onclick=equipWardrobeCostume;$('confirmSet').onclick=confirmRacerSet;$('backCourseSelect').onclick=()=>{stopCourseMusicPreview();openKartSelect()};$('confirmCourse').onclick=openDifficultySelect;$('courseMusicPreview').onclick=toggleCourseMusicPreview;$('backDifficultySelect').onclick=openCourseSelect;$('confirmDifficulty').onclick=startSelectedRaceMode;$('retry').onclick=retrySelectedRaceMode;
$('courseLoadingRetry').onclick=()=>startRace();
$('toMenu').onclick=returnToMenu;$('cupToMenu').onclick=returnToMenu;$('cupNextRace').onclick=startCupNextRace;
$('musicToggle').onclick=()=>{if(!raceBgm)playRaceMusic();else raceBgm.paused?resumeRaceMusic():pauseRaceMusic()};
$('debugToggle').onclick=()=>setDebugPanel($('debugPanel').classList.contains('hidden'));
$('debugClose').onclick=()=>setDebugPanel(false);
$('debugCourseBounds').onclick=()=>{state.debug.showCourseLimits=!state.debug.showCourseLimits;updateDebugUI()};
setupSettings();
setupSoundTest();
setupDifficultySelection();
setupSetGrid();
updateDebugUI();
addEventListener('click',event=>{const button=event.target.closest?.('button');if(!button||button.closest('#mobileControls')||button.id==='musicToggle'||button.id==='soundTestSignaturePlay'||button.dataset.soundMode==='signature')return;if(button.classList.contains('icon-btn')||button.id.includes('Close')||button.id.startsWith('back'))playSfx('uiBack');else if(button.matches('.set-card,.course-card,.difficulty-card,[data-difficulty],.sound-test-machine,[data-sound-mode]'))playSfx('uiMove');else playSfx('uiConfirm')});

function resetMiaNpc(){
  clearTimeout(miaNpc.cutInTimer);
  Object.assign(miaNpc,{active:false,triggered:false,cutInActive:false,leaderTime:0,distance:0,progress:0,lane:0,aiTargetLane:0,aiVelocity:0,hit:0,spin:0,shield:0,invincible:0,aiItem:null,aiItemAge:0,jumpY:0,jumpVelocity:0,airborne:false,landed:false,throwCooldown:0,throwAnim:0,throwDuration:0,throwReleaseAt:0,throwKind:null,throwReleased:false,routeChoice:null,routeLap:-1,routeMerged:false,routePhysicalProgress:0,routeNormalizedProgress:0,routeComparableDistance:0});
  const overlay=$('miaIntrusion');if(overlay)overlay.className='mia-intrusion hidden';
  if($('positionTotal'))$('positionTotal').textContent=`/${racers.length}`;
  delete canvas.dataset.miaBoss;delete canvas.dataset.miaGap;delete canvas.dataset.miaAirborne;delete canvas.dataset.miaFreezeDelta;delete canvas.dataset.miaThrow;delete canvas.dataset.miaThrowKind;delete canvas.dataset.miaThrowDifficulty;delete canvas.dataset.miaThrowTelegraphMs;delete canvas.dataset.miaThrowAnimationMs;delete canvas.dataset.miaThrowCooldownRange;delete canvas.dataset.miaThrowSafeGap;delete canvas.dataset.miaThrowTellStyle;delete canvas.dataset.miaThrowTellLabel;delete canvas.dataset.miaThrowTellColor;delete canvas.dataset.miaThrowTellAudio;delete canvas.dataset.miaThrowTellProgress;
}
const PICKUP_RESPAWN_MS={coin:720,item:1050,pad:520},PICKUP_HOLOGRAM_LEAD_MS=340;
function addGimmickObject(type,z,lane,meta={}){const object={type,z,lane,...meta};if(type==='ramp')object.hitBy=new Set();else Object.assign(object,{taken:false,takenBy:null,takenAt:-Infinity,respawnAt:0,respawnFxUntil:0,respawnCount:0,respawnSoundCount:0});state.objects.push(object);return object}
function addGimmickRow(base,row,layoutId,lap){const[z,type,patternName]=row,lanes=GIMMICK_LANE_PATTERNS[patternName]||GIMMICK_LANE_PATTERNS.center;for(let i=0;i<lanes.length;i++)addGimmickObject(type,base+z,lanes[i],{layoutId,layoutLap:lap,row:z,rowIndex:i})}
function addCourseRamp(base,at,lane,layoutId,lap,graph,length){
  if(!(at>24&&at<length-24))return;
  const z=base+at,geometry=graph&&at>=graph.start&&at<=graph.end?routeGeometryAt(z):null;
  // A single pre-fork lane can land in the median after the road separates.
  // Give each physical route its own reachable ramp, centred inside its lane.
  if(geometry?.fork>.08){
    for(const route of['left','right']){
      const path=geometry.branches[route],edgeInset=Math.min(.15,path.laneHalf*.34),branchLane=clamp(path.laneCenter+lane*.2,path.laneCenter-path.laneHalf+edgeInset,path.laneCenter+path.laneHalf-edgeInset);
      addGimmickObject('ramp',z,branchLane,{layoutId,layoutLap:lap,row:at,route,graphId:graph.id,routeRamp:true});
    }
    return;
  }
  addGimmickObject('ramp',z,lane,{layoutId,layoutLap:lap,row:at});
}
function spawnCourseGimmicks(length,laps){
  const layout=activeCourse?.gimmicks,graph=activeCourse?.routeGraph;if(!layout){for(let lap=0;lap<laps;lap++){const base=lap*length;addGimmickObject('coin',base+length*.32,0,{layoutId:'debug',layoutLap:lap});if(length>70)addGimmickObject('ramp',base+length*.58,0,{layoutId:'debug',layoutLap:lap})}return}
  for(let lap=0;lap<laps;lap++){
    const base=lap*length;for(const row of layout.rows)addGimmickRow(base,row,layout.id,lap);for(const[at,lane]of layout.ramps)addCourseRamp(base,at,lane,layout.id,lap,graph,length);
    if(graph){const branchZ=graph.start+(graph.end-graph.start)*.38,exitZ=graph.start+(graph.end-graph.start)*.7;for(const lane of[-1.08,-.86,-.64])addGimmickObject('item',base+branchZ,lane,{layoutId:layout.id,layoutLap:lap,route:'left',graphId:graph.id});for(const lane of[.64,.86,1.08])addGimmickObject('pad',base+branchZ,lane,{layoutId:layout.id,layoutLap:lap,route:'right',graphId:graph.id});for(const lane of[-1.02,-.72,.72,1.02])addGimmickObject('coin',base+exitZ,lane,{layoutId:layout.id,layoutLap:lap,route:lane<0?'left':'right',graphId:graph.id})}
  }
  canvas.dataset.gimmickLayout=layout.id;canvas.dataset.gimmickRows=String(layout.rows.length);canvas.dataset.gimmickRamps=String(layout.ramps.length);canvas.dataset.routeRamps=String(state.objects.filter(object=>object.type==='ramp'&&object.routeRamp).length);canvas.dataset.routeGraph=graph?.id||'none';
}
const COURSE_DYNAMIC_GIMMICKS=[
  {id:'cream-ribbon',label:'CREAM RIBBON',description:'クリーム帯で減速し、横方向へ少し滑る',specs:[{kind:'creamPatch',at:430,lane:-.28,range:18,width:.5,static:true,color:'#fff1c9'},{kind:'creamPatch',at:1210,lane:.32,range:18,width:.5,static:true,color:'#ffdbef'}]},
  {id:'steam-vents',label:'STEAM VENTS',description:'予告灯のあと蒸気が噴き上がりカートを跳ね上げる',specs:[{kind:'steamVent',at:650,lane:-.34,range:9,width:.34,cycle:5.8,phaseOffset:.4,color:'#ffd09a'},{kind:'steamVent',at:1460,lane:.36,range:9,width:.34,cycle:6.2,phaseOffset:2.1,color:'#9eeaff'}]},
  {id:'neon-shifter',label:'NEON SHIFTER',description:'発光壁が左右へ移動し、安全なレーンを変化させる',specs:[{kind:'neonWall',at:650,lane:0,range:7,width:.26,cycle:5.1,phaseOffset:.6,moving:true,blockingType:true,color:'#55f4ff'},{kind:'neonWall',at:1320,lane:0,range:7,width:.26,cycle:4.8,phaseOffset:2.4,moving:true,blockingType:true,color:'#ff4bdc'}]},
  {id:'deep-puddles',label:'DEEP PUDDLES',description:'深い水たまりで速度とグリップが落ちる',specs:[{kind:'deepPuddle',at:460,lane:-.3,range:17,width:.52,static:true,color:'#75dfff'},{kind:'deepPuddle',at:1190,lane:.34,range:17,width:.52,static:true,color:'#a5ecff'}]},
  {id:'candy-barrels',label:'CANDY BARRELS',description:'キャンディ樽がレーンを横切る',specs:[{kind:'candyBarrel',at:720,lane:0,range:8,width:.24,cycle:5.6,phaseOffset:.9,moving:true,blockingType:true,color:'#ff9bbd'},{kind:'candyBarrel',at:1510,lane:0,range:8,width:.24,cycle:6,phaseOffset:3,color:'#ffe06c'}]},
  {id:'cracking-ice',label:'CRACKING ICE',description:'薄氷でグリップが落ち、急操作すると滑る',specs:[{kind:'thinIce',at:700,lane:-.3,range:19,width:.56,static:true,color:'#c8f7ff'},{kind:'thinIce',at:1460,lane:.3,range:19,width:.56,static:true,color:'#b4d9ff'}]},
  {id:'ruins-traps',label:'RUINS TRAPS',description:'左右ルートで落下丸太と石扉が周期閉鎖する',specs:[]},
  {id:'petal-crosswind',label:'PETAL CROSSWIND',description:'桜吹雪が道路を横切りカートを押し流す',specs:[{kind:'petalGust',at:480,lane:0,range:24,width:1.3,fullWidth:true,cycle:5.4,phaseOffset:.8,color:'#ff9ec7'},{kind:'petalGust',at:1220,lane:0,range:24,width:1.3,fullWidth:true,cycle:5.9,phaseOffset:3.1,color:'#ffe3ef'}]},
  {id:'palace-waterjets',label:'PALACE WATERJETS',description:'水柱が交互に噴き上がりカートを浮かせる',specs:[{kind:'waterJet',at:780,lane:-.34,range:9,width:.34,cycle:5.6,phaseOffset:.3,color:'#7df8ff'},{kind:'waterJet',at:1530,lane:.34,range:9,width:.34,cycle:6.1,phaseOffset:2.7,color:'#ff96d1'}]},
  {id:'phantom-gates',label:'PHANTOM GATES',description:'半透明の門が実体化した瞬間だけ進路を塞ぐ',specs:[{kind:'ghostGate',at:680,lane:-.22,range:7,width:.34,cycle:5.2,phaseOffset:.5,blockingType:true,color:'#bf6cff'},{kind:'ghostGate',at:1200,lane:.24,range:7,width:.34,cycle:5.8,phaseOffset:2.6,blockingType:true,color:'#ff7a36'}]},
  {id:'moon-bounce',label:'MOON BOUNCE',description:'低重力床がカートを長い放物線へ打ち上げる',specs:[{kind:'lowGravity',at:620,lane:-.26,range:18,width:.5,static:true,color:'#74f5ff'},{kind:'lowGravity',at:1500,lane:.28,range:18,width:.5,static:true,color:'#b98cff'}]}
];
const COURSE_DYNAMIC_GIMMICK_SPRITE_ROWS={steamVent:0,candyBarrel:1,waterJet:2,ghostGate:3};
function courseDynamicGimmickFrame(hazard){
  const row=COURSE_DYNAMIC_GIMMICK_SPRITE_ROWS[hazard.kind];if(!Number.isInteger(row)||courseGimmickFrames.length!==16)return null;
  const col=hazard.kind==='candyBarrel'?Math.floor((state.elapsed*.0055+hazard.phaseOffset*1.7)%4+4)%4:clamp(Math.round(hazard.frame||0),0,3);return courseGimmickFrames[row*4+col]
}
const JUNGLE_ROUTE_HAZARDS=[
  {kind:'fallingLog',at:688,route:'left',cycle:5.6,phaseOffset:.15,label:'FALLING LOG'},
  {kind:'stoneGate',at:748,route:'right',cycle:6.2,phaseOffset:2.05,label:'STONE GATE'}
];
const ROUTE_HAZARD_DIFFICULTY={
  easy:{cycleScale:1.22,open:.38,warning:.22,closed:.2,reopening:.16},
  normal:{cycleScale:1,open:.32,warning:.16,closed:.28,reopening:.18},
  hard:{cycleScale:.82,open:.24,warning:.12,closed:.42,reopening:.18}
};
function spawnCourseDynamicGimmicks(length,laps){
  state.courseHazards=[];const profile=COURSE_DYNAMIC_GIMMICKS[state.selectedCourse];if(!profile){canvas.dataset.courseDynamicGimmick='none';canvas.dataset.courseDynamicGimmickCount='0';return}
  if(activeCourse?.immersiveJungle&&activeCourse?.routeGraph?.geometry?.model==='dual-corridor-projection-v1'){for(let lap=0;lap<laps;lap++)for(const spec of JUNGLE_ROUTE_HAZARDS){const z=lap*length+spec.at,geometry=routeGeometryAt(z),path=geometry?.branches[spec.route];if(!path)continue;state.courseHazards.push({...spec,z,lap,lane:path.laneCenter,baseLane:path.laneCenter,frame:0,phase:'open',blocking:false,telegraph:0,lastHit:new Map(),lastWarningCueCycle:-1,lastCloseCueCycle:-1})}}
  else for(let lap=0;lap<laps;lap++)for(const spec of profile.specs){const z=lap*length+spec.at;if(tunnelAt(z))continue;state.courseHazards.push({...spec,z,lap,baseLane:spec.lane,frame:0,phase:spec.static?'active':'open',blocking:false,telegraph:spec.static?1:0,lastHit:new Map(),lastWarningCueCycle:-1,lastCloseCueCycle:-1})}
  const jungleCount=activeCourse?.immersiveJungle?state.courseHazards.length:0,spriteDriven=profile.specs.some(spec=>Number.isInteger(COURSE_DYNAMIC_GIMMICK_SPRITE_ROWS[spec.kind]));canvas.dataset.jungleHazardCount=String(jungleCount);canvas.dataset.jungleHazardModel=jungleCount?'route-aware-cycle-v2':'off';canvas.dataset.routeHazardAudioModel=jungleCount?'typed-warning-close-v1':'off';canvas.dataset.routeHazardHapticModel=jungleCount?'difficulty-world-cue-v1':'off';canvas.dataset.courseDynamicGimmick=profile.id;canvas.dataset.courseDynamicGimmickLabel=profile.label;canvas.dataset.courseDynamicGimmickDescription=profile.description;canvas.dataset.courseDynamicGimmickCount=String(state.courseHazards.length);canvas.dataset.courseDynamicGimmickModel='shared-world-hazard-v1';canvas.dataset.courseDynamicGimmickAsset=spriteDriven?'gpt-image-2-uniform-4x4-v1':'procedural-surface-or-existing-gpt2';canvas.dataset.courseDynamicGimmickFrames=spriteDriven?'4x4-uniform-256':'n/a'
}
function spawnJungleRouteHazards(length,laps){spawnCourseDynamicGimmicks(length,laps)}
function jungleHazardCycleState(hazard){
  if(hazard.static)return{phase:'active',frame:2,blocking:false,telegraph:1,progress:1,cycleIndex:hazard.lap,effectiveCycle:0,warningSeconds:0};
  const profile=ROUTE_HAZARD_DIFFICULTY[settings.raceDifficulty]||ROUTE_HAZARD_DIFFICULTY.normal,effectiveCycle=hazard.cycle*profile.cycleScale,raw=state.elapsed*.001+hazard.phaseOffset,cycleIndex=Math.floor(raw/effectiveCycle),t=((raw%effectiveCycle)+effectiveCycle)%effectiveCycle/effectiveCycle,warningEnd=profile.open+profile.warning,closedEnd=warningEnd+profile.closed,reopeningEnd=closedEnd+profile.reopening;
  if(t<profile.open)return{phase:'open',frame:0,blocking:false,telegraph:0,progress:t/profile.open,cycleIndex,effectiveCycle,warningSeconds:effectiveCycle*profile.warning};
  if(t<warningEnd){const progress=(t-profile.open)/profile.warning;return{phase:'warning',frame:1,blocking:false,telegraph:progress,progress,cycleIndex,effectiveCycle,warningSeconds:effectiveCycle*profile.warning}}
  const solid=hazard.kind==='fallingLog'||hazard.kind==='stoneGate'||!!hazard.blockingType;
  if(t<closedEnd)return{phase:'closed',frame:2,blocking:solid,telegraph:1,progress:(t-warningEnd)/profile.closed,cycleIndex,effectiveCycle,warningSeconds:effectiveCycle*profile.warning};
  if(t<reopeningEnd){const progress=(t-closedEnd)/profile.reopening;return{phase:'reopening',frame:3,blocking:solid&&progress<.5,telegraph:1-progress,progress,cycleIndex,effectiveCycle,warningSeconds:effectiveCycle*profile.warning}}
  return{phase:'open',frame:0,blocking:false,telegraph:0,progress:(t-reopeningEnd)/Math.max(.001,1-reopeningEnd),cycleIndex,effectiveCycle,warningSeconds:effectiveCycle*profile.warning}
}
function emitJungleHazardFeedback(hazard){
  if(hazard.kind!=='fallingLog'&&hazard.kind!=='stoneGate')return;
  if(!state.running||state.paused||state.countdownActive)return;const player=racers[state.selected];if(!player||player.routeChoice!==hazard.route||player.routeLap!==hazard.lap)return;const gap=hazard.z-state.distance;if(gap<-14||gap>240)return;const variant=hazard.kind==='stoneGate'?1:0,pan=hazard.route==='left'?-.42:.42,difficulty=settings.raceDifficulty,hard=difficulty==='hard',easy=difficulty==='easy';
  if(hazard.phase==='warning'&&hazard.lastWarningCueCycle!==hazard.cycleIndex){hazard.lastWarningCueCycle=hazard.cycleIndex;playSfx('routeHazardWarn',{variant,pan,intensity:hard?1.08:easy?.82:.94});const delivered=pulseController(hard?110:easy?72:88,hard ? .38 : easy ? .2 : .29,hard ? .18 : easy ? .07 : .11);canvas.dataset.routeHazardWarnings=String(Number(canvas.dataset.routeHazardWarnings||0)+1);canvas.dataset.routeHazardLastCue=`${hazard.kind}:warning`;canvas.dataset.routeHazardHapticDelivered=String(delivered)}
  if(hazard.phase==='closed'&&hazard.lastCloseCueCycle!==hazard.cycleIndex){hazard.lastCloseCueCycle=hazard.cycleIndex;playSfx('routeHazardClose',{variant,pan,intensity:hard?1.16:easy?.88:1});const delivered=pulseController(hard?230:easy?145:185,hard ? .9 : easy ? .52 : .72,hard ? .62 : easy ? .31 : .46);state.shake=Math.max(state.shake,(hard?8:easy?4:6)*motionLevel(settings.screenShake));canvas.dataset.routeHazardClosures=String(Number(canvas.dataset.routeHazardClosures||0)+1);canvas.dataset.routeHazardLastCue=`${hazard.kind}:closed`;canvas.dataset.routeHazardHapticDelivered=String(delivered)}
}
function emitCourseGimmickFeedback(hazard){
  if(hazard.static||hazard.kind==='fallingLog'||hazard.kind==='stoneGate'||!state.running||state.paused||state.countdownActive)return;const gap=hazard.z-state.distance;if(gap<-12||gap>210)return;const pan=clamp(hazard.lane*.55,-.78,.78),variant=state.selectedCourse%6;
  if(hazard.phase==='warning'&&hazard.lastWarningCueCycle!==hazard.cycleIndex){hazard.lastWarningCueCycle=hazard.cycleIndex;playSfx('courseGimmickWarn',{variant,pan,intensity:.82});canvas.dataset.courseDynamicGimmickWarnings=String(Number(canvas.dataset.courseDynamicGimmickWarnings||0)+1)}
  if(hazard.phase==='closed'&&hazard.lastCloseCueCycle!==hazard.cycleIndex){hazard.lastCloseCueCycle=hazard.cycleIndex;playSfx('courseGimmickActive',{variant,pan,intensity:.92});pulseController(72,.18,.3);canvas.dataset.courseDynamicGimmickActivations=String(Number(canvas.dataset.courseDynamicGimmickActivations||0)+1)}
}
function refreshJungleRouteHazards(){
  let closed=0,warning=0;for(const hazard of state.courseHazards){Object.assign(hazard,jungleHazardCycleState(hazard));if(hazard.moving){const amplitude=hazard.kind==='candyBarrel'?.62:.5,rate=hazard.kind==='candyBarrel'?.00115:.00155;hazard.lane=hazard.baseLane+Math.sin(state.elapsed*rate+hazard.phaseOffset)*amplitude}emitJungleHazardFeedback(hazard);emitCourseGimmickFeedback(hazard);if(hazard.blocking)closed++;if(hazard.telegraph>0)warning++}
  canvas.dataset.jungleHazardClosed=String(closed);canvas.dataset.jungleHazardWarning=String(warning);canvas.dataset.jungleHazardStates=state.courseHazards.map(hazard=>`${hazard.kind}:${hazard.phase}`).join(',');canvas.dataset.courseDynamicGimmickStates=canvas.dataset.jungleHazardStates;canvas.dataset.routeHazardDifficulty=settings.raceDifficulty;canvas.dataset.routeHazardCycleSeconds=state.courseHazards.filter(hazard=>hazard.cycle).map(hazard=>`${hazard.kind}:${hazard.effectiveCycle?.toFixed(2)}`).join(',');canvas.dataset.routeHazardWarningMs=state.courseHazards.filter(hazard=>hazard.cycle).map(hazard=>`${hazard.kind}:${Math.round((hazard.warningSeconds||0)*1000)}`).join(',')
}
function jungleHazardPace(racer){
  if(!state.courseHazards.length||!racer)return 1;let factor=1;
  for(const hazard of state.courseHazards){if(hazard.route&&(hazard.route!==racer.routeChoice||hazard.lap!==racer.routeLap))continue;if(!hazard.route&&Math.floor(Math.max(0,racer.distance)/raceLength())!==hazard.lap)continue;const gap=hazard.z-racer.distance;if(gap<0||gap>110)continue;const active=hazard.static||hazard.phase==='closed'||hazard.phase==='warning';if(!active||hazard.kind==='lowGravity')continue;const laneRisk=hazard.fullWidth||Math.abs(hazard.lane-racer.lane)<(hazard.width||.3)+.16;if(!laneRisk)continue;const approach=clamp(gap/110,0,1),solid=hazard.blocking||['steamVent','waterJet'].includes(hazard.kind),candidate=solid?.3+approach*.5:.62+approach*.32;factor=Math.min(factor,candidate)}
  return factor
}
function courseGimmickAvoidanceLane(racer,routeMin=-.82,routeMax=.82){
  const harmful=state.courseHazards.filter(hazard=>hazard.kind!=='lowGravity'&&!hazard.fullWidth&&(hazard.static||hazard.phase==='warning'||hazard.phase==='closed')&&(!hazard.route||(hazard.route===racer.routeChoice&&hazard.lap===racer.routeLap))&&hazard.z-racer.distance>12&&hazard.z-racer.distance<92).sort((a,b)=>a.z-b.z)[0];if(!harmful)return null;const center=(routeMin+routeMax)*.5,clearance=(harmful.width||.3)+.18,target=harmful.lane>=center?Math.min(harmful.lane-clearance,routeMax-.06):Math.max(harmful.lane+clearance,routeMin+.06);return clamp(target,routeMin+.04,routeMax-.04)
}
function courseGimmickMatchesRacer(hazard,racer){
  if(hazard.route&&(racer.routeChoice!==hazard.route||racer.routeLap!==hazard.lap))return false;if(!hazard.route&&Math.floor(Math.max(0,racer.distance)/raceLength())!==hazard.lap)return false;if(racer.invincible>0||racer.airborne)return false;const active=hazard.static||hazard.phase==='closed';if(!active||Math.abs(racer.distance-hazard.z)>(hazard.range||8.5))return false;return hazard.fullWidth||Math.abs(racer.lane-hazard.lane)<(hazard.width||.3)
}
function markCourseGimmickHit(hazard,racer){
  const key=racer.slug||'racer',cycle=hazard.static?`lap-${hazard.lap}`:hazard.cycleIndex;if(hazard.lastHit.get(key)===cycle)return false;hazard.lastHit.set(key,cycle);return true
}
function applyPlayerCourseGimmick(hazard,dt,player){
  const continuous=['creamPatch','deepPuddle','thinIce','petalGust'].includes(hazard.kind),fresh=continuous||markCourseGimmickHit(hazard,player);if(!fresh)return;const color=hazard.color||activeCourse.theme.accent,anchorX=innerWidth*.5+clamp(hazard.lane-state.x,-1,1)*innerWidth*.2;
  if(hazard.kind==='creamPatch'){state.speed*=Math.exp(-1.25*dt);state.weatherSlip+=Math.sign(state.x-hazard.lane||1)*.075*dt}
  else if(hazard.kind==='deepPuddle'){state.speed*=Math.exp(-.95*dt);state.weatherSlip=clamp(state.weatherSlip+state.steer*.13*dt,-.36,.36);if(Math.random()<dt*8)burst(anchorX,innerHeight*.82,2,color,1)}
  else if(hazard.kind==='thinIce'){state.weatherSlip=clamp(state.weatherSlip+state.steer*.24*dt+Math.sin(state.elapsed*.012)*.035*dt,-.42,.42);state.speed*=Math.exp(-.18*dt)}
  else if(hazard.kind==='petalGust'){const direction=Math.sin(state.elapsed*.0011+hazard.phaseOffset)>=0?1:-1;state.x+=direction*.38*dt;state.weatherSlip=clamp(state.weatherSlip+direction*.08*dt,-.38,.38)}
  else if(hazard.kind==='lowGravity'){if(!state.airborne){state.airborne=true;state.jumpY=1;state.jumpVelocity=188+state.speed*.11;state.jumpView=Math.max(state.jumpView,.18);state.turbo=Math.max(state.turbo,.55);playSfx('ramp',{intensity:.78});pulseController(110,.24,.38);toast('MOON BOUNCE!')}}
  else if(hazard.kind==='steamVent'||hazard.kind==='waterJet'){if(!state.airborne){state.airborne=true;state.jumpY=1;state.jumpVelocity=hazard.kind==='waterJet'?205:168;state.speed*=.86;state.shake=Math.max(state.shake,8);playSfx('courseGimmickHit',{variant:state.selectedCourse%6,intensity:1});pulseController(145,.44,.55);toast(hazard.kind==='waterJet'?'WATER JET!':'STEAM BURST!');burst(anchorX,innerHeight*.75,18,color,2)}}
  else{state.speed*=hazard.kind==='ghostGate'?.48:.38;state.distance=Math.min(state.distance,hazard.z-3.8);state.progress=state.distance/raceLength();player.distance=state.distance;player.progress=state.progress;player.hit=.58;state.shake=Math.max(state.shake,13);state.collisionCooldown=Math.max(state.collisionCooldown,.65);playSfx('courseGimmickHit',{variant:state.selectedCourse%6,intensity:1.08});pulseController(175,.68,.48);toast(COURSE_DYNAMIC_GIMMICKS[state.selectedCourse]?.label||'COURSE GIMMICK');burst(anchorX,innerHeight*.74,18,color,2)}
  if(!continuous){canvas.dataset.courseDynamicGimmickHits=String(Number(canvas.dataset.courseDynamicGimmickHits||0)+1);canvas.dataset.courseDynamicGimmickLastHit=`${hazard.kind}:player`}
}
function applyAiCourseGimmick(hazard,dt,racer){
  const continuous=['creamPatch','deepPuddle','thinIce','petalGust'].includes(hazard.kind);if(!continuous&&!markCourseGimmickHit(hazard,racer))return;
  if(hazard.kind==='creamPatch')racer.aiVelocity*=Math.exp(-1.05*dt);else if(hazard.kind==='deepPuddle')racer.aiVelocity*=Math.exp(-.78*dt);else if(hazard.kind==='thinIce'){racer.lane+=Math.sin(state.elapsed*.01+racer.aiDecisionSeed)*.08*dt;racer.aiVelocity*=Math.exp(-.12*dt)}else if(hazard.kind==='petalGust')racer.lane+=(Math.sin(state.elapsed*.0011+hazard.phaseOffset)>=0?1:-1)*.3*dt;else if(hazard.kind==='lowGravity'){if(!racer.airborne){racer.airborne=true;racer.jumpY=1;racer.jumpVelocity=170;racer.aiBoost=Math.max(racer.aiBoost||0,.45)}}else if(hazard.kind==='steamVent'||hazard.kind==='waterJet'){if(!racer.airborne){racer.airborne=true;racer.jumpY=1;racer.jumpVelocity=hazard.kind==='waterJet'?184:150;racer.aiVelocity*=.84}}else{racer.aiVelocity*=hazard.kind==='ghostGate'?.56:.42;racer.distance=Math.min(racer.distance,hazard.z-3.4);racer.progress=racer.distance/raceLength();racer.hit=Math.max(racer.hit,.62);racer.spin=Math.max(racer.spin,.25)}
}
function resolveJungleRouteHazards(dt=1/60){
  if(!state.courseHazards.length)return;const player=racers[state.selected],contestants=raceContestants();for(const hazard of state.courseHazards)for(const racer of contestants){if(!courseGimmickMatchesRacer(hazard,racer))continue;if(racer===player)applyPlayerCourseGimmick(hazard,dt,player);else applyAiCourseGimmick(hazard,dt,racer);if(hazard.kind==='fallingLog'||hazard.kind==='stoneGate'){canvas.dataset.jungleHazardHits=String(Number(canvas.dataset.jungleHazardHits||0)+1);canvas.dataset.jungleHazardLastHit=`${hazard.kind}:${racer.slug||'racer'}`}}
}
function resetRace(){
  clearTimeout(finishRace.timer);
  cancelResultTally();
  resetMiaNpc();
  resetAdaptiveQualitySamples();
  nearbyRivalAudioSlugs=new Set();canvas.dataset.rivalAudioCount='0';canvas.dataset.rivalAudio='';canvas.dataset.rivalAudioPan='';
  Object.assign(state,{running:false,paused:false,finish:false,finishTime:0,finishCoast:0,finishOrder:null,elapsed:0,lap:1,progress:0,distance:0,speed:0,x:0,steer:0,boosting:false,turbo:0,drift:0,driftLevel:0,item:null,shield:0,invincible:0,coins:0,raceWalletEarned:0,raceWalletStart:playerProgress.coins,finishCoinBonus:0,resultRecord:null,shake:0,rank:6,lastRank:6,weatherSlip:0,weatherSurface:'dry',trackCurve:0,centrifugal:0,surface:'road',trackMaterial:'asphalt',offroadAmount:0,suspension:0,suspensionVelocity:0,jumpY:0,jumpVelocity:0,jumpView:0,landingBounce:0,landingBounceVelocity:0,airborne:false,cameraHeading:trackSample(0).heading,cameraLane:0,routeCameraVelocity:0,flash:0,collisionCooldown:3,objects:[],courseHazards:[],particles:[],collectFx:[],projectiles:[],snowTracks:[],snowTrackCursor:{},countdownActive:true,startCharge:0,startPenalty:false,raceDifficulty:settings.raceDifficulty,raceRewards:[],overtakeUiCooldown:0,rocketWarningCooldown:0,routeChoice:null,routeLap:-1,routeMerged:false,routeCameraElevation:0,routeSelectionPulse:0,routeSelectionSide:null,routeSelectionLap:-1,routeSelectionSerial:0,finalLapShown:false});
  resetBiomeZoneTransition();
  Object.assign(catCanReveal,{active:false,time:0,final:null,lastFrame:-1});drawHeldItem();
  Object.assign(surfaceHaptics,{wasSliding:false,cooldown:0,count:0,lastSurface:'dry'});clearSignatureHaptics();Object.assign(signatureFeedbackState,{life:0,duration:0,strength:0,family:'none',cue:'none',racer:'none'});canvas.dataset.hapticModel='slip-onset-v1';canvas.dataset.hapticCount='0';canvas.dataset.hapticEnabled=String(!!settings.controllerVibration);canvas.dataset.signatureFeedbackModel='color-audio-haptic-v1';canvas.dataset.signatureFeedbackFamily='none';canvas.dataset.signatureFeedbackCue='none';canvas.dataset.signatureFeedbackLife='0';canvas.dataset.routeHazardWarnings='0';canvas.dataset.routeHazardClosures='0';canvas.dataset.routeHazardLastCue='none';canvas.dataset.routeHazardHapticDelivered='false';
  const overtake=$('overtakeCallout'),lockWarning=$('lockOnWarning'),signatureCallout=$('signatureCallout'),zoneCallout=$('zoneEntryCallout');if(overtake)overtake.className='overtake-callout';if(lockWarning)lockWarning.className='lock-on-warning';if(signatureCallout)signatureCallout.className='signature-callout';if(zoneCallout){zoneCallout.className='zone-entry-callout';zoneCallout.setAttribute('aria-hidden','true')}clearTimeout(showBiomeZoneCallout.timer);canvas.dataset.biomeZoneCalloutCount='0';$('hud')?.classList.remove('rocket-locked');clearTimeout(showFinalLapCallout.t);clearTimeout(showSignatureCallout.timer);if($('finalLapCallout'))$('finalLapCallout').className='final-lap-callout';clearRaceTutorial();
  $('itemIcon')?.closest('.item-box')?.classList.remove('ready','opening');$('goalFx')?.classList.add('hidden');$('app').classList.remove('goal-slow');$('finish')?.classList.remove('cup-final');const cupHud=$('cupRaceHud');cupHud?.classList.toggle('hidden',!cupState.active);if(cupHud&&cupState.active)cupHud.textContent=`3 COURSE CUP · RACE ${cupState.results.length+1}/${CUP_RACE_COUNT}`;
  const lanePattern=[-.62,.62,-.31,.31,0,-.7,.7,-.18,.18],length=raceLength(),laps=raceLaps();let ai=0;
  racers.forEach((r,i)=>{const player=i===state.selected,trait=r.trait,personality=r.aiPersonality;r.distance=player?0:38-ai*5.8;r.progress=r.distance/length;r.lane=player?0:lanePattern[ai%lanePattern.length];r.aiTargetLane=r.lane;r.laneTimer=(.48+(ai%4)*.16)*personality.rhythm;r.aiDecisionSeed=(i*7+state.selectedCourse*3)%11;r.aiBoostCooldown=1.1+(i%5)*.23;r.aiPassCommit=0;r.aiPassTarget=null;r.hit=0;r.spin=0;r.shield=0;r.invincible=0;r.aiSpeed=(136+r.set.stats.speed*.26+(ai%6)*2.2)*trait.topSpeed;r.aiAcceleration=trait.acceleration;r.aiVelocity=0;r.aiCoins=0;r.aiItem=null;r.aiItemAge=0;r.aiBoost=0;r.jumpY=0;r.jumpVelocity=0;r.airborne=false;r.lastPlayerGap=r.distance;r.routeChoice=null;r.routeLap=-1;r.routeMerged=false;r.routePhysicalProgress=0;r.routeNormalizedProgress=0;r.routeComparableDistance=r.distance;r.signatureActive=0;r.signatureCooldown=player?3.2:4.2+ai*.42;r.signatureUseCount=0;r.signaturePulse=0;r.signatureReason='';ai+=player?0:1});
  canvas.dataset.aiPersonalities=[...new Set(racers.map(r=>r.aiPersonality.key))].join(',');
  canvas.dataset.rocketLaunches='0';canvas.dataset.rocketHits='0';canvas.dataset.rocketOwner='';canvas.dataset.rocketTarget='';canvas.dataset.rocketHitOwner='';canvas.dataset.rocketHitTarget='';canvas.dataset.rocketHitBlocked='false';
  canvas.dataset.rocketWarning='none';canvas.dataset.aiItemUses='0';canvas.dataset.aiLastItem='';canvas.dataset.aiLastItemUser='';canvas.dataset.catCanModel='random-open-reveal-v1';canvas.dataset.catCanGear='none';canvas.dataset.catCanOpening='false';canvas.dataset.catCanUses='0';canvas.dataset.aiCatCanRolls='0';canvas.dataset.coinPickupReward=String(COIN_PICKUP_REWARD);canvas.dataset.signatureModel='29-unique-shared-runtime-v1';canvas.dataset.signatureCount=String(Object.keys(RACER_SIGNATURES).length);canvas.dataset.signatureActivations='0';canvas.dataset.signatureLast='none';
  canvas.dataset.pickupRespawns='0';canvas.dataset.pickupReserved='0';canvas.dataset.pickupRespawnModel='fast-backmarker-v1';canvas.dataset.itemRespawnMs=String(PICKUP_RESPAWN_MS.item);canvas.dataset.pickupHolograms='0';canvas.dataset.pickupHologramModel='pre-respawn-forecast-v2';canvas.dataset.pickupHologramLeadMs=String(PICKUP_HOLOGRAM_LEAD_MS);canvas.dataset.pickupRespawnAudioModel='stereo-world-v1';canvas.dataset.pickupRespawnAudioCount='0';canvas.dataset.pickupRespawnAudioPan='0.000';canvas.dataset.weatherTrail='dry';canvas.dataset.weatherTrailParticles='0';
  canvas.dataset.jungleHazardHits='0';canvas.dataset.jungleHazardLastHit='none';canvas.dataset.jungleHazardAsset='gpt-image-2-spritesheet-v1';canvas.dataset.courseDynamicGimmickHits='0';canvas.dataset.courseDynamicGimmickLastHit='none';canvas.dataset.courseDynamicGimmickWarnings='0';canvas.dataset.courseDynamicGimmickActivations='0';canvas.dataset.courseDynamicGimmickGround='0';canvas.dataset.courseDynamicGimmickForeground='0';canvas.dataset.courseDynamicGimmickVisible='0';canvas.dataset.biomeVolumeSystem='off';canvas.dataset.biomeVolumeCourse='none';canvas.dataset.biomeVolumeFar='0';canvas.dataset.biomeVolumeMid='0';canvas.dataset.biomeVolumeNear='0';canvas.dataset.biomeVolumeClusters='0';
  spawnCourseGimmicks(length,laps);
  spawnCourseDynamicGimmicks(length,laps);
  const routeGuide=$('routeGuide');if(routeGuide)routeGuide.className='route-guide';
  drawHeldItem();updateHud();buildRank(true);
}
function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
let introRivalIntel=new Map();
function buildCourseRivalProfile(course=activeCourse,index=state.selectedCourse){
  const length=course?.finishDistance||TRACK_LENGTH,samples=72,bends=[];
  for(let i=0;i<samples;i++)bends.push(Math.abs(trackBend(i/samples)));
  const corner=clamp(bends.reduce((sum,value)=>sum+value,0)/samples*1.42,0,1),straight=clamp(bends.filter(value=>value<.2).length/samples*.72+(1-corner)*.28,0,1),heightValues=course?.heights||[0],hill=clamp((Math.max(...heightValues)-Math.min(...heightValues))/1.5,0,1);
  const layout=course?.gimmicks||{},ramps=layout.ramps?.length||0,pads=(layout.rows||[]).filter(row=>row[1]==='pad').length,items=(layout.rows||[]).filter(row=>row[1]==='item').length,tunnels=course?.tunnels?.length||0,branch=course?.routeGraph?1:0,surfaceKinds=new Set((course?.surfaceSections||[]).map(section=>section.material)),surface=clamp((surfaceKinds.size-1)/3,0,1);
  const weatherType=COURSE_AMBIENCE_PROFILES[index]?.effects?.[0]?.type||'clear',weather=['rain','snow'].includes(weatherType)?1:(['sakura','fireflies'].includes(weatherType) ? .2 : 0),gimmick=clamp((ramps*1.15+pads+items*.35+tunnels*.52+branch*1.25)/7,0,1),boost=clamp(straight*.34+ramps*.18+pads*.2+branch*.14,0,1),technical=clamp(corner*.42+gimmick*.34+hill*.12+surface*.12,0,1),offroad=course?.immersiveJungle?1:(surfaceKinds.has('jungleMud') ? .72 : 0);
  return{course,index,length,corner,straight,hill,ramps,pads,items,tunnels,branch,surface,weather,weatherType,gimmick,boost,technical,offroad};
}
function racerCourseAffinity(racer,profile){
  const stats=racer.set.stats,weights={speed:.55+profile.straight*.92,accel:.5+profile.hill*.48+profile.technical*.22,handling:.52+profile.corner*1.12+profile.weather*.18,boost:.48+profile.boost*.9,technique:.5+profile.gimmick*.62+profile.branch*.46+profile.surface*.3},weightTotal=Object.values(weights).reduce((sum,value)=>sum+value,0);
  let score=Object.entries(weights).reduce((sum,[key,weight])=>sum+(stats[key]||75)*weight,0)/weightTotal;
  const signature=racer.signature||{},performance=signature.performance||{},trigger=signature.trigger,ai=racer.aiPersonality||{},signatureBonus=(Math.max(0,(performance.weather||1)-1)*profile.weather*18)+(Math.max(0,(performance.grip||1)-1)*(profile.corner+profile.weather)*9)+(Math.max(0,(performance.drift||1)-1)*profile.corner*10)+(Math.max(0,(performance.boost||1)-1)*profile.boost*11)+(Math.max(0,(performance.speed||1)-1)*profile.straight*12)+(Math.max(0,(performance.air||1)-1)*clamp(profile.ramps/2,0,1)*12)+(Math.max(0,(performance.offroad||1)-1)*profile.offroad*30);
  const triggerBonus=trigger==='weather'?profile.weather*4.8:trigger==='corner'?profile.corner*4.4:trigger==='route'?profile.branch*4.6:trigger==='boost'?profile.boost*4.2:trigger==='airborne'?clamp(profile.ramps/2,0,1)*4.4:trigger==='offroad'?profile.offroad*4.6:trigger==='leader'?profile.straight*2.2:0,aiBonus=ai.key==='apex'?profile.corner*3.7:ai.key==='charger'?profile.straight*3.4:ai.key==='booster'?profile.boost*3.6:ai.key==='tactician'?(profile.gimmick+profile.branch)*2.2:ai.key==='sprinter'?(profile.hill+profile.technical)*1.7:0;
  score=score+signatureBonus+triggerBonus+aiBonus;
  const behavior={apex:'インを守る走りで差を詰める',charger:'外側から最高速で抜きに来る',booster:'出口でブーストを重ねてくる',tactician:'空いた安全ラインを先に取る',sprinter:'減速後の立ち上がりが速い'}[ai.key]||'安定したラインで追い上げる';
  const matches=[
    {value:profile.weather*(Math.max(0,(performance.weather||1)-1)*3+stats.handling/280+(trigger==='weather' ? .62 : 0)),tag:'WEATHER MATCH',copy:profile.weatherType==='snow'?'雪面でもグリップを残せる':'濡れた路面でも姿勢を崩しにくい'},
    {value:profile.offroad*(Math.max(0,(performance.offroad||1)-1)*3.4+(racer.trait.key==='technique' ? .65 : .18)+stats.technique/300),tag:'WILD MATCH',copy:'泥・木橋・荒れた路面への適応が高い'},
    {value:profile.corner*stats.handling/90,tag:'CURVE MATCH',copy:'連続カーブで高い旋回性能が生きる'},
    {value:profile.branch*stats.technique/170+profile.gimmick*.12+(trigger==='route' ? .42 : 0),tag:'ROUTE MATCH',copy:'分岐とギミックでライン判断が鋭い'},
    {value:profile.boost*stats.boost/90+profile.ramps*.14,tag:'BOOST MATCH',copy:'加速床とジャンプ後の伸びが強い'},
    {value:profile.hill*stats.accel/92,tag:'CLIMB MATCH',copy:'坂の減速後にすぐ速度を戻せる'},
    {value:profile.straight*stats.speed/90,tag:'SPEED MATCH',copy:'全開区間で最高速を長く維持できる'},
    {value:profile.tunnels*.15+profile.technical*stats.technique/110,tag:'TECH MATCH',copy:'視界の狭い区間でもラインが乱れにくい'}
  ].sort((a,b)=>b.value-a.value);
  const best=matches[0],match=Math.round(clamp(55+(score-65)*1.1,58,98)),reason=`${best.copy}うえ、${behavior}。`;
  return{score,match,tag:best.tag,reason,profile:profile.course?.short||'COURSE',feature:best.copy};
}
function pickIntroRivals(){
  const profile=buildCourseRivalProfile(),ranked=racers.map((r,i)=>({r,i,intel:racerCourseAffinity(r,profile)})).filter(entry=>entry.i!==state.selected).sort((a,b)=>b.intel.score-a.intel.score||a.i-b.i),selected=[];
  for(const entry of ranked){const duplicateType=selected.some(current=>current.r.aiPersonality.key===entry.r.aiPersonality.key);if(!duplicateType||selected.length>=2)selected.push(entry);if(selected.length===3)break}
  if(selected.length<3)for(const entry of ranked)if(!selected.includes(entry)&&selected.push(entry)===3)break;
  introRivalIntel=new Map(selected.map(entry=>[entry.r.slug,entry.intel]));
  canvas.dataset.introRivalProfile=`${profile.course.short}:${profile.weatherType}:${profile.corner.toFixed(2)}:${profile.gimmick.toFixed(2)}:${profile.branch}`;
  return selected.map(entry=>entry.r);
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
  const host=$('introRivals');
  host.className='intro-rivals';
  host.innerHTML=rivals.map((r,i)=>{
    const ai=r.aiPersonality,signature=r.signature,intel=introRivalIntel.get(r.slug)||racerCourseAffinity(r,buildCourseRivalProfile()),power=intel.match;
    return`<article class="intro-rival-card ${i===0?'featured':''}" style="--rival-color:${r.color};--power:${power}%;--enter-x:${i%2?112:-112}px;--enter-rotate:${i%2?-5:5}deg;--rest-y:${i===0?-9:0}px;--rest-scale:${i===0?1.035:1}" data-index="RIVAL 0${i+1}" data-course-match="${intel.match}" data-course-reason="${intel.reason}" aria-label="${r.name}、${ai.jp}、コース適性${intel.match}">
      <div class="rival-lock">${i===0?'MAIN TARGET':`RIVAL 0${i+1}`}</div>
      <div class="rival-portrait"><span class="rival-portrait-frame"><img src="${r.portrait}" alt="${r.name}"><canvas width="180" height="180" aria-label="${r.name}のレース用フェイス"></canvas></span><b>0${i+1}</b></div>
      <div class="rival-copy">
        <small>${ai.label}</small>
        <strong>${r.name}</strong>
        <span>${ai.jp}</span>
        <div class="rival-course-fit"><b>${intel.tag}</b><em>適性 ${intel.match}</em></div>
        <p><b>このコースで警戒</b>${intel.reason}</p>
        <div class="rival-skill"><b>固有能力</b><em>${signature?.jp||'スペシャルスキル'}</em></div>
      </div>
      <div class="rival-threat"><span>COURSE MATCH</span><i><b></b></i><em>${power}</em></div>
    </article>`;
  }).join('');
  canvas.dataset.introRivalCount=String(rivals.length);
  canvas.dataset.introRivalOrder=rivals.map(r=>r.slug).join(',');
  canvas.dataset.introRivalMatch=rivals.map(r=>introRivalIntel.get(r.slug)?.match||0).join(',');
  canvas.dataset.introRivalReason=rivals.map(r=>introRivalIntel.get(r.slug)?.tag||'none').join(',');
  drawIntroRivalPortraits(rivals);
}
function drawIntroRivalPortraits(rivals){
  const canvases=[...$('introRivals').querySelectorAll('.rival-portrait canvas')];
  rivals.forEach((racer,index)=>{
    const face=canvases[index];if(!face)return;const card=face.closest('.intro-rival-card'),fallback=face.previousElementSibling,costume=activeCostume(racer);if(card){card.dataset.racer=racer.slug;card.dataset.costume=costume.id}if(fallback){fallback.src=costume.select||racer.portrait;fallback.alt=`${racer.name} ${costume.name}`}
    ensureRacerFaceIcon(face,racer,'rival-intro').then(painted=>{if(painted&&face.isConnected)fallback?.classList.add('fallback-hidden')});
  });
}
async function revealIntroRivals(){
  const host=$('introRivals'),cards=[...host.querySelectorAll('.intro-rival-card')],reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  host.classList.add('reveal-started');
  canvas.dataset.introRivalModel='sequential-intelligence-v2';
  for(let index=0;index<cards.length;index++){
    cards[index].classList.add('revealed');
    canvas.dataset.introRivalReveal=String(index+1);
    playSfx('uiMove',{intensity:.52+index*.08});
    await sleep(reduced?30:360);
  }
  await sleep(reduced?70:720);
}
async function playRaceIntroSequence(){
  const overlay=$('raceIntro'),counter=$('introCount'),rivals=pickIntroRivals(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  overlay.className='race-intro course-phase';
  counter.textContent='';
  counter.className='intro-count';
  renderIntroCourse();
  await sleep(reduced?180:1450);
  overlay.className='race-intro rivals-phase';
  renderIntroRivals(rivals);
  await sleep(reduced?70:160);
  await revealIntroRivals();
  overlay.className='race-intro grid-phase';
  await sleep(reduced?160:1180);
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
  showBiomeZoneCallout(biomeVolumeZoneAt());
  startRaceTutorial();
}
function startSelectedRaceMode(){
  if(state.raceMode==='cup')beginCup(state.selectedCourse);else clearCupState();
  return startRace()
}
function retrySelectedRaceMode(){
  if(state.raceMode==='cup'||cupState.final){state.raceMode='cup';beginCup(cupState.startCourse||state.selectedCourse)}
  return startRace()
}
function startCupNextRace(){
  if(!cupState.active||cupState.results.length>=CUP_RACE_COUNT)return;
  const nextIndex=cupState.courseIndexes[cupState.results.length];state.selectedCourse=nextIndex;activateCourse(nextIndex);canvas.dataset.cupRound=String(cupState.results.length+1);return startRace()
}
async function startRace(){
  if(startRace.loading)return;startRace.loading=true;
  const fromResult=state.mode==='finish',fromCupStandings=state.mode==='cupStandings',button=fromCupStandings?$('cupNextRace'):fromResult?$('retry'):$('confirmDifficulty'),small=button.querySelector('small'),readyText=fromCupStandings?'次のコースへ':fromResult?'RETRY':state.raceMode==='cup'?'第1戦をスタート':'この難易度でスタート';button.disabled=true;small.textContent='RACE DATA LOADING...';showCourseLoading(state.selectedCourse);
  try{await Promise.all([preloadRacePackage(state.selectedCourse,!fromResult,renderCourseLoadingProgress),sleep(420)])}catch(error){startRace.loading=false;button.disabled=false;small.textContent='読み込みを再試行';failCourseLoading(error);toast('ASSET LOAD ERROR');return}
  button.disabled=false;small.textContent=readyText;activateCourse(state.selectedCourse);
  window.NyanDelivery?.markPhase?.('race-core');resetRace();$('finish').querySelector('.eyebrow').textContent=cupState.active?`3 COURSE CUP · RACE ${cupState.results.length+1}/${CUP_RACE_COUNT}`:activeCourse.short;state.mode='race';showScreen(null,{immediate:true});$('hud').classList.remove('hidden');canvas.dataset.raceMode=cupState.active?'cup':'single';canvas.dataset.cupRound=String(cupState.active?cupState.results.length+1:0);preloadRaceEnhancements(state.selectedCourse);
  const selected=racers[state.selected];window.NyanAudio?.startEngine(selected.slug,selected.set.stats);
  if(matchMedia('(pointer:coarse)').matches)$('mobileControls').classList.remove('hidden');
  playRaceMusic();await completeCourseLoading();startRace.loading=false;
  await playRaceIntroSequence();
}

function raceComparableDistance(racer){return Number(racer?.distance)||0}
function raceOrder(){return[...raceContestants()].sort((a,b)=>raceComparableDistance(b)-raceComparableDistance(a))}
function buildRank(instant=false){
  const panel=$('rankPanel'),sorted=raceOrder(),player=racers[state.selected],playerIndex=sorted.indexOf(player);if(!panel)return;canvas.dataset.rankListModel='keyed-flip-v1';if(!canvas.dataset.rankFlipCount)canvas.dataset.rankFlipCount='0';let shown=sorted.slice(0,6);
  if(!shown.includes(player)){shown=sorted.slice(0,4);shown.push(sorted[Math.max(4,playerIndex-1)],player);shown=[...new Set(shown)]}
  const existing=new Map([...panel.children].map(row=>[row.dataset.racer,row])),oldRects=new Map([...panel.children].map(row=>[row.dataset.racer,row.getBoundingClientRect()])),rows=[];
  for(const racer of shown){
    const key=racer===miaNpc?'mia-charme':racer.slug,row=existing.get(key)||document.createElement('div'),previousPosition=Number(row.dataset.position)||0,position=sorted.indexOf(racer)+1,gap=Math.round(racer.distance-player.distance),label=player===racer?'YOU':racer===miaNpc?'BOSS':`${gap>0?'+':''}${gap}m`;
    if(!row.dataset.racer){row.dataset.racer=key;row.innerHTML='<span class="pos"></span><canvas class="rank-face" width="68" height="68"></canvas><span class="rname"></span><b></b>'}
    row.className=`rank-row ${player===racer?'player':''}${racer===miaNpc?' boss':''}`;row.dataset.position=String(position);row.dataset.costume=racer===miaNpc?'boss':activeCostumeId(racer);row.querySelector('.pos').textContent=String(position);const face=row.querySelector('.rank-face');face.setAttribute('aria-label',`${racer.name} ${row.dataset.costume}`);ensureRacerFaceIcon(face,racer,'race-rank');row.querySelector('.rname').textContent=racer.name;row.querySelector('b').textContent=label;rows.push({row,key,previousPosition,position,isNew:!existing.has(key)})
  }
  panel.replaceChildren(...rows.map(entry=>entry.row));panel.dataset.order=rows.map(entry=>entry.key).join(',');
  if(instant)return;
  requestAnimationFrame(()=>rows.forEach(({row,key,previousPosition,position,isNew})=>{
    clearTimeout(row._rankFlipTimer);row.classList.remove('rank-flip','rank-up','rank-down','rank-row-enter');
    if(isNew||!oldRects.has(key)){restartUiMotion(row,'rank-row-enter',370);return}
    const dy=oldRects.get(key).top-row.getBoundingClientRect().top;if(Math.abs(dy)<1&&previousPosition===position)return;
    row.style.setProperty('--rank-flip-y',`${dy.toFixed(1)}px`);row.classList.add(position<previousPosition?'rank-up':'rank-down');void row.offsetWidth;row.classList.add('rank-flip');row._rankFlipTimer=setTimeout(()=>row.classList.remove('rank-flip','rank-up','rank-down'),490);canvas.dataset.rankFlipCount=String(Number(canvas.dataset.rankFlipCount||0)+1)
  }));
}
function fmt(ms){const m=Math.floor(ms/60000),s=Math.floor(ms/1000)%60,x=Math.floor(ms%1000);return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(x).padStart(3,'0')}`}
function updateHud(){
  $('lap').textContent=Math.min(raceLaps(),state.lap);$('lapTotal').textContent=`/${raceLaps()}`;$('timer').textContent='◷ '+fmt(state.elapsed);$('speed').textContent=Math.round(state.speed);$('currentPosition').textContent=state.rank;drawSpeedGauge();
  $('coins').textContent=String(state.coins).padStart(2,'0');const charge=state.drift>0?Math.min(100,state.drift/2.25*100):state.turbo>0?100:0;$('boostBar').firstElementChild.style.width=charge+'%';
  updateSignatureHud();drawMinimap();
}
function showFinalLapCallout(){
  const callout=$('finalLapCallout'),signatureHud=$('signatureHud'),overtake=$('overtakeCallout'),rankChange=$('rankChange'),signatureCallout=$('signatureCallout');if(!callout)return;
  clearTimeout(showOvertakeCallout.t);clearTimeout(announceRank.t);clearTimeout(showSignatureCallout.timer);overtake?.classList.remove('show');rankChange?.classList.remove('show','up','down');signatureCallout?.classList.remove('show');
  playSfx('finalLap',{intensity:1.08});signatureHud?.classList.add('broadcast-hidden');callout.classList.remove('show');void callout.offsetWidth;callout.classList.add('show');canvas.dataset.finalLapModel='compact-checker-broadcast-v1';canvas.dataset.broadcastPriority='final-lap-exclusive-v1';canvas.dataset.finalLapShows=String(Number(canvas.dataset.finalLapShows||0)+1);clearTimeout(showFinalLapCallout.t);showFinalLapCallout.t=setTimeout(()=>{callout.classList.remove('show');signatureHud?.classList.remove('broadcast-hidden');canvas.dataset.broadcastPriority='normal'},2350)
}

const raceTutorialState={active:false,index:0,stepStarted:0,transitioning:false,catCanUses:0,timer:0,forced:false};
const RACE_TUTORIAL_STEPS=[
  {label:'STEP 1 · DRIVE',title:'アクセルでスタート',copy:'アクセルを押してスピードを上げよう',key:()=>activeGamepadIndex!==null?'R2 / A':matchMedia('(pointer:coarse)').matches?'ACCEL':keyLabel(settings.bindings.accelerate),signal:()=>clamp(state.speed/58,0,1),done:()=>state.speed>=52,timeout:7000},
  {label:'STEP 2 · CORNER',title:'左右にラインを選ぶ',copy:'カーブの向きに合わせてステアしよう',key:()=>activeGamepadIndex!==null?'LEFT STICK':matchMedia('(pointer:coarse)').matches?'◀  ▶':`${keyLabel(settings.bindings.left)} / ${keyLabel(settings.bindings.right)}`,signal:()=>clamp(Math.abs(state.steer)/.42,0,1),done:()=>Math.abs(state.steer)>.3&&state.speed>36,timeout:8500},
  {label:'STEP 3 · TECHNIQUE',title:'ドリフト／猫缶ギア',copy:'ドリフトでターボをため、猫缶はアイテムキーで使おう',key:()=>activeGamepadIndex!==null?'LB / X':matchMedia('(pointer:coarse)').matches?'DRIFT / ITEM':`${keyLabel(settings.bindings.drift)} / ${keyLabel(settings.bindings.item)}`,signal:()=>clamp(Math.max(state.drift/.48,state.item?1:0,(Number(canvas.dataset.catCanUses)||0)>raceTutorialState.catCanUses?1:0),0,1),done:()=>state.drift>.32||state.item||(Number(canvas.dataset.catCanUses)||0)>raceTutorialState.catCanUses,timeout:10500}
];
function clearRaceTutorial(){
  clearTimeout(raceTutorialState.timer);Object.assign(raceTutorialState,{active:false,index:0,stepStarted:0,transitioning:false,catCanUses:Number(canvas.dataset.catCanUses)||0,forced:false});const tutorial=$('raceTutorial');if(tutorial){tutorial.className='race-tutorial';tutorial.setAttribute('aria-hidden','true');tutorial.style.setProperty('--tutorial-progress','0%')}canvas.dataset.tutorialModel='first-race-contextual-v1';canvas.dataset.tutorialState='idle';canvas.dataset.tutorialStep='0'
}
function showRaceTutorialStep(){
  const step=RACE_TUTORIAL_STEPS[raceTutorialState.index],tutorial=$('raceTutorial');if(!step||!tutorial)return;const colors=['#66efff','#ffe36b','#ff63cb'];tutorial.style.setProperty('--tutorial-color',colors[raceTutorialState.index]);tutorial.style.setProperty('--tutorial-progress','0%');$('tutorialStep').textContent=`0${raceTutorialState.index+1} / 0${RACE_TUTORIAL_STEPS.length}`;$('tutorialLabel').textContent=step.label;$('tutorialTitle').textContent=step.title;$('tutorialCopy').textContent=step.copy;$('tutorialKey').textContent=step.key();tutorial.className='race-tutorial active';tutorial.setAttribute('aria-hidden','false');raceTutorialState.stepStarted=state.elapsed;raceTutorialState.transitioning=false;canvas.dataset.tutorialState='active';canvas.dataset.tutorialStep=String(raceTutorialState.index+1);playSfx('tutorialStep',{variant:raceTutorialState.index,intensity:.82})
}
function startRaceTutorial(){
  const params=new URLSearchParams(location.search),forced=params.has('tutorial')||params.has('qaTutorial');if(playerProgress.tutorialComplete&&!forced){clearRaceTutorial();canvas.dataset.tutorialState='complete-saved';return}clearRaceTutorial();raceTutorialState.active=true;raceTutorialState.forced=forced;raceTutorialState.catCanUses=Number(canvas.dataset.catCanUses)||0;showRaceTutorialStep()
}
function completeRaceTutorial(){
  if(!raceTutorialState.active)return;raceTutorialState.active=false;raceTutorialState.transitioning=true;const tutorial=$('raceTutorial');if(!raceTutorialState.forced){playerProgress.tutorialComplete=true;saveProgress()}if(tutorial){$('tutorialLabel').textContent='TUTORIAL COMPLETE';$('tutorialTitle').textContent='READY TO RACE!';$('tutorialCopy').textContent='あとはゴールまで駆け抜けよう';$('tutorialKey').textContent='GO!';tutorial.style.setProperty('--tutorial-progress','100%');tutorial.className='race-tutorial active finished';clearTimeout(raceTutorialState.timer);raceTutorialState.timer=setTimeout(()=>{tutorial.className='race-tutorial';tutorial.setAttribute('aria-hidden','true')},680)}canvas.dataset.tutorialState='complete';canvas.dataset.tutorialStep=String(RACE_TUTORIAL_STEPS.length)
}
function advanceRaceTutorial(){
  if(!raceTutorialState.active||raceTutorialState.transitioning)return;raceTutorialState.transitioning=true;const tutorial=$('raceTutorial');tutorial?.classList.add('step-complete');playSfx('tutorialStep',{variant:raceTutorialState.index+1,intensity:.92});clearTimeout(raceTutorialState.timer);raceTutorialState.timer=setTimeout(()=>{raceTutorialState.index++;if(raceTutorialState.index>=RACE_TUTORIAL_STEPS.length)completeRaceTutorial();else showRaceTutorialStep()},330)
}
function updateRaceTutorial(){
  if(!raceTutorialState.active||raceTutorialState.transitioning||state.countdownActive)return;const step=RACE_TUTORIAL_STEPS[raceTutorialState.index],elapsed=state.elapsed-raceTutorialState.stepStarted,timeProgress=clamp(elapsed/step.timeout,0,1),signal=step.signal(),progress=Math.max(signal,timeProgress*.82);$('raceTutorial')?.style.setProperty('--tutorial-progress',`${Math.round(progress*100)}%`);if(elapsed>520&&(step.done()||elapsed>=step.timeout))advanceRaceTutorial()
}
function announceRank(oldRank,newRank){
  const el=$('rankChange'),improved=newRank<oldRank;playSfx(improved?'rankUp':'rankDown');el.textContent=`${improved?'▲':'▼'} ${newRank}${newRank===1?'st':newRank===2?'nd':newRank===3?'rd':'th'}`;el.className=`rank-change show ${improved?'up':'down'}`;clearTimeout(announceRank.t);announceRank.t=setTimeout(()=>el.className='rank-change',850)
}
function showOvertakeCallout(racer,playerPassed){
  const el=$('overtakeCallout');if(!el||!racer)return;
  const ai=racer.aiPersonality||{label:'BOSS ATTACK',jp:'乱入勝負',copy:'一気に仕掛けてきた。'},side=racer.lane<state.x?'left':'right';
  const costumeId=racer===miaNpc?'boss':activeCostumeId(racer),face=el.querySelector('img');el.style.setProperty('--rival-color',racer.color||'#ff42a5');el.dataset.racer=racer.slug;el.dataset.costume=costumeId;face.src=racerSelectHero(racer);face.alt=`${racer.name} ${costumeId}`;face.dataset.faceRacer=racer.slug;face.dataset.faceCostume=costumeId;face.dataset.faceContext='overtake';face.dataset.faceSource='costume-key-art-face-v1';
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
  return{id,start,end,geometry:{model:'dual-corridor-projection-v1',visualGap:1.18,visualSpread:1.34,laneGap:.8,laneSpread:.91,mapGap:.14,corridorBow:.24,elevationSplit:.1,depthSkew:.025,cameraIsolation:1.08,medianOcclusion:true},nodes:[{id:`${id}-entry`,type:'entry',at:start},{id:`${id}-left`,type:'branch',side:-1,at:(start+end)/2},{id:`${id}-right`,type:'branch',side:1,at:(start+end)/2},{id:`${id}-merge`,type:'merge',at:end}],edges:[{from:`${id}-entry`,to:`${id}-left`,route:'left',length:span*profile.left[0]*.5},{from:`${id}-entry`,to:`${id}-right`,route:'right',length:span*profile.right[0]*.5},{from:`${id}-left`,to:`${id}-merge`,route:'left',length:span*profile.left[0]*.5},{from:`${id}-right`,to:`${id}-merge`,route:'right',length:span*profile.right[0]*.5}],branches:{left:makeBranch('left',-1,leftLabel,'CAT CAN / SCENIC'),right:makeBranch('right',1,rightLabel,'SHORT / BOOST')}}
}
const COURSE_ROUTE_GRAPHS=[
  makeRouteGraph('sugar-split',820,1010,'SUGAR ARC','CREAM DASH',0),makeRouteGraph('gear-split',690,900,'GEAR LINE','STEAM BOOST',1),makeRouteGraph('neon-split',690,880,'LASER ARC','NITRO LANE',2),makeRouteGraph('rain-split',900,1090,'AQUA CURVE','RAIN DASH',3),makeRouteGraph('royal-split',760,950,'CROWN ARC','GOLD BOOST',4),makeRouteGraph('aurora-split',740,930,'CRYSTAL ARC','AURORA DASH',5),makeRouteGraph('jungle-split',620,820,'RUINS PATH','VINE BOOST',6),makeRouteGraph('sakura-split',900,1090,'SAKURA ARC','ONSEN DASH',7),makeRouteGraph('coral-split',810,1010,'CORAL ARC','BUBBLE DASH',8),makeRouteGraph('phantom-split',630,830,'GHOST PATH','NIGHT BOOST',9),makeRouteGraph('lunatic-split',970,1160,'MOON ARC','ORBIT DASH',10)
];
const DUAL_CORRIDOR_PROFILES=[
  {visualGap:1.18,visualSpread:1.34,mapGap:.14,corridorBow:.22,elevationSplit:.08,depthSkew:.02,cameraIsolation:1.08},
  {visualGap:1.24,visualSpread:1.4,mapGap:.145,corridorBow:.27,elevationSplit:.14,depthSkew:.03,cameraIsolation:1.1},
  {visualGap:1.3,visualSpread:1.46,mapGap:.155,corridorBow:.3,elevationSplit:.1,depthSkew:.04,cameraIsolation:1.12},
  {visualGap:1.16,visualSpread:1.36,mapGap:.14,corridorBow:.22,elevationSplit:.06,depthSkew:.02,cameraIsolation:1.08},
  {visualGap:1.28,visualSpread:1.44,mapGap:.15,corridorBow:.28,elevationSplit:.16,depthSkew:.035,cameraIsolation:1.12},
  {visualGap:1.34,visualSpread:1.5,mapGap:.16,corridorBow:.32,elevationSplit:.2,depthSkew:.045,cameraIsolation:1.14},
  {visualGap:1.46,visualSpread:1.64,mapGap:.18,corridorBow:.38,elevationSplit:.24,depthSkew:.055,cameraIsolation:1.2},
  {visualGap:1.24,visualSpread:1.42,mapGap:.15,corridorBow:.26,elevationSplit:.12,depthSkew:.03,cameraIsolation:1.1},
  {visualGap:1.32,visualSpread:1.48,mapGap:.16,corridorBow:.3,elevationSplit:.18,depthSkew:.04,cameraIsolation:1.14},
  {visualGap:1.38,visualSpread:1.54,mapGap:.17,corridorBow:.34,elevationSplit:.16,depthSkew:.05,cameraIsolation:1.16},
  {visualGap:1.42,visualSpread:1.58,mapGap:.175,corridorBow:.36,elevationSplit:.24,depthSkew:.055,cameraIsolation:1.18}
];
COURSE_ROUTE_GRAPHS.forEach((graph,index)=>Object.assign(graph.geometry,DUAL_CORRIDOR_PROFILES[index]||DUAL_CORRIDOR_PROFILES[0],{model:'dual-corridor-projection-v1',medianOcclusion:true}));
for(let i=0;i<Math.min(11,courseData.length);i++){courseData[i].gimmicks=COURSE_GIMMICK_LAYOUTS[i];courseData[i].routeGraph=COURSE_ROUTE_GRAPHS[i]}
// The jungle loop has back-to-back S bends.  Give its distant projection a
// slightly longer look-ahead than the standard courses so the road reads as
// one continuous curve instead of twitching at the horizon.
const emeraldRuinsCourse=courseData.find(course=>course.short==='EMERALD RUINS');
if(emeraldRuinsCourse){
  emeraldRuinsCourse.projection={window:4.8,response:.31,clamp:.072,gain:.27};
  emeraldRuinsCourse.immersiveJungle=true;
  emeraldRuinsCourse.surfaceSections=[
    {start:0,end:260,material:'jungleStone',label:'MOSS RUINS'},
    {start:260,end:470,material:'jungleEmerald',label:'TEMPLE PASSAGE'},
    {start:470,end:620,material:'jungleWood',label:'CANOPY BRIDGE'},
    {start:620,end:840,material:'jungleEmerald',label:'EMERALD SPLIT'},
    {start:840,end:1040,material:'jungleMud',label:'MUDDY ROOTS'},
    {start:1040,end:1220,material:'jungleStone',label:'STATUE CORRIDOR'},
    {start:1220,end:1435,material:'jungleWood',label:'WATERFALL BRIDGE'},
    {start:1435,end:1800,material:'jungleStone',label:'ANCIENT PLAZA'}
  ];
}
courseImages=courseData.map(()=>null);courseImagePromises=courseData.map(()=>null);activeCourse=courseData[0];
let trackNodes=courseData[0].nodes;
function wrap01(n){return ((n%1)+1)%1}
function catmull(a,b,c,d,t){const t2=t*t,t3=t2*t;return .5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t2+(-a+3*b-3*c+d)*t3)}
function courseRawTrackPoint(course,t){const nodes=course?.nodes||trackNodes;if(!Array.isArray(nodes)||nodes.length<4)return[.5,.5];const n=nodes.length-1,p=wrap01(t)*n,i=Math.floor(p),f=p-i,get=k=>nodes[((k%n)+n)%n]||nodes[0];return[catmull(get(i-1)[0],get(i)[0],get(i+1)[0],get(i+2)[0],f),catmull(get(i-1)[1],get(i)[1],get(i+1)[1],get(i+2)[1],f)]}
function rawTrackPoint(t){return courseRawTrackPoint(activeCourse,t)}
const trackArcStore=new WeakMap();
function buildTrackArc(course=activeCourse){if(course&&trackArcStore.has(course))return trackArcStore.get(course);const a=[{t:0,d:0}],steps=1200;let prev=courseRawTrackPoint(course,0),total=0;for(let i=1;i<=steps;i++){const p=courseRawTrackPoint(course,i/steps);total+=Math.hypot(p[0]-prev[0],p[1]-prev[1]);a.push({t:i/steps,d:total});prev=p}for(const x of a)x.d/=Math.max(.000001,total);if(course)trackArcStore.set(course,a);return a}
let trackArc=buildTrackArc(activeCourse);setupCourseGrid();
function courseTrackParam(course,progress,arc=buildTrackArc(course)){const d=wrap01(progress);let lo=0,hi=arc.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(arc[m].d<d)lo=m;else hi=m}const a=arc[lo],b=arc[hi],f=(d-a.d)/Math.max(.000001,b.d-a.d);return a.t+(b.t-a.t)*f}
function trackParam(progress){return courseTrackParam(activeCourse,progress,trackArc)}
function courseMapPoint(course,progress,arc=buildTrackArc(course)){return courseRawTrackPoint(course,courseTrackParam(course,progress,arc))}
function mapPoint(progress){return courseMapPoint(activeCourse,progress,trackArc)}
function angleDelta(a,b){return Math.atan2(Math.sin(a-b),Math.cos(a-b))}
const TRACK_SAMPLE_CACHE_VERSION='shared-track-cache-v1';
const trackSampleCacheStore=new WeakMap();
let trackSampleCache=null;
function preferredTrackCacheStep(){const key=activePerformanceKey();return key==='high'?2:key==='light'?4:3}
function rawTrackSample(progress){const e=.00035,p=mapPoint(progress),a=mapPoint(progress-e),b=mapPoint(progress+e),l=Math.hypot(b[0]-a[0],b[1]-a[1])||1;return{x:p[0],y:p[1],tx:(b[0]-a[0])/l,ty:(b[1]-a[1])/l,heading:Math.atan2(b[1]-a[1],b[0]-a[0])}}
function rawHillAt(distance,course=activeCourse){const heights=course?.heights||trackHeights||[0],length=course?.finishDistance||TRACK_LENGTH,p=((distance%length)+length)%length/length*heights.length,i=Math.floor(p),t=p-i,s=t*t*(3-2*t),a=heights[i%heights.length],b=heights[(i+1)%heights.length];return(a+(b-a)*s)*ELEVATION_INTENSITY+Math.sin(p*Math.PI*.5)*.035}
function cachedTunnelFlag(course,distance){const length=course?.finishDistance||TRACK_LENGTH,phase=((distance%length)+length)%length;return(course?.tunnels||[]).some(([start,end])=>phase>=start-TUNNEL_COLLAR_LENGTH&&phase<=end+TUNNEL_COLLAR_LENGTH)?1:0}
function cachedRoutePhase(course,distance){const graph=course?.routeGraph,length=course?.finishDistance||TRACK_LENGTH;if(!graph)return{active:0,t:0,fork:0};const phase=((distance%length)+length)%length;if(phase<graph.start||phase>graph.end)return{active:0,t:0,fork:0};const t=clamp((phase-graph.start)/Math.max(1,graph.end-graph.start),0,1);return{active:1,t,fork:Math.pow(Math.max(0,Math.sin(t*Math.PI)),.82)}}
function buildTrackSampleCache(course=activeCourse,requestedStep=preferredTrackCacheStep()){
  if(!course)return null;let byStep=trackSampleCacheStore.get(course);if(!byStep){byStep=new Map();trackSampleCacheStore.set(course,byStep)}const length=course.finishDistance||TRACK_LENGTH,key=Number(requestedStep).toFixed(2);if(byStep.has(key))return byStep.get(key);
  const count=Math.max(16,Math.ceil(length/requestedStep)),step=length/count,size=count+1,fields=['x','y','tx','ty','heading','height','curvature','tunnel','routeActive','routeT','routeFork'],data={},arc=buildTrackArc(course);for(const field of fields)data[field]=new Float32Array(size);
  for(let i=0;i<count;i++){const distance=i*step,p=courseMapPoint(course,distance/length,arc),route=cachedRoutePhase(course,distance);data.x[i]=p[0];data.y[i]=p[1];data.height[i]=rawHillAt(distance,course);data.tunnel[i]=cachedTunnelFlag(course,distance);data.routeActive[i]=route.active;data.routeT[i]=route.t;data.routeFork[i]=route.fork}
  for(let i=0;i<count;i++){const previous=(i-1+count)%count,next=(i+1)%count,dx=data.x[next]-data.x[previous],dy=data.y[next]-data.y[previous],magnitude=Math.hypot(dx,dy)||1;data.tx[i]=dx/magnitude;data.ty[i]=dy/magnitude;data.heading[i]=Math.atan2(dy,dx)}
  for(let i=0;i<count;i++){const previous=(i-2+count)%count,next=(i+2)%count;data.curvature[i]=angleDelta(data.heading[next],data.heading[previous])/(step*4)}
  for(const field of fields)data[field][count]=data[field][0];const cache={version:TRACK_SAMPLE_CACHE_VERSION,course,length,count,step,data};byStep.set(key,cache);return cache
}
function rebuildTrackSampleCache(){trackSampleCache=buildTrackSampleCache(activeCourse,preferredTrackCacheStep());if(!trackSampleCache)return null;canvas.dataset.trackCache=trackSampleCache.version;canvas.dataset.trackCacheStep=trackSampleCache.step.toFixed(2);canvas.dataset.trackCacheSamples=String(trackSampleCache.count);return trackSampleCache}
function sampleTrackCache(cache,distance){
  if(!cache)return null;
  const phase=((distance%cache.length)+cache.length)%cache.length,q=phase/cache.step,i=Math.min(cache.count-1,Math.floor(q)),next=i+1,t=q-i,d=cache.data,lerp=field=>d[field][i]+(d[field][next]-d[field][i])*t,heading=d.heading[i]+angleDelta(d.heading[next],d.heading[i])*t,tx0=lerp('tx'),ty0=lerp('ty'),magnitude=Math.hypot(tx0,ty0)||1;
  return{x:lerp('x'),y:lerp('y'),tx:tx0/magnitude,ty:ty0/magnitude,heading,height:lerp('height'),curvature:lerp('curvature'),tunnel:lerp('tunnel')>=.5?1:0,routeActive:lerp('routeActive')>=.5?1:0,routeT:lerp('routeT'),routeFork:lerp('routeFork'),distance}
}
function trackDistanceSample(distance){const cache=trackSampleCache;if(!cache){const raw=rawTrackSample(distance/raceLength());return{...raw,height:rawHillAt(distance),curvature:0,tunnel:cachedTunnelFlag(activeCourse,distance),routeActive:0,routeT:0,routeFork:0,distance}}return sampleTrackCache(cache,distance)}
function trackSample(progress){return trackDistanceSample(progress*raceLength())}
function trackBend(progress){return Math.max(-1,Math.min(1,angleDelta(trackSample(progress+.006).heading,trackSample(progress-.006).heading)*3.2))}
window.NyanTrackCache={version:TRACK_SAMPLE_CACHE_VERSION,refresh:rebuildTrackSampleCache,sample:trackDistanceSample,get active(){return trackSampleCache}};
function routeDistanceInfo(distance){const graph=activeCourse?.routeGraph,length=raceLength();if(!graph||length<=0)return null;const lap=Math.max(0,Math.floor(Math.max(0,distance)/length)),phase=distance-lap*length;return{graph,lap,phase,start:lap*length+graph.start,end:lap*length+graph.end}}
function routeGeometryForCourse(course,distance,cache=course===activeCourse?trackSampleCache:buildTrackSampleCache(course,3)){
  const graph=course?.routeGraph,length=course?.finishDistance||TRACK_LENGTH;if(!graph||length<=0)return null;const lap=Math.max(0,Math.floor(Math.max(0,distance)/length)),phase=distance-lap*length,info={graph,lap,phase,start:lap*length+graph.start,end:lap*length+graph.end};if(phase<graph.start||phase>graph.end)return null;
  const cached=sampleTrackCache(cache,distance),fallbackT=clamp((phase-graph.start)/Math.max(1,graph.end-graph.start),0,1),t=cached?.routeActive?clamp(cached.routeT,0,1):fallbackT,fork=cached?.routeActive?clamp(cached.routeFork,0,1):Math.pow(Math.max(0,Math.sin(t*Math.PI)),.82),model=graph.geometry||{},dual=model.model==='dual-corridor-projection-v1',visualInner=(model.visualGap??.31)*fork,visualOuter=1+(model.visualSpread??.25)*fork,laneInner=(model.laneGap??.36)*fork,laneOuter=1+(model.laneSpread??.34)*fork,visualHalf=(visualOuter-visualInner)*.5,laneHalf=(laneOuter-laneInner)*.5,visualCenter=(visualInner+visualOuter)*.5,laneCenter=(laneInner+laneOuter)*.5,sine=Math.max(0,Math.sin(t*Math.PI));
  const branches={};for(const branch of Object.values(info.graph.branches)){const curveWave=clamp(branch.curveBias*fork*Math.sin(t*Math.PI*2),dual ? -.3 : -.17,dual ? .3 : .17),corridorBow=dual?branch.side*(model.corridorBow||0)*fork*Math.pow(sine,1.15):0,elevation=branch.hillBias*sine*sine+(dual?branch.side*(model.elevationSplit||0)*fork*sine:0),corridorScale=dual?1+branch.side*(model.depthSkew||0)*fork*sine:1;branches[branch.id]={...branch,visualCenter:branch.side*visualCenter+curveWave+corridorBow,laneCenter:branch.side*laneCenter+curveWave*.68,visualHalf,laneHalf,elevation,corridorScale,corridorYaw:curveWave+corridorBow,mapOffset:branch.side*fork*(model.mapGap??.09)+curveWave*.035,normalizedProgress:t,physicalProgress:t*branch.physicalLength}}
  return{...info,t,fork,visualInner,visualOuter,visualCenter,laneInner,laneOuter,laneCenter,visualHalf,laneHalf,dual,model:model.model||'shared-edge',branches}
}
function routeGeometryAt(distance){return routeGeometryForCourse(activeCourse,distance,trackSampleCache)}
const COURSE_GEOMETRY_MODEL='shared-course-geometry-v2',GUARDRAIL_GEOMETRY_MODEL='shared-road-edge-boundary-v2';
const courseGeometrySignatureStore=new WeakMap();
function geometryHash(value){let hash=2166136261>>>0;for(const char of String(value)){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619)}return(hash>>>0).toString(16).padStart(8,'0')}
function courseGeometrySignature(course=activeCourse,index=courseData.indexOf(course)){
  if(!course)return null;if(courseGeometrySignatureStore.has(course))return courseGeometrySignatureStore.get(course);const cache=buildTrackSampleCache(course,3),length=course.finishDistance||TRACK_LENGTH,sampleCount=96,trackTokens=[],elevationTokens=[],routeTokens=[],tunnelTokens=[];
  for(let step=0;step<sampleCount;step++){const distance=length*step/sampleCount,sample=sampleTrackCache(cache,distance),route=routeGeometryForCourse(course,distance,cache);trackTokens.push(`${Math.round(sample.x*10000)},${Math.round(sample.y*10000)},${Math.round(sample.heading*1000)},${Math.round(sample.curvature*100000)}`);elevationTokens.push(String(Math.round(sample.height*1000)));tunnelTokens.push(String(sample.tunnel));if(route)routeTokens.push(`${step}:${Math.round(route.fork*1000)}:${Object.values(route.branches).map(path=>`${path.id},${Math.round(path.visualCenter*1000)},${Math.round(path.elevation*1000)}`).join('|')}`)}
  const zones=biomeVolumeZones(Math.max(0,index),length),landmarkTokens=zones.map(zone=>`${zone.id}:${Math.round(zone.start)}-${Math.round(zone.end)}`),materialTokens=(course.surfaceSections||[]).map(section=>`${section.start}-${section.end}:${section.material}`),components={track:geometryHash(trackTokens.join(';')),elevation:geometryHash(elevationTokens.join(',')),route:geometryHash(`${JSON.stringify(course.routeGraph||null)}|${routeTokens.join(';')}`),tunnel:geometryHash(`${JSON.stringify(course.tunnels||[])}|${tunnelTokens.join('')}`),landmarks:geometryHash(landmarkTokens.join('|')),materials:geometryHash(materialTokens.join('|'))},signature={model:COURSE_GEOMETRY_MODEL,course:courseScenerySlugs[index]||course.short||`course-${index}`,length,samples:sampleCount,components,hash:geometryHash(Object.values(components).join('|')),landmarkOrder:zones.map(zone=>zone.id).join(','),cacheStep:cache.step};courseGeometrySignatureStore.set(course,signature);return signature
}
function rawGuardrailLaneForCourse(course,distance){return trackMaterialForCourse(course,distance).guardrailLane||GUARDRAIL_LANE}
function guardrailLaneForCourse(course,distance){const sections=course?.surfaceSections||[],length=course?.finishDistance||TRACK_LENGTH,phase=((distance%length)+length)%length,blend=36;let lane=rawGuardrailLaneForCourse(course,distance);for(const section of sections){for(const boundary of[section.start,section.end]){let delta=phase-boundary;if(delta>length*.5)delta-=length;if(delta<-length*.5)delta+=length;if(Math.abs(delta)>=blend)continue;const before=rawGuardrailLaneForCourse(course,boundary-1),after=rawGuardrailLaneForCourse(course,boundary+1),t=clamp((delta+blend)/(blend*2),0,1),ease=t*t*(3-2*t);lane=before+(after-before)*ease}}return lane}
function boundaryVerge(course,distance,material,fork=0){const base=Math.max(.06,guardrailLaneForCourse(course,distance)-1),split=material.elevated?.08:.62;return base+(split-base)*clamp(fork,0,1)}
function boundaryCollisionInset(material){return material.elevated?.04:.13}
function trackBoundaryProfileForCourse(course,distance,cache=course===activeCourse?trackSampleCache:buildTrackSampleCache(course,3)){
  const material=trackMaterialForCourse(course,distance),geometry=routeGeometryForCourse(course,distance,cache),fork=geometry?.fork||0,railLane=guardrailLaneForCourse(course,distance),verge=boundaryVerge(course,distance,material,fork),inset=boundaryCollisionInset(material),corridors=[];
  if(geometry&&fork>.035){for(const path of Object.values(geometry.branches)){const visualHalf=path.visualHalf*(path.corridorScale||1),laneHalf=path.laneHalf,outerLeft=path.side<0,innerAlpha=clamp((fork-.14)/.3,0,1),edgeBlend=fork*fork*fork,rawRailLeft=path.laneCenter-laneHalf-verge,rawRailRight=path.laneCenter+laneHalf+verge,rawVisualLeft=path.visualCenter-visualHalf-verge,rawVisualRight=path.visualCenter+visualHalf+verge,railLeft=outerLeft?(-railLane+(rawRailLeft+railLane)*edgeBlend):rawRailLeft,railRight=outerLeft?rawRailRight:(railLane+(rawRailRight-railLane)*edgeBlend),visualRailLeft=outerLeft?(-railLane+(rawVisualLeft+railLane)*edgeBlend):rawVisualLeft,visualRailRight=outerLeft?rawVisualRight:(railLane+(rawVisualRight-railLane)*edgeBlend);corridors.push({id:path.id,side:path.side,path,roadLeft:path.laneCenter-laneHalf,roadRight:path.laneCenter+laneHalf,railLeft,railRight,collisionLeft:railLeft+inset,collisionRight:railRight-inset,visualRoadLeft:path.visualCenter-visualHalf,visualRoadRight:path.visualCenter+visualHalf,visualRailLeft,visualRailRight,leftKey:outerLeft?'outer-left':'inner-right',rightKey:outerLeft?'inner-left':'outer-right',leftAlpha:outerLeft?1:innerAlpha,rightAlpha:outerLeft?innerAlpha:1,elevation:path.elevation,roadHalfVisual:visualHalf})}}
  else{const rail=railLane;corridors.push({id:'main',side:0,path:null,roadLeft:-1,roadRight:1,railLeft:-rail,railRight:rail,collisionLeft:-rail+inset,collisionRight:rail-inset,visualRoadLeft:-1,visualRoadRight:1,visualRailLeft:-rail,visualRailRight:rail,leftKey:'outer-left',rightKey:'outer-right',leftAlpha:1,rightAlpha:1,elevation:0,roadHalfVisual:1})}
  return{model:GUARDRAIL_GEOMETRY_MODEL,course,material,geometry,fork,verge,inset,corridors}
}
function trackBoundaryProfileAt(distance=state.distance){return trackBoundaryProfileForCourse(activeCourse,distance,trackSampleCache)}
function selectedBoundaryCorridor(profile,racer=racers[state.selected]){if(profile.corridors.length===1)return profile.corridors[0];return profile.corridors.find(corridor=>corridor.id===racer?.routeChoice)||profile.corridors.reduce((best,corridor)=>Math.abs(state.x-(corridor.roadLeft+corridor.roadRight)*.5)<Math.abs(state.x-(best.roadLeft+best.roadRight)*.5)?corridor:best,profile.corridors[0])}
window.NyanCourseGeometry={model:COURSE_GEOMETRY_MODEL,guardrailModel:GUARDRAIL_GEOMETRY_MODEL,signature:courseGeometrySignature,boundary:trackBoundaryProfileForCourse,route:routeGeometryForCourse,cache:buildTrackSampleCache};
function drawLandmarkPin(m,x,y,index,color,active=false,scale=1,alpha=1){
  const pulse=.5+.5*Math.sin(performance.now()*.006),r=(active?8.5+pulse*1.2:6.7)*scale;m.save();m.globalAlpha=alpha;m.translate(x,y-1);m.shadowColor=active?color:'#000';m.shadowBlur=active?(12+pulse*7)*scale:5*scale;m.fillStyle=active?'#fff6a5':color;m.strokeStyle=active?'#fff':'rgba(31,21,58,.96)';m.lineWidth=(active?2.4:1.6)*scale;m.beginPath();m.moveTo(0,r+5*scale);m.lineTo(-r*.52,r*.2);m.arc(0,0,r,Math.PI*.82,Math.PI*2.18);m.closePath();m.fill();m.stroke();m.fillStyle=active?'#241239':'#1c1833';m.textAlign='center';m.textBaseline='middle';m.font=`900 ${Math.max(6,7*scale)}px 'Fredoka','Noto Sans JP'`;m.fillText(String(index+1),0,.3);m.restore()
}
function drawCourseShowcaseMap(now=performance.now()){
  const c=$('courseSelectMap');if(!c||state.mode!=='course'||!activeCourse)return;const m=c.getContext('2d'),w=c.width,h=c.height,pad=24,theme=activeCourse.theme||courseData[0].theme,signature=courseGeometrySignature(activeCourse,state.selectedCourse),zones=biomeVolumeZones(state.selectedCourse,signature.length),legendHeight=zones.length>4?67:49,mapHeight=h-legendHeight,reveal=clamp((now-courseCarousel.revealStart)/620,0,1),travel=wrap01((now-courseCarousel.revealStart)*.000055+.01),point=(progress,offset=0)=>{const sample=trackDistanceSample(wrap01(progress)*signature.length),px=sample.x-sample.ty*offset,py=sample.y+sample.tx*offset;return{x:pad+px*(w-pad*2),y:pad*.58+py*(mapHeight-pad*.72)}};
  m.clearRect(0,0,w,h);m.save();m.lineJoin='round';m.lineCap='round';
  const trace=(limit=180,offsetAt=null)=>{m.beginPath();for(let step=0;step<=limit;step++){const progress=step/180,offset=offsetAt?.(progress)||0,p=point(progress,offset);step?m.lineTo(p.x,p.y):m.moveTo(p.x,p.y)}};
  trace();m.strokeStyle='rgba(3,4,18,.92)';m.lineWidth=22;m.stroke();trace();m.strokeStyle=theme.curbA;m.lineWidth=14;m.stroke();trace();m.strokeStyle='rgba(255,255,255,.16)';m.lineWidth=8;m.stroke();
  for(let step=0;step<72;step++){const d1=signature.length*step/72,d2=signature.length*(step+1)/72,a=point(d1/signature.length),b=point(d2/signature.length),rise=trackDistanceSample(d2).height-trackDistanceSample(d1).height;m.strokeStyle=rise>.012?'rgba(102,240,255,.62)':rise<-.012?'rgba(255,104,201,.58)':'rgba(255,255,255,.12)';m.lineWidth=2.2;m.beginPath();m.moveTo(a.x,a.y);m.lineTo(b.x,b.y);m.stroke()}
  for(const[start,end]of activeCourse.tunnels||[]){m.save();m.globalAlpha=.7;m.strokeStyle='#17162b';m.lineWidth=7;m.setLineDash([5,4]);m.beginPath();for(let step=0;step<=18;step++){const distance=start+(end-start)*step/18,p=point(distance/signature.length);step?m.lineTo(p.x,p.y):m.moveTo(p.x,p.y)}m.stroke();m.restore()}
  for(const[rampDistance]of activeCourse.gimmicks?.ramps||[]){const p=point(rampDistance/signature.length);m.save();m.translate(p.x,p.y);m.fillStyle='#fff27a';m.strokeStyle='#2b1b47';m.lineWidth=1.5;m.beginPath();m.moveTo(0,-5);m.lineTo(5,4);m.lineTo(-5,4);m.closePath();m.fill();m.stroke();m.restore()}
  const visibleSteps=Math.max(1,Math.floor(180*(1-Math.pow(1-reveal,3))));trace(visibleSteps);m.strokeStyle=theme.accent;m.lineWidth=5;m.shadowColor=theme.accent;m.shadowBlur=12;m.stroke();m.shadowBlur=0;
  const graph=activeCourse.routeGraph;if(graph&&reveal>.34){const alpha=clamp((reveal-.34)/.42,0,1);for(const branch of Object.values(graph.branches)){m.save();m.globalAlpha=alpha;const start=graph.start/raceLength(),end=graph.end/raceLength();m.beginPath();for(let step=0;step<=38;step++){const t=step/38,progress=start+(end-start)*t,distance=graph.start+(graph.end-graph.start)*t,geometry=routeGeometryAt(distance),offset=geometry?.branches[branch.id]?.mapOffset||0,p=point(progress,offset);step?m.lineTo(p.x,p.y):m.moveTo(p.x,p.y)}m.strokeStyle=branch.side<0?theme.lightA:theme.lightB;m.lineWidth=6;m.shadowColor=m.strokeStyle;m.shadowBlur=9;m.stroke();m.restore()}}
  const previewDistance=travel*raceLength(),activeZone=zones.findIndex(zone=>previewDistance>=zone.start&&previewDistance<zone.end);for(let zoneIndex=0;zoneIndex<zones.length;zoneIndex++){const zone=zones[zoneIndex],distance=biomeZoneLandmarkDistance(0,zone)%raceLength(),p=point(distance/raceLength()),pinReveal=clamp((reveal-.18-zoneIndex*.055)/.22,0,1);if(pinReveal>0)drawLandmarkPin(m,p.x,p.y,zoneIndex,zone.fog,zoneIndex===activeZone,.92,pinReveal)}
  const start=point(0),startSample=trackSample(0),nx=-startSample.ty,ny=startSample.tx;m.strokeStyle='#fff';m.lineWidth=4;m.shadowColor=theme.lightB;m.shadowBlur=8;m.beginPath();m.moveTo(start.x-nx*10,start.y-ny*10);m.lineTo(start.x+nx*10,start.y+ny*10);m.stroke();
  const runner=point(travel);m.shadowColor=theme.lightB;m.shadowBlur=18;m.fillStyle='#fff';m.beginPath();m.arc(runner.x,runner.y,7,0,Math.PI*2);m.fill();m.fillStyle=theme.accent;m.beginPath();m.arc(runner.x,runner.y,4,0,Math.PI*2);m.fill();m.restore();
  c.dataset.course=activeCourse.short;c.dataset.routeGraph=graph?.id||'none';c.dataset.routePreview='shared-race-geometry-v3';c.dataset.geometryModel=signature.model;c.dataset.geometrySignature=signature.hash;c.dataset.trackSignature=signature.components.track;c.dataset.elevationSignature=signature.components.elevation;c.dataset.routeSignature=signature.components.route;c.dataset.landmarkSignature=signature.components.landmarks;c.dataset.cacheSource=trackSampleCache?.version||'raw-fallback';c.dataset.elevationPreview='shared-height-ribbon-v1';c.dataset.tunnelPreview=String(activeCourse.tunnels?.length||0);c.dataset.rampPreview=String(activeCourse.gimmicks?.ramps?.length||0);c.dataset.reveal=reveal.toFixed(2);c.dataset.runnerProgress=travel.toFixed(3);c.dataset.landmarkModel='zone-pin-v1';c.dataset.landmarkCount=String(zones.length);c.dataset.landmarkOrder=zones.map(zone=>zone.id).join(',');c.dataset.landmarkActive=zones[activeZone]?.id||zones[0]?.id||'none'
}
function triggerRouteSelectionFlash(side,lap){
  if(side!=='left'&&side!=='right')return;state.routeSelectionPulse=1;state.routeSelectionSide=side;state.routeSelectionLap=lap;state.routeSelectionSerial=(state.routeSelectionSerial||0)+1;canvas.dataset.routeSelectionPulse='1.000';canvas.dataset.routeSelectionSide=side;canvas.dataset.routeSelectionLap=String(lap);canvas.dataset.routeSelectionSerial=String(state.routeSelectionSerial);playSfx('uiMove',{intensity:.9})
}
function routeSelectionGlow(lap=state.routeSelectionLap,side=state.routeSelectionSide){return state.routeSelectionPulse>0&&lap===state.routeSelectionLap&&side===state.routeSelectionSide?Math.pow(clamp(state.routeSelectionPulse,0,1),.58):0}
function chooseRouteForRacer(racer,distance,player=false){const info=routeDistanceInfo(distance);if(!info||info.phase<info.graph.start-34||info.phase>info.graph.end)return null;if(racer.routeLap!==info.lap){let side;if(player){const lane=Math.abs(state.x)>.06?state.x:state.steer;side=lane<0?-1:1}else{const ai=racer.aiPersonality,key=ai?.key;side=key==='apex'||key==='tactician'?-1:key==='charger'||key==='booster'?1:((racer.aiDecisionSeed||0)+info.lap+state.selectedCourse)%2?-1:1}racer.routeChoice=side<0?'left':'right';racer.routeLap=info.lap;racer.routeMerged=false;if(player){state.routeChoice=racer.routeChoice;state.routeLap=info.lap;state.routeMerged=false;const branch=info.graph.branches[racer.routeChoice],delta=branch.timeDelta;toast(`${branch.label} / ${delta>0?`+${delta}m`:`${delta}m`}`);triggerRouteSelectionFlash(racer.routeChoice,info.lap)}tryActivateRacerSignature(racer,'route')}return info}
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
  if(route.active&&route.path&&route.geometry?.fork>.035){const min=route.path.laneCenter-route.path.laneHalf+.025,max=route.path.laneCenter+route.path.laneHalf-.025,inner=route.branch.side<0?max:min,boundaryProfile=trackBoundaryProfileAt(state.distance),corridor=boundaryProfile.corridors.find(entry=>entry.id===route.branch.id)||selectedBoundaryCorridor(boundaryProfile,player);if(route.branch.side*state.x<route.branch.side*inner){const target=inner+route.branch.side*.045;state.x+=(target-state.x)*Math.min(1,dt*(5.8+route.geometry.fork*3.4))}state.x=clamp(state.x,corridor.collisionLeft-.035,corridor.collisionRight+.035)}
  if(player.routeLap===route.lap&&route.phase>route.graph.end&&!player.routeMerged){player.routeMerged=true;state.routeMerged=true;toast('ROUTE MERGE!')}
  canvas.dataset.routeChoice=player.routeChoice||'none';canvas.dataset.routeLap=String(player.routeLap);canvas.dataset.routePhase=route.phase.toFixed(1);canvas.dataset.routeMerged=String(!!player.routeMerged);canvas.dataset.routeGap=(route.geometry?.fork||0).toFixed(3);canvas.dataset.routePhysicalProgress=(player.routePhysicalProgress||0).toFixed(1);canvas.dataset.routeComparableDistance=(player.routeComparableDistance??state.distance).toFixed(1);updateRouteGuide()
}
function updateRouteCameraLane(dt){
  const info=routeDistanceInfo(state.distance),geometry=routeGeometryAt(state.distance),nearSplit=!!info&&info.phase>=info.graph.start-95&&info.phase<=info.graph.end+35,mobile=innerWidth<900||matchMedia('(pointer:coarse)').matches,target=clamp(state.x,-1.58,1.58),smoothTime=nearSplit?(mobile?.38:.29):(mobile?.24:.18),maxSpeed=nearSplit?(mobile?1.85:2.35):(mobile?2.7:3.4),omega=2/Math.max(.08,smoothTime),x=omega*dt,decay=1/(1+x+.48*x*x+.235*x*x*x);
  let current=Number.isFinite(state.cameraLane)?state.cameraLane:target,velocity=Number.isFinite(state.routeCameraVelocity)?state.routeCameraVelocity:0,change=current-target,maxChange=maxSpeed*smoothTime;const original=current;change=clamp(change,-maxChange,maxChange);const adjustedTarget=current-change,temp=(velocity+omega*change)*dt;velocity=(velocity-omega*temp)*decay;current=adjustedTarget+(change+temp)*decay;if((target-original>0)===(current>target)){current=target;velocity=0}state.cameraLane=clamp(current,-1.58,1.58);state.routeCameraVelocity=velocity;
  canvas.dataset.routeCameraModel='smooth-damp-v1';canvas.dataset.routeCameraLane=state.cameraLane.toFixed(3);canvas.dataset.routeCameraTarget=target.toFixed(3);canvas.dataset.routeCameraLag=Math.abs(target-state.cameraLane).toFixed(3);canvas.dataset.routeCameraSplit=nearSplit?'smooth':'normal';canvas.dataset.routeCameraDevice=mobile?'mobile':'desktop';canvas.dataset.routeCameraFork=(geometry?.fork||0).toFixed(3)
}
function drawMinimapLandmarks(m,c,theme){
  const zones=biomeVolumeZones(state.selectedCourse),active=biomeVolumeZoneAt();let count=0;m.save();m.textAlign='center';m.textBaseline='middle';m.font="900 7px 'Fredoka','Noto Sans JP'";
  zones.forEach((zone,index)=>{const distance=biomeZoneLandmarkDistance(0,zone)%raceLength(),sample=trackDistanceSample(distance),x=12+sample.x*(c.width-24),y=9+sample.y*(c.height-18),current=zone.id===active.id;drawLandmarkPin(m,x,y,index,colorAlpha(zone.fog,.96),current,1,1);count++});
  m.restore();c.dataset.landmarkModel='zone-pin-v1';c.dataset.landmarkCount=String(count);c.dataset.activeLandmark=active.id;canvas.dataset.biomeMinimapLandmarkModel='zone-pin-v1';canvas.dataset.biomeMinimapLandmarks=String(count);canvas.dataset.biomeMinimapActiveZone=active.id
}
function drawMinimap(){
  const c=$('courseMap');if(!c)return;const m=c.getContext('2d');m.clearRect(0,0,c.width,c.height);
  const theme=activeCourse?.theme||courseData[0].theme;m.save();m.lineJoin='round';m.lineCap='round';const drawPath=()=>{m.beginPath();for(let i=0;i<=180;i++){const sample=trackSample(i/180),x=12+sample.x*(c.width-24),y=9+sample.y*(c.height-18);i?m.lineTo(x,y):m.moveTo(x,y)}};drawPath();m.strokeStyle='rgba(25,12,35,.9)';m.lineWidth=18;m.stroke();drawPath();m.strokeStyle=theme.curbA;m.lineWidth=12;m.stroke();drawPath();m.strokeStyle=theme.accent;m.lineWidth=4;m.stroke();const graph=activeCourse?.routeGraph;if(graph){const traceBranch=branch=>{m.beginPath();for(let i=0;i<=32;i++){const t=i/32,distance=graph.start+(graph.end-graph.start)*t,sample=trackDistanceSample(distance),geometry=routeGeometryAt(distance),offset=geometry?.branches[branch.id]?.mapOffset??branch.side*Math.sin(t*Math.PI)*.065,px=sample.x-sample.ty*offset,py=sample.y+sample.tx*offset,x=12+px*(c.width-24),y=9+py*(c.height-18);i?m.lineTo(x,y):m.moveTo(x,y)}};for(const branch of Object.values(graph.branches)){const flash=routeSelectionGlow(state.routeSelectionLap,branch.id),color=branch.side<0?theme.lightA:theme.lightB;m.save();if(flash>0){m.shadowColor='#fff36e';m.shadowBlur=10+flash*18}traceBranch(branch);m.strokeStyle=color;m.lineWidth=6+flash*3;m.stroke();if(flash>0){traceBranch(branch);m.globalAlpha=.38+flash*.5;m.strokeStyle='#fff';m.lineWidth=2+flash*2;m.stroke()}m.restore()}}m.restore();c.dataset.routeSelectionFlash=state.routeSelectionPulse>0?state.routeSelectionSide:'none';canvas.dataset.routeMinimapFlash=c.dataset.routeSelectionFlash;
  drawMinimapLandmarks(m,c,theme);
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
  if(action==='accelerate'&&!e.repeat)handleStartCharge();if(action==='item'&&!e.repeat){if(state.mode==='course')toggleCourseMusicPreview();else useItem()}if(action==='pause'&&!e.repeat)togglePause();
});
addEventListener('keyup',e=>{const action=actionForCode(e.code);if(action)keyboardActions[action]=false});
addEventListener('pointerdown',()=>{if(state.mode==='race'&&raceBgm?.paused&&!miaNpc.cutInActive)resumeRaceMusic()},{passive:true});
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key,action=k==='accel'?'accelerate':k;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);b.classList.add('pressed');touchActions[action]=true;if(action==='item')useItem();if(action==='accelerate')handleStartCharge()});['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,e=>{e.preventDefault();b.classList.remove('pressed');touchActions[action]=false}))});
document.querySelectorAll('.mobile-controls button').forEach(b=>['contextmenu','selectstart','dragstart'].forEach(ev=>b.addEventListener(ev,e=>e.preventDefault())));
$('mobileControls').addEventListener('contextmenu',e=>e.preventDefault());
$('mobileControls').addEventListener('selectstart',e=>e.preventDefault());

const COIN_PICKUP_REWARD=3;
const FINISH_COIN_REWARDS=[0,50,38,30,24,21,18,16,14,12];
const HARD_CLEAR_COIN_REWARD=60,MIA_DEFEAT_COIN_REWARD=100;
const CAT_CAN_GEARS={
  star:{label:'COMET DASH',jp:'コメットダッシュ',frame:4,color:'#5beeff'},
  rocket:{label:'SEEKER PAW',jp:'シーカーポウ',frame:5,color:'#ff67ca'},
  shield:{label:'BELL GUARD',jp:'ベルガード',frame:6,color:'#6deeff'},
  lightning:{label:'WHISKER PULSE',jp:'ウィスカーパルス',frame:7,color:'#ff70dc'}
};
const CAT_CAN_GEAR_KEYS=Object.keys(CAT_CAN_GEARS),catCanReveal={active:false,time:0,duration:.72,final:null,lastFrame:-1};
function gearPoolForRank(rank=state.rank,field=raceContestants().length){return rank<=2?['shield','rocket','shield','star']:rank>=Math.ceil(field*.62)?['star','lightning','rocket','star']:['rocket','shield','star','lightning']}
function rollCatCanGear(rank=state.rank){const pool=gearPoolForRank(rank);return pool[Math.floor(Math.random()*pool.length)]}
function startCatCanReveal(finalItem=rollCatCanGear()){
  state.item=null;Object.assign(catCanReveal,{active:true,time:0,final:finalItem,lastFrame:-1});const box=$('itemIcon')?.closest('.item-box');box?.classList.add('opening');box?.classList.remove('ready');playSfx('catCan',{intensity:.9});drawHeldItem();canvas.dataset.catCanFinal=finalItem
}
function updateCatCanReveal(dt){
  if(!catCanReveal.active)return;catCanReveal.time+=dt;const frame=Math.min(3,Math.floor(catCanReveal.time/catCanReveal.duration*4));if(frame!==catCanReveal.lastFrame){catCanReveal.lastFrame=frame;playSfx('catCanOpen',{variant:frame,intensity:.72})}
  if(catCanReveal.time>=catCanReveal.duration){catCanReveal.active=false;state.item=catCanReveal.final;catCanReveal.final=null;const gear=CAT_CAN_GEARS[state.item];$('itemIcon')?.closest('.item-box')?.classList.remove('opening');playSfx('itemGet',{variant:CAT_CAN_GEAR_KEYS.indexOf(state.item),intensity:1});toast(`${gear.label} READY!`)}drawHeldItem()
}
function giveCatCanGear(){if(state.item||catCanReveal.active){toast('GEAR FULL');return}startCatCanReveal(rollCatCanGear())}
function drawHudSprite(x,frame,size=80,rotation=0,alpha=1){if(!frame)return;x.save();x.globalAlpha=alpha;x.translate(46,46);x.rotate(rotation);const scale=Math.min(size/frame.sw,size/frame.sh),w=frame.sw*scale,h=frame.sh*scale;x.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,-w/2,-h/2,w,h);x.restore()}
function drawHeldItem(){
  const c=$('itemIcon');if(!c)return;const x=c.getContext('2d'),box=c.closest('.item-box');x.clearRect(0,0,c.width,c.height);let label='EMPTY',color='#ff72be';
  if(catCanReveal.active){const progress=clamp(catCanReveal.time/catCanReveal.duration,0,1),frame=catCanFrames[Math.min(3,Math.floor(progress*4))];drawHudSprite(x,frame,84,Math.sin(progress*Math.PI*3)*.035,1);label='OPENING';c.setAttribute('aria-label','猫缶を開封中')}
  else if(state.item){const gear=CAT_CAN_GEARS[state.item],frame=catCanFrames[gear.frame];label=gear.label;color=gear.color;drawHudSprite(x,frame,82,0,1);c.setAttribute('aria-label',`所持ギア：${gear.jp}`)}
  else{drawHudSprite(x,catCanFrames[0],73,0,.58);c.setAttribute('aria-label','猫缶ギアなし')}
  if(box){box.dataset.gear=label;box.style.setProperty('--cat-can-color',color);box.classList.toggle('ready',!!state.item&&!catCanReveal.active)}canvas.dataset.catCanModel='random-open-reveal-v1';canvas.dataset.catCanOpening=String(catCanReveal.active);canvas.dataset.catCanGear=state.item||'none'
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
  const player=racers[state.selected],isPlayer=target===player;tryActivateRacerSignature(target,'incoming');const shield=isPlayer?state.shield:Number(target.shield)||0,invincible=isPlayer?state.invincible:Number(target.invincible)||0,blocked=shield>0||invincible>0;
  if(shield>0){if(isPlayer)state.shield=0;else target.shield=0}
  if(!blocked){if(isPlayer){state.speed*=signatureResistance(.54,signaturePerformance(target).ram);state.shake=Math.max(state.shake,17);state.flash=Math.max(state.flash,.42);state.collisionCooldown=Math.max(state.collisionCooldown,1.1)}else{target.hit=Math.max(target.hit||0,2.2);target.spin=Math.max(target.spin||0,1.2);target.aiVelocity*=signatureResistance(.68,signaturePerformance(target).ram)}tryActivateRacerSignature(target,'hit')}
  shot.life=0;const hits=Number(canvas.dataset.rocketHits||0)+1;canvas.dataset.rocketHits=String(hits);canvas.dataset.rocketHitOwner=shot.ownerKey;canvas.dataset.rocketHitTarget=contestantKey(target);canvas.dataset.rocketHitBlocked=String(blocked);
  const visible=isPlayer?playerEffectAnchor():projectTrackEntity(target.distance,target.lane),fxX=visible?.visible===false?innerWidth/2:visible?.x??innerWidth/2,fxY=isPlayer?visible.y-visible.height*.42:(visible?.y??innerHeight*.5)-70*Math.max(.45,visible?.scale||1),fxSize=isPlayer?210:Math.max(90,180*(visible?.scale||1));playSfx(blocked?'shield':'collision',{intensity:target===miaNpc?1.25:1});spawnVfx(blocked?2:1,fxX,fxY,.65,fxSize,'front',true);burst(fxX,fxY,9,blocked?'#74ecff':target.color||'#ffb13b',blocked?0:6);
  const involved=isPlayer||shot.owner===player||Math.abs(target.distance-state.distance)<300;if(involved)toast(`${shot.ownerName} → ${target.name} ${blocked?'BLOCK!':'HIT!'}`)
}
function updateRocketLockWarning(dt){
  const player=racers[state.selected],warning=$('lockOnWarning'),hud=$('hud'),incoming=state.projectiles.filter(shot=>shot.kind==='rocket'&&shot.life>0&&shot.target===player&&shot.owner!==player).sort((a,b)=>Math.abs(state.distance-a.z)-Math.abs(state.distance-b.z))[0];state.rocketWarningCooldown=Math.max(0,state.rocketWarningCooldown-dt);
  if(!warning||!incoming){if(warning){warning.className='lock-on-warning';delete warning.dataset.racer;delete warning.dataset.costume}hud?.classList.remove('rocket-locked');canvas.dataset.rocketWarning='none';return}
  hud?.classList.add('rocket-locked');
  const attacker=incoming.owner||raceContestants().find(racer=>contestantKey(racer)===incoming.ownerKey),costumeId=attacker?(attacker===miaNpc?'boss':activeCostumeId(attacker)):'unknown',face=$('lockOnFace');warning.dataset.racer=attacker?.slug||incoming.ownerKey||'unknown';warning.dataset.costume=costumeId;if(face&&attacker){face.hidden=false;face.setAttribute('aria-label',`${attacker.name} ${costumeId}`);ensureRacerFaceIcon(face,attacker,'rocket-lock')}else if(face)face.hidden=true;
  const gap=Math.max(0,Math.round(Math.abs(state.distance-incoming.z))),side=Math.sign(incoming.lane-state.x)||incoming.approachSide||0,direction=side<0?'left':side>0?'right':'center',danger=gap<36?'critical':gap<78?'danger':'tracking';warning.className=`lock-on-warning show direction-${direction} ${danger}`;$('lockOnDetail').textContent=`${direction==='left'?'LEFT':direction==='right'?'RIGHT':'BEHIND'} • ${gap}m`;canvas.dataset.rocketWarning=`${direction}:${gap}`;canvas.dataset.rocketWarningOwner=incoming.ownerKey;
  canvas.dataset.rocketWarningCostume=costumeId;if(state.rocketWarningCooldown<=0){playSfx('lockWarning',{variant:danger==='critical'?2:danger==='danger'?1:0,intensity:danger==='critical'?1:.76});state.rocketWarningCooldown=danger==='critical'?.2:danger==='danger'?.34:.52}
}
function applyMiaThrowHit(shot){
  const player=racers[state.selected];tryActivateRacerSignature(player,'incoming');const blocked=state.shield>0||state.invincible>0,anchor=playerEffectAnchor(),kind=shot.kind==='miaBone'?'bone':'can';if(state.shield>0)state.shield=0;
  if(!blocked){state.speed*=signatureResistance(kind==='bone'?.62:.76,signaturePerformance(player).ram);state.steer=clamp(state.steer+(shot.approachSide||1)*(kind==='bone'?.2:.48),-1,1);state.weatherSlip=clamp(state.weatherSlip+(shot.approachSide||1)*(kind==='bone'?.08:.18),-.28,.28);state.shake=Math.max(state.shake,kind==='bone'?14:11);state.flash=Math.max(state.flash,kind==='bone'?.32:.2);state.collisionCooldown=Math.max(state.collisionCooldown,.9);tryActivateRacerSignature(player,'hit')}shot.life=0;state.particles.push({kind:'catCanImpact',layer:'front',x:anchor.x,y:anchor.y-anchor.height*.45,vx:0,vy:-18,life:.34,max:.34,size:kind==='bone'?155:132,rot:0,spin:1.8});burst(anchor.x,anchor.y-anchor.height*.42,7,blocked?'#70efff':'#ff67b7',1);playSfx(blocked?'shield':kind==='bone'?'miaBoneHit':'miaCanHit',{intensity:1.05});toast(blocked?'BELL GUARD!':kind==='bone'?'BONE BONK!':'EMPTY CAN BONK!');canvas.dataset.miaThrowHits=String(Number(canvas.dataset.miaThrowHits||0)+1);canvas.dataset.miaThrowHitKind=kind;canvas.dataset.miaThrowBlocked=String(blocked)
}
function updateMiaThrownProjectile(shot,dt){
  const player=racers[state.selected];if(!sameActiveRouteEdge(shot,shot.z,player,state.distance)){if(shot.age>.3)shot.life=0;return}shot.lane+=(state.x-shot.lane)*Math.min(1,dt*1.35);shot.z-=shot.speed*dt;if(shot.age>.08&&Math.abs(shot.z-state.distance)<19&&Math.abs(shot.lane-state.x)<.28)applyMiaThrowHit(shot);if(shot.z<state.distance-30)shot.life=0
}
function updateRockets(dt){
  for(const shot of state.projectiles){shot.age=(shot.age||0)+dt;shot.life-=dt;if(shot.kind==='miaBone'||shot.kind==='miaCan'){updateMiaThrownProjectile(shot,dt);continue}let target=shot.target;if(!target||target===shot.owner||target.distance<shot.z-34){target=selectRocketTarget(shot.owner,shot.z-12);shot.target=target;shot.targetKey=target?contestantKey(target):'';if(target)canvas.dataset.rocketTarget=shot.targetKey}
    if(target){const shared=sameActiveRouteEdge(shot,shot.z,target,target.distance),shotRoute=routeStateForRacer(shot,shot.z),mergeBlend=!shared&&shotRoute?.active?clamp((shotRoute.t-.72)/.28,0,1):1,targetLane=shared?target.lane:(shotRoute?.center||shot.lane)*(1-mergeBlend)+target.lane*mergeBlend;canvas.dataset.rocketRouteMode=shared?'direct':'merge-converge';shot.lane+=(targetLane-shot.lane)*Math.min(1,dt*(shot.turnRate||3.25));const gap=target.distance-shot.z;shot.speed+=clamp(118+Math.max(-10,Math.min(24,gap*.08))-shot.speed,-34*dt,42*dt)}
    shot.z=advanceRouteDistance(shot,shot.z,shot.speed*dt);if(shot.age<.11)continue;const collision=raceContestants().filter(racer=>racer!==shot.owner&&sameActiveRouteEdge(shot,shot.z,racer,racer.distance)).map(racer=>({racer,dz:Math.abs(racer.distance-shot.z),lane:Math.abs(racer.lane-shot.lane)})).filter(hit=>hit.dz<22&&hit.lane<.24).sort((a,b)=>a.dz+a.lane*28-(b.dz+b.lane*28))[0];if(collision)applyRocketHit(shot,collision.racer)
  }
  state.projectiles=state.projectiles.filter(shot=>shot.life>0&&shot.z-state.distance<DRAW_DISTANCE);canvas.dataset.rocketActive=String(state.projectiles.filter(shot=>shot.kind==='rocket').length);canvas.dataset.miaThrowProjectiles=String(state.projectiles.filter(shot=>shot.kind==='miaBone'||shot.kind==='miaCan').length);updateRocketLockWarning(dt)
}
function announceAiItemUse(racer,item){
  canvas.dataset.aiItemUses=String(Number(canvas.dataset.aiItemUses||0)+1);canvas.dataset.aiLastItem=item;canvas.dataset.aiLastItemUser=contestantKey(racer);if(Math.abs(racer.distance-state.distance)>300)return;const p=projectTrackEntity(racer.distance,racer.lane),size=Math.max(100,150*(p.scale||1)),label=CAT_CAN_GEARS[item]?.label||item.toUpperCase();playSfx(item,{intensity:.72});if(p.visible){spawnVfx(item==='star'?4:2,p.x,p.y-size*.28,.65,size,'front',true);burst(p.x,p.y-size*.25,7,item==='star'?'#fff2a4':'#74ecff',item==='star'?3:0)}toast(`${racer.name} ${label}!`)
}
function useAiStar(racer){racer.invincible=Math.max(racer.invincible||0,2.2);racer.aiBoost=Math.max(racer.aiBoost||0,1.65);racer.aiVelocity=Math.max(racer.aiVelocity||0,205);racer.hit=0;racer.spin=0;racer.aiItem=null;racer.aiItemAge=0;announceAiItemUse(racer,'star')}
function useAiShield(racer){racer.shield=7;racer.aiItem=null;racer.aiItemAge=0;announceAiItemUse(racer,'shield')}
function useAiWhiskerPulse(racer){for(const target of raceContestants()){if(target===racer||target.invincible>0||!sameActiveRouteEdge(racer,racer.distance,target,target.distance)||Math.abs(target.distance-racer.distance)>190)continue;if(target===racers[state.selected]){if(state.shield>0)state.shield=0;else{state.speed*=.8;state.shake=Math.max(state.shake,9)}}else if(target.shield>0)target.shield=0;else{target.hit=Math.max(target.hit||0,1.7);target.aiVelocity*=.82}}racer.aiItem=null;racer.aiItemAge=0;announceAiItemUse(racer,'lightning')}
function awardAiCatCan(racer){if(racer.aiItem)return;const rank=raceOrder().indexOf(racer)+1;racer.aiItem=rollCatCanGear(rank);racer.aiItemAge=0;canvas.dataset.aiCatCanRolls=String(Number(canvas.dataset.aiCatCanRolls||0)+1)}
function updateAiItemUse(racer,dt){
  if(!racer.aiItem)return;racer.aiItemAge=(racer.aiItemAge||0)+dt;const ai=racer.aiPersonality||{aggression:.82,key:'boss'},player=racers[state.selected],order=raceOrder(),rank=order.indexOf(racer)+1,target=selectRocketTarget(racer,racer.distance),gap=target?target.distance-racer.distance:Infinity;
  if(racer.aiItem==='rocket'){const ready=racer.aiItemAge>.48+(1-ai.aggression)*.9,window=gap>17&&gap<290;if(ready&&window&&!racer.airborne){launchRocket(racer,{target});racer.aiItem=null;racer.aiItemAge=0;racer.aiBoostCooldown=Math.max(racer.aiBoostCooldown||0,.7)}return}
  if(racer.aiItem==='shield'){const incoming=state.projectiles.some(shot=>shot.target===racer&&shot.owner!==racer&&shot.z<racer.distance&&racer.distance-shot.z<220),rearThreat=raceContestants().some(other=>other!==racer&&racer.distance-other.distance>4&&racer.distance-other.distance<64&&Math.abs(other.lane-racer.lane)<.44),ready=racer.aiItemAge>.42,maxHold=racer.aiItemAge>4.8;if(ready&&(incoming||maxHold||(rank<=8&&rearThreat&&racer.aiItemAge>1.1)))useAiShield(racer);return}
  if(racer.aiItem==='star'){const emergency=(racer.hit||0)>.05||(racer.spin||0)>.05||Math.abs(racer.lane)>.96,slow=(racer.aiVelocity||0)<(racer.aiSpeed||150)*.76,attack=gap>12&&gap<175&&(ai.key==='booster'||ai.key==='sprinter'||ai.key==='charger'),maxHold=racer.aiItemAge>4.35;if(racer.aiItemAge>.38&&(emergency||maxHold||(racer.aiItemAge>.72&&(slow||attack||rank>12))))useAiStar(racer)}
  if(racer.aiItem==='lightning'&&racer.aiItemAge>.7){const targets=raceContestants().filter(other=>other!==racer&&sameActiveRouteEdge(racer,racer.distance,other,other.distance)&&Math.abs(other.distance-racer.distance)<190);if(targets.length>=2||racer.aiItemAge>3.8)useAiWhiskerPulse(racer)}
}
function updateAiRocketUse(racer,dt){updateAiItemUse(racer,dt)}
function useItem(){
  if(state.mode!=='race'||!state.running||state.paused||catCanReveal.active||!state.item)return;
  const item=state.item,player=racers[state.selected],target=item==='rocket'?selectRocketTarget(player):null;if(item==='rocket'&&!target){playSfx('uiBack',{intensity:.65});toast('NO TARGET · GEAR KEPT');return}state.item=null;drawHeldItem();const anchor=playerEffectAnchor();
  if(item==='star'){state.invincible=Math.max(state.invincible,2.2);state.turbo=Math.max(state.turbo,3.1);state.speed=Math.max(state.speed,212);playSfx('boost',{intensity:1.15});toast('COMET DASH!');spawnVfx(2,anchor.x,anchor.y-anchor.height*.3,.82,205,'front',true);burst(anchor.x,anchor.y-anchor.height*.26,9,'#5beeff',6)}
  if(item==='shield'){state.shield=7;playSfx('shield');toast('BELL GUARD!');spawnVfx(2,anchor.x,anchor.y-anchor.height*.45,.8,205,'front',true);burst(anchor.x,anchor.y-anchor.height*.45,5,'#6deeff',0)}
  if(item==='rocket'){launchRocket(player,{target});toast('SEEKER PAW!')}
  if(item==='lightning'){for(const r of raceContestants()){if(r===player||r.invincible>0||!sameActiveRouteEdge(player,state.distance,r,r.distance)||Math.abs(r.distance-state.distance)>230)continue;if(r.shield>0){r.shield=0;continue}r.hit=Math.max(r.hit||0,2.4);r.spin=Math.max(r.spin||0,.8);r.aiVelocity*=.76}playSfx('lightning');toast('WHISKER PULSE!');state.flash=Math.max(state.flash,.72);spawnVfx(3,anchor.x,anchor.y-anchor.height*.7,.85,220,'front',true);burst(anchor.x,anchor.y-anchor.height*.66,9,'#ff70dc',5)}
  state.shake=Math.max(state.shake,item==='star'?8:12);canvas.dataset.catCanUses=String(Number(canvas.dataset.catCanUses||0)+1);canvas.dataset.catCanLastUse=item
}
function collectObject(o,targetIndex){
  if(o.taken)return;o.taken=true;o.takenBy=targetIndex;o.takenAt=state.elapsed;o.respawnAt=state.elapsed+(PICKUP_RESPAWN_MS[o.type]||900);const r=racers[targetIndex],player=targetIndex===state.selected,label=o.type==='coin'?`COIN +${COIN_PICKUP_REWARD}`:o.type==='item'?'CAT CAN':'BOOST';state.collectFx.push({type:o.type,z:o.z,lane:o.lane,targetIndex,life:.78,max:.78,label});
  if(o.type==='coin'){if(player){state.coins=Math.min(10,state.coins+1);state.raceWalletEarned+=COIN_PICKUP_REWARD;addWalletCoins(COIN_PICKUP_REWARD);playSfx('coin');toast(`+${COIN_PICKUP_REWARD} COINS`)}else r.aiCoins=Math.min(10,(r.aiCoins||0)+1)}
  else if(o.type==='item'){if(player)giveCatCanGear();else{awardAiCatCan(r);r.aiVelocity=Math.max(r.aiVelocity,172)}}
  else if(player){state.turbo=1.25;state.speed=Math.max(state.speed,195);playSfx('boost');toast('BOOST PAD!')}else{r.aiVelocity=Math.max(r.aiVelocity,198);r.aiBoost=1.2}
  tryActivateRacerSignature(r,'pickup')
}
function updatePickupRespawns(){
  let respawned=0;for(const object of state.objects){if(object.type==='ramp'||!object.taken||state.elapsed<object.respawnAt)continue;object.taken=false;object.takenBy=null;object.respawnCount=(object.respawnCount||0)+1;object.respawnFxUntil=state.elapsed+260;respawned++}
  if(respawned)canvas.dataset.pickupRespawns=String(Number(canvas.dataset.pickupRespawns||0)+respawned);canvas.dataset.pickupRespawnModel='fast-backmarker-v1';canvas.dataset.itemRespawnMs=String(PICKUP_RESPAWN_MS.item)
}
function pickupReservedForBackmarker(object){
  if(object.type!=='item')return false;const field=raceContestants().length;if(state.rank<=Math.ceil(field*.5))return false;const ahead=object.z-state.distance;if(ahead<12||ahead>210)return false;const player=racers[state.selected],route=routeStateForRacer(player,object.z),choice=route?.active?player.routeChoice:null;if(object.route&&choice&&object.route!==choice)return false;
  const row=state.objects.filter(candidate=>candidate.type==='item'&&!candidate.taken&&Math.abs(candidate.z-object.z)<1.5&&(!candidate.route||!choice||candidate.route===choice));if(!row.length)return false;let nearest=row[0],gap=Math.abs(nearest.lane-state.x);for(const candidate of row.slice(1)){const candidateGap=Math.abs(candidate.lane-state.x);if(candidateGap<gap){nearest=candidate;gap=candidateGap}}return nearest===object
}
function spawnLandingDust(impact=1){const drop=jumpCameraDrop(),surface=state.surface==='road'?(trackMaterialAt(state.distance).drive||SURFACE_PROFILES.road):(SURFACE_PROFILES[state.surface]||SURFACE_PROFILES.road),dustColor=surface.material==='jungle-mud'?'#80613a':surface.material==='jungle-wood'?'#c99b55':surface.id==='road'?'#efd1a2':surface.color,px=innerWidth*.5+state.steer*18,py=Math.min(innerHeight*.96,innerHeight*.89+drop*.58),power=Math.max(.6,Math.min(1.45,impact)),count=Math.max(8,Math.round(26*effectDensity()));state.particles.push({kind:'shockwave',layer:'front',x:px,y:py+10,vx:0,vy:0,life:.38,max:.38,color:'rgba(255,244,196,.9)',size:105+power*64,rot:0,spin:0});state.particles.push({kind:'dust',fxFrame:4,layer:'back',x:px,y:py+10,vx:0,vy:-4,life:.82,max:.82,color:dustColor,size:330+power*110,rot:0,spin:0});for(let i=0;i<count;i++){const side=i%2?1:-1,front=i%4===0;state.particles.push({kind:'dust',fxFrame:i%5===0?4:i%3===0?3:5,layer:front?'front':'back',x:px+side*(20+Math.random()*84),y:py+8+Math.random()*14,vx:side*(80+Math.random()*230)*power,vy:-28-Math.random()*112*power,life:.42+Math.random()*.44,max:.88,color:i%3?dustColor:'#fff1bd',size:52+Math.random()*76+power*20,rot:(Math.random()-.5)*.34,spin:(Math.random()-.5)*.9})}}
function spawnRampTakeoffFx(){const px=innerWidth*.5+state.steer*18,py=innerHeight*.86,count=Math.max(6,Math.round(16*effectDensity()));state.particles.push({kind:'dust',fxFrame:4,layer:'back',x:px,y:py+10,vx:0,vy:-12,life:.5,max:.5,size:210,rot:0,spin:.15});for(let i=0;i<count;i++){const side=i%2?1:-1;state.particles.push({kind:'dust',fxFrame:i%3===0?4:3,layer:i%4?'back':'front',x:px+side*(18+Math.random()*72),y:py+14+Math.random()*10,vx:side*(65+Math.random()*155),vy:-55-Math.random()*120,life:.36+Math.random()*.34,max:.7,color:'#f1d59e',size:52+Math.random()*60,rot:(Math.random()-.5)*.34,spin:(Math.random()-.5)*.8})}}
function launchRamp(index){if(index===state.selected){if(state.airborne)return;const racer=racers[index];state.airborne=true;state.jumpY=1;state.jumpVelocity=228+state.speed*.16;state.jumpView=Math.max(state.jumpView,.16);state.speed=Math.max(state.speed,158);state.turbo=Math.max(state.turbo,1.05);state.suspension=-13;state.suspensionVelocity=-58;state.shake=Math.max(state.shake,10);state.flash=Math.max(state.flash,.18);playSfx('ramp',{intensity:1.1});spawnRampTakeoffFx();toast('RAMP JUMP!');tryActivateRacerSignature(racer,'air')}else{const racer=racers[index];if(racer.airborne)return;racer.airborne=true;racer.jumpY=1;racer.jumpVelocity=205+(racer.aiVelocity||140)*.12;racer.aiBoost=Math.max(racer.aiBoost||0,.9);tryActivateRacerSignature(racer,'air')}}
function updateJumpPhysics(body,dt,player=false){if(!body.airborne)return;const gravity=player?455:420;body.jumpVelocity-=gravity*dt;body.jumpY+=body.jumpVelocity*dt;if(player&&body.jumpVelocity<0)state.speed+=Math.min(18,(-body.jumpVelocity/300)*16)*dt;if(body.jumpY<=0&&body.jumpVelocity<0){const impact=Math.min(1.25,Math.max(.35,-body.jumpVelocity/290));body.jumpY=0;body.jumpVelocity=0;body.airborne=false;if(player){state.suspension=13;state.suspensionVelocity=64;state.landingBounce=Math.max(state.landingBounce,11+impact*9);state.landingBounceVelocity=Math.min(state.landingBounceVelocity,-135-impact*58);state.shake=Math.max(state.shake,10+impact*3);playSfx('land',{intensity:impact});spawnLandingDust(impact);toast('LANDING BOOST!');state.turbo=Math.max(state.turbo,.48+impact*.32);state.speed=Math.max(state.speed,178+impact*28)}}}
function spawnDrivingFx(dt,surfaceInfo,drifting){
  const surface=typeof surfaceInfo==='object'?surfaceInfo:(SURFACE_PROFILES[surfaceInfo]||surfaceAtLane(state.x)),material=trackMaterialAt(state.distance),offroad=surface.id!=='road'||material.detail==='mud';
  const density=effectDensity(),px=innerWidth*.5+state.steer*18,py=innerHeight*.87,speed=Math.min(1,state.speed/190),room=state.particles.length<Math.round(260*density);if(room&&state.speed>22&&Math.random()<dt*(8+speed*15)*density){const boost=state.boosting;state.particles.push({kind:'smoke',fxFrame:boost?1:0,layer:'back',x:px+(Math.random()-.5)*38,y:py+18,vx:(Math.random()-.5)*34,vy:-18-Math.random()*32,life:.38+Math.random()*.34,max:.72,color:boost?'#d9fbff':'#c8bed0',size:(boost?78:58)+Math.random()*26,rot:(Math.random()-.5)*.2,spin:(Math.random()-.5)*.45})}
  if(room&&state.speed>32&&Math.random()<dt*(7+speed*16)*density){const boost=state.boosting;state.particles.push({kind:'exhaust',layer:'back',x:px+(Math.random()-.5)*42,y:py+14,vx:(Math.random()-.5)*28,vy:55+Math.random()*75,life:boost?.35:.22,max:boost?.35:.22,color:boost?'#64efff':'#ff9d4d',size:boost?12:6,rot:0,spin:0})}
  if(room&&offroad&&Math.random()<dt*((18+speed*48)*surface.dust)*density){for(const side of [-1,1])state.particles.push({kind:'dust',fxFrame:surface.id==='shoulder'?5:(Math.random()>.28?3:5),layer:Math.random()>.76?'front':'back',x:px+side*(45+Math.random()*30),y:py+22,vx:side*(34+Math.random()*105),vy:-26-Math.random()*80,life:.5+Math.random()*.42,max:.92,color:surface.color,size:62+surface.amount*42+Math.random()*58,rot:(Math.random()-.5)*.25,spin:(Math.random()-.5)*.65})}
  if(room&&drifting&&state.speed>65&&Math.random()<dt*(11+speed*15)*density){const side=Math.sign(state.steer)||1;state.particles.push({kind:'smoke',fxFrame:2,layer:'back',x:px-side*(54+Math.random()*18),y:py+19,vx:-side*(25+Math.random()*75),vy:-24-Math.random()*35,life:.5+Math.random()*.34,max:.84,color:'#e8d9e6',size:105+Math.random()*52,rot:-side*.08+(Math.random()-.5)*.12,spin:(Math.random()-.5)*.35})}
  if(drifting&&state.speed>65&&Math.random()<dt*(20+state.driftLevel*13)*density){const side=Math.sign(state.steer)||1,color=['#74ecff','#74ecff','#ffb13b','#ff52de'][state.driftLevel];state.particles.push({kind:'spark',layer:'back',x:px-side*62,y:py+10,vx:-side*(65+Math.random()*120),vy:-35-Math.random()*95,life:.22+Math.random()*.22,max:.44,color,size:2+Math.random()*3,rot:0,spin:0})}
  const weather=surface.id==='road'&&!state.airborne?state.weatherSurface:'dry',trailType=weather==='snow'?'snow':weather==='wet'||weather==='damp'?'rain':null;if(room&&weatherDrivingFxFrames.length===12&&trailType&&state.speed>28){const rate=trailType==='snow'?7+speed*17:10+speed*24;if(Math.random()<dt*rate*density){const strong=trailType==='rain'?(weather==='damp'?.68:1):1,life=trailType==='snow'?.48+Math.random()*.22:.28+Math.random()*.16,slip=clamp(state.weatherSlip*2+state.steer*.12,-1,1);state.particles.push({kind:'weatherTrail',weatherType:trailType,layer:'back',x:px,y:py+16+Math.random()*7,vx:-slip*(trailType==='snow'?58:92),vy:trailType==='snow'?-35-Math.random()*54:-72-Math.random()*92,life,max:life,size:(trailType==='snow'?112:92)*(0.72+speed*.52)*strong,alpha:strong,rot:-slip*(trailType==='snow'?.045:.08),spin:-slip*(trailType==='snow'?.18:.32)})}}canvas.dataset.weatherTrail=trailType||'dry';canvas.dataset.weatherTrailParticles=String(state.particles.filter(particle=>particle.kind==='weatherTrail').length);canvas.dataset.weatherTrailAsset=weatherDrivingFxFrames.length===12?'gpt-image-2-uniform-6x2':'loading'
}

function startMiaIntrusion(){
  if(miaNpc.triggered||miaNpc.cutInActive||state.finish)return;
  miaNpc.triggered=true;miaNpc.cutInActive=true;miaNpc.freezeElapsed=state.elapsed;state.paused=true;pauseRaceMusic();playSfx('mia',{intensity:1.2});
  const overlay=$('miaIntrusion'),art=overlay?.querySelector('[data-delivery-src]');if(art)assignDeliveryImage(art,art.dataset.deliverySrc,'race-enhancement');overlay.classList.remove('hidden','show');void overlay.offsetWidth;overlay.classList.add('show');
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
  const spawnGap=difficulty.miaSpawnGap??38;Object.assign(miaNpc,{active:true,distance:state.distance+spawnGap,progress:(state.distance+spawnGap)/raceLength(),lane:clamp(state.x+side*.5,-1.25,1.25),aiTargetLane:clamp(state.x-side*.18,-1.1,1.1),aiVelocity:Math.max(difficulty.miaBase,state.speed+difficulty.miaOffset),hit:0,spin:0,jumpY:255,jumpVelocity:-30,airborne:true,landed:false,throwCooldown:randomMiaThrowDelay(difficulty,'initial'),throwAnim:0,throwDuration:difficulty.miaThrowDuration,throwReleaseAt:difficulty.miaThrowRelease,throwKind:null,throwReleased:false,routeChoice:null,routeLap:-1,routeMerged:false,routePhysicalProgress:0,routeNormalizedProgress:0,routeComparableDistance:state.distance+spawnGap});
  exposeMiaThrowProfile(difficulty);
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
function startMiaThrow(){
  const profile=difficultyProfile();miaNpc.throwAnim=.001;miaNpc.throwDuration=profile.miaThrowDuration;miaNpc.throwReleaseAt=profile.miaThrowRelease;miaNpc.throwKind=Math.random()<.58?'bone':'can';miaNpc.throwReleased=false;miaNpc.aiTargetLane=miaNpc.lane;const tell=MIA_THROW_TELEGRAPHS[miaNpc.throwKind];exposeMiaThrowProfile(profile);exposeMiaThrowTell(miaNpc.throwKind);playSfx(tell.audio,{intensity:profile===DIFFICULTY_PROFILES.hard?1.05:.9});toast(profile===DIFFICULTY_PROFILES.hard?`MIA RAPID ${tell.label}!`:`MIA ${tell.label} READY!`);canvas.dataset.miaThrow='wind-up';canvas.dataset.miaThrowKind=miaNpc.throwKind;canvas.dataset.miaThrowStarts=String(Number(canvas.dataset.miaThrowStarts||0)+1)
}
function releaseMiaThrow(){
  if(miaNpc.throwReleased)return;miaNpc.throwReleased=true;const kind=miaNpc.throwKind==='bone'?'miaBone':'miaCan',shot={kind,owner:miaNpc,ownerKey:'mia-charme',shooter:miaNpc,shooterKey:'mia-charme',ownerName:miaNpc.name,target:racers[state.selected],targetKey:racers[state.selected].slug,z:miaNpc.distance-4,lane:miaNpc.lane,speed:88+miaNpc.aiVelocity/3.6,life:4.2,age:0,approachSide:Math.random()<.5?-1:1,routeChoice:miaNpc.routeChoice||null,routeLap:Number.isFinite(miaNpc.routeLap)?miaNpc.routeLap:-1,routeMerged:!!miaNpc.routeMerged,routePhysicalProgress:miaNpc.routePhysicalProgress||0};state.projectiles.push(shot);playSfx('miaThrowRelease',{variant:kind==='miaBone'?0:1,intensity:1});canvas.dataset.miaThrow='released';canvas.dataset.miaThrowReleases=String(Number(canvas.dataset.miaThrowReleases||0)+1)
}
function updateMiaThrowAttack(dt){
  const profile=difficultyProfile();if(!miaNpc.landed||miaNpc.airborne||miaNpc.hit>0){miaNpc.throwCooldown=Math.max(miaNpc.throwCooldown,.7);return}if(miaNpc.throwAnim>0){miaNpc.throwAnim+=dt;exposeMiaThrowTell(miaNpc.throwKind,miaNpc.throwAnim/miaNpc.throwReleaseAt);if(miaNpc.throwAnim>=miaNpc.throwReleaseAt)releaseMiaThrow();if(miaNpc.throwAnim>=miaNpc.throwDuration){miaNpc.throwAnim=0;miaNpc.throwKind=null;miaNpc.throwReleased=false;miaNpc.throwCooldown=randomMiaThrowDelay(profile);canvas.dataset.miaThrow='cooldown'}return}
  miaNpc.throwCooldown-=dt;const player=racers[state.selected],gap=miaNpc.distance-state.distance,shared=sameActiveRouteEdge(miaNpc,miaNpc.distance,player,state.distance),safeWindow=gap>profile.miaThrowGapMin&&gap<profile.miaThrowGapMax&&!tunnelAt(miaNpc.distance)&&!tunnelAt(state.distance);if(miaNpc.throwCooldown<=0&&shared&&safeWindow)startMiaThrow()
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
  const miaSurface=miaNpc.airborne?SURFACE_PROFILES.road:surfaceAtLane(miaNpc.lane,miaNpc.distance),miaWeather=miaNpc.airborne?WEATHER_DRIVE_PROFILES.dry:weatherDriveAt(miaNpc.distance,miaSurface),gap=miaNpc.distance-state.distance,targetGap=difficulty.miaTargetGap+Math.sin(state.elapsed*.0013)*5,targetSpeed=Math.max(difficulty.miaBase,state.speed+difficulty.miaOffset)+clamp((targetGap-gap)*difficulty.miaCatchup,-24,difficulty.miaCatchLimit),effectiveTarget=targetSpeed*miaWeather.maxFactor*(miaNpc.hit>0?difficulty.miaHitFactor:1);
  miaNpc.aiVelocity+=clamp(effectiveTarget-miaNpc.aiVelocity,-70*dt,58*miaWeather.accel*dt);miaNpc.distance=advanceRouteDistance(miaNpc,miaNpc.distance,Math.max(0,miaNpc.aiVelocity)*miaSurface.maxFactor/3.6*dt);miaNpc.progress=miaNpc.distance/length;
  const miaRoute=routeStateForRacer(miaNpc,miaNpc.distance);miaNpc.aiTargetLane=miaRoute?.active?miaRoute.center:clamp(Math.sin(state.elapsed*.00145)*.72+trackBend(miaNpc.progress)*.22,-1.25,1.25);miaNpc.lane+=(miaNpc.aiTargetLane-miaNpc.lane)*dt*(miaNpc.airborne?1.2:2.05);
  if(miaNpc.airborne){miaNpc.jumpVelocity-=520*dt;miaNpc.jumpY+=miaNpc.jumpVelocity*dt;if(miaNpc.jumpY<=0&&miaNpc.jumpVelocity<0){miaNpc.jumpY=0;miaNpc.jumpVelocity=0;miaNpc.airborne=false;miaNpc.landed=true;spawnMiaLandingFx();canvas.dataset.miaBoss='racing'}}
  updateMiaThrowAttack(dt);
  canvas.dataset.miaGap=(miaNpc.distance-state.distance).toFixed(1);canvas.dataset.miaAirborne=String(miaNpc.airborne);
}

function updateRaceParticles(dt){
  state.particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.kind==='shockwave'){p.vx*=Math.exp(-5*dt);p.vy*=Math.exp(-5*dt)}else if(p.kind==='smoke'){p.vx*=Math.exp(-1.8*dt);p.vy-=7*dt}else if(p.kind==='weatherTrail'){p.vx*=Math.exp(-(p.weatherType==='snow'?1.25:2.4)*dt);p.vy+=(p.weatherType==='snow'?24:190)*dt}else p.vy+=(p.kind==='dust'?58:90)*dt;p.life-=dt;p.rot+=dt*p.spin});state.particles=state.particles.filter(p=>p.life>0);const limit=effectParticleLimit();if(state.particles.length>limit){let excess=state.particles.length-limit;state.particles=state.particles.filter(particle=>{if(excess<=0||VFX_RENDER_CONTRACT.protected.includes(particle.kind))return true;excess--;return false});if(state.particles.length>limit)state.particles.splice(0,state.particles.length-limit)}canvas.dataset.vfxParticleCap=String(limit);canvas.dataset.vfxParticleCount=String(state.particles.length);state.shake*=Math.pow(.88,dt*60);
}
function updateEnvironmentInteractions(dt){
  if(!courseHasAmbience('snow')){state.snowTracks.length=0;state.snowTrackCursor={};canvas.dataset.snowTrackCount='0';return}
  for(const mark of state.snowTracks)mark.life-=dt;
  state.snowTracks=state.snowTracks.filter(mark=>mark.life>0&&mark.z>state.distance-24&&mark.z<state.distance+DRAW_DISTANCE+90);
  const player=racers[state.selected],nearest=raceContestants().filter(r=>r!==player).sort((a,b)=>Math.abs(a.distance-state.distance)-Math.abs(b.distance-state.distance)).slice(0,5),bodies=[player,...nearest];
  for(const body of bodies){
    const speed=body===player?state.speed:(body.aiVelocity||0),lane=body===player?state.x:body.lane,key=body.slug||'racer';if(speed<24||body.airborne||tunnelAt(body.distance)||surfaceAtLane(lane,body.distance).id!=='road')continue;
    const previous=state.snowTrackCursor[key];if(Number.isFinite(previous)&&body.distance-previous<4.8)continue;state.snowTrackCursor[key]=body.distance;
    state.snowTracks.push({z:body.distance-1.6,lane,life:11,max:11,owner:key});
  }
  if(state.snowTracks.length>280)state.snowTracks.splice(0,state.snowTracks.length-280);
  canvas.dataset.snowTrackCount=String(state.snowTracks.length);canvas.dataset.snowTrackModel='world-projected-persistent-v1';
}
function updateFinishCoast(dt){
  state.finishCoast+=dt;state.speed*=Math.exp(-.72*dt);const player=racers[state.selected];state.distance=advanceRouteDistance(player,state.distance,state.speed/3.6*dt,true);state.progress=state.distance/raceLength();player.distance=state.distance;player.progress=state.progress;player.lane=state.x;
  racers.forEach((r,i)=>{if(i===state.selected)return;r.distance=advanceRouteDistance(r,r.distance,Math.max(0,r.aiVelocity||r.aiSpeed)/3.6*dt);r.progress=r.distance/raceLength()});
  if(miaNpc.active){miaNpc.distance=advanceRouteDistance(miaNpc,miaNpc.distance,Math.max(0,miaNpc.aiVelocity)/3.6*dt);miaNpc.progress=miaNpc.distance/raceLength()}updateRouteCameraLane(dt);
  state.collectFx.forEach(f=>f.life-=dt);state.collectFx=state.collectFx.filter(f=>f.life>0);updateRaceParticles(dt);updateHud();canvas.dataset.finishCoast=state.finishCoast.toFixed(2);
}
function update(dt){
  if(state.mode!=='race'||!state.running||state.paused)return;
  if(state.finish){updateFinishCoast(dt);return}
  const selectedRacer=racers[state.selected],trait=selectedRacer.trait;
  state.elapsed+=dt*1000;updateCatCanReveal(dt);state.shield=Math.max(0,state.shield-dt);state.invincible=Math.max(0,state.invincible-dt);state.turbo=Math.max(0,state.turbo-dt/(trait.boostDuration*signaturePerformance(selectedRacer).boost));state.flash=Math.max(0,state.flash-dt*2.5);signatureFeedbackState.life=Math.max(0,signatureFeedbackState.life-dt);canvas.dataset.signatureFeedbackLife=signatureFeedbackState.life.toFixed(3);state.collisionCooldown=Math.max(0,state.collisionCooldown-dt);state.routeSelectionPulse=Math.max(0,state.routeSelectionPulse-dt/0.82);canvas.dataset.routeSelectionPulse=state.routeSelectionPulse.toFixed(3);updateRacerSignatures(dt);
  updatePickupRespawns();
  refreshJungleRouteHazards();
  const accel=actionDown('accelerate')||Boolean(activeCourse?.autoDrive),brake=actionDown('brake'),left=actionDown('left'),right=actionDown('right'),driftKey=actionDown('drift');
  const tune=selectedRacer.set.stats,signature=signaturePerformance(selectedRacer),baseMaxSpeed=(158+tune.speed*.22+Math.min(10,state.coins)*1.5+(state.turbo>0?48+tune.boost*.08:0)+(state.invincible>0?15:0))*trait.topSpeed*signature.speed,entrySurface=surfaceAtLane(state.x),penaltySurface=state.invincible>0||state.airborne?SURFACE_PROFILES.road:entrySurface,weather=state.invincible>0||state.airborne?WEATHER_DRIVE_PROFILES.dry:weatherDriveAt(state.distance,entrySurface),rawWeatherMax=state.turbo>0||state.invincible>0?1-(1-weather.maxFactor)*.35:weather.maxFactor,weatherMax=signatureResistance(rawWeatherMax,signature.weather),surfaceMax=signatureResistance(penaltySurface.maxFactor,signature.offroad),weatherAccel=signatureResistance(weather.accel,signature.weather),weatherGrip=signatureResistance(weather.grip,signature.weather),weatherSteer=signatureResistance(weather.steer,signature.weather),maxSpeed=baseMaxSpeed*surfaceMax*weatherMax;
  if(accel)state.speed+=(66+tune.accel*.3)*trait.acceleration*signature.accel*penaltySurface.accel*weatherAccel*dt;else state.speed-=(48+penaltySurface.roll*420)*dt;
  if(brake)state.speed-=145*weather.brake*dt;
  state.speed-=state.speed*state.speed*(.00042+penaltySurface.drag+weather.drag)*dt;state.speed=Math.max(0,Math.min(maxSpeed,state.speed));if(state.speed<.05)state.speed=0;
  const digitalSteer=Number(right)-Number(left),steerTarget=Math.abs(gamepadInput.steer)>.16?gamepadInput.steer:digitalSteer,steerGrip=Math.min(1,state.speed/80)*penaltySurface.grip*weatherGrip*(penaltySurface.id==='road'?trait.curveGrip*signature.grip:trait.offroadGrip*signature.offroad);
  const steerResponse=(5.1+tune.handling*.025)*penaltySurface.steer*weatherSteer*signature.grip;state.steer+=(steerTarget-state.steer)*dt*(driftKey?steerResponse+2:steerResponse);state.x+=state.steer*steerGrip*dt*(driftKey?1.15+tune.handling*.0013:.79+tune.handling*.0017)*penaltySurface.lateral;
  state.trackCurve=trackBend(state.progress);
  const speedRatio=Math.min(1.2,state.speed/185),curveForce=state.trackCurve*speedRatio*speedRatio*(driftKey?.52:1.1-tune.handling*.0013)/(trait.curveGrip*signature.grip);
  const slipTarget=(state.steer*(driftKey?weather.driftSlip:weather.coastSlip)-state.trackCurve*weather.curveSlip)*speedRatio;state.weatherSlip+=(slipTarget-state.weatherSlip)*Math.min(1,dt*(driftKey?4.2:2.8));state.weatherSlip*=Math.exp(-weather.recovery*dt);state.x+=state.weatherSlip*dt*(.9+speedRatio*.55);
  state.centrifugal+=(curveForce-state.centrifugal)*Math.min(1,dt*4.5);state.x-=state.centrifugal*dt*.92*(1+(1-penaltySurface.grip*weatherGrip)*.72);
  if(state.airborne){const airGrip=Math.min(1,state.speed/160),airControl=(.34+tune.handling*.0014)*airGrip*signature.air;state.x+=steerTarget*airControl*dt;state.steer+=steerTarget*dt*.16*signature.air}
  const surface=surfaceAtLane(state.x),material=trackMaterialAt(state.distance),activePenalty=state.invincible>0||state.airborne?SURFACE_PROFILES.road:surface;state.surface=surface.id;state.weatherSurface=weather.id;state.trackMaterial=material.id;state.offroadAmount=surface.amount;canvas.dataset.surface=surface.id;canvas.dataset.weatherSurface=weather.id;canvas.dataset.weatherGrip=weather.grip.toFixed(2);canvas.dataset.weatherBrake=weather.brake.toFixed(2);canvas.dataset.weatherSlip=state.weatherSlip.toFixed(3);canvas.dataset.trackMaterial=material.id;canvas.dataset.offroadAmount=surface.amount.toFixed(2);updateSurfaceHaptics(dt);
  if(activePenalty.id!=='road'){state.speed=Math.min(state.speed,baseMaxSpeed*signatureResistance(activePenalty.maxFactor,signature.offroad));state.shake=Math.max(state.shake,activePenalty.shake*Math.min(1,state.speed/145)/signature.offroad)}
  if(activePenalty.id!=='road'&&accel&&state.speed<30){state.speed=Math.min(baseMaxSpeed*signatureResistance(activePenalty.maxFactor,signature.offroad),Math.max(state.speed,18)+42*trait.offroadGrip*signature.offroad*dt);if(activePenalty.id==='deep'&&Math.abs(state.x)>1.85)state.x-=Math.sign(state.x)*.38*trait.offroadGrip*signature.offroad*dt}
  const boundaryProfile=trackBoundaryProfileAt(state.distance),boundary=selectedBoundaryCorridor(boundaryProfile,selectedRacer),hitSide=state.x<boundary.collisionLeft?-1:state.x>boundary.collisionRight?1:0;if(hitSide&&state.invincible<=0&&state.collisionCooldown<=0){state.x=hitSide<0?boundary.collisionLeft:boundary.collisionRight;state.speed*=.74;state.steer*=-.28;state.shake=12;state.collisionCooldown=.55;playSfx('collision',{intensity:.85});toast(material.elevated?'BRIDGE EDGE!':'COURSE EDGE!');burst(innerWidth/2+hitSide*innerWidth*.42,innerHeight*.74,10,material.id==='jungle-wood'?'#e9ba72':'#fff2a4')}
  state.x=clamp(state.x,boundary.railLeft+.02,boundary.railRight-.02);state.x*=Math.pow(surface.id==='road'?.998:.9994,dt*60);canvas.dataset.guardrailCollisionModel=GUARDRAIL_GEOMETRY_MODEL;canvas.dataset.guardrailCollisionCorridor=boundary.id;canvas.dataset.guardrailCollisionLeft=boundary.collisionLeft.toFixed(3);canvas.dataset.guardrailCollisionRight=boundary.collisionRight.toFixed(3);canvas.dataset.guardrailRailLeft=boundary.railLeft.toFixed(3);canvas.dataset.guardrailRailRight=boundary.railRight.toFixed(3);canvas.dataset.guardrailRoadLeft=boundary.roadLeft.toFixed(3);canvas.dataset.guardrailRoadRight=boundary.roadRight.toFixed(3);

  if(driftKey&&Math.abs(state.steer)>.18&&state.speed>65){
    const previousDriftLevel=state.driftLevel;
    state.drift=Math.min(3.2,state.drift+dt*(.58+tune.technique*.0018+Math.abs(state.steer)*.55)*trait.driftCharge*signature.drift);
    state.driftLevel=state.drift>=2.25?3:state.drift>=1.25?2:state.drift>=.5?1:0;
    if(state.driftLevel>previousDriftLevel)playSfx('driftCharge',{variant:state.driftLevel,intensity:.85+state.driftLevel*.08});
    const colors=['#65e9ff','#65e9ff','#ffad3d','#ff4edb'];
    if(Math.random()<dt*38)burst(innerWidth/2+state.x*150-state.steer*72,innerHeight*.88,1,colors[state.driftLevel]);
  } else if(state.drift>0){
    const level=state.driftLevel;if(level){const boostTune=(.82+tune.boost*.003)*signature.boost;state.turbo=[0,.65,1.15,1.8][level]*boostTune;state.speed=Math.max(state.speed,[0,180,196,212][level]+(tune.boost-80)*.1);playSfx('boost',{intensity:.75+level*.18});toast(['','MINI TURBO!','SUPER TURBO!','ULTRA TURBO!'][level]);spawnVfx(2,innerWidth/2+state.x*150,innerHeight*.84,.65);tryActivateRacerSignature(selectedRacer,'driftRelease')}
    state.drift=0;state.driftLevel=0;
  }
  state.boosting=state.turbo>0||state.invincible>0;
  updateJumpPhysics(state,dt,true);const jumpTarget=state.airborne?clamp(state.jumpY/145+Math.max(0,state.jumpVelocity)*.0012,0,1):0;state.jumpView+=(jumpTarget-state.jumpView)*Math.min(1,dt*(state.airborne?7.2:5.4));if(!state.airborne&&state.jumpView<.01)state.jumpView=0;const riseAhead=hillAt(state.distance+18)-hillAt(state.distance),riseBehind=hillAt(state.distance)-hillAt(state.distance-18),suspensionTarget=state.airborne?-4:-(riseAhead-riseBehind)*Math.min(1,state.speed/150)*78;state.suspensionVelocity+=(suspensionTarget-state.suspension)*38*dt;state.suspensionVelocity*=Math.exp(-8*dt);state.suspension+=state.suspensionVelocity*dt;state.suspension=Math.max(-13,Math.min(13,state.suspension));spawnDrivingFx(dt,surface,driftKey&&Math.abs(state.steer)>.18);
  const length=raceLength(),laps=raceLaps(),previousDistance=state.distance;
  state.distance=Math.max(0,advanceRouteDistance(selectedRacer,state.distance,state.speed/3.6*dt,true));state.progress=state.distance/length;racers[state.selected].distance=state.distance;racers[state.selected].progress=state.progress;updateBiomeZoneTransition(dt);
  racers[state.selected].lane=state.x;
  updatePlayerRoute(previousDistance,dt);racers[state.selected].lane=state.x;updateRouteCameraLane(dt);
  if(state.speed>1){const targetHeading=trackSample(state.progress+.008).heading,turn=angleDelta(targetHeading,state.cameraHeading),maxTurn=(.34+Math.min(1,state.speed/180)*.44)*dt;state.cameraHeading=Math.atan2(Math.sin(state.cameraHeading+Math.max(-maxTurn,Math.min(maxTurn,turn))),Math.cos(state.cameraHeading+Math.max(-maxTurn,Math.min(maxTurn,turn))))}

  racers.forEach((r,i)=>{if(i===state.selected)return;
    const aiTrait=r.trait,aiSignature=signaturePerformance(r),ai=r.aiPersonality,difficulty=difficultyProfile();r.hit=Math.max(0,r.hit-dt);r.spin=Math.max(0,r.spin-dt);r.shield=Math.max(0,(r.shield||0)-dt);r.invincible=Math.max(0,(r.invincible||0)-dt);r.aiBoost=Math.max(0,(r.aiBoost||0)-dt/(aiTrait.boostDuration*aiSignature.boost));r.aiBoostCooldown=Math.max(0,(r.aiBoostCooldown||0)-dt);r.aiPassCommit=Math.max(0,(r.aiPassCommit||0)-dt);updateJumpPhysics(r,dt,false);
    const lookAhead=55+Math.min(95,r.aiVelocity*.36),bendAhead=trackBend((r.distance+lookAhead)/length),route=routeStateForRacer(r,r.distance),safeLimit=route?.active?1.34:.86-Math.min(.16,Math.abs(bendAhead)*.13),routeMin=route?.active?route.center-(route.path?.laneHalf||.42)+.07:-safeLimit,routeMax=route?.active?route.center+(route.path?.laneHalf||.42)-.07:safeLimit;let raceLine=route?.active?clamp(route.center,routeMin,routeMax):aiDesiredRaceLine(r,bendAhead,safeLimit);const hazardLane=courseGimmickAvoidanceLane(r,routeMin,routeMax);if(Number.isFinite(hazardLane))raceLine=hazardLane;const offRoad=surfaceAtLane(r.lane,r.distance).id!=='road';
    const blockers=raceContestants().filter(o=>o!==r&&sameActiveRouteEdge(r,r.distance,o,o.distance)&&o.distance>=r.distance-3&&o.distance-r.distance<38).sort((a,b)=>a.distance-b.distance),blocker=blockers.find(o=>Math.abs(o.lane-r.lane)<.34)||blockers[0],blockerGap=blocker?blocker.distance-r.distance:Infinity;
    if(blocker&&blockerGap>2&&blockerGap<31&&r.aiPassCommit<=0){r.aiTargetLane=aiOpenPassLane(r,blocker,bendAhead,safeLimit);r.aiPassTarget=blocker.slug||'player';r.aiPassCommit=.55+ai.aggression*.72}
    const passReady=blocker&&blockerGap>3&&blockerGap<30&&(Math.abs(bendAhead)<.34||ai.key==='apex'||ai.key==='booster');
    if(passReady&&r.aiBoostCooldown<=0&&r.aiVelocity>105){const trigger=ai.boostThreshold-(state.rank>8?.08:0);if(ai.aggression>=trigger){r.aiBoost=.46+r.set.stats.boost*.0065;r.aiBoostCooldown=2.25+(1-ai.aggression)*2.1;r.aiPassCommit=Math.max(r.aiPassCommit,.9);r.aiTargetLane=aiOpenPassLane(r,blocker,bendAhead,safeLimit)}}
    const aiSurface=r.airborne||r.invincible>0?SURFACE_PROFILES.road:surfaceAtLane(r.lane,r.distance),aiWeather=r.airborne||r.invincible>0?WEATHER_DRIVE_PROFILES.dry:weatherDriveAt(r.distance,aiSurface),rawAiWeatherMax=r.aiBoost>0?1-(1-aiWeather.maxFactor)*.45:aiWeather.maxFactor,aiWeatherMax=signatureResistance(rawAiWeatherMax,aiSignature.weather),gap=state.distance-r.distance,rubber=clamp(gap*difficulty.rubberGain,-difficulty.rubberLimit,difficulty.rubberLimit),personalityPace=ai.key==='charger'&&Math.abs(bendAhead)<.22?3.5:ai.key==='apex'&&Math.abs(bendAhead)>.42?2.8:0,hazardPace=jungleHazardPace(r),aiTarget=(r.aiSpeed*difficulty.aiSpeed+rubber+personalityPace+(r.aiBoost>0?34*difficulty.aiBoost:0))*aiWeatherMax*aiSignature.speed*hazardPace,velocityStep=Math.max(-86*difficulty.aiAccel*dt,Math.min(54*aiTrait.acceleration*aiSignature.accel*difficulty.aiAccel*signatureResistance(aiWeather.accel,aiSignature.weather)*dt,aiTarget-r.aiVelocity));r.aiVelocity=Math.max(0,r.aiVelocity+velocityStep);
    const hitFactor=r.hit>0&&r.invincible<=0?signatureResistance(.46,aiSignature.ram):1,aiActual=r.aiVelocity*hitFactor*signatureResistance(aiSurface.maxFactor,aiSignature.offroad);r.distance=advanceRouteDistance(r,r.distance,aiActual/3.6*dt);r.progress=r.distance/length;
    r.laneTimer-=dt;if(r.laneTimer<=0&&r.aiPassCommit<=0){
      const choices=[-.7,-.36,0,.36,.7],phase=Math.abs(Math.floor(r.distance/(78+ai.decisionTempo*18))+(r.aiDecisionSeed||i*3))%choices.length;let target=raceLine+choices[phase]*(ai.key==='tactician'?.14:.24),best=null,bestScore=Infinity;
      for(const object of state.objects){if(object.taken||pickupReservedForBackmarker(object)||object.route&&route?.active&&object.route!==r.routeChoice)continue;const dz=object.z-r.distance;if(dz<25||dz>155||Math.abs(object.lane)>safeLimit)continue;const interest=object.type==='ramp'?.82:object.type==='item'?ai.objectInterest:ai.objectInterest*.72,pattern=((i+Math.floor(object.z/(object.type==='ramp'?90:120)))%5)/4;if(pattern>interest*.72)continue;const traffic=aiTrafficScore(r,object.lane,62)*34/ai.trafficAvoidance,score=dz+traffic+(object.type==='ramp'?-24:0);if(score<bestScore){best=object;bestScore=score}}
      if(best)target=best.lane*.76+raceLine*.24;else if(ai.key==='tactician'){const candidates=[-.62,-.31,0,.31,.62].map(lane=>clamp(lane+raceLine*.38,routeMin,routeMax));candidates.sort((a,b)=>aiTrafficScore(r,a)-aiTrafficScore(r,b));target=candidates[0]}
      r.aiTargetLane=clamp(target,routeMin,routeMax);r.laneTimer=(.48+ai.decisionTempo*.32+(i%4)*.08)*ai.rhythm;
    }
    if(offRoad){r.aiTargetLane=route?.active?raceLine:clamp(raceLine,-.44,.44);r.aiPassCommit=0}const laneResponse=(offRoad?5.2*aiSignature.offroad:(1.55+r.set.stats.handling*.009)*(1.12/ai.decisionTempo)*aiSignature.grip)*signatureResistance(aiWeather.grip,aiSignature.weather);r.lane+=(r.aiTargetLane-r.lane)*Math.min(1,dt*laneResponse);if(!offRoad&&r.aiPassCommit<=0)r.lane+=Math.sin(state.elapsed*.0011+i*1.7)*dt*.006;r.lane=clamp(r.lane,route?.active?routeMin:-1.08,route?.active?routeMax:1.08);updateAiRocketUse(r,dt)
  });
  canvas.dataset.aiOffroad=String(racers.filter((r,i)=>i!==state.selected&&surfaceAtLane(r.lane,r.distance).id!=='road').length);
  canvas.dataset.routeAiLeft=String(racers.filter((r,i)=>i!==state.selected&&r.routeChoice==='left').length);canvas.dataset.routeAiRight=String(racers.filter((r,i)=>i!==state.selected&&r.routeChoice==='right').length);
  updateMiaNpc(dt,length,laps);
  resolveJungleRouteHazards(dt);
  updateEnvironmentInteractions(dt);
  state.overtakeUiCooldown=Math.max(0,state.overtakeUiCooldown-dt);updatePlayerOvertakes();
  for(const r of raceContestants().filter(r=>r!==racers[state.selected]&&sameActiveRouteEdge(selectedRacer,state.distance,r,r.distance))){const rel=r.distance-state.distance;if(Math.abs(rel)<20&&Math.abs(r.lane-state.x)<.22&&state.collisionCooldown<=0){tryActivateRacerSignature(selectedRacer,'hit');const playerSignature=signaturePerformance(selectedRacer);if(state.invincible>0||state.shield>0){r.hit=1.3;r.spin=1;toast('HIT!')}else{state.speed*=signatureResistance(.72,playerSignature.ram);toast(r===miaNpc?'MIA BUMP!':'BUMP!')}playSfx('collision',{intensity:r===miaNpc?1.2:1});state.shake=10;state.collisionCooldown=1;burst(innerWidth/2+state.x*130,innerHeight*.73,16,r===miaNpc?'#ff52ae':'#ff7abf')}}

  updateRockets(dt);

  state.rank=raceOrder().indexOf(racers[state.selected])+1;if(state.rank!==state.lastRank&&state.elapsed>1000){const improved=state.rank<state.lastRank;announceRank(state.lastRank,state.rank);if(improved)tryActivateRacerSignature(selectedRacer,'overtake');state.lastRank=state.rank}const nextLap=raceLapAt(state.distance);if(nextLap>state.lap&&nextLap===laps&&!state.finalLapShown){state.finalLapShown=true;showFinalLapCallout()}state.lap=nextLap;const finishAt=finishLineDistance();canvas.dataset.finishLineDistance=finishAt.toFixed(1);canvas.dataset.finishDistanceRemaining=Math.max(0,finishAt-state.distance).toFixed(1);if(previousDistance<finishAt&&state.distance>=finishAt){finishRace();return}
  for(const ramp of state.objects.filter(o=>o.type==='ramp')){for(let i=0;i<racers.length;i++){if(ramp.hitBy.has(i))continue;const r=racers[i],route=routeStateForRacer(r,r.distance);if(ramp.route&&route?.active&&ramp.route!==r.routeChoice)continue;const dz=r.distance-ramp.z;if(dz>=-7&&dz<=13&&Math.abs(r.lane-ramp.lane)<.34){ramp.hitBy.add(i);launchRamp(i)}}}
  let reservedPickups=0;for(const o of state.objects){if(o.type==='ramp'||o.taken)continue;const reserved=pickupReservedForBackmarker(o);if(reserved)reservedPickups++;let best=null;for(let i=0;i<racers.length;i++){if(reserved&&i!==state.selected)continue;const r=racers[i],route=routeStateForRacer(r,r.distance);if(o.route&&route?.active&&o.route!==r.routeChoice)continue;const player=i===state.selected,dz=Math.abs(r.distance-o.z),laneGap=Math.abs(r.lane-o.lane),reach=o.type==='pad'?.3:o.type==='item'&&player?.31:.23,zReach=player?15.5:13;if(dz<zReach&&laneGap<reach&&(!best||dz+laneGap*20<best.score))best={i,score:dz+laneGap*20}}if(best)collectObject(o,best.i)}canvas.dataset.pickupReserved=String(reservedPickups);
  state.collectFx.forEach(f=>f.life-=dt);state.collectFx=state.collectFx.filter(f=>f.life>0);
  state.landingBounceVelocity+=(0-state.landingBounce)*72*dt;state.landingBounceVelocity*=Math.exp(-8.6*dt);state.landingBounce+=state.landingBounceVelocity*dt;if(Math.abs(state.landingBounce)<.035&&Math.abs(state.landingBounceVelocity)<.08){state.landingBounce=0;state.landingBounceVelocity=0}
  updateRaceParticles(dt);updateRaceTutorial();
  updateHud();if(Math.floor(state.elapsed/450)!==Math.floor((state.elapsed-dt*1000)/450))buildRank();
}

const trackCurves=[.52,.68,.62,.38,-.42,-.68,-.54,.48,.64,-.52,-.72,.66,-.58,.74,-.7,.62,-.56,.68,-.64,.55,-.38,.34,.56,.52];
let trackHeights=courseData[0].heights;
function curveAt(distance){const p=((distance%TRACK_LENGTH)+TRACK_LENGTH)%TRACK_LENGTH/TRACK_LENGTH*trackCurves.length,i=Math.floor(p),t=p-i,s=t*t*(3-2*t),a=trackCurves[i%trackCurves.length],b=trackCurves[(i+1)%trackCurves.length];return a+(b-a)*s}
function hillAt(distance){return trackSampleCache?trackDistanceSample(distance).height:rawHillAt(distance)}

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
let vfxFrameAudit={atlasDraws:0,proceduralFallbacks:0,screenDraws:0,normalDraws:0,kinds:new Set()};
function beginVfxFrameAudit(){vfxFrameAudit={atlasDraws:0,proceduralFallbacks:0,screenDraws:0,normalDraws:0,kinds:new Set()}}
function drawAnimatedVfx(frame,x,y,size,alpha,rotation=0,{center=true,blend='source-over',kind='vfx'}={}){if(!frame)return false;ctx.save();ctx.globalCompositeOperation=blend;if(center)drawFrameCentered(frame,x,y,size,alpha,rotation);else drawFrame(frame,x,y,size,alpha,rotation);ctx.restore();vfxFrameAudit.atlasDraws++;vfxFrameAudit.kinds.add(kind);if(blend==='screen'||blend==='lighter')vfxFrameAudit.screenDraws++;else vfxFrameAudit.normalDraws++;return true}
function recordProceduralVfx(kind){vfxFrameAudit.proceduralFallbacks++;vfxFrameAudit.kinds.add(kind)}
function publishVfxFrameAudit(){canvas.dataset.vfxRenderModel=VFX_RENDER_CONTRACT.model;canvas.dataset.vfxAtlas=VFX_RENDER_CONTRACT.atlas;canvas.dataset.vfxAtlasDraws=String(vfxFrameAudit.atlasDraws);canvas.dataset.vfxProceduralFallbacks=String(vfxFrameAudit.proceduralFallbacks);canvas.dataset.vfxScreenDraws=String(vfxFrameAudit.screenDraws);canvas.dataset.vfxNormalDraws=String(vfxFrameAudit.normalDraws);canvas.dataset.vfxKinds=[...vfxFrameAudit.kinds].sort().join(',')||'none';canvas.dataset.vfxParticleCap=String(effectParticleLimit())}
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
function cupStandingsOrder(){
  return[...cupState.standings.values()].sort((a,b)=>b.points-a.points||b.wins-a.wins||b.podiums-a.podiums||a.positionSum-b.positionSum||a.lastRank-b.lastRank||a.index-b.index)
}
function recordCupRound(fullOrder){
  const order=fullOrder.filter(racer=>racer!==miaNpc&&cupState.standings.has(racer.slug)),courseIndex=state.selectedCourse,player=racers[state.selected];
  order.forEach((racer,index)=>{const standing=cupState.standings.get(racer.slug),rank=index+1,points=CUP_POINTS[index]||0;standing.points+=points;standing.wins+=rank===1?1:0;standing.podiums+=rank<=3?1:0;standing.positionSum+=rank;standing.lastRank=rank;standing.races.push({courseIndex,rank,points})});
  const playerRank=order.indexOf(player)+1,playerPoints=CUP_POINTS[playerRank-1]||0,result={courseIndex,course:courseData[courseIndex],order,playerRank,playerPoints,time:state.finishTime,coins:state.raceWalletEarned,rewards:[...state.raceRewards]};
  cupState.results.push(result);cupState.totalTime+=state.finishTime;cupState.totalCoins+=state.raceWalletEarned;
  const standings=cupStandingsOrder();canvas.dataset.cupRound=String(cupState.results.length);canvas.dataset.cupLastPlayerRank=String(playerRank);canvas.dataset.cupLastPlayerPoints=String(playerPoints);canvas.dataset.cupStandings=standings.slice(0,8).map(entry=>`${entry.racer.slug}:${entry.points}`).join(',');canvas.dataset.cupLeader=standings[0]?.racer.slug||'none';return result
}
function cupRowsWithPlayer(entries,limit){
  const player=racers[state.selected],top=entries.slice(0,limit);if(top.some(entry=>(entry.racer||entry)===player))return top;const playerEntry=entries.find(entry=>(entry.racer||entry)===player);return playerEntry?[...top.slice(0,Math.max(0,limit-1)),playerEntry]:top
}
function renderCupFace(canvas,racer){
  ensureRacerFaceIcon(canvas,racer,'cup-standings')
}
function renderCupRows(host,entries,{total=false,limit=7}={}){
  const rows=cupRowsWithPlayer(entries,limit),player=racers[state.selected];host.innerHTML=rows.map((entry,index)=>{const racer=entry.racer||entry,rank=total?cupStandingsOrder().indexOf(entry)+1:entries.indexOf(entry)+1,value=total?`${entry.points} PT`:`+${CUP_POINTS[rank-1]||0} PT`,costumeId=racer===miaNpc?'boss':activeCostumeId(racer);return`<div class="cup-result-row ${racer===player?'player':''}" style="--row:${index};--racer-color:${racer.color}" data-racer="${racer.slug}" data-costume="${costumeId}" data-rank="${rank}"><strong>${rank}</strong><canvas width="64" height="64" aria-label="${racer.name} ${costumeId}"></canvas><span>${racer.name}</span><b>${value}</b></div>`}).join('');
  host.querySelectorAll('canvas').forEach((canvas,index)=>renderCupFace(canvas,(rows[index].racer||rows[index])))
}
function renderCupStandings(){
  const latest=cupState.results.at(-1),completed=cupState.results.length,nextIndex=cupState.courseIndexes[completed],standings=cupStandingsOrder();if(!latest)return;
  $('cupStandingsArt').src=latest.course.art;$('cupStandingsArt').alt='';$('cupRoundLabel').textContent=`RACE ${completed} / ${CUP_RACE_COUNT} COMPLETE`;$('cupLastCourse').textContent=latest.course.short;$('cupRoundTime').textContent=fmt(latest.time);$('cupRoundCoins').textContent=`+${latest.coins} COINS`;
  $('cupProgress').innerHTML=cupState.courseIndexes.map((courseIndex,index)=>{const course=courseData[courseIndex],result=cupState.results[index],done=index<completed,next=index===completed;return`<article class="${done?'done':''} ${next?'next':''}"><img src="${course.art}" alt=""><span><small>RACE ${index+1}</small><strong>${course.short}</strong></span><b>${result?`+${result.playerPoints}`:next?'NEXT':'—'}</b></article>`}).join('');
  renderCupRows($('cupRoundRows'),latest.order,{limit:6});renderCupRows($('cupTotalRows'),standings,{total:true,limit:8});
  const next=courseData[nextIndex];$('cupNextCourseName').textContent=next?`RACE ${completed+1} · ${next.short}`:'FINAL RESULT';$('cupStandings').dataset.completed=String(completed);$('cupStandings').dataset.nextCourse=next?courseScenerySlugs[nextIndex]:'final';$('cupStandings').dataset.playerStanding=String(standings.findIndex(entry=>entry.racer===racers[state.selected])+1);$('cupStandings').dataset.leader=standings[0]?.racer.slug||'none';
  playSfx('resultStamp',{intensity:.78})
}
function prepareCupFinalResult(){
  const standings=cupStandingsOrder(),playerRacer=racers[state.selected],playerEntry=standings.find(entry=>entry.racer===playerRacer),cupCostumeRewards=cupState.results.flatMap(result=>result.rewards||[]).filter(reward=>reward.type==='costume'&&reward.new),rewardMap=new Map([...state.raceRewards,...cupCostumeRewards].map(reward=>[`${reward.type}:${reward.costume||reward.label}`,reward]));state.raceRewards=[...rewardMap.values()];cupState.final=true;state.finishOrder=standings.map(entry=>entry.racer);state.rank=standings.indexOf(playerEntry)+1;state.finishTime=cupState.totalTime;state.raceWalletEarned=cupState.totalCoins;state.raceWalletStart=cupState.walletStart;state.resultRecord={cup:true,first:false,newBest:false,previous:null,best:state.finishTime,delta:0,practice:false};canvas.dataset.cupFinal='true';canvas.dataset.cupFinalRank=String(state.rank);canvas.dataset.cupFinalPoints=String(playerEntry?.points||0);canvas.dataset.cupFinalOrder=standings.map(entry=>entry.racer.slug).join(',');canvas.dataset.cupFinalPointOrder=standings.map(entry=>entry.points).join(',');canvas.dataset.cupCostumeUnlock=cupCostumeRewards.map(reward=>reward.costume).join(',')||'none';$('finish').classList.add('cup-final');$('finishRank').innerHTML=ordinal(state.rank);$('finishTitle').textContent=state.rank===1?'CUP CHAMPION!':'CUP COMPLETE!';$('finishTime').textContent=fmt(state.finishTime);$('finishCoins').textContent=`+${state.raceWalletEarned} COINS · TOTAL ${playerProgress.coins}`
}
function raceRecordKey(){return `${state.selectedCourse}:${activeCourse?.short||'course'}:${state.raceDifficulty}`}
function commitRaceRecord(time){
  const safeTime=Math.max(1,Math.round(Number(time)||0));if(activeCourse?.debugOnly)return{first:false,newBest:false,previous:null,best:safeTime,delta:0,practice:true};
  const key=raceRecordKey(),previous=Number(playerProgress.bestTimes[key])||null,newBest=!previous||safeTime<previous,best=newBest?safeTime:previous;if(newBest){playerProgress.bestTimes[key]=safeTime;saveProgress()}return{key,first:!previous,newBest,previous,best,delta:previous?safeTime-previous:0,practice:false}
}
function nextUnlockProgress(){
  const index=racers.findIndex((_,i)=>racerUnlockCost(i)>0&&!isRacerUnlocked(i));if(index<0)return{complete:true,progress:1,label:'ALL RACERS READY',ready:true};const cost=racerUnlockCost(index),coins=playerProgress.coins,progress=clamp(coins/cost,0,1);return{complete:false,index,cost,coins,progress,label:`${racers[index].name} · ${Math.min(coins,cost)} / ${cost}`,ready:coins>=cost}
}
function resultRewardItems(){
  if(cupState.final){const entry=cupState.standings.get(racers[state.selected].slug);return[{type:'cup',label:`${entry?.points||0} CUP POINTS`,detail:`3戦総合 ${state.rank}位・${entry?.wins||0}勝`,points:entry?.points||0,coins:0,new:state.rank===1},...state.raceRewards]}
  const suffix=state.rank===1?'ST':state.rank===2?'ND':state.rank===3?'RD':'TH';return[{type:'place',label:`${state.rank}${suffix} PLACE`,detail:'完走順位ボーナス',coins:state.finishCoinBonus,new:false},...state.raceRewards]
}
const resultTallyState={serial:0,raf:0,stage:'idle'};
function cancelResultTally(){resultTallyState.serial++;resultTallyState.stage='idle';cancelAnimationFrame(resultTallyState.raf);resultTallyState.raf=0}
function resultTallyAlive(serial){return serial===resultTallyState.serial&&state.mode==='finish'}
function animateResultCounter(serial,duration,render){
  return new Promise(resolve=>{const started=performance.now();function frame(now){if(!resultTallyAlive(serial)){resolve(false);return}const t=clamp((now-started)/duration,0,1),ease=1-Math.pow(1-t,3);render(ease,t);if(t<1)resultTallyState.raf=requestAnimationFrame(frame);else{resultTallyState.raf=0;resolve(true)}}resultTallyState.raf=requestAnimationFrame(frame)})
}
function setResultTallyStage(name){
  document.querySelectorAll('.result-tally-row').forEach(row=>row.classList.remove('active'));const row=document.querySelector(`[data-result-stage="${name}"]`);if(row){row.classList.add('revealed','active');uiMotionDirector.reward(row)}resultTallyState.stage=name;canvas.dataset.resultTallyStage=name;return row
}
function prepareResultTally(){
  const record=state.resultRecord||{first:true,newBest:true,best:state.finishTime,delta:0},unlock=nextUnlockProgress(),cup=cupState.final,playerCup=cupState.standings.get(racers[state.selected].slug),timeLabel=document.querySelector('[data-result-stage="time"] small'),recordLabel=document.querySelector('[data-result-stage="record"] small');document.querySelectorAll('.result-tally-row').forEach(row=>row.classList.remove('revealed','active','new-record','unlock-ready'));if(timeLabel)timeLabel.textContent=cup?'3-RACE TOTAL':'RACE TIME';if(recordLabel)recordLabel.textContent=cup?'CUP SCORE':'COURSE RECORD';$('resultTallyTime').textContent='00:00.000';$('resultTallyTimeNote').textContent=cup?'3 COURSES':'OFFICIAL';$('resultTallyCoins').textContent='+0';$('resultTallyWallet').textContent=`TOTAL ${state.raceWalletStart||0}`;$('resultTallyUnlock').textContent=unlock.label;$('resultTallyUnlockBar').parentElement.style.setProperty('--unlock-progress','0%');
  if(cup){$('resultTallyRecord').textContent=`${playerCup?.points||0} POINTS`;$('resultTallyRecordNote').textContent=`${playerCup?.wins||0} WINS`}else if(record.practice){$('resultTallyRecord').textContent='PRACTICE RUN';$('resultTallyRecordNote').textContent='DEBUG'}else if(record.first){$('resultTallyRecord').textContent='FIRST RECORD';$('resultTallyRecordNote').textContent='NEW'}else if(record.newBest){$('resultTallyRecord').textContent=`BEST ${fmt(record.best)}`;$('resultTallyRecordNote').textContent=`-${fmt(Math.abs(record.delta))}`}else{$('resultTallyRecord').textContent=`BEST ${fmt(record.best)}`;$('resultTallyRecordNote').textContent=`+${fmt(Math.max(0,record.delta))}`}
  $('finishTime').textContent='00:00.000';$('finishCoins').textContent=`+0 COINS · TOTAL ${state.raceWalletStart||0}`;$('finishTime').classList.add('result-counting');$('finishCoins').classList.add('result-counting');$('clearDifficultyBadge').classList.add('result-queued');$('clearDifficultyBadge').classList.remove('result-reveal');document.querySelectorAll('.reward-chip').forEach(chip=>{chip.classList.add('result-queued');chip.classList.remove('result-reveal')});canvas.dataset.resultTallyModel='staged-result-reward-v1';canvas.dataset.resultTallyStage='prepared'
}
async function runResultTallySequence(){
  const serial=++resultTallyState.serial,record=state.resultRecord||{first:true,newBest:true,best:state.finishTime,delta:0},unlock=nextUnlockProgress(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,pace=reduced?.28:1;canvas.dataset.resultTallySequence=String(serial);
  await sleep(250*pace);if(!resultTallyAlive(serial))return;setResultTallyStage('time');await animateResultCounter(serial,Math.max(120,620*pace),(ease,t)=>{const value=state.finishTime*ease;$('resultTallyTime').textContent=fmt(value);$('finishTime').textContent=fmt(value);if(t<1)playSfx('resultCount',{variant:0,intensity:.42})});if(!resultTallyAlive(serial))return;$('finishTime').classList.remove('result-counting');
  await sleep(110*pace);if(!resultTallyAlive(serial))return;const recordRow=setResultTallyStage('record');if(record.newBest||record.first)recordRow?.classList.add('new-record');playSfx('resultStamp',{intensity:record.newBest||record.first?1:.68});await sleep(410*pace);
  if(!resultTallyAlive(serial))return;setResultTallyStage('coins');const earned=Math.max(0,state.raceWalletEarned),walletStart=Math.max(0,state.raceWalletStart||playerProgress.coins-earned);await animateResultCounter(serial,Math.max(130,620*pace),(ease,t)=>{const gain=Math.round(earned*ease),wallet=Math.round(walletStart+(playerProgress.coins-walletStart)*ease);$('resultTallyCoins').textContent=`+${gain}`;$('resultTallyWallet').textContent=`TOTAL ${wallet}`;$('finishCoins').textContent=`+${gain} COINS · TOTAL ${wallet}`;if(t<1)playSfx('resultCount',{variant:1,intensity:.48})});if(!resultTallyAlive(serial))return;$('finishCoins').classList.remove('result-counting');
  const badge=$('clearDifficultyBadge');badge.classList.remove('result-queued');badge.classList.add('result-reveal');uiMotionDirector.reward(badge);playSfx('resultReward',{variant:0,intensity:.72});await sleep(250*pace);
  const chips=[...document.querySelectorAll('.reward-chip')],rewardItems=resultRewardItems();for(let i=0;i<chips.length;i++){if(!resultTallyAlive(serial))return;chips[i].classList.remove('result-queued');chips[i].classList.add('result-reveal');uiMotionDirector.reward(chips[i]);playSfx('resultReward',{variant:Math.min(3,i+1),intensity:.78});const reward=rewardItems[i];if(reward?.type==='costume'&&reward.new){const racer=racers[state.selected],costume=costumesFor(racer).find(entry=>entry.id===reward.costume);if(costume)setTimeout(()=>playCostumeUnlockAnimation(racer,costume),120)}await sleep(230*pace)}
  if(!resultTallyAlive(serial))return;const unlockRow=setResultTallyStage('unlock');unlockRow?.classList.toggle('unlock-ready',unlock.ready);$('resultTallyUnlockBar').parentElement.style.setProperty('--unlock-progress',`${Math.round(unlock.progress*100)}%`);if(unlock.ready)playSfx('resultStamp',{intensity:.82});else playSfx('resultReward',{variant:2,intensity:.55});await sleep(360*pace);if(!resultTallyAlive(serial))return;document.querySelectorAll('.result-tally-row').forEach(row=>row.classList.remove('active'));resultTallyState.stage='complete';canvas.dataset.resultTallyStage='complete'
}
function raceRewardCourseKey(){return `${state.selectedCourse}:${activeCourse?.short||'course'}`}
function calculateRaceRewards(sorted){
  if(state.raceDifficulty!=='hard'||activeCourse?.debugOnly)return[];
  const key=raceRewardCourseKey(),player=racers[state.selected],playerRank=sorted.indexOf(player),miaRank=sorted.indexOf(miaNpc),rewards=[];
  const firstHard=!playerProgress.hardClears.includes(key);if(firstHard)playerProgress.hardClears.push(key);rewards.push({type:'hard',label:'HARD CLEAR',detail:firstHard?'初回制覇ボーナス':'ハード完走報酬',coins:HARD_CLEAR_COIN_REWARD,new:firstHard});
  if(miaNpc.active&&miaRank>=0&&playerRank>=0&&playerRank<miaRank){const firstMia=!playerProgress.miaDefeats.includes(key);if(firstMia)playerProgress.miaDefeats.push(key);rewards.push({type:'mia',label:'MIA DEFEATED',detail:firstMia?'初回撃破ボーナス':'ミア撃破報酬',coins:MIA_DEFEAT_COIN_REWARD,new:firstMia})}
  saveProgress();return rewards;
}
const podiumFrameBoundsCache=new Map();
const podiumFaceBoundsCache=new Map();
let podiumCeremonySerial=0;
function podiumVisibleBounds(frame){
  if(!frame)return frame;
  const key=`${frame.image.currentSrc||frame.image.src}|${frame.sx}|${frame.sy}|${frame.sw}|${frame.sh}`;
  if(podiumFrameBoundsCache.has(key))return podiumFrameBoundsCache.get(key);
  try{const probe=document.createElement('canvas'),pw=Math.max(1,Math.round(frame.sw)),ph=Math.max(1,Math.round(frame.sh));probe.width=pw;probe.height=ph;const pc=probe.getContext('2d',{willReadFrequently:true});pc.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,0,0,pw,ph);const pixels=pc.getImageData(0,0,pw,ph).data;let minX=pw,minY=ph,maxX=-1,maxY=-1;for(let y=0;y<ph;y++)for(let x=0;x<pw;x++){if(pixels[(y*pw+x)*4+3]<12)continue;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y)}const bounds=maxX<minX?frame:{...frame,sx:frame.sx+minX/pw*frame.sw,sy:frame.sy+minY/ph*frame.sh,sw:(maxX-minX+1)/pw*frame.sw,sh:(maxY-minY+1)/ph*frame.sh};podiumFrameBoundsCache.set(key,bounds);return bounds}catch(error){console.warn('Podium alpha bounds unavailable; using full frame',error);podiumFrameBoundsCache.set(key,frame);return frame}
}
function podiumFaceBounds(frame){
  if(!frame)return frame;const visible=podiumVisibleBounds(frame),key=`${visible.image.currentSrc||visible.image.src}|${visible.sx}|${visible.sy}|${visible.sw}|${visible.sh}|face-v3`;
  if(podiumFaceBoundsCache.has(key))return podiumFaceBoundsCache.get(key);
  try{const probe=document.createElement('canvas'),pw=Math.max(1,Math.round(visible.sw)),ph=Math.max(1,Math.round(visible.sh)),headLimit=Math.max(1,Math.floor(ph*.62));probe.width=pw;probe.height=ph;const pc=probe.getContext('2d',{willReadFrequently:true});pc.drawImage(visible.image,visible.sx,visible.sy,visible.sw,visible.sh,0,0,pw,ph);const pixels=pc.getImageData(0,0,pw,ph).data;let minX=pw,minY=headLimit,maxX=-1,maxY=-1;for(let y=0;y<headLimit;y++)for(let x=0;x<pw;x++){if(pixels[(y*pw+x)*4+3]<12)continue;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y)}if(maxX<minX){podiumFaceBoundsCache.set(key,visible);return visible}const contentW=maxX-minX+1,contentH=maxY-minY+1,padX=Math.max(2,contentW*.1),padTop=Math.max(2,contentH*.1),padBottom=Math.max(2,contentH*.06),left=Math.max(0,minX-padX),top=Math.max(0,minY-padTop),right=Math.min(pw,maxX+1+padX),bottom=Math.min(ph,maxY+1+padBottom),bounds={...visible,sx:visible.sx+left/pw*visible.sw,sy:visible.sy+top/ph*visible.sh,sw:(right-left)/pw*visible.sw,sh:(bottom-top)/ph*visible.sh};podiumFaceBoundsCache.set(key,bounds);return bounds}catch(error){console.warn('Result face alpha bounds unavailable; using visible upper body',error);const bounds={...visible,sh:visible.sh*.62};podiumFaceBoundsCache.set(key,bounds);return bounds}
}
const PODIUM_FRONT_FRAME_INDEX=10;
function paintPodiumFrame(canvas,sourceFrame,rank,sourceLabel='game-sprite-front'){
  const frame=podiumVisibleBounds(sourceFrame),c=canvas?.getContext('2d');if(!canvas||!c)return false;
  c.clearRect(0,0,canvas.width,canvas.height);
  if(!frame||!frame.image||!frame.image.complete||!frame.image.naturalWidth)return false;
  const widthBoost=rank===1?1.05:1,scale=Math.min(canvas.width/frame.sw*.9*widthBoost,(canvas.height-12)/frame.sh*.92),w=frame.sw*scale,h=frame.sh*scale,x=(canvas.width-w)/2,y=canvas.height-h-3;
  c.save();c.imageSmoothingEnabled=true;c.shadowColor='rgba(0,0,0,.45)';c.shadowBlur=18;c.shadowOffsetY=12;
  c.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,x,y,w,h);c.restore();canvas.dataset.painted='sprite';canvas.dataset.podiumSource=sourceLabel;canvas.dataset.podiumFrame=String(PODIUM_FRONT_FRAME_INDEX);canvas.dataset.podiumHeadroom=String(Math.max(0,Math.round(y)));return true;
}
function drawPodiumRacerSprite(canvas,racer,rank){
  if(!canvas||!racer)return false;
  const sourceFrame=racer.frames?.[PODIUM_FRONT_FRAME_INDEX];
  const costumeId=racer===miaNpc?'boss':activeCostumeId(racer),painted=paintPodiumFrame(canvas,sourceFrame,rank,racer===miaNpc?'mia-game-sprite-front':`game-sprite-front:${costumeId}`);if(painted)canvas.dataset.podiumCostume=costumeId;return painted;
}
function paintPodiumPlaceholder(canvas,racer,rank){
  const c=canvas?.getContext('2d');if(!canvas||!c)return false;const color=racer?.color||'#73eaff',cx=canvas.width/2,base=canvas.height*.96,scale=rank===1?1.08:1;
  c.clearRect(0,0,canvas.width,canvas.height);c.save();c.translate(cx,base);c.scale(scale,scale);c.shadowColor='rgba(0,0,0,.5)';c.shadowBlur=18;c.shadowOffsetY=10;
  const glow=c.createRadialGradient(0,-112,10,0,-112,112);glow.addColorStop(0,'#fff');glow.addColorStop(.18,color);glow.addColorStop(1,'rgba(22,18,54,.96)');c.fillStyle=glow;c.beginPath();c.ellipse(0,-86,74,92,0,0,Math.PI*2);c.fill();
  c.fillStyle=color;c.beginPath();c.moveTo(-55,-151);c.lineTo(-22,-204);c.lineTo(-8,-148);c.moveTo(55,-151);c.lineTo(22,-204);c.lineTo(8,-148);c.fill();
  c.fillStyle='#17142f';c.beginPath();if(c.roundRect)c.roundRect(-70,-56,140,48,18);else c.rect(-70,-56,140,48);c.fill();c.fillStyle='#fff6b2';c.font='900 34px Fredoka';c.textAlign='center';c.textBaseline='middle';c.fillText((racer?.name||'?').slice(0,1),0,-32);c.restore();canvas.dataset.painted='placeholder';canvas.dataset.podiumSource='generated-placeholder';return true;
}
function podiumSpriteReady(racer){const frame=racer?.frames?.[PODIUM_FRONT_FRAME_INDEX],costumeReady=racer===miaNpc||racer?.loadedCostume===activeCostumeId(racer);return!!(costumeReady&&frame?.image?.complete&&frame.image.naturalWidth&&frame.sw>0&&frame.sh>0)}
async function ensurePodiumSprite(racer){if(!podiumSpriteReady(racer))await ensureContestantSprite(racer);if(!podiumSpriteReady(racer))throw new Error(`Podium frame unavailable: ${racer?.slug||'unknown'}`);return racer.frames}
function drawMiaPodiumSpriteFallback(canvas,rank){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{const bounds=window.SPRITE_BOUNDS?.[miaNpc.slug]?.[PODIUM_FRONT_FRAME_INDEX],sw=image.naturalWidth/7,sh=image.naturalHeight/2,frame=bounds?{image,sx:bounds[0],sy:bounds[1],sw:bounds[2],sh:bounds[3]}:{image,sx:sw*3,sy:sh,sw,sh};if(!paintPodiumFrame(canvas,frame,rank,'mia-game-sprite-front-png'))return reject(new Error('Mia front sprite fallback stayed blank'));resolve(true)};image.onerror=reject;image.src='assets/sprites/mia-charme.png'})}
function drawPodiumPortraitFallback(canvas,racer,rank){if(racer===miaNpc)return drawMiaPodiumSpriteFallback(canvas,rank);return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{const c=canvas.getContext('2d'),scale=Math.min(canvas.width/image.naturalWidth*(rank===1?.92:.88),(canvas.height-12)/image.naturalHeight*.92),w=image.naturalWidth*scale,h=image.naturalHeight*scale;c.clearRect(0,0,canvas.width,canvas.height);c.drawImage(image,(canvas.width-w)/2,canvas.height-h-3,w,h);canvas.dataset.painted='portrait-fallback';canvas.dataset.podiumSource=`costume-key-art-fallback:${activeCostumeId(racer)}`;canvas.dataset.podiumCostume=activeCostumeId(racer);canvas.dataset.podiumHeadroom=String(Math.max(0,Math.round(canvas.height-h-3)));resolve(true)};image.onerror=reject;image.src=racerSelectHero(racer)})}
function drawResultFaceSprite(canvas,racer,context='result-list'){
  if(!canvas||!racer)return false;
  const costumeId=racer===miaNpc?'boss':activeCostumeId(racer),costumeReady=racer===miaNpc||racer.loadedCostume===costumeId,rawFrame=costumeReady&&(racer.frames?.[PODIUM_FRONT_FRAME_INDEX]||racer.frames?.[3]||racer.frames?.[0]),frame=podiumFaceBounds(rawFrame),c=canvas.getContext('2d');
  c.clearRect(0,0,canvas.width,canvas.height);
  if(!frame)return false;
  const destinationInset=Math.max(6,canvas.width*.09),destinationSize=canvas.width-destinationInset*2,scale=Math.min(destinationSize/frame.sw,destinationSize/frame.sh),drawW=frame.sw*scale,drawH=frame.sh*scale,drawX=(canvas.width-drawW)/2,drawY=(canvas.height-drawH)/2+canvas.height*.025;
  c.save();
  c.beginPath();c.arc(canvas.width/2,canvas.height/2,canvas.width*.47,0,Math.PI*2);c.clip();
  c.fillStyle='#14122e';c.fillRect(0,0,canvas.width,canvas.height);
  c.imageSmoothingEnabled=true;
  c.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,drawX,drawY,drawW,drawH);
  c.restore();
  c.save();
  c.strokeStyle='#fff';c.lineWidth=4;c.beginPath();c.arc(canvas.width/2,canvas.height/2,canvas.width*.45,0,Math.PI*2);c.stroke();
  c.restore();canvas.dataset.painted='costume-sprite-front-face-v1';canvas.dataset.faceSource='costume-sprite-front-face-v1';canvas.dataset.faceRacer=racer.slug;canvas.dataset.faceCostume=costumeId;canvas.dataset.faceContext=context;canvas.dataset.faceFrame=String(PODIUM_FRONT_FRAME_INDEX);canvas.dataset.faceFit='alpha-upper-body-contain';canvas.dataset.faceHeadroom=String(Math.max(0,Math.round(drawY)));return true;
}
function ensureRacerFaceIcon(canvas,racer,context='ui'){
  if(!canvas||!racer)return Promise.resolve(false);const costumeId=racer===miaNpc?'boss':activeCostumeId(racer),requestKey=`${racer.slug}:${costumeId}:${context}`;canvas.dataset.faceRequest=requestKey;
  if(drawResultFaceSprite(canvas,racer,context))return Promise.resolve(true);
  const c=canvas.getContext('2d'),color=racer.color||'#6eeaff';c.clearRect(0,0,canvas.width,canvas.height);c.fillStyle='#14122e';c.beginPath();c.arc(canvas.width/2,canvas.height/2,canvas.width*.46,0,Math.PI*2);c.fill();c.fillStyle=color;c.font=`900 ${Math.round(canvas.width*.42)}px Fredoka`;c.textAlign='center';c.textBaseline='middle';c.fillText((racer.name||'?').slice(0,1),canvas.width/2,canvas.height*.53);canvas.dataset.painted='costume-face-loading';canvas.dataset.faceSource='costume-face-loading';canvas.dataset.faceRacer=racer.slug;canvas.dataset.faceCostume=costumeId;canvas.dataset.faceContext=context;
  return ensureContestantSprite(racer).then(()=>canvas.isConnected&&canvas.dataset.faceRequest===requestKey?drawResultFaceSprite(canvas,racer,context):false).catch(error=>{console.warn(`Costume face load failed: ${racer.slug}`,error);return false})
}
function resetPodiumRacer(slot){
  if(!slot)return;clearTimeout(slot._podiumTimer);clearTimeout(slot._podiumFallbackTimer);clearTimeout(slot._podiumPaintTimer);clearTimeout(slot._podiumRecoveryTimer);clearTimeout(slot._podiumForceTimer);slot._podiumTimer=0;slot._podiumFallbackTimer=0;slot._podiumPaintTimer=0;slot._podiumRecoveryTimer=0;slot._podiumForceTimer=0;if(slot._podiumFinishHandler)slot.removeEventListener('animationend',slot._podiumFinishHandler);slot._podiumFinishHandler=null;slot.replaceChildren();slot.classList.remove('boss','podium-prepainted','podium-staged','podium-jumping','podium-ready');delete slot.dataset.racer;delete slot.dataset.costume;delete slot.dataset.podiumPhase;delete slot.dataset.podiumRecovery;delete slot.dataset.podiumCeremony
}
function renderPodiumRacer(slot,racer,rank,ceremonyId=podiumCeremonySerial){
  if(!slot)return;resetPodiumRacer(slot);if(!racer)return;slot.classList.toggle('boss',racer===miaNpc);slot.dataset.racer=racer.slug;slot.dataset.costume=racer===miaNpc?'boss':activeCostumeId(racer);slot.dataset.podiumCeremony=String(ceremonyId);slot.dataset.podiumPhase='loading';
  const delay=rank===3?360:rank===2?1050:1760;slot.style.setProperty('--jump-rotate',rank===2?'-4deg':rank===3?'4deg':'0deg');slot.style.setProperty('--podium-emergency-delay',`${delay+1250}ms`);
  slot.innerHTML=`<canvas width="300" height="300" aria-label="${racer.name}"></canvas><strong>${ordinal(rank)}</strong><span>${racer.name}</span>`;
  const canvas=slot.querySelector('canvas');let stageStarted=false;
  const current=()=>slot.isConnected&&slot.dataset.racer===racer.slug&&slot.dataset.podiumCeremony===String(ceremonyId);
  const markPainted=()=>{if(!current()||!canvas.dataset.painted)return;slot.classList.add('podium-prepainted');slot.dataset.podiumPhase=stageStarted?slot.dataset.podiumPhase:'painted'};
  const finishJump=()=>{if(!current())return;if(slot._podiumFinishHandler)slot.removeEventListener('animationend',slot._podiumFinishHandler);slot._podiumFinishHandler=null;clearTimeout(slot._podiumRecoveryTimer);slot.classList.remove('podium-staged','podium-jumping');slot.classList.add('podium-ready');slot.dataset.podiumPhase='ready'};
  const stage=(startDelay=delay)=>{if(stageStarted||!current()||!canvas.dataset.painted)return;stageStarted=true;markPainted();slot.classList.add('podium-staged');slot.dataset.podiumPhase='staged';void slot.offsetWidth;slot._podiumTimer=setTimeout(()=>{if(!current())return;slot.classList.remove('podium-staged');slot.classList.add('podium-jumping');slot.dataset.podiumPhase='jumping';playSfx('uiMove',{intensity:rank===1?.82:.58});const onEnd=event=>{if(event.animationName!=='podiumCeremonyJump'||event.pseudoElement||!current())return;finishJump()};slot._podiumFinishHandler=onEnd;slot.addEventListener('animationend',onEnd);slot._podiumFallbackTimer=setTimeout(finishJump,1150)},startDelay)};
  const recoverPaint=()=>{if(!current()||slot.dataset.podiumPhase==='ready')return;if(podiumSpriteReady(racer)&&drawPodiumRacerSprite(canvas,racer,rank)){slot.dataset.podiumRecovery='sprite-watchdog';markPainted();stage(120);return}drawPodiumPortraitFallback(canvas,racer,rank).then(()=>{if(!current())return;slot.dataset.podiumRecovery=racer===miaNpc?'mia-front-png-watchdog':'portrait-watchdog';markPainted();stage(120)}).catch(error=>{console.warn(`Podium image recovery failed: ${racer.slug}`,error);if(!canvas.dataset.painted)paintPodiumPlaceholder(canvas,racer,rank);slot.dataset.podiumRecovery='placeholder-watchdog';markPainted();stage(120)})};
  // Race sprites are normally resident already, so paint synchronously before
  // the result screen is exposed. A generated placeholder prevents a blank
  // podium even if an individual file fails on a slow mobile connection.
  if(podiumSpriteReady(racer)&&drawPodiumRacerSprite(canvas,racer,rank)){markPainted();stage()}else{paintPodiumPlaceholder(canvas,racer,rank);markPainted();stage()}
  slot._podiumPaintTimer=setTimeout(recoverPaint,720);slot._podiumRecoveryTimer=setTimeout(()=>{if(!current()||slot.dataset.podiumPhase==='ready')return;slot.dataset.podiumRecovery=slot.dataset.podiumRecovery||'hard-visible-watchdog';finishJump()},delay+1250);slot._podiumForceTimer=setTimeout(()=>{if(!current())return;if(!canvas.dataset.painted)paintPodiumPlaceholder(canvas,racer,rank);markPainted();if(slot.dataset.podiumPhase!=='ready'){slot.dataset.podiumRecovery=slot.dataset.podiumRecovery||'absolute-visible-watchdog';finishJump()}},delay+1550);
  ensurePodiumSprite(racer).then(()=>{if(!current())return;clearTimeout(slot._podiumPaintTimer);if(drawPodiumRacerSprite(canvas,racer,rank)){markPainted();stage()}}).catch(()=>recoverPaint());
}
function renderResultCeremony(){
  const ceremonyId=++podiumCeremonySerial;
  canvas.dataset.podiumSequenceModel='visible-screen-first-v2';canvas.dataset.podiumCeremony=String(ceremonyId);
  const cup=cupState.final,recorded=Array.isArray(state.finishOrder)?state.finishOrder.filter(Boolean):[],remaining=cup?[]:raceOrder().filter(racer=>!recorded.includes(racer)),sorted=[...recorded,...remaining],rows=$('resultRows');
  const topRows=sorted.slice(0,6);
  rows.innerHTML=topRows.map((r,i)=>{const rank=i+1,isPlayer=r===racers[state.selected],isMia=r===miaNpc,score=cup?cupState.standings.get(r.slug)?.points:0;return`<div class="result-row ${isPlayer?'player':''}${isMia?' boss':''}" style="--delay:${Math.max(0,6-rank)*70}ms"><strong>${ordinal(rank)}</strong><canvas class="result-face" width="72" height="72" aria-label="${r.name}"></canvas><span>${r.name}${isMia?' · BOSS':''}</span><b>${cup?`${score||0} PTS`:isMia?'':racerResultTime(rank)}</b></div>`}).join('');
  [...rows.children].forEach((row,index)=>{const racer=topRows[index];row.dataset.racer=racer.slug;row.dataset.costume=racer===miaNpc?'boss':activeCostumeId(racer)});rows.querySelectorAll('.result-face').forEach((face,index)=>ensureRacerFaceIcon(face,topRows[index],'result-list'));
  [1,2,3].forEach(rank=>renderPodiumRacer($(`podiumSlot${rank}`),sorted[rank-1],rank,ceremonyId));
  const profile=DIFFICULTY_PROFILES[state.raceDifficulty]||DIFFICULTY_PROFILES.normal,badge=$('clearDifficultyBadge'),defeatedMia=state.raceRewards.some(reward=>reward.type==='mia'),rewardItems=resultRewardItems();
  badge.className=`clear-difficulty-badge ${state.raceDifficulty}`;badge.innerHTML=cup?`<small>${profile.label} CHAMPIONSHIP</small><strong>3 COURSE CUP</strong><span>${state.rank===1?'CUP CHAMPION':'CUP COMPLETE'}</span>`:`<small>${profile.kicker}</small><strong>${profile.label} CLEAR</strong><span>${state.raceDifficulty==='hard'?'CHALLENGE COMPLETE':'DIFFICULTY BADGE'}</span>`;
  $('resultRewards').innerHTML=rewardItems.map((reward,index)=>`<div class="reward-chip ${reward.type}" data-reward-stage="${index}"><span>${reward.new?'NEW':index===0?cup?'CUP':'RANK':''}</span><div><strong>${reward.label}</strong><small>${reward.detail}</small></div><b>${reward.type==='costume'?'OUTFIT':reward.points!==undefined?`${reward.points}PT`:`+${reward.coins}`}</b></div>`).join('');
  $('resultCourseName').textContent=cup?'3 COURSE CUP · FINAL':activeCourse.short;$('awardCard').innerHTML=cup?`<small>${profile.label} 3 COURSE CUP 表彰状</small><strong>${racers[state.selected].name}</strong><span>総合 第 ${state.rank} 位　${cupState.standings.get(racers[state.selected].slug)?.points||0} POINTS</span>`:`<small>${profile.label} GRAND PRIX 表彰状</small><strong>${racers[state.selected].name}</strong><span>第 ${state.rank} 位　${defeatedMia?'ミア・シャルム撃破！':state.rank<=3?'見事な表彰台です！':'最後までよく走り切りました！'}</span>`;
  prepareResultTally();runResultTallySequence();
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
  if(state.finish)return;if(raceTutorialState.active)completeRaceTutorial();state.finish=true;state.finishTime=state.elapsed;state.finishCoast=0;state.finishOrder=raceOrder();state.rank=state.finishOrder.indexOf(racers[state.selected])+1;state.running=true;
  const bonus=FINISH_COIN_REWARDS[state.rank]??10;state.finishCoinBonus=bonus;state.resultRecord=commitRaceRecord(state.finishTime);state.raceRewards=calculateRaceRewards(state.finishOrder);state.raceRewards.push(...unlockPodiumCostumes(racers[state.selected],state.selectedCourse,state.rank));const challengeBonus=state.raceRewards.reduce((sum,reward)=>sum+reward.coins,0),totalBonus=bonus+challengeBonus;state.raceWalletEarned+=totalBonus;addWalletCoins(totalBonus);canvas.dataset.finishCoinReward=String(bonus);canvas.dataset.resultRecord=state.resultRecord.newBest||state.resultRecord.first?'new':'existing';pauseRaceMusic();window.NyanAudio?.stopEngine();playSfx('finish',{intensity:state.rank===1?1.25:1});setDebugPanel(false);$('mobileControls').classList.add('hidden');showGoalFx(state.rank);
  if(cupState.active)recordCupRound(state.finishOrder);
  $('finishRank').innerHTML=ordinal(state.rank);$('finishTitle').textContent=state.rank===1?'VICTORY!':'RACE CLEAR!';$('finishTime').textContent=fmt(state.finishTime);$('finishCoins').textContent=`+${state.raceWalletEarned} COINS · TOTAL ${playerProgress.coins}`;
  clearTimeout(finishRace.timer);finishRace.timer=setTimeout(()=>{
    state.running=false;$('hud').classList.add('hidden');
    if(cupState.active&&cupState.results.length<CUP_RACE_COUNT){state.mode='cupStandings';showScreen('cupStandings');requestAnimationFrame(()=>renderCupStandings());return}
    if(cupState.active)prepareCupFinalResult();
    state.mode='finish';$('resultRows').replaceChildren();[1,2,3].forEach(rank=>resetPodiumRacer($(`podiumSlot${rank}`)));showScreen('finish');requestAnimationFrame(()=>requestAnimationFrame(()=>{try{renderResultCeremony()}catch(error){console.error('Result ceremony render failed',error);const fallback=(state.finishOrder||raceOrder()).slice(0,3),rescueId=++podiumCeremonySerial;fallback.forEach((racer,index)=>renderPodiumRacer($(`podiumSlot${index+1}`),racer,index+1,rescueId))}}))
  },1350)
}

function coverImage(image,shift=0,crop=null){
  const w=innerWidth,h=innerHeight;if(!image.complete||!image.naturalWidth){ctx.fillStyle='#130b3b';ctx.fillRect(0,0,w,h);return}
  const rx=crop?crop.x*image.naturalWidth:0,ry=crop?crop.y*image.naturalHeight:0,rw=crop?crop.w*image.naturalWidth:image.naturalWidth,rh=crop?crop.h*image.naturalHeight:image.naturalHeight,scale=Math.max(w/rw,h/rh)*1.06,sw=w/scale,sh=h/scale;
  const sx=Math.max(rx,Math.min(rx+rw-sw,rx+(rw-sw)/2+shift*rw*.045)),sy=Math.max(ry,Math.min(ry+rh-sh,ry+(rh-sh)/2));ctx.drawImage(image,sx,sy,sw,sh,0,0,w,h);
}
function drawBackdrop(){
  const shift=(Number.isFinite(state.cameraLane)?state.cameraLane:state.x)*.45-state.trackCurve*1.25;coverImage(environment,shift,environmentCrop);
  const shade=ctx.createLinearGradient(0,0,0,innerHeight);shade.addColorStop(0,'rgba(4,8,46,.06)');shade.addColorStop(.48,'rgba(15,8,52,.12)');shade.addColorStop(1,'rgba(5,3,24,.4)');ctx.fillStyle=shade;ctx.fillRect(0,0,innerWidth,innerHeight);
}
function routeCameraVisualLane(lane,geometry){
  const player=racers[state.selected],path=geometry&&player?.routeLap===geometry.lap?geometry.branches[player.routeChoice]:null;
  if(!geometry?.dual||!path)return lane;
  const local=clamp((lane-path.laneCenter)/Math.max(.001,path.laneHalf),-1.2,1.2);
  return path.visualCenter+local*path.visualHalf
}
function buildRoadProjection(){
  const h=innerHeight,w=innerWidth,speed=Math.min(1,state.speed/220),grade=hillAt(state.distance+45)-hillAt(state.distance-20),horizon=h*(.30-speed*.014+grade*.025),base=trackDistanceSample(state.distance),cameraLane=clamp(Number.isFinite(state.cameraLane)?state.cameraLane:state.x,-1.58,1.58),cameraRoute=routeGeometryAt(state.distance),cameraFork=cameraRoute?.fork||0,cameraLaneFollow=cameraRoute?.dual ? .82+cameraFork*.18 : .64+cameraFork*.34,cameraVisualLane=routeCameraVisualLane(cameraLane,cameraRoute),cameraX=cameraVisualLane*ROAD_WORLD_HALF_WIDTH*cameraLaneFollow;state.routeCameraElevation=routeCameraElevation();canvas.dataset.routeCameraProjection=cameraLaneFollow.toFixed(3);canvas.dataset.routeCameraCorridor=cameraRoute?.dual?'dual-selected':'shared';
  // Raw Catmull-Rom tangents can change very quickly on tight S bends.  Feed
  // a wider heading sample through a small low-pass filter before integrating
  // it.  The visible curve now follows the map without far-road jitter.
  const projection=activeCourse?.projection||{},windowSegments=projection.window||4.15,curveResponse=projection.response||.38,curveClamp=projection.clamp||.088,curveGain=projection.gain||.29,curveWindow=ROAD_SEGMENT_LENGTH*windowSegments;
  let worldX=0,dx=0,smoothedCurve=0,maxY=h+1;roadProjection=[];
  for(let i=0;i<=ROAD_SEGMENTS;i++){
    const rel=i*ROAD_SEGMENT_LENGTH,distance=state.distance+rel,sample=trackDistanceSample(distance);
    const before=trackDistanceSample(distance-curveWindow),after=trackDistanceSample(distance+curveWindow);
    const curve=clamp(angleDelta(after.heading,before.heading)/(windowSegments*2),-curveClamp,curveClamp);
    smoothedCurve+=(curve-smoothedCurve)*curveResponse;
    if(i>0){dx+=smoothedCurve*curveGain;dx*=.996;worldX+=dx}
    const worldY=(hillAt(distance)-hillAt(state.distance))*1.28,z=ROAD_NEAR_Z+i,scale=ROAD_CAMERA_DEPTH/z;
    const y=horizon-scale*(worldY-ROAD_CAMERA_HEIGHT)*h*.5,cx=w*.5+scale*(worldX-cameraX)*w*.5,half=scale*ROAD_WORLD_HALF_WIDTH*w*.5;
    roadProjection.push({rel,z,y,cx,half,scale,worldX,worldY,curve,tangent:dx,heading:sample.heading,relativeHeading:angleDelta(sample.heading,base.heading),visible:true,clipY:maxY});
    if(i>0){const segment=roadProjection[i-1];segment.visible=y<maxY;segment.clipY=maxY;if(segment.visible)maxY=y}
  }
  const far=roadProjection[Math.min(ROAD_SEGMENTS,Math.floor(ROAD_SEGMENTS*.72))],signature=courseGeometrySignature(activeCourse,state.selectedCourse),preview=$('courseSelectMap'),previewSignature=preview?.dataset.geometrySignature;canvas.dataset.roadTurn=far.relativeHeading.toFixed(3);canvas.dataset.roadFarX=far.cx.toFixed(1);canvas.dataset.elevation=hillAt(state.distance).toFixed(3);canvas.dataset.grade=grade.toFixed(3);canvas.dataset.trackProjectionSource=trackSampleCache?.version||'raw-fallback';canvas.dataset.trackProjectionStep=trackSampleCache?.step?.toFixed(2)||'raw';canvas.dataset.courseGeometryModel=signature.model;canvas.dataset.courseGeometrySignature=signature.hash;canvas.dataset.courseTrackSignature=signature.components.track;canvas.dataset.courseElevationSignature=signature.components.elevation;canvas.dataset.courseRouteSignature=signature.components.route;canvas.dataset.courseLandmarkSignature=signature.components.landmarks;canvas.dataset.coursePreviewSignature=previewSignature||'not-previewed';canvas.dataset.courseGeometryParity=previewSignature?(previewSignature===signature.hash?'match':'mismatch'):'not-previewed';
  return roadProjection;
}
function roadPoint(rel){
  if(!roadProjection.length)buildRoadProjection();const safeRel=Number.isFinite(rel)?rel:0,q=Math.max(0,Math.min(ROAD_SEGMENTS,safeRel/DRAW_DISTANCE*ROAD_SEGMENTS)),i=Math.floor(q),a=roadProjection[i],b=roadProjection[Math.min(ROAD_SEGMENTS,i+1)],t=q-i;
  return{rel:a.rel+(b.rel-a.rel)*t,y:a.y+(b.y-a.y)*t,half:a.half+(b.half-a.half)*t,cx:a.cx+(b.cx-a.cx)*t,scale:a.scale+(b.scale-a.scale)*t,heading:a.heading,relativeHeading:a.relativeHeading+angleDelta(b.relativeHeading,a.relativeHeading)*t,tangent:a.tangent+(b.tangent-a.tangent)*t,worldX:a.worldX+(b.worldX-a.worldX)*t,visible:a.visible,clipY:a.clipY};
}

function poly(points,color){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fill()}
function roadBandPoly(p1,p2,left1,right1,left2,right2,color){poly([[p1.cx+p1.half*left1,p1.y],[p1.cx+p1.half*right1,p1.y],[p2.cx+p2.half*right2,p2.y],[p2.cx+p2.half*left2,p2.y]],color)}
function routeCameraElevation(){const geometry=routeGeometryAt(state.distance),player=racers[state.selected];return geometry&&player?.routeLap===geometry.lap?geometry.branches[player.routeChoice]?.elevation||0:0}
function routePathY(point,path){return point.y-((path?.elevation||0)-(state.routeCameraElevation||0))*point.half*.32}
function routeCorridorPoint(point,path){
  if(!path)return{cx:point.cx,y:point.y,half:point.half,scale:point.scale};
  const corridorScale=path.corridorScale||1;
  return{cx:point.cx+point.half*path.visualCenter,y:routePathY(point,path),half:point.half*path.visualHalf*corridorScale,scale:point.scale*corridorScale}
}
function routePathBandPoly(p1,p2,path1,path2,left1,right1,left2,right2,color){
  const a=routeCorridorPoint(p1,path1),b=routeCorridorPoint(p2,path2),h1=Math.max(.001,path1.visualHalf),h2=Math.max(.001,path2.visualHalf);
  poly([[a.cx+a.half*left1/h1,a.y],[a.cx+a.half*right1/h1,a.y],[b.cx+b.half*right2/h2,b.y],[b.cx+b.half*left2/h2,b.y]],color)
}
function surfacePaint(material,theme){return{roadA:material.roadA||theme.roadA,roadB:material.roadB||theme.roadB,curbA:material.curbA||theme.curbA,curbB:material.curbB||theme.curbB,lane:material.id==='asphalt'?theme.lane:material.lane}}
function drawProjectedSurfaceSides(p1,p2,material,left=-1,right=1){if(!material.sideDepth)return;const depth1=Math.max(2,p1.half*material.sideDepth),depth2=Math.max(1,p2.half*material.sideDepth),color=material.side||'#29232a';poly([[p1.cx+p1.half*left,p1.y],[p1.cx+p1.half*left,p1.y+depth1],[p2.cx+p2.half*left,p2.y+depth2],[p2.cx+p2.half*left,p2.y]],color);poly([[p1.cx+p1.half*right,p1.y],[p2.cx+p2.half*right,p2.y],[p2.cx+p2.half*right,p2.y+depth2],[p1.cx+p1.half*right,p1.y+depth1]],colorAlpha(color,.92));ctx.save();ctx.globalAlpha=.24;ctx.strokeStyle='#fff0b2';ctx.lineWidth=Math.max(.6,p1.half*.012);ctx.beginPath();ctx.moveTo(p1.cx+p1.half*left,p1.y+depth1*.18);ctx.lineTo(p2.cx+p2.half*left,p2.y+depth2*.18);ctx.moveTo(p1.cx+p1.half*right,p1.y+depth1*.18);ctx.lineTo(p2.cx+p2.half*right,p2.y+depth2*.18);ctx.stroke();ctx.restore()}
function drawSplitRoadSegment(p1,p2,distance1,distance2,band,alt,theme,terrain,material){
  const a=routeGeometryAt(distance1),b=routeGeometryAt(distance2),fork=Math.max(a?.fork||0,b?.fork||0);if(fork<=.055)return false;
  const ga=a||b,gb=b||a,leftA=ga.branches.left,rightA=ga.branches.right,leftB=gb.branches.left,rightB=gb.branches.right,outerA=Math.max(Math.abs(leftA.visualCenter)+leftA.visualHalf,Math.abs(rightA.visualCenter)+rightA.visualHalf),outerB=Math.max(Math.abs(leftB.visualCenter)+leftB.visualHalf,Math.abs(rightB.visualCenter)+rightB.visualHalf);
  poly([[0,p1.y],[p1.cx-p1.half*(outerA+1.05),p1.y],[p2.cx-p2.half*(outerB+1.05),p2.y],[0,p2.y]],terrain.deepA);poly([[p1.cx+p1.half*(outerA+1.05),p1.y],[innerWidth,p1.y],[innerWidth,p2.y],[p2.cx+p2.half*(outerB+1.05),p2.y]],terrain.deepB);
  const corridorLeftA=routeCorridorPoint(p1,leftA),corridorRightA=routeCorridorPoint(p1,rightA),corridorLeftB=routeCorridorPoint(p2,leftB),corridorRightB=routeCorridorPoint(p2,rightB);
  poly([[corridorLeftA.cx+corridorLeftA.half,corridorLeftA.y],[corridorRightA.cx-corridorRightA.half,corridorRightA.y],[corridorRightB.cx-corridorRightB.half,corridorRightB.y],[corridorLeftB.cx+corridorLeftB.half,corridorLeftB.y]],alt?terrain.grassA:terrain.grassB);
  const paint=surfacePaint(material,theme),roadColor=alt?paint.roadA:paint.roadB,curbColor=alt?paint.curbA:paint.curbB,curbAlt=alt?paint.curbB:paint.curbA;
  for(const id of['left','right']){const pa=ga.branches[id],pb=gb.branches[id],halfA=pa.visualHalf,halfB=pb.visualHalf;routePathBandPoly(p1,p2,pa,pb,-halfA-.8,-halfA-.28,-halfB-.8,-halfB-.28,id==='left'?terrain.grassA:terrain.grassB);routePathBandPoly(p1,p2,pa,pb,halfA+.28,halfA+.8,halfB+.28,halfB+.8,id==='left'?terrain.grassB:terrain.grassA);routePathBandPoly(p1,p2,pa,pb,-halfA-.28,-halfA-.08,-halfB-.28,-halfB-.08,alt?terrain.shoulderA:terrain.shoulderB);routePathBandPoly(p1,p2,pa,pb,halfA+.08,halfA+.28,halfB+.08,halfB+.28,alt?terrain.shoulderB:terrain.shoulderA);routePathBandPoly(p1,p2,pa,pb,-halfA,halfA,-halfB,halfB,roadColor);routePathBandPoly(p1,p2,pa,pb,-halfA-.075,-halfA,-halfB-.075,-halfB,curbColor);routePathBandPoly(p1,p2,pa,pb,halfA,halfA+.075,halfB,halfB+.075,curbAlt);if(paint.lane&&band%5<2){const w1=Math.max(.004,p1.half*.011)/Math.max(1,p1.half),w2=Math.max(.004,p2.half*.011)/Math.max(1,p2.half);routePathBandPoly(p1,p2,pa,pb,-w1,w1,-w2,w2,paint.lane)}}
  return true
}
function drawRoad(){
  const w=innerWidth,current=trackSample(state.progress),theme=activeCourse.theme,terrain=offroadPalette(theme);canvas.dataset.heading=current.heading.toFixed(3);canvas.dataset.cameraHeading=(Number.isFinite(state.cameraHeading)?state.cameraHeading:current.heading).toFixed(3);
  for(let i=ROAD_SEGMENTS-1;i>=0;i--){
    const r1=i/ROAD_SEGMENTS*DRAW_DISTANCE,p1=roadProjection[i],p2=roadProjection[i+1];
    if(!p1.visible)continue;
    const distance1=state.distance+p1.rel,distance2=state.distance+p2.rel,midDistance=(distance1+distance2)*.5,material=trackMaterialAt(midDistance),paint=surfacePaint(material,theme),band=Math.floor((state.distance+r1)/25),alt=band%2===0;
    const shoulder=alt?terrain.shoulderA:terrain.shoulderB,grass=alt?terrain.grassA:terrain.grassB,deep=alt?terrain.deepA:terrain.deepB;
    if(drawSplitRoadSegment(p1,p2,distance1,distance2,band,alt,theme,terrain,material))continue;
    const bandPoly=(side,inner,outer,color)=>{if(side<0)poly([[p1.cx-p1.half*outer,p1.y],[p1.cx-p1.half*inner,p1.y],[p2.cx-p2.half*inner,p2.y],[p2.cx-p2.half*outer,p2.y]],color);else poly([[p1.cx+p1.half*inner,p1.y],[p1.cx+p1.half*outer,p1.y],[p2.cx+p2.half*outer,p2.y],[p2.cx+p2.half*inner,p2.y]],color)};
    poly([[0,p1.y],[p1.cx-p1.half*2.36,p1.y],[p2.cx-p2.half*2.36,p2.y],[0,p2.y]],deep);
    poly([[p1.cx+p1.half*2.36,p1.y],[w,p1.y],[w,p2.y],[p2.cx+p2.half*2.36,p2.y]],deep);
    if(material.elevated){for(const side of[-1,1])bandPoly(side,1,2.36,deep);drawProjectedSurfaceSides(p1,p2,material)}else for(const side of [-1,1]){bandPoly(side,1.36,2.36,grass);bandPoly(side,1.13,1.36,shoulder)}
    const curbWidth=material.elevated?1.075:1.13;poly([[p1.cx-p1.half*curbWidth,p1.y],[p1.cx-p1.half,p1.y],[p2.cx-p2.half,p2.y],[p2.cx-p2.half*curbWidth,p2.y]],alt?paint.curbA:paint.curbB);
    poly([[p1.cx+p1.half,p1.y],[p1.cx+p1.half*curbWidth,p1.y],[p2.cx+p2.half*curbWidth,p2.y],[p2.cx+p2.half,p2.y]],alt?paint.curbA:paint.curbB);
    poly([[p1.cx-p1.half,p1.y],[p1.cx+p1.half,p1.y],[p2.cx+p2.half,p2.y],[p2.cx-p2.half,p2.y]],alt?paint.roadA:paint.roadB);
    if(paint.lane&&band%5<2){for(const lane of [-1/3,1/3]){const a1=p1.half*.011,a2=p2.half*.011;poly([[p1.cx+p1.half*lane-a1,p1.y],[p1.cx+p1.half*lane+a1,p1.y],[p2.cx+p2.half*lane+a2,p2.y],[p2.cx+p2.half*lane-a2,p2.y]],paint.lane)}}
    if(i<38&&band%6<2){for(const lane of [-.72,-.18,.48]){const a1=p1.half*.004,a2=p2.half*.004;poly([[p1.cx+p1.half*lane-a1,p1.y],[p1.cx+p1.half*lane+a1,p1.y],[p2.cx+p2.half*lane+a2,p2.y],[p2.cx+p2.half*lane-a2,p2.y]],'rgba(255,255,255,.11)')}}
    const startLine=finishLineOffset(),lapLength=raceLength(),lapZ=((state.distance+r1-startLine)%lapLength+lapLength)%lapLength;if(lapZ<30){for(let c=0;c<10;c++){const l1=-1+c*.2,l2=l1+.2;poly([[p1.cx+p1.half*l1,p1.y],[p1.cx+p1.half*l2,p1.y],[p2.cx+p2.half*l2,p2.y],[p2.cx+p2.half*l1,p2.y]],(c+band)%2?'#fff':'#1a153a')}}
  }
}
function drawWetRoadInteraction(){
  const profile=COURSE_AMBIENCE_PROFILES[state.selectedCourse],hasRain=profile?.effects?.some(effect=>effect.type==='rain');if(!hasRain){canvas.dataset.wetRoad='off';canvas.dataset.wetRoadSegments='0';return}
  const strength=profile.id==='rain'?1:.62;let drawn=0;ctx.save();ctx.globalCompositeOperation='screen';
  for(let i=ROAD_SEGMENTS-1;i>=0;i--){const p1=roadProjection[i],p2=roadProjection[i+1];if(!p1.visible)continue;const d1=state.distance+p1.rel,d2=state.distance+p2.rel,mid=(d1+d2)*.5;if(tunnelAt(mid))continue;const route1=routeGeometryAt(d1),route2=routeGeometryAt(d2),band=Math.floor(mid/18),film=`rgba(91,190,224,${(.035+(band%3)*.012)*strength})`,glint=`rgba(222,249,255,${(.055+(band%5===0?.08:0))*strength})`;
    if(Math.max(route1?.fork||0,route2?.fork||0)>.055){const a=route1||route2,b=route2||route1;for(const id of['left','right']){const pa=a.branches[id],pb=b.branches[id];routePathBandPoly(p1,p2,pa,pb,-pa.visualHalf*.96,pa.visualHalf*.96,-pb.visualHalf*.96,pb.visualHalf*.96,film);if(band%6===0)routePathBandPoly(p1,p2,pa,pb,-pa.visualHalf*.18,pa.visualHalf*.2,-pb.visualHalf*.08,pb.visualHalf*.28,glint)}}
    else{roadBandPoly(p1,p2,-.98,.98,-.98,.98,film);if(band%6===0){const shift=Math.sin(band*1.73)*.42;roadBandPoly(p1,p2,shift-.1,shift+.14,shift-.02,shift+.22,glint)}}drawn++;
  }
  ctx.restore();canvas.dataset.wetRoad='rain-reflection-v1';canvas.dataset.wetRoadSegments=String(drawn);canvas.dataset.wetRoadStrength=strength.toFixed(2);
}
function drawSnowRoadInteraction(){
  if(!courseHasAmbience('snow')){canvas.dataset.snowRoad='off';canvas.dataset.snowRoadSegments='0';return}let drawn=0;ctx.save();
  for(let i=ROAD_SEGMENTS-1;i>=0;i--){const p1=roadProjection[i],p2=roadProjection[i+1];if(!p1.visible)continue;const d1=state.distance+p1.rel,d2=state.distance+p2.rel,mid=(d1+d2)*.5;if(tunnelAt(mid))continue;const route1=routeGeometryAt(d1),route2=routeGeometryAt(d2),band=Math.floor(mid/16),snow=band%2?'rgba(220,239,246,.58)':'rgba(232,247,251,.64)',ice='rgba(185,237,255,.2)';
    if(Math.max(route1?.fork||0,route2?.fork||0)>.055){const a=route1||route2,b=route2||route1;for(const id of['left','right']){const pa=a.branches[id],pb=b.branches[id];routePathBandPoly(p1,p2,pa,pb,-pa.visualHalf*.97,pa.visualHalf*.97,-pb.visualHalf*.97,pb.visualHalf*.97,snow);if(band%5===1)routePathBandPoly(p1,p2,pa,pb,-pa.visualHalf*.42,-pa.visualHalf*.16,-pb.visualHalf*.34,-pb.visualHalf*.08,ice)}}
    else{roadBandPoly(p1,p2,-.98,.98,-.98,.98,snow);if(band%5===1){const lane=Math.sin(band*1.31)*.38;roadBandPoly(p1,p2,lane-.2,lane+.08,lane-.12,lane+.16,ice)}}drawn++;
  }
  ctx.restore();canvas.dataset.snowRoad='packed-snow-v1';canvas.dataset.snowRoadSegments=String(drawn);
}
function drawSnowTireTracks(){
  if(!courseHasAmbience('snow')){canvas.dataset.snowTrackVisible='0';return}let visible=0;
  for(const mark of state.snowTracks){const rel=mark.z-state.distance;if(rel<2||rel>DRAW_DISTANCE-8||tunnelAt(mark.z))continue;const length=5.8,p1=roadPoint(rel),p2=roadPoint(rel+length);if(!p1.visible||!p2.visible)continue;const path1=projectedRoutePath(mark.z,mark.lane),path2=projectedRoutePath(mark.z+length,mark.lane),lane1=projectedRouteLane(mark.z,mark.lane),lane2=projectedRouteLane(mark.z+length,mark.lane),y1=routePathY(p1,path1),y2=routePathY(p2,path2),alpha=clamp(mark.life/mark.max,0,1)*distanceFadeAlpha(rel,480,720);
    for(const tyre of[-.075,.075]){const x1=p1.cx+p1.half*(lane1+tyre),x2=p2.cx+p2.half*(lane2+tyre),w1=Math.max(.55,p1.half*.009),w2=Math.max(.38,p2.half*.009);poly([[x1-w1,y1],[x1+w1,y1],[x2+w2,y2],[x2-w2,y2]],`rgba(38,61,80,${alpha*.78})`)}visible++;
  }
  canvas.dataset.snowTrackVisible=String(visible);canvas.dataset.snowTrackModel='world-projected-persistent-v1';
}
function drawTrackMaterialDetails(p1,p2,distance,route,material){
  if(material.id==='asphalt')return;const band=Math.floor(distance/8),paths=route?.fork>.055?Object.values(route.branches).map(path=>({center:path.visualCenter,half:path.visualHalf})):[{center:0,half:1}],quad=(center,left,right,color)=>poly([[p1.cx+p1.half*(center+left),p1.y],[p1.cx+p1.half*(center+right),p1.y],[p2.cx+p2.half*(center+right),p2.y],[p2.cx+p2.half*(center+left),p2.y]],color);
  for(const path of paths){
    if(material.detail==='stone'){if(band%2===0)quad(path.center,-path.half,path.half,'rgba(17,28,18,.22)');for(const lane of[-.48,0,.48]){const w=Math.max(.002,p1.half*.004/Math.max(1,p1.half));quad(path.center+lane*path.half,-w,w,'rgba(218,204,133,.09)')}}
    else if(material.detail==='wood'){if(band%2===0)quad(path.center,-path.half,path.half,'rgba(31,19,12,.28)');for(const lane of[-.66,0,.66]){const w=Math.max(.003,p1.half*.006/Math.max(1,p1.half));quad(path.center+lane*path.half,-w,w,'rgba(242,196,108,.14)')}}
    else if(material.detail==='mud'){if(band%4===1){const center=path.center+Math.sin(band*2.37)*path.half*.42,width=path.half*(.12+Math.abs(Math.sin(band))*.12);quad(center,-width,width,'rgba(24,35,25,.26)')}if(band%7===3)quad(path.center-path.half*.62,-path.half*.06,path.half*.06,'rgba(139,106,59,.18)')}
    else if(material.detail==='emerald'){if(band%4===0){const width=path.half*.055;quad(path.center,-width,width,'rgba(74,255,174,.34)')}if(band%9===2){ctx.save();ctx.globalCompositeOperation='screen';quad(path.center,-path.half*.46,path.half*.46,'rgba(42,210,133,.1)');ctx.restore()}}
    else if(material.detail==='metal'){if(band%2===0)quad(path.center,-path.half,path.half,'rgba(225,242,255,.1)')}
    else if(material.detail==='tiles'){for(const lane of[-.5,0,.5])quad(path.center+lane*path.half,-.012,.012,'rgba(255,223,180,.1)')}
    else if(material.detail==='pastry'&&band%3===0)quad(path.center+Math.sin(band)*path.half*.4,-path.half*.055,path.half*.055,'rgba(255,255,255,.19)')
  }
}
function drawRoadSurfaceDetails(){
  for(let i=ROAD_SEGMENTS-1;i>=0;i--){const p1=roadProjection[i],p2=roadProjection[i+1];if(!p1.visible)continue;const distance=state.distance+p1.rel,route=routeGeometryAt(distance),material=trackMaterialAt(distance),band=Math.floor(distance/18),lanes=route?.fork>.055?Object.values(route.branches).map(path=>path.visualCenter):[-.62,.08,.57];drawTrackMaterialDetails(p1,p2,distance,route,material);if(band%7===0){for(const lane of lanes){const width1=Math.max(.35,p1.half*.0035),width2=Math.max(.25,p2.half*.0035);poly([[p1.cx+p1.half*lane-width1,p1.y],[p1.cx+p1.half*lane+width1,p1.y],[p2.cx+p2.half*lane+width2,p2.y],[p2.cx+p2.half*lane-width2,p2.y]],'rgba(255,255,255,.045)')}}if(band%13===2){const lane=route?.fork>.055?Object.values(route.branches)[band%2?0:1]?.visualCenter||0:Math.sin(band*2.17)*.5,w1=p1.half*.035,w2=p2.half*.035;poly([[p1.cx+p1.half*lane-w1,p1.y],[p1.cx+p1.half*lane+w1,p1.y],[p2.cx+p2.half*lane+w2,p2.y],[p2.cx+p2.half*lane-w2,p2.y]],'rgba(105,226,255,.075)')}}
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
function tunnelContinuityAt(distance){const phase=trackPhase(distance);for(const section of tunnelSections){const[start,end]=section;if(phase<start-TUNNEL_COLLAR_LENGTH||phase>end+TUNNEL_COLLAR_LENGTH)continue;const enter=clamp((phase-(start-TUNNEL_COLLAR_LENGTH))/TUNNEL_COLLAR_LENGTH,0,1),exit=clamp(((end+TUNNEL_COLLAR_LENGTH)-phase)/TUNNEL_COLLAR_LENGTH,0,1),raw=Math.min(enter,exit),blend=raw*raw*(3-2*raw);return{section,blend,inside:phase>=start&&phase<=end,portalDistance:Math.min(Math.abs(phase-start),Math.abs(end-phase))}}return null}
function tunnelCrossSection(p,distance){const continuity=tunnelContinuityAt(distance),blend=continuity?.blend||0,flare=1-blend,half=p.half*(1.16+flare*.1),springY=p.y-p.half*(.47+flare*.04),rise=p.half*(.66+flare*.08),segments=8,arch=[];for(let i=0;i<=segments;i++){const angle=Math.PI-i/segments*Math.PI;arch.push({x:p.cx+Math.cos(angle)*half,y:springY-Math.sin(angle)*rise})}return{left:p.cx-half,right:p.cx+half,ground:p.y+2,springY,top:springY-rise,half,arch,blend,continuity}}
function traceTunnelOpening(p,distance=state.distance){const section=tunnelCrossSection(p,distance);ctx.beginPath();ctx.moveTo(section.left,section.ground);ctx.lineTo(section.arch[0].x,section.arch[0].y);for(let i=1;i<section.arch.length;i++)ctx.lineTo(section.arch[i].x,section.arch[i].y);ctx.lineTo(section.right,section.ground);ctx.closePath();return section}
function strokeTunnelRib(p,distance,color,alpha=1){const section=tunnelCrossSection(p,distance);ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.beginPath();ctx.moveTo(section.left,section.ground);ctx.lineTo(section.arch[0].x,section.arch[0].y);for(let i=1;i<section.arch.length;i++)ctx.lineTo(section.arch[i].x,section.arch[i].y);ctx.lineTo(section.right,section.ground);ctx.stroke();ctx.restore();return section}
function drawThroughTunnelPortal(source,draw){const distance=typeof source==='number'?source:source.z,portal=typeof source==='number'?firstTunnelPortalBetween(distance):source.portal;if(portal===null){draw();return}tunnelClipCount++;const p=roadPoint(portal-state.distance);if(!p.visible)return;ctx.save();traceTunnelOpening(p,portal);ctx.clip();draw();ctx.restore()}
function distanceFadeAlpha(rel,near=520,far=DRAW_DISTANCE*.96){return rel<=near?1:Math.max(0,Math.min(1,(far-rel)/Math.max(1,far-near)))}
function clamp01(v){return Math.max(0,Math.min(1,v))}
function colorAlpha(color,alpha){if(/^#([0-9a-f]{6})$/i.test(color)){const n=parseInt(color.slice(1),16);return`rgba(${n>>16&255},${n>>8&255},${n&255},${alpha})`}return`rgba(244,248,255,${alpha})`}
function sceneryFogAmount(rel){const profile=COURSE_DEPTH_PROFILES[state.selectedCourse]||COURSE_DEPTH_PROFILES[0];return settings.richScenery?clamp01((rel-profile.fogStart)/profile.fogSpan):0}
function sceneryFilter(rel){const fog=sceneryFogAmount(rel);return fog<=.02?'none':`saturate(${1-fog*.34}) brightness(${1+fog*.18})`}
const SCENERY_RENDER_CONTRACT=Object.freeze({model:'grounded-opaque-near-fog-far-v1',opaqueStart:8,opaqueEnd:360,fadeStart:505,fadeEnd:835,groundTolerancePx:1.25,layers:Object.freeze({near:Object.freeze({enter:7,fadeStart:505,fadeEnd:835,fog:0.16}),mid:Object.freeze({enter:28,fadeStart:430,fadeEnd:815,fog:0.24}),far:Object.freeze({enter:96,fadeStart:365,fadeEnd:805,fog:0.36})})});
let sceneryFrameAudit={draws:0,nearDraws:0,farDraws:0,nearTransparent:0,groundErrorMax:0,minNearAlpha:1,groundPads:0};
function beginSceneryFrameAudit(){sceneryFrameAudit={draws:0,nearDraws:0,farDraws:0,nearTransparent:0,groundErrorMax:0,minNearAlpha:1,groundPads:0}}
function sceneryFrameGroundPad(frame,fallback=.055){return Number.isFinite(frame?.groundPad)?Math.max(0,frame.groundPad):fallback}
function sceneryGroundY(roadY,height,frame,fallback=.055){return roadY+height*sceneryFrameGroundPad(frame,fallback)}
function sceneryVisibilityAlpha(rel,layer='near',base=1){const rule=SCENERY_RENDER_CONTRACT.layers[layer]||SCENERY_RENDER_CONTRACT.layers.near,enter=rel<rule.enter?clamp01(rel/rule.enter):1,fade=distanceFadeAlpha(rel,rule.fadeStart,rule.fadeEnd),fog=sceneryFogAmount(rel),fogMix=rel<SCENERY_RENDER_CONTRACT.opaqueEnd&&layer==='near'?0:fog*rule.fog,layerBase=layer==='near'&&rel>=SCENERY_RENDER_CONTRACT.opaqueStart&&rel<=SCENERY_RENDER_CONTRACT.opaqueEnd?1:base;return clamp01(enter*fade*layerBase*(1-fogMix))}
function recordSceneryDraw(frame,roadY,groundY,height,rel,alpha,layer){const pad=sceneryFrameGroundPad(frame),visibleBottom=groundY-height*pad,error=Math.abs(visibleBottom-roadY);sceneryFrameAudit.draws++;sceneryFrameAudit.groundErrorMax=Math.max(sceneryFrameAudit.groundErrorMax,error);if(pad>0)sceneryFrameAudit.groundPads++;if(layer==='near'){sceneryFrameAudit.nearDraws++;if(rel>=SCENERY_RENDER_CONTRACT.opaqueStart&&rel<=SCENERY_RENDER_CONTRACT.opaqueEnd){sceneryFrameAudit.minNearAlpha=Math.min(sceneryFrameAudit.minNearAlpha,alpha);if(alpha<.98)sceneryFrameAudit.nearTransparent++}}else sceneryFrameAudit.farDraws++}
function drawGroundedSceneryFrame(frame,x,roadY,height,rel,alpha=1,rotation=0,filter='none',layer='near'){if(!frame)return 0;const groundY=sceneryGroundY(roadY,height,frame),visibility=sceneryVisibilityAlpha(rel,layer,alpha);if(visibility<=.025)return 0;recordSceneryDraw(frame,roadY,groundY,height,rel,visibility,layer);drawFrameHeightFiltered(frame,x,groundY,height,visibility,rotation,filter);return visibility}
function publishSceneryFrameAudit(){canvas.dataset.sceneryRenderModel=SCENERY_RENDER_CONTRACT.model;canvas.dataset.sceneryGroundErrorMax=sceneryFrameAudit.groundErrorMax.toFixed(2);canvas.dataset.sceneryNearTransparent=String(sceneryFrameAudit.nearTransparent);canvas.dataset.sceneryNearAlpha=(sceneryFrameAudit.nearDraws?sceneryFrameAudit.minNearAlpha:1).toFixed(3);canvas.dataset.sceneryDraws=String(sceneryFrameAudit.draws);canvas.dataset.sceneryNearDraws=String(sceneryFrameAudit.nearDraws);canvas.dataset.sceneryFarDraws=String(sceneryFrameAudit.farDraws);canvas.dataset.sceneryGroundPads=String(sceneryFrameAudit.groundPads);canvas.dataset.sceneryFadeEnd=String(SCENERY_RENDER_CONTRACT.fadeEnd)}
function drawFrameHeightFiltered(frame,x,y,height,alpha=1,rotation=0,filter='none'){if(!frame)return;const width=height*frame.sw/frame.sh;ctx.save();ctx.globalAlpha=alpha;ctx.filter=filter;ctx.translate(x,y);ctx.rotate(rotation);ctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,-width/2,-height,width,height);ctx.restore()}
function drawFrameBoxFiltered(frame,x,y,width,height,alpha=1,filter='none'){if(!frame)return;ctx.save();ctx.globalAlpha=alpha;ctx.filter=filter;ctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,x-width/2,y-height,width,height);ctx.restore()}
function drawDistanceFog(){
  if(!settings.richScenery)return;
  const h=innerHeight,w=innerWidth,theme=activeCourse.theme,horizon=h*.29,jungle=!!activeCourse?.immersiveJungle,profile=COURSE_DEPTH_PROFILES[state.selectedCourse]||COURSE_DEPTH_PROFILES[0],fogColor=profile.fog;
  ctx.save();ctx.globalCompositeOperation='source-over';
  const fog=ctx.createLinearGradient(0,horizon,0,h*.74);
  fog.addColorStop(0,colorAlpha(fogColor,profile.fogAlpha));
  fog.addColorStop(.42,colorAlpha(fogColor,profile.fogAlpha*.48));
  fog.addColorStop(1,'rgba(244,248,255,0)');
  ctx.fillStyle=fog;ctx.fillRect(0,horizon,w,h*.5);
  ctx.globalAlpha=profile.fogAlpha*(jungle?.42:.68);ctx.fillStyle=jungle?'#173925':fogColor;ctx.fillRect(0,horizon,w,h*.18);
  ctx.restore();canvas.dataset.sceneryFog=profile.id;canvas.dataset.sceneryFogAlpha=profile.fogAlpha.toFixed(2);
}
function drawTunnelPortalFrame(boundary,emphasis=1){
  const p=roadPoint(boundary-state.distance);if(!p.visible)return;
  const rel=boundary-state.distance,theme=activeCourse.theme,frame=tunnelPortalFrames[Math.min(tunnelPortalFrames.length-1,state.selectedCourse)],alpha=distanceFadeAlpha(rel,500,790),portalWidth=Math.max(30,p.half*3.34*emphasis),portalHeight=Math.max(24,p.half*2.18*emphasis);
  if(frame){drawFrameBoxFiltered(frame,p.cx,p.y+Math.max(1,p.half*.025),portalWidth,portalHeight,alpha,sceneryFilter(rel));canvas.dataset.tunnelPortalAsset=`gpt-image-2:${courseScenerySlugs[state.selectedCourse]||'debug'}`;canvas.dataset.tunnelPortalOpen='alpha-center'}
  else{
    // Asset-load fallback remains an outline only. Never fill the aperture:
    // the road and tunnel interior must stay visible through the entrance.
    const half=p.half*1.24,top=p.y-p.half*1.04,left=p.cx-half,right=p.cx+half;ctx.save();ctx.globalAlpha=alpha;ctx.lineCap='round';ctx.strokeStyle='rgba(8,5,24,.96)';ctx.lineWidth=Math.max(5,p.half*.19)*emphasis;ctx.beginPath();ctx.moveTo(left,p.y);ctx.lineTo(left,top+p.half*.34);ctx.bezierCurveTo(left,top-p.half*.2,right,top-p.half*.2,right,top+p.half*.34);ctx.lineTo(right,p.y);ctx.stroke();ctx.strokeStyle=theme.curbA;ctx.lineWidth=Math.max(2,p.half*.058)*emphasis;ctx.shadowColor=theme.lightB;ctx.shadowBlur=Math.max(6,p.half*.13);ctx.stroke();ctx.strokeStyle=theme.lightA;ctx.lineWidth=Math.max(1,p.half*.02)*emphasis;ctx.globalAlpha=.86;ctx.stroke();ctx.restore();canvas.dataset.tunnelPortalAsset='outline-fallback';canvas.dataset.tunnelPortalOpen='outline-center'
  }
}
function guardrailEdgesForPoint(profile,point){const edges=new Map(),cameraElevation=state.routeCameraElevation||0;for(const corridor of profile.corridors){const y=point.y-(corridor.elevation-cameraElevation)*point.half*.32,half=Math.max(point.half*.38,point.half*corridor.roadHalfVisual),push=(key,factor,alpha,side)=>edges.set(key,{key,x:point.cx+point.half*factor,y,half,alpha,side,corridor:corridor.id});push(corridor.leftKey,corridor.visualRailLeft,corridor.leftAlpha,-1);push(corridor.rightKey,corridor.visualRailRight,corridor.rightAlpha,1)}return edges}
function drawGuardrails(){
  const theme=activeCourse.theme;let drawn=0,splitDrawn=0;for(let i=ROAD_SEGMENTS-1;i>=0;i--){const p1=roadProjection[i],p2=roadProjection[i+1],distance1=state.distance+p1.rel,distance2=state.distance+p2.rel,distance=(distance1+distance2)*.5;if(!p1.visible||tunnelAt(distance))continue;const profile1=trackBoundaryProfileAt(distance1),profile2=trackBoundaryProfileAt(distance2),material=trackMaterialAt(distance),edges1=guardrailEdgesForPoint(profile1,p1),edges2=guardrailEdgesForPoint(profile2,p2),band=Math.floor(distance/35),color=material.id==='jungle-wood'?(band%2?'#9b713d':'#5c4228'):(band%2?theme.railA:theme.railB);
    for(const[key,a]of edges1){const b=edges2.get(key);if(!b)continue;const alpha=Math.min(a.alpha,b.alpha);if(alpha<=.025)continue;const h1=Math.max(1.5,a.half*(material.elevated?.17:.12)),h2=Math.max(1.2,b.half*(material.elevated?.17:.12));ctx.save();ctx.globalAlpha=alpha;poly([[a.x,a.y-h1],[a.x,a.y-h1*.43],[b.x,b.y-h2*.43],[b.x,b.y-h2]],color);poly([[a.x,a.y-h1],[a.x,a.y-h1*.82],[b.x,b.y-h2*.82],[b.x,b.y-h2]],material.elevated?'rgba(244,204,126,.5)':'rgba(255,255,255,.68)');if(i%6===0){ctx.strokeStyle=material.elevated?'#342319':'#743453';ctx.lineWidth=Math.max(1,a.half*.018);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(a.x,a.y-h1*.88);ctx.stroke()}ctx.restore();drawn++;if(profile1.corridors.length>1)splitDrawn++}
  }const currentProfile=trackBoundaryProfileAt(state.distance),currentBoundary=selectedBoundaryCorridor(currentProfile);canvas.dataset.guardrailModel=GUARDRAIL_GEOMETRY_MODEL;canvas.dataset.guardrailEdgeSource=COURSE_GEOMETRY_MODEL;canvas.dataset.guardrailSegments=String(drawn);canvas.dataset.guardrailSplitSegments=String(splitDrawn);canvas.dataset.guardrailCollisionModel=GUARDRAIL_GEOMETRY_MODEL;canvas.dataset.guardrailCollisionCorridor=currentBoundary.id;canvas.dataset.guardrailCollisionLeft=currentBoundary.collisionLeft.toFixed(3);canvas.dataset.guardrailCollisionRight=currentBoundary.collisionRight.toFixed(3);canvas.dataset.guardrailRailLeft=currentBoundary.railLeft.toFixed(3);canvas.dataset.guardrailRailRight=currentBoundary.railRight.toFixed(3);canvas.dataset.guardrailRoadLeft=currentBoundary.roadLeft.toFixed(3);canvas.dataset.guardrailRoadRight=currentBoundary.roadRight.toFixed(3)
}
function drawTunnelPanelPattern(profile,p,top,left,right,panel){
  const u=Math.max(1,p.half*.018),midY=top+p.half*.43,leftX=p.cx-p.half*1.075,rightX=p.cx+p.half*1.075;ctx.save();ctx.globalAlpha=.5;ctx.strokeStyle=profile.trim;ctx.fillStyle=panel%2?profile.lamp:profile.lamp2;ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=Math.max(2,p.half*.045);ctx.lineWidth=Math.max(1,u);
  if(profile.pattern==='sprinkles'){for(let k=-3;k<=3;k++){ctx.save();ctx.translate(p.cx+k*p.half*.2,top+p.half*(.2+(Math.abs(k)%2)*.12));ctx.rotate(k*.45);ctx.fillRect(-u*.45,-u*1.8,u*.9,u*3.6);ctx.restore()}}
  else if(profile.pattern==='rivets'){for(const x of[leftX,rightX])for(const y of[midY,midY+p.half*.28]){ctx.beginPath();ctx.arc(x,y,u*1.6,0,Math.PI*2);ctx.fill()}ctx.beginPath();ctx.moveTo(leftX,midY);ctx.lineTo(leftX+p.half*.16,midY-p.half*.12);ctx.moveTo(rightX,midY);ctx.lineTo(rightX-p.half*.16,midY-p.half*.12);ctx.stroke()}
  else if(profile.pattern==='circuit'){ctx.beginPath();ctx.moveTo(leftX,midY);ctx.lineTo(p.cx-p.half*.35,midY);ctx.lineTo(p.cx-p.half*.2,top+p.half*.18);ctx.lineTo(p.cx+p.half*.22,top+p.half*.18);ctx.lineTo(p.cx+p.half*.36,midY);ctx.lineTo(rightX,midY);ctx.stroke();for(const x of[p.cx-p.half*.2,p.cx+p.half*.22]){ctx.beginPath();ctx.arc(x,top+p.half*.18,u*2,0,Math.PI*2);ctx.fill()}}
  else if(profile.pattern==='rain'){for(const side of[-1,1])for(let k=0;k<3;k++){const x=p.cx+side*p.half*(.92+k*.08);ctx.beginPath();ctx.moveTo(x,top+p.half*(.18+k*.08));ctx.lineTo(x-side*u*2,top+p.half*(.42+k*.08));ctx.stroke()}}
  else if(profile.pattern==='royal'){for(const x of[leftX,rightX]){ctx.beginPath();ctx.moveTo(x,midY-u*5);ctx.lineTo(x+u*4,midY);ctx.lineTo(x,midY+u*5);ctx.lineTo(x-u*4,midY);ctx.closePath();ctx.fill()}}
  else if(profile.pattern==='facets'){ctx.beginPath();ctx.moveTo(p.cx-p.half*.55,top+p.half*.22);ctx.lineTo(p.cx,top+p.half*.02);ctx.lineTo(p.cx+p.half*.55,top+p.half*.22);ctx.lineTo(p.cx,top+p.half*.42);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(p.cx,top+p.half*.02);ctx.lineTo(p.cx,top+p.half*.42);ctx.stroke()}
  else if(profile.pattern==='vines'){for(const side of[-1,1]){ctx.beginPath();ctx.moveTo(p.cx+side*p.half*.92,top);ctx.bezierCurveTo(p.cx+side*p.half*1.12,top+p.half*.22,p.cx+side*p.half*.88,top+p.half*.45,p.cx+side*p.half*1.06,top+p.half*.72);ctx.stroke()}}
  else if(profile.pattern==='petals'){for(let k=-3;k<=3;k++){ctx.save();ctx.translate(p.cx+k*p.half*.19,top+p.half*(.18+(k*k%3)*.09));ctx.rotate(k*.6);ctx.scale(1,.55);ctx.beginPath();ctx.arc(0,0,u*2.2,0,Math.PI*2);ctx.fill();ctx.restore()}}
  else if(profile.pattern==='bubbles'){for(const side of[-1,1])for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(p.cx+side*p.half*(.92+k*.07),top+p.half*(.25+k*.15),u*(1.5+k*.7),0,Math.PI*2);ctx.stroke()}}
  else if(profile.pattern==='marquee'){for(let k=-5;k<=5;k++){ctx.beginPath();ctx.arc(p.cx+k*p.half*.16,top+p.half*(.11+Math.abs(k)*.025),u*1.35,0,Math.PI*2);ctx.fill()}}
  else if(profile.pattern==='orbit'){ctx.beginPath();ctx.ellipse(p.cx,top+p.half*.25,p.half*.5,p.half*.14,-.12,0,Math.PI*2);ctx.stroke();for(const x of[p.cx-p.half*.44,p.cx+p.half*.46]){ctx.beginPath();ctx.arc(x,top+p.half*.25,u*1.7,0,Math.PI*2);ctx.fill()}}
  ctx.restore();
}
function drawTunnelInteriorMotif(profile,distance,p,top,panel){
  const frame=tunnelInteriorFrames[Math.min(tunnelInteriorFrames.length-1,state.selectedCourse)];if(!frame||panel%profile.panelEvery!==0)return 0;const sides=effectiveRichScenery()?[-1,1]:[panel%2?-1:1],rel=distance-state.distance,alpha=distanceFadeAlpha(rel,420,760)*(rel<12?clamp(rel/12,0,1):1);let drawn=0;
  for(const side of sides){const height=Math.max(8,Math.min(innerHeight*.17,p.half*.43)),x=p.cx+side*p.half*1.055,y=top+p.half*.76;drawThroughTunnelPortal(distance,()=>drawFrameHeightFiltered(frame,x,y,height,alpha*.82,side*.045,sceneryFilter(rel)));drawn++}
  return drawn;
}
function drawTunnel(){
  const theme=activeCourse.theme,jungle=!!activeCourse?.immersiveJungle,profile=TUNNEL_INTERIOR_PROFILES[state.selectedCourse]||TUNNEL_INTERIOR_PROFILES[0],tunnelPaint={side:profile.side,side2:profile.side2,roof:profile.roof};let inside=false,lastPanel=-1,motifCount=0;
  const phase=trackPhase(state.distance);
  for(const [start,end] of tunnelSections){for(const boundary of [start,end]){const rel=(boundary-phase+TRACK_LENGTH)%TRACK_LENGTH;if(rel<7||rel>DRAW_DISTANCE)continue;drawTunnelPortalFrame(state.distance+rel,.82)}}
  for(let i=ROAD_SEGMENTS-1;i>=0;i--){const p1=roadProjection[i],p2=roadProjection[i+1],distance1=state.distance+p1.rel,distance2=state.distance+p2.rel,distance=(distance1+distance2)*.5,continuity=tunnelContinuityAt(distance);if(!p1.visible||!continuity||continuity.blend<=.01)continue;inside=true;const cross1=tunnelCrossSection(p1,distance1),cross2=tunnelCrossSection(p2,distance2),left1=cross1.left,right1=cross1.right,left2=cross2.left,right2=cross2.right,top1=cross1.top,top2=cross2.top,panel=Math.floor(distance/34),alternate=panel%2===0,depthShade=Math.min(.32,.08+p1.rel/DRAW_DISTANCE*.22);
    ctx.save();ctx.globalAlpha=continuity.blend;
    poly([[left1,p1.y],[cross1.arch[0].x,cross1.arch[0].y],[cross2.arch[0].x,cross2.arch[0].y],[left2,p2.y]],alternate?colorAlpha(tunnelPaint.side,.98):tunnelPaint.side);
    const last=cross1.arch.length-1;poly([[cross1.arch[last].x,cross1.arch[last].y],[right1,p1.y],[right2,p2.y],[cross2.arch[last].x,cross2.arch[last].y]],alternate?tunnelPaint.side2:colorAlpha(tunnelPaint.side2,.94));
    for(let facet=0;facet<last;facet++){const a1=cross1.arch[facet],b1=cross1.arch[facet+1],a2=cross2.arch[facet],b2=cross2.arch[facet+1],center=facet/(last-1),edge=Math.abs(center-.5)*2,light=.02+(1-edge)*.045+(alternate?.018:0),shade=facet>last*.5?`rgba(0,0,0,${.12+depthShade*.45})`:colorAlpha(tunnelPaint.roof,.94);poly([[a1.x,a1.y],[b1.x,b1.y],[b2.x,b2.y],[a2.x,a2.y]],shade);if(facet%2===0)poly([[a1.x,a1.y],[b1.x,b1.y],[b2.x,b2.y],[a2.x,a2.y]],`rgba(255,255,255,${light})`)}
    for(const side of[-1,1]){const x1=p1.cx+side*p1.half*1.01,x2=p2.cx+side*p2.half*1.01,edge1=p1.half*.035,edge2=p2.half*.035;poly([[x1-side*edge1,p1.y],[x1+side*edge1,p1.y],[x2+side*edge2,p2.y],[x2-side*edge2,p2.y]],side<0?'rgba(255,255,255,.12)':'rgba(0,0,0,.24)')}
    if(panel!==lastPanel){lastPanel=panel;const color=panel%2?profile.lamp:profile.lamp2;ctx.save();ctx.lineWidth=Math.max(1.5,p1.half*.026);ctx.shadowColor=color;ctx.shadowBlur=Math.max(3,p1.half*.07);strokeTunnelRib(p1,distance1,profile.trim,.66);ctx.restore();drawTunnelPanelPattern(profile,p1,top1,left1,right1,panel);motifCount+=drawTunnelInteriorMotif(profile,distance,p1,top1,panel);const poolAlpha=.035+Math.min(.14,p1.scale*.36);poly([[p1.cx-p1.half*.72,p1.y],[p1.cx+p1.half*.72,p1.y],[p2.cx+p2.half*.34,p2.y],[p2.cx-p2.half*.34,p2.y]],colorAlpha(profile.lamp2,poolAlpha))}
    if(panel%3===0){const lampW=p1.half*(jungle?.15:.3),lampH=Math.max(1.5,p1.half*.035);ctx.save();ctx.fillStyle=panel%2?profile.lamp:profile.lamp2;ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=Math.max(5,p1.half*(jungle?.18:.12));ctx.globalAlpha=.9;ctx.beginPath();ctx.roundRect(p1.cx-lampW/2,top1+p1.half*.07,lampW,lampH,lampH*.5);ctx.fill();ctx.restore()}
    ctx.restore()}
  const section=tunnelSectionAt(state.distance);if(section){const phase=trackPhase(state.distance),edge=Math.max(0,Math.min(1,Math.min((phase-section[0])/42,(section[1]-phase)/42))),shade=ctx.createRadialGradient(innerWidth*.5,innerHeight*.64,innerWidth*.1,innerWidth*.5,innerHeight*.52,innerWidth*.75);shade.addColorStop(0,`rgba(20,10,45,${.06*edge})`);shade.addColorStop(1,`rgba(8,4,25,${.72*edge})`);ctx.fillStyle=shade;ctx.fillRect(0,0,innerWidth,innerHeight);const exitDistance=section[1]-phase;if(exitDistance<78){const p=roadPoint(Math.max(8,exitDistance)),radius=Math.max(45,p.half*1.7),glow=ctx.createRadialGradient(p.cx,p.y-p.half*.28,0,p.cx,p.y-p.half*.28,radius);glow.addColorStop(0,`rgba(255,255,245,${.62*(1-exitDistance/78)})`);glow.addColorStop(.35,`rgba(157,243,255,${.24*(1-exitDistance/78)})`);glow.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=glow;ctx.fillRect(p.cx-radius,p.y-radius,radius*2,radius*2)}}
  canvas.dataset.tunnel=inside?'visible':'none';canvas.dataset.tunnelInteriorTheme=profile.id;canvas.dataset.tunnelInteriorPattern=profile.pattern;canvas.dataset.tunnelInteriorAsset=tunnelInteriorFrames.length?'gpt-image-2-atlas-v1':'procedural-fallback';canvas.dataset.tunnelInteriorMotifs=String(motifCount);canvas.dataset.tunnelGeometry='arched-faceted-continuous-v2';
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
  const drawAsset=(asset,z,p,side,size=1,extraOffset=0)=>{
    const rel=z-state.distance,height=Math.max(13,Math.min(innerHeight*.38,asset.height*p.scale*size)),rawX=p.cx+side*p.half*(asset.offset+extraOffset+(size<1?.12:0)),x=rel<48?Math.max(-height*.32,Math.min(innerWidth+height*.32,rawX)):rawX;if(x<-height*1.35||x>innerWidth+height*1.35)return;
    const visible=sceneryVisibilityAlpha(rel,'near');if(visible<=.025)return;let frame=null,groundPad=.045;
    if(asset.kind==='spectator'){const viewTurn=Math.max(-3,Math.min(3,Math.round(-side*1.7+p.tangent*5))),frameIndex=viewTurn<=-3?0:viewTurn>=3?6:10+viewTurn,frames=spectatorFrameSets[asset.spectator];frame=frames?.[frameIndex];groundPad=sceneryFrameGroundPad(frame);canvas.dataset.spectatorFrame=String(frameIndex);canvas.dataset.spectatorCharacter=spectatorSlugs[asset.spectator]}
    const groundY=p.y+height*groundPad;ctx.save();ctx.globalAlpha=.32*visible;ctx.fillStyle='rgba(18,8,38,.34)';ctx.beginPath();ctx.ellipse(x,groundY,Math.max(5,height*.3),Math.max(2,height*.055),0,0,Math.PI*2);ctx.fill();ctx.restore();
    if(frame)drawGroundedSceneryFrame(frame,x,p.y,height,rel,1,0,'none','near');else if(asset.image.complete&&asset.image.naturalWidth){recordSceneryDraw({groundPad},p.y,groundY,height,rel,visible,'near');ctx.save();ctx.globalAlpha=visible;const width=height*asset.image.naturalWidth/Math.max(1,asset.image.naturalHeight);ctx.drawImage(asset.image,x-width*.5,groundY-height,width,height);ctx.restore();canvas.dataset.courseProp=`${propTheme}-${asset.prop}`}
  };
  for(let i=props.length-1;i>=0;i--){const z=props[i],rel=z-state.distance,p=roadPoint(rel);if(!p.visible||tunnelAt(z)||!assets.length)continue;const slot=Math.abs(Math.floor((z-phase)/spacing)),index=slot%assets.length,side=slot%2?1:-1;drawAsset(assets[index],z,p,side,1);if(slot%3===0)drawAsset(assets[(index+3)%assets.length],z+2,p,-side,.78,.18);if(rich&&slot%4===1)drawAsset(assets[(index+5)%assets.length],z+5,p,side,.62,.46)}
}
function drawDistantScenery(){
  if(biomeVolumeFrames(state.selectedCourse,'far').length){drawBiomeVolume('far');return}
  const themed=courseSceneryFrames[state.selectedCourse]||[],fallback=state.selectedCourse===3?forestSceneryFrames:[...candySceneryFrames,...forestSceneryFrames.slice(0,4)],frames=themed.length?themed:fallback;if(!frames.length){canvas.dataset.sceneryCount='0';return}
  const rich=effectiveRichScenery(),density=rich?.62/Math.max(.4,performanceProfile().scenery):1.18,clarity=rich?1:.72,depth=COURSE_DEPTH_PROFILES[state.selectedCourse]||COURSE_DEPTH_PROFILES[0];
  const layerConfigs=rich?[
    {row:0,depth:'far',spacing:178*density,phase:43,offset:3.0,base:1260,scale:.52,alpha:.42*clarity},
    {row:1,depth:'mid',spacing:132*density,phase:71,offset:2.7,base:1140,scale:.68,alpha:.62*clarity},
    {row:2,depth:'near',spacing:92*density,phase:29,offset:2.42,base:930,scale:.92,alpha:1},
    {row:1,depth:'mid',spacing:70*density,phase:11,offset:2.58,base:860,scale:.74,alpha:.7}
  ]:[
    {row:0,depth:'far',spacing:168*density,phase:43,offset:2.78,base:1180,scale:.64,alpha:.52*clarity},
    {row:1,depth:'mid',spacing:124*density,phase:71,offset:2.52,base:1040,scale:.8,alpha:.74*clarity},
    {row:2,depth:'near',spacing:86*density,phase:29,offset:2.32,base:850,scale:.95,alpha:1}
  ];
  for(const layer of layerConfigs){const band=layer.row===0?depth.far:layer.row===1?depth.mid:depth.near;layer.spacing/=band.density;layer.scale*=band.scale;layer.alpha*=band.alpha;layer.pairEvery=Math.max(2,Math.round(3.2/band.density))}
  let drawn=0;
  const frameAt=(row,slot)=>themed.length?frames[row*4+slot%4]:frames[(slot+row*2)%frames.length];
  const drawLayerProp=(frame,p,rel,side,slot,layer)=>{if(!frame)return;const height=Math.max(8,Math.min(innerHeight*.5,layer.base*p.scale*layer.scale)),x=p.cx+side*p.half*(layer.offset+(slot%3)*.08);if(x<-height*1.15||x>innerWidth+height*1.15)return;const visibility=sceneryVisibilityAlpha(rel,layer.depth,layer.alpha),groundY=sceneryGroundY(p.y,height,frame);if(visibility<=.025)return;ctx.save();ctx.globalAlpha=.18+visibility*.12;ctx.fillStyle=rich?'rgba(13,9,29,.74)':'rgba(13,9,29,.6)';ctx.beginPath();ctx.ellipse(x,groundY,Math.max(5,height*.33),Math.max(2,height*.052),0,0,Math.PI*2);ctx.fill();ctx.restore();drawGroundedSceneryFrame(frame,x,p.y,height,rel,layer.alpha,0,sceneryFilter(rel),layer.depth);if(rich&&rel<280&&layer.row===2){ctx.save();ctx.globalAlpha=.18;ctx.strokeStyle=activeCourse.theme.lightB;ctx.lineWidth=Math.max(1,height*.012);ctx.shadowColor=activeCourse.theme.lightB;ctx.shadowBlur=Math.max(4,height*.045);ctx.beginPath();ctx.ellipse(x,groundY-height*.42,height*.42,height*.33,0,0,Math.PI*2);ctx.stroke();ctx.restore()}drawn++};
  for(const layer of layerConfigs){const phase=layer.phase+state.selectedCourse*17,first=Math.ceil((state.distance+30-phase)/layer.spacing)*layer.spacing+phase,placements=[];for(let z=first;z<state.distance+DRAW_DISTANCE;z+=layer.spacing)placements.push(z);for(let i=placements.length-1;i>=0;i--){const z=placements[i],rel=z-state.distance,p=roadPoint(rel);if(!p.visible||tunnelAt(z))continue;const slot=Math.abs(Math.floor((z-phase)/layer.spacing)),side=slot%2?1:-1;drawLayerProp(frameAt(layer.row,slot),p,rel,side,slot,layer);if((rich&&slot%layer.pairEvery===0)||(!rich&&layer.row>0&&slot%(layer.pairEvery+2)===0))drawLayerProp(frameAt(layer.row,slot+2),p,rel,-side,slot,{...layer,scale:layer.scale*(rich?0.64:0.58),offset:layer.offset+(rich?0.22:0.18),alpha:layer.alpha*(rich?0.68:0.52)})}}
  canvas.dataset.sceneryCount=String(drawn);canvas.dataset.sceneryLayers=themed.length?'course-atlas':'fallback';canvas.dataset.sceneryDepthTheme=depth.id;canvas.dataset.sceneryDepthDensity=`${depth.far.density.toFixed(2)}/${depth.mid.density.toFixed(2)}/${depth.near.density.toFixed(2)}`;
}
function drawCourseNearScenery(){
  if(canvas.dataset.biomeVolumeSystem==='all-course-zoned-cluster-lod-v2')return;
  if(activeCourse?.immersiveJungle){canvas.dataset.courseNearProps='jungle-dedicated';return}
  const profile=COURSE_NEAR_PROFILES[state.selectedCourse],dedicated=dedicatedNearFrames[state.selectedCourse]?.length>0,frames=dedicated?dedicatedNearFrames[state.selectedCourse]:(courseSceneryFrames[state.selectedCourse]||[]),framePool=dedicated?frames.map((_,index)=>index):profile?.frames;if(!profile||!frames.length||!framePool?.length){canvas.dataset.courseNearProps='0';return}
  const rich=effectiveRichScenery(),spacing=profile.spacing*(rich?1:1.42)/Math.max(.68,performanceProfile().scenery),phase=34+state.selectedCourse*19,first=Math.ceil((state.distance+18-phase)/spacing)*spacing+phase,placements=[];
  for(let z=first;z<state.distance+DRAW_DISTANCE-12;z+=spacing)placements.push(z);placements.sort((a,b)=>b-a);let drawn=0;
  const drawProp=(z,side,frameIndex,size=1,extra=.0)=>{const rel=z-state.distance,p=roadPoint(rel),frame=frames[frameIndex];if(!p.visible||!frame||tunnelAt(z))return;const base=dedicated?(frameIndex<4?930:frameIndex<8?800:640):(frameIndex<8?880:650),height=Math.max(12,Math.min(innerHeight*.48,base*p.scale*profile.scale*size*1.28)),rawX=p.cx+side*p.half*(profile.offset+extra),x=rel<62?clamp(rawX,-height*.28,innerWidth+height*.28):rawX;if(x<-height*1.2||x>innerWidth+height*1.2)return;const alpha=sceneryVisibilityAlpha(rel,'near'),groundY=sceneryGroundY(p.y,height,frame);if(alpha<.025)return;ctx.save();ctx.globalAlpha=.2*alpha;ctx.fillStyle='rgba(9,7,24,.72)';ctx.beginPath();ctx.ellipse(x,groundY,Math.max(5,height*.3),Math.max(2,height*.052),0,0,Math.PI*2);ctx.fill();ctx.restore();drawThroughTunnelPortal(z,()=>drawGroundedSceneryFrame(frame,x,p.y,height,rel,1,0,sceneryFilter(rel),'near'));drawn++};
  for(const z of placements){const slot=Math.abs(Math.floor((z-phase)/spacing)),side=slot%2?1:-1,frameIndex=framePool[slot%framePool.length];drawProp(z,side,frameIndex);if(rich&&slot%3===1)drawProp(z+3,-side,framePool[(slot+3)%framePool.length],.68,.28)}
  canvas.dataset.courseNearProps=String(drawn);canvas.dataset.courseNearTheme=courseScenerySlugs[state.selectedCourse]||'debug';canvas.dataset.courseNearAsset=dedicated?'gpt-image-2-dedicated-near-v1':'gpt-image-2-course-atlas';
}
const JUNGLE_SIGNATURE_SCENERY=[
  [62,-1,0,900,2.46],[116,1,3,650,2.5],[188,-1,8,720,2.38],[238,1,11,460,2.34],
  [505,-1,5,820,2.72],[566,1,2,760,2.42],[848,-1,0,940,2.5],[914,1,6,720,2.58],
  [987,-1,10,610,2.46],[1235,1,5,900,2.74],[1302,-1,4,660,2.62],[1392,1,9,640,2.44],
  [1468,-1,6,760,2.55],[1545,1,10,650,2.48],[1668,-1,8,820,2.42],[1742,1,11,500,2.34]
];
function drawBiomeVolume(layer){
  const index=state.selectedCourse,profile=BIOME_VOLUME_PROFILES[index]||BIOME_VOLUME_PROFILES[0],frames=biomeVolumeFrames(index,layer);
  if(!frames.length){if(layer==='far'){canvas.dataset.biomeVolumeSystem='off';canvas.dataset.biomeVolumeClusters='0'}return}
  const rich=effectiveRichScenery(),performance=performanceProfile().scenery,length=raceLength(),zones=biomeVolumeZones(index,length),clusters=biomeVolumeClusters(index,length),firstLap=Math.max(0,Math.floor((state.distance-DRAW_DISTANCE)/length)),lastLap=Math.ceil((state.distance+DRAW_DISTANCE)/length),entries=[];
  for(let lap=firstLap;lap<=lastLap;lap++){const base=lap*length;for(const cluster of clusters)for(const prop of cluster.props){if(prop.layer!==layer||(!rich&&layer==='near'&&(prop.scale<.72||Math.floor(cluster.anchor)%2)))continue;const z=base+cluster.anchor+prop.zOffset,rel=z-state.distance;if(rel<5||rel>DRAW_DISTANCE-10||tunnelAt(z))continue;const p=roadPoint(rel);if(!p.visible)continue;entries.push({cluster,prop,z,rel,p})}}
  entries.sort((a,b)=>b.rel-a.rel);let drawn=0;for(const entry of entries){const{cluster,prop,rel,p}=entry,frame=frames[prop.frame%frames.length];if(!frame)continue;const zone=zones[cluster.zoneIndex%zones.length],baseHeight=(layer==='far'?1370:layer==='mid'?940:700)*(index===6?1.08:1),cap=layer==='far'?.6:layer==='mid'?.54:.46,height=Math.max(10,Math.min(innerHeight*cap,baseHeight*p.scale*prop.scale*(.7+performance*.3))),rawX=p.cx+prop.side*p.half*prop.offset,x=rel<58?clamp(rawX,-height*.3,innerWidth+height*.3):rawX,width=height*frame.sw/Math.max(1,frame.sh);if(x<-width||x>innerWidth+width)continue;const groundY=sceneryGroundY(p.y,height,frame),alpha=sceneryVisibilityAlpha(rel,layer);if(alpha<.025)continue;
    if(layer!=='far'){ctx.save();ctx.globalAlpha=alpha*(layer==='near'?.3:.2);ctx.fillStyle=colorAlpha(profile.shade,layer==='near'?.9:.72);ctx.beginPath();ctx.ellipse(x,groundY,Math.max(4,width*.32),Math.max(1.5,height*.052),0,0,Math.PI*2);ctx.fill();ctx.restore()}drawThroughTunnelPortal(entry.z,()=>drawGroundedSceneryFrame(frame,x,p.y,height,rel,1,0,sceneryFilter(rel),layer));drawn++
  }
  canvas.dataset.biomeVolumeSystem='all-course-zoned-cluster-lod-v2';canvas.dataset.biomeVolumeCourse=profile.id;canvas.dataset.biomeVolumeSeed=String(profile.seed);canvas.dataset.biomeVolumeZones=String(zones.length);canvas.dataset.biomeVolumeLayers='far,mid,near,canopy,atmosphere';canvas.dataset[`biomeVolume${layer[0].toUpperCase()+layer.slice(1)}`]=String(drawn);canvas.dataset.biomeVolumeClusters=String((Number(canvas.dataset.biomeVolumeFar)||0)+(Number(canvas.dataset.biomeVolumeMid)||0)+(Number(canvas.dataset.biomeVolumeNear)||0));canvas.dataset.biomeVolumeZone=biomeVolumeZoneAt().id;canvas.dataset.biomeVolumeAsset=layer==='far'?'gpt-image-2-course-atlas':dedicatedNearFrames[index]?.length?'gpt-image-2-dedicated-near-atlas':index===6?'gpt-image-2-jungle-near-atlas':'gpt-image-2-course-atlas';
  if(layer==='mid'){canvas.dataset.courseNearProps=String(drawn);canvas.dataset.courseNearTheme=profile.id;canvas.dataset.courseNearAsset=dedicatedNearFrames[index]?.length?'gpt-image-2-dedicated-near-v1':index===6?'gpt-image-2-jungle-near-v1':'gpt-image-2-course-atlas';if(index===6){canvas.dataset.jungleNearScenery=String(drawn);canvas.dataset.jungleNearAsset='gpt-image-2-atlas-v1'}}
  if(layer==='far'){canvas.dataset.sceneryCount=String(drawn);canvas.dataset.sceneryLayers='biome-volume-clusters-v2';canvas.dataset.sceneryDepthTheme=profile.id;const depth=COURSE_DEPTH_PROFILES[index]||COURSE_DEPTH_PROFILES[0];canvas.dataset.sceneryDepthDensity=`${depth.far.density.toFixed(2)}/${depth.mid.density.toFixed(2)}/${depth.near.density.toFixed(2)}`}
}
function biomeZoneLandmarkDistance(base,zone){
  const origin=base+zone.start+12,offsets=[0,18,36,54,72,90,108];for(const offset of offsets){const z=origin+offset;if(!tunnelAt(z))return z}return origin
}
function drawBiomeZoneLandmarks(){
  const index=state.selectedCourse,profile=BIOME_VOLUME_PROFILES[index],frames=biomeVolumeFrames(index,'mid');if(!profile||!frames.length){canvas.dataset.biomeLandmarkModel='off';canvas.dataset.biomeLandmarkVisible='0';return}
  const length=raceLength(),zones=biomeVolumeZones(index,length),firstLap=Math.max(0,Math.floor((state.distance-DRAW_DISTANCE)/length)),lastLap=Math.ceil((state.distance+DRAW_DISTANCE)/length),entries=[];
  for(let lap=firstLap;lap<=lastLap;lap++){const base=lap*length;for(let zoneIndex=0;zoneIndex<zones.length;zoneIndex++){const zone=zones[zoneIndex],z=biomeZoneLandmarkDistance(base,zone),rel=z-state.distance;if(rel<7||rel>DRAW_DISTANCE-9)continue;const p=roadPoint(rel);if(!p.visible)continue;entries.push({zone,zoneIndex,z,rel,p})}}
  entries.sort((a,b)=>b.rel-a.rel);let drawn=0,next=null;for(const entry of entries){const{zone,zoneIndex,z,rel,p}=entry,primaryCount=index===6?Math.min(8,frames.length):Math.min(4,frames.length),primary=frames[zoneIndex%Math.max(1,primaryCount)],secondary=frames[(4+zoneIndex*2)%frames.length]||primary;if(!primary)continue;const geometry=routeGeometryAt(z),outer=geometry?.dual?Math.max(...Object.values(geometry.branches).map(path=>Math.abs(path.visualCenter)+path.visualHalf)):1,offset=2.54+Math.max(0,outer-1)*1.08+(zoneIndex%2)*.08,alpha=sceneryVisibilityAlpha(rel,'mid');if(alpha<.025)continue;
    const landmarkSide=zoneIndex%2?1:-1,props=[{frame:primary,side:landmarkSide,base:1450,scale:1.08},{frame:secondary,side:-landmarkSide,base:980,scale:.88}];for(const prop of props){const height=Math.max(14,Math.min(innerHeight*.7,prop.base*p.scale*prop.scale)),width=height*prop.frame.sw/Math.max(1,prop.frame.sh),x=p.cx+prop.side*p.half*offset,groundY=sceneryGroundY(p.y,height,prop.frame);if(x<-width||x>innerWidth+width)continue;ctx.save();ctx.globalCompositeOperation='screen';const beam=ctx.createLinearGradient(x,groundY-height*.96,x,groundY);beam.addColorStop(0,colorAlpha(zone.fog,0));beam.addColorStop(.72,colorAlpha(zone.fog,alpha*.09));beam.addColorStop(1,colorAlpha(zone.fog,0));ctx.fillStyle=beam;ctx.fillRect(x-Math.max(2,width*.17),groundY-height,width*.34,height);ctx.restore();ctx.save();ctx.globalAlpha=alpha*.28;ctx.fillStyle=colorAlpha(profile.shade,.86);ctx.beginPath();ctx.ellipse(x,groundY,Math.max(5,width*.35),Math.max(2,height*.055),0,0,Math.PI*2);ctx.fill();ctx.restore();drawThroughTunnelPortal(z,()=>drawGroundedSceneryFrame(prop.frame,x,p.y,height,rel,1,0,sceneryFilter(rel),'mid'));drawn++}
    if(next===null||rel<next.rel)next={rel,zone:zone.id,frame:zoneIndex%Math.max(1,primaryCount)}
  }
  canvas.dataset.biomeLandmarkModel='zone-paired-gpt2-landmarks-v1';canvas.dataset.biomeLandmarkVisible=String(drawn);canvas.dataset.biomeLandmarkCourse=profile.id;canvas.dataset.biomeLandmarkZone=next?.zone||biomeVolumeZoneAt().id;canvas.dataset.biomeLandmarkFrame=String(next?.frame??-1);canvas.dataset.biomeLandmarkDistance=next?next.rel.toFixed(1):'none';canvas.dataset.biomeLandmarkAsset=index===6?'gpt-image-2-jungle-near-atlas':'gpt-image-2-dedicated-near-atlas'
}
function drawBiomeZoneLightShift(){
  const{zone,mix}=updateBiomeZoneTransition(0),ease=mix*mix*(3-2*mix),transition=1-ease,tunnelFactor=tunnelAt(state.distance)?.22:1,effectsFactor=settings.reducedEffects?.72:1,fromAlpha=(.018+transition*.052)*tunnelFactor*effectsFactor,toAlpha=(.026+ease*.018)*tunnelFactor*effectsFactor,horizon=innerHeight*.3;
  ctx.save();ctx.globalCompositeOperation='screen';let glow=ctx.createLinearGradient(0,0,0,innerHeight);glow.addColorStop(0,colorAlpha(biomeZoneTransition.fromColor,fromAlpha));glow.addColorStop(.48,colorAlpha(biomeZoneTransition.fromColor,fromAlpha*.42));glow.addColorStop(1,colorAlpha(biomeZoneTransition.fromColor,0));ctx.fillStyle=glow;ctx.fillRect(0,0,innerWidth,innerHeight);glow=ctx.createRadialGradient(innerWidth*.5,horizon,0,innerWidth*.5,horizon,Math.max(innerWidth,innerHeight)*.72);glow.addColorStop(0,colorAlpha(zone.fog,toAlpha));glow.addColorStop(.52,colorAlpha(zone.fog,toAlpha*.46));glow.addColorStop(1,colorAlpha(zone.fog,0));ctx.fillStyle=glow;ctx.fillRect(0,0,innerWidth,innerHeight);ctx.restore();canvas.dataset.biomeLightModel='zone-color-crossfade-v1';canvas.dataset.biomeLightColor=zone.fog;canvas.dataset.biomeLightMix=ease.toFixed(3);canvas.dataset.biomeLightAlpha=(fromAlpha+toAlpha).toFixed(3)
}
function drawJungleBiomeVolume(layer){drawBiomeVolume(layer)}
function drawJungleNearScenery(){
  if(biomeVolumeFrames(state.selectedCourse,'mid').length){drawBiomeVolume('mid');return}
  if(!activeCourse?.immersiveJungle||!jungleNearFrames.length){canvas.dataset.jungleNearScenery='0';return}const rich=effectiveRichScenery(),length=raceLength(),firstLap=Math.max(0,Math.floor((state.distance-DRAW_DISTANCE)/length)),lastLap=Math.ceil((state.distance+DRAW_DISTANCE)/length),placements=[];
  for(let lap=firstLap;lap<=lastLap;lap++){const base=lap*length;for(const [phase,side,frame,height,offset]of JUNGLE_SIGNATURE_SCENERY){const z=base+phase,rel=z-state.distance;if(rel>8&&rel<DRAW_DISTANCE-16)placements.push({z,rel,side,frame,height,offset,signature:true})}const spacing=rich?54:92,first=Math.ceil((Math.max(state.distance+18,base)-base)/spacing)*spacing;for(let phase=first;phase<length&&base+phase<state.distance+DRAW_DISTANCE;phase+=spacing){if(JUNGLE_SIGNATURE_SCENERY.some(entry=>Math.abs(entry[0]-phase)<25))continue;const slot=Math.floor(phase/spacing),frames=rich?[0,3,8,9,11]:[0,3,8],frame=frames[slot%frames.length],side=slot%2?1:-1;placements.push({z:base+phase,rel:base+phase-state.distance,side,frame,height:frame===0?760:frame===8?640:460,offset:2.45+(slot%3)*.1,signature:false})}}
  placements.sort((a,b)=>b.rel-a.rel);let drawn=0;for(const entry of placements){if(tunnelAt(entry.z))continue;const p=roadPoint(entry.rel),frame=jungleNearFrames[entry.frame];if(!p.visible||!frame)continue;const perspectiveBoost=entry.signature?1.55:1.3,height=Math.max(12,Math.min(innerHeight*(entry.signature?.74:.62),entry.height*p.scale*perspectiveBoost)),rawX=p.cx+entry.side*p.half*entry.offset,x=entry.rel<68?clamp(rawX,-height*.24,innerWidth+height*.24):rawX;if(x<-height*1.2||x>innerWidth+height*1.2)continue;const groundY=sceneryGroundY(p.y,height,frame),alpha=sceneryVisibilityAlpha(entry.rel,'near');if(alpha<.025)continue;ctx.save();ctx.globalAlpha=.2*alpha;ctx.fillStyle='rgba(6,19,13,.78)';ctx.beginPath();ctx.ellipse(x,groundY,Math.max(5,height*.3),Math.max(2,height*.05),0,0,Math.PI*2);ctx.fill();ctx.restore();drawThroughTunnelPortal(entry.z,()=>drawGroundedSceneryFrame(frame,x,p.y,height,entry.rel,1,0,sceneryFilter(entry.rel),'near'));drawn++}
  canvas.dataset.jungleNearScenery=String(drawn);canvas.dataset.jungleNearAsset='gpt-image-2-atlas-v1';
}
function drawCourseRouteOcclusionVolume(){
  const graph=activeCourse?.routeGraph,profile=ROUTE_OCCLUSION_PROFILES[state.selectedCourse],jungle=!!profile?.jungle,frames=jungle?jungleNearFrames:(courseSceneryFrames[state.selectedCourse]||[]);if(graph?.geometry?.model!=='dual-corridor-projection-v1'||!profile||!frames.length){canvas.dataset.jungleMedianOcclusion='0';canvas.dataset.routeOcclusionCount='0';canvas.dataset.routeOcclusionModel='off';return}
  const rich=effectiveRichScenery(),length=raceLength(),spacing=profile.spacing*(rich?1:1.62),firstLap=Math.max(0,Math.floor((state.distance-graph.end)/length)),lastLap=Math.ceil((state.distance+DRAW_DISTANCE-graph.start)/length),entries=[];
  for(let lap=firstLap;lap<=lastLap;lap++){const start=lap*length+graph.start+20,end=lap*length+graph.end-17,first=Math.ceil(start/spacing)*spacing;for(let z=first;z<end;z+=spacing){const rel=z-state.distance,median=routeMedianAt(z),p=roadPoint(rel);if(rel<9||rel>DRAW_DISTANCE-12||!p.visible||!median||tunnelAt(z))continue;entries.push({z,rel,p,median,slot:Math.floor(z/spacing)})}}
  entries.sort((a,b)=>b.rel-a.rel);let drawn=0;
  for(const entry of entries){const{p,median,rel,slot}=entry,left=routeCorridorPoint(p,median.left),right=routeCorridorPoint(p,median.right),innerLeft=left.cx+left.half,innerRight=right.cx-right.half,gap=Math.max(0,innerRight-innerLeft);if(gap<5)continue;const center=(innerLeft+innerRight)*.5,groundY=(left.y+right.y)*.5+Math.max(1,p.half*.018),alpha=distanceFadeAlpha(rel,540,805)*(1-sceneryFogAmount(rel)*.11);if(alpha<.04)continue;
    ctx.save();ctx.globalAlpha=alpha*.72;ctx.fillStyle=colorAlpha(activeCourse.theme.vergeB,.9);ctx.beginPath();ctx.ellipse(center,groundY,Math.max(3,gap*.47),Math.max(1.5,p.half*.026),0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=alpha*.32;ctx.strokeStyle=activeCourse.theme.lightA;ctx.lineWidth=Math.max(1,p.half*.012);ctx.beginPath();ctx.ellipse(center,groundY-1,Math.max(3,gap*.43),Math.max(1,p.half*.015),0,0,Math.PI*2);ctx.stroke();ctx.restore();
    const offsets=rich?[-.2,.2]:[0];for(let cluster=0;cluster<offsets.length;cluster++){const frameIndex=profile.frames[(Math.abs(slot)+cluster*2)%profile.frames.length],frame=frames[frameIndex];if(!frame)continue;const ratio=frame.sw/Math.max(1,frame.sh),maxWidth=gap*profile.fill/(rich?1.54:1),height=Math.max(8,Math.min(innerHeight*(jungle ? .7 : .56),maxWidth/Math.max(.28,ratio),p.scale*profile.base*(cluster ? .86 : 1))),width=height*ratio,x=center+gap*offsets[cluster];if(width<4)continue;ctx.save();ctx.globalAlpha=alpha*.3;ctx.fillStyle='rgba(3,6,18,.92)';ctx.beginPath();ctx.ellipse(x,groundY,Math.min(gap*.24,width*.48),Math.max(1.5,height*.05),0,0,Math.PI*2);ctx.fill();ctx.restore();drawGroundedSceneryFrame(frame,x,groundY,height,rel,1,0,sceneryFilter(rel),'near');drawn++}
  }
  canvas.dataset.jungleMedianOcclusion=String(jungle?drawn:0);canvas.dataset.jungleMedianDensity=jungle?(rich?'rich':'light'):'off';canvas.dataset.routeOcclusionCount=String(drawn);canvas.dataset.routeOcclusionModel='themed-dual-corridor-volume-v2';canvas.dataset.routeOcclusionTheme=profile.id;canvas.dataset.routeOcclusionLabel=profile.label;canvas.dataset.routeOcclusionAsset=jungle?'gpt-image-2-jungle-near-atlas':'gpt-image-2-course-atlas'
}
function drawJungleRouteOcclusionVolume(){drawCourseRouteOcclusionVolume()}
function drawJungleCanopyOverlay(){
  const index=state.selectedCourse,profile=BIOME_VOLUME_PROFILES[index]||BIOME_VOLUME_PROFILES[0],frames=biomeVolumeFrames(index,'mid');
  if(!frames.length||tunnelAt(state.distance)){canvas.dataset.jungleCanopy='off';canvas.dataset.biomeVolumeCanopyModel='suppressed-tunnel';return}
  const zone=biomeVolumeZoneAt(),zones=biomeVolumeZones(index),zoneIndex=Math.max(0,zones.findIndex(entry=>entry.id===zone.id)),rich=effectiveRichScenery(),h=innerHeight,w=innerWidth,curve=Math.min(1,Math.abs(state.trackCurve)),speed=Math.min(1,state.speed/190),alpha=(.08+zone.canopy*.15)+curve*.025+speed*.02;
  if(rich){const frameA=zoneIndex%4,frameB=8+(zoneIndex+2)%4,brightness=(index===2||index===9||index===10)?.7:.78;ctx.save();ctx.filter=`saturate(.92) brightness(${brightness})`;for(const[x,frameIndex,height,y,opacity]of[[w*.02,frameA,h*(.25+zone.canopy*.12),h*.22,.82],[w*.2,frameB,h*(.2+zone.canopy*.1),h*.18,.5],[w*.8,frameB,h*(.2+zone.canopy*.1),h*.18,.5],[w*.98,frameA,h*(.25+zone.canopy*.12),h*.22,.82]])drawFrameHeight(frames[frameIndex%frames.length],x,y,height,alpha*opacity);ctx.restore()}
  const shade=ctx.createRadialGradient(w*.5,h*.47,w*.13,w*.5,h*.46,w*.74);shade.addColorStop(0,colorAlpha(profile.shade,0));shade.addColorStop(.64,colorAlpha(profile.shade,.035+zone.canopy*.035));shade.addColorStop(1,colorAlpha(profile.shade,.12+zone.canopy*.13));ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
  ctx.save();ctx.globalAlpha=.12+speed*.035+zone.canopy*.045;ctx.fillStyle=zone.fog;const moteCount=rich?8:4;for(let i=0;i<moteCount;i++){const t=(state.elapsed*.000022+i*.157)%1,x=(i*173%997)/997*w+Math.sin(state.elapsed*.00065+i)*15,y=h*(.2+(i%4)*.08)+t*h*.12,r=1+(i%3)*.55;ctx.save();ctx.translate(x,y);ctx.rotate(t*5+i);ctx.scale(1,.48);ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.restore()}ctx.restore();
  canvas.dataset.jungleCanopy=index===6?'layered-near-v1':'off';canvas.dataset.biomeVolumeCanopyModel='course-zone-canopy-v3';canvas.dataset.biomeVolumeCanopy=zone.canopy.toFixed(2);canvas.dataset.biomeVolumeAtmosphere=zone.id;canvas.dataset.biomeVolumeAtmosphereColor=zone.fog;
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
  const rel=z-state.distance;if(rel<18||rel>DRAW_DISTANCE-30)return false;const p=roadPoint(rel);if(!p.visible)return false;const theme=activeCourse.theme,alpha=distanceFadeAlpha(rel,470,790),selected=racers[state.selected]?.routeLap===lap?racers[state.selected].routeChoice:null,panelW=Math.max(42,p.half*.68),panelH=Math.max(18,p.half*.25),panelY=p.y-Math.max(34,p.half*.64),poleTop=panelY+panelH*.5;ctx.save();ctx.globalAlpha=alpha;ctx.lineWidth=Math.max(2,p.half*.045);ctx.strokeStyle=theme.curbA;ctx.shadowColor=theme.lightB;ctx.shadowBlur=Math.max(5,p.half*.08);for(const side of[-1,1]){const x=p.cx+side*p.half*.48,branch=side<0?graph.branches.left:graph.branches.right,color=side<0?theme.lightA:theme.lightB,flash=routeSelectionGlow(lap,branch.id);ctx.beginPath();ctx.moveTo(x-side*panelW*.34,p.y);ctx.lineTo(x-side*panelW*.34,poleTop);ctx.stroke();ctx.fillStyle=flash>0?colorAlpha(color,.34+flash*.28):'rgba(10,8,35,.94)';ctx.strokeStyle=flash>0?'#fff':selected===branch.id?'#fff36e':color;ctx.shadowColor=flash>0?'#fff36e':color;ctx.shadowBlur=flash>0?Math.max(14,p.half*(.14+flash*.12)):Math.max(4,p.half*.05);ctx.lineWidth=Math.max(2,p.half*(.025+flash*.018));ctx.beginPath();ctx.roundRect(x-panelW/2,panelY,panelW,panelH,Math.max(4,panelH*.2));ctx.fill();ctx.stroke();if(flash>0){ctx.globalAlpha=alpha*(.25+flash*.42);ctx.fillStyle='#fff';ctx.fill();ctx.globalAlpha=alpha;canvas.dataset.routeDecisionFlash=branch.id}ctx.shadowBlur=flash>0?12:0;ctx.fillStyle=flash>0?'#fff':selected===branch.id?'#fff36e':'#fff';ctx.font=`900 ${Math.max(7,Math.min(18,p.half*.11))}px Fredoka`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(`${side<0?'←':'→'} ${branch.label}`,x,panelY+panelH*.38,panelW*.9);ctx.fillStyle=flash>0?'#fff36e':color;ctx.font=`900 ${Math.max(5,Math.min(10,p.half*.06))}px Fredoka`;ctx.fillText(branch.perk,x,panelY+panelH*.73,panelW*.88)}ctx.restore();return true
}
function drawRouteGraphRoad(){
  const graph=activeCourse?.routeGraph;if(!graph)return;canvas.dataset.routeDecisionFlash='none';const length=raceLength(),theme=activeCourse.theme,firstLap=Math.max(0,Math.floor((state.distance-graph.end-190)/length)),lastLap=Math.ceil((state.distance+DRAW_DISTANCE-graph.start+190)/length);let visibleForks=0,visibleGates=0;
  for(let lap=firstLap;lap<=lastLap;lap++){
    const start=lap*length+graph.start,end=lap*length+graph.end,selected=racers[state.selected]?.routeLap===lap?racers[state.selected].routeChoice:null;
    for(const warning of[165,105,52])for(const branch of Object.values(graph.branches))drawProjectedRouteArrow(start-warning,branch.side,selected===branch.id?'#fff36e':branch.side<0?theme.lightA:theme.lightB,branch.side<0?'CAN':'BOOST');
    if(drawRouteDecisionGate(start+8,graph,lap))visibleGates++;
    const from=Math.max(start,state.distance+2),to=Math.min(end,state.distance+DRAW_DISTANCE);if(to<=from)continue;visibleForks++;
  }
  canvas.dataset.routeForkVisible=String(visibleForks);canvas.dataset.routeGraphEdges=String(graph.edges.length);canvas.dataset.routeRoadModel=graph.geometry?.model||'none';canvas.dataset.routeVisualGap=String(graph.geometry?.visualGap??0);canvas.dataset.routeLaneGap=String(graph.geometry?.laneGap??0);canvas.dataset.routeDecisionGate=visibleGates?'visible':'none';
}

function routeMedianAt(distance){
  const geometry=routeGeometryAt(distance);if(!geometry||geometry.fork<.14)return null;const left=geometry.branches.left,right=geometry.branches.right;if(!left||!right)return null;const leftInner=left.visualCenter+left.visualHalf,rightInner=right.visualCenter-right.visualHalf,gap=rightInner-leftInner;if(gap<.1)return null;return{geometry,left,right,center:(leftInner+rightInner)*.5,gap}
}
function drawRouteMedianSurfaceMarkers(){
  canvas.dataset.routeMedianArrowFlash='none';const graph=activeCourse?.routeGraph;if(!graph){canvas.dataset.routeMedianSurfaceArrows='0';return}const length=raceLength(),firstLap=Math.max(0,Math.floor((state.distance-graph.end-40)/length)),lastLap=Math.ceil((state.distance+DRAW_DISTANCE-graph.start+40)/length),theme=activeCourse.theme,marks=[];
  for(let lap=firstLap;lap<=lastLap;lap++)for(let z=lap*length+graph.start+28;z<lap*length+graph.end-18;z+=36){const rel=z-state.distance;if(rel<12||rel>DRAW_DISTANCE-20)continue;const near=roadPoint(rel-7),mid=roadPoint(rel),far=roadPoint(rel+7),mn=routeMedianAt(z-7),mm=routeMedianAt(z),mf=routeMedianAt(z+7);if(!near.visible||!mid.visible||!far.visible||!mn||!mm||!mf)continue;marks.push({rel,near,mid,far,mn,mm,mf})}
  marks.sort((a,b)=>b.rel-a.rel);let drawn=0;for(const mark of marks){const{near,mid,far,mn,mm,mf,rel}=mark,alpha=distanceFadeAlpha(rel,490,800)*.56,nearY=(routePathY(near,mn.left)+routePathY(near,mn.right))*.5,midY=(routePathY(mid,mm.left)+routePathY(mid,mm.right))*.5,farY=(routePathY(far,mf.left)+routePathY(far,mf.right))*.5,nearCenter=near.cx+near.half*mn.center,farCenter=far.cx+far.half*mf.center,leftTip=mid.cx+mid.half*(mm.center-mm.gap*.37),rightTip=mid.cx+mid.half*(mm.center+mm.gap*.37),leftPoints=[[nearCenter,nearY],[leftTip,midY],[farCenter,farY]],rightPoints=[[nearCenter,nearY],[rightTip,midY],[farCenter,farY]],leftFlash=routeSelectionGlow(mm.geometry.lap,'left'),rightFlash=routeSelectionGlow(mm.geometry.lap,'right');poly(leftPoints,colorAlpha(theme.lightA,alpha*(1+leftFlash*.46)));poly(rightPoints,colorAlpha(theme.lightB,alpha*(1+rightFlash*.46)));for(const[side,points,flash,color]of[['left',leftPoints,leftFlash,theme.lightA],['right',rightPoints,rightFlash,theme.lightB]])if(flash>0){ctx.save();ctx.globalAlpha=(.22+flash*.56)*distanceFadeAlpha(rel,490,800);ctx.fillStyle='#fff';ctx.shadowColor=color;ctx.shadowBlur=Math.max(10,mid.half*(.08+flash*.08));poly(points,'#fff');ctx.restore();canvas.dataset.routeMedianArrowFlash=side}ctx.save();ctx.globalAlpha=alpha*.8;ctx.fillStyle='#fff';ctx.shadowColor=theme.accent;ctx.shadowBlur=Math.max(2,mid.half*.025);ctx.beginPath();ctx.arc(mid.cx+mid.half*mm.center,midY,Math.max(1.2,mid.half*mm.gap*.035),0,Math.PI*2);ctx.fill();ctx.restore();drawn+=2}
  canvas.dataset.routeMedianSurfaceArrows=String(drawn);
}
function drawRouteMedianDirection(entry,profile,theme){
  const{p,median,groundY,alpha}=entry,medianWidth=p.half*median.gap,panelW=Math.max(20,Math.min(medianWidth*.94,p.half*.82)),panelH=Math.max(9,panelW*.36),postH=Math.max(4,panelH*.48),panelY=groundY-postH-panelH,leftFlash=routeSelectionGlow(median.geometry.lap,'left'),rightFlash=routeSelectionGlow(median.geometry.lap,'right'),flash=Math.max(leftFlash,rightFlash);if(panelW<18)return false;
  ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=flash>0?'rgba(34,29,71,.98)':'rgba(10,8,33,.95)';ctx.strokeStyle=flash>0?'#fff':theme.curbA;ctx.lineWidth=Math.max(1,panelH*(.09+flash*.045));ctx.shadowColor=flash>0?'#fff36e':theme.lightB;ctx.shadowBlur=Math.max(4,panelH*(.34+flash*.58));ctx.beginPath();ctx.roundRect(entry.x-panelW*.5,panelY,panelW,panelH,Math.max(3,panelH*.18));ctx.fill();ctx.stroke();
  ctx.shadowBlur=0;ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=Math.max(1,panelH*.045);ctx.beginPath();ctx.moveTo(entry.x,groundY);ctx.lineTo(entry.x,panelY+panelH);ctx.stroke();ctx.fillStyle=leftFlash>0?'#fff':theme.lightA;ctx.font=`900 ${Math.max(7,panelH*(.56+leftFlash*.12))}px Fredoka`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\u2190',entry.x-panelW*.27,panelY+panelH*.5);ctx.fillStyle=rightFlash>0?'#fff':theme.lightB;ctx.font=`900 ${Math.max(7,panelH*(.56+rightFlash*.12))}px Fredoka`;ctx.fillText('\u2192',entry.x+panelW*.27,panelY+panelH*.5);if(flash>0)canvas.dataset.routeMedianBoardFlash=leftFlash>rightFlash?'left':'right';
  if(panelW>66){ctx.fillStyle='#fff';ctx.font=`900 ${Math.max(5,Math.min(10,panelH*.29))}px Fredoka`;ctx.fillText(profile.label,entry.x,panelY+panelH*.5)}ctx.restore();return true
}
function drawRouteMedianDecoration(entry,profile,theme,secondary=false){
  const frames=courseSceneryFrames[state.selectedCourse]||[],frame=frames[secondary?profile.secondary:profile.frame],{p,median,groundY,alpha}=entry,medianWidth=p.half*median.gap,frameRatio=frame?frame.sw/Math.max(1,frame.sh):1,height=Math.min(innerHeight*.2,p.half*.9,medianWidth*.82/Math.max(.45,frameRatio));if(height<6)return false;
  ctx.save();ctx.globalAlpha=alpha*.38;ctx.fillStyle='rgba(8,6,25,.76)';ctx.beginPath();ctx.ellipse(entry.x,groundY,Math.max(4,Math.min(medianWidth*.36,height*.4)),Math.max(1.5,height*.07),0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=secondary?theme.lightB:theme.lightA;ctx.lineWidth=Math.max(1,height*.025);ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=Math.max(3,height*.09);ctx.beginPath();ctx.ellipse(entry.x,groundY-height*.02,Math.max(3,Math.min(medianWidth*.29,height*.32)),Math.max(1,height*.045),0,0,Math.PI*2);ctx.stroke();ctx.restore();
  if(frame){drawFrameHeightFiltered(frame,entry.x,groundY,height,alpha*(1-sceneryFogAmount(entry.rel)*.16),0,sceneryFilter(entry.rel));return true}
  const beaconH=height*.78,beaconW=Math.max(3,Math.min(medianWidth*.2,height*.22));ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='rgba(16,10,42,.94)';ctx.strokeStyle=secondary?theme.lightB:theme.lightA;ctx.lineWidth=Math.max(1,height*.035);ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=Math.max(4,height*.12);ctx.beginPath();ctx.roundRect(entry.x-beaconW*.5,groundY-beaconH,beaconW,beaconH,beaconW*.4);ctx.fill();ctx.stroke();ctx.translate(entry.x,groundY-beaconH);ctx.rotate(Math.PI*.25);ctx.fillStyle=theme.accent;ctx.fillRect(-beaconW*.42,-beaconW*.42,beaconW*.84,beaconW*.84);ctx.restore();return true
}
function drawRouteMedianFeatures(){
  canvas.dataset.routeMedianBoardFlash='none';const graph=activeCourse?.routeGraph,profile=ROUTE_MEDIAN_PROFILES[state.selectedCourse]||ROUTE_MEDIAN_PROFILES[0];if(!graph){canvas.dataset.routeMedianMarkers='0';canvas.dataset.routeDirectionMarkers='0';return}const length=raceLength(),firstLap=Math.max(0,Math.floor((state.distance-graph.end-40)/length)),lastLap=Math.ceil((state.distance+DRAW_DISTANCE-graph.start+40)/length),placements=[{t:.17,kind:'direction'},{t:.34,kind:'decor'},{t:.51,kind:'direction'},{t:.68,kind:'secondary'},{t:.84,kind:'direction'}],entries=[];
  for(let lap=firstLap;lap<=lastLap;lap++)for(const placement of placements){const z=lap*length+graph.start+(graph.end-graph.start)*placement.t,rel=z-state.distance;if(rel<4||rel>DRAW_DISTANCE-18||tunnelAt(z))continue;const p=roadPoint(rel),median=routeMedianAt(z);if(!p.visible||!median)continue;const passFade=rel<42?clamp((rel-4)/38,0,1):1,alpha=distanceFadeAlpha(rel,465,Math.min(DRAW_DISTANCE*.98,810))*passFade*(1-sceneryFogAmount(rel)*.14),groundY=(routePathY(p,median.left)+routePathY(p,median.right))*.5;if(alpha>.035)entries.push({z,rel,p,median,groundY,x:p.cx+p.half*median.center,alpha,kind:placement.kind})}
  entries.sort((a,b)=>b.rel-a.rel);let markers=0,directions=0,decorations=0;for(const entry of entries){markers++;if(entry.kind==='direction'){if(drawRouteMedianDirection(entry,profile,activeCourse.theme))directions++}else if(drawRouteMedianDecoration(entry,profile,activeCourse.theme,entry.kind==='secondary'))decorations++}
  canvas.dataset.routeMedianMarkers=String(markers);canvas.dataset.routeDirectionMarkers=String(directions);canvas.dataset.routeMedianDecorations=String(decorations);canvas.dataset.routeMedianTheme=profile.id;canvas.dataset.routeMedianAsset=courseSceneryFrames[state.selectedCourse]?.length?'course-scenery-atlas':'procedural-fallback';
}

function drawFrame(frame,x,y,width,alpha=1,rotation=0){if(!frame)return;const height=width*frame.sh/frame.sw;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(rotation);ctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,-width/2,-height,width,height);ctx.restore()}
function drawFrameCentered(frame,x,y,width,alpha=1,rotation=0){if(!frame)return;const height=width*frame.sh/frame.sw;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(rotation);ctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,-width/2,-height/2,width,height);ctx.restore()}
function drawFrameHeight(frame,x,y,height,alpha=1,rotation=0){if(!frame)return;const width=height*frame.sw/frame.sh;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(rotation);ctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,-width/2,-height,width,height);ctx.restore()}
function drawKartShadow(x,y,w,alpha=.32){ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='#050310';ctx.beginPath();ctx.ellipse(x,y-3,w,.24*w,0,0,7);ctx.fill();ctx.restore()}
function drawOpponentTag(x,y,r,rank){const text=r===miaNpc?`BOSS  ${r.name}`:`${rank}  ${r.name}`,ability=r.signatureActive>0?r.signature.label:null;ctx.save();ctx.font="900 12px 'Noto Sans JP'";const abilityWidth=ability?(ability.length*6.6+20):0,width=Math.max(60,ctx.measureText(text).width+18,abilityWidth),height=ability?37:25;ctx.fillStyle=r===miaNpc?'rgba(43,2,34,.9)':'rgba(10,8,32,.82)';ctx.strokeStyle=ability?r.signature.color:r.color;ctx.lineWidth=r===miaNpc?3:2;ctx.shadowColor=r===miaNpc?r.color:ability?r.signature.color:'transparent';ctx.shadowBlur=r===miaNpc?15:ability?9:0;ctx.beginPath();ctx.roundRect(x-width/2,y-height+7,width,height,12);ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,x,y-(ability?13:5));if(ability){ctx.fillStyle=r.signature.color;ctx.font="900 8px 'Fredoka'";ctx.fillText(`${r.signature.glyph}  ${ability}`,x,y+1)}ctx.restore()}
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
function projectRouteScreenPoint(distance,lane,point=roadPoint(Math.max(4,8+distance-state.distance))){
  const path=projectedRoutePath(distance,lane);if(!path)return{path,x:point.cx+point.half*lane*.78,y:point.y,half:point.half,scale:point.scale};
  const corridor=routeCorridorPoint(point,path),local=clamp((lane-path.laneCenter)/Math.max(.001,path.laneHalf),-1.35,1.35);
  return{path,x:corridor.cx+corridor.half*local,y:corridor.y,half:corridor.half,scale:corridor.scale}
}
function projectTrackEntity(distance,lane=0){
  if(!Number.isFinite(distance))return{x:-9999,y:-9999,half:0,heading:0,cameraHeading:0,relativeHeading:0,tangent:0,scale:.11,visible:false,routePath:null};
  const rel=distance-state.distance,depth=Math.max(4,8+rel),p=roadPoint(depth),s=trackDistanceSample(distance),base=trackDistanceSample(state.distance);
  const projected=projectRouteScreenPoint(distance,lane,p),path=projected.path;return{x:projected.x,y:projected.y,half:projected.half,heading:s.heading,cameraHeading:base.heading,relativeHeading:p.relativeHeading+(path?.curveBias||0)*.34+(path?.corridorYaw||0)*.26,tangent:p.tangent+(path?.curveBias||0)*.2+(path?.corridorYaw||0)*.14,scale:Math.max(.11,Math.min(1.02,projected.scale*1.28)),visible:p.visible,routePath:path};
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
  const distances=[35,80,145,230,340,500,690],lines=new Map(),current=selectedBoundaryCorridor(trackBoundaryProfileAt(state.distance)),leftGap=state.x-current.collisionLeft,rightGap=current.collisionRight-state.x,nearSide=leftGap<rightGap?-1:1,nearGap=Math.min(leftGap,rightGap),warningRange=Math.max(.18,(current.collisionRight-current.collisionLeft)*.16),danger=clamp(1-nearGap/warningRange,0,1),selectedId=current.id;
  for(const d of distances){const distance=state.distance+d,p=roadPoint(d),profile=trackBoundaryProfileAt(distance),cameraElevation=state.routeCameraElevation||0;for(const corridor of profile.corridors){const y=p.y-(corridor.elevation-cameraElevation)*p.half*.32,visualLeft=corridor.visualRailLeft+profile.inset,visualRight=corridor.visualRailRight-profile.inset;for(const [side,factor,alpha]of[[-1,visualLeft,corridor.leftAlpha],[1,visualRight,corridor.rightAlpha]]){const key=`${corridor.id}:${side}`,line=lines.get(key)||[];line.push({x:p.cx+p.half*factor,y,alpha,corridor:corridor.id,side});lines.set(key,line)}}}
  ctx.save();ctx.lineCap='round';ctx.setLineDash([]);for(const points of lines.values()){if(points.length<2)continue;const selected=points[0].corridor===selectedId,hot=selected&&points[0].side===nearSide&&danger>0;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.globalAlpha=Math.max(.18,Math.min(...points.map(point=>point.alpha)));ctx.strokeStyle=hot?`rgba(255,55,125,${.68+danger*.3})`:(selected?'rgba(255,250,241,.62)':'rgba(145,221,255,.42)');ctx.lineWidth=hot?5:selected?2.4:1.8;ctx.shadowColor=hot?'#ff397d':selected?'#7b294e':'#5bd6ff';ctx.shadowBlur=hot?18:7;ctx.stroke()}
  ctx.setLineDash([]);if(danger>.12){const p=roadPoint(120);ctx.globalAlpha=.45+danger*.5;ctx.fillStyle='#ff66bd';ctx.font="900 13px 'Noto Sans JP'";ctx.textAlign='center';ctx.fillText('COURSE EDGE',p.cx+nearSide*p.half*(nearSide<0?Math.abs(current.visualRailLeft):Math.abs(current.visualRailRight)),p.y-20)}ctx.restore();canvas.dataset.courseLimitModel=GUARDRAIL_GEOMETRY_MODEL;canvas.dataset.courseLimitCorridor=selectedId;canvas.dataset.courseLimitLineCount=String(lines.size);
}
function jumpRampFrameFor(p,ramp){
  if(!jumpRampFrames.length)return null;
  const row=Math.max(0,Math.min(JUMP_RAMP_ROWS-1,activeCourse?.rampRow??state.selectedCourse));
  // Select the art from the road that is actually on screen.  World-space
  // curve signs can be opposite to the projected direction depending on the
  // loop heading, and they also miss the perspective of an off-centre ramp.
  const rel=ramp.z-state.distance,near=roadPoint(Math.max(4,rel-18)),far=roadPoint(rel+18),lane=ramp.lane||0,nearProjected=projectRouteScreenPoint(ramp.z-18,lane,near),farProjected=projectRouteScreenPoint(ramp.z+18,lane,far);
  const nearX=nearProjected.x,farX=farProjected.x,screenDx=farX-nearX,screenDy=Math.max(5,nearProjected.y-farProjected.y);
  const worldDx=far.worldX-near.worldX,relativeYaw=p?.relativeHeading??roadPoint(rel).relativeHeading,before=trackDistanceSample(ramp.z-24),after=trackDistanceSample(ramp.z+24),courseTurn=angleDelta(after.heading,before.heading);
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
function pickupHologramProgress(object){
  if(!object?.taken)return 0;if(Number.isFinite(object.hologramPreview))return clamp(object.hologramPreview,.001,1);if(!Number.isFinite(object.respawnAt))return 0;const remaining=object.respawnAt-state.elapsed;return remaining>0&&remaining<=PICKUP_HOLOGRAM_LEAD_MS?clamp(1-remaining/PICKUP_HOLOGRAM_LEAD_MS,.001,1):0
}
function drawPickupHologram(entry,progress){
  const o=entry.object,frame=o.type==='coin'?itemFrames[4]:o.type==='item'?catCanFrames[0]:itemFrames[7];if(!frame||progress<=0)return;const ease=progress*progress*(3-2*progress),height=entry.height*(.62+ease*.16),width=height*frame.sw/frame.sh,bob=Math.sin(state.elapsed*.017+o.z*.041)*height*.025,baseY=entry.groundY-height*entry.style.float+bob,pulse=.82+Math.sin(state.elapsed*.028+o.z)*.18,color=o.type==='item'?'#ff72be':o.type==='coin'?'#ffe86c':'#ff72d6',alpha=entry.alpha*(.1+ease*.38)*pulse,rotation=o.type==='coin'?Math.sin(state.elapsed*.009)*.11:Math.sin(state.elapsed*.006+o.z)*.025;
  drawThroughTunnelPortal(entry,()=>{ctx.save();ctx.globalCompositeOperation='screen';const ringScale=.54-ease*.39,ringY=Math.max(1.5,height*(.075-ease*.045)),glowRadius=Math.max(7,width*(.58-ease*.16)),glow=ctx.createRadialGradient(entry.p.x,entry.groundY-height*.03,0,entry.p.x,entry.groundY-height*.03,glowRadius);canvas.dataset.pickupHologramProgress=progress.toFixed(3);canvas.dataset.pickupHologramRingScale=ringScale.toFixed(3);glow.addColorStop(0,colorAlpha(color,alpha*(.22+ease*.38)));glow.addColorStop(1,colorAlpha(color,0));ctx.fillStyle=glow;ctx.fillRect(entry.p.x-width*.72,baseY-height*1.08,width*1.44,height*1.18);ctx.strokeStyle=color;ctx.globalAlpha=alpha*(.42+ease*.86);ctx.lineWidth=Math.max(1,height*(.013+ease*.012));ctx.setLineDash([Math.max(2,width*(.11-ease*.035)),Math.max(2,width*.05)]);ctx.lineDashOffset=-state.elapsed*(.03+ease*.035);ctx.beginPath();ctx.ellipse(entry.p.x,entry.groundY+1,width*ringScale,ringY,0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=alpha*.2*(1-ease);ctx.lineWidth=Math.max(.8,height*.012);ctx.beginPath();ctx.ellipse(entry.p.x,entry.groundY+1,width*ringScale*1.5,ringY*1.45,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=alpha*(.2+ease*.8);ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=Math.max(5,height*(.06+ease*.12));ctx.beginPath();ctx.arc(entry.p.x,entry.groundY,Math.max(1.5,height*(.018+ease*.035)),0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.filter='brightness(1.65) saturate(.48) contrast(1.12)';drawFrameHeight(frame,entry.p.x,baseY,height,alpha,rotation);ctx.filter='none';ctx.globalAlpha=alpha*(.26+ease*.28);ctx.strokeStyle=color;ctx.lineWidth=Math.max(.8,height*.012);ctx.beginPath();const scanGap=Math.max(3,height*.085),scanTop=baseY-height,scanPhase=(state.elapsed*.055)%scanGap;for(let y=scanTop+scanPhase;y<baseY;y+=scanGap){const center=1-Math.abs((y-(scanTop+height*.5))/(height*.5)),half=width*.46*Math.max(.18,center);ctx.moveTo(entry.p.x-half,y);ctx.lineTo(entry.p.x+half,y)}ctx.stroke();ctx.restore()})
}
function drawPickupTrackEntity(entry){
  const o=entry.object,frame=o.type==='coin'?itemFrames[4]:o.type==='item'?catCanFrames[0]:itemFrames[7];if(!frame)return;const spawn=o.respawnFxUntil>state.elapsed?clamp(1-(o.respawnFxUntil-state.elapsed)/260,0,1):1,ease=1-Math.pow(1-spawn,3),respawning=o.respawnCount>0&&spawn<1,scale=respawning?.78+ease*.22:Math.max(.08,ease),visibleAlpha=respawning?.46+ease*.54:ease,height=entry.height*scale,bob=Math.sin(state.elapsed*.005+o.z*.03)*height*.055,baseY=entry.groundY-height*entry.style.float+bob,rotation=o.type==='coin'?Math.sin(state.elapsed*.004)*.15:(1-spawn)*Math.PI*.8,width=height*frame.sw/frame.sh;drawThroughTunnelPortal(entry,()=>{if(o.type!=='pad')drawKartShadow(entry.p.x,entry.groundY+2,Math.max(3,width*.3),.18*entry.alpha*visibleAlpha);if(spawn<1){ctx.save();ctx.globalAlpha=(1-spawn)*.72;ctx.fillStyle=o.type==='item'?'#ff72be':o.type==='pad'?'#ff72d6':'#ffe66d';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=Math.max(12,height*.35);ctx.beginPath();ctx.arc(entry.p.x,baseY-height*.42,Math.max(4,height*(.16+spawn*.13)),0,Math.PI*2);ctx.fill();ctx.restore()}drawFrameHeight(frame,entry.p.x,baseY,height,entry.alpha*visibleAlpha,rotation)})
}
function drawCourseDynamicGimmicks(layer='ground'){
  const hazards=state.courseHazards.filter(hazard=>hazard.kind!=='fallingLog'&&hazard.kind!=='stoneGate'),entries=hazards.map(hazard=>({hazard,rel:hazard.z-state.distance,p:projectTrackEntity(hazard.z,hazard.lane)})).filter(entry=>entry.rel>7&&entry.rel<DRAW_DISTANCE-10&&entry.p.visible).sort((a,b)=>b.rel-a.rel);let drawn=0;
  for(const entry of entries){const{hazard,rel,p}=entry,color=hazard.color||activeCourse.theme.accent,alpha=distanceFadeAlpha(rel,540,815);if(alpha<.03)continue;
    if(layer==='ground'){if(!hazard.static)continue;const near=roadPoint(Math.max(1,rel-(hazard.range||16))),far=roadPoint(rel+(hazard.range||16)),width=hazard.width||.5,lane=hazard.lane,points=[[near.cx+near.half*(lane-width),near.y],[near.cx+near.half*(lane+width),near.y],[far.cx+far.half*(lane+width),far.y],[far.cx+far.half*(lane-width),far.y]];ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=colorAlpha(color,hazard.kind==='deepPuddle'?.38:.5);ctx.shadowColor=color;ctx.shadowBlur=Math.max(4,p.half*.06);poly(points,ctx.fillStyle);ctx.shadowBlur=0;ctx.strokeStyle=colorAlpha('#ffffff',.58);ctx.lineWidth=Math.max(1,p.half*.012);ctx.setLineDash(hazard.kind==='thinIce'?[4,5]:hazard.kind==='lowGravity'?[8,6]:[]);ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.stroke();if(hazard.kind==='thinIce'){ctx.globalAlpha=alpha*.68;ctx.beginPath();ctx.moveTo(p.x-p.half*.18,p.y);ctx.lineTo(p.x,p.y-p.half*.09);ctx.lineTo(p.x+p.half*.12,p.y);ctx.moveTo(p.x,p.y-p.half*.09);ctx.lineTo(p.x-p.half*.04,p.y-p.half*.18);ctx.stroke()}else if(hazard.kind==='lowGravity'){ctx.globalAlpha=alpha*(.35+Math.sin(state.elapsed*.008)*.15);ctx.beginPath();ctx.ellipse(p.x,p.y,Math.max(5,p.half*width*.62),Math.max(2,p.half*.055),0,0,Math.PI*2);ctx.stroke()}ctx.restore();drawn++;continue}
    const spriteFrame=courseDynamicGimmickFrame(hazard),spriteDriven=!!spriteFrame;if(layer!=='foreground'||hazard.static||(!spriteDriven&&hazard.phase==='open'))continue;
    if(spriteDriven){const heightScale=hazard.kind==='candyBarrel'?.72:hazard.kind==='waterJet'?1.05:hazard.kind==='steamVent'?1.35:1.75,heightCap=hazard.kind==='candyBarrel'?.22:hazard.kind==='waterJet'?.34:hazard.kind==='steamVent'?.42:.48,height=Math.max(16,Math.min(innerHeight*heightCap,p.half*heightScale)),groundY=p.y+Math.max(2,height*.03),visibleAlpha=hazard.kind==='ghostGate'&&hazard.phase==='open'?.58:1,telegraph=hazard.telegraph||0,pulse=.72+Math.sin(state.elapsed*.018+hazard.z)*.28;drawThroughTunnelPortal(hazard.z,()=>{drawKartShadow(p.x,groundY+3,Math.max(5,height*.28),.22*alpha*visibleAlpha);drawFrameHeightFiltered(spriteFrame,p.x,groundY,height,alpha*visibleAlpha,0,sceneryFilter(rel));if(telegraph>0&&hazard.phase!=='closed'){ctx.save();ctx.globalAlpha=alpha*telegraph*pulse;ctx.strokeStyle=color;ctx.lineWidth=Math.max(2,height*.022);ctx.shadowColor=color;ctx.shadowBlur=Math.max(8,height*.12);ctx.setLineDash([Math.max(4,height*.055),Math.max(3,height*.04)]);ctx.lineDashOffset=-state.elapsed*.03;ctx.beginPath();ctx.ellipse(p.x,groundY,Math.max(7,p.half*(hazard.width||.3)),Math.max(2,height*.055),0,0,Math.PI*2);ctx.stroke();ctx.restore()}});canvas.dataset.courseDynamicGimmickSprite=`${hazard.kind}:${Math.floor(courseGimmickFrames.indexOf(spriteFrame)%4)}`;drawn++;continue}
    const height=Math.max(14,Math.min(innerHeight*.42,p.half*1.55)),groundY=p.y+Math.max(2,height*.035),pulse=.72+Math.sin(state.elapsed*.018+hazard.z)*.28,active=hazard.phase==='closed',telegraph=hazard.telegraph||0;drawThroughTunnelPortal(hazard.z,()=>{ctx.save();ctx.globalAlpha=alpha*(active?1:.54);ctx.strokeStyle=color;ctx.fillStyle=colorAlpha(color,active?.34:.12);ctx.shadowColor=color;ctx.shadowBlur=Math.max(8,height*(active?.16:.08));ctx.lineWidth=Math.max(2,height*.025);
      if(hazard.kind==='steamVent'||hazard.kind==='waterJet'){const plume=active?height*(.95+pulse*.18):height*.18;ctx.beginPath();ctx.ellipse(p.x,groundY,Math.max(5,p.half*.24),Math.max(2,height*.055),0,0,Math.PI*2);ctx.fill();ctx.stroke();if(active){const gradient=ctx.createLinearGradient(p.x,groundY,p.x,groundY-plume);gradient.addColorStop(0,colorAlpha(color,.78));gradient.addColorStop(1,colorAlpha('#ffffff',0));ctx.strokeStyle=gradient;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(p.x+i*height*.035,groundY);ctx.quadraticCurveTo(p.x-i*height*.08,groundY-plume*.55,p.x+i*height*.025,groundY-plume);ctx.stroke()}}}
      else if(hazard.kind==='petalGust'){const direction=Math.sin(state.elapsed*.0011+hazard.phaseOffset)>=0?1:-1;ctx.globalAlpha*=telegraph;for(let i=-2;i<=2;i++){const y=groundY-height*(.16+i*.07),start=p.x-direction*p.half*.92,end=p.x+direction*p.half*.92;ctx.beginPath();ctx.moveTo(start,y);ctx.quadraticCurveTo(p.x,y-height*.1,end,y-height*.03);ctx.stroke();ctx.beginPath();ctx.arc(start+(end-start)*((state.elapsed*.001+i*.17+3)%1),y-height*.05,Math.max(2,height*.018),0,Math.PI*2);ctx.fill()}}
      else if(hazard.kind==='candyBarrel'){ctx.translate(p.x,groundY-height*.22);ctx.rotate(state.elapsed*.0028);ctx.beginPath();ctx.arc(0,0,height*.22,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.strokeStyle='#fff';ctx.beginPath();ctx.moveTo(-height*.18,0);ctx.lineTo(height*.18,0);ctx.moveTo(0,-height*.18);ctx.lineTo(0,height*.18);ctx.stroke()}
      else{const gateW=Math.max(14,p.half*(hazard.kind==='ghostGate'?.58:.46)),gateH=height*(hazard.kind==='ghostGate'?.88:.72);ctx.globalAlpha*=hazard.kind==='ghostGate'?(active?.9:.34):1;ctx.beginPath();ctx.roundRect(p.x-gateW*.5,groundY-gateH,gateW,gateH,Math.max(4,gateW*.14));ctx.fill();ctx.stroke();ctx.globalAlpha*=.8;ctx.strokeStyle='#fff';ctx.beginPath();ctx.moveTo(p.x,groundY-gateH*.88);ctx.lineTo(p.x,groundY-gateH*.12);ctx.stroke()}
      if(!active&&telegraph>0){ctx.globalAlpha=alpha*telegraph*pulse;ctx.strokeStyle='#fff';ctx.setLineDash([6,5]);ctx.beginPath();ctx.ellipse(p.x,groundY,Math.max(6,p.half*(hazard.width||.3)),Math.max(2,height*.06),0,0,Math.PI*2);ctx.stroke()}ctx.restore()});drawn++
  }
  canvas.dataset[`courseDynamicGimmick${layer[0].toUpperCase()+layer.slice(1)}`]=String(drawn);canvas.dataset.courseDynamicGimmickVisible=String((Number(canvas.dataset.courseDynamicGimmickGround)||0)+(Number(canvas.dataset.courseDynamicGimmickForeground)||0));canvas.dataset.courseDynamicGimmickLayer=layer;canvas.dataset.courseDynamicGimmickRender=courseGimmickFrames.length===16?'projected-gpt2-sprite-plus-surface-v2':'projected-procedural-fallback'
}
function drawJungleRouteHazards(){
  if(!activeCourse?.immersiveJungle||!jungleGimmickFrames.length||!state.courseHazards.length){canvas.dataset.jungleHazardVisible='0';return}
  const entries=state.courseHazards.map(hazard=>({hazard,rel:hazard.z-state.distance,p:projectTrackEntity(hazard.z,hazard.lane)})).filter(entry=>entry.rel>8&&entry.rel<DRAW_DISTANCE-12&&entry.p.visible).sort((a,b)=>b.rel-a.rel);let drawn=0;
  for(const entry of entries){const{hazard,rel,p}=entry,frameOffset=hazard.kind==='stoneGate'?4:0,frame=jungleGimmickFrames[frameOffset+hazard.frame];if(!frame)continue;const alpha=distanceFadeAlpha(rel,545,815),height=Math.max(14,Math.min(innerHeight*.56,p.half*2.2)),groundY=p.y+Math.max(2,height*.035),width=height*frame.sw/Math.max(1,frame.sh);if(alpha<.03||p.x<-width||p.x>innerWidth+width)continue;drawThroughTunnelPortal(hazard.z,()=>{drawKartShadow(p.x,groundY+3,Math.max(5,Math.min(width*.42,p.half*.92)),.28*alpha);if(hazard.telegraph>0){const pulse=.72+Math.sin(state.elapsed*.022)*.28,color=hazard.kind==='fallingLog'?'#ffb33c':'#6fffc3';ctx.save();ctx.globalAlpha=alpha*hazard.telegraph*pulse;ctx.strokeStyle=color;ctx.lineWidth=Math.max(2,height*.025);ctx.shadowColor=color;ctx.shadowBlur=Math.max(8,height*.14);ctx.setLineDash([Math.max(4,height*.08),Math.max(3,height*.045)]);ctx.lineDashOffset=-state.elapsed*.035;ctx.beginPath();ctx.ellipse(p.x,groundY,Math.min(p.half*.9,width*.44),Math.max(3,height*.07),0,0,Math.PI*2);ctx.stroke();ctx.restore()}drawFrameHeightFiltered(frame,p.x,groundY,height,alpha,0,sceneryFilter(rel))});drawn++
  }
  canvas.dataset.jungleHazardVisible=String(drawn);canvas.dataset.jungleHazardAsset='gpt-image-2-spritesheet-v1'
}
function drawTrackEntities(){
  const entries=state.objects.filter(o=>(o.type==='ramp'||!o.taken||pickupHologramProgress(o)>0)&&o.z-state.distance>-18&&o.z-state.distance<DRAW_DISTANCE).map(object=>{const entry=projectTrackEntityDescriptor(object);entry.hologram=pickupHologramProgress(object);return entry}).filter(entry=>entry.visible).sort((a,b)=>b.rel-a.rel||Number(a.type==='ramp')-Number(b.type==='ramp'));
  let holograms=0;for(const entry of entries){if(entry.type==='ramp')drawRampTrackEntity(entry);else if(entry.object.taken&&entry.hologram>0){drawPickupHologram(entry,entry.hologram);holograms++}else drawPickupTrackEntity(entry)}
  const soundCandidates=entries.filter(entry=>entry.type!=='ramp'&&!entry.portal&&!entry.object.taken&&entry.object.respawnCount>entry.object.respawnSoundCount&&entry.object.respawnFxUntil>state.elapsed&&entry.rel>-14&&entry.rel<300);if(soundCandidates.length){soundCandidates.forEach(entry=>entry.object.respawnSoundCount=entry.object.respawnCount);const audible=soundCandidates.sort((a,b)=>Math.abs(a.rel)-Math.abs(b.rel))[0],pan=clamp(audible.p.x/Math.max(1,innerWidth)*2-1,-.88,.88),played=window.NyanAudio?.playPickupRespawn?.({pan,type:audible.type,distance:audible.rel});if(played){canvas.dataset.pickupRespawnAudioCount=String(Number(canvas.dataset.pickupRespawnAudioCount||0)+1);canvas.dataset.pickupRespawnAudioPan=pan.toFixed(3);canvas.dataset.pickupRespawnAudioType=audible.type}}
  canvas.dataset.trackEntityCount=String(entries.length);canvas.dataset.trackEntityOrder='far-to-near';canvas.dataset.trackEntityProjection='shared-road-tunnel-v1';canvas.dataset.trackEntityTunnel=String(entries.filter(entry=>entry.tunnel).length);canvas.dataset.pickupHolograms=String(holograms);canvas.dataset.pickupHologramModel='pre-respawn-forecast-v2';canvas.dataset.pickupHologramLeadMs=String(PICKUP_HOLOGRAM_LEAD_MS);canvas.dataset.pickupRespawnAudioModel='stereo-world-v1'
}
function drawCollectFx(){
  for(const f of state.collectFx){const r=racers[f.targetIndex],targetRel=r.distance-state.distance;if(f.targetIndex!==state.selected&&(targetRel<-20||targetRel>DRAW_DISTANCE))continue;const start=projectTrackEntity(f.z,f.lane),target=f.targetIndex===state.selected?{x:innerWidth*.5,y:Math.min(innerHeight*.9,roadPoint(2.5).y)+state.suspension,scale:1}:projectTrackEntity(r.distance,r.lane);if(!target||!Number.isFinite(target.x))continue;const t=1-f.life/f.max,ease=1-Math.pow(1-t,3),arc=Math.sin(t*Math.PI)*Math.min(80,Math.abs(target.x-start.x)*.18+34),x=start.x+(target.x-start.x)*ease,y=start.y+(target.y-start.y)*ease-arc,frame=f.type==='coin'?itemFrames[4]:f.type==='item'?catCanFrames[0]:itemFrames[7],size=(f.type==='coin'?58:82)*(1-t*.45)*Math.max(.45,start.scale);drawThroughTunnelPortal(f.z,()=>{ctx.save();ctx.strokeStyle=f.type==='coin'?'rgba(255,224,76,.7)':f.type==='item'?'rgba(255,114,190,.72)':'rgba(255,91,195,.72)';ctx.lineWidth=Math.max(2,size*.08);ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(start.x,start.y);ctx.quadraticCurveTo((start.x+target.x)/2,(start.y+target.y)/2-arc*1.35,x,y);ctx.stroke();ctx.restore();drawFrame(frame,x,y,size,Math.min(1,f.life/.12),t*6);
    if(t>.42){const label=`${r.name}  ${f.label}`;ctx.save();ctx.globalAlpha=Math.min(1,(t-.42)*3)*(f.life/.22<1?f.life/.22:1);ctx.font="900 12px 'Noto Sans JP'";const width=Math.max(78,ctx.measureText(label).width+20),ly=target.y-112*Math.max(.45,target.scale||1);ctx.fillStyle='rgba(12,8,35,.88)';ctx.strokeStyle=r.color;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(target.x-width/2,ly-16,width,25,12);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,target.x,ly-3);ctx.restore()}})}
}
function signaturePolygon(x,y,radius,sides,rotation){
  ctx.beginPath();for(let i=0;i<sides;i++){const angle=rotation+i*Math.PI*2/sides,px=x+Math.cos(angle)*radius,py=y+Math.sin(angle)*radius;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.closePath()
}
function drawSignatureAura(racer,x,y,height,alpha=1){
  const signature=racer?.signature;if(!signature||!(racer.signatureActive>0))return;const phase=state.elapsed*.0016+racer.signatureIndex*.37,pulse=.82+Math.sin(phase*7)*.12,lifePulse=Math.min(1,racer.signatureActive/.35),cx=x,cy=y-height*.43,rx=height*.5*pulse,ry=height*.58*pulse,color=signature.color,color2=signature.color2,visual=signature.visual,index=racer.signatureIndex;
  ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=alpha*(.46+.18*Math.sin(phase*5))*lifePulse;ctx.strokeStyle=color;ctx.fillStyle=color2;ctx.shadowColor=color;ctx.shadowBlur=Math.max(9,height*.16);ctx.lineWidth=Math.max(1.5,height*.018);ctx.setLineDash([Math.max(4,height*.07),Math.max(3,height*.045)]);ctx.lineDashOffset=-phase*28;ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  if(['hex','scarab','crystal','prism'].includes(visual)){ctx.globalAlpha=alpha*.38;ctx.strokeStyle=color2;signaturePolygon(cx,cy,height*.46,visual==='hex'?6:visual==='crystal'?8:5,phase);ctx.stroke();signaturePolygon(cx,cy,height*.33,visual==='hex'?6:visual==='crystal'?8:5,-phase*.72);ctx.stroke()}
  else if(['bloom','aroma','fruit','festival'].includes(visual)){ctx.globalAlpha=alpha*.5;for(let i=0;i<6;i++){const angle=phase+i*Math.PI/3,px=cx+Math.cos(angle)*height*.48,py=cy+Math.sin(angle)*height*.36;ctx.save();ctx.translate(px,py);ctx.rotate(angle);ctx.scale(1.6,.72);ctx.beginPath();ctx.arc(0,0,Math.max(2,height*.055),0,Math.PI*2);ctx.fill();ctx.restore()}}
  else if(['wave','wind','cloud','aurora','steam','tea'].includes(visual)){ctx.globalAlpha=alpha*.48;ctx.strokeStyle=color2;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(cx-height*.18+i*height*.16,cy+height*(.18-i*.13),height*(.27+i*.05),Math.PI*.12,Math.PI*.88);ctx.stroke()}}
  else if(['shadow','phantom'].includes(visual)){ctx.globalAlpha=alpha*.32;ctx.fillStyle=color2;for(let i=0;i<4;i++){const offset=(i+1)*height*.13;ctx.beginPath();ctx.ellipse(cx-offset,cy+Math.sin(phase+i)*height*.08,height*.29,height*.11,-.15,0,Math.PI*2);ctx.fill()}}
  else if(['clock','note'].includes(visual)){ctx.globalAlpha=alpha*.5;ctx.strokeStyle=color2;for(let i=0;i<8;i++){const angle=phase+i*Math.PI/4;ctx.beginPath();ctx.moveTo(cx+Math.cos(angle)*height*.37,cy+Math.sin(angle)*height*.42);ctx.lineTo(cx+Math.cos(angle)*height*.51,cy+Math.sin(angle)*height*.57);ctx.stroke()}}
  else{ctx.globalAlpha=alpha*.46;ctx.strokeStyle=color2;for(let i=0;i<5;i++){const angle=-phase*1.2+i*Math.PI*2/5,inner=height*.3,outer=height*(.48+(i%2)*.08);ctx.beginPath();ctx.moveTo(cx+Math.cos(angle)*inner,cy+Math.sin(angle)*inner);ctx.lineTo(cx+Math.cos(angle)*outer,cy+Math.sin(angle)*outer);ctx.stroke()}}
  ctx.globalAlpha=alpha*.52;ctx.fillStyle=color;ctx.font=`900 ${Math.max(12,height*.15)}px 'Fredoka','Noto Sans JP'`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowBlur=Math.max(6,height*.12);ctx.fillText(signature.glyph,cx,cy-height*.72-Math.sin(phase*5)*height*.035);ctx.restore();canvas.dataset.signatureVisual='procedural-29-theme-v1';canvas.dataset.signatureVisualLast=signature.visual;canvas.dataset.signatureVisualIndex=String(index)
}
function signatureSpriteAlpha(racer,alpha=1){return racer?.signatureActive>0&&['shadow','phantom'].includes(racer.signature?.visual)?alpha*(.64+.1*Math.sin(state.elapsed*.016)):alpha}
function drawOpponentItemAura(racer,x,y,height,alpha){
  if(racer.invincible>0){const frame=animatedFxFrame(itemFxFrames,4,(state.elapsed*.0022)%1);drawFrameCentered(frame,x,y-height*.43,height*1.32,alpha*.72,0)}
  if(racer.shield>0){ctx.save();ctx.globalAlpha=alpha*(.5+.18*Math.sin(state.elapsed*.011));ctx.strokeStyle='#78efff';ctx.lineWidth=Math.max(2,height*.028);ctx.shadowColor='#46eaff';ctx.shadowBlur=Math.max(8,height*.15);ctx.beginPath();ctx.ellipse(x,y-height*.43,height*.48,height*.56,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
}
function drawMiaThrowTell(x,y,height,alpha){
  const tell=MIA_THROW_TELEGRAPHS[miaNpc.throwKind];if(!tell||miaNpc.throwAnim<=0||miaNpc.throwReleased)return;
  const progress=clamp(miaNpc.throwAnim/Math.max(.01,miaNpc.throwReleaseAt),0,1),pulse=.74+.26*Math.sin(progress*Math.PI*5),tellHeight=Math.max(64,height),ringWidth=Math.max(2.4,tellHeight*.026),iconSize=clamp(tellHeight*.5,34,58),iconY=y-Math.max(height*.92,46);
  ctx.save();ctx.globalAlpha=alpha*(.54+pulse*.38);ctx.strokeStyle=tell.color;ctx.lineWidth=ringWidth;ctx.shadowColor=tell.glow;ctx.shadowBlur=Math.max(14,tellHeight*.2);ctx.setLineDash([Math.max(5,tellHeight*.065),Math.max(3,tellHeight*.04)]);ctx.lineDashOffset=-progress*tellHeight*.42;ctx.beginPath();ctx.ellipse(x,y-height*.43,tellHeight*(.5+progress*.07),tellHeight*(.6+progress*.08),0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle=tell.glow;ctx.beginPath();ctx.arc(x,iconY,iconSize*.62,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=Math.max(1.5,iconSize*.055);ctx.stroke();ctx.restore();
  const icon=catCanFrames[tell.frame];if(icon)drawFrameCentered(icon,x,iconY,iconSize,alpha,Math.sin(state.elapsed*.018)*.06);
  const fontSize=clamp(tellHeight*.16,10,13),labelY=iconY-iconSize*.72,labelWidth=Math.max(52,fontSize*4.7);ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=tell.dark;ctx.strokeStyle=tell.color;ctx.lineWidth=2;ctx.shadowColor=tell.glow;ctx.shadowBlur=10;ctx.beginPath();ctx.roundRect(x-labelWidth/2,labelY-fontSize*.82,labelWidth,fontSize*1.42,fontSize*.65);ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.font=`900 ${fontSize}px 'Noto Sans JP',sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(tell.label,x,labelY-fontSize*.08);ctx.restore()
}
function drawOpponentWeatherTrail(racer,x,y,height,alpha){
  if(racer.airborne||tunnelAt(racer.distance)||surfaceAtLane(racer.lane,racer.distance).id!=='road'||weatherDrivingFxFrames.length!==12)return;const weather=weatherDriveAt(racer.distance,surfaceAtLane(racer.lane,racer.distance)).id,type=weather==='snow'?'snow':weather==='wet'||weather==='damp'?'rain':null;if(!type)return;const speed=Math.min(1,(racer.aiVelocity||0)/185),phase=(state.elapsed*(type==='snow'?.0018:.0032)+(racer.aiDecisionSeed||0)*.13)%1,index=(type==='snow'?6:0)+Math.min(5,Math.floor(phase*6)),frame=weatherDrivingFxFrames[index],size=height*(type==='snow'?.68:.56)*(0.72+speed*.42),strength=weather==='damp'?.48:1;ctx.save();ctx.globalCompositeOperation='screen';drawFrameCentered(frame,x,y+height*.03,size,alpha*strength*(type==='snow'?.48:.64),0);ctx.restore()
}
function drawOpponents(){
  const player=racers[state.selected],order=raceOrder(),visible=raceContestants().map((r,i)=>({r,i,rel:r.distance-state.distance,rank:order.indexOf(r)+1})).filter(o=>o.r!==player&&o.rel>-8&&o.rel<480).sort((a,b)=>b.rel-a.rel);
  for(const o of visible){const isMia=o.r===miaNpc;if(!o.r.frames){if(isMia)ensureMiaSprite().catch(()=>{});else queueRacerSprite(o.i).catch(()=>{});continue}const side=o.rel<0?(o.i%2?.1:-.1):0,p=projectTrackEntity(o.r.distance,o.r.lane+side);if(!p.visible||p.x<-160||p.x>innerWidth+160||p.y<-260||p.y>innerHeight+120)continue;const alpha=distanceFadeAlpha(o.rel,330,470);if(alpha<=.02)continue;const laneTurn=(o.r.aiTargetLane-o.r.lane)*2.5,turn=Math.max(-3,Math.min(3,Math.round(p.tangent*9+laneTurn))),col=3+turn,frameIndex=col,throwDuration=miaNpc.throwDuration||difficultyProfile().miaThrowDuration,throwIndex=isMia&&miaNpc.throwAnim>0?Math.min(3,Math.floor(miaNpc.throwAnim/throwDuration*4)):-1;let frame=throwIndex>=0?miaNpc.throwFrames?.[throwIndex]:o.r.frames?.[frameIndex];if(!frame)frame=o.r.frames?.[frameIndex];
    const throwScale=throwIndex>=0?1.22:1,height=Math.max(24,Math.min(isMia?210:178,(isMia?178:166)*p.scale*throwScale)),jump=(o.r.jumpY||0)*Math.max(.45,p.scale),spriteY=p.y+6-jump;drawThroughTunnelPortal(o.r.distance,()=>{if(isMia){const tell=throwIndex>=0?MIA_THROW_TELEGRAPHS[miaNpc.throwKind]:null;ctx.save();ctx.globalAlpha=alpha*(.3+.16*Math.sin(state.elapsed*.012));ctx.fillStyle=tell?.glow||'#ff4da8';ctx.shadowColor=tell?.color||'#ff2d99';ctx.shadowBlur=35;ctx.beginPath();ctx.ellipse(p.x,spriteY-height*.46,height*.56,height*.68,0,0,7);ctx.fill();ctx.restore()}drawOpponentWeatherTrail(o.r,p.x,p.y,height,alpha);drawKartShadow(p.x,p.y,Math.max(9,height*.38)*(1-Math.min(.24,jump/180)),Math.max(.08,.16+p.scale*.18-jump*.0015)*alpha);drawSignatureAura(o.r,p.x,spriteY,height,alpha);drawOpponentItemAura(o.r,p.x,spriteY,height,alpha);drawFrameHeight(frame,p.x,spriteY,height,signatureSpriteAlpha(o.r,(o.r.hit>0?.62:1)*alpha),(o.r.spin>0?Math.sin(state.elapsed*.025)*.25:turn*.025));if(isMia&&throwIndex>=0)drawMiaThrowTell(p.x,spriteY,height,alpha);if(o.rel<300&&height>44&&alpha>.28)drawOpponentTag(p.x,spriteY-height-9,o.r,o.rank)});
  }
}
function drawProjectiles(){for(const shot of state.projectiles){const rel=shot.z-state.distance;if(rel<-12||rel>650)continue;const p=projectTrackEntity(shot.z,shot.lane),alpha=distanceFadeAlpha(rel,420,630);if(!p.visible||alpha<=.02)continue;const miaThrown=shot.kind==='miaBone'||shot.kind==='miaCan',frame=shot.kind==='miaBone'?catCanFrames[8]:shot.kind==='miaCan'?catCanFrames[9]:catCanFrames[5]||itemFrames[1],size=(miaThrown?70:68)*Math.max(.34,p.scale),rotation=miaThrown?(shot.age||0)*(shot.kind==='miaBone'?9.5:13)*(shot.approachSide||1):-.25;drawThroughTunnelPortal(shot.z,()=>{drawKartShadow(p.x,p.y+2,Math.max(3,size*.28),.18*alpha);drawFrameCentered(frame,p.x,p.y-size*.18,size,alpha,rotation)})}}
function drawPlayer(){
  const mobileRace=matchMedia('(pointer:coarse)').matches||innerWidth<820,r=racers[state.selected],hard=mobileRace?(state.drift>.4?1.75:Math.abs(state.steer)>.78?2.25:1.7):(state.drift>.4?2:Math.abs(state.steer)>.78?3:2),col=Math.max(0,Math.min(6,3+Math.round(state.steer*hard))),frame=r.frames?.[col];
  canvas.dataset.player=r.slug;canvas.dataset.playerCostume=activeCostumeId(r);canvas.dataset.frame=String(col);canvas.dataset.racerFrameOrder=RACER_FRAME_REMAPS[r.slug]?'remapped-14-direction':'native-14-direction';canvas.dataset.racerFrameMap=(RACER_FRAME_REMAPS[r.slug]||Array.from({length:14},(_,index)=>index)).join(',');canvas.dataset.speed=String(Math.round(state.speed));canvas.dataset.distance=state.distance.toFixed(1);canvas.dataset.drift=String(state.driftLevel);canvas.dataset.centrifugal=state.centrifugal.toFixed(3);canvas.dataset.jump=state.jumpY.toFixed(1);canvas.dataset.airborne=String(state.airborne);
  const shakeFactor=motionLevel(settings.screenShake),cameraDrop=jumpCameraDrop(),base=roadPoint(2.5),x=innerWidth*.5+state.steer*18+(Math.random()-.5)*state.shake*shakeFactor,groundY=Math.min(innerHeight*.9,base.y)+state.suspension+(Math.random()-.5)*state.shake*shakeFactor,shadowY=groundY+cameraDrop-state.suspension*.45,y=groundY-state.jumpY,bob=Math.sin(state.elapsed*(.012+state.speed*.00008))*(1.2+state.speed*.008)*motionLevel(settings.cameraMotion),squash=1-Math.min(.055,Math.abs(state.suspension)*.0035),targetHeight=mobileRace?Math.min(214,Math.max(156,innerHeight*.34)):Math.min(innerHeight*.29,218),height=targetHeight*squash,jumpScale=1-Math.min(.23,(state.jumpY+cameraDrop*.55)/190);
  drawKartShadow(x,shadowY,Math.min(92,height*.4)*jumpScale,Math.max(.08,.42-Math.min(.25,(state.jumpY+cameraDrop*.55)*.003)));drawSignatureAura(r,x,y+bob,height,1);if(state.boosting||state.invincible>0){const row=state.invincible>0?4:0,v=animatedFxFrame(itemFxFrames,row,(state.elapsed*.0022)%1),effectY=state.invincible>0?y-height*.46:y-height*.12;drawFrameCentered(v,x,effectY,state.invincible>0?218:176,state.invincible>0?.78:.92,state.invincible>0?0:Math.PI)}
  drawFrameHeight(frame,x,y+bob,height,signatureSpriteAlpha(r,1),-state.steer*(state.drift>0?.085:.04)+state.centrifugal*.018);
  if(state.shield>0){ctx.save();ctx.strokeStyle='#77efff';ctx.lineWidth=5;ctx.globalAlpha=.5+.25*Math.sin(state.elapsed*.01);ctx.shadowColor='#46eaff';ctx.shadowBlur=25;ctx.beginPath();ctx.ellipse(x,y-height*.42,Math.min(innerWidth*.15,165),height*.46,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
}
function environmentRacerInfluences(){
  const player=racers[state.selected],anchor=playerEffectAnchor(),points=[{x:anchor.x,y:anchor.y-anchor.height*.42,speed:state.speed,player:true}];
  for(const racer of raceContestants().filter(r=>r!==player&&Number.isFinite(r.distance)).sort((a,b)=>Math.abs(a.distance-state.distance)-Math.abs(b.distance-state.distance)).slice(0,5)){const rel=racer.distance-state.distance;if(rel<-10||rel>330)continue;const p=projectTrackEntity(racer.distance,racer.lane);if(p.visible)points.push({x:p.x,y:p.y-Math.max(30,118*p.scale)*.45,speed:racer.aiVelocity||0,player:false})}
  return points;
}
function scatterEnvironmentPoint(type,x,y,seed,influences){
  if(type!=='sakura'&&type!=='fireflies')return{x,y,force:0,rotation:0};let strongest=0,offsetX=0,offsetY=0;
  for(const kart of influences){const dx=x-kart.x,dy=y-kart.y,radius=(kart.player?205:145)*(type==='fireflies'?.92:1),distance=Math.hypot(dx,dy);if(distance>=radius)continue;const force=(1-distance/radius)*clamp(kart.speed/95,.22,1.25),side=Math.abs(dx)>4?Math.sign(dx):(seed%2?1:-1);offsetX+=side*force*(type==='sakura'?138:92);offsetY-=force*(type==='sakura'?58:34);strongest=Math.max(strongest,force)}
  return{x:x+offsetX,y:y+offsetY,force:strongest,rotation:(seed%2?1:-1)*strongest*1.15};
}
function drawCourseEnvironmentFx(layer='back'){
  const profile=COURSE_AMBIENCE_PROFILES[state.selectedCourse]||COURSE_AMBIENCE_PROFILES[0],inside=!!tunnelSectionAt(state.distance);if(layer==='back'){canvas.dataset.courseEnvironmentTheme=profile.id;canvas.dataset.courseEnvironmentFx=profile.effects.map(effect=>effect.type).join(',');canvas.dataset.courseEnvironmentCount='0';canvas.dataset.courseEnvironmentFrames='6-uniform-3x2';canvas.dataset.environmentInteraction='kart-repulsion-v1';canvas.dataset.environmentScatterCount='0'}
  if(inside){canvas.dataset.courseEnvironmentState='suppressed-tunnel';return}
  const rich=effectiveRichScenery(),quality=Math.max(.36,performanceProfile().scenery),reduced=settings.reducedEffects?.58:1,countFactor=(rich?1:.5)*quality*reduced,w=innerWidth,h=innerHeight,influences=environmentRacerInfluences();let drawn=0,scattered=0;
  profile.effects.forEach((effect,effectIndex)=>{const frames=courseVfxFrames[effect.type]||[];if(frames.length!==6)return;const baseCount=Math.max(1,Math.round(effect.count*countFactor)),count=layer==='front'?Math.max(1,Math.round(baseCount*.28)):baseCount,front=layer==='front',glow={fireflies:'#ffe86c',stardust:'#9cefff',snow:'#dffcff',bubbles:'#82f7ff'}[effect.type];ctx.save();ctx.filter=effect.filter||'none';ctx.globalCompositeOperation=['steam','sakura'].includes(effect.type)?'source-over':'screen';if(glow){ctx.shadowColor=glow;ctx.shadowBlur=front?14:8}
    for(let i=0;i<count;i++){const seed=i+effectIndex*19+(front?101:0),unit=((seed*73)%197)/197,phase=((state.elapsed*effect.speed*.08+seed*.173+state.distance*.00016)%1+1)%1,frameIndex=((Math.floor(state.elapsed*effect.speed+seed*.72)%6)+6)%6,frame=frames[frameIndex];let x=0,y=0,size=effect.size*(front?1.16:.76),alpha=effect.alpha*(front?.52:.78),rotation=0;
      if(effect.motion==='rise'){const cycle=front?260:410,rel=18+((seed*113-state.distance*(.82+(effect.parallax||0)))%cycle+cycle)%cycle,p=roadPoint(rel);if(!p.visible)continue;const side=seed%2?1:-1;size*=Math.max(.58,Math.min(1.42,p.scale*(front?1.46:1.18)));const rawX=p.cx+side*p.half*(effect.offset||2.3);x=clamp(rawX,size*.18,w-size*.18);y=p.y-phase*(effect.rise||110)*Math.max(.48,p.scale)+jumpCameraDrop();alpha*=distanceFadeAlpha(rel,front?185:310,front?280:430)*(phase<.1?phase/.1:1-phase*.18);rotation=side*(effect.type==='bubbles'?.035:.015)}
      else if(effect.motion==='fall'){x=unit*w+phase*(effect.drift||0)+(front?Math.sin(seed*2.7)*30:0);y=h*(-.12+phase*1.25);size*=.74+((seed*37)%43)/100+(front?.2:0);rotation=effect.type==='rain'?.08:Math.sin(state.elapsed*.0016+seed)*.34;alpha*=.72+((seed*29)%31)/100}
      else{x=unit*w+Math.sin(state.elapsed*.00045+seed*1.9)*(effect.drift||24);y=h*(.2+((seed*47)%61)/100*.62)+Math.cos(state.elapsed*.0006+seed)*18;size*=.72+((seed*31)%47)/100+(front?.16:0);rotation=Math.sin(state.elapsed*.0008+seed)*.26;alpha*=.68+((seed*17)%29)/100}
      const interaction=scatterEnvironmentPoint(effect.type,x,y,seed,influences);x=interaction.x;y=interaction.y;rotation+=interaction.rotation;if(interaction.force>.03){alpha*=1+Math.min(.25,interaction.force*.2);scattered++}if(x<-size||x>w+size||y<-size||y>h+size)continue;if(effect.motion==='rise')drawFrame(frame,x,y,size,alpha,rotation);else drawFrameCentered(frame,x,y,size,alpha,rotation);drawn++}
    ctx.restore()});
  canvas.dataset.courseEnvironmentCount=String(Number(canvas.dataset.courseEnvironmentCount||0)+drawn);canvas.dataset.environmentScatterCount=String(Number(canvas.dataset.environmentScatterCount||0)+scattered);canvas.dataset.courseEnvironmentAsset=drawn?'gpt-image-2-animated-v1':'loading';canvas.dataset.courseEnvironmentState=drawn?'active':'loading';
}
function drawParticles(layer='front'){
  for(const p of state.particles){
    if((p.layer||'front')!==layer)continue;
    const a=Math.max(0,p.life/p.max),progress=particleFxProgress(p);
    if(p.kind==='catCanImpact'){
      const frame=catCanFrames[10];drawAnimatedVfx(frame,p.x,p.y,p.size*(.72+(1-a)*.54),Math.min(1,a*1.7),p.rot,{center:true,blend:'source-over',kind:'cat-can-impact'})
    }else if(p.kind==='weatherTrail'){
      const row=p.weatherType==='snow'?1:0,index=row*6+Math.min(5,Math.floor(progress*6)),frame=weatherDrivingFxFrames[index];drawAnimatedVfx(frame,p.x,p.y,p.size*(1+(1-a)*(p.weatherType==='snow'?.48:.28)),Math.min(1,a*1.35*(p.alpha||1)),p.rot,{center:true,blend:'screen',kind:`weather-${p.weatherType}`})
    }else if(p.fxFrame!==undefined){
      const row=DRIVING_FX_ROW[p.fxFrame]??0,frame=animatedFxFrame(drivingFxFrames,row,progress),blend=row===1||row===4||row===5?'screen':'source-over';
      drawAnimatedVfx(frame,p.x,p.y,p.size,Math.min(1,a*1.55),p.rot,{center:false,blend,kind:`driving-row-${row}`});
    }else if(p.kind==='burst'){
      const frame=burstAnimationFrame(p,progress);
      drawAnimatedVfx(frame,p.x,p.y,p.size,Math.min(1,a*1.7),p.rot,{center:true,blend:'screen',kind:'burst'});
    }else if(p.kind==='dot'){
      const frame=burstAnimationFrame({burstFrame:burstFrameForColor(p.color)},progress);
      if(!drawAnimatedVfx(frame,p.x,p.y,p.size*8,Math.min(1,a*1.4),p.rot,{center:true,blend:'screen',kind:'dot-burst'})){recordProceduralVfx('dot');ctx.save();ctx.globalAlpha=a;ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=9;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,7);ctx.fill();ctx.restore()}
    }else if(p.kind==='smoke'){
      const frame=animatedFxFrame(drivingFxFrames,0,progress);if(!drawAnimatedVfx(frame,p.x,p.y,p.size*(1+(1-a)*.7),Math.min(1,a*1.35),p.rot,{center:true,blend:'source-over',kind:'smoke'})){recordProceduralVfx('smoke');ctx.save();ctx.globalAlpha=a*.5;ctx.fillStyle=p.color;ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.scale(1.18+(1-a)*.8,.82+(1-a)*.45);ctx.beginPath();ctx.arc(0,0,p.size*(1+(1-a)*1.35),0,7);ctx.fill();ctx.restore()}
    }else if(p.kind==='shockwave'){
      const frame=animatedFxFrame(drivingFxFrames,4,progress);if(!drawAnimatedVfx(frame,p.x,p.y,p.size*(1.18+(1-a)*.72),Math.min(1,a*1.45),p.rot,{center:true,blend:'screen',kind:'shockwave'})){recordProceduralVfx('shockwave');ctx.save();ctx.globalAlpha=a*.78;ctx.strokeStyle=p.color;ctx.lineWidth=Math.max(2,p.size*.028*a);ctx.beginPath();ctx.ellipse(p.x,p.y,p.size*(1.15+(1-a)*1.35),p.size*(.18+(1-a)*.16),0,0,Math.PI*2);ctx.stroke();ctx.restore()}
    }else if(p.kind==='dust'){
      const frame=animatedFxFrame(drivingFxFrames,3,progress);if(!drawAnimatedVfx(frame,p.x,p.y,p.size*(1+(1-a)*.62),Math.min(1,a*1.4),p.rot,{center:true,blend:'source-over',kind:'dust'})){recordProceduralVfx('dust');ctx.save();ctx.globalAlpha=a*.72;ctx.fillStyle=p.color;ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.scale(1.7-a*.45,.7+a*.25);ctx.beginPath();ctx.arc(0,0,p.size*(1+(1-a)*.95),0,7);ctx.fill();ctx.restore()}
    }else if(p.kind==='exhaust'){
      const frame=animatedFxFrame(drivingFxFrames,1,progress);if(!drawAnimatedVfx(frame,p.x,p.y,p.size*7.2,Math.min(1,a*1.7),p.rot+Math.PI*.5,{center:true,blend:'screen',kind:'exhaust'})){recordProceduralVfx('exhaust');ctx.save();ctx.globalAlpha=a;ctx.fillStyle=p.color;ctx.fillRect(p.x-p.size*a,p.y-p.size*a,p.size*a*2,p.size*a*2.5);ctx.restore()}
    }else if(p.kind==='spark'){
      const frame=animatedFxFrame(drivingFxFrames,5,progress);if(!drawAnimatedVfx(frame,p.x,p.y,p.size*18,Math.min(1,a*1.6),p.rot,{center:true,blend:'screen',kind:'drift-spark'})){recordProceduralVfx('spark');ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=p.color;ctx.lineWidth=p.size;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*.05,p.y-p.vy*.05);ctx.stroke();ctx.restore()}
    }else{
      const frame=animatedFxFrame(itemFxFrames,p.index??5,progress);
      drawAnimatedVfx(frame,p.x,p.y,p.size,Math.min(1,a*1.5),p.rot,{center:!!p.center,blend:'screen',kind:'item-vfx'});
    }
  }
}
function drawSignatureScreenFlash(){
  const feedback=signatureFeedbackState,flashFactor=motionLevel(settings.screenFlash);if(!(feedback.life>0)||flashFactor<=0){canvas.dataset.signatureFeedbackVisible='false';return}
  const age=feedback.duration-feedback.life,attack=clamp(age/.07,0,1),release=Math.pow(clamp(feedback.life/feedback.duration,0,1),.72),pulse=.82+Math.sin(age*34)*.18,alpha=feedback.strength*attack*release*pulse*flashFactor,centerX=innerWidth/2,centerY=innerHeight*.46;
  ctx.save();ctx.globalCompositeOperation='screen';const wash=ctx.createLinearGradient(0,0,innerWidth,innerHeight);wash.addColorStop(0,colorAlpha(feedback.color,alpha*.52));wash.addColorStop(.48,'rgba(255,255,255,0)');wash.addColorStop(1,colorAlpha(feedback.color2,alpha*.46));ctx.fillStyle=wash;ctx.fillRect(0,0,innerWidth,innerHeight);
  const halo=ctx.createRadialGradient(centerX,centerY,0,centerX,centerY,Math.max(innerWidth,innerHeight)*.72);halo.addColorStop(0,colorAlpha(feedback.color,alpha*.42));halo.addColorStop(.34,colorAlpha(feedback.color2,alpha*.18));halo.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=halo;ctx.fillRect(0,0,innerWidth,innerHeight);
  ctx.globalAlpha=alpha*.65;ctx.strokeStyle=feedback.color;ctx.lineWidth=Math.max(2,innerHeight*.006);ctx.shadowColor=feedback.color2;ctx.shadowBlur=Math.max(12,innerHeight*.035);ctx.strokeRect(-ctx.lineWidth,-ctx.lineWidth,innerWidth+ctx.lineWidth*2,innerHeight+ctx.lineWidth*2);ctx.restore();canvas.dataset.signatureFeedbackVisible='true';canvas.dataset.signatureFeedbackAlpha=alpha.toFixed(3)
}
function drawRace(){
  const cameraMotion=motionLevel(settings.cameraMotion),shakeFactor=motionLevel(settings.screenShake),roll=(state.drift>0?-state.steer*.008:0)*shakeFactor,bob=(Math.sin(state.elapsed*.012)*Math.min(1.5,state.speed/135)-state.suspension*.28+state.landingBounce)*cameraMotion,cameraDrop=jumpCameraDrop();
  beginSceneryFrameAudit();beginVfxFrameAudit();
  roadProjection=[];tunnelClipCount=0;buildRoadProjection();canvas.dataset.course=activeCourse.short;canvas.dataset.bgm=raceBgm?(raceBgm.paused?`paused:${musicError||'waiting'}`:'playing'):'none';canvas.dataset.taken=String(state.objects.filter(o=>o.taken).length);canvas.dataset.collectFx=String(state.collectFx.length);canvas.dataset.suspension=state.suspension.toFixed(2);canvas.dataset.nextTunnelPortal=String(firstTunnelPortalBetween(state.distance+DRAW_DISTANCE)??'none');canvas.dataset.jumpCamera=cameraDrop.toFixed(1);
  ctx.save();ctx.translate(innerWidth/2,innerHeight/2+bob);ctx.rotate(roll);ctx.translate(-innerWidth/2,-innerHeight/2);ctx.translate((Math.random()-.5)*state.shake*shakeFactor,(Math.random()-.5)*state.shake*shakeFactor);drawBackdrop();if(cameraDrop>0)ctx.translate(0,cameraDrop);drawRoad();drawWetRoadInteraction();drawSnowRoadInteraction();drawVergeSurfaceDetails();drawRoadSurfaceDetails();drawSnowTireTracks();drawRouteMedianSurfaceMarkers();drawRoadMotion();drawRouteGraphRoad();drawMode7Texture();drawJungleNearScenery();drawCourseNearScenery();drawGuardrails();drawDistantScenery();drawRouteMedianFeatures();drawVergeDetails();drawTracksideDecorations();drawTrackside();drawGates();drawStartArch();drawDistanceFog();drawTunnel();drawCourseDynamicGimmicks('ground');drawBiomeZoneLandmarks();if(state.debug.showCourseLimits)drawCourseLimits();drawTrackEntities();drawJungleRouteHazards();drawProjectiles();drawOpponents();drawCourseDynamicGimmicks('foreground');drawCourseRouteOcclusionVolume();drawJungleBiomeVolume('near');drawCollectFx();drawTunnelForeground();drawJungleCanopyOverlay();ctx.restore();canvas.dataset.tunnelOcclusion=String(tunnelClipCount);drawBiomeZoneLightShift();drawCourseEnvironmentFx('back');drawParticles('back');drawPlayer();drawCourseEnvironmentFx('front');drawParticles('front');const flashFactor=motionLevel(settings.screenFlash);if(state.flash>0&&flashFactor>0){ctx.fillStyle=`rgba(255,255,255,${state.flash*.65*flashFactor})`;ctx.fillRect(0,0,innerWidth,innerHeight)}drawSignatureScreenFlash();publishSceneryFrameAudit();publishVfxFrameAudit()
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
function render(t){ctx.clearRect(0,0,innerWidth,innerHeight);if(state.mode==='race')drawRace();else{drawMenu(t);if(state.mode==='course')drawCourseShowcaseMap(t)}}
function loop(t){const dt=Math.min(.033,(t-(state.last||t))/1000);state.last=t;if(window.__NYAN_REPLAY_AUDIT_ACTIVE__){requestAnimationFrame(loop);return}updateAdaptiveQuality(t);pollGamepad();update(dt);updateAudioScene();updateWardrobeRotation(t);render(t);if($('debugLiveMetrics'))$('debugLiveMetrics').textContent=`FPS ${canvas.dataset.qaFps||canvas.dataset.adaptiveFps||'--'} / P95 ${canvas.dataset.qaFrameP95||canvas.dataset.adaptiveP90||'--'}ms / ${activePerformanceKey().toUpperCase()}`;requestAnimationFrame(loop)}
requestAnimationFrame(loop);

let setRankAnimationTimer=null;
function playSetRankAnimation(meta){
  const current=$('setRank'),next=current.cloneNode(false);
  clearTimeout(setRankAnimationTimer);
  next.id='setRank';next.className=`rank-badge rank-${meta.rank.toLowerCase()} rank-animating`;next.setAttribute('aria-label',`${meta.rank}ランク`);next.dataset.motion='neon-kart-runner-v2';
  next.innerHTML=`<span class="rank-runner" aria-hidden="true"><i></i><b></b></span><span class="rank-letter">${meta.rank}</span><span class="rank-impact" aria-hidden="true"></span>`;
  current.replaceWith(next);
  setRankAnimationTimer=setTimeout(()=>next.classList.remove('rank-animating'),860);
}
