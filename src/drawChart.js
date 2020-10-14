const fs = require('fs')
const fetch = require('node-fetch')
const asciichart = require('asciichart')

const config = {
  colors: [
    asciichart.red,
    asciichart.yellow,
    asciichart.green
  ],
  height: 40
}

const draw = async () => {
  const res = await fetch('http://18.192.6.19/history')
  const json = await res.json()
  console.log(asciichart.plot(json.etherscan, config))
  console.log(" red: fast\n", "yellow: average\n", "green: cheap\n" )
}

draw()
