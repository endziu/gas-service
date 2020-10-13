const fetch = require('node-fetch')
const express = require('express')
const app = express()
const compression = require('compression')
app.use(compression())

const cheerio = require('cheerio')
const template = require('./template.js')

const wrap = fn => (...args) => fn(...args).catch(args[2])
const tail = (arr) => arr.slice(1)

let data = [[],[],[]]
let current = []

const scrape = async (address) => {
  const page = await fetch(address)
  const text = await page.text()
  const $ = cheerio.load(text)
  const ids = ['#spanHighPrice', '#spanAvgPrice', '#spanLowPrice']
  const values = ids
    .map( id => $(id).parent().text().replace(/\s/g, "") )
    //.map( s => s.substring(s.indexOf('(')+1,s.indexOf(')')) )
    .map( s => Number(s.replace(/[^0-9.]/g, '')) )
  values[3] = Date.now()
  return values
}

const main = async () => {
  current = await scrape('https://etherscan.io/gastracker')

  if (data[0].length > 59) {
    data = data.map(a => tail(a))
  }

  data[0].push(current[0])
  data[1].push(current[1])
  data[2].push(current[2])
}

main()
setInterval(main, 60000)

app.get('/', wrap(async (req,res) => {
  res.send(template(current))
}))

app.get('/history', wrap(async (req, res) => {
  res.json(data)
}))

app.get('/current', wrap(async (req, res) => {
  res.json(current)
}))

app.listen(3000)

