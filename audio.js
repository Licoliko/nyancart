(function(){
  'use strict';

  // Every racer/kart set has its own low-cost procedural engine.  The profile
  // names are intentionally product-facing: the sound is designed from the
  // machine concept instead of applying a random pitch to one shared motor.
  const MACHINE_PROFILES={
    'aruka-sham':{label:'PRISM TURBINE',concept:'透明感のある王室仕様クリスタルタービン',wave:'triangle',harmonicWave:'sine',baseHz:52,harmonic:2.02,filter:1050,resonance:4.5,roughness:.10,pulse:2.2,pulseDepth:5,air:.06},
    'kurone-night':{label:'LUNAR V-TWIN',concept:'低く唸って直線で牙をむく月夜のVツイン',wave:'sawtooth',harmonicWave:'square',baseHz:36,harmonic:1.51,filter:620,resonance:2.8,roughness:.28,pulse:7.1,pulseDepth:10,air:.04},
    'kohaku-taiga':{label:'4X4 BOXER',concept:'荒れた路面を叩く重量級ボクサーエンジン',wave:'square',harmonicWave:'sawtooth',baseHz:31,harmonic:2.01,filter:520,resonance:2.2,roughness:.42,pulse:5.4,pulseDepth:14,air:.08},
    'ghost-rex':{label:'PHANTOM DRIVE',concept:'実体が揺らぐような幽玄パルスドライブ',wave:'sine',harmonicWave:'triangle',baseHz:44,harmonic:2.71,filter:1380,resonance:8.5,roughness:.12,pulse:1.45,pulseDepth:19,air:.20},
    'nerine-korat':{label:'AQUA IMPELLER',concept:'水流が回転する滑らかなアクアインペラ',wave:'sine',harmonicWave:'sine',baseHz:47,harmonic:1.98,filter:920,resonance:10,roughness:.09,pulse:3.1,pulseDepth:5,air:.18},
    'fumika-scotty':{label:'AIRMAIL ROTOR',concept:'軽いプロペラ音を重ねたエアメールローター',wave:'triangle',harmonicWave:'square',baseHz:58,harmonic:1.49,filter:1240,resonance:3.8,roughness:.15,pulse:9.2,pulseDepth:8,air:.22},
    'bell-savanna':{label:'SAVANNA V8',concept:'猛獣の咆哮を思わせる太いV8レーサー',wave:'sawtooth',harmonicWave:'sawtooth',baseHz:29,harmonic:2.48,filter:570,resonance:2.4,roughness:.38,pulse:6.2,pulseDepth:13,air:.05},
    'popo-munch':{label:'CLOCKWORK MICRO',concept:'歯車が細かく刻む高回転からくりモーター',wave:'square',harmonicWave:'triangle',baseHz:66,harmonic:1.99,filter:1550,resonance:7.5,roughness:.14,pulse:12.5,pulseDepth:16,air:.04},
    'marron-maine':{label:'STEAM PISTON',concept:'圧を溜めて伸びる蒸気ピストン機関',wave:'sawtooth',harmonicWave:'square',baseHz:27,harmonic:1.50,filter:480,resonance:4,roughness:.52,pulse:3.8,pulseDepth:18,air:.34},
    'milfi-ragdoll':{label:'TEA ELECTRIC',concept:'静かで上品なティークルーザー用電動機',wave:'sine',harmonicWave:'triangle',baseHz:61,harmonic:2.00,filter:1420,resonance:5.5,roughness:.06,pulse:2.6,pulseDepth:4,air:.08},
    'yukine-silky':{label:'CRYSTAL SLEIGH',concept:'氷晶倍音が澄んで伸びるクリスタル駆動',wave:'triangle',harmonicWave:'sine',baseHz:55,harmonic:3.01,filter:1720,resonance:12,roughness:.05,pulse:1.9,pulseDepth:8,air:.14},
    'rhythm-sphynx':{label:'NEON BASS DRIVE',concept:'回転数に同期して脈打つネオンベースモーター',wave:'sawtooth',harmonicWave:'square',baseHz:41,harmonic:2.00,filter:1120,resonance:9,roughness:.18,pulse:8.0,pulseDepth:20,air:.05},
    'tick-abyssinian':{label:'CHRONO ESCAPEMENT',concept:'脱進機のように正確なクロノパルス機関',wave:'square',harmonicWave:'sine',baseHz:63,harmonic:2.50,filter:1480,resonance:11,roughness:.08,pulse:10.0,pulseDepth:18,air:.03},
    'flora-turkishvan':{label:'BLOOM BIO DRIVE',concept:'花が開くように柔らかく立ち上がる生体電動機',wave:'triangle',harmonicWave:'sine',baseHz:50,harmonic:1.76,filter:1080,resonance:6,roughness:.09,pulse:2.0,pulseDepth:6,air:.12},
    'reska-americancurl':{label:'RESCUE RALLY',concept:'復帰加速が鋭いタフなレスキューラリー機関',wave:'square',harmonicWave:'sawtooth',baseHz:39,harmonic:2.01,filter:760,resonance:3.2,roughness:.32,pulse:6.7,pulseDepth:12,air:.08},
    'cleo-mau':{label:'SCARAB DRILL',concept:'地面を削る粒の粗いスカラベドリル駆動',wave:'sawtooth',harmonicWave:'square',baseHz:34,harmonic:3.02,filter:690,resonance:13,roughness:.48,pulse:11.3,pulseDepth:9,air:.06},
    'ciel-norwegian':{label:'CLOUD JET',concept:'風を吸い込んで高く抜けるクラウドジェット',wave:'sine',harmonicWave:'sawtooth',baseHz:48,harmonic:2.02,filter:1850,resonance:4,roughness:.08,pulse:1.3,pulseDepth:5,air:.42},
    'sucre-persian':{label:'BAKE OVEN TURBO',concept:'熱を焼き上げる温かい連続燃焼ターボ',wave:'triangle',harmonicWave:'sawtooth',baseHz:45,harmonic:1.50,filter:980,resonance:4.8,roughness:.24,pulse:4.7,pulseDepth:11,air:.14},
    'moka-oriental':{label:'TRACER SERVO',concept:'最短ラインをなぞる静かな高精度サーボ',wave:'sine',harmonicWave:'triangle',baseHz:59,harmonic:2.24,filter:1510,resonance:8,roughness:.05,pulse:5.0,pulseDepth:5,air:.05},
    'garnet-bengal':{label:'DIGGER EX',concept:'装甲越しに響く重低音ドリルエンジン',wave:'sawtooth',harmonicWave:'square',baseHz:25,harmonic:2.98,filter:510,resonance:11,roughness:.58,pulse:9.6,pulseDepth:13,air:.05},
    'rinka-somali':{label:'CLOUD ROTOR R',concept:'追い風をつかんで伸びる高出力エアローター',wave:'triangle',harmonicWave:'sawtooth',baseHz:53,harmonic:2.00,filter:1660,resonance:5,roughness:.10,pulse:3.4,pulseDepth:7,air:.36},
    'stella-russianblue':{label:'AURORA CRYSTAL',concept:'オーロラの光が揺れる精密クリスタルモーター',wave:'sine',harmonicWave:'triangle',baseHz:57,harmonic:2.99,filter:1900,resonance:14,roughness:.04,pulse:1.15,pulseDepth:15,air:.16},
    'honey-british':{label:'HONEYCOMB BUZZ',concept:'蜂の羽音を丸く整えたハニカムブースター',wave:'square',harmonicWave:'triangle',baseHz:62,harmonic:1.51,filter:1320,resonance:8.5,roughness:.16,pulse:14.2,pulseDepth:12,air:.10},
    'liber-birman':{label:'BOOKLINER PHANTOM',concept:'ページをめくる風と幻影倍音のブックライナー',wave:'sine',harmonicWave:'sawtooth',baseHz:46,harmonic:2.65,filter:1580,resonance:9.5,roughness:.11,pulse:1.7,pulseDepth:17,air:.28}
  };
  const FALLBACK={label:'NYAN RACING MOTOR',concept:'軽快な猫型レーシングモーター',wave:'triangle',harmonicWave:'sine',baseHz:48,harmonic:2,filter:1000,resonance:5,roughness:.15,pulse:3,pulseDepth:6,air:.1};

  class NyanAudioSystem{
    constructor(){
      this.context=null;this.master=null;this.compressor=null;this.engineBus=null;this.rivalBus=null;this.sfxBus=null;this.raceTone=null;this.tunnelSend=null;this.tunnelConvolver=null;this.tunnelReturn=null;this.engine=null;
      this.machineSlug='';this.machineStats=null;this.running=false;this.mix={master:.8,effects:.72,muted:false};
      this.lastPlayed=new Map();this.previewTimer=0;this.noiseBuffer=null;this.rivalVoices=new Map();this.maxRivalVoices=3;this.dopplerEnabled=true;this.tunnelReverbEnabled=true;this.tunnelMix=0;this.surfaceAudio='dry';this.surfaceAudioLevel=0;this.surfacePan=0;this.enginePan=0;this.pickupRespawnPan=0;this.pickupRespawnCount=0;this.supported=!!(window.AudioContext||window.webkitAudioContext);
      const unlock=()=>this.unlock();
      addEventListener('pointerdown',unlock,{passive:true});addEventListener('touchstart',unlock,{passive:true});addEventListener('keydown',unlock);
    }
    ensure(){
      if(!this.supported)return null;if(this.context)return this.context;
      const AudioCtx=window.AudioContext||window.webkitAudioContext,context=new AudioCtx();this.context=context;
      this.master=context.createGain();this.compressor=context.createDynamicsCompressor();this.engineBus=context.createGain();this.rivalBus=context.createGain();this.sfxBus=context.createGain();this.raceTone=context.createBiquadFilter();this.tunnelSend=context.createGain();this.tunnelConvolver=context.createConvolver();this.tunnelReturn=context.createGain();
      this.engineBus.gain.value=.82;this.rivalBus.gain.value=.38;this.sfxBus.gain.value=.78;this.master.gain.value=0;
      this.compressor.threshold.value=-18;this.compressor.knee.value=16;this.compressor.ratio.value=4;this.compressor.attack.value=.004;this.compressor.release.value=.24;
      this.raceTone.type='lowpass';this.raceTone.frequency.value=15000;this.raceTone.Q.value=.35;this.tunnelSend.gain.value=.0001;this.tunnelReturn.gain.value=.32;this.tunnelConvolver.buffer=this.makeTunnelImpulse(.56);
      this.engineBus.connect(this.raceTone);this.rivalBus.connect(this.raceTone);this.raceTone.connect(this.master);this.raceTone.connect(this.tunnelSend);this.tunnelSend.connect(this.tunnelConvolver);this.tunnelConvolver.connect(this.tunnelReturn);this.tunnelReturn.connect(this.master);this.sfxBus.connect(this.master);this.master.connect(this.compressor);this.compressor.connect(context.destination);
      this.noiseBuffer=this.makeNoiseBuffer(.72);this.applyMix();return context;
    }
    unlock(){const context=this.ensure();if(context?.state==='suspended')context.resume().catch(()=>{});return context}
    applyMix(){if(!this.context||!this.master)return;const value=this.mix.muted?0:Math.max(0,Math.min(1,this.mix.master)),effects=Math.max(0,Math.min(1,this.mix.effects)),now=this.context.currentTime;this.master.gain.setTargetAtTime(value,now,.025);this.engineBus.gain.setTargetAtTime(.82*effects,now,.025);this.rivalBus.gain.setTargetAtTime(.38*effects,now,.025);this.sfxBus.gain.setTargetAtTime(.78*effects,now,.025)}
    setMix(master,effects,muted=false){this.mix={master:Number(master)||0,effects:Number(effects)||0,muted:!!muted};this.applyMix()}
    profile(slug=this.machineSlug){return MACHINE_PROFILES[slug]||FALLBACK}
    getMachineInfo(slug){const p=this.profile(slug);return{slug,label:p.label,concept:p.concept,wave:p.wave,baseHz:p.baseHz,pulse:p.pulse,roughness:p.roughness,air:p.air}}
    makeNoiseBuffer(seconds=.5){const context=this.context,length=Math.max(1,Math.floor(context.sampleRate*seconds)),buffer=context.createBuffer(1,length,context.sampleRate),data=buffer.getChannelData(0);let last=0;for(let i=0;i<length;i++){const white=Math.random()*2-1;last=last*.72+white*.28;data[i]=last}return buffer}
    makeTunnelImpulse(seconds=.56){
      const context=this.context,length=Math.max(1,Math.floor(context.sampleRate*seconds)),buffer=context.createBuffer(2,length,context.sampleRate),taps=[.031,.067,.113,.181];
      for(let channel=0;channel<2;channel++){const data=buffer.getChannelData(channel);for(let i=0;i<length;i++){const t=i/context.sampleRate,decay=Math.exp(-t*7.4),flutter=.72+Math.sin(t*175+channel*.9)*.18;data[i]=(Math.random()*2-1)*decay*flutter*.23}for(let i=0;i<taps.length;i++){const index=Math.min(length-1,Math.floor(taps[i]*context.sampleRate));data[index]+=(i%2?-.31:.38)*(1-i*.13)*(channel?-.92:1)}}return buffer;
    }
    setTunnel(enabled=false,amount=enabled?1:0){
      const mix=enabled&&this.tunnelReverbEnabled?Math.max(0,Math.min(1,Number(amount)||0)):0;this.tunnelMix=mix;if(!this.context||!this.raceTone||!this.tunnelSend)return;
      const now=this.context.currentTime;this.raceTone.frequency.setTargetAtTime(15000-(mix*12600),now,mix>.01?.12:.18);this.raceTone.Q.setTargetAtTime(.35+mix*.8,now,.14);this.tunnelSend.gain.setTargetAtTime(.0001+mix*.27,now,mix>.01?.11:.2);
    }
    setMachine(slug,stats={}){if(slug===this.machineSlug&&this.engine)return;this.machineSlug=slug;this.machineStats=stats;this.destroyEngine();if(this.context)this.createEngine()}
    createEngine(){
      const context=this.ensure();if(!context)return;const p=this.profile(),now=context.currentTime;
      const output=context.createGain(),enginePanner=context.createStereoPanner?.()||context.createGain(),filter=context.createBiquadFilter(),oscA=context.createOscillator(),oscB=context.createOscillator(),gainA=context.createGain(),gainB=context.createGain();
      const noise=context.createBufferSource(),noiseFilter=context.createBiquadFilter(),noiseGain=context.createGain(),skid=context.createBufferSource(),skidFilter=context.createBiquadFilter(),skidGain=context.createGain(),surfaceNoise=context.createBufferSource(),surfaceFilter=context.createBiquadFilter(),surfaceGain=context.createGain(),surfacePanner=context.createStereoPanner?.()||context.createGain(),lfo=context.createOscillator(),lfoGain=context.createGain();
      output.gain.value=.0001;filter.type='lowpass';filter.frequency.value=p.filter;filter.Q.value=p.resonance;
      oscA.type=p.wave;oscB.type=p.harmonicWave;oscA.frequency.value=p.baseHz;oscB.frequency.value=p.baseHz*p.harmonic;gainA.gain.value=.5;gainB.gain.value=.16;
      noise.buffer=this.noiseBuffer;noise.loop=true;noiseFilter.type='bandpass';noiseFilter.frequency.value=300;noiseFilter.Q.value=.8;noiseGain.gain.value=.0001;
      skid.buffer=this.noiseBuffer;skid.loop=true;skidFilter.type='bandpass';skidFilter.frequency.value=1800;skidFilter.Q.value=3.6;skidGain.gain.value=.0001;
      surfaceNoise.buffer=this.noiseBuffer;surfaceNoise.loop=true;surfaceFilter.type='bandpass';surfaceFilter.frequency.value=1200;surfaceFilter.Q.value=.8;surfaceGain.gain.value=.0001;
      lfo.type='sine';lfo.frequency.value=p.pulse;lfoGain.gain.value=p.pulseDepth;lfo.connect(lfoGain);lfoGain.connect(oscA.detune);lfoGain.connect(oscB.detune);
      oscA.connect(gainA);oscB.connect(gainB);gainA.connect(filter);gainB.connect(filter);filter.connect(output);
      noise.connect(noiseFilter);noiseFilter.connect(noiseGain);noiseGain.connect(output);skid.connect(skidFilter);skidFilter.connect(skidGain);skidGain.connect(output);surfaceNoise.connect(surfaceFilter);surfaceFilter.connect(surfaceGain);surfaceGain.connect(surfacePanner);surfacePanner.connect(this.engineBus);output.connect(enginePanner);enginePanner.connect(this.engineBus);
      [oscA,oscB,noise,skid,surfaceNoise,lfo].forEach(node=>node.start(now));this.engine={output,enginePanner,filter,oscA,oscB,gainA,gainB,noise,noiseFilter,noiseGain,skid,skidFilter,skidGain,surfaceNoise,surfaceFilter,surfaceGain,surfacePanner,lfo,lfoGain};
    }
    destroyEngine(){if(!this.engine)return;const now=this.context?.currentTime||0;try{this.engine.output.gain.cancelScheduledValues(now);this.engine.output.gain.setTargetAtTime(.0001,now,.025);this.engine.surfaceGain.gain.setTargetAtTime(.0001,now,.025)}catch{}const old=this.engine;setTimeout(()=>{for(const key of ['oscA','oscB','noise','skid','surfaceNoise','lfo'])try{old[key].stop()}catch{};for(const key of ['output','enginePanner','surfacePanner'])try{old[key].disconnect()}catch{}},170);this.engine=null}
    startEngine(slug,stats,{silent=false}={}){this.unlock();this.setMachine(slug,stats);if(!this.engine)this.createEngine();this.running=true;if(!silent)this.play('engineStart',{intensity:.8})}
    stopEngine(){this.running=false;if(this.engine&&this.context)this.engine.output.gain.setTargetAtTime(.0001,this.context.currentTime,.09);this.stopRivals();this.setTunnel(false)}
    updateEngine(data={}){
      const rawSpeed=Math.max(0,Number(data.speed)||0),requestedSurface=['wet','damp','snow'].includes(data.weatherSurface)?data.weatherSurface:'dry',roadContact=data.surface==='road'&&!data.airborne,requestedLevel=roadContact&&data.running&&!data.paused?Math.min(1,rawSpeed/180):0;this.surfaceAudio=requestedSurface;this.surfaceAudioLevel=requestedLevel*(requestedSurface==='dry'?0:1);this.surfacePan=Math.max(-.82,Math.min(.82,Number(data.surfacePan)||0));this.enginePan=Math.max(-.24,Math.min(.24,Number(data.enginePan)||0));
      if(!this.context)return;if(!this.engine&&this.machineSlug)this.createEngine();if(!this.engine)return;
      const p=this.profile(),e=this.engine,now=this.context.currentTime,speed=rawSpeed,n=Math.min(1.22,speed/215),throttle=data.accelerating?1:data.braking?.1:.38,boost=data.boosting||data.turbo>0,offroad=data.surface&&data.surface!=='road',material=data.trackMaterial||'asphalt',materialNoise=material==='jungle-mud'?.034:material==='jungle-wood'?.018:material==='jungle-stone'?.01:material==='jungle-emerald'?.006:0,materialTone=material==='jungle-wood'?-120:material==='jungle-mud'?-190:material==='jungle-stone'?90:material==='jungle-emerald'?240:0,materialPulse=material==='jungle-wood'?(Math.sin(now*(16+n*18))+1)*.006:material==='jungle-stone'?(Math.sin(now*(25+n*12))+1)*.002:0,audible=this.running&&data.running&&!data.paused;
      const statSpeed=(this.machineStats?.speed||80)-80,statAccel=(this.machineStats?.accel||80)-80;
      const fundamental=Math.max(20,p.baseHz+(n*(74+statSpeed*.16))+(boost?17:0)+(data.airborne?8:0));
      e.oscA.frequency.setTargetAtTime(fundamental,now,.035);e.oscB.frequency.setTargetAtTime(fundamental*p.harmonic+(statAccel*.08),now,.045);
      e.filter.frequency.setTargetAtTime(p.filter+n*1500+(boost?620:0)+(offroad?-180:0),now,.045);e.filter.Q.setTargetAtTime(p.resonance+(boost?1.8:0),now,.06);
      e.gainA.gain.setTargetAtTime(.33+throttle*.18+n*.08,now,.035);e.gainB.gain.setTargetAtTime(.09+n*.11+(boost?.08:0),now,.045);
      e.noiseFilter.frequency.setTargetAtTime(Math.max(90,210+n*760+(offroad?190:0)+materialTone),now,.05);e.noiseGain.gain.setTargetAtTime(.006+p.roughness*(.035+n*.075)+(offroad?.07:0)+(boost?p.air*.1:0)+materialNoise*n+materialPulse*n,now,.04);
      e.skidGain.gain.setTargetAtTime(data.drifting&&speed>55?.045+Math.min(.12,Math.abs(data.steer||0)*.08):.0001,now,.035);e.skidFilter.frequency.setTargetAtTime(1200+n*1700,now,.04);
      const slip=Math.min(.5,Math.abs(Number(data.weatherSlip)||0)),wet=requestedSurface==='wet'||requestedSurface==='damp',snow=requestedSurface==='snow',crunch=(Math.sin(now*(24+n*31))+Math.sin(now*(12+n*17)+1.3)+2)*.25,surfaceLevel=(!audible||!roadContact)? .0001:wet?(.014+n*.062+slip*.16)*(requestedSurface==='damp'?.58:1):snow?.012+n*.055*(.42+crunch*.96)+slip*.11:.0001,surfacePan=this.surfacePan,enginePan=this.enginePan;e.surfaceFilter.frequency.setTargetAtTime(wet?1450+n*1850+slip*1200:230+n*390+crunch*260,now,wet?.045:.025);e.surfaceFilter.Q.setTargetAtTime(wet?.7:1.55,now,.05);e.surfaceGain.gain.setTargetAtTime(surfaceLevel,now,wet?.06:.025);if(e.surfacePanner.pan)e.surfacePanner.pan.setTargetAtTime(surfacePan,now,.055);if(e.enginePanner.pan)e.enginePanner.pan.setTargetAtTime(enginePan,now,.075);this.surfaceAudioLevel=surfaceLevel;
      e.output.gain.setTargetAtTime(audible?.08+n*.055+(throttle*.018):.0001,now,audible?.06:.045);
    }
    createRivalVoice(slug,stats={}){
      const context=this.ensure();if(!context||!this.rivalBus)return null;const p=this.profile(slug),now=context.currentTime,output=context.createGain(),filter=context.createBiquadFilter(),panner=context.createStereoPanner?.()||context.createGain(),oscA=context.createOscillator(),oscB=context.createOscillator(),gainA=context.createGain(),gainB=context.createGain(),lfo=context.createOscillator(),lfoGain=context.createGain();
      output.gain.value=.0001;filter.type='lowpass';filter.frequency.value=p.filter*.72;filter.Q.value=Math.max(.8,p.resonance*.56);if(panner.pan)panner.pan.value=0;
      oscA.type=p.wave;oscB.type=p.harmonicWave;oscA.frequency.value=p.baseHz;oscB.frequency.value=p.baseHz*p.harmonic;gainA.gain.value=.29;gainB.gain.value=.105;
      lfo.type='sine';lfo.frequency.value=Math.max(.5,p.pulse*.82);lfoGain.gain.value=Math.max(1,p.pulseDepth*.42);lfo.connect(lfoGain);lfoGain.connect(oscA.detune);lfoGain.connect(oscB.detune);
      oscA.connect(gainA);oscB.connect(gainB);gainA.connect(filter);gainB.connect(filter);filter.connect(output);output.connect(panner);panner.connect(this.rivalBus);[oscA,oscB,lfo].forEach(node=>node.start(now));
      const voice={slug,stats,p,output,filter,panner,oscA,oscB,gainA,gainB,lfo,lfoGain,lastSeen:performance.now(),retireTimer:0,doppler:1};this.rivalVoices.set(slug,voice);return voice;
    }
    destroyRivalVoice(slug,voice=this.rivalVoices.get(slug)){
      if(!voice)return;clearTimeout(voice.retireTimer);for(const key of ['oscA','oscB','lfo'])try{voice[key].stop()}catch{};for(const node of [voice.output,voice.filter,voice.panner])try{node.disconnect()}catch{};if(this.rivalVoices.get(slug)===voice)this.rivalVoices.delete(slug);
    }
    retireRivalVoice(slug,voice=this.rivalVoices.get(slug),delay=360){
      if(!voice||!this.context)return;voice.output.gain.setTargetAtTime(.0001,this.context.currentTime,.08);if(voice.retireTimer)return;voice.retireTimer=setTimeout(()=>this.destroyRivalVoice(slug,voice),delay);
    }
    stopRivals(){for(const [slug,voice] of this.rivalVoices)this.retireRivalVoice(slug,voice,240)}
    updateRivals(rivals=[],options={}){
      if(!this.context)return;const running=!!options.running&&!options.paused&&this.running,selected=running?rivals.slice(0,this.maxRivalVoices):[],active=new Set(selected.map(r=>r.slug));
      if(!running){for(const voice of this.rivalVoices.values())voice.output.gain.setTargetAtTime(.0001,this.context.currentTime,.07);return}
      for(const rival of selected){
        let voice=this.rivalVoices.get(rival.slug);if(!voice)voice=this.createRivalVoice(rival.slug,rival.stats);if(!voice)continue;clearTimeout(voice.retireTimer);voice.retireTimer=0;voice.lastSeen=performance.now();
        const p=voice.p,now=this.context.currentTime,speed=Math.max(0,Number(rival.speed)||0),n=Math.min(1.18,speed/215),signedDistance=Number(rival.relativeDistance)||0,distance=Math.abs(signedDistance),range=Math.max(45,Number(rival.maxDistance)||125),proximity=Math.pow(Math.max(0,1-distance/range),1.35),boost=!!rival.boosting,hit=!!rival.hit,sideGain=signedDistance<0?1.08:.94,level=Math.max(.0001,proximity*(.021+n*.024+(boost?.012:0))*sideGain*(hit?.68:1)),relativeSpeed=Number(rival.relativeSpeed)||0,closingSpeed=-Math.sign(signedDistance||1)*relativeSpeed,doppler=1+(Math.max(-80,Math.min(80,closingSpeed))/1900)*(.35+proximity*.65),fundamental=Math.max(20,p.baseHz+n*68+(boost?14:0));
        voice.doppler=doppler;voice.oscA.frequency.setTargetAtTime(fundamental*doppler,now,.055);voice.oscB.frequency.setTargetAtTime(fundamental*p.harmonic*doppler,now,.065);voice.filter.frequency.setTargetAtTime(Math.max(180,(p.filter*.58+n*1050+(boost?280:0))*(.44+proximity*.56)),now,.07);voice.output.gain.setTargetAtTime(level,now,.075);if(voice.panner.pan)voice.panner.pan.setTargetAtTime(Math.max(-1,Math.min(1,Number(rival.pan)||0)),now,.065);
      }
      for(const [slug,voice] of this.rivalVoices)if(!active.has(slug))this.retireRivalVoice(slug,voice);
    }
    getRivalDebug(){return[...this.rivalVoices.values()].filter(voice=>!voice.retireTimer).map(voice=>voice.slug).slice(0,this.maxRivalVoices)}
    getAcousticsDebug(){return{tunnelMix:this.tunnelMix,surfaceAudio:this.surfaceAudio,surfaceAudioLevel:this.surfaceAudioLevel,surfacePan:this.surfacePan,enginePan:this.enginePan,pickupRespawnPan:this.pickupRespawnPan,pickupRespawnCount:this.pickupRespawnCount,rivals:[...this.rivalVoices.values()].filter(voice=>!voice.retireTimer).slice(0,this.maxRivalVoices).map(voice=>({slug:voice.slug,doppler:voice.doppler}))}}
    allowed(name,interval=0){const now=performance.now(),last=this.lastPlayed.get(name)||-Infinity;if(now-last<interval)return false;this.lastPlayed.set(name,now);return true}
    tone({frequency=440,to=frequency,type='sine',duration=.12,gain=.12,delay=0,attack=.006,detune=0,bus=null,pan=0}={}){
      const context=this.unlock();bus=bus||this.sfxBus;if(!context||!bus)return;const start=context.currentTime+delay,end=start+duration,osc=context.createOscillator(),amp=context.createGain(),panner=context.createStereoPanner?.()||null;osc.type=type;osc.detune.value=detune;osc.frequency.setValueAtTime(Math.max(20,frequency),start);osc.frequency.exponentialRampToValueAtTime(Math.max(20,to),end);amp.gain.setValueAtTime(.0001,start);amp.gain.exponentialRampToValueAtTime(Math.max(.0002,gain),start+Math.min(attack,duration*.3));amp.gain.exponentialRampToValueAtTime(.0001,end);osc.connect(amp);if(panner){panner.pan.value=Math.max(-1,Math.min(1,Number(pan)||0));amp.connect(panner);panner.connect(bus)}else amp.connect(bus);osc.onended=()=>{try{amp.disconnect()}catch{}try{panner?.disconnect()}catch{}};osc.start(start);osc.stop(end+.03)
    }
    noise({duration=.16,gain=.11,frequency=900,to=frequency,type='bandpass',delay=0,Q=1.2}={}){
      const context=this.unlock();if(!context||!this.sfxBus)return;const start=context.currentTime+delay,end=start+duration,source=context.createBufferSource(),filter=context.createBiquadFilter(),amp=context.createGain();source.buffer=this.noiseBuffer;filter.type=type;filter.Q.value=Q;filter.frequency.setValueAtTime(Math.max(40,frequency),start);filter.frequency.exponentialRampToValueAtTime(Math.max(40,to),end);amp.gain.setValueAtTime(.0001,start);amp.gain.exponentialRampToValueAtTime(Math.max(.0002,gain),start+.008);amp.gain.exponentialRampToValueAtTime(.0001,end);source.connect(filter);filter.connect(amp);amp.connect(this.sfxBus);source.start(start);source.stop(end+.03)
    }
    previewMachine(slug,stats){clearTimeout(this.previewTimer);this.previewTimer=setTimeout(()=>{this.setMachine(slug,stats);if(!this.allowed('machinePreview',190))return;const p=this.profile(slug);this.tone({frequency:p.baseHz*2.2,to:p.baseHz*4.1,type:p.wave,duration:.25,gain:.055});this.tone({frequency:p.baseHz*p.harmonic*2,to:p.baseHz*p.harmonic*3.1,type:p.harmonicWave,duration:.2,gain:.026,delay:.035});if(p.air>.2)this.noise({duration:.22,gain:p.air*.045,frequency:420,to:1700})},150)}
    playPickupRespawn({pan=0,type='item',distance=0}={}){if(this.mix.muted||this.mix.effects<=0||!this.allowed('pickupRespawn',72))return false;const safePan=Math.max(-.88,Math.min(.88,Number(pan)||0)),range=Math.max(0,Math.abs(Number(distance)||0)),falloff=Math.max(.14,Math.pow(Math.max(0,1-range/285),1.28)),base=type==='coin'?1040:type==='pad'?660:880,level=(type==='item'?.027:.021)*falloff;this.pickupRespawnPan=safePan;this.pickupRespawnCount++;this.tone({frequency:base,to:base*1.34,type:'sine',duration:.105,gain:level,attack:.004,pan:safePan});this.tone({frequency:base*1.52,to:base*1.9,type:'triangle',duration:.11,gain:level*.52,delay:.038,attack:.005,pan:safePan*.92});return true}
    play(name,{intensity=1,variant=0}={}){
      if(this.mix.muted||this.mix.effects<=0)return;const k=Math.max(.35,Math.min(1.5,intensity));
      switch(name){
        case'uiMove':if(!this.allowed(name,55))return;this.tone({frequency:430,to:580,duration:.055,gain:.045*k,type:'triangle'});break;
        case'uiConfirm':this.tone({frequency:520,to:720,duration:.1,gain:.075*k,type:'triangle'});this.tone({frequency:780,to:980,duration:.13,gain:.052*k,delay:.055,type:'sine'});break;
        case'uiBack':this.tone({frequency:390,to:250,duration:.1,gain:.055*k,type:'triangle'});break;
        case'countdown':this.tone({frequency:variant?720:560,to:variant?760:540,duration:.16,gain:.10*k,type:'square'});break;
        case'go':this.tone({frequency:440,to:980,duration:.34,gain:.12*k,type:'sawtooth'});this.noise({duration:.28,gain:.08*k,frequency:420,to:2200});break;
        case'engineStart':{const p=this.profile();this.tone({frequency:p.baseHz,to:p.baseHz*2.6,duration:.38,gain:.07*k,type:p.wave});this.noise({duration:.19,gain:.035*k,frequency:170,to:680});break}
        case'coin':this.tone({frequency:880,to:1120,duration:.08,gain:.09*k,type:'sine'});this.tone({frequency:1320,to:1580,duration:.11,gain:.07*k,delay:.06,type:'sine'});break;
        case'roulette':if(!this.allowed(name,62))return;this.tone({frequency:620+(variant%4)*95,to:690+(variant%4)*95,duration:.045,gain:.035*k,type:'square'});break;
        case'itemGet':this.tone({frequency:520,to:1040,duration:.2,gain:.10*k,type:'triangle'});this.tone({frequency:780,to:1560,duration:.16,gain:.06*k,delay:.08});break;
        case'boost':this.noise({duration:.38,gain:.12*k,frequency:260,to:2600});this.tone({frequency:85,to:240,duration:.32,gain:.10*k,type:'sawtooth'});break;
        case'driftCharge':if(!this.allowed(name,280))return;this.tone({frequency:760+variant*170,to:1040+variant*240,duration:.11,gain:.055*k,type:'square'});break;
        case'ramp':this.noise({duration:.28,gain:.10*k,frequency:240,to:1750});this.tone({frequency:120,to:520,duration:.34,gain:.09*k,type:'triangle'});break;
        case'land':this.tone({frequency:96,to:42,duration:.22,gain:.16*k,type:'sine'});this.noise({duration:.23,gain:.13*k,frequency:520,to:100});break;
        case'collision':if(!this.allowed(name,180))return;this.noise({duration:.17,gain:.16*k,frequency:1150,to:180,Q:.7});this.tone({frequency:130,to:55,duration:.16,gain:.12*k,type:'square'});break;
        case'rocket':this.noise({duration:.42,gain:.14*k,frequency:1700,to:230});this.tone({frequency:180,to:72,duration:.36,gain:.08*k,type:'sawtooth'});break;
        case'lockWarning':if(!this.allowed(name,variant>1?210:390))return;this.tone({frequency:variant>1?1160:880,to:variant>1?1440:1080,duration:.085,gain:.075*k,type:'square'});this.tone({frequency:variant>1?820:620,to:variant>1?1040:780,duration:.075,gain:.052*k,delay:.09,type:'square'});break;
        case'shield':this.tone({frequency:420,to:1260,duration:.35,gain:.09*k,type:'sine'});this.tone({frequency:690,to:1840,duration:.28,gain:.055*k,delay:.035});break;
        case'star':for(let i=0;i<4;i++)this.tone({frequency:[660,830,990,1320][i],to:[830,990,1320,1660][i],duration:.14,gain:.06*k,delay:i*.055,type:'triangle'});break;
        case'lightning':this.noise({duration:.48,gain:.18*k,frequency:3400,to:190,Q:.5});for(let i=0;i<5;i++)this.tone({frequency:1600-i*170,to:320+i*60,duration:.06,gain:.035*k,delay:i*.035,type:'square'});break;
        case'rankUp':this.tone({frequency:520,to:820,duration:.13,gain:.075*k,type:'triangle'});this.tone({frequency:820,to:1240,duration:.16,gain:.055*k,delay:.06});break;
        case'rankDown':this.tone({frequency:480,to:210,duration:.2,gain:.065*k,type:'sawtooth'});break;
        case'mia':this.tone({frequency:92,to:54,duration:.48,gain:.15*k,type:'sawtooth'});this.tone({frequency:690,to:1380,duration:.4,gain:.07*k,delay:.14,type:'square'});this.noise({duration:.52,gain:.11*k,frequency:2200,to:240});break;
        case'finish':this.noise({duration:.35,gain:.095*k,frequency:340,to:2300});for(let i=0;i<4;i++)this.tone({frequency:[523,659,784,1047][i],to:[600,760,900,1200][i],duration:.22,gain:.07*k,delay:i*.085,type:'triangle'});break;
      }
    }
  }

  window.NyanAudio=new NyanAudioSystem();
  window.NYAN_MACHINE_AUDIO_PROFILES=MACHINE_PROFILES;
})();
