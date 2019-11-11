const { stripIndents, commaLists } = require("common-tags");
const getCommand = require("../getCommand");

const help = {
  name: "help",
  description: `Display information about builtin commands.`,
  usage: "<command>"
};

module.exports = Object.assign(help, {
  execute: (message, commandArgs) => {
    const commands = message.client.commands;
    let helpMessage = "";

    if (!commandArgs.length) {
      helpMessage = stripIndents`
        Available commands:
        ${commands
          .map(cmd => `\`${cmd.name}${"usage" in cmd ? ` ${cmd.usage}` : ""}\``)
          .join("\n")}
      `;
    } else {
      const inputCommand = getCommand(commands, commandArgs);

      if (!inputCommand) {
        helpMessage = `\`${commandArgs}\` is not a valid command.`;
      } else {
        helpMessage = inputCommand.description;

        if ("aliases" in inputCommand) {
          helpMessage +=
            "\n" +
            commaLists`Aliases: ${inputCommand.aliases.map(a => `\`${a}\``)}`;
        }
        if ("usage" in inputCommand) {
          helpMessage += `\nUsage: \`${inputCommand.name} ${
            inputCommand.usage
          }\``;
        }
      }
    }
    message.channel.send(`${helpMessage}`);
  }
});
