const { commaListsAnd } = require("common-tags");

module.exports = {
  name: "ready",
  aliases: ["ready-check"],
  guildOnly: true,
  description: "Ask all players in the same voice channel if they are ready.",
  execute: message => {
    const { member, channel } = message;

    if (!member.voiceChannelID) {
      return message.reply("You're not in any voice channel at the moment");
    }

    const { members } = member.voiceChannel;
    const memberIds = members.map(({ id }) => id);
    const filter = ({ author }) => memberIds.includes(author.id);
    const collector = channel.createMessageCollector(filter, {
      time: 20000
    });

    collector.on("collect", m => {
      const index = memberIds.indexOf(m.author.id);
      memberIds.splice(index, 1);

      m.react("✅");
      channel.send(`${m.author} is ready!`);

      if (!memberIds.length) {
        collector.stop("all ready");
      }
    });

    collector.on("end", () => {
      if (memberIds.length) {
        const membersLeft = members.array();
        return channel.send(
          commaListsAnd`It looks like ${membersLeft} ${
            membersLeft > 1 ? "are" : "is"
          } not ready yet :frowning2:`
        );
      }
      return channel.send("Everyone is ready!");
    });

    return channel.send(commaListsAnd`Are you ready ${members.array()}?`);
  }
};
