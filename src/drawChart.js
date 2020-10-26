const fs = require('fs')
const fetch = require('node-fetch')
const asciichart = require('asciichart')

const config = {
  colors: [
    asciichart.red,
    asciichart.yellow,
    asciichart.green
  ],
  height: 15
}

const draw = async () => {
  const res = await fetch('http://178.62.249.30:3000/api')
  const json = await res.json()
  console.clear()
  console.log('=======etherscan=====')
  console.log(asciichart.plot(json.eth, config))
  console.log('======poaNetwork=====')
  console.log(asciichart.plot(json.poa, config))
  console.log('=======myCrypto======')
  console.log(asciichart.plot(json.cry, config))
  console.log('=======upvest========')
  console.log(asciichart.plot(json.upv ,config))
  console.log('=====================')
}

draw()
//setInterval(draw, 60000)
