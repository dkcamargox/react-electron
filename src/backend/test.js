const controller = require('./controllers/ProductController');
const { migrate } = require('./database/migrator');



migrate()
    .then(() => {
        controller.getAllProducts()
            .then(products => console.log(products))
            .catch(err => console.log(err));
    })
    .catch(err => {
        console.log(err)
    });

