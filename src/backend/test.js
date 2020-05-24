const controller = require('./controllers/ProductController');

controller.getAllProducts(2)
.then(products => console.log(products))
.catch(err => console.log(err));
