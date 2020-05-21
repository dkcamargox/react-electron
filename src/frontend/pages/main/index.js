import React, {Component} from 'react';
import './styles.css';
import { Link } from 'react-router-dom';

export default class Main extends Component {
    render () {
        return(
            <div className="product-list">
                <article>
                    <strong>JavaScript</strong>
                    <p>a linguagem programação que mudou tudo</p>
                    <Link to={`/products/1`}> Acessar</Link>
                </article>
                <article>
                    <strong>JavaScript</strong>
                    <p>a linguagem programação que mudou tudo</p>
                    <Link to={`/products/1`}> Acessar</Link>
                </article>
                <article>
                    <strong>JavaScript</strong>
                    <p>a linguagem programação que mudou tudo</p>
                    <Link to={`/products/1`}> Acessar</Link>
                </article>

                <div className="actions">
                    <button>Anterior</button>
                    <button>Próximo</button>
                </div>
            </div>
        );
    }
}