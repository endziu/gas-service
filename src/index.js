const fetch = require('node-fetch')
const express = require('express')
const app = express()
const compression = require('compression')
app.use(compression())

const cheerio = require('cheerio')
const template = require('./template.js')

const wrap = fn => (...args) => fn(...args).catch(args[2])
const tail = (arr) => arr.slice(1)

let data = {
  etherscan: [[],[],[]],
  etherscan_current: []
}

const extractPageData = async (address, selectors) => {
  const page = await fetch(address)
  const text = await page.text()
  const $ = cheerio.load(text)
  const values = selectors.map( id => $(id).parent().text().replace(/\s/g, "") )
                          .map( s => Number(s.replace(/[^0-9.]/g, '')) )
                       // .map( x => {console.log(x);return x;} )
  values[3] = Date.now()
  return values
}

const main = async () => {
  data.etherscan_current = await extractPageData(
    'https://etherscan.io/gastracker',
    ['#spanHighPrice', '#spanAvgPrice', '#spanLowPrice']
  )

  if (data.etherscan[0].length > 59) {
    data.etherscan = data.etherscan.map(a => tail(a))
  }

  data.etherscan[0].push(data.etherscan_current[0])
  data.etherscan[1].push(data.etherscan_current[1])
  data.etherscan[2].push(data.etherscan_current[2])
}

main()
setInterval(main, 60000)

app.get('/', wrap(async (req,res) => {
  res.send(template(data.etherscan_current))
}))

app.get('/history', wrap(async (req, res) => {
  res.json(data)
}))

app.listen(3000)

