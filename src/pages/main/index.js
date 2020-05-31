import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
const { ipcRenderer: ipc } = window.require('electron');



export default class Main extends Component {
    state = {
        products: [],
        productInfo: {},
        page: 1,
    }
    
    componentDidMount() {
        this.mounted = true;
        this.loadProducts(1);
    }

    
    loadProducts = async ( page ) => {
        
        
        ipc.on('get-all-paginated-response', (event, response) => {
            const { data, productInfo } = response;
            
            this.setState({
                products: data,
                productInfo,
                page
            });
        })
        
        ipc.send('get-all-paginated', page);
    }
    
    nextPage = ( ) => {
        const { page, productInfo } = this.state;
        
        if (page === productInfo.pages) return;
        const pageNumber = page+1;
        this.loadProducts(pageNumber);
    };
    
    prevPage = ( ) => {
        const { page } = this.state;
        
        if (page === 1) return;
        
        const pageNumber = page-1;
        this.loadProducts(pageNumber);
    };
    
    render () {
        const { products, productInfo, page } = this.state;
        
        return(
            <div className="product-list">
                {products.map((product, i) => (
                    <article className={product.id} key={i}>
                        <strong>{product.title}</strong>
                        <p>{product.description}</p>
                        <Link to={`/products/${product.id}`}> Acessar</Link>
                    </article> 
                ))}
                
                <div className="actions">
                    <button disabled={page===1} onClick={this.prevPage}>Anterior</button>
                    <button disabled={page===productInfo.pages} onClick={this.nextPage}>Próxima</button>
                </div>
            </div>
        );
    }

    componentWillUnmount() {
        ipc.removeAllListeners();
    }
}