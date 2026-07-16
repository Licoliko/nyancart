import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {execFile as execFileCallback} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath,pathToFileURL} from 'node:url';

const execFile=promisify(execFileCallback),ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),PACKAGE_MODE=process.argv.includes('--package'),SITE_ROOT=PACKAGE_MODE?path.join(ROOT,'output','NYAN_CART'):ROOT,OUTPUT=path.join(ROOT,'output','quality-audit'),REPORT_ONLY=process.argv.includes('--report-only');
const VIEWPORTS=[{name:'desktop',width:1440,height:900},{name:'mobile-landscape',width:844,height:390},{name:'mobile-portrait',width:390,height:844}],SCENES=['menu','settings','kart','course','difficulty','soundTest','race','tunnel','finish'];
const candidates=process.platform==='win32'?['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','C:/Program Files/Google/Chrome/Application/chrome.exe']:[process.env.CHROME_BIN,'/usr/bin/google-chrome','/usr/bin/chromium','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
let browserPath='';for(const candidate of candidates)try{await fs.access(candidate);browserPath=candidate;break}catch{}
if(!browserPath)throw new Error('Chrome / Edge が見つかりません。ブラウザ自動検査を実行できません。');

await fs.mkdir(OUTPUT,{recursive:true});const results=[],base=pathToFileURL(path.join(SITE_ROOT,'index.html')).href;
if(!REPORT_ONLY)for(const viewport of VIEWPORTS){
  for(const scene of SCENES){
    const screenshot=path.join(OUTPUT,`${viewport.name}-${scene}.png`),profile=path.join(os.tmpdir(),`nyan-cart-qa-${process.pid}-${viewport.name}-${scene}`),url=`${base}?qaScene=${scene}`;
    const args=['--headless=new','--disable-features=Vulkan','--no-first-run','--no-default-browser-check','--disable-background-networking','--allow-file-access-from-files','--hide-scrollbars',...(viewport.name==='desktop'?[]:['--touch-events=enabled']),`--user-data-dir=${profile}`,`--window-size=${viewport.width},${viewport.height}`,`--screenshot=${screenshot}`,'--dump-dom','--virtual-time-budget=6500',url];
    let stdout='',stderr='',errorText='';try{({stdout,stderr}=await execFile(browserPath,args,{encoding:'utf8',maxBuffer:32*1024*1024,timeout:30000}))}catch(error){stdout=error.stdout||'';stderr=error.stderr||'';errorText=error.message||String(error)}
    const attr=name=>{const match=stdout.match(new RegExp(`${name}="([^"]*)"`));return match?.[1]||''},ready=attr('data-qa-ready')==='true',status=ready?(attr('data-qa-scene-status')||'fail'):'fail',failures=ready?(attr('data-qa-scene-failures')||'none'):`automation-not-ready${errorText?`: ${errorText}`:''}`;
    results.push({viewport:viewport.name,width:viewport.width,height:viewport.height,scene,status,failures,overflow:Number(attr('data-qa-overflow')||0),stderr:stderr.split(/\r?\n/).filter(line=>/ERROR|FATAL|Uncaught/i.test(line)).slice(0,6)});await fs.rm(profile,{recursive:true,force:true}).catch(()=>{})
  }
}

{
  const profile=path.join(os.tmpdir(),`nyan-cart-qa-${process.pid}-full-report`),screenshot=path.join(OUTPUT,'quality-report.png'),url=`${base}?qualityAudit=1`,args=['--headless=new','--disable-gpu','--disable-software-rasterizer','--disable-features=UseSkiaRenderer,Vulkan','--no-first-run','--no-default-browser-check','--disable-background-networking','--allow-file-access-from-files','--hide-scrollbars',`--user-data-dir=${profile}`,'--window-size=1440,900',`--screenshot=${screenshot}`,'--dump-dom','--virtual-time-budget=25000',url];let stdout='',errorText='';try{({stdout}=await execFile(browserPath,args,{encoding:'utf8',maxBuffer:32*1024*1024,timeout:80000}))}catch(error){stdout=error.stdout||'';errorText=error.message||String(error)}const attr=name=>{const match=stdout.match(new RegExp(`${name}="([^"]*)"`));return match?.[1]||''},status=attr('data-quality-status')||'fail',failures=attr('data-quality-failures')||'unknown',warnings=attr('data-quality-warnings')||'unknown';results.push({viewport:'desktop',width:1440,height:900,scene:'quality-report',status,failures:`fail:${failures} / warn:${warnings}${errorText?` / ${errorText}`:''}`,overflow:0,stderr:[]});await fs.rm(profile,{recursive:true,force:true}).catch(()=>{})
}

const summary={pass:results.filter(r=>r.status==='pass').length,warn:results.filter(r=>r.status==='warn').length,fail:results.filter(r=>r.status==='fail').length},report={generatedAt:new Date().toISOString(),browser:browserPath,siteRoot:SITE_ROOT,summary,viewports:VIEWPORTS,results},stem=PACKAGE_MODE?'package-browser-quality-report':REPORT_ONLY?'quality-report-check':'browser-quality-report';await fs.writeFile(path.join(OUTPUT,`${stem}.json`),JSON.stringify(report,null,2),'utf8');const escape=value=>`"${String(value??'').replaceAll('"','""')}"`,csv='\ufeffviewport,scene,status,overflow,failures\r\n'+results.map(r=>[r.viewport,r.scene,r.status,r.overflow,r.failures].map(escape).join(',')).join('\r\n');await fs.writeFile(path.join(OUTPUT,`${stem}.csv`),csv,'utf8');
console.log(`NYAN CART browser audit: ${summary.pass} PASS / ${summary.warn} WARN / ${summary.fail} FAIL`);console.log(OUTPUT);if(summary.fail)process.exitCode=1;
