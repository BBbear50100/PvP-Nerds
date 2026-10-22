import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {getFirestore,doc,getDoc,setDoc,getDocs,collection} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const db=getFirestore(initializeApp({apiKey:"AIzaSyBBFpsrHKdurN4yhaMowWJDTd1XetlaA3Q",authDomain:"pvp-nerds-database.firebaseapp.com",projectId:"pvp-nerds-database",storageBucket:"pvp-nerds-database.firebasestorage.app",messagingSenderId:"843267437933",appId:"1:843267437933:web:a684ff8f6ebb191f205664"}));
export const IGN=/^[A-Za-z0-9_]{3,16}$/;
export async function signups(){return (await getDocs(collection(db,'signups'))).docs.map(d=>d.data())}
export async function signUp(tid,ign){if(!IGN.test(ign))throw new Error('Invalid IGN');const r=doc(db,'signups',tid+'_'+ign.toLowerCase());
 if((await getDoc(r)).exists())throw new Error('You are already signed up');await setDoc(r,{tid,ign,ts:Date.now()})}
export async function warmups(){return (await getDocs(collection(db,'warmup'))).docs.map(d=>d.data())}
export async function saveWarmup(ign,s){if(!IGN.test(ign))throw new Error('Invalid IGN');const r=doc(db,'warmup',ign.toLowerCase()),snap=await getDoc(r),days=snap.exists()?snap.data().days||{}:{},day=new Date().toISOString().slice(0,10);
 if(!days[day]||s.score>days[day].score)days[day]=s;Object.keys(days).sort().slice(0,-60).forEach(k=>delete days[k]);
 await setDoc(r,{name:ign,days},{merge:true});let n=0,c=Date.now();while(days[new Date(c).toISOString().slice(0,10)]){n++;c-=864e5}return n}
export async function player(ign){const s=await getDoc(doc(db,'warmup',ign.toLowerCase()));return s.exists()?s.data():null}
export async function register(ign,keys){if(!IGN.test(ign)||!keys.length||keys.length>12||keys.some(k=>typeof k!=='string'||k.length!==1))throw new Error('Invalid hotkeys');
 const r=doc(db,'warmup',ign.toLowerCase()),s=await getDoc(r);if(s.exists()&&s.data().hotkeys)return;await setDoc(r,{name:ign,days:s.exists()?s.data().days||{}:{},hotkeys:keys})}
