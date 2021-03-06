const servicesBot = require("../src/services-bot")
const oneService = require("./exampleOneService.json")
const manyServices = require("./exampleManyServices.json") 


describe("services bot", ()=> {
  it ("returns nothing when nothing is passed in", () => {
    const noServices = servicesBot()
    expect(noServices).toBe(null)
  })
  it("returns text array when given one card", ()=>{
    const firstService = servicesBot(oneService)
    expect(firstService).toEqual(["Option 1: Two week residential stay at Alexandra Wellbeing House\n\nAlexandra Wellbeing House provides a safe, therapeutic environment for adults experiencing mild to moderate mental health challenges who need up to two weeks support and advice from wellbeing support staff.\n\nWebsite:https://www.sgmind.org.uk/the-alexandra/\n"])
  })
  it("returns an array of several services when given many",()=>{
    const allServices = servicesBot(manyServices)
    expect(allServices).toEqual([
      "Option 1: Two week residential stay at Alexandra Wellbeing House\n\nAlexandra Wellbeing House provides a safe, therapeutic environment for adults experiencing mild to moderate mental health challenges who need up to two weeks support and advice from wellbeing support staff.\n\nWebsite:https://www.sgmind.org.uk/the-alexandra/\n",
      "Option 2: Self-Harmony counselling (£)\n\nSelf-Harmony at Swindon & Gloucestershire Mind offers a 1:1 confidential and non-judgemental counselling service in a safe environment for people who self-harm and self-injure.\n\nWebsite:https://www.sgmind.org.uk/self-harmony/\n",
      "Option 3: MAP anxiety management programme\n\nAn online anxiety management programme based on cognitive behavioural therapy (CBT).\n\nWebsite:https://maps.anxietycanada.com/en/courses/child-map/\n"
    ])
  })


})

