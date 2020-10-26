const fetch = require('node-fetch')
const express = require('express')
const compression = require('compression')
const morgan = require('morgan')

const server = express()
server.use(compression())
server.use(morgan(':method :url :status :remote-addr :response-time ms'))

const template = require('./template.js')
const { update, getGasInfo, wrap } = require('./utils.js')
const { ETHERSCAN_APIKEY } = require('../config.js')

const providers = {
  eth: `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_APIKEY}`,
  poa: 'https://gasprice.poa.network',
  cry: 'https://gas.mycryptoapi.com/',
  upv: 'https://fees.upvest.co/estimate_eth_fees'
}

let data = {
  eth: [[],[],[]],
  eth_last: [],
  poa: [[],[],[]],
  poa_last: [],
  cry: [[],[],[]],
  cry_last: [],
  upv: [[],[],[]],
  upv_last: [],
  timestamp: 0
}

const main = async () => {
  data.eth_last = await getGasInfo(providers.eth, ['FastGasPrice', 'ProposeGasPrice', 'SafeGasPrice'],'result')
  data.poa_last = await getGasInfo(providers.poa, ['fast', 'standard', 'slow'])
  data.cry_last = await getGasInfo(providers.cry, ['fast', 'standard', 'safeLow'])
  data.upv_last = await getGasInfo(providers.upv, ['fast', 'medium', 'slow'],'estimates')
  data.timestamp = Date.now()
  Object.keys(providers).map(s => update(s, data))
}

main()
setInterval(main, 60000)

server.get('/', wrap(async (req,res) => {
  res.send(template([data.eth_last, data.poa_last, data.cry_last, data.upv_last]))
}))

server.get('/api', wrap(async (req, res) => {
  res.json(data)
}))

server.listen(3000)

