import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
    return (
        <section id='about'>
            <div className="about-content">
                <h1>Sobre</h1>
                <h2>Sobre o Mini Blog</h2>
                <p>Bem-vindo ao nosso mini blog construído com React! Aqui, você pode expressar suas ideias e compartilhar conhecimento.</p>
                <h3>Recursos Principais:</h3>
                <ul>
                    <li>Crie, leia, atualize e exclua postagens facilmente.</li>
                    <li>Intuitivo e fácil de usar.</li>
                    <li>Compartilhe suas postagens com o mundo.</li>
                </ul>
                <h3>Nossa Missão:</h3>
                <p>Nossa missão é fornecer uma plataforma onde você possa expressar livremente suas ideias e se conectar com uma comunidade de mentes criativas.</p>
                <h3>Equipe:</h3>
                <p>Nossa equipe é composta por desenvolvedores apaixonados que se dedicam a criar experiências incríveis para nossos usuários.</p>
                <p>Quer fazer parte do nosso time? <Link to="/contact">Entre em contato</Link> conosco!</p>
                <p>Clique <Link to="/posts/create">aqui</Link> para criar uma nova postagem e comece a compartilhar suas ideias agora mesmo.</p>
            </div>
        </section>
    );
}

export default About;
