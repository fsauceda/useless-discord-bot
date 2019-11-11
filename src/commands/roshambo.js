const commaListsOr = require("common-tags").commaListsOr;
const winConditions = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper"
};
const options = Object.keys(winConditions);

module.exports = {
  name: "roshambo",
  aliases: ["yankenpo", "yanken", "rps"],
  requiresArgs: true,
  description: "Play a round of rock-paper-scrissors agains me.",
  usage: commaListsOr`<choise of ${options}>`,
  execute: (message, commandArgs) => {
    const userOption = commandArgs.toLowerCase();

    if (!options.includes(userOption)) {
      return message.reply(commaListsOr`You didn't call for ${options}`);
    }

    const botOption = options[Math.floor(Math.random() * options.length)];
    let reply = `I chose ${botOption}. `;

    if (userOption === botOption) {
      reply += "It's a tie :shrug:";
    }

    if (winConditions[userOption] === botOption) {
      reply += "You win! :tada:";
    }

    if (winConditions[botOption] === userOption) {
      reply += "You lose :frowning2:";
    }

    return message.reply(reply);
  }
};
