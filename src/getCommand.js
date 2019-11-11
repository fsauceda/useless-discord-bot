const getCommand = (commands, commandName) => {
  try {
    return (
      commands.get(commandName) ||
      commands.find(
        cmd => "aliases" in cmd && cmd.aliases.includes(commandName)
      )
    );
  } catch (er) {
    console.log(er);
  }
};

module.exports = getCommand;
