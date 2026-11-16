import * as THREE from 'three';
const rnd=(a,b)=>a+Math.random()*(b-a);
export function buildEnvironment(scene){
 const grp=new THREE.Group();scene.add(grp);
 scene.add(new THREE.HemisphereLight(0x9ccf8a,0x2a1d10,.7));
 const sun=new THREE.DirectionalLight(0xfff0c8,2.2);sun.position.set(6,12,4);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
 Object.assign(sun.shadow.camera,{left:-15,right:15,top:15,bottom:-15});scene.add(sun);
 const gg=new THREE.PlaneGeometry(60,60,80,80);gg.rotateX(-Math.PI/2);const p=gg.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);p.setY(i,Math.sin(x*.5)*.12+Math.cos(z*.7)*.1+Math.random()*.05);}
 gg.computeVertexNormals();
 const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#3a2a1a';x.fillRect(0,0,256,256);
 for(let i=0;i<2500;i++){x.fillStyle=`hsl(${20+Math.random()*15},${30+Math.random()*20}%,${10+Math.random()*18}%)`;x.fillRect(Math.random()*256,Math.random()*256,3,3);}
 const tx=new THREE.CanvasTexture(c);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.repeat.set(12,12);tx.colorSpace=THREE.SRGBColorSpace;
 const ground=new THREE.Mesh(gg,new THREE.MeshStandardMaterial({map:tx,bumpMap:tx,roughness:.95}));ground.receiveShadow=true;grp.add(ground);
 const bark=new THREE.MeshStandardMaterial({map:tx,bumpMap:tx,bumpScale:3,color:0x8a7a68,roughness:.9});
 const leaf=new THREE.MeshStandardMaterial({color:0x1d4a24,roughness:.8});
 for(let i=0;i<26;i++){const a=rnd(0,6.28),d=rnd(6,26),h=rnd(14,24);const t=new THREE.Group();
  const tr=new THREE.Mesh(new THREE.CylinderGeometry(.5,.8,h,10),bark);tr.position.y=h/2;tr.castShadow=true;t.add(tr);
  for(let k=0;k<4;k++){const f=new THREE.Mesh(new THREE.BoxGeometry(.12,2.2,1.3),bark);f.position.set(Math.cos(k*1.57)*.7,1.1,Math.sin(k*1.57)*.7);f.rotation.y=-k*1.57;t.add(f);}
  const cr=new THREE.Mesh(new THREE.IcosahedronGeometry(rnd(3,5),1),leaf);cr.position.y=h;t.add(cr);
  t.position.set(Math.cos(a)*d,0,Math.sin(a)*d);grp.add(t);}
 const fern=new THREE.MeshStandardMaterial({color:0x2f7a35,side:2});
 for(let i=0;i<40;i++){const f=new THREE.Mesh(new THREE.ConeGeometry(.5,.9,5,1,true),fern);f.position.set(rnd(-14,14),.4,rnd(-14,14));grp.add(f);}
 for(let i=0;i<12;i++){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(rnd(.4,1),0),new THREE.MeshStandardMaterial({color:0x4d6b3a,roughness:1}));r.position.set(rnd(-12,12),.2,rnd(-12,12));r.castShadow=true;grp.add(r);}
 const lm=new THREE.InstancedMesh(new THREE.PlaneGeometry(.25,.15),new THREE.MeshStandardMaterial({color:0x7a4a1a,side:2}),500),d=new THREE.Object3D();
 for(let i=0;i<500;i++){d.position.set(rnd(-15,15),.08,rnd(-15,15));d.rotation.set(-Math.PI/2,0,rnd(0,6));d.updateMatrix();lm.setMatrixAt(i,d.matrix);}grp.add(lm);
 const N=400,fg=new THREE.BufferGeometry(),seed=[];
 for(let i=0;i<N;i++)seed.push([rnd(-14,14),rnd(0,1)]);
 fg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(N*3),3));
 const fire=new THREE.Points(fg,new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{s:{value:1}},
  vertexShader:'uniform float s;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=s*260./-mv.z;gl_Position=projectionMatrix*mv;}',
  fragmentShader:'void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(1.,.45+.3*(1.-d*2.),.1,(1.-d*2.)*.8);}'}));
 fire.frustumCulled=false;scene.add(fire);
 const fl=new THREE.PointLight(0xff6a1a,0,30);scene.add(fl);
 const rp=new Float32Array(900);for(let i=0;i<900;i++)rp[i]=i%3===1?rnd(0,12):rnd(-10,10);
 const rain=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(rp,3)),new THREE.PointsMaterial({color:0xaabbcc,size:.06}));rain.visible=false;scene.add(rain);
 const water=new THREE.Mesh(new THREE.PlaneGeometry(60,60),new THREE.MeshPhysicalMaterial({color:0x6b5a3a,roughness:.1,opacity:.85,transparent:true}));water.rotation.x=-Math.PI/2;water.position.y=-1;scene.add(water);
 const dozer=new THREE.Mesh(new THREE.BoxGeometry(3,1.6,4),new THREE.MeshStandardMaterial({color:0xd9a521}));dozer.castShadow=true;dozer.visible=false;scene.add(dozer);
 let phase=0,threat=0;
 return{
  setPhase(i){phase=i;fire.visible=i===0||i===5;rain.visible=i===1;water.visible=i===3;dozer.visible=i===2;sun.intensity=i===5?.4:i===4?3:2.2;},
  setThreat(v){threat=v;},
  update(t){const pa=fg.attributes.position,zB=-18+threat*14;
   for(let i=0;i<N;i++){const[x0,ph]=seed[i],life=(t*.8+ph)%1;pa.setXYZ(i,x0+Math.sin(t+i)*.3,life*(phase===5?7:4)*(.4+threat),zB+Math.sin(i)*2);}
   pa.needsUpdate=true;fire.material.uniforms.s.value=.6+threat;fl.position.set(0,2,zB+3);fl.intensity=fire.visible?(4+Math.sin(t*23)*1.5+Math.sin(t*37))*threat*3:0;
   if(rain.visible){const r=rain.geometry.attributes.position;for(let i=0;i<300;i++){let y=r.getY(i)-.4;if(y<0)y=12;r.setY(i,y);}r.needsUpdate=true;}
   water.position.y=-1+(phase===3?threat*1.3:0);dozer.position.set(-12+threat*8,.8,-4);}};}
