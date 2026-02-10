const liveSpeed = document.getElementById("liveSpeed");
const pingEl = document.getElementById("ping");
const downEl = document.getElementById("download");
const upEl = document.getElementById("upload");
const needle = document.getElementById("needle");
const serverEl = document.getElementById("server");
const btn = document.getElementById("startBtn");


async function detectServer(){
try{
const res = await fetch("https://ipapi.co/json/");
const data = await res.json();
serverEl.innerText = `Server: ${data.city}, ${data.country_name}`;
}catch(e){
serverEl.innerText = "Server: Auto";
}
}


async function pingTest(){
const start = performance.now();
await fetch("https://www.google.com/favicon.ico",{cache:"no-store"}).catch(()=>{});
const end = performance.now();
const ping = Math.round(end-start);
pingEl.innerText = ping;
}


function updateMeter(speed){
liveSpeed.innerText = speed.toFixed(1);
const angle = Math.min(speed,100)/100*180-90;
needle.style.transform = `rotate(${angle}deg)`;
}


async function downloadTest(){
const url = "https://speed.cloudflare.com/__down?bytes=5000000";
const start = performance.now();
const res = await fetch(url,{cache:"no-store"});
const blob = await res.blob();
const end = performance.now();
const bits = blob.size*8;
const time = (end-start)/1000;
const speed = bits/time/1024/1024;
downEl.innerText = speed.toFixed(2);
animateSpeed(speed);
}


async function uploadTest(){
const data = new Blob([new Array(5*1024*1024).join("a")]);
const start = performance.now();
await fetch("https://httpbin.org/post",{method:"POST",body:data}).catch(()=>{});
const end = performance.now();
const bits = data.size*8;
const time = (end-start)/1000;
const speed = bits/time/1024/1024;
upEl.innerText = speed.toFixed(2);
animateSpeed(speed);
}


function animateSpeed(target){
let current=0;
const step = target/40;
const interval = setInterval(()=>{
current+=step;
if(current>=target){
current=target;
clearInterval(interval);
}
updateMeter(current);
},20);
}


btn.onclick = async ()=>{
btn.disabled=true;
await detectServer();
await pingTest();
await downloadTest();
await uploadTest();
btn.disabled=false;
};
