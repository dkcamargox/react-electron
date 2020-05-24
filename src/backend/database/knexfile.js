// Update with your config settings.
const path = require('path');
const databasePath = path.resolve(__dirname, 'data.sqlite');
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: databasePath
    },
    useNullAsDefault: true
  }
};
