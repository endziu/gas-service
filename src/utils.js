const fetch = require('node-fetch')

const tail = (arr) => arr.slice(1)

async function getGasInfo(address, fields, path) {
  const response = await fetch(address)
  const body = await response.json()
  return [
    path ? body[path][fields[0]] : body[fields[0]],
    path ? body[path][fields[1]] : body[fields[1]],
    path ? body[path][fields[2]] : body[fields[2]]
  ].map(Math.round)
}

function update(name, data) {
  if (data[name][0].length > 59) {
    data[name] = data[name].map(a => tail(a))
  }
  data[name][0].push(data[name+"_last"][0])
  data[name][1].push(data[name+"_last"][1])
  data[name][2].push(data[name+"_last"][2])
}

module.exports = {
  getGasInfo,
  update
}
