module.exports = {
    name: 'say',
    description: 'Make the bot say something',
    execute(message, args) {
      // Check if there is any text to say

      if (!message.member.permissions.has('Administrator')) {
        message.channel.send('> You do not have permission to use that command.');
        return;
      }

      if (args.length === 0) {
        message.channel.send('> Please provide some text to say.');
        return;
      }
  
      // Join the arguments into a single string
      const text = args.join(' ');
  
      // Delete the player's message
      message.delete()
        .then(() => {
          // Send the text as a message
          message.channel.send(text);
        })
        .catch((error) => {
          console.error('> Error deleting message:', error);
        });
    },
  };
  