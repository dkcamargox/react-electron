const connection = require('../database/connection');
module.exports = {
    
    async  getAllProducts(page = 0) {
        const products = await connection('products')
        .select('*')
        .paginate({
            perPage: 10,
            currentPage: page
        });
        
        return(products);
    },

    async  getOneProduct(id) {
        const product = await connection('products')
        .select('*')
        .where('id', id);

        return(product); 
    }
}
