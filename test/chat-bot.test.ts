const getNextChatState = require('../src/chatbot-return-message');
describe('ChatBot', ()=> {
  it ("returns welcome message on first call", async done => {
    let newChatState = await getNextChatState()
    expect(newChatState.chatState).toBe(0)
    done()
  }) 
})