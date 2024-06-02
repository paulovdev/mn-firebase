import React from "react";

import NewPosts from "../../components/PostsContainer/NewPosts/NewPosts";
import AllPosts from "../../components/PostsContainer/AllPosts/AllPosts";
import RandomTopics from "../../components/TopicsContainer/RandomTopics/RandomTopics"
import EmphasisPosts from './../../components/PostsContainer/EmphasisPosts/EmphasisPosts';

import { motion, AnimatePresence } from "framer-motion";


import "./Home.scss";

const Home = () => {

  return (

    <>
      <section id="home">
        <h1>Em destaque</h1>
        <div className="border-bottom"></div>
        <AnimatePresence mode='wait'>
          <motion.div className="wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            <EmphasisPosts />

            <div className="emphasis-text">
              <h1>Novos posts de quem você esta seguindo</h1>
            </div>
            <NewPosts />


            <div className="emphasis-text">
              <h1>Navegar</h1>
            </div>
            <RandomTopics />

            <div className="emphasis-text">
              <h1>Todos os posts</h1>
            </div>
            <AllPosts />
          </motion.div>
        </AnimatePresence>
        {/*             
            <Link to={`allTopics`}>Topicos <GoArrowRight />
            </Link> */}
      </section>
    </>
  );
};

export default Home;
