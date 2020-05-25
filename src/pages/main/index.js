import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import connection from '../../connection';


export default class Main extends Component {
    state = {
        products: [],
        productInfo: {},
        page: 1,
    }
    
    componentDidMount() {
        this.loadProducts();
    }

    async  getAllProducts(page = 1) {
        const products = await connection('products')
        .select('*')
        .paginate({
            perPage: 10,
            currentPage: page
        });
        
        return(products);
    }

    loadProducts = async ( page = 1 ) => {
        const  response = await this.getAllProducts()
            .then(products => (products))
            .catch(err => console.log(err));
        this.setState({
            products: response.data,
            productInfo: response.pagination,
            page
        })
    }
    
    render () {
        const {products } = this.state;

        return(
            <div className="product-list">
                {products.map(product => (
                    <article key={product._id}>
                        <strong>{product.title}</strong>
                        <p>{product.description}</p>
                        <Link to={`/products/${product._id}`}> Acessar</Link>
                    </article> 
                ))}

                <div className="actions">
                    <button>Anterior</button>
                    <button>Próximo</button>
                </div>
            </div>
        );
    }
}