const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),ease=u=>u*u*(3-2*u);
// chave "pF-i" -> [kernel, variação]
export const ACTIONS={
 'p0-0':['burrow','fire'],'p0-1':['climb','shrub'],'p0-2':['dodge','windfire'],'p0-3':['burrow','crevice'],'p0-4':['climb','tree'],
 'p1-0':['swim','mud'],'p1-1':['freeze','log'],'p1-2':['freeze','pit'],'p1-3':['dodge','across'],'p1-4':['climb','tree'],
 'p2-0':['freeze','grab'],'p2-1':['dodge','linefall'],'p2-2':['freeze','hollow'],'p2-3':['dodge','perp'],'p2-4':['climb','liana'],
 'p3-0':['swim','open'],'p3-1':['freeze','bank'],'p3-2':['swim','rotten'],'p3-3':['swim','shore'],'p3-4':['climb','tree'],
 'p4-0':['heat','open'],'p4-1':['heat','sand'],'p4-2':['heat','branch'],'p4-3':['burrow','cool'],'p4-4':['climb','tree'],
 'p5-0':['dodge','dryriver'],'p5-1':['burrow','ash'],'p5-2':['climb','burnt'],'p5-3':['wait','rain'],'p5-4':['dodge','windfire']};
const KERN={
 // ESCAVAÇÃO -> CORTE SUBTERRÂNEO -> SUFOCAMENTO/CALOR
 burrow:(s,k)=>{const e=s.env,fire=k==='fire',ash=k==='ash';
  const dig={d:2.4,cam:'close',mode:'dig',in:s=>{s.speed=0;},tk:(u,s,dt)=>{e.setHole(.9,ash?.15+u*.1:u*1.2);s.threat+=dt*.05;e.puff(.8,.1,0,ash?1:3,-3,3,ash?0x555555:0x6b5232);}};
  const under={d:3,cam:'under',mode:'idle',in:s=>{e.cutOn(true);e.setHole(0,0);s.liz.position.y=-1.45;s.liz.position.x=0;},tk:(u,s)=>{s.threat=.8+u*1.1;e.smoke=fire?u:0;e.cutGlow(fire?ease(u)*.5:0);}};
  if(ash)return[dig,{d:3,cam:'close',mode:'scratch',tk:(u,s)=>{s.threat=.8+u*1;e.puff(.8,.1,0,1,-1,1,0x333333);if(u>.55&&s.mode==='scratch')s.setMode('collapse');}}];
  if(!fire)return[dig,under,{d:2.5,cam:'underClose',mode:'idle',tk:()=>e.cutGlow(0)}];
  return[dig,under,{d:4.6,cam:'underClose',mode:'pant',tk:(u,s)=>{e.cutGlow(.5+u*.9);e.smoke=1;s.rig.shake=u<.7?.03:0;
   if(u>.3&&s.mode==='pant')s.setMode('scratch');if(u>.7&&s.mode==='scratch')s.setMode('collapse');}}];},
 // CORRER ATÉ A BASE, AGARRAR, SUBIR
 climb:(s,k)=>{const e=s.env,H={shrub:2.4,tree:9,liana:9,slip:1.5,burnt:5}[k],ok=k==='tree'||k==='liana',prop=k==='slip'?'tree':k;
  const run={d:1.2,cam:'chase',mode:'run',in:s=>{e.setProp(prop,7.4);s.speed=8;},tk:(u,s)=>{s.speed=8*(1-u*u);}};
  const up={d:ok?3:2.2,cam:ok?'canopy':'chase',mode:'climb',in:s=>{s.speed=0;s.liz.position.x=.8;s.liz.position.z=-.1;},
   tk:(u,s)=>{s.liz.position.y=.35+H*ease(clamp(u/(k==='slip'?.5:1)));if(k==='shrub'||k==='burnt'){s.threat=.8+u*.7;e.burn(u);}if(k==='slip'&&u>.4)e.puff(.7,.4,0,1,-1,1);}};
  if(ok)return[run,up,{d:2.6,cam:'canopy',mode:'idle',tk:(u,s)=>{s.threat=.8+u*1.1;}}];
  if(k==='slip')return[run,up,{d:2.2,cam:'close',mode:'free',tk:(u,s)=>{s.liz.position.y=.35+H*(1-ease(u));s.L.rotation.x=-1.4*(1-clamp(u*2));s.L.rotation.z=ease(u)*1.7;s.threat=.8+u*1;}}];
  return[run,up,{d:2.4,cam:'close',mode:'free',tk:(u,s)=>{e.burn(1);s.liz.position.y=.35+H*(1-u*u);s.L.rotation.z=ease(u)*1.7;s.L.rotation.x=-1.4*(1-clamp(u*2));s.threat=1.5+u*.4;s.rig.shake=.05;}}];},
 // ENTRAR NA ÁGUA, ONDULAR, VENCER OU AFUNDAR
 swim:(s,k)=>{const e=s.env,ok=k==='shore',rot=k==='rotten';
  const A={d:1.6,cam:'chase',mode:'run',in:s=>{s.speed=7;e.wl=-.25;if(rot)e.setProp('log',3.2,0);},tk:(u,s)=>{e.wl=-.25+u*.45;s.liz.position.y=.35-u*.3;s.speed=7*(1-u*.5);if(rot)s.env.puff(0,.2,0,1,-1,1,0x6a5a3a);}};
  const B={d:3,cam:'chase',mode:'swim',tk:(u,s)=>{e.puff(.5,.2,0,1,-2,1,0x6a5a3a);
   if(ok)s.speed=3;else if(k==='mud'){s.speed=-3;s.liz.position.x=-u*2.2;s.threat=.8+u*.4;}else if(k==='open'){s.speed=2;s.liz.position.y=.05-u*.1;}else{s.speed=2;}}};
  if(ok)return[A,B,{d:2,cam:'chase',mode:'idle',tk:(u,s)=>{s.speed=3*(1-u);s.liz.position.y=.05+.6*ease(u);}}];
  return[A,B,{d:2.6,cam:'close',mode:'free',tk:(u,s)=>{s.speed=k==='mud'?-3:0;s.liz.position.y=.05-1.1*ease(u);s.L.rotation.z=u*(k==='mud'?9:3);s.threat=1.2;e.puff(.3,.1,0,1,-1,2,0x6a5a3a);}}];},
 // CORRER / DESVIAR DE QUEDAS / FOGO NAS COSTAS
 dodge:(s,k)=>{const e=s.env,fall=k==='linefall'||k==='perp',ok=k==='across'||k==='perp',slow=k==='slowcaught';
  const A={d:2,cam:'chase',mode:'run',in:s=>{s.speed=slow?4:8;if(fall)e.setFaller(-3.5,0);},tk:(u,s,dt)=>{s.threat+=dt*(slow?.1:.05);}};
  const B=fall?{d:2.2,cam:'wide',mode:'run',tk:(u,s)=>{const a=ease(u)*1.5;e.setFaller(-3.5,a);s.speed=ok?8:3;if(ok)s.liz.position.z=-3.4*ease(clamp(u*1.6));if(u>.85)e.puff(R(-2,4),.2,0,2,0,2,0x8a7a62);s.rig.shake=u>.85?.2:0;}}
   :{d:2.4,cam:'wide',mode:'run',tk:(u,s)=>{s.threat=.8+u*1;s.speed=k==='dryriver'?8*(1-u):slow?4:8;}};
  function R(a,b){return a+Math.random()*(b-a);}
  if(ok)return[A,B,{d:1.8,cam:'chase',mode:'run',in:s=>{s.speed=8;}}];
  if(fall)return[A,B,{d:2,cam:'close',mode:'free',in:s=>{s.speed=0;},tk:(u,s)=>{s.L.rotation.z=ease(clamp(u*3))*1.6;s.L.scale.y=s.L.userData.s0*(1-.7*clamp(u*4));}}];
  return[A,B,{d:2.4,cam:'close',mode:'collapse',in:s=>{s.speed=0;},tk:(u,s)=>{s.threat=1.3+u*.6;s.rig.shake=.04;}}];},
 // ESCONDER-SE / FICAR PARADO: ATINGIDO NO IMPACTO
 freeze:(s,k)=>{const e=s.env;
  const A={d:1.6,cam:'chase',mode:'run',in:s=>{s.speed=7;if(k==='log')e.setProp('log',6,0);if(k==='hollow')e.setProp('hollow',6.5,-.5);if(k==='grab')e.setProp('tree',6.8,-.4);if(k==='pit')e.setHole(.3,1.4);if(k==='bank')e.setProp('bank',5.5,0);},tk:(u,s)=>{s.speed=7*(1-u*u);}};
  const B={d:2.2,cam:'wide',mode:k==='grab'?'climb':'idle',in:s=>{s.speed=0;if(k==='grab'||k==='hollow')s.liz.position.x=.9;},tk:(u,s)=>{s.threat=.8+u*.6;if(k==='bank')e.wl=-.8+u*.8;if(k==='grab')s.liz.position.y=.35+1.3*ease(u);}};
  const C={d:2.4,cam:'close',mode:'free',tk:(u,s)=>{s.threat=1.4+u*.5;s.rig.shake=.15*(1-u);e.puff(0,.3,0,2,-3,3,0x5a3f22);s.L.rotation.z=ease(u)*1.6;
   if(k==='log'||k==='hollow')s.L.scale.y=s.L.userData.s0*(1-.6*u);if(k==='pit')e.wl=u*.8;if(k==='bank')e.wl=0+u*.8;if(k==='grab')s.liz.position.y=.35+Math.sin(u*3.14)*1.2;}};
  return[A,B,C];},
 // ONDA DE CALOR: ofegar, secar, colapsar
 heat:(s,k)=>{const e=s.env;
  const A={d:2.2,cam:'chase',mode:'run',in:s=>{s.speed=3;},tk:(u,s)=>{s.speed=3*(1-u);s.L.userData.dry(u*.5);s.expo=1+u*.5;}};
  const B={d:3,cam:'close',mode:k==='branch'?'climb':k==='sand'?'dig':'pant',in:s=>{s.speed=0;if(k==='branch'){e.setProp('tree',.9,-.4);s.liz.position.x=.7;}},
   tk:(u,s)=>{s.L.userData.dry(.5+u*.5);s.expo=1.5+u*.9;if(k==='sand'){e.setHole(.9,.3);e.puff(.8,.1,0,2,-2,2,0xd8c07a);}if(k==='branch')s.liz.position.y=.35+2*ease(u);}};
  const C={d:2.6,cam:'close',mode:'collapse',tk:(u,s)=>{s.expo=2.4+Math.sin(u*3)*.3;s.liz.position.y=.35+(k==='branch'?2*(1-ease(u)):0);s.L.userData.dry(1);}};
  return[A,B,C];},
 // FASE 6: esperar a chuva
 wait:(s)=>{const e=s.env;
  return[{d:2.5,cam:'close',mode:'idle',in:s=>{s.speed=0;e.ashRain(true);}},
   {d:3.5,cam:'wide',mode:'pant',tk:(u,s)=>{s.threat=.8+u*1.1;if(u>.6&&s.mode==='pant')s.setMode('collapse');}}];}};
export class ActionDirector{
 constructor(s){this.s=s;this.q=null;}
 stop(){this.q=null;}
 play(key,sp,done){
  let[k,v]=ACTIONS[key]||['dodge','windfire'];
  if(key.endsWith('esp'))[k,v]=sp==='T'?['climb','slip']:['dodge','slowcaught'];
  if(key.endsWith('time'))[k,v]=['dodge','slowcaught'];
  this.s.tScale=1;this.s.chasing=false;
  this.q={steps:KERN[k](this.s,v),i:0,t:0,done};this.enter();}
 enter(){const q=this.q,st=q.steps[q.i];q.t=0;if(st.cam)this.s.rig.go(st.cam,st.k||3);if(st.mode)this.s.setMode(st.mode);st.in?.(this.s);}
 update(dt){const q=this.q;if(!q)return;const st=q.steps[q.i];q.t+=dt;st.tk?.(clamp(q.t/st.d),this.s,dt);
  if(q.t>=st.d){q.i++;if(q.i>=q.steps.length){this.q=null;q.done();}else this.enter();}}}
