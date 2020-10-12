const template = (values) => `
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
}
</style>
<h1>oOQq</h1>
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
