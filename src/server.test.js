jest.mock("./bot");
const bot = require("./bot");
const server = require("./server");

describe("src/server", () => {
  it("'commands' is defined", () => {
    expect(server.commands).toBeDefined();
    expect(server.commands).toBeInstanceOf(Map);
    expect(server.commands.size).toBeGreaterThan(1);
  });

  it("onReady callback is called", () => {
    server.emit("ready");
    expect(bot.onReady).toBeCalled();
  });

  it("processMessage callback is called", () => {
    server.emit("message");
    expect(bot.processMessage).toBeCalled();
  });
});
