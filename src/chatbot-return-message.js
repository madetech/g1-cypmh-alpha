const chatStates = 
  {
    999:{
      outgoingMessage:`Sorry that our service finding chatbot wasn't helpful for you.\nIf you want to text a person about your mental health, tic+ (077XXXXXXX) is a text chatting service.\nIf you want to see a full list of the services, please go here:  https://g1-cypmh-alpha.herokuapp.com/a-z-of-services-national. You can restart your questions at any time by texting this number back`
    },
    0: {
      outgoingMessage:`Welcome to the Mental Health check-in ((name)). If at any time you want to leave the text bot, reply STOP.\n Are you feeling:\n 1. Anxious\n 2. Depressed\n 3. Hungry`,
      returnOptionIds: [1,2,3],
    },
    1: {
    returnValue: "Anxious",
    returnType: "diagnoses",
    captureStrings: "1",
    outgoingMessage: `Sorry you're feeling anxious.\n Would you like to:\n1. Speak to someone on the phone\n2. Chat to someone online\n3. Speak to someone in person`,
    returnOptionIds : [4,5,6]
    },
    2: {
    returnValue: "Depressed",
    returnType: "diagnoses",
    captureStrings: "2",
    outgoingMessage: `Sorry you're feeling depressed.\n Would you like to:\n1. Speak to someone on the phone\n2. Chat to someone online\n3. Speak to someone in person`,
    returnOptionIds: [4,5,6]
    },
    3: {
    returnValue: "Hungry",
    returnType: "diagnoses",
    captureStrings: "3",
    outgoingMessage: `Sorry you're feeling hungry.\n Would you like to:\n1. Speak to someone on the phone\n2. Chat to someone online\n3. Speak to someone in person`,
    returnOptionIds: [4,5,6]
    }
  }


const getNextChatState = (currentChatState, response) => {
  if (currentChatState === undefined || response === undefined || currentChatState === 999 ) {
    return Promise.resolve({
      chatState: 0,
      message: chatStates[0].outgoingMessage
    })
  }

  if (response.includes("STOP")) {
    return Promise.resolve({
      chatState: 999,
      message: chatStates[999].outgoingMessage
    })
  }


  const matchedStateId = chatStates[currentChatState].returnOptionIds
    .find(id => response.includes(chatStates[id].captureStrings))
 
  console.log(matchedStateId)
  if (matchedStateId !== undefined) {
    console.log("Returning response")
    return Promise.resolve({
      chatState: matchedStateId,
      message: chatStates[matchedStateId].outgoingMessage,
      data: chatStates[matchedStateId].returnValue
    })
  } else {
    console.log("Returning retry message")
    return Promise.resolve({
      chatState: currentChatState,
      message: "Sorry I didn't quite get that, please try again"
    })
  }
  
  // chatStates[currentChatState].returnOptionIds.map(id => {
  //   console.log(`inside returns loop - id: ${id}`)
  //     if (response.includes(chatStates[id].captureStrings)){
  //       return Promise.resolve({
  //         chatState: id,
  //         message: chatStates[id].outgoingMessage,
  //         data: chatStates[id].returnValue
  //       })
  //     }
  //     return null;
  //   }).reduce((acc)=>{
  //     if (item !== null) {
  //       return item 
  //     } else {
  //       return acc
  //     }
  //   },null)

  // return Promise.resolve({
  //   chatState: currentChatState,
  //   message: "Sorry I didn't quite get that, please try again"
  // })

}
module.exports = getNextChatState




