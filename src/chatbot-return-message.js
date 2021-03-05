const chatStates = 
  {
    999:{
      outgoingMessage:`Sorry that our service finding chatbot wasn't helpful for you.\nIf you want to text a person about your mental health, tic+ (077XXXXXXX) is a text chatting service.\nIf you want to see a full list of the services, please go here:  https://g1-cypmh-alpha.herokuapp.com/a-z-of-services-national. You can restart your questions at any time by texting this number back`
    },
    0: {
      outgoingMessage:[
        `Hi ((name)), and well done for looking for help. Talking about mental health is hard, we know.`,
        `How this works:\nI'm a text-bot.\nI'll ask you some questions, then I'll let you know your best options for getting support.\n\nIf you'd rather, you can see the list of everything that's available in Gloucestershire here: https://g1-cypmh-alpha.herokuapp.com/a-z-of-services-national .\n\nAnd if the questions aren't working for you, you can text "talk to a human" at any time.`,
        `Here's the first question. To reply, type the number next to the answer which best describes your feelings.\n\nWhat have you been struggling with lately?\n1 - Mood and motivation\n2 - Eating habits or body image\n3 - Gender identity or sexuality\n4 - Seeing or hearing things\n5 - Self-harm\n6 - Something bad has happened\n7 - Feeling worried and anxious\n8 - Thinking about suicide`
      ],
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




