const fs = require('fs');
const Ajv = require('ajv');
const userSchema = require('./schemas/userSchema');

class JSONDatabase {
  constructor(filePath) {
    this.filePath = filePath;
    this.schema = userSchema;
    this.validator = new Ajv().compile(userSchema);
  }

  readData() {
    try {
      const jsonData = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(jsonData);
    } catch (error) {
      console.error('Error reading JSON file:', error);
      return null;
    }
  }

  writeData(data) {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      fs.writeFileSync(this.filePath, jsonData, 'utf8');
      console.log('Data written successfully.');
    } catch (error) {
      console.error('Error writing JSON file:', error);
    }
  }

  getDataByKey(key) {
    const data = this.readData();
    if (data && data[key]) {
      return data[key];
    } else {
      console.error('Key not found:', key);
      return null;
    }
  }

  setDataByKey(key, value) {
    const data = this.readData() || {};
    data[key] = value;

    if (this.validateData(data)) {
      this.writeData(data);
    }
  }

  validateData(data) {
    if (!this.validator(data)) {
      console.error('Data validation failed:', this.validator.errors);
      return false;
    }
    return true;
  }

  initializeDataFromGuilds(bot) {
    bot.guilds.cache.forEach(guild => {
      guild.members.cache.forEach(member => {
        const userId = member.user.id;
        if (!this.getDataByKey(userId)) {
          const userData = {
            "username": member.user.username,
            "level": 1,
            "rep": 0
          }
          this.setDataByKey(userId, userData);
        }
      });
    });
  }
}

module.exports = JSONDatabase;
