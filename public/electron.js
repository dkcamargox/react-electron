const electron = require('electron');
const { ProductionServer } = require('../src/productionServer');
const { app } = electron;
const { BrowserWindow } = electron;



/**
 * checa se é produção ou desenvolvimento
 */
const isDev = require('electron-is-dev');
let mainWindow;
const productionServer = new ProductionServer(3000); // botar no .env

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + '\\..\\assets\\icon.png',
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