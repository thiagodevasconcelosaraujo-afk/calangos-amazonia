import * as THREE from 'three';
const R=(a,b)=>a+Math.random()*(b-a);
export function buildEnvironment(scene){
 const grp=new THREE.Group();scene.add(grp);
 scene.add(new THREE.HemisphereLight(0x9ccf8a,0x2a1d10,.7));
 const sun=new THREE.DirectionalLight(0xfff0c8,2.2);sun.position.set(6,12,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
 Object.assign(sun.shadow.camera,{left:-14,right:14,top:12,bottom:-8,far:50});scene.add(sun);
 const mk=(draw,rep)=>{const c=document.createElement('canvas');c.width=c.height=256;draw(c.getContext('2d'));const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(...rep);t.colorSpace=THREE.SRGBColorSpace;return t;};
 const dd=x=>{x.fillStyle='#3a2a1a';x.fillRect(0,0,256,256);for(let i=0;i<2500;i++){x.fillStyle=`hsl(${20+Math.random()*15},${30+Math.random()*20}%,${10+Math.random()*18}%)`;x.fillRect(Math.random()*256,Math.random()*256,3,3);}};
 const gT=mk(dd,[12,3]),bT=mk(dd,[1,2]);
 const soil=mk(x=>{const g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'#4a3320');g.addColorStop(.5,'#5a3d22');g.addColorStop(1,'#2e1f12');x.fillStyle=g;x.fillRect(0,0,256,256);for(let i=0;i<1800;i++){x.fillStyle=`rgba(${R(20,90)|0},${R(15,60)|0},10,.5)`;x.fillRect(R(0,256),R(0,256),R(1,5),R(1,4));}},[20,1]);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(80,40),new THREE.MeshStandardMaterial({map:gT,bumpMap:gT,bumpScale:2,roughness:.95}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;grp.add(ground);
 const S=[];const add=(o,min,r)=>{grp.add(o);S.push({o,min,r});};
 const bark=new THREE.MeshStandardMaterial({map:bT,bumpMap:bT,bumpScale:3,color:0x8a7a68,roughness:.9}),leaf=new THREE.MeshStandardMaterial({color:0x1d4a24,roughness:.8});
 for(let i=0;i<24;i++){const h=R(14,24),t=new THREE.Group();
  const tr=new THREE.Mesh(new THREE.CylinderGeometry(.5,.8,h,10),bark);tr.position.y=h/2;tr.castShadow=true;t.add(tr);
  for(let k=0;k<4;k++){const f=new THREE.Mesh(new THREE.BoxGeometry(.12,2.2,1.3),bark);f.position.set(Math.cos(k*1.57)*.7,1.1,Math.sin(k*1.57)*.7);f.rotation.y=-k*1.57;t.add(f);}
  const cr=new THREE.Mesh(new THREE.IcosahedronGeometry(R(3,5),1),leaf);cr.position.y=h;t.add(cr);
  t.position.set(R(-32,32),0,R(-16,-3));add(t,-34,68);}
 const fern=new THREE.MeshStandardMaterial({color:0x2f7a35,side:2});
 for(let i=0;i<46;i++){const f=new THREE.Mesh(new THREE.ConeGeometry(.5,.9,5,1,true),fern);f.position.set(R(-32,32),.4,R(-9,-1.5));add(f,-34,68);}
 for(let i=0;i<14;i++){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(R(.4,1),0),new THREE.MeshStandardMaterial({color:0x4d6b3a,roughness:1}));r.position.set(R(-32,32),.2,R(-6,-1.5));r.castShadow=true;add(r,-34,68);}
 const lg=new THREE.PlaneGeometry(.25,.15),lmat=new THREE.MeshStandardMaterial({color:0x7a4a1a,side:2}),d=new THREE.Object3D();
 [0,60].forEach(ox=>{const lm=new THREE.InstancedMesh(lg,lmat,350);for(let i=0;i<350;i++){d.position.set(R(-30,30),.08,R(-8,7));d.rotation.set(-Math.PI/2,0,R(0,6));d.updateMatrix();lm.setMatrixAt(i,d.matrix);}lm.position.x=ox;add(lm,-60,120);});
 // fogo
 const N=360,fg=new THREE.BufferGeometry(),seed=[];for(let i=0;i<N;i++)seed.push([R(-14,14),R(0,1)]);
 fg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(N*3),3));
 const fire=new THREE.Points(fg,new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{s:{value:1}},
  vertexShader:'uniform float s;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=s*260./-mv.z;gl_Position=projectionMatrix*mv;}',
  fragmentShader:'void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(1.,.45+.3*(1.-d*2.),.1,(1.-d*2.)*.8);}'}));
 fire.frustumCulled=false;scene.add(fire);const fl=new THREE.PointLight(0xff6a1a,0,30);scene.add(fl);
 const smk=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(new Float32Array(270),3)),new THREE.PointsMaterial({color:0x26221f,size:2.4,transparent:true,opacity:.4,depthWrite:false}));smk.frustumCulled=false;scene.add(smk);
 // partículas de poeira/terra/folhas
 const PN=180,pp=new Float32Array(PN*3).fill(-99),pv=new Float32Array(PN*3),pl=new Float32Array(PN),pc=new Float32Array(PN*3);let pi=0;
 const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pp,3));pg.setAttribute('color',new THREE.BufferAttribute(pc,3));
 const puffs=new THREE.Points(pg,new THREE.PointsMaterial({size:.17,vertexColors:true,transparent:true,depthWrite:false,opacity:.9}));puffs.frustumCulled=false;scene.add(puffs);
 // chuva / cinzas
 const rp=new Float32Array(900);for(let i=0;i<900;i++)rp[i]=i%3===1?R(0,12):i%3===0?R(-12,12):R(-6,6);
 const rain=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(rp,3)),new THREE.PointsMaterial({color:0xaabbcc,size:.07}));rain.visible=false;scene.add(rain);
 // água, onda, trator, dominós
 const water=new THREE.Mesh(new THREE.PlaneGeometry(80,40),new THREE.MeshPhysicalMaterial({color:0x6b5a3a,roughness:.1,opacity:.85,transparent:true}));water.rotation.x=-Math.PI/2;water.visible=false;scene.add(water);
 const wave=new THREE.Mesh(new THREE.BoxGeometry(3,1,16),new THREE.MeshStandardMaterial({color:0x5a3f22,roughness:.4,transparent:true}));wave.visible=false;scene.add(wave);
 const dozer=new THREE.Mesh(new THREE.BoxGeometry(4,1.8,3.5),new THREE.MeshStandardMaterial({color:0xd9a521}));dozer.castShadow=true;dozer.visible=false;scene.add(dozer);
 const trunk=()=>{const g=new THREE.Group(),m=new THREE.Mesh(new THREE.CylinderGeometry(.5,.7,10,8),bark);m.position.y=5;m.castShadow=true;g.add(m);return g;};
 const dom=[0,1,2].map(()=>{const g=trunk();g.position.z=-1.2;g.visible=false;scene.add(g);return g;});
 const fall=trunk();fall.visible=false;scene.add(fall);
 const shd=new THREE.Mesh(new THREE.PlaneGeometry(10,2.4),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:0}));shd.rotation.x=-Math.PI/2;shd.position.y=.04;shd.visible=false;scene.add(shd);
 // props de ação
 const prop=new THREE.Mesh(new THREE.CylinderGeometry(1,1,1,12),new THREE.MeshStandardMaterial({map:bT,bumpMap:bT,bumpScale:3,roughness:.9}));prop.castShadow=true;prop.visible=false;S.push({o:prop});scene.add(prop);
 const hole=new THREE.Mesh(new THREE.CircleGeometry(.7,20),new THREE.MeshBasicMaterial({color:0x050302}));hole.rotation.x=-Math.PI/2;hole.position.y=.03;hole.visible=false;scene.add(hole);
 // corte transversal subterrâneo
 const cut=new THREE.Group(),sm=new THREE.MeshStandardMaterial({map:soil,roughness:1,bumpMap:soil}),ceilM=new THREE.MeshStandardMaterial({map:soil,roughness:1,emissive:0x000000});
 const box=(w,h,dp,x,y,z,m=sm)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,dp),m);b.position.set(x,y,z);cut.add(b);};
 box(80,.8,2.4,0,-.4,-.2,ceilM);box(80,1.2,2.4,0,-2.4,-.2);box(38,1,2.4,-21,-1.3,-.2);box(38,1,2.4,21,-1.3,-.2);box(80,2.8,.3,0,-1.4,-1.35,new THREE.MeshStandardMaterial({color:0x1a110a}));
 cut.visible=false;scene.add(cut);
 const CN=100,cs=[];for(let i=0;i<CN;i++)cs.push([R(0,1),R(0,1)]);
 const cSm=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(new Float32Array(CN*3),3)),new THREE.PointsMaterial({color:0x777777,size:.5,transparent:true,opacity:.4,depthWrite:false}));cSm.visible=false;cSm.frustumCulled=false;scene.add(cSm);
 const PK={shrub:[2.2,.35,0x8a6a30],tree:[15,.55,0x8a7a68],liana:[15,.5,0x6a5a38],burnt:[9,.5,0x2a2420],log:[3,.45,0x6a5030,1],hollow:[8,.9,0x6a5a48],bank:[2.6,.55,0xc9b27a,1]};
 const WC={1:[0x5a3f22,.95,2.6,0],3:[0x6a5a3a,.8,1.8,0],4:[0xff9a40,.28,5,1]};
 let phase=-1,tx=-14;
 const E={wl:null,smoke:0,
  setPhase(i){phase=i;fire.visible=smk.visible=i===0||i===5;rain.visible=i===1;dozer.visible=i===2;dom.forEach(m=>m.visible=i===2);
   const w=WC[i];wave.visible=!!w;if(w){wave.material.color.setHex(w[0]);wave.material.opacity=w[1];wave.scale.y=w[2];wave.userData.h=w[2];wave.material.blending=w[3]?THREE.AdditiveBlending:THREE.NormalBlending;wave.material.depthWrite=!w[3];wave.material.needsUpdate=true;}
   sun.intensity=i===5?.4:i===4?3:2.2;ground.material.color.setHex(i===5?0x555555:0xffffff);},
  setProp(k,x,z=-.55){const[h,r,c,ly]=PK[k];prop.visible=true;prop.material.color.setHex(c);prop.scale.set(r*2,h,r*2);prop.rotation.set(0,0,ly?Math.PI/2:0);prop.position.set(x,ly?r:h/2,ly?0:z);},
  burn(u){prop.material.emissive.setRGB(u*1.2,u*.3,0);},
  setHole(x,s){hole.visible=s>.01;hole.position.x=x;hole.scale.setScalar(Math.max(s,.01));},
  setFaller(x,a){fall.visible=x!=null;shd.visible=x!=null;if(x==null)return;fall.position.set(x,0,0);fall.rotation.z=-a;shd.position.x=x+5;shd.material.opacity=Math.min(.6,a*.5);},
  cutOn(b){cut.visible=cSm.visible=b;},cutGlow(u){ceilM.emissive.setRGB(u*1.3,u*.28,0);},
  ashRain(b){rain.visible=b;rain.material.color.setHex(0x8a8a8a);},
  puff(x,y,z,n,vx,vy,col=0x6b5232){const c=new THREE.Color(col);for(let k=0;k<n;k++){const i=pi++%PN;pp.set([x,y,z+R(-.2,.2)],i*3);pv.set([vx+R(-1,1),vy+R(0,2),R(-.8,.8)],i*3);pl[i]=R(.5,1.1);pc.set([c.r,c.g,c.b],i*3);}},
  reset(){hole.visible=prop.visible=fall.visible=shd.visible=cut.visible=cSm.visible=false;E.wl=null;E.smoke=0;ceilM.emissive.setRGB(0,0,0);prop.material.emissive.setRGB(0,0,0);prop.rotation.set(0,0,0);rain.material.color.setHex(0xaabbcc);pp.fill(-99);},
  update(dt,sp,th,t){
   tx=-14+th*11;
   for(const s of S){const o=s.o;o.position.x-=sp*dt;if(s.r){if(o.position.x<s.min)o.position.x+=s.r;else if(o.position.x>s.min+s.r)o.position.x-=s.r;}}
   gT.offset.x+=sp*dt/6.67;
   for(let i=0;i<PN;i++)if(pl[i]>0){pv[i*3+1]-=9.8*dt;pp[i*3]+=pv[i*3]*dt-sp*dt;pp[i*3+1]=Math.max(.03,pp[i*3+1]+pv[i*3+1]*dt);pp[i*3+2]+=pv[i*3+2]*dt;pl[i]-=dt;if(pl[i]<=0)pp[i*3+1]=-99;}
   pg.attributes.position.needsUpdate=true;pg.attributes.color.needsUpdate=true;
   if(fire.visible){const pa=fg.attributes.position,big=phase===5?1.6:1;
    for(let i=0;i<N;i++){const[x0,ph]=seed[i],l=(t*.8+ph)%1;pa.setXYZ(i,tx+x0*.16+Math.sin(t*3+i)*.4-l*.5,l*(3.5+th*2)*big,x0*.35);}pa.needsUpdate=true;
    fire.material.uniforms.s.value=.8+th;fl.position.set(tx+1,2,1);fl.intensity=(4+Math.sin(t*23)*1.5+Math.sin(t*37))*(.3+th)*3;
    const sa=smk.geometry.attributes.position;for(let i=0;i<90;i++){const[x0,ph]=seed[i],l=(t*.35+ph)%1;sa.setXYZ(i,tx+x0*.15-l*2.5,1.5+l*7,x0*.3);}sa.needsUpdate=true;}
   else fl.intensity=0;
   if(rain.visible){const r=rain.geometry.attributes.position;for(let i=0;i<300;i++){let y=r.getY(i)-(phase===1?.4:.08);if(y<0)y=12;r.setY(i,y);}r.needsUpdate=true;}
   if(wave.visible){const h=wave.userData.h;wave.position.set(tx,h/2,0);wave.scale.y=h*(1+.08*Math.sin(t*5));}
   water.visible=phase===3||E.wl!=null;water.position.y=E.wl!=null?E.wl:-1+th*1.4;
   if(dozer.visible){dozer.position.set(tx-3,.9,0);dozer.rotation.z=Math.sin(t*14)*.01;dom.forEach((g,i)=>{g.position.x=tx+4+i*3.5;g.rotation.z=-Math.min(1.45,Math.max(0,th*3-i*.6));});}
   if(cut.visible){const a=cSm.geometry.attributes.position;for(let i=0;i<CN;i++){const[ph,h]=cs[i],l=(t*.5+ph)%1;a.setXYZ(i,-2.2+l*4.4*(.3+E.smoke*.7),-1.75+h*.9,R(-.3,.3));}a.needsUpdate=true;cSm.material.opacity=.1+E.smoke*.55;}}};
 return E;}
