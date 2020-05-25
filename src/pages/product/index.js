import React, { Component }  from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import connection from '../../connection';
export default class Product extends Component {

    async  getOneProduct(id) {
        const product = await connection('products')
        .select('*')
        .where('id', id);

        return(product); 
    }

    render() {
        return (
            <div className="productInfo">
                <article>
                    <h1>JavaScript</h1>
                    <p>a linguagem de programação que tornou tudo possivel</p>
                    <p>URL: <a href="https://javascript.com" rel="noopener noreferrer" target="_blank">https://javascript.com</a></p>
                    <Link to='/' className="voltar">Voltar</Link>
                </article>
                
            </div>
        );
    }
}