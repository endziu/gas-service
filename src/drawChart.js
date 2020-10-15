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
  const res = await fetch('http://18.192.6.19/history')
  const json = await res.json()
  console.clear()
  console.log('=======etherscan=====')
  console.log(asciichart.plot(json.etherscan, config))
  console.log('======poaNetwork=====')
  console.log(asciichart.plot(json.poaNetwork, config))
  console.log('=======myCrypto======')
  console.log(asciichart.plot(json.myCrypto, config))
  console.log('=======upvest========')
  console.log(asciichart.plot(json.upvest ,config))
  console.log('=====================')
}

draw()
setInterval(draw, 60000)
