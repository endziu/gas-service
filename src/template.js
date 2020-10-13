style = `<style>
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
  display: block;
}
body { line-height: 1; }
ol, ul { list-style: none; }
blockquote, q { quotes: none; }
blockquote:before, blockquote:after, q:before, q:after { content: ''; content: none; }
table { border-collapse: collapse; border-spacing: 0; }

.bg-light-gray { background: #dddfdd; }
.near-black { color: #222; }
.fs-1 { font-size: 0.75rem; }
.fs-2 { font-size: 1rem; }
.fs-3 { font-size: 2rem; }
.fs-4 { font-size: 3rem; }
.bold { font-weight: bold; }
.text-center { text-align: center; }
.p-1 { padding: 0.5rem; }
.p-2 { padding: 1rem; }
.p-3 { padding: 2rem; }
.m-1 { margin: 0.5rem; }
.m-2 { margin: 1rem; }
.m-3 { margin: 2rem; }
.sans-serif { font-family: Verdana, sans-serif; }
.border-dashed { border: 1px dashed #a3a7a3; }
.fitToContent { width: fit-content; }
.block-center { margin: 1rem auto; }
.skew { transform: perspective(800px) rotateY(-12deg); }
.shadow { 
  box-shadow: 
    rgba(0, 0, 0, 0.01) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0.07) 0px 1px 0px 0px,
    rgba(0, 0, 0, 0.1) 0px 0px 8px 0px,
    rgba(0, 0, 0, 0.2) 0px 20px 30px 0px;
}
.transition { transition: all 1s; }
.bg-gray { background: #efefef; }
.main:hover { transform: rotateY(0); box-shadow: none; transform: scale(1.1) }
</style>`

const template = (values) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Gassssssssssssssssssssssss...</title>
</head>
${style}
<body class="bg-light-gray">
<h1 class="text-center m-3">
  <svg viewBox="0 0 20 20" width="48px" stroke="black" stroke-width="1" fill="black" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path d="M13,18 L13,1.99079514 C13,0.898212381 12.1007504,0 10.9914698,0 L3.0085302,0 C1.90195036,0 1,0.891309342 1,1.99079514 L1,18 L0,18 L0,20 L14,20 L14,18 L13,18 Z M3,2 L11,2 L11,8 L3,8 L3,2 Z M13,10 L13.9989566,10 C15.1041023,10 16,10.8982606 16,11.9979131 L16,15.009222 C16,15.5564136 16.4438648,16 17,16 C17.5522847,16 18,15.5490248 18,15.009222 L18,10 L16,8 L16,6 L14,4 L15,3 L20,8 L20,14.9996703 C20,16.6567066 18.6534829,18 17,18 C15.3431458,18 14,16.6534829 14,15 L14,12 L13,12 L13,10 Z" id="Combined-Shape"></path>
  </svg>
</h1>
<div class="main bg-gray block-center fitToContent skew transition shadow">
  <table class="fs-3 sans-serif near-black">
  <tr>
    <th class="border-dashed text-center p-2 bold">Speed</th>
    <th class="border-dashed text-center p-2 bold">Price</th>
  </tr>
  <tr>
    <td class="border-dashed text-center p-2 fs-3">🚀</td>
    <td class="border-dashed text-center p-2 fs-3" id="instant">${values[0]} Gwei</td>
  </tr>
  <tr>
    <td class="border-dashed text-center p-2 fs-3">🏎️</td>
    <td class="border-dashed text-center p-2 fs-3" id="fast">${values[1]} Gwei</td>
  </tr>
  <tr>
    <td class="border-dashed text-center p-2 fs-3">🚊</td>
    <td class="border-dashed text-center p-2 fs-3" id="average">${values[2]} Gwei</td>
  </tr>
  <tr>
    <td class="border-dashed text-center p-2 fs-3">🚲</td>
    <td class="border-dashed text-center p-2 fs-3" id="cheap">${values[3]} Gwei</td>
  </tr>
  </table>
</div>
<p id="timer" class="text-center sans-serif fs-1 m-3">last update: just now.</p>
<script type="text/javascript">
  function getCurrentData() {
    fetch('http://18.192.6.19/current')
      .then(response => response.json())
      .then(data => {
        document.getElementById("instant").innerText = data[0] + " Gwei" || "~"
        document.getElementById("fast").innerText = data[1] + " Gwei" || "~"
        document.getElementById("average").innerText = data[2] + " Gwei" || "~"
        document.getElementById("cheap").innerText = data[3] + " Gwei" || "~"
        document.getElementById("timer").innerText = "last update: " + new Date(data[4]).toLocaleTimeString()
      })
  }
  setInterval(getCurrentData,60000)
</script>
</body>
</html>
`
module.exports = template;
