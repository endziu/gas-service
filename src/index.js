const fetch = require('node-fetch')
const express = require('express')
const app = express()
const compression = require('compression')
app.use(compression())

const cheerio = require('cheerio')
const template = require('./template.js')
const { ETHERSCAN_APIKEY } = require('../config.js')

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
  upvest_current: [],
  timestamp: 0
}

const getGasInfo = async (address, fields, path) => {
  const response = await fetch(address)
  const body = await response.json()
  return [
    path ? body[path][fields[0]] : body[fields[0]],
    path ? body[path][fields[1]] : body[fields[1]],
    path ? body[path][fields[2]] : body[fields[2]]
  ].map(Math.round)
}

const update = (name) => {
  if (data[name][0].length > 59) {
    data[name] = data[name].map(a => tail(a))
  }
  data[name][0].push(data[name+"_current"][0])
  data[name][1].push(data[name+"_current"][1])
  data[name][2].push(data[name+"_current"][2])
}

const main = async () => {
  data.etherscan_current = await getGasInfo(
    `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_APIKEY}`,
    ['FastGasPrice', 'ProposeGasPrice', 'SafeGasPrice'],
    'result'
  )
  data.poaNetwork_current = await getGasInfo('https://gasprice.poa.network', ['fast', 'standard', 'slow'])
  data.myCrypto_current = await getGasInfo('https://gas.mycryptoapi.com/', ['fast', 'standard', 'safeLow'])
  data.upvest_current = await getGasInfo('https://fees.upvest.co/estimate_eth_fees', ['fast', 'medium', 'slow'],'estimates')
  data.timestamp = Date.now()
  
  update('etherscan')
  update('poaNetwork')
  update('myCrypto')
  update('upvest')
}

main()
setInterval(main, 60000)

app.get('/', wrap(async (req,res) => {
  res.send(template([data.etherscan_current, data.poaNetwork_current, data.myCrypto_current, data.upvest_current, Date.now()]))
}))

app.get('/history', wrap(async (req, res) => {
  res.json(data)
}))

app.listen(3000)

