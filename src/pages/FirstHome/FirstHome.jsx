import React from "react";
import { Link } from "react-router-dom";

import { Blog } from "../../context/Context";
import './FirstHome.scss'
import ScrollDown from "../../utils/ScrollDown/ScrollDown";

const FirstHome = () => {
  const { currentUser, allUsers } = Blog();

  return (
    <>
      <section id="first-home">
        <h1 className="logo"><span>P</span>ublish.</h1>

        <p>Suas palavras têm poder na internet. Use-as para inspirar e se conectar com outros ao redor do mundo. Seja consciente do impacto que você pode causar.</p>

        <Link to={!currentUser ? "/register" : "post/create"}>
          <button>começar a publicar</button>
        </Link>
        <ScrollDown />
      </section>
    </>
  )
}

export default FirstHome;