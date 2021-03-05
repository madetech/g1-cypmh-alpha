const getNextChatState = require('../src/chatbot-return-message');
describe('ChatBot', ()=> {
  it ("returns welcome message on first call", async done => {
    let newChatState = await getNextChatState()
    expect(newChatState.chatState).toBe(0)
    done()
  }) 

  it ("returns welcome state if undefined is passed in", async done => {
    const bothUndefined = await getNextChatState(undefined, undefined)
    expect(bothUndefined.chatState).toBe(0)
    const responseUndefined = await getNextChatState(0,undefined)
    expect(responseUndefined.chatState).toBe(0)
    const chatStateUndefined = await getNextChatState(undefined, "hello")
    expect(chatStateUndefined.chatState).toBe(0)
    done()
  })

})