import * as THREE from 'three';
const P={
 chase:{o:[1.5,1.1,6.5],l:[1.2,.3,0],f:55},
 bullet:{o:[3.5,1.5,9],l:[-3,.9,0],f:55,orb:1.6},
 wide:{o:[2,2.4,12],l:[-2,1,0],f:55},
 close:{o:[1.6,.6,2.8],l:[.3,.35,0],f:50},
 under:{o:[0,0,5.4],l:[0,0,0],f:55},
 underClose:{o:[.9,.1,2.7],l:[0,0,0],f:45},
 canopy:{o:[1.6,.8,8],l:[0,1.2,0],f:60}};
export class CameraRig{
 constructor(cam,target){this.cam=cam;this.t=target;this.p=P.chase;this.pos=new THREE.Vector3(0,2,8);this.look=new THREE.Vector3();this.tmp=new THREE.Vector3();this.fov=55;this.k=3;this.shake=0;this.time=0;}
 go(name,k=3){this.p=P[name]||P.chase;this.k=k;}
 update(dt,snap){
  this.time+=dt;const portrait=innerWidth<innerHeight,m=portrait?1.45:1,[ox,oy,oz]=this.p.o,[lx,ly,lz]=this.p.l,t=this.t.position;
  const a=snap?1:1-Math.exp(-this.k*dt);
  this.tmp.set(t.x+ox+(this.p.orb?Math.sin(this.time*.5)*this.p.orb:0),t.y+oy,t.z+oz*m);this.pos.lerp(this.tmp,a);
  this.tmp.set(t.x+lx,t.y+ly-(portrait?.9:0),t.z+lz);this.look.lerp(this.tmp,a);
  this.fov+=(this.p.f+(portrait?12:0)-this.fov)*a;
  if(this.shake>.001){this.pos.x+=(Math.random()-.5)*this.shake;this.pos.y+=(Math.random()-.5)*this.shake;this.shake*=Math.exp(-6*dt);}
  const c=this.cam;c.position.copy(this.pos);c.fov=this.fov;c.updateProjectionMatrix();c.lookAt(this.look);}}
