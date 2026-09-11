const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
// The cover screen belongs to the moving left half in this fold direction.
const coverFace=$('.right-leaf .outside'),rearFace=$('.left-leaf .rear');
$('.left-leaf').append(coverFace);
$('.right-leaf').append(rearFace);
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths = {
 camera:'<path d="M14 4l2 3h4v13H4V7h4l2-3z"/><circle cx="12" cy="13" r="4"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
 phone:'<path d="M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4c0 2-2 2-3 2C10 20 4 14 3 6c0-1 0-3 2-3z"/>',
 messages:'<path d="M21 11a9 8 0 0 1-13 7l-5 3 1-6a9 8 0 1 1 17-4z"/>',
 music:'<path d="M9 18V5l11-2v13M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="16" rx="3" ry="2"/>',
 safari:'<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5z"/>',
 settings:'<path d="m9 3-1 3-3 1-2 5 3 2 1 4 5 3 3-3 4-1 2-5-3-2-1-4-5-3z"/><circle cx="12" cy="12" r="3"/>',
 maps:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zM9 3v16M15 5v16"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 5v7l5 3"/>',
 notes:'<path d="M5 7h14M5 11h14M5 15h11M5 19h8"/>',
 files:'<path d="M3 6h7l2 3h9v11H3z"/>',
 back:'<path d="m14 5-7 7 7 7"/>',
 wifi:'<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8 16a6 6 0 0 1 8 0"/><circle cx="12" cy="20" r="1"/>',
 signal:'<path d="M4 20v-3M9 20v-7M14 20V9M19 20V4"/>',
 facetime:'<rect x="2" y="6" width="13" height="12" rx="3"/><path d="m15 10 7-4v12l-7-4z"/>',
 health:'<path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-5 5 3 11 8 15 5-4 13-10 8-15z"/>',
 reminders:'<path d="M10 6h10M10 12h10M10 18h10"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
 calculator:'<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M8 6h8M8 11h1M14 11h1M8 15h1M14 15h1M8 19h1M14 19h1"/>',
};
function icon(name){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.files}</svg>`;}
const apps=[
 ['facetime','FaceTime','#53d164'],['calendar','Calendar','#fff'],['photos','Photos','#fff'],['camera','Camera','#686f7d'],
 ['mail','Mail','#4398ef'],['notes','Notes','#fff'],['clock','Clock','#222'],['maps','Maps','#69b1a0'],
 ['files','Files','#82a7db'],['tv','TV','#252732'],['health','Health','#f67991'],['reminders','Reminders','#eee'],
 ['shortcuts','Shortcuts','#8266d7'],['store','App Store','#408fee'],['wallet','Wallet','#444b58'],['settings','Settings','#939ca9']
];
const dockApps=[['phone','Phone','#4bce6c'],['safari','Safari','#459be2'],['messages','Messages','#4ed471'],['music','Music','#ef526e']];
const photoBase='https://www.apple.com/newsroom/images/2026/09/apple-unveils-iphone-duo/article/';
const photos=[
 {src:photoBase+'Apple-iPhone-Duo-48MP-Fusion-Ultra-Wide-camera-260909_big.jpg.large.jpg',alt:'Outdoor portrait with colorful objects'},
 {src:photoBase+'Apple-iPhone-Duo-48MP-Fusion-Main-camera-260909_big.jpg.large.jpg',alt:'Portrait near a rock formation'},
 {src:photoBase+'Apple-iPhone-Duo-2x-Telephoto-260909_big.jpg.large.jpg',alt:'Portrait in an open landscape'}
];
const state={angle:180,experience:'home',app:'home',finish:'dark',locked:false,dark:false,brightness:100,note:'A little room for big ideas.\n\nTry folding the phone while you write.\nYour note stays with you.',photo:null,captured:false,playing:false,speed:1,rotated:false,track:false,calc:'0',transitionId:0};
let motion=null,lastStamp=0,cyclePhase=0,scrubTarget=null;
const smoothStep=t=>{const x=Math.max(0,Math.min(1,t));return x*x*x*(x*(x*6-15)+10);};
function appIcon(app){const [id,name,color]=app;let content=id==='calendar'?'<small>WED</small>9':id==='photos'?'✳':id==='tv'?'tv':id==='store'?'A':id==='wallet'?'▰':id==='shortcuts'?'◈':icon(id);return `<button class="app-item" data-app="${id}" aria-label="Open ${name}"><span class="app-square ${id}-icon" style="--app-color:${color}">${content}</span><span>${name}</span></button>`;}
function statusBar(){return `<div class="statusbar"><span>9:41</span><span class="status-icons">${icon('signal')}${icon('wifi')}<i class="battery"></i></span></div>`;}
function widgets(){return `<div class="widget-column"><div class="weather-widget"><div class="city">Cupertino</div><div class="temperature">24°</div><div class="weather-condition">☀ Sunny &nbsp; H:27° L:18°</div></div><div class="calendar-widget"><small>WEDNESDAY</small><strong>9</strong><div class="calendar-event">A little time to explore<br>10:00 – 11:00</div></div><div class="battery-widget"><span>◉ &nbsp; ◉ &nbsp; ◉</span><b>97%</b></div></div>`;}
function home(){return `<div class="home-layout">${widgets()}<div class="app-section"><div class="top-widgets"><div class="tiny-weather"><small>☀ Weather</small><div class="weather-bars">▁ ▂ ▄ ▃ ▂ ▅ ▄</div><span>7% &nbsp;24°</span></div><div class="tiny-calendar"><small>WEDNESDAY</small><b>9</b><span>Explore something new<br>10:00–11:00</span></div></div><div class="app-grid">${apps.map(appIcon).join('')}</div><div class="dots"><b>•</b> •</div></div></div><div class="dock">${dockApps.map(appIcon).join('')}</div>`;}
function photoGrid(){return `<h2 class="photo-heading">Your moments.</h2><div class="photo-subtitle">Sample camera photos · Apple</div><div class="photo-grid">${[...photos,...photos].map((p,i)=>`<button data-photo="${i%3}" aria-label="View ${p.alt}"><img src="${p.src}" alt="${p.alt}" loading="lazy" referrerpolicy="no-referrer"></button>`).join('')}</div>`;}
function mail(){return `<div class="mail-item"><b>Alex Morgan</b><br>A weekend worth remembering<p>These photos turned out so well. Let’s do it again soon.</p><small>9:32 AM</small></div><div class="mail-item"><b>Design notes</b><br>A little more space<p>Room for your ideas, and everything beside them.</p><small>Yesterday</small></div><div class="mail-item"><b>Your itinerary</b><p>A quiet morning. A new place to explore.</p><small>Tuesday</small></div>`;}
function settings(){return `<div class="settings-row">Dark appearance<input data-setting="dark" class="toggle" type="checkbox" aria-label="Dark appearance" ${state.dark?'checked':''}></div><label class="settings-row">Brightness<input data-setting="brightness" type="range" min="35" max="100" value="${state.brightness}"></label><div class="settings-row">Display<span>${state.angle<35?'Outer':'Inner'}</span></div><div class="settings-row">About<span>Interactive concept</span></div>`;}
function appContent(){switch(state.app){
 case 'photos':return photoGrid();
 case 'mail':return mail();
 case 'notes':return `<textarea class="notes-text" aria-label="Your note" placeholder="Write something…">${escapeHTML(state.note)}</textarea>`;
 case 'settings':return settings();
 case 'weather':return '<div class="weather-page"><h2>Cupertino</h2><strong>24°</strong><p>Sunny · H:27° L:18°</p><div class="weather-hours">Now ☀ &nbsp; 11 ☀ &nbsp; 12 ☀ &nbsp; 13 ☀</div><p>Sample weather for this demo</p></div>';
 case 'calendar':return '<div class="simple-page"><span style="color:#d76772">WEDNESDAY, SEPTEMBER</span><h2 style="font-size:70px;margin:5px">9</h2><p>10:00 &nbsp; A little time to explore<br>14:00 &nbsp; Make something new</p></div>';
 case 'clock':return '<div class="simple-page"><h2 style="font-size:64px">9:41</h2><p>Cupertino · Wednesday</p><button data-app="standby">Open StandBy</button></div>';
 case 'music':return `<div class="simple-page"><div style="font-size:65px;color:#b78bdb">♫</div><h2>Room to breathe</h2><p>Ambient track · Demo controls</p><button data-action="music">${state.track?'Ⅱ Pause':'▶ Play'}</button><p>${state.track?'Playback preview active':'Ready when you are'}</p></div>`;
 case 'messages':return '<div class="simple-page"><h2>Messages</h2><p>Alex: Have you tried opening it all the way?</p><p style="background:#5d84e3;color:white;padding:15px;border-radius:15px">A whole new perspective.</p><p>Sample conversation</p></div>';
 case 'safari':return '<div class="simple-page"><span>◉</span><h2>A little curiosity.</h2><p>Explore the official device details.</p><a href="https://www.apple.com/iphone-duo/" target="_blank" rel="noreferrer">Apple’s iPhone Duo page ↗</a></div>';
 case 'phone':return '<div class="simple-page"><h2>Phone</h2><div style="font-size:28px;line-height:1.8;letter-spacing:15px">1 2 3<br>4 5 6<br>7 8 9<br>＊ 0 #</div><p>Calling is not available in this demo.</p></div>';
 case 'facetime':return '<div class="simple-page"><h2>FaceTime</h2><p>Hands-free on a folded display.</p><button data-action="seated">Try the seated position</button><p>No real call is placed.</p></div>';
 default:{const app=apps.find(a=>a[0]===state.app);return `<div class="simple-page"><h2>${escapeHTML(app?.[1]||'Explore')}</h2><p>This is a visual preview. Try Photos, Notes, Camera, Settings, or Split View for interactive screens.</p><button data-app="home">Back home</button></div>`;}
 }}
function screen(){let view='';if(state.locked){view=`<div class="lock-screen"><p>Wednesday, September 9</p><strong>9:41</strong><button data-action="unlock">Tap to unlock</button></div>`;}
 else if(state.app==='home')view=home();
 else if(state.app==='standby')view='<div class="standby"><div class="standby-clock">09<br>41</div><div class="standby-info">WEDNESDAY<br>SEPTEMBER 9<div class="temperature">24°</div>☀ Sunny</div></div>';
 else if(state.app==='split')view=`<div class="app-page"><div class="split-view"><section class="split-pane"><div class="app-top"><button class="app-back" data-app="home">${icon('back')}Home</button><strong>Photos</strong></div><div class="app-body">${photoGrid()}</div></section><section class="split-pane"><div class="app-top"><strong>Notes</strong><button class="app-back" data-app="home">Done</button></div><div class="app-body"><textarea class="notes-text" aria-label="Split view note">${escapeHTML(state.note)}</textarea></div></section></div></div>`;
 else if(state.app==='camera')view=`<div class="app-page"><div class="camera-view"><div class="app-top"><button class="app-back" data-app="home">${icon('back')}Home</button><span>CAMERA PREVIEW</span><span>1×</span></div><div class="camera-preview"><img src="${photos[0].src}" alt="Sample camera view" referrerpolicy="no-referrer"><div class="camera-grid"></div><span class="camera-message">${state.captured?'Photo captured in this demo':'Sample scene · No camera access'}</span></div><div class="camera-controls"><span class="camera-mode">PHOTO</span><button class="shutter" data-action="capture" aria-label="Take sample photo"></button><button class="app-back" data-app="photos">Photos</button></div></div></div>`;
 else view=`<div class="app-page"><div class="app-top"><button class="app-back" data-app="home">${icon('back')}Home</button><strong>${escapeHTML(([...apps,...dockApps].find(a=>a[0]===state.app)||['',state.app])[1])}</strong><span></span></div><div class="app-body">${appContent()}</div></div>`;
 if(state.photo!==null)view+=`<div class="photo-full"><img src="${photos[state.photo].src}" alt="${photos[state.photo].alt}"><button data-action="close-photo" aria-label="Close photo">×</button></div>`;
 return `<div class="phone-ui ${state.dark?'dark-screen':''}"><div class="wallpaper"></div>${statusBar()}${view}<button class="home-indicator" data-app="home" aria-label="Return to home screen"></button></div>`;
}
function renderScreens(){const html=screen();for(const id of ['inner-left','inner-right','outer-screen'])$('#'+id).innerHTML=html;$$('[data-experience]').forEach(b=>{const active=b.dataset.experience===state.experience;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});updateInert();}
function updateInert(){const closed=state.angle<45;$('#inner-left').inert=closed;$('#inner-right').inert=closed;$('#outer-screen').inert=!closed;}
function changeApp(name){state.app=name;state.locked=false;state.photo=null;if(['home','photos','split','camera','standby'].includes(name))state.experience=name;renderScreens();updateLabels();}
function updateLabels(){const a=state.angle;$('#angle-value').textContent=Math.round(a);$('#fold-slider').value=String(a);$('#fold-state').textContent=a>172?'Fully open':a<8?'Folded closed':a>70&&a<110?'Halfway open':'In motion';$('#stage-label').textContent=a<45?'OUTER DISPLAY · COMPACT':state.rotated?'INNER DISPLAY · PORTRAIT':'INNER DISPLAY · LANDSCAPE';$('#continuity-progress').style.width=(a/180*100)+'%';$('#transition-description').textContent=a<35?'Your active app continues on the outer display. The dock stays within reach.':a<125?'A soft blur follows the hinge. Widgets reveal as the larger screen opens.':'The app grid settles on the right. Widgets fill the extra room on the left.';$('#state-caption').textContent=state.app==='split'?'Two apps. One continuous experience.':a<35?'Everything you need, folded into one hand.':'More space. Same familiar feeling.';$$('[data-angle]').forEach(b=>b.classList.toggle('selected',Math.abs(Number(b.dataset.angle)-a)<7));}
function setAngle(value){
 state.angle=Math.max(0,Math.min(180,Number(value)));
 const a=state.angle,fold=180-a,device=$('#device');
 // The left leaf closes toward the right; the right leaf remains anchored.
 device.style.setProperty('--left-angle',fold+'deg');
 device.style.setProperty('--right-angle','0deg');
 device.style.setProperty('--center-shift',(-155*(1-a/180))+'px');
 device.style.setProperty('--fold-shade',String(Math.sin(fold*Math.PI/180)*.52));
 const reveal=smoothStep((a-30)/110);
 device.style.setProperty('--widget-opacity',String(reveal));
 // Negative X settles to zero: content reveals from left to right.
 device.style.setProperty('--widget-x',(-44*(1-reveal))+'px');
 device.style.setProperty('--content-x',(-18*(1-reveal))+'px');
 device.style.setProperty('--widget-blur',((1-reveal)*10)+'px');
 device.style.setProperty('--inner-blur',(Math.sin(reveal*Math.PI)*2)+'px');
 device.style.setProperty('--outer-blur',(smoothStep((a-12)/65)*9)+'px');
 updateLabels();updateInert();
}
function stop(){state.playing=false;motion=null;scrubTarget=null;$('#play-text').textContent='Play the fold';$('#play-icon').textContent='▶';}
function animateTo(target){stop();motion={from:state.angle,to:target,start:performance.now(),duration:Math.max(450,2400*Math.abs(target-state.angle)/180)/state.speed};}
function play(){if(state.playing){stop();return;}motion=null;scrubTarget=null;state.playing=true;cyclePhase=Math.acos(Math.max(-1,Math.min(1,state.angle/90-1)));$('#play-text').textContent='Pause animation';$('#play-icon').textContent='Ⅱ';}
function frame(stamp){
 const dt=Math.min(Math.max(0,(stamp-lastStamp)/1000),.06);lastStamp=stamp;
 if(scrubTarget!==null){const next=state.angle+(scrubTarget-state.angle)*(1-Math.exp(-22*dt));if(Math.abs(next-scrubTarget)<.02){setAngle(scrubTarget);scrubTarget=null;}else setAngle(next);}
 else if(motion){const p=Math.min(1,(stamp-motion.start)/motion.duration);setAngle(motion.from+(motion.to-motion.from)*smoothStep(p));if(p===1)motion=null;}
 else if(state.playing){cyclePhase+=dt*Math.PI/2.8*state.speed;setAngle(90*(1+Math.cos(cyclePhase)));}
 requestAnimationFrame(frame);
}
function fit(){const stage=$('#stage');const scale=Math.min(1.12,(stage.clientWidth-48)/(state.rotated?440:640),(stage.clientHeight-104)/(state.rotated?640:440));$('#device-wrap').style.setProperty('--device-scale',String(Math.max(.28,scale)));}
$('#fold-slider').addEventListener('input',e=>{const target=Number(e.target.value);stop();scrubTarget=target;});
$$('[data-angle]').forEach(b=>b.addEventListener('click',()=>animateTo(Number(b.dataset.angle))));
$('#play-button').addEventListener('click',play);
$('#speed').addEventListener('change',e=>state.speed=Number(e.target.value));
$$('[data-experience]').forEach(b=>b.addEventListener('click',()=>changeApp(b.dataset.experience)));
$$('[data-finish]').forEach(b=>b.addEventListener('click',()=>{state.finish=b.dataset.finish;$('#device').classList.toggle('light-finish',state.finish==='light');$$('[data-finish]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b));});$('#finish-name').textContent=state.finish==='light'?'Star White':'Night Sky';}));
$('#rotate-button').addEventListener('click',()=>{state.rotated=!state.rotated;$('#device').style.setProperty('--rotate',state.rotated?'-90deg':'0deg');updateLabels();fit();});
$('#reset-button').addEventListener('click',()=>{stop();state.locked=false;state.rotated=false;state.photo=null;$('#device').style.setProperty('--rotate','0deg');changeApp('home');animateTo(180);fit();});
$('#power-button').addEventListener('click',()=>{state.locked=!state.locked;renderScreens();});
$('#camera-button').addEventListener('click',()=>changeApp('camera'));
$('#about-button').addEventListener('click',()=>$('#about').showModal());$('#close-about').addEventListener('click',()=>$('#about').close());
$('#stage').addEventListener('click',e=>{const el=e.target.closest('[data-app],[data-photo],[data-action]');if(!el)return;if(el.dataset.app){changeApp(el.dataset.app);return;}if(el.dataset.photo!==undefined){state.photo=Number(el.dataset.photo);renderScreens();return;}switch(el.dataset.action){case 'close-photo':state.photo=null;renderScreens();break;case 'unlock':state.locked=false;renderScreens();break;case 'capture':state.captured=true;renderScreens();$$('.camera-preview').forEach(x=>x.classList.add('capture-flash'));break;case 'music':state.track=!state.track;renderScreens();break;case 'seated':animateTo(90);break;}});
$('#stage').addEventListener('input',e=>{if(e.target.matches('.notes-text')){state.note=e.target.value;$$('.notes-text').forEach(x=>{if(x!==e.target)x.value=state.note;});}if(e.target.dataset.setting==='brightness'){state.brightness=Number(e.target.value);$$('.screen-canvas,.outer-display').forEach(x=>x.style.filter=`brightness(${state.brightness/100})`);}});
$('#stage').addEventListener('change',e=>{if(e.target.dataset.setting==='dark'){state.dark=e.target.checked;renderScreens();}});
document.addEventListener('keydown',e=>{if(e.target.closest('input,select,textarea,button,a,dialog'))return;if(e.code==='Space'){e.preventDefault();play();}if(e.code==='ArrowLeft'||e.code==='ArrowRight'){e.preventDefault();stop();setAngle(state.angle+(e.code==='ArrowLeft'?-5:5));}if(e.code==='Escape'){state.photo=null;renderScreens();}});
new ResizeObserver(fit).observe($('#stage'));renderScreens();setAngle(180);fit();requestAnimationFrame(frame);
$('#about').addEventListener('close',()=>$('.reference-video').pause());
const registry=document.modelContext;
if(registry?.registerTool){
 const lifecycle=new AbortController();
 const register=tool=>{try{Promise.resolve(registry.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};
 register({name:'configure_phone_demo',description:'Set the visible fold angle and open a simulated phone experience.',inputSchema:{type:'object',properties:{angle:{type:'number',minimum:0,maximum:180},experience:{type:'string',enum:['home','photos','split','camera','standby']}},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){
  if(!input||typeof input!=='object'||Object.keys(input).some(k=>!['angle','experience'].includes(k)))throw new Error('Expected angle and/or experience.');
  if(input.angle!==undefined&&(!Number.isFinite(input.angle)||input.angle<0||input.angle>180))throw new Error('Angle must be between 0 and 180.');
  if(input.experience!==undefined&&!['home','photos','split','camera','standby'].includes(input.experience))throw new Error('Unknown experience.');
  stop();if(input.experience!==undefined)changeApp(input.experience);if(input.angle!==undefined)setAngle(input.angle);return {angle:state.angle,experience:state.experience};
 }});
 register({name:'read_phone_demo',description:'Read the current fold angle and open phone experience.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(){return {angle:state.angle,experience:state.experience,app:state.app,playing:state.playing};}});
 window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
