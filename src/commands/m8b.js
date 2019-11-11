const replies = require("../constants/m8bReplies");

module.exports = {
  name: "m8b",
  aliases: ["8ball", "ask"],
  requiresArgs: true,
  description: "Ask a yes or no question to my Magic 8-Ball.",
  usage: "<question>",
  execute: message =>
    message.channel.send(replies[Math.floor(Math.random() * replies.length)])
};
