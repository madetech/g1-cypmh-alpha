const servicesBot = require("../src/services-bot")

describe("services bot", ()=> {
  it ("returns true", () => {
    const test = servicesBot()
    expect(test).toBe(true)
  })
})

