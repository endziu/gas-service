const fs = require('fs')
const fetch = require('node-fetch')
const asciichart = require('asciichart')

const config = {
  colors: [
    asciichart.red,
    asciichart.yellow,
    asciichart.blue,
    asciichart.green
  ],
  height: 40
}


const doStuff = async () => {
  const res = await fetch('http://18.192.6.19/history')
  const json = await res.json()
  console.log(asciichart.plot(json, config))
  console.log(" red: instant\n", "yellow: fast\n", "blue: average\n", "green: cheap\n" )
  // console.log(json[0].length)
  // fs.writeFile('graph.txt', asciichart.plot(json, config), 'utf8', () => console.log('done!'))
}

doStuff()
