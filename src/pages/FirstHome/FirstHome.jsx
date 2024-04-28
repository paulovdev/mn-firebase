import React from "react";
import { Link } from "react-router-dom";
import { BsArrowDown } from "react-icons/bs";

import { motion } from "framer-motion";

import { Blog } from "../../context/Context";
import './FirstHome.scss'

const FirstHome = () => {
  const { currentUser, allUsers } = Blog();

  const getUserData = allUsers.find((user) => user.id === currentUser?.uid);


  return (
    <>
      <section id="first-home">
        <div className="left-content">
          {!currentUser
            ? <>
              <h1 className="logo">Escreva!</h1>
              <p>Suas palavras têm poder na internet. Use-as para inspirar e se conectar com outros ao redor do mundo. Seja consciente do impacto que você pode causar.</p>

            </>
            : <>
              <span>olá</span>
              <h1>{getUserData?.username}</h1>
            </>}
          {!currentUser &&
            <Link to={'/register'}>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}>começar a publicar</motion.button>
            </Link>}
        </div>

        <a href="#home" className="arrow-down">
          < BsArrowDown color="#fff" />
        </a>
      </section>
    </>
  )
}

export default FirstHome;