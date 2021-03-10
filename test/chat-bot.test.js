const getNextChatState = require('../src/chatbot-return-message');
describe('basic ChatBot', ()=> {
  it ("returns welcome message on first call", async () => {
    let newChatState = await getNextChatState()
    expect(newChatState.chatState).toBe(0)
    
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

  it ("returns welcome state if undefined is passed in", async () => {
    const bothUndefined = await getNextChatState(undefined, undefined)
    expect(bothUndefined.chatState).toBe(0)
    const responseUndefined = await getNextChatState(0,undefined)
    expect(responseUndefined.chatState).toBe(0)
    const chatStateUndefined = await getNextChatState(undefined, "hello")
    expect(chatStateUndefined.chatState).toBe(0)
    
  })

  it ("returns welcome message array if state is 0", async () => {
    const welcomeMessages = await getNextChatState(undefined,undefined)
    expect(welcomeMessages.message).toHaveLength(3)
    expect(welcomeMessages.message[0]).toBe("Hi ((name)), and well done for looking for help. Talking about mental health is hard, we know.")
    expect(welcomeMessages.message[1]).toBe(`How this works:\nI'm a text-bot.\nI'll ask you some questions, then I'll suggest some support options, based on how you tell me you're feeling.\n\nIf you'd rather, you can see the list of everything that's available in Gloucestershire here: https://g1-cypmh-alpha.herokuapp.com/new-user-landing-page\n\nIf the questions aren't working for you, you can text "talk to a human" at any time.`)
    expect(welcomeMessages.message[2]).toBe(`Here's the first question. To reply, type the number next to the answer which best describes you.\n\nWhat have you been struggling with lately?\n1 - Mood and motivation\n2 - Eating habits or body image\n3 - Gender identity or sexuality\n4 - Seeing or hearing things\n5 - Self-harm\n6 - Something bad has happened\n7 - Feeling worried and anxious\n8 - Thinking about suicide`)
    
  })
})
describe("after first message",()=> {
  it ("if the user replies 'talk to a human,'  the escape message is shown", async () => {
    const nextChatState = await getNextChatState(0,"talk to a human")
    expect(nextChatState.chatState).toBe(999)
    expect(nextChatState.message).toEqual(`Sorry that our service finding chatbot wasn't helpful for you.\nIf you want to text a person about your mental health, tic+chat (https://www.ticplus.org.uk/ticpluschat/) is an anonymous, safe, confidential, 1-2-1 support service for young people aged 9-21 living in Gloucestershire. It’s open 5-9pm, Sunday to Thursday.\nIf you want to see a full list of the services, please go here:  https://g1-cypmh-alpha.herokuapp.com/a-z-of-services-national.`)
    
  })
  it ("if the user replies 1 (Mood and motivation) the correct content & tag:mood is returned ", async () => {
    const nextChatState = await getNextChatState(0,"1")
    expect(nextChatState.data).toEqual({tags: "mood"})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
    
  })

  it ("if the user replies 2 (Eating habits or body image) the correct content & tag:eating-disorders is returned ", async () => {
    const nextChatState = await getNextChatState(0,"2")
    expect(nextChatState.data).toEqual({tags: "eating-disorders"})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
    
  })

  it ("if the user replies 3 (Gender/sexuality) the correct content & tag:gender is returned ", async () => {
    const nextChatState = await getNextChatState(0,"3")
    expect(nextChatState.data).toEqual({tags: "gender"})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
    
  })

  it ("if the user replies 4 (seeing/hearing things) the correct content & tag:psychosis is returned ", async () => {
    const nextChatState = await getNextChatState(0,"4")
    expect(nextChatState.data).toEqual({tags: "psychosis"})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
    
  })

  it ("if the user replies 5 (self harm) the correct content & tag:self-harm is returned ", async () => {
    const nextChatState = await getNextChatState(0,"5")
    expect(nextChatState.data).toEqual({tags: "self-harm"})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
    
  })
  it ("if the user replies 6 (something bad has happened) another message is sent asking about the trauma ", async () => {
    const nextChatState = await getNextChatState(0,"6")
    expect(nextChatState.chatState).toBe(6)
    expect(nextChatState.message).toEqual(`I'm really sorry about that. It would help to know what's happened, but if you'd rather, you can type "skip" to skip this question.\n\nWhat was the bad thing?\n1 - Somebody close to me has died\n2 - The covid-19 pandemic\n3 - I'm being bullied\n4 - I've been sexually abused or assaulted\n5 - I've had a miscarriage\n6 - I've had to seek asylum\n7 - I've experienced domestic abuse\n8 - Someone in my family is really ill\n9 - Something else`)
    
  })

  it ("if the user replies 7 (anxiety) the correct content & tag:anxiety is returned ", async () => {
    const nextChatState = await getNextChatState(0,"7")
    expect(nextChatState.data).toEqual({tags: "anxiety"})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
    
  })
  it ("if the user replies 8 (thinking about suicide) another message is sent asking how urgent ", async () => {
    const nextChatState = await getNextChatState(0,"8")
    expect(nextChatState.chatState).toBe(8)
    expect(nextChatState.message).toEqual(`I'm sorry to hear that. Are you feeling suicidal right now?\n1 - Yes, I need some help straightaway\n2 - Not right now`)
    
  })

  it ("if the user needs urgent suicide help the correct message is sent ", async () => {
    const nextChatState = await getNextChatState(8,"1")
    expect(nextChatState.chatState).toBe(20)
    expect(nextChatState.message).toEqual(`If you're feeling like you want to die, it's important to tell someone.\nHelp and support is available right now if you need it. You do not have to struggle with difficult feelings alone.\n\nThese free helplines are there to help when you're feeling down or desperate.\n\nSamaritans – for everyone\nCall 116 123\nEmail jo@samaritans\Website: Samaritans.org\n\nChildline – for children and young people under 19\nCall 0800 1111 – the number will not show up on your phone bill\nWebsite: https://www.childline.org.uk/.\n\nIf you don't want to make a phone call right now, the NHS website has lots more options here: https://www.nhs.uk/conditions/suicide/`)
    
  })
})


describe("after the second message", () => {
  it ("if the user is asked about trauma, and reply 'skip' correct reply and no tag is returned", async () => {
    const nextChatState = await getNextChatState(6,"skip")
    expect(nextChatState.data).toEqual({})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
  })
  it ("if the user is asked about trauma, and reply 1 (bereavement) correct reply and tag:bereavement is returned", async () => {
    const nextChatState = await getNextChatState(6,"1")
    expect(nextChatState.data).toEqual({tags: "bereavement"})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
  })
  it ("if the user is asked about trauma, and reply 2 (covid) correct reply and tag:covid is returned", async () => {
    const nextChatState = await getNextChatState(6,"2")
    expect(nextChatState.data).toEqual({tags: "covid"})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
    
  })

  it ("if the user is asked about trauma, and reply 3 (bullying) correct reply and tag:bullying is returned", async () => {
    const nextChatState = await getNextChatState(6,"3")
    expect(nextChatState.data).toEqual({tags: "bullying"})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
  })

  it ("if the user is asked about trauma, and reply 4 (sexual violence) correct reply and tag:sexual_violence is returned", async () => {
    const nextChatState = await getNextChatState(6,"4")
    expect(nextChatState.data).toEqual({tags: "sexual-violence"})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
  })

  it ("if the user is asked about trauma, and reply 5 (miscarriage) correct reply and tag:miscarriage is returned", async () => {
    const nextChatState = await getNextChatState(6,"5")
    expect(nextChatState.data).toEqual({tags: "miscarriage"})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
  })
  it ("if the user is asked about trauma, and reply 6 (asylum seeker) correct reply and tag:asylum-seeker is returned", async () => {
    const nextChatState = await getNextChatState(6,"6")
    expect(nextChatState.data).toEqual({tags: "asylum-seeker"})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
  })

  it ("if the user is asked about trauma, and reply 7 (domestic abuse) correct reply and tag:domestic-abuse is returned", async () => {
    const nextChatState = await getNextChatState(6,"7")
    expect(nextChatState.data).toEqual({tags: "domestic-abuse"})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
  })

  it ("if the user is asked about trauma, and reply 8 (family illness) correct reply and tag:family-illness is returned", async () => {
    const nextChatState = await getNextChatState(6,"8")
    expect(nextChatState.data).toEqual({tags: "family-illness"})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
  })
  it ("if the user is asked about trauma, and reply 9 (something else) correct reply and no tag is returned", async () => {
    const nextChatState = await getNextChatState(6,"9")
    expect(nextChatState.data).toEqual({})
    expect(nextChatState.chatState).toBe(9)
    expect(nextChatState.message).toEqual(`Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`)
    
  })

  it ("if the user is asked about what sort of treatment they need, they reply 3 (want someone now) and receive the right reply", async () => {
    const nextChatState = await getNextChatState(9,"3")
    
    expect(nextChatState.chatState).toBe(21)
    expect(nextChatState.message).toEqual(`Do you have a preference about how you contact someone?\n\n1 - Phone\n2 - Email\n3 - Online chat\n4 - etc\n5 - No preference`)
    expect(nextChatState.data).toEqual({support_types: "helpline"})

  })

  it ("if the user is asked about what sort of treatment they need, they reply 4 (ongoing help) and receive the right reply", async () => {
    const nextChatState = await getNextChatState(9,"4")
    expect(nextChatState.chatState).toBe(99)
    expect(nextChatState.message).toEqual(`My last question: How old are you?\n\nPlease reply with a number. This helps us only show you the best options for getting the kind of help you want.`)
    expect(nextChatState.data).toEqual({})
  })
  it ("if the user is asked about what sort of treatment they need, they reply 1 (figuring it out) and receive the right reply", async () => {
    const nextChatState = await getNextChatState(9,"1")
    expect(nextChatState.chatState).toBe(99)
    expect(nextChatState.message).toEqual(`My last question: How old are you?\n\nPlease reply with a number. This helps us only show you the best options for getting the kind of help you want.`)
    expect(nextChatState.data).toEqual({})
  })
  it ("if the user is asked about what sort of treatment they need, they reply 2 (some information) and receive the right reply", async () => {
    const nextChatState = await getNextChatState(9,"2")
    expect(nextChatState.chatState).toBe(99)
    expect(nextChatState.message).toEqual(`My last question: How old are you?\n\nPlease reply with a number. This helps us only show you the best options for getting the kind of help you want.`)
    expect(nextChatState.data).toEqual({})
  })

  it ("the user asks for a helpline by phone(1), helpline_type:phone is registered and they are asked the next question", async () => {
    const nextChatState = await getNextChatState(21,"1")
    expect(nextChatState.chatState).toBe(99)
    expect(nextChatState.message).toEqual(`My last question: How old are you?\n\nPlease reply with a number. This helps us only show you the best options for getting the kind of help you want.`)
    expect(nextChatState.data).toEqual({helpline_types:"phone"})
  })
  it ("the user asks for a helpline by email(2), helpline_types:email is registered and they are asked the next question", async () => {
    const nextChatState = await getNextChatState(21,"2")
    expect(nextChatState.chatState).toBe(99)
    expect(nextChatState.message).toEqual(`My last question: How old are you?\n\nPlease reply with a number. This helps us only show you the best options for getting the kind of help you want.`)
    expect(nextChatState.data).toEqual({helpline_types:"email"})
  })
  it ("the user asks for a helpline by online chat(3), helpline_types:online-chat is registered and they are asked the next question", async () => {
    const nextChatState = await getNextChatState(21,"3")
    expect(nextChatState.chatState).toBe(99)
    expect(nextChatState.message).toEqual(`My last question: How old are you?\n\nPlease reply with a number. This helps us only show you the best options for getting the kind of help you want.`)
    expect(nextChatState.data).toEqual({helpline_types:"online-chat"})
  })
  it ("the user asks for a helpline by etc (4), no data is registered and they are asked the next question", async () => {
    const nextChatState = await getNextChatState(21,"4")
    expect(nextChatState.chatState).toBe(99)
    expect(nextChatState.message).toEqual(`My last question: How old are you?\n\nPlease reply with a number. This helps us only show you the best options for getting the kind of help you want.`)
    expect(nextChatState.data).toEqual({})
  })
  it ("the user asks for a helpline by no preference (5), no data is registered and they are asked the next question", async () => {
    const nextChatState = await getNextChatState(21,"5")
    expect(nextChatState.chatState).toBe(99)
    expect(nextChatState.message).toEqual(`My last question: How old are you?\n\nPlease reply with a number. This helps us only show you the best options for getting the kind of help you want.`)
    expect(nextChatState.data).toEqual({})
  })

  it ("the user replies with their age they are sent the final message", async () => {
    const nextChatState = await getNextChatState(99,"16")
    expect(nextChatState.chatState).toBe(100)
    expect(nextChatState.message).toEqual(`OK, thanks for answering all those questions. Based on how you're feeling right now, i'd suggest the following options for getting help:`)
    expect(nextChatState.data).toEqual({})
  })


  it ("the user is asked for their age and replies with words a sorry I didn't get that message is returned", async () => {
    const nextChatState = await getNextChatState(99,"k;fad;lkjfad")
    expect(nextChatState.chatState).toBe(99)
    expect(nextChatState.message).toEqual(`Sorry I didn't quite get that, please try again`)
  })

  it ("the user is asked for their age and replies with words a sorry I didn't get that message is returned", async () => {
    const nextChatState = await getNextChatState(99,"")
    expect(nextChatState.message).toEqual(`Sorry I didn't quite get that, please try again`)
    expect(nextChatState.chatState).toBe(99)
  })
})
  
