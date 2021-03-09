// function that calls content API with and returns list of all services in array format to be sent as texts

const { get } = require("http")
const { builtinModules } = require("module")

const getServicesArray = (results) => {
  if (results === undefined){
    return null
  }
  let count = 0
  return results.map(service => {
      count = count + 1
      return `Option ${count}: ${service.title}\n\n${service.description}\n\nWebsite:${service.url}\n`
  })
}

module.exports = getServicesArray