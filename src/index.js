const fetch = require('node-fetch')
const express = require('express')
const app = express()
const compression = require('compression')
app.use(compression())

const cheerio = require('cheerio')
const template = require('./template.js')

const wrap = fn => (...args) => fn(...args).catch(args[2])
const tail = (arr) => arr.slice(1)

let data = [[],[],[],[]]
let values = []

const gatherData = async () => {
  const page = await fetch('https://ethgasstation.info/calculatorTxV.php')
  const text = await page.text()
  const $ = cheerio.load(text)
  const ids = ['#fastest', '#fast', '#avg', '#cheap']
  const prices = ids
    .map( id => $(id).parent().text().replace(/\s/g, "") )
    .map( s => ({ [s.substring(0,s.indexOf('('))]: s.substring(s.indexOf('(')+1,s.indexOf(')')) }) )
    .reduce( (prev,curr) => Object.assign(prev,curr),{} )

  values = Object.values(prices).map(s => Number(s.replace(/[^0-9.]/g, '')))

  if (data[0].length > 59) {
    data = data.map(a => tail(a))
  }
  data[0].push(values[0])
  data[1].push(values[1])
  data[2].push(values[2])
  data[3].push(values[3])
}

gatherData()
setInterval(gatherData, 60000)

app.get('/', wrap(async (req,res) => {
  res.send(template(values))
}))

app.get('/history', wrap(async (req, res) => {
  res.json(data)
}))

app.get('/current', wrap(async (req, res) => {
  res.json(values)
}))

app.listen(3000)

