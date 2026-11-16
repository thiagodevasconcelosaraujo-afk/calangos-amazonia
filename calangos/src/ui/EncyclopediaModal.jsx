import React,{useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {createLizard} from '../models/LizardModel.js';
import {FICHAS,failEntries,autopsy} from '../data/encyclopediaData.js';
import {TOTAL_FAILS} from '../data/storyData.js';
function Viewer({sp}){
 const ref=useRef(),s=useRef({drag:false,rot:0,x:0});
 useEffect(()=>{const el=ref.current,w=el.clientWidth||300,h=220;
  const r=new THREE.WebGLRenderer({antialias:true,alpha:true});r.setPixelRatio(Math.min(devicePixelRatio,1.5));r.setSize(w,h);
  r.toneMapping=THREE.ACESFilmicToneMapping;el.appendChild(r.domElement);
  const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,w/h,.1,50);cam.position.set(0,1.8,4.4);cam.lookAt(0,.2,0);
  sc.add(new THREE.HemisphereLight(0xcfe8c0,0x2a1d10,1.3));const d=new THREE.DirectionalLight(0xfff0c8,2.5);d.position.set(3,5,4);sc.add(d);
  const L=createLizard(sp);sc.add(L);let t=0;
  r.setAnimationLoop(()=>{t+=.016;L.userData.update(t,'idle',0);if(!s.current.drag)s.current.rot+=.01;L.rotation.y=s.current.rot;r.render(sc,cam);});
  return()=>{r.setAnimationLoop(null);r.dispose();r.domElement.remove();};},[sp]);
 return <div ref={ref} style={{height:220,touchAction:'none',background:'#102418',borderRadius:10}}
  onPointerDown={e=>{s.current.drag=true;s.current.x=e.clientX;}}
  onPointerMove={e=>{if(s.current.drag){s.current.rot+=(e.clientX-s.current.x)*.015;s.current.x=e.clientX;}}}
  onPointerUp={()=>{s.current.drag=false;}} onPointerLeave={()=>{s.current.drag=false;}}/>;}
export default function EncyclopediaModal({onClose,found,tab:t0='T',focus}){
 const[tab,setTab]=useState(t0),list=failEntries();
 useEffect(()=>{if(focus&&tab==='F')document.getElementById('f-'+focus)?.scrollIntoView({block:'center'});},[focus,tab]);
 const F=FICHAS[tab];
 return <div className="modal"><div className="panel" style={{maxHeight:'none',margin:'0 auto'}}>
  <div className="row"><button className={'btn'+(tab==='T'?' main':'')} onClick={()=>setTab('T')}>Terrestre</button>
  <button className={'btn'+(tab==='E'?' main':'')} onClick={()=>setTab('E')}>Escalador</button>
  <button className={'btn'+(tab==='F'?' main':'')} onClick={()=>setTab('F')}>Falhas {found.size}/{TOTAL_FAILS}</button></div>
  {F&&<><Viewer sp={tab}/><h3 style={{margin:'8px 0 0'}}>{F.nome}</h3><i>{F.sci} · Família {F.familia}</i>
   <p><b>Habitat:</b> {F.habitat}</p><p><b>Hábitos:</b> {F.habitos}</p><p><b>Dieta:</b> {F.dieta}</p>
   <b>Adaptações anatômicas</b><ul>{F.adaptacoes.map((a,i)=><li key={i}>{a}</li>)}</ul></>}
  {tab==='F'&&list.map(e=>{const ok=found.has(e.key),a=autopsy(e.key);
   return <div id={'f-'+e.key} key={e.key} style={{padding:10,margin:'6px 0',borderRadius:8,border:'1px solid '+(e.key===focus?'#ffd54a':'#335'),background:ok?'#1a2a1f':'#111'}}>
    {ok?<><small>{e.fase}</small><br/><b>{e.title}</b><br/><span style={{color:'#ff9a7a'}}>{a.cause}</span><p style={{margin:'4px 0'}}>{e.why}</p><small>{a.text}</small></>
    :<span style={{opacity:.5}}>🔒 Falha não descoberta ({e.fase})</span>}</div>;})}
  <button className="btn main" onClick={onClose}>Fechar</button></div></div>;}
