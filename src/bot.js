// const stripIndents = require("common-tags").stripIndents;
const { prefix } = require("../config/config.json");
const getCommand = require("./getCommand");

// message does not contain prefix or was sent by a bot
const isInvalidMessage = message =>
  !message.content.startsWith(`${prefix}`) || message.author.bot;

// get command name and arguments
const getMessageContent = message =>
  message.content.slice(prefix.length).match(/(\w+)\s*([\s\S]*)/);

// check error such as missing arguments or restricted commands
const checkForErrors = (commandName, command, commandArgs, message) => {
  if (!command) {
    return `\`${commandName}\` is not a valid command.`;
  }

  let errorMessage = "";

  if (command.requiresArgs && !commandArgs.length) {
    errorMessage += `You didn't provide any arguments.`;

    if (command.usage) {
      errorMessage += `\nCommand usage: \`${prefix}${command.name} ${
        command.usage
      }\``;
    }
  }

  if (command.guildOnly && message.channel.type !== "text") {
    errorMessage += `\`${prefix}${
      command.name
    }\` is only available in text channels.`;
  }

  return errorMessage;
};

const processMessage = message => {
  if (isInvalidMessage(message)) return;

  const [, commandName, commandArgs] = getMessageContent(message);
  const command = getCommand(message.client.commands, commandName);

  const errorMessage = checkForErrors(
    commandName,
    command,
    commandArgs,
    message
  );
  if (errorMessage) {
    return message.reply(errorMessage);
  }

  return command.execute(message, commandArgs);
};

const onReady = () => console.log("ready");

module.exports = {
  processMessage,
  onReady
};
