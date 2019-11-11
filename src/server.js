const Discord = require("discord.js");
const client = new Discord.Client();
const bot = require("./bot");
const fs = require("fs");

// read command files
const commandFiles = fs
  .readdirSync("./src/commands/")
  .filter(file => /^\w+\.js$/.test(file));

client.commands = new Discord.Collection();

// initizalize commands
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.once("ready", () => bot.onReady());
client.on("message", message => bot.processMessage(message));

process.env.BOT_TOKEN && client.login(process.env.BOT_TOKEN);

module.exports = client;
