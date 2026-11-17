import * as THREE from 'three';
import {buildEnvironment} from '../scenes/AmazonEnvironment.js';
import {createLizard} from '../models/LizardModel.js';
import {CameraRig} from './CameraRig.js';
import {ActionDirector} from './ActionDirector.js';
export class Stage{
 constructor(el){
  const r=this.r=new THREE.WebGLRenderer({antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,1.5));
  r.toneMapping=THREE.ACESFilmicToneMapping;r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;el.appendChild(r.domElement);
  this.scene=new THREE.Scene();this.scene.fog=new THREE.FogExp2(0x2a4a35,.03);this.scene.background=new THREE.Color(0x2a4a35);
  this.cam=new THREE.PerspectiveCamera(55,1,.1,200);this.liz=new THREE.Group();this.scene.add(this.liz);
  this.env=buildEnvironment(this.scene);this.rig=new CameraRig(this.cam,this.liz);this.dir=new ActionDirector(this);
  Object.assign(this,{mode:'idle',time:0,mt:0,scale:1,tScale:1,speed:0,threat:0,expo:1,chasing:false,fogT:[0x2a4a35,.03],L:null,clock:new THREE.Clock()});
  this.resize=()=>{const w=innerWidth,h=innerHeight;r.setSize(w,h);this.cam.aspect=w/h;this.cam.updateProjectionMatrix();};
  this.resize();addEventListener('resize',this.resize);this.loop=this.loop.bind(this);r.setAnimationLoop(this.loop);}
 setSpecies(sp){this.sp=sp;this.liz.clear();this.L=createLizard(sp);this.liz.add(this.L);this.menu();}
 reset(){this.dir.stop();this.liz.position.set(0,.35,0);this.liz.rotation.set(0,Math.PI/2,0);
  if(this.L){this.L.rotation.set(0,0,0);this.L.scale.setScalar(this.L.userData.s0);this.L.userData.dry(0);}
  this.env.reset();this.threat=0;this.speed=0;this.scale=this.tScale=1;this.expo=1;this.chasing=false;this.setMode('idle');this.rig.go('chase');}
 menu(){this.reset();this.env.setPhase(-1);this.fogT=[0x2a4a35,.03];this.speed=2.5;this.setMode('run');this.rig.update(1,true);}
 setMode(m){this.mode=m;this.mt=0;}
 startChase(i,fog){this.reset();this.env.setPhase(i);this.fogT=fog;this.speed=8;this.chasing=true;this.setMode('run');this.rig.go('chase',2);}
 bullet(){this.tScale=.04;this.chasing=false;this.rig.go('bullet',1.2);}
 toBullet(i,fog){this.reset();this.env.setPhase(i);this.fogT=fog;this.threat=.8;this.speed=8;this.setMode('run');this.scale=this.tScale=.04;this.rig.go('bullet',1.2);this.rig.update(1,true);}
 loop(){
  const raw=Math.min(this.clock.getDelta(),.05);this.scale+=(this.tScale-this.scale)*(1-Math.exp(-4*raw));
  const dt=raw*this.scale;this.time+=dt;this.mt+=raw;
  const f=this.scene.fog;f.color.lerp(new THREE.Color(this.fogT[0]),.03);f.density+=(this.fogT[1]-f.density)*.03;this.scene.background.copy(f.color);
  this.r.toneMappingExposure+=(this.expo-this.r.toneMappingExposure)*.1;
  if(this.chasing&&this.mode==='run')this.threat=Math.min(.8,this.threat+dt*.15);
  this.dir.update(raw);
  if(this.mode==='run'&&this.speed>3&&this.scale>.3){this.env.puff(-.3,.08,0,1,-this.speed*.4,1.2,Math.random()<.3?0x6b4a1a:0x7a6a4a);}
  this.env.update(dt,this.speed,this.threat,this.time);
  if(this.L)this.L.userData.update(this.time,this.mode,this.mt);
  this.rig.update(raw);this.r.render(this.scene,this.cam);}
 dispose(){this.r.setAnimationLoop(null);removeEventListener('resize',this.resize);this.r.domElement.remove();}}
