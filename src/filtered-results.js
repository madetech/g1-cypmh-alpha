const bent = require('bent')

const unauthContentPost = bent(process.env.CONTENT_API_URL,'json','POST')

let contentToken = null
const contentAuth = async () => {
const current_time = new Date().getTime() / 1000;
  if (contentToken === null ||  current_time > contentToken.exp) {
    contentToken = await unauthContentPost('/auth/local',{
      identifier: process.env.CONTENT_API_USERNAME,
      password: process.env.CONTENT_API_PASSWORD,
    });
  }
  return contentToken;
}

const callStrapiApi = async (endpoint, query) => {
  const token = await contentAuth()
  const contentGet = bent(process.env.CONTENT_API_URL,'json',{
    Authorization:
    'Bearer ' + token.jwt
  })
  try {
    let results = await contentGet("/" + endpoint + "?" + query)
    return results 
  } catch (err){
    logger.error(err)
    return err
  }
}

const filteredResults = async (data) => {
  let filteredServices= []
  const allServices = await callStrapiApi("services", "")
  filteredServices = allServices.filter(service => service.tags.length === 0)
  filteredServices = filteredServices.concat(allServices.filter(service => service.tags.find(tag => data?.tags === tag.name)))
  if (data?.support_types) {
    filteredServices = filteredServices.filter(service => service.support_types.find(support_type => data.support_types.includes(support_type.name)))
    if (data?.helpline_types) {
      filteredServices = filteredServices.filter(service => service.helpline_types.find(helpline_type => helpline_type.name === data?.helpline_types))
    }
  }
  if (data?.age) {
    age = Number(data.age) 
    filteredServices = filteredServices.filter(service => service.maxAge >= age && service.minAge <= age)
  }
  if (data?.free && data.free === 'true') {
    filteredServices = filteredServices.filter(service => service.free === true)
  }

  return filteredServices
}

module.exports = filteredResults;

