const liveSpeed = document.getElementById("liveSpeed");
const pingEl = document.getElementById("ping");
const downEl = document.getElementById("download");
const upEl = document.getElementById("upload");
const serverEl = document.getElementById("server");
const btn = document.getElementById("startBtn");
const progressCircle = document.getElementById("progress");
const modeEl = document.getElementById("mode");


const MAX_SPEED = 200; // gauge scale
const CIRCUMFERENCE = 502; // circle length


function updateGauge(speed){
liveSpeed.innerText = speed.toFixed(1);
const percent = Math.min(speed, MAX_SPEED) / MAX_SPEED;
const offset = CIRCUMFERENCE - percent * CIRCUMFERENCE;
progressCircle.style.strokeDashoffset = offset;
}


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
modeEl.innerText = "Ping";
const start = performance.now();
await fetch("https://www.google.com/favicon.ico",{cache:"no-store"}).catch(()=>{});
const end = performance.now();
const ping = Math.round(end-start);
pingEl.innerText = ping + " ms";
}


async function downloadTest(){
modeEl.innerText = "Download";
const url = "https://speed.cloudflare.com/__down?bytes=8000000";
const start = performance.now();
const res = await fetch(url,{cache:"no-store"});
const reader = res.body.getReader();
let received = 0;
let lastTime = start;


while(true){
const {done,value} = await reader.read();
if(done) break;
received += value.length;
const now = performance.now();
const speed = (received*8)/((now-start)/1000)/1024/1024;
updateGauge(speed);
lastTime = now;
}


const end = performance.now();
const speed = (received*8)/((end-start)/1000)/1024/1024;
downEl.innerText = speed.toFixed(2) + " Mbps";
updateGauge(speed);
}


async function uploadTest(){
modeEl.innerText = "Upload";
let totalBytes = 0;
const chunk = new Blob([new Array(1024*1024).join("a")]); // 1MB chunk
const chunks = 6; // total ~6MB
const start = performance.now();


for(let i=0;i<chunks;i++){
await fetch("https://httpbin.org/post",{method:"POST",body:chunk}).catch(()=>{});
totalBytes += chunk.size;
const now = performance.now();
const speed = (totalBytes*8)/((now-start)/1000)/1024/1024;
updateGauge(speed);
}


const end = performance.now();
const speed = (totalBytes*8)/((end-start)/1000)/1024/1024;
upEl.innerText = speed.toFixed(2) + " Mbps";
updateGauge(speed);
}


btn.onclick = async ()=>{
btn.disabled = true;
updateGauge(0);
await detectServer();
await pingTest();
await downloadTest();
await uploadTest();
modeEl.innerText = "Done";
btn.disabled = false;
};
