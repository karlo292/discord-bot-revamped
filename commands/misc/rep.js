const JSONDatabase = require('../../JSONdatabase.js');
const schema = require('../../schemas/userSchema.js');
const db = new JSONDatabase('database.json', schema);

module.exports = {
  name: 'rep',
  description: 'Give or remove reputation from a user.',
  execute(message, args) {
    const subcommand = args[0];
    const targetUser = message.mentions.users.first();

    if (!targetUser) {
      message.reply('> Please mention a user.');
      return;
    }

    if (targetUser.bot) {
      message.reply('> Bots cannot receive reputation.');
      return;
    }

    if (targetUser.id === message.author.id) {
      message.reply('> You cannot give or remove reputation from yourself.');
      return;
    }

    let repChange = 0;

    if (subcommand === 'add') {
      repChange = 1;
    } else if (subcommand === 'remove') {
      repChange = -1;
    } else {
      message.reply('> Invalid subcommand. Please use `add` or `remove`.');
      return;
    }

    const user = db.getDataByKey(targetUser.id);
    const author = db.getDataByKey(message.author.id);

    // Check if enough time has passed since the author's last reputation change
    const lastAuthorRepChangeTime = author.lastRepChangeTime || 0;
    const currentTime = Date.now();
    const authorTimeDifference = currentTime - lastAuthorRepChangeTime;
    const authorCooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (authorTimeDifference < authorCooldownPeriod) {
      const authorRemainingTime = authorCooldownPeriod - authorTimeDifference;
      const authorRemainingHours = Math.ceil(authorRemainingTime / (60 * 60 * 1000));
      message.reply(`> You need to wait ${authorRemainingHours} hours before giving reputation again.`);
      return;
    }

    // Check if enough time has passed since the target user's last reputation change
    const lastTargetRepChangeTime = user.lastRepChangeTime || 0;
    const targetTimeDifference = currentTime - lastTargetRepChangeTime;
    const targetCooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (targetTimeDifference < targetCooldownPeriod) {
      const targetRemainingTime = targetCooldownPeriod - targetTimeDifference;
      const targetRemainingHours = Math.ceil(targetRemainingTime / (60 * 60 * 1000));
      message.reply(`> You need to wait ${targetRemainingHours} hours before giving reputation to ${targetUser.username} again.`);
      return;
    }

    // Update the reputation of the target user
    const userRep = user.rep + repChange;
    const authorRep = author.rep + 1;

    db.setDataByKey(targetUser.id, {
      ...user,
      rep: userRep,
      lastRepChangeTime: currentTime
    });

    db.setDataByKey(message.author.id, {
      ...author,
      rep: authorRep,
      lastRepChangeTime: currentTime
    });

    if (repChange > 0) {
      message.reply(`> You have given reputation to ${targetUser.username}!`);
    } else {
      message.reply(`> You have removed reputation from ${targetUser.username}!`);
    }
  },
};
