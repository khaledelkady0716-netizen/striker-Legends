let cur='start', ctx, cv, keys={}, M=null, loopId=null, afterFn=null;
const save = JSON.parse(localStorage.getItem('sl_save')||'{"coins":500,"squad":[],"pc":{"rating":60,"goals":0,"games":0},"mc":{"team":"Al Ahly","pts":0,"played":0}}');
function persist(){localStorage.setItem('sl_save',JSON.stringify(save));}
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');cur=id;}
document.addEventListener('keydown',e=>{keys[e.code]=true;if(cur==='start'&&e.code==='KeyK')show('menu');if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();});
document.addEventListener('keyup',e=>{keys[e.code]=false;});

function fillTeams(){
 const list=teamsOfType(document.getElementById('homeType').value);
 ['homeTeam','awayTeam'].forEach((id,i)=>{const s=document.getElementById(id);s.innerHTML='';list.forEach((t,j)=>{const o=document.createElement('option');o.value=j;o.textContent=t.n+(t.league?' ('+t.league+')':'');s.appendChild(o);});s.selectedIndex=Math.min(i*3,list.length-1);});
}
fillTeams();

const khaledImg=new Image();khaledImg.src='khaled.png';

function mkTeam(t,side){
 const arr=[];const pos=side===0?[[60,240],[200,120],[200,360],[320,240],[420,240]]:[[740,240],[600,120],[600,360],[480,240],[380,240]];
 pos.forEach((p,i)=>arr.push({x:p[0],y:p[1],hx:p[0],hy:p[1],side:side,i:i,name:i===4?(t.s[0]||'Striker'):'Player '+(i+1)}));
 return {t:t,p:arr,score:0};
}

function startMatch(opts){
 opts=opts||{};
 const type=document.getElementById('homeType').value;
 const list=teamsOfType(type);
 const home=opts.home||list[+document.getElementById('homeTeam').value];
 const away=opts.away||list[+document.getElementById('awayTeam').value];
 const np=opts.players||+document.getElementById('players').value;
 const len=opts.len||+document.getElementById('matchLen').value;
 M={h:mkTeam(home,0),a:mkTeam(away,1),ball:{x:400,y:240,vx:0,vy:0,owner:null},np:np,time:len,left:len,ctl:[null,null],over:false,onEnd:opts.onEnd||null,cool:0};
 M.ctl[0]=M.h.p[4];if(np===2)M.ctl[1]=M.a.p[4];
 cv=document.getElementById('pitch');ctx=cv.getContext('2d');
 show('game');clearInterval(loopId);
 let last=performance.now();
 loopId=setInterval(()=>{const n=performance.now();update((n-last)/1000);last=n;draw();},16);
}

function kickoffReset(){M.ball.x=400;M.ball.y=240;M.ball.vx=M.ball.vy=0;M.ball.owner=null;[M.h,M.a].forEach(tm=>tm.p.forEach(p=>{p.x=p.hx;p.y=p.hy;}));}

function nearest(tm,b){let best=null,bd=1e9;tm.p.forEach(p=>{const d=Math.hypot(p.x-b.x,p.y-b.y);if(d<bd){bd=d;best=p;}});return best;}

function update(dt){
 if(M.over)return;
 M.left-=dt;if(M.left<=0){endMatch(false);return;}
 const b=M.ball;
 // controlled players
 M.ctl[0]=M.ctl[0]; if(M.np===1){M.ctl[0]=nearest(M.h,b);} else {M.ctl[0]=nearest(M.h,b);M.ctl[1]=nearest(M.a,b);}
 const sp=170*dt;
 const c0=M.ctl[0];
 if(keys.ArrowLeft)c0.x-=sp;if(keys.ArrowRight)c0.x+=sp;if(keys.ArrowUp)c0.y-=sp;if(keys.ArrowDown)c0.y+=sp;
 if(M.np===2){const c1=M.ctl[1];if(keys.KeyA)c1.x-=sp;if(keys.KeyD)c1.x+=sp;if(keys.KeyW)c1.y-=sp;if(keys.KeyS)c1.y+=sp;}
 // AI
 [M.h,M.a].forEach((tm,si)=>{
  const lvl=(tm.t.a+tm.t.m+tm.t.d)/3/100;
  tm.p.forEach(p=>{
   const human=(p===M.ctl[0])||(M.np===2&&p===M.ctl[1]);
   if(human)return;
   const chase=(nearest(tm,b)===p);
   let tx=p.hx,ty=p.hy;
   if(chase){tx=b.x;ty=b.y;}
   else{tx=p.hx+(b.x-400)*0.25;ty=p.hy+(b.y-240)*0.2;}
   const d=Math.hypot(tx-p.x,ty-p.y);
   if(d>2){const s=(110+lvl*60)*dt;p.x+=(tx-p.x)/d*s;p.y+=(ty-p.y)/d*s;}
  });
 });
 // keep players in bounds
 [M.h,M.a].forEach(tm=>tm.p.forEach(p=>{p.x=Math.max(10,Math.min(790,p.x));p.y=Math.max(10,Math.min(470,p.y));}));
 // ball possession
 M.cool-=dt;
 if(M.cool<=0){
  [M.h,M.a].forEach(tm=>tm.p.forEach(p=>{
   if(Math.hypot(p.x-b.x,p.y-b.y)<16&&(!b.owner||b.owner===p||Math.random()<0.02)){b.owner=p;}
  }));
 }
 if(b.owner){
  const o=b.owner;const dir=o.side===0?1:-1;
  b.x=o.x+dir*12;b.y=o.y;b.vx=b.vy=0;
  const isHuman=(o===M.ctl[0])||(M.np===2&&o===M.ctl[1]);
  const own=o.side===0?M.h:M.a;
  if(isHuman){
   const pass=o===M.ctl[0]?keys.Space:keys.KeyF;
   const shoot=o===M.ctl[0]?keys.KeyZ:keys.KeyG;
   if(shoot){kick(o,dir*(380+Math.random()*60),(240-o.y)*0.8*0+ (Math.random()-0.5)*120+ (240-o.y)*0.5);}
   else if(pass){const mate=own.p.filter(p=>p!==o).sort((a,c)=>Math.abs(c.x-o.x)*dir-Math.abs(a.x-o.x)*dir)[0];passTo(o,mate);}
  } else {
   const gx=o.side===0?800:0;
   if(Math.abs(o.x-gx)<260&&Math.random()<0.03){kick(o,dir*360,(240-o.y)*0.6+(Math.random()-0.5)*160);}
   else{o.x+=dir*60*dt;if(Math.random()<0.01){const mate=own.p.filter(p=>p!==o)[Math.floor(Math.random()*4)];passTo(o,mate);}}
  }
 } else {
  b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=0.985;b.vy*=0.985;
  if(b.y<5){b.y=5;b.vy*=-1;}if(b.y>475){b.y=475;b.vy*=-1;}
  // goals
  if(b.x<0||b.x>800){
   if(b.y>190&&b.y<290){if(b.x<0)M.a.score++;else M.h.score++;kickoffReset();}
   else{b.x=b.x<0?5:795;b.vx*=-1;}
  }
 }
}

function kick(p,vx,vy){const b=M.ball;b.owner=null;b.vx=vx;b.vy=vy;M.cool=0.4;}
function passTo(p,m){if(!m)return;const b=M.ball;b.owner=null;const dx=m.x-p.x,dy=m.y-p.y,d=Math.hypot(dx,dy)||1;b.vx=dx/d*320;b.vy=dy/d*320;M.cool=0.3;}

function draw(){
 ctx.clearRect(0,0,800,480);
 ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(5,5,790,470);
 ctx.beginPath();ctx.moveTo(400,5);ctx.lineTo(400,475);ctx.stroke();
 ctx.beginPath();ctx.arc(400,240,50,0,7);ctx.stroke();
 ctx.strokeRect(5,190,40,100);ctx.strokeRect(755,190,40,100);
 [M.h,M.a].forEach(tm=>tm.p.forEach(p=>{
  ctx.fillStyle=tm.t.c;ctx.beginPath();ctx.arc(p.x,p.y,11,0,7);ctx.fill();
  ctx.strokeStyle='#000';ctx.stroke();
  if(p===M.ctl[0]||(M.np===2&&p===M.ctl[1])){ctx.strokeStyle='#ffd54a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,15,0,7);ctx.stroke();ctx.lineWidth=2;}
  if(tm.t.custom&&p.i===4){
   ctx.fillStyle='#000';ctx.font='bold 11px Arial';ctx.textAlign='center';ctx.fillText(tm.t.custom.num,p.x,p.y+4);
   if(khaledImg.complete&&khaledImg.naturalWidth){ctx.save();ctx.beginPath();ctx.arc(p.x,p.y-26,13,0,7);ctx.clip();ctx.drawImage(khaledImg,p.x-13,p.y-39,26,26);ctx.restore();}
   ctx.fillStyle='#fff';ctx.fillText(tm.t.custom.name,p.x,p.y+28);
  }
 }));
 ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(M.ball.x,M.ball.y,6,0,7);ctx.fill();ctx.strokeStyle='#000';ctx.stroke();
 const s=Math.max(0,Math.ceil(M.left));
 document.getElementById('hud').textContent=M.h.t.n+' '+M.h.score+' - '+M.a.score+' '+M.a.t.n+'   |   '+Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
}

function endMatch(quit){
 if(!M)return;M.over=true;clearInterval(loopId);
 const r={h:M.h.score,a:M.a.score,hn:M.h.t.n,an:M.a.t.n};
 const cb=M.onEnd;M=null;
 if(quit){show('menu');return;}
 document.getElementById('resTitle').textContent='Full Time';
 let extra=cb?cb(r):'';
 document.getElementById('resBody').innerHTML='<p style="font-size:24px">'+r.hn+' '+r.h+' - '+r.a+' '+r.an+'</p>'+extra;
 show('result');
}
function afterResult(){show(afterFn||'menu');afterFn=null;}

// ---------- Ultimate Team ----------
function openUT(){
 document.getElementById('utInfo').innerHTML='<p>Coins: <b>'+save.coins+'</b></p><p>Squad ('+save.squad.length+' cards):</p><p class="small">'+(save.squad.map(c=>c.name+' ('+c.r+')').join(', ')||'No cards yet. Open a pack!')+'</p>';
 show('ut');
}
function openPack(){
 if(save.coins<100){alert('Not enough coins');return;}
 save.coins-=100;
 const pool=[];ALL_CLUBS.concat(NATIONS).forEach(t=>t.s.forEach(n=>pool.push({name:n,r:Math.round((t.a+t.m+t.d)/3)+Math.floor(Math.random()*6)})));
 for(let i=0;i<3;i++)save.squad.push(pool[Math.floor(Math.random()*pool.length)]);
 persist();openUT();
}
function playUT(){
 const bonus=save.squad.reduce((s,c)=>s+c.r,0)/Math.max(1,save.squad.length)||70;
 const mine={n:'My Ultimate Team',a:Math.min(95,Math.round(bonus)),m:Math.min(95,Math.round(bonus)),d:Math.min(95,Math.round(bonus)),c:'#a855f7',s:save.squad.slice(0,1).map(c=>c.name)};
 const opp=NATIONS[Math.floor(Math.random()*NATIONS.length)];
 afterFn='ut';
 startMatch({home:mine,away:opp,players:1,len:120,onEnd:r=>{let c=50;if(r.h>r.a)c=200;else if(r.h===r.a)c=100;save.coins+=c;persist();return '<p>You earned '+c+' coins.</p>';}});
}

// ---------- Player Career ----------
function openPC(){
 const p=save.pc;
 document.getElementById('pcInfo').innerHTML='<p>Rating: <b>'+p.rating+'</b></p><p>Games: '+p.games+'</p><p>Goals: '+p.goals+'</p>';
 show('pc');
}
function pcTrain(){if(save.pc.rating<99)save.pc.rating++;persist();openPC();}
function pcMatch(){
 const me={n:'My Club',a:save.pc.rating,m:save.pc.rating-3,d:save.pc.rating-5,c:'#22d3ee',s:['You']};
 const opp=ALL_CLUBS[Math.floor(Math.random()*ALL_CLUBS.length)];
 afterFn='pc';
 startMatch({home:me,away:opp,players:1,len:120,onEnd:r=>{save.pc.games++;save.pc.goals+=r.h;persist();return '<p>Your team scored '+r.h+'. Career goals: '+save.pc.goals+'</p>';}});
}

// ---------- Manager Career ----------
function myClub(){return ALL_CLUBS.find(t=>t.n===save.mc.team)||ALL_CLUBS[0];}
function openMC(){
 const m=save.mc;
 document.getElementById('mcInfo').innerHTML='<p>Club: <b>'+m.team+'</b></p><p>Played: '+m.played+'</p><p>Points: '+m.pts+'</p>';
 show('mc');
}
function mcOpp(){const me=myClub();const o=ALL_CLUBS.filter(t=>t.league===me.league&&t.n!==me.n);return o[Math.floor(Math.random()*o.length)];}
function mcPlay(){
 afterFn='mc';
 startMatch({home:myClub(),away:mcOpp(),players:1,len:120,onEnd:r=>{save.mc.played++;let p=r.h>r.a?3:r.h===r.a?1:0;save.mc.pts+=p;persist();return '<p>You got '+p+' points.</p>';}});
}
function mcSim(){
 const me=myClub(),o=mcOpp();
 const ms=(me.a+me.m+me.d)/3+Math.random()*25,os=(o.a+o.m+o.d)/3+Math.random()*25;
 const p=ms>os+2?3:Math.abs(ms-os)<=2?1:0;
 save.mc.played++;save.mc.pts+=p;persist();
 document.getElementById('resTitle').textContent='Simulated Result';
 document.getElementById('resBody').innerHTML='<p>'+me.n+' vs '+o.n+'</p><p>You got '+p+' points.</p>';
 afterFn='mc';show('result');
}
