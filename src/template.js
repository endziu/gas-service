style = `
<style>
body {
   background: #dddfdd;
   color: #222;
   font-size: 2rem;
}
table {
  border-collapse: collapse;
  font-size: 2rem;
  font-family: arial, sans-serif;
}
td, th {
  border: 1px dashed #a3a7a3;
  padding: 1rem;
  text-align: center;
 }
div {
  width: fit-content;
  background: #efefef;
  margin: 1rem auto;
  transform:
  perspective(800px)
  rotateY(-12deg);
  transition: transform 1s;
  box-shadow:
  rgba(0, 0, 0, 0.01) 0px 0px 0px 1px,
  rgba(0, 0, 0, 0.07) 0px 1px 0px 0px,
  rgba(0, 0, 0, 0.1) 0px 0px 8px 0px,
  rgba(0, 0, 0, 0.2) 0px 20px 30px 0px;
}
div:hover {
  transform: rotateY(0);
}
h1 {
  text-align: center;
  margin: 2.5rem 0 2rem 0;
}
#timer {
  font-size: 1rem;
  background: #dddfdd;
  text-align: center;
  color: #99acca;  
}
</style>
`

const template = (values) => `
${style}
<h1>
  <svg viewBox="0 0 20 20" width="48px" stroke="black" stroke-width="1" fill="black" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path d="M13,18 L13,1.99079514 C13,0.898212381 12.1007504,0 10.9914698,0 L3.0085302,0 C1.90195036,0 1,0.891309342 1,1.99079514 L1,18 L0,18 L0,20 L14,20 L14,18 L13,18 Z M3,2 L11,2 L11,8 L3,8 L3,2 Z M13,10 L13.9989566,10 C15.1041023,10 16,10.8982606 16,11.9979131 L16,15.009222 C16,15.5564136 16.4438648,16 17,16 C17.5522847,16 18,15.5490248 18,15.009222 L18,10 L16,8 L16,6 L14,4 L15,3 L20,8 L20,14.9996703 C20,16.6567066 18.6534829,18 17,18 C15.3431458,18 14,16.6534829 14,15 L14,12 L13,12 L13,10 Z" id="Combined-Shape"></path>
</svg>
</h1>
<div>
  <table>
  <tr>
  <th>speed</th>
  <th>price</th>
  </tr>
  <tr>
  <td>🚀</td>
  <td id="instant">${values[0]} Gwei</td>
  </tr>
  <tr>
  <td>🏎️</td>
  <td id="fast">${values[1]} Gwei</td>
  </tr>
  <tr>
  <td>🚊</td>
  <td id="average">${values[2]} Gwei</td>
  </tr>
  <tr>
  <td>🚲</td>
  <td id="cheap">${values[3]} Gwei</td>
  </tr>
  </table>
</div>
<p id="timer">...</p>
<script type="text/javascript">
  function getCurrentData() {
    fetch('http://18.192.6.19/current')
      .then(response => response.json())
      .then(data => {
        document.getElementById("instant").innerText = data[0] + " Gwei" || "~"
        document.getElementById("fast").innerText = data[1] + " Gwei" || "~"
        document.getElementById("average").innerText = data[2] + " Gwei" || "~"
        document.getElementById("cheap").innerText = data[3] + " Gwei" || "~"
      })
  }
  setInterval(getCurrentData,60000)
</script>
`
module.exports = template;
