const express = require('express');
const path = require('path');
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
		this.app.use(express.static(path.join(__dirname,'..', 'build')));

		/**
		 * carrega o index.html do build que o react-scripts build cria
		 */
		this.app.use("/", (req, res) => {
			res.sendFile(path.join(__dirname,'..', 'build', 'index.html'));
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

module.exports = { ProductionServer };