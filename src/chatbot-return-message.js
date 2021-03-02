const getNextChatState = (currentChatState, response) => {
  if (currentChatState === undefined || response === undefined) {
    return Promise.resolve({
      chatState: 0,
      message:"Welcome to the Mental Health check-in ((name)). Are you feeling 1. Anxious, 2. Depressed, 3. Hungry?"
    })

  }
  switch (currentChatState) {
    case 0:
      switch (response) {
        case "Anxiety": return Promise.resolve({
            chatState: 1,
            message: "Sorry that you're feeling anxious, would you like to: 1. Speak to someone on the phone, 2. Chat to someone online, 3. Speak to someone in person?"
          });
          case "Depression":return Promise.resolve({
              chatState: 2,
              message: "Sorry that you're feeling depressed, would you like to: 1. Speak to someone on the phone, 2. Chat to someone online, 3. Speak to someone in person?"
            });  
          case "Hungry":return Promise.resolve({
              chatState: 3,
              message: "Sorry that you're feeling hungry, would you like to: 1. Speak to someone on the phone, 2. Chat to someone online, 3. Speak to someone in person?"
            });  
        default: return Promise.resolve({
          chatState: currentChatState,
          message: "Sorry I didn't quite get that, please try again"
        })
      }
  
    default:
      break;
  }

}
module.exports = getNextChatState