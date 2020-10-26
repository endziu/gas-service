const express = require('express')
const fetch = require('node-fetch')

const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')

const server = express()
server.use(helmet())
server.use(compression())
server.use(morgan(':method :url :status :remote-addr :response-time ms'))

const { update, getGasInfo } = require('./utils.js')
const { ETHERSCAN_APIKEY } = require('../config.js')
const { template } = require('./template.js')

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

server.get('/', (req, res) => {
  const {eth_last, poa_last, cry_last, upv_last} = data
  res.send(template([eth_last, poa_last, cry_last, upv_last]))
})

server.get('/api', (req, res) => {
  res.json(data)
})

server.listen(3000)

