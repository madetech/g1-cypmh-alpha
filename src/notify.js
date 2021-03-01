const jwt = require('jsonwebtoken');
const bent = require('bent')


let govUKToken = null
const contentAuth = async () => {
  govUKToken = jwt.sign({
    "iss": process.env.GOV_NOTIFY_ISS,
  }, process.env.GOV_NOTIFY_SECRET_KEY);
return govUKToken;
}

const sendMessage = async (message,phoneNumber) =>{
  const token = await contentAuth().catch(err => {return err})
  const contentPost = bent(process.env.GOV_NOTIFY_URL,'POST','json',201,{
    Authorization:
    'Bearer ' + token
  })
  try {
    let results = await contentPost("/v2/notifications/sms", {
      "phone_number": `${phoneNumber}`,
      "template_id": `${process.env.GOV_NOTIFY_MESSAGE_TEMPlATE_ID}`,
      "personalisation": {
        "messageBody": `${message}`,
      }

    })
    return results
  }
  catch (err) {
    throw err
  }
}

module.exports = {sendMessage}