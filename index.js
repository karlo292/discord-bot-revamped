const config = require('./config.js');

const JSONDatabase = require('./JSONdatabase.js');

const schema = require('./schemas/userSchema.js')

const db = new JSONDatabase('database.json', schema);



const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActivityType,
} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Create a new Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction
  ]
});





const prefix = config.prefix

// COMMANDS
const pingCommand = require('./commands/random/ping.js')
const banCommand = require('./commands/moderation/ban.js')
const unbanCommand = require('./commands/moderation/unban.js')
const sayCommand = require('./commands/random/say.js')
const rngCommand = require('./commands/fun/rng.js')
//const infoCommand = require('./commands/misc/info.js')
const helpCommand = require('./commands/misc/help.js')
testCommand = require('./commands/random/test.js')
const repCommand = require('./commands/misc/rep.js')



// Event that triggers when the bot is ready and connected to Discord
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  db.initializeDataFromGuilds(client);
  console.log('Loaded database!')
  const guildsCount = client.guilds.cache.size;
  client.user.setActivity({
    name: guildsCount + " servers",
    type: ActivityType.Watching,

  })
});

client.on('messageCreate', message => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();


  if (!db.getDataByKey(message.author.id)){
    db.setDataByKey(message.author.id, {
      username: message.author.username,
      level: 1,
      rep: 0
    });
  }


  switch (command) {
    case 'ping':
      pingCommand.execute(message, args)
      break
    case 'ban':
      banCommand.execute(message, args)
      break
    case 'unban':
      unbanCommand.execute(message, args)
      break
    case 'say':
      sayCommand.execute(message, args)
      break
    case 'rng':
      rngCommand.execute(message, args)
      break
    case 'help':
      helpCommand.execute(message, args)
      break
    case 'rep':
      repCommand.execute(message,args)
      break
    case 'test':
      console.log(schema)
      break
  }


});


// Replace 'YOUR_TOKEN' with your own Discord bot token
client.login(config.token);