module.exports = {
    name: 'rng',
    description: 'Generate a random number within a range',
    execute(message, args) {
      // Check if there are two arguments specifying the range
      if (args.length !== 2) {
        message.channel.send('> Please provide the start and end range as arguments.');
        message.channel.send('> Example: rng 0 100')
        return;
      }
  
      // Parse the start and end range from the arguments
      const startRange = parseInt(args[0]);
      const endRange = parseInt(args[1]);
  
      // Check if the range is valid
      if (isNaN(startRange) || isNaN(endRange) || startRange >= endRange) {
        message.channel.send('> Please provide a valid range (start < end).');
        return;
      }
  
      // Generate a random number within the range
      const randomNumber = Math.floor(Math.random() * (endRange - startRange + 1)) + startRange;
  
      // Send the random number as a message
      message.channel.send(`> Number is: ${randomNumber}`);
    },
  };
  