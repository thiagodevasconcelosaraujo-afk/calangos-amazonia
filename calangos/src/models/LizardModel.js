import * as THREE from 'three';
function scaleTex(sp){
 const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');
 x.fillStyle=sp==='T'?'#5b6b2e':'#6b5a40';x.fillRect(0,0,256,256);
 for(let r=0;r<32;r++)for(let q=0;q<32;q++){const cx=q*8+(r%2)*4,cy=r*8;
  x.fillStyle=`hsla(${sp==='T'?85:30},35%,${28+Math.random()*18}%,.9)`;x.beginPath();
  for(let k=0;k<6;k++)x.lineTo(cx+4.2*Math.cos(k*Math.PI/3),cy+4.2*Math.sin(k*Math.PI/3));x.fill();}
 for(let i=0;i<30;i++){x.fillStyle='rgba(20,25,10,.35)';x.beginPath();x.ellipse(Math.random()*256,Math.random()*256,10+Math.random()*14,6+Math.random()*8,Math.random()*3,0,7);x.fill();}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t;}
export function createLizard(sp){
 const g=new THREE.Group(),tex=scaleTex(sp),flat=sp==='E'?.55:1;
 const mat=new THREE.MeshPhysicalMaterial({map:tex,bumpMap:tex,bumpScale:1.2,roughnessMap:tex,roughness:.35,clearcoat:.65,clearcoatRoughness:.3});
 const tailMat=mat.clone();if(sp==='T')tailMat.color=new THREE.Color(.6,1,1.05);
 const M=(geo,m=mat)=>{const o=new THREE.Mesh(geo,m);o.castShadow=true;return o;};
 const body=M(new THREE.SphereGeometry(1,24,16));body.scale.set(.32,.28*flat,.9);g.add(body);
 const head=new THREE.Group();head.position.set(0,.02,.85);g.add(head);
 const sk=M(new THREE.SphereGeometry(1,20,14));sk.scale.set(.22,.17*flat+.03,.4);sk.position.z=.15;head.add(sk);
 const sn=M(new THREE.ConeGeometry(.13,.35,12));sn.rotation.x=Math.PI/2;sn.position.z=.5;head.add(sn);
 const eyeM=new THREE.MeshPhysicalMaterial({color:0x111100,roughness:.05,clearcoat:1});
 [-1,1].forEach(s=>{const e=M(new THREE.SphereGeometry(.05,12,10),eyeM);e.position.set(s*.17,.1,.22);head.add(e);
  const l=M(new THREE.SphereGeometry(.055,12,6,0,6.3,0,1.2));l.position.copy(e.position);head.add(l);});
 const legs=[];
 [[-1,.45],[1,.45],[-1,-.45],[1,-.45]].forEach(([s,z],i)=>{
  const p=new THREE.Group();p.position.set(s*.3,-.05,z);
  const u=M(new THREE.CylinderGeometry(.06,.045,.4,8));u.position.set(s*.18,-.05,0);u.rotation.z=s*1.1;p.add(u);
  const k=new THREE.Group();k.position.set(s*.34,-.2,0);p.add(k);
  const lo=M(new THREE.CylinderGeometry(.045,.035,.4,8));lo.position.set(0,-.17,0);k.add(lo);
  for(let d=-1;d<=1;d++){const f=M(new THREE.CylinderGeometry(.012,.02,.3,5));f.position.set(s*.05,-.36,d*.05);f.rotation.x=1.35;k.add(f);
   const cl=M(new THREE.ConeGeometry(.015,.06,5),new THREE.MeshStandardMaterial({color:0x222222}));cl.position.set(s*.05,-.37,d*.05+.16);cl.rotation.x=1.9;k.add(cl);}
  g.add(p);legs.push({p,k,ph:i%3===0?0:Math.PI,s});});
 const tail=[];let prev=g;const N=12;
 for(let i=0;i<N;i++){const r=.17*(1-i/N)+.012;const seg=new THREE.Group();seg.position.z=i===0?-.8:-.34*(1-i/N)-.12;
  const m=M(new THREE.SphereGeometry(r,10,8),tailMat);m.scale.z=2.2;seg.add(m);prev.add(seg);prev=seg;tail.push(seg);}
 g.userData.update=(t,mode,mt)=>{
  const run=mode==='run',cl=mode==='climb',dg=mode==='dig'||mode==='scratch',sw=mode==='swim',pa=mode==='pant',col=mode==='collapse';
  const f=run?16:cl?9:dg?24:0,amp=run?.95:cl?.7:dg?.8:.04,br=pa||mode==='scratch'?16:col?3:2.2;
  body.scale.y=.28*flat*(1+Math.sin(t*br)*(br>10?.1:.04));body.scale.x=.32*(1+Math.sin(t*br)*(br>10?.07:.03));
  legs.forEach((l,i)=>{
   if(sw){l.p.rotation.x=.4;l.k.rotation.x=1;}
   else if(dg){const fr=i<2;l.p.rotation.x=fr?Math.sin(t*f+i)*amp:0;l.k.rotation.x=fr?Math.max(0,Math.sin(t*f+i))*amp:0;}
   else{l.p.rotation.x=Math.sin(t*f+l.ph)*amp;l.k.rotation.x=Math.max(0,Math.sin(t*f+l.ph))*amp*.9;}});
  const tw=run?.35:sw?.5:.1,ts=run?11:sw?6:2;
  tail.forEach((s,i)=>{s.rotation.y=Math.sin(t*ts-i*.55)*tw;});
  body.rotation.y=run?Math.sin(t*f)*.13:sw?Math.sin(t*6)*.1:0;
  head.rotation.y=run?-Math.sin(t*f)*.12:Math.sin(t*.8)*.2;
  head.rotation.x=dg?.55:pa?-.45:0;
  if(mode==='free')return;
  if(col){g.rotation.z=Math.min(mt/1.2,1)*Math.PI*.55;g.rotation.x=0;}
  else{g.rotation.z=run?Math.sin(t*f)*.04:0;g.rotation.x=cl?-1.4:0;}
 };
 g.userData.dry=u=>{mat.clearcoat=tailMat.clearcoat=.65*(1-u);mat.roughness=tailMat.roughness=.35+.45*u;};
 g.userData.s0=sp==='T'?1.2:1;
 g.scale.setScalar(sp==='T'?1.2:1);
 return g;}
