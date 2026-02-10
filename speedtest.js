async function pingTest(){
  let start = performance.now();
  await fetch("https://api.github.com/");
  let end = performance.now();
  return Math.round(end - start);
}

async function downloadTest(){
  let url = "https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png";
  let start = performance.now();
  let r = await fetch(url);
  let b = await r.blob();
  let end = performance.now();

  let bits = b.size * 8;
  let sec = (end - start) / 1000;
  return (bits / sec / 1024 / 1024).toFixed(2);
}

async function uploadTest(){
  let data = new Uint8Array(1024 * 1024); // 1MB fake upload
  let start = performance.now();
  await fetch("https://httpbin.org/post", {
    method: "POST",
    body: data
  });
  let end = performance.now();

  let bits = data.length * 8;
  let sec = (end - start) / 1000;
  return (bits / sec / 1024 / 1024).toFixed(2);
}

async function startSpeedTest(){
  document.getElementById("ping").innerText = "...";
  document.getElementById("down").innerText = "...";
  document.getElementById("up").innerText = "...";

  let ping = await pingTest();
  document.getElementById("ping").innerText = ping;

  let down = await downloadTest();
  document.getElementById("down").innerText = down;

  let up = await uploadTest();
  document.getElementById("up").innerText = up;
}
