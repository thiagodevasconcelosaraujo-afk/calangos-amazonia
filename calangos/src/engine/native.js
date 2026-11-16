import {Capacitor} from '@capacitor/core';
import {Haptics,ImpactStyle} from '@capacitor/haptics';
import {StatusBar} from '@capacitor/status-bar';
import {ScreenOrientation} from '@capacitor/screen-orientation';
const native=Capacitor.isNativePlatform();
export async function initNative(){
 if(!native)return;
 try{await StatusBar.hide();}catch(e){}
 try{await ScreenOrientation.lock({orientation:'portrait'});}catch(e){}}
export function tap(style='Light'){
 if(native)Haptics.impact({style:ImpactStyle[style]}).catch(()=>{});else navigator.vibrate?.(25);}
export function buzz(ms=500){
 if(native)Haptics.vibrate({duration:ms}).catch(()=>{});else navigator.vibrate?.(ms);}
