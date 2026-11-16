import React,{useEffect,useRef,useState,useCallback} from 'react';
import {Stage} from './engine/Stage.js';
import {PHASES,SPECIES,END_MSG,TOTAL_FAILS} from './data/storyData.js';
import {autopsy} from './data/encyclopediaData.js';
import EncyclopediaModal from './ui/EncyclopediaModal.jsx';
import {tap,buzz} from './engine/native.js';
const LS='calangos_falhas';
const load=()=>{try{return new Set(JSON.parse(localStorage.getItem(LS)||'[]'));}catch(e){return new Set();}};
export default function App(){
 const host=useRef(),st=useRef(),tm=useRef();
 const[sp,setSp]=useState(null),[pi,setPi]=useState(0),[s,setS]=useState('menu'),[fail,setFail]=useState(null),[found,setFound]=useState(load),[pick,setPick]=useState(null),[qleft,setQ]=useState(2.5),[enc,setEnc]=useState(null);
 useEffect(()=>{const g=new Stage(host.current);st.current=g;g.setSpecies('T');g.setMode('menu');return()=>g.dispose();},[]);
 const addFail=k=>{if(k.endsWith('time'))return;setFound(f=>{const n=new Set(f).add(k);try{localStorage.setItem(LS,JSON.stringify([...n]));}catch(e){}return n;});};
 const startPhase=useCallback(i=>{const g=st.current,P=PHASES[i];g.reset();g.setPhase(i,P.fog);g.setMode('cutscene');g.slow=1;setPi(i);setS('cutscene');
  clearTimeout(tm.current);tm.current=setTimeout(()=>{g.slow=.25;setS('choice');},5000);},[]);
 // tremor de terra durante a cutscene (desmatamento e enxurrada)
 useEffect(()=>{if(s!=='cutscene'||(pi!==2&&pi!==1))return;const iv=setInterval(()=>tap('Heavy'),350);return()=>clearInterval(iv);},[s,pi]);
 const doFail=(key,title,why)=>{const g=st.current;g.slow=1;g.setMode('collapse');setS('anim');addFail(key);
  tm.current=setTimeout(()=>{buzz(500);setFail({key,title,why});setS('fail');},2200);};
 const choose=(o,idx)=>{const P=PHASES[pi];setPick(idx);tap('Medium');
  if(P.final||o.ok===sp){setS('qte');setQ(2.5);return;}
  if(o.ok)return doFail(`p${pi}-esp`,'Limitação anatômica',P.wrong[sp]);
  doFail(`p${pi}-${idx}`,o.fail,o.why);};
 const qteDone=ok=>{const g=st.current,P=PHASES[pi],o=P.options[pick];
  if(!ok)return doFail(`p${pi}-time`,'Tempo de reação insuficiente','Em desastres reais, segundos decidem a sobrevivência. A hesitação custou a vida do animal.');
  if(P.final)return doFail(`p${pi}-${pick}`,o.fail,o.why);
  g.slow=1;g.setMode(sp==='E'?'climb':'run');setS('anim');tm.current=setTimeout(()=>setS('ok'),2500);};
 const qr=useRef();qr.current=qteDone;
 useEffect(()=>{if(s!=='qte')return;const g=st.current;g.slow=.6;const t0=performance.now();let last=5,done=false;
  const end=ok=>{if(done)return;done=true;clearInterval(iv);qr.current(ok);};
  const iv=setInterval(()=>{const l=2.5-(performance.now()-t0)/1000;setQ(Math.max(0,l));const k=Math.floor(l*2);if(k!==last){last=k;tap('Medium');}if(l<=0)end(false);},50);
  const key=e=>{if(e.code==='Space'){e.preventDefault();end(true);}};addEventListener('keydown',key);
  window.__qte=()=>end(true);
  return()=>{clearInterval(iv);removeEventListener('keydown',key);};},[s==='qte']);
 const retry=()=>{const g=st.current;setFail(null);g.reset();g.slow=.25;g.setMode('cutscene');g.threat=.7;setS('choice');};
 const begin=k=>{setSp(k);st.current.setSpecies(k);startPhase(0);};
 const finish=()=>{const g=st.current;g.slow=1;setFail(null);setS('end');};
 const P=PHASES[pi],A=fail&&autopsy(fail.key);
 return <><div ref={host}/>
  <div className="top"><span className="pill">{s!=='menu'&&`Fase ${pi+1}/6`}</span>
   <span style={{display:'flex',gap:6,pointerEvents:'auto'}}>{s!=='qte'&&s!=='anim'&&<button className="pill" style={{border:0,color:'inherit'}} onClick={()=>setEnc({tab:sp||'T'})}>📖 Enciclopédia</button>}
   <span className="pill">Falhas: {found.size}/{TOTAL_FAILS}</span></span></div>
  {s==='menu'&&<div className="ui"><div className="panel"><h2 style={{margin:'0 0 4px'}}>🦎 Sobrevivendo à Amazônia</h2><p style={{margin:'0 0 8px'}}>O Desafio dos Calangos — escolha sua espécie:</p>
   {Object.entries(SPECIES).map(([k,v])=><button key={k} className="btn" onClick={()=>begin(k)} onPointerEnter={()=>st.current.setSpecies(k)}><b>{v.name}</b> <i>({v.sci})</i><br/><small>{v.desc}</small></button>)}</div></div>}
  {s==='cutscene'&&<div className="ui"><div className="panel"><b>⚠ {P.title}</b><br/>{P.threat}</div></div>}
  {s==='choice'&&<div className="ui"><div className="panel"><b>{P.threat}</b><p style={{margin:'4px 0'}}>O que o {SPECIES[sp].name} faz?</p>
   {P.options.map((o,i)=><button key={i} className="btn" onClick={()=>choose(o,i)}>{i+1}. {o.t}</button>)}</div></div>}
  {s==='qte'&&<div className="center"><button className="qte" onPointerDown={()=>window.__qte&&window.__qte()}>{qleft.toFixed(1)}s<br/><small>TOQUE / ESPAÇO</small></button></div>}
  {s==='fail'&&fail&&<div className="ui"><div className="panel fail"><h2>⚠ FALHA NA ADAPTAÇÃO</h2><b>{fail.title}</b>
   <p style={{margin:'6px 0'}}><b>Causa fisiológica:</b> {A.cause}</p><p style={{margin:'6px 0'}}>{fail.why}</p><small>{A.text}</small>
   <button className="btn main" onClick={retry}>Tentar Novamente</button>
   <button className="btn" onClick={()=>setEnc({tab:'F',focus:fail.key})}>📖 Ver na Enciclopédia</button>
   {P.final&&<button className="btn" onClick={finish}>Ver desfecho</button>}</div></div>}
  {s==='ok'&&<div className="ui"><div className="panel"><h2>✅ Sobreviveu!</h2><p>Escolha adaptada à anatomia da espécie. Mas as ameaças estão aumentando…</p><button className="btn main" onClick={()=>startPhase(pi+1)}>Próxima fase</button></div></div>}
  {s==='end'&&<div className="ui"><div className="panel"><div className="end">{END_MSG}</div><p style={{textAlign:'center'}}>Falhas descobertas: <b>{found.size}/{TOTAL_FAILS}</b></p>
   <button className="btn main" onClick={()=>begin(sp==='T'?'E':'T')}>Jogar com a outra espécie</button>
   <button className="btn" onClick={()=>setEnc({tab:'F'})}>📖 Enciclopédia</button>
   <button className="btn" onClick={()=>{setS('menu');st.current.reset();}}>Menu</button></div></div>}
  {enc&&<EncyclopediaModal found={found} tab={enc.tab} focus={enc.focus} onClose={()=>setEnc(null)}/>}
 </>;}
