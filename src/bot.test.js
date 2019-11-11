const { prefix } = require("../config/config.json");
const bot = require("./bot");
jest.mock("./getCommand");
const getCommand = require("./getCommand");

describe("src/bot", () => {
  describe(".onReady()", () => {
    it("outputs 'ready'", () => {
      const log = jest.fn();
      const originalLog = console.log;
      console.log = log;

      bot.onReady();
      expect(log).toBeCalledWith("ready");
      console.log = originalLog;
    });
  });

  describe(".processMessage()", () => {
    let message;

    beforeEach(() => {
      message = {
        content: "",
        author: {
          bot: false
        },
        channel: {
          type: ""
        },
        client: {
          commands: new Map()
        },
        reply: jest.fn()
      };
    });

    it("message is not valid", () => {
      let response;

      // message does not start with prefix
      response = bot.processMessage(message);
      expect(response).toBeUndefined();

      // mesage was sent by a bot
      message.content = `${prefix}`;
      message.author.bot = true;
      response = bot.processMessage(message);
      expect(response).toBeUndefined();
    });

    it("command is not valid", () => {
      getCommand.mockReturnValue(undefined);
      message.content = `${prefix}someCommand`;
      bot.processMessage(message);
      expect(message.reply).toHaveBeenCalledWith(
        `\`someCommand\` is not a valid command.`
      );
    });

    it("missing arguments", () => {
      const command = {
        name: "someCommand",
        requiresArgs: true
      };
      getCommand.mockReturnValue(command);
      message.content = `${prefix}someCommand`;
      bot.processMessage(message);
      expect(message.reply).toHaveBeenCalledWith(
        `You didn't provide any arguments.`
      );
    });

    it("missing arguiments and usage", () => {
      const command = {
        name: "someCommand",
        requiresArgs: true,
        usage: "usage"
      };
      getCommand.mockReturnValue(command);
      message.content = `${prefix}someCommand`;
      bot.processMessage(message);
      expect(message.reply).toHaveBeenCalledWith(
        `You didn't provide any arguments.\nCommand usage: \`${prefix}someCommand usage\``
      );
    });

    it("command is only available in text channels", () => {
      const command = {
        name: "someCommand",
        guildOnly: true
      };
      getCommand.mockReturnValue(command);
      message.content = `${prefix}someCommand`;
      bot.processMessage(message);
      expect(message.reply).toHaveBeenCalledWith(
        `\`${prefix}someCommand\` is only available in text channels.`
      );
    });

    it("executes command", () => {
      const command = {
        name: "someCommand",
        execute: jest.fn()
      };
      getCommand.mockReturnValue(command);
      message.content = `${prefix}someCommand`;
      bot.processMessage(message);
      expect(command.execute).toHaveBeenCalled();
    });
  });
});
