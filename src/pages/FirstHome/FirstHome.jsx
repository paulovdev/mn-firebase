import React from "react";
import { Link } from "react-router-dom";
import { BsArrowDown } from "react-icons/bs";

import { motion } from "framer-motion";

import { Blog } from "../../context/Context";
import './FirstHome.scss'
import ScrollDown from "../../utils/ScrollDown/ScrollDown";

const FirstHome = () => {
  const { currentUser, allUsers } = Blog();

  const getUserData = allUsers.find((user) => user.id === currentUser?.uid);


  return (
    <>
      <section id="first-home">
        <div className="left-content">
          {!currentUser
            ? <>
              <h1 className="logo">publish</h1>

            </>
            : <>
              <span>olá</span>
              <h1>{getUserData?.username}</h1>
            </>}
          <p>Suas palavras têm poder na internet. Use-as para inspirar e se conectar com outros ao redor do mundo. Seja consciente do impacto que você pode causar.</p>

          <Link to={!currentUser ? "/register" : "post/create"}>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}>começar a publicar</motion.button>
          </Link>
        </div>

        <ScrollDown />
      </section>
    </>
  )
}

export default FirstHome;