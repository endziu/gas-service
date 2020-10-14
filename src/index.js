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
  etherscan_current: [],
  poaNetwork: [[],[],[]],
  poaNetwork_current: [],
  myCrypto: [[],[],[]],
  myCrypto_current: [],
  upvest: [[],[],[]],
  upvest_current: []
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

  const poa = await fetch('https://gasprice.poa.network/')
  const poaJson = await poa.json()
  data.poaNetwork_current = [poaJson.fast, poaJson.standard, poaJson.slow, Date.now()].map(Math.round)

  const myCrypto = await fetch('https://gas.mycryptoapi.com/')
  const myCryptoJson = await myCrypto.json()
  data.myCrypto_current = [myCryptoJson.fast, myCryptoJson.standard, myCryptoJson.safeLow, Date.now()].map(Math.round)

  const upvest = await fetch('https://fees.upvest.co/estimate_eth_fees')
  const upvestJson = await upvest.json()
  data.upvest_current = [upvestJson.estimates.fast, upvestJson.estimates.medium, upvestJson.estimates.slow, Date.now()].map(Math.round)

  if (data.etherscan[0].length > 59) {
    data.etherscan = data.etherscan.map(a => tail(a))
  }

  data.etherscan[0].push(data.etherscan_current[0])
  data.etherscan[1].push(data.etherscan_current[1])
  data.etherscan[2].push(data.etherscan_current[2])

  if (data.poaNetwork[0].length > 59) {
    data.poaNetwork = data.poaNetwork.map(a => tail(a))
  }

  data.poaNetwork[0].push(data.poaNetwork_current[0])
  data.poaNetwork[1].push(data.poaNetwork_current[1])
  data.poaNetwork[2].push(data.poaNetwork_current[2])

  if (data.myCrypto[0].length > 59) {
    data.myCrypto = data.myCrypto.map(a => tail(a))
  }

  data.myCrypto[0].push(data.myCrypto_current[0])
  data.myCrypto[1].push(data.myCrypto_current[1])
  data.myCrypto[2].push(data.myCrypto_current[2])

  if (data.upvest[0].length > 59) {
    data.upvest = data.upvest.map(a => tail(a))
  }

  data.upvest[0].push(data.upvest_current[0])
  data.upvest[1].push(data.upvest_current[1])
  data.upvest[2].push(data.upvest_current[2])
}

main()
setInterval(main, 60000)

app.get('/', wrap(async (req,res) => {
  res.send(template([data.etherscan_current, data.poaNetwork_current, data.myCrypto_current, data.upvest_current]))
}))

app.get('/history', wrap(async (req, res) => {
  res.json(data)
}))

app.listen(3000)

