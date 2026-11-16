import * as THREE from 'three';
import {buildEnvironment} from '../scenes/AmazonEnvironment.js';
import {createLizard} from '../models/LizardModel.js';
export class Stage{
 constructor(el){
  const r=this.r=new THREE.WebGLRenderer({antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,1.5));
  r.toneMapping=THREE.ACESFilmicToneMapping;r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;el.appendChild(r.domElement);
  this.scene=new THREE.Scene();this.scene.fog=new THREE.FogExp2(0x2a4a35,.03);this.scene.background=new THREE.Color(0x2a4a35);
  this.cam=new THREE.PerspectiveCamera(55,1,.1,200);this.env=buildEnvironment(this.scene);
  this.mode='idle';this.mt=0;this.time=0;this.slow=1;this.threat=0;this.fogT=[0x2a4a35,.03];this.lizard=null;this.clock=new THREE.Clock();
  this.resize=()=>{const w=innerWidth,h=innerHeight;r.setSize(w,h);this.cam.aspect=w/h;this.cam.fov=w<h?70:55;this.cam.updateProjectionMatrix();};
  this.resize();addEventListener('resize',this.resize);this.loop=this.loop.bind(this);r.setAnimationLoop(this.loop);}
 setSpecies(sp){if(this.lizard)this.scene.remove(this.lizard);this.lizard=createLizard(sp);this.lizard.position.set(0,.35,0);this.scene.add(this.lizard);}
 setPhase(i,fog){this.env.setPhase(i);this.fogT=fog;this.threat=0;}
 setMode(m){this.mode=m;this.mt=0;}
 loop(){const dt=Math.min(this.clock.getDelta(),.05)*this.slow;this.time+=dt;this.mt+=dt;
  const f=this.scene.fog;f.color.lerp(new THREE.Color(this.fogT[0]),.03);f.density+=(this.fogT[1]-f.density)*.03;this.scene.background.copy(f.color);
  if(['cutscene','run','climb'].includes(this.mode))this.threat=Math.min(1,this.threat+dt*.12);
  this.env.setThreat(this.threat);this.env.update(this.time);
  const L=this.lizard;if(L){L.userData.update(this.time,this.mode,this.mt);
   if(this.mode==='run'&&L.position.z<14)L.position.z+=dt*4;
   if(this.mode==='climb')L.position.y=Math.min(6,L.position.y+dt*1.5);
   const d=innerWidth<innerHeight?7:5,a=this.time*.15;
   this.cam.position.set(Math.sin(a)*d*.6+2,2+(this.mode==='climb'?(L.position.y-.35)*.5:0),L.position.z-d);
   this.cam.lookAt(L.position.x,L.position.y+(innerWidth<innerHeight?-.9:.4),L.position.z+1);}
  this.r.render(this.scene,this.cam);}
 reset(){if(this.lizard){this.lizard.position.set(0,.35,0);this.lizard.rotation.set(0,0,0);}this.threat=0;this.setMode('idle');}
 dispose(){this.r.setAnimationLoop(null);removeEventListener('resize',this.resize);this.r.domElement.remove();}}
