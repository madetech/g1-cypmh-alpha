const jwt = require('jsonwebtoken');
const bent = require('bent')


let govUKToken = null
const contentAuth = async () => {
  console.log("getting new gov token...")
  govUKToken = jwt.sign({
    "iss": process.env.GOV_NOTIFY_ISS,
  }, process.env.GOV_NOTIFY_SECRET_KEY);
return govUKToken;
}

const sendMessage = async (message,phoneNumber) =>{
  const token = await contentAuth()
  const contentPost = bent(process.env.GOV_NOTIFY_URL,'POST','json',201,{
    Authorization:
    'Bearer ' + token
  })
  console.log("sending message..")
  try {
    let results = await contentPost("/v2/notifications/sms", {
      "phone_number": `${phoneNumber}`,
      "template_id": `${process.env.GOV_NOTIFY_MESSAGE_TEMPlATE_ID}`,
      "personalisation": {
        "messageBody": `${message}`,
      }

    })
    console.log("sent message")
    return results
  }
  catch (err) {
    console.log("error happened\n",err)
    throw err
  }
}

module.exports = {sendMessage}