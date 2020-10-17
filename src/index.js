const fetch = require('node-fetch')
const express = require('express')
const app = express()
const compression = require('compression')
app.use(compression())

const template = require('./template.js')
const { update, getGasInfo } = require('./utils.js')
const { ETHERSCAN_APIKEY } = require('../config.js')

const wrap = fn => (...args) => fn(...args).catch(args[2])
const tail = (arr) => arr.slice(1)

const providers = {
  etherscan: `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_APIKEY}`,
  poaNetwork: 'https://gasprice.poa.network',
  myCrypto: 'https://gas.mycryptoapi.com/',
  upvest: 'https://fees.upvest.co/estimate_eth_fees'
}

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

const main = async () => {
  data.etherscan_current = await getGasInfo(providers.etherscan, ['FastGasPrice', 'ProposeGasPrice', 'SafeGasPrice'],'result')
  data.poaNetwork_current = await getGasInfo(providers.poaNetwork, ['fast', 'standard', 'slow'])
  data.myCrypto_current = await getGasInfo(providers.myCrypto, ['fast', 'standard', 'safeLow'])
  data.upvest_current = await getGasInfo(providers.upvest, ['fast', 'medium', 'slow'],'estimates')
  data.timestamp = Date.now()
  Object.keys(providers).map(s => update(s, data))
}

main()
setInterval(main, 60000)

app.get('/api', wrap(async (req, res) => {
  res.json(data)
}))

app.listen(3000)

