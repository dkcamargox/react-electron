const knexMigrate = require('knex-migrate');
const path = require('path');


const knexFilePath = path.resolve(__dirname, 'knexfile');

module.exports = {   
    async migrate() { 
        await knexMigrate('up', { knexfile: knexFilePath }, () => {});
    }
}