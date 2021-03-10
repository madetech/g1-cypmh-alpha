const getNextChatState = require('../src/chatbot-return-message');
describe('basic ChatBot', ()=> {
  it ("returns welcome message on first call", async done => {
    let newChatState = await getNextChatState()
    expect(newChatState.chatState).toBe(0)
    done()
  }) 
  it ("returns sorry didn't get that when user messages random string", async () =>{
    const response = await getNextChatState(6,"d")
    expect(response.chatState).toBe(6)
    expect(response.message).toBe(`Sorry I didn't quite get that, please try again`)
  })

  it ("returns sorry didn't get that when user messages number that isn't an option", async () =>{
    const response = await getNextChatState(0,"100")
    expect(response.chatState).toBe(0)
    expect(response.message).toBe(`Sorry I didn't quite get that, please try again`)
  })

  it ("returns sorry didn't get that when user messages number that isn't an option", async () =>{
    const response = await getNextChatState(0,"1 ")
    expect(response.chatState).toBe(9)
    expect(response.message).toBe(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
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

  it ("returns welcome message array if state is 0", async done => {
    const welcomeMessages = await getNextChatState(undefined,undefined)
    expect(welcomeMessages.message).toHaveLength(3)
    expect(welcomeMessages.message[0]).toBe("Hi ((name)), and well done for looking for help. Talking about mental health is hard, we know.")
    expect(welcomeMessages.message[1]).toBe(`How this works:\nI'm a text-bot.\nI'll ask you some questions, then I'll suggest some support options, based on how you tell me you're feeling.\n\nIf you'd rather, you can see the list of everything that's available in Gloucestershire here: https://g1-cypmh-alpha.herokuapp.com/new-user-landing-page\n\nIf the questions aren't working for you, you can text "talk to a human" at any time.`)
    expect(welcomeMessages.message[2]).toBe(`Here's the first question. To reply, type the number next to the answer which best describes you.\n\nWhat have you been struggling with lately?\n1 - Mood and motivation\n2 - Eating habits or body image\n3 - Gender identity or sexuality\n4 - Seeing or hearing things\n5 - Self-harm\n6 - Something bad has happened\n7 - Feeling worried and anxious\n8 - Thinking about suicide`)
    done()
  })
})
describe("after first message",()=> {
  it ("if the user replies 1 (Mood and motivation) the correct content & tag:mood is returned ", async done => {
    const nextChatState = await getNextChatState(0,"1")
    expect(nextChatState.data).toEqual({tags: "mood"})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
    done()
  })
  it ("if the user replies 6 (something bad has happened) another message is sent asking about the trauma ", async done => {
    const nextChatState = await getNextChatState(0,"6")
    expect(nextChatState.chatState).toBe(6)
    expect(nextChatState.message).toEqual(`I'm really sorry about that. It would help to know what's happened, but if you'd rather, you can type "skip" to skip this question.\n\nWhat was the bad thing?\n1 - Somebody close to me has died\n2 - The covid-19 pandemic\n3 - I'm being bullied\n4 - I've been sexually abused or assaulted\n5 - I've had a miscarriage\n6 - I've had to seek asylum\n7 - I've experienced domestic abuse\n8 - Someone in my family is really ill\n9 - Something else`)
    done()
  })
  it ("if the user replies 8 (thinking about suicide) another message is sent asking how urgent ", async done => {
    const nextChatState = await getNextChatState(0,"8")
    expect(nextChatState.chatState).toBe(8)
    expect(nextChatState.message).toEqual(`I'm sorry to hear that. Are you feeling suicidal right now?\n1 - Yes, I need some help straightaway\n2 - Not right now`)
    done()
  })
})
describe("after the second message", () => {
  it ("if the user is asked about trauma, and reply 2 (covid) correct reply and tag:covid is returned", async done => {
    const nextChatState = await getNextChatState(6,"2")
    expect(nextChatState.data).toEqual({tags: "covid"})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
    done()
  })
  it ("if the user is asked about trauma, and reply 9 (something else) correct reply and no tag is returned", async done => {
    const nextChatState = await getNextChatState(6,"9")
    expect(nextChatState.data).toEqual({})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
    done()
  })

})
  
