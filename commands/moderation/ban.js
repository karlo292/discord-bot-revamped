module.exports = {
  name: 'ban',
  description: 'Ban a member',
  execute(message, args) {
    // Check if the user has permission to ban members
    if (!message.member.permissions.has('BAN_MEMBERS')) {
      message.channel.send('You do not have permission to ban members.');
      return;
    }

    const member = message.mentions.members.first();
    if (!member) {
      message.channel.send('> Please mention a valid member of this server');
      return;
    }

    // Check if the member can be banned
    if (!member.bannable) {
      message.channel.send('> Cannot ban this member');
      return;
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    member.send(`> You have been banned from ${message.guild.name}. Reason: ${reason}`)
      .catch(console.error);

    
    member.ban({
        reason
      })
      .then(() => {
        
        message.channel.send("> " + member.user.tag + " has been banned from this server!");
        message.channel.send("> " + "REASON: " + reason)
      })
      .catch((error) => {
        message.channel.send('> An error occurred while trying to ban the member');
        console.error(error);
      });
  },
};