import React from 'react'

import { NavLink } from "react-router-dom"


import './Footer.scss'
const Footer = () => {
    return (
        <footer>
            <li>
                <NavLink to="/about">Sobre</NavLink>
            </li>
            <p>Escreva o que voce tem interesse!</p>

        </footer>
    )
}

export default Footer;