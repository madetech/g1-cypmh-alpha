const filteredResults = require('../src/filtered-results')

describe("basic set up", () => {
  it ("given an empty data string, returns all the services without any tags", async () => {
    const data = {}
    const result =  await filteredResults(data)
    expect(result.length).toBe(14)
  })
})
describe("add tag specific results back", () => {
  it("returns Anxiety services when {tags:anxiety} is passed in", async () => {
    const data = {tags: "anxiety"}
    const result = await filteredResults(data)
    expect(result.length).toBe(20)
  })

  it("returns covid services when {tags:covid} is passed in", async () => {
    const data = {tags: "covid"}
    const result = await filteredResults(data)
    expect(result.length).toBe(14)
  })

  it("returns generic helplines when support_type:'helpline'", async () => {
    const data = {support_types:"helpline"}
    const result = await filteredResults(data)
    expect(result.length).toBe(3)
  })

  it("returns anxiety + generic helplines when support_type:'helpline'", async () => {
    const data = {tags: "anxiety", support_types:"helpline"}
    const result = await filteredResults(data)
    expect(result.length).toBe(6)
  })

  it("returns anxiety + generic helplines when support_type:'helpline'", async () => {
    const data = {tags: "anxiety", support_types:"helpline", helpline_types:"phone"}
    const result = await filteredResults(data)
    expect(result.length).toBe(3)
  })

  it("returns anxiety + generic helplines when support_type:'helpline'", async () => {
    const data = {tags: "anxiety", support_types:"helpline", helpline_types:"phone"}
    const result = await filteredResults(data)
    expect(result.length).toBe(3)
  })

  it("returns generic apps and self-help when given support_types:['app', 'self-help']", async () => {
    const data = {support_types:["app","self-help"]}
    const result = await filteredResults(data)
    expect(result.length).toBe(1)
  })
  it("returns generic apps and self-help when given support_types:['app', 'self-help']", async () => {
    const data = {support_types:["counselling","group-support",'1-1-support','group-work','residential-stay',"social-prescribing"]}
    const result = await filteredResults(data)
    expect(result.length).toBe(9)
  })

  it("returns generic apps that are suited to the age 16 when given age 16", async () => {
    const data = {age: "16"}
    const result = await filteredResults(data)
    expect(result.length).toBe(10)
  })
})