import React, { Component }  from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
const { ipcRenderer: ipc } = window.require('electron');

export default class Product extends Component {
    state = {
        product: { }
    }
    
    loadProduct = async () => {
        const { id } = this.props.match.params;
        
        await ipc.on('get-one-response', (event, response) => {
            const data = response.data[0];
            this.setState({
                product: data
            });
        });
        
        await ipc.send('get-one', id);
        // console.log(this.state);
    }
    componentDidMount() {
        this.mounted = true;
        this.loadProduct();
    }

    render() {
        const { product } = this.state;
        return (
            <div className="productInfo">
                <article>
                <h1>{product.title}</h1>
                <p> {product.description}</p>
                <p> URL: <a href={product.url} rel="noopener noreferrer" target="_blank"> {product.url} </a></p>
                </article>
                <Link to='/' className="voltar">Voltar</Link>
            </div>
            
            );
        }
    
    componentWillUnmount() {
        ipc.removeAllListeners();
    }
    
    }