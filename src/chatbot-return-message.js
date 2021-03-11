const chatStates = {
  999: {
    outgoingMessage: `Sorry that our service finding chatbot wasn't helpful for you.\nIf you want to text a person about your mental health, tic+chat (https://www.ticplus.org.uk/ticpluschat/) is an anonymous, safe, confidential, 1-2-1 support service for young people aged 9-21 living in Gloucestershire. It’s open 5-9pm, Sunday to Thursday.\nIf you want to see a full list of the services, please go here:  https://g1-cypmh-alpha.herokuapp.com/a-z-of-services-national.`,
  },
  0: {
    returnData: {},
    outgoingMessage: [
      `Hi ((name)), and well done for looking for help. Talking about mental health is hard, we know.`,
      `How this works:\nI'm a text-bot.\nI'll ask you some questions, then I'll suggest some support options, based on how you tell me you're feeling.\n\nIf you'd rather, you can see the list of everything that's available in Gloucestershire here: https://g1-cypmh-alpha.herokuapp.com/new-user-landing-page\n\nIf the questions aren't working for you, you can text "talk to a human" at any time.`,
      `Here's the first question. To reply, type the number next to the answer which best describes you.\n\nWhat have you been struggling with lately?\n1 - Mood and motivation\n2 - Eating habits or body image\n3 - Gender identity or sexuality\n4 - Seeing or hearing things\n5 - Self-harm\n6 - Something bad has happened\n7 - Feeling worried and anxious\n8 - Thinking about suicide`,
    ],
    returnOptionIds: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  1: {
    returnData: { tags: "mood" },
    captureStrings: "1",
    outgoingMessage: null,
    returnOptionIds: [9],
  },
  2: {
    returnData: { tags: "eating-disorders" },
    captureStrings: "2",
    outgoingMessage: null,
    returnOptionIds: [9],
  },
  3: {
    returnData: { tags: "gender" },
    captureStrings: "3",
    outgoingMessage: null,
    returnOptionIds: [9],
  },
  4: {
    returnData: { tags: "psychosis" },
    captureStrings: "4",
    outgoingMessage: null,
    returnOptionIds: [9],
  },
  5: {
    returnData: { tags: "self-harm" },
    captureStrings: "5",
    outgoingMessage: null,
    returnOptionIds: [9],
  },
  6: {
    returnData: {},
    captureStrings: "6",
    outgoingMessage: `I'm really sorry about that. It would help to know what's happened, but if you'd rather, you can type "skip" to skip this question.\n\nWhat was the bad thing?\n1 - Somebody close to me has died\n2 - The covid-19 pandemic\n3 - I'm being bullied\n4 - I've been sexually abused or assaulted\n5 - I've had a miscarriage\n6 - I've had to seek asylum\n7 - I've experienced domestic abuse\n8 - Someone in my family is really ill\n9 - Something else`,
    returnOptionIds: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  },
  7: {
    returnData: { tags: "anxiety" },
    captureStrings: "7",
    outgoingMessage: null,
    returnOptionIds: [9],
  },
  8: {
    returnData: {tags: "crisis"},
    captureStrings: "8",
    outgoingMessage: `I'm sorry to hear that. Are you feeling suicidal right now?\n1 - Yes, I need some help straightaway\n2 - Not right now`,
    returnOptionIds: [20, 9],
  },
  9: {
    returnData: {},
    captureStrings: "",
    outgoingMessage: `Do you know what kind of help you're looking for?\n\n1 - No, I'm still figuring that out\n2 - Some information and self-help resources\n3 - I want to speak to someone about this now (like a helpline)\n4 - I want some ongoing help to get better`,
    returnOptionIds: [21,22,23,24],
  },
  10: {
    returnData: { tags: "bereavement" },
    captureStrings: "1",
    outgoingMessage: null,
    returnOptionIds: [9],
  },
  11: {
    returnData: { tags: "covid" },
    captureStrings: "2",
    outgoingMessage: null,
    returnOptionIds: [9],
  },
  12: {
    returnData: { tags: "bullying" },
    captureStrings: "3",
    outgoingMessage: null,
    returnOptionIds: [9],
  },
  13: {
    returnData: { tags: "sexual-violence" },
    captureStrings: "4",
    outgoingMessage: null,
    returnOptionIds: [9],
  },
  14: {
    returnData: { tags: "miscarriage" },
    captureStrings: "5",
    outgoingMessage: null,
    returnOptionIds: [9],
  },
  15: {
    returnData: { tags: "asylum-seeker" },
    captureStrings: "6",
    outgoingMessage: null,
    returnOptionIds: [9],
  },
  16: {
    returnData: { tags: "domestic-abuse" },
    captureStrings: "7",
    outgoingMessage: null,
    returnOptionIds: [9],
  },
  17: {
    returnData: { tags: "family-illness" },
    captureStrings: "8",
    outgoingMessage: null,
    returnOptionIds: [9],
  },
  18: {
    returnData: {},
    captureStrings: "9",
    outgoingMessage: null,
    returnOptionIds: [9],
  },
  19: {
    returnData: {},
    captureStrings: "skip",
    outgoingMessage: null,
    returnOptionIds: [9],
  },
  20: {
    returnData: {},
    captureStrings: "1",
    outgoingMessage: `If you're feeling like you want to die, it's important to tell someone.\nHelp and support is available right now if you need it. You do not have to struggle with difficult feelings alone.\n\nThese free helplines are there to help when you're feeling down or desperate.\n\nSamaritans – for everyone\nCall 116 123\nEmail jo@samaritans\Website: Samaritans.org\n\nChildline – for children and young people under 19\nCall 0800 1111 – the number will not show up on your phone bill\nWebsite: https://www.childline.org.uk/.\n\nIf you don't want to make a phone call right now, the NHS website has lots more options here: https://www.nhs.uk/conditions/suicide/`,
    returnOptionIds: [9],
  },
  21: {
    returnData: {support_types:"helpline"},
    captureStrings: "3",
    outgoingMessage: `Do you have a preference about how you contact someone?\n\n1 - Phone\n2 - Email\n3 - Online chat\n4 - etc\n5 - No preference`,
    returnOptionIds: [25,26,27,28,29],
  },
  22: {
    returnData: {support_types:["counselling","group-support",'1-1-support','group-work','residential-stay',"social-prescribing"]},
    captureStrings: "4",
    outgoingMessage: null,
    returnOptionIds: [99],
  },
  23: {
    returnData: {},
    captureStrings: "1",
    outgoingMessage: null,
    returnOptionIds: [99],
  },
  24: {
    returnData: {support_types:["app","self-help"]},
    captureStrings: "2",
    outgoingMessage: null,
    returnOptionIds: [99],
  },
  25: {
    returnData: {helpline_types:"phone"},
    captureStrings: "1",
    outgoingMessage: null,
    returnOptionIds: [99],
  },
  26: {
    returnData: {helpline_types:"email"},
    captureStrings: "2",
    outgoingMessage: null,
    returnOptionIds: [99],
  },
  27: {
    returnData: {helpline_types:"online-chat"},
    captureStrings: "3",
    outgoingMessage: null,
    returnOptionIds: [99],
  },
  28: {
    returnData: {helpline_types:"text"},
    captureStrings: "4",
    outgoingMessage: null,
    returnOptionIds: [99],
  },
  29: {
    returnData: {},
    captureStrings: "5",
    outgoingMessage: null,
    returnOptionIds: [99],
  },
  99: {
    returnData: {},
    captureStrings: "",
    outgoingMessage: `My last question: How old are you?\n\nPlease reply with a number. This helps us only show you the best options for getting the kind of help you want.`,
    returnOptionIds: [100],
  },
  100: {
    returnData: {},
    captureStrings: "[0-9]+",
    outgoingMessage: `OK, thanks for answering all those questions. Based on how you're feeling right now, i'd suggest the following options for getting help:`,
    returnOptionIds: [101],
  },
};

const getNextChatState = async (currentChatState, response) => {
  if (
    currentChatState === undefined ||
    response === undefined ||
    currentChatState === 999
  ) {
    return Promise.resolve({
      chatState: 0,
      message: chatStates[0].outgoingMessage,
      data: {}
    });
  }

  response = response.trim()

  if (response.includes("talk to a human")) {
    return Promise.resolve({
      chatState: 999,
      message: chatStates[999].outgoingMessage,
      data: {}
    });
  }

  let matchedStateId = chatStates[currentChatState].returnOptionIds.find(
    (id) => {
      regexMatch = new RegExp(`^${chatStates[id].captureStrings}$`)
      return regexMatch.test(response)
    }
  );

  if (matchedStateId !== undefined) {
    // save promise data (containing tags from matched strings)
    let returnPromiseData = {
      chatState: matchedStateId,
      message: chatStates[matchedStateId].outgoingMessage,
      data: chatStates[matchedStateId].returnData,
    };

    // if there is not outgoing message, call recursive function to find next message in the tree update the message & chatstate but save the data
    if (chatStates[matchedStateId].outgoingMessage === null) {
      nextChatState = await getNextChatState(matchedStateId, "");
      returnPromiseData = {
        ...returnPromiseData,
        chatState: nextChatState.chatState,
        message: nextChatState.message,
      };
      matchedStateId = nextChatState.chatState;
    }

    if (
      matchedStateId !== undefined ||
      chatStates[matchedStateId].outgoingMessage !== null
    ) {
      return Promise.resolve(returnPromiseData);
    }
  } else {
    return Promise.resolve({
      chatState: currentChatState,
      message: "Sorry I didn't quite get that, please try again",
      data: {}
    });
  }

};
module.exports = getNextChatState;
