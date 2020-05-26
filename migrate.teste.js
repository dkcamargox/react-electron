const path = require('path');
const knexMigrate = require('knex-migrate');

async function migrate() { 
    const knexFilePath = path.resolve(__dirname, '..', 'knexfile');
    const migrationsFilePath = path.resolve(__dirname, '..', 'src', 'migrations'); 
    const pending = await knexMigrate('pending', { knexfile: knexFilePath, migrations: migrationsFilePath }, () => {});

    if ( pending > 0 ) {
        await knexMigrate('up', { knexfile: knexFilePath, migrations: migrationsFilePath  }, () => {});
    }
  }


  migrate().then( () => { }).catch(err => {console.log('erre\n' + err)});
