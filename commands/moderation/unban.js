module.exports = {
  name: 'unban',
  description: 'Unban a user',
  execute(message, args) {
    // Check if the user has permission to unban members
    if (!message.member.permissions.has('BAN_MEMBERS')) {
      message.channel.send('> You do not have permission to unban members.');
      return;
    }

    // Check if the user provided a valid user ID
    const userID = args[0];
    if (!userID) {
      message.channel.send('> Please provide a valid user ID to unban');
      return;
    }

    // Attempt to unban the user
    message.guild.bans.fetch().then((bans) => {
      const bannedUser = bans.find((user) => user.user.id === userID);

      if (!bannedUser) {
        message.channel.send('> User not found in the ban list');
        return;
      }

      const reason = args.slice(1).join(' ') || 'No reason provided';

      message.guild.members.unban(bannedUser.user)
        .then(() => {
          message.channel.send('> ' + bannedUser.user.tag + " has been unbanned!");
          message.channel.send("> REASON: " + reason)
        })
        .catch((error) => {
          message.channel.send('> An error occurred while trying to unban the user');
          console.error(error);
        });
    });
  },
};