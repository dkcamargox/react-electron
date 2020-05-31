require('dotenv').config();

const electron  = require('electron');
const { ipcMain: ipc }  = require('electron');
const { BrowserWindow, app  } = electron;
const betterSqlite = require('better-sqlite3')
const isDev = require('electron-is-dev');
const path = require('path');


const userData = app.getPath('userData');
let databasePath = path.join(userData, 'data.sqlite');;


/**
 * production server class
 */
const express = require('express');
/**
 * essa classe foi criada pra eu rodar o react em modo de produção e carregar
 * ele no electron
 */
class ProductionServer {
	constructor( port ) {
		/**
		 * recebe a porta que vai ser gerada, e tem que ser a mesma que ele vai
		 * dar loadURL
		 */
		this.port = port;
		/**
		 * atributo isUp define se foi criado o servidor
		 */
		this.isUp = false;
		/**
		 * inicia o express
		 */
		this.app = express();
	}
	/**
	 * inicia o servidor
	 */
	startServer() {
		/**
		 * servidor estatico
		 */
		this.app.use(express.static(path.join(__dirname, '..', 'build')));

		/**
		 * carrega o index.html do build que o react-scripts build cria
		 */
		this.app.use("/", (req, res) => {
			res.sendFile(path.join(__dirname, 'build', '..', 'index.html'));
		});
		/**
		 * levanta o servidor na porta passada pelo contructor
		 */
		this.server = this.app.listen(this.port);
		this.isUp = true;
	}
	/**
	 * detroi o servidor
	 */
	killServer() {
		this.server.close();
	}
}



let mainWindow;
const productionServer = new ProductionServer(process.env.PORT); // botar no .env

ipc.removeAllListeners();

function createDataBase() {
  /**
   * starting connection
   */
  let database;
  try {
    database = betterSqlite(databasePath);
  } catch(err) {
    database = new betterSqlite(databasePath);
  }
  /**
   * creating table if not exists in the db
   */
  const sqlScript = `CREATE TABLE IF NOT EXISTS products(
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL);`;
    
  /**
   * run script
   */
  database.prepare(sqlScript).run();
  /**
   * close connection
   */
  database.close();
  
}

function getOneProduct(id) {
  /**
   * starting connection
   */
  const database = betterSqlite(databasePath);
  /**
   * selecting all in the interval to 10 for each page
   */
  const sqlScript = `SELECT * FROM 'products'
  WHERE(id = ?);`;
  
  /**
   * preparing and running script
   */
  const dbResponse = database.prepare(sqlScript).all(id);
 
  const response = {
    data: dbResponse
  }
  /**
  * disconect
  */
  database.close();

  return response;
}

function getAllProducts(page) {
  /**
   * starting connection
   */
  const database = betterSqlite(databasePath);
  /**
   * selecting all in the interval to 10 for each page
   */
  const sqlScript = `SELECT * FROM 'products'
  WHERE(id > ? AND id <= ?);`;
  
  /**
   * preparing and running script
   */
  const dbResponse = database.prepare(sqlScript).all( ((page-1)*10), (page*10));
  
  /**
   * for pagination
   * 
   * the number of all in database
   */
  const numberOfProducts = database.prepare('SELECT * FROM products;').all().length;
  
  /**
   * organizing to be more clear in the react app
   */
  const productInfo = {
    page,
    pages: parseInt((numberOfProducts / 10) + 1)
  }
  const response = {
    data: dbResponse,
    productInfo
  }
   /**
    * disconect
    */
  database.close();

  return response;
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
    mainWindow.loadURL(`http://localhost:${process.env.PORT}`); //puxar do .env tambem



    mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  createDataBase();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if ( productionServer.isUp ) {
      /**
       * quando fecha a janela destroi o servidor, se ele tiver sido levantado e
       * desconecta do banco
       */
      productionServer.killServer();
    }
    app.quit();
  }
});

/**
 * ipc connection with react to get all products from database
 */
ipc.on('get-all-paginated', (event, page) => {
  const response = getAllProducts(page);
  event.sender.send('get-all-paginated-response', response);
});


/**
 * ipc connection with react to get only one product from database
 */
ipc.on('get-one', (event, id) => {
  const response = getOneProduct(id);
  event.sender.send('get-one-response', response);
});


app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
});

