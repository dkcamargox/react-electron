const electron = require('electron');
const { app } = electron;
const { BrowserWindow } = electron;
const path = require('path');
const knexMigrate = require('knex-migrate');


/**
 * checa se é produção ou desenvolvimento
 */
const isDev = require('electron-is-dev');

const { ProductionServer } = require('../src/productionServer');

migrate();
let mainWindow;
const productionServer = new ProductionServer(3000); // botar no .env

async function migrate() { 
  const knexFilePath = path.resolve(__dirname, '..', 'knexfile');
  const migrationsFilePath = path.resolve(__dirname, '..', 'database', 'migrations'); 
  const pending = await knexMigrate('pending', { knexfile: knexFilePath, migrations: migrationsFilePath }, () => {});

  if ( pending > 0 ) {
      await knexMigrate('up', { knexfile: knexFilePath, migrations: migrationsFilePath  }, () => {});
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if(!isDev) {
    /**
     * inicia o servidor só se for produção
     */
    productionServer.startServer();
  }
    mainWindow.loadURL(`http://localhost:${3000}`); //puxar do .env tambem



  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if ( productionServer.isUp ) {
      /**
       * quando fecha a janela destroi o servidor, se ele tiver sido levantado
       */
      productionServer.killServer();
    }
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});