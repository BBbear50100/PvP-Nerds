import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {getFirestore,doc,getDoc,setDoc,getDocs,collection,deleteDoc,updateDoc,onSnapshot,query,where,orderBy,limit,runTransaction} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import {getAuth,signInWithEmailAndPassword,signOut} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
const app=initializeApp({apiKey:"AIzaSyBBFpsrHKdurN4yhaMowWJDTd1XetlaA3Q",authDomain:"pvp-nerds-database.firebaseapp.com",projectId:"pvp-nerds-database",storageBucket:"pvp-nerds-database.firebasestorage.app",messagingSenderId:"843267437933",appId:"1:843267437933:web:a684ff8f6ebb191f205664"});const db=getFirestore(app),auth=getAuth(app);
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

/* ---------- manager auth ---------- */
export const MANAGER_EMAIL='manager@pvpnerds.app';
export const login=pw=>signInWithEmailAndPassword(auth,MANAGER_EMAIL,pw),logout=()=>signOut(auth);
export const user=async()=>{await auth.authStateReady();return auth.currentUser};
/* ---------- ELO ---------- */
export const TH=[0,15,25,40,55,70,100,115,125],TN=['LT3','MT3','HT3','LT2','MT2','HT2','LT1','MT1','HT1'],RK=[[400,'Combat Grandmaster'],[280,'Combat Master'],[220,'Combat Ace'],[160,'Combat Novice'],[100,'Combat Trainee']];
export const tierOf=e=>TN[TH.reduce((a,t,i)=>e>=t?i:a,0)],rankOf=n=>(RK.find(x=>n>x[0])||[0,'Combat Rookie'])[1];
const E=(p,m)=>p&&p.elo&&p.elo[m]!=null?p.elo[m]:10,r2=n=>Math.round(n*100)/100,none=()=>{};
export const watchPlayers=cb=>onSnapshot(collection(db,'players'),s=>cb(s.docs.map(d=>({id:d.id,...d.data()}))),none);
export const watchQueue=cb=>onSnapshot(collection(db,'queue'),s=>cb(s.docs.map(d=>d.data())),none);
export const watchPairs=(ign,cb)=>onSnapshot(ign?query(collection(db,'pairs'),where('names','array-contains',ign.toLowerCase())):collection(db,'pairs'),s=>cb(s.docs.map(d=>({id:d.id,...d.data()})),s.docChanges().filter(c=>c.type==='added').map(c=>c.doc.data())),none);
export const watchLog=cb=>onSnapshot(query(collection(db,'tierlog'),orderBy('ts','desc'),limit(150)),s=>cb(s.docs.map(d=>({id:d.id,...d.data()}))),none);
export const setDone=(id,v)=>updateDoc(doc(db,'tierlog',id),{done:!!v}),setRegion=(id,region)=>updateDoc(doc(db,'players',id),{region}),delPlayer=id=>deleteDoc(doc(db,'players',id)),delPair=id=>deleteDoc(doc(db,'pairs',id)),leaveQueue=ign=>deleteDoc(doc(db,'queue',ign.toLowerCase()));
export async function getModes(){const s=await getDoc(doc(db,'config','modes'));return s.exists()?s.data().list:null}
export const saveModes=list=>setDoc(doc(db,'config','modes'),{list});
const key=(x,y)=>[x,y].map(s=>s.toLowerCase()).sort().join('|'),MAXD=10,WIN=432e5;
async function used(k,mode){const t=Date.now()-WIN,x=k.split('|')[0],d=(await getDocs(query(collection(db,'duels'),where('key','==',k)))).docs.filter(z=>z.data().mode===mode&&z.data().ts>t).length,p=(await getDocs(query(collection(db,'pairs'),where('names','array-contains',x)))).docs.filter(z=>{const v=z.data();return v.mode===mode&&key(v.a.name,v.b.name)===k}).length;return d+p}
export async function joinQueue(ign,mode){if(!IGN.test(ign))throw new Error('Invalid IGN');const id=ign.toLowerCase(),pr=doc(db,'players',id);
 if(!(await getDoc(pr)).exists())await setDoc(pr,{name:ign,ts:Date.now()});
 const mine=doc(db,'queue',id);await deleteDoc(mine);const skipped=[];
 const c=(await getDocs(query(collection(db,'queue'),where('mode','==',mode)))).docs.map(d=>d.data()).filter(x=>x.name.toLowerCase()!==id).sort((a,b)=>a.ts-b.ts);
 for(const o of c){if(await used(key(ign,o.name),mode)>=MAXD){skipped.push(o.name);continue}
  try{await runTransaction(db,async tx=>{const os=await tx.get(doc(db,'queue',o.name.toLowerCase()));if(!os.exists())throw new Error('gone');tx.delete(os.ref);tx.set(doc(collection(db,'pairs')),{mode,a:{name:o.name},b:{name:ign},names:[o.name.toLowerCase(),id],ts:Date.now()})});return {matched:true,skipped}}catch(e){}}
 await setDoc(mine,{name:ign,mode,ts:Date.now()});return {matched:false,skipped}}
export async function record(mode,a,b,winner,modes,pairId){await user();const ia=a.toLowerCase(),ib=b.toLowerCase(),w=winner.toLowerCase();if(ia===ib)throw new Error('Pick two different players');if(w!==ia&&w!==ib)throw new Error('Winner must be one of the players');
 const ra=doc(db,'players',ia),rb=doc(db,'players',ib);
 return runTransaction(db,async tx=>{const sa=await tx.get(ra),sb=await tx.get(rb),pa={name:a,...(sa.data()||{})},pb={name:b,...(sb.data()||{})},ea=E(pa,mode),eb=E(pb,mode),Ea=1/(1+10**((eb-ea)/50)),Eb=1-Ea,aw=w===ia;
  const da=aw?4*(1-Ea):-2*Ea,dbb=aw?-2*Eb:4*(1-Eb),na=r2(Math.max(0,ea+da)),nb=r2(Math.max(0,eb+dbb)),ts=Date.now(),T=collection(db,'tierlog'),tot=(p,v)=>modes.reduce((s,x)=>s+(x===mode?v:E(p,x)),0)/2;
  const wl=(p,win)=>{const o=(p.rec&&p.rec[mode])||{};return {...(p.rec||{}),[mode]:{w:(o.w||0)+(win?1:0),l:(o.l||0)+(win?0:1)}}};
  tx.set(ra,{...pa,elo:{...(pa.elo||{}),[mode]:na},rec:wl(pa,aw)});tx.set(rb,{...pb,elo:{...(pb.elo||{}),[mode]:nb},rec:wl(pb,!aw)});tx.set(doc(collection(db,'duels')),{ts,mode,key:key(a,b)});
  tx.set(doc(collection(db,'elolog')),{ts,mode,a:pa.name,b:pb.name,winner:aw?pa.name:pb.name,ea,eb,na,nb});
  [[pa,ea,na],[pb,eb,nb]].forEach(([p,o,n])=>{const t0=tierOf(o),t1=tierOf(n);if(t0!==t1)tx.set(doc(T),{ts,name:p.name,mode,type:'tier',from:t0,to:t1,done:false});const r0=rankOf(tot(p,o)),r1=rankOf(tot(p,n));if(r0!==r1)tx.set(doc(T),{ts,name:p.name,mode:'overall',type:'rank',from:r0,to:r1,done:false})});
  if(pairId)tx.delete(doc(db,'pairs',pairId));return {ea,eb,na,nb}})}
export const getCfg=async id=>{const s=await getDoc(doc(db,'config',id));return s.exists()?s.data():null},saveCfg=(id,o)=>setDoc(doc(db,'config',id),o);
