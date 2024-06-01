import React from "react";

import NewPosts from "../../components/PostsContainer/NewPosts/NewPosts";
import AllPosts from "../../components/PostsContainer/AllPosts/AllPosts";
import RandomTopics from "../../components/TopicsContainer/RandomTopics/RandomTopics"
import EmphasisPosts from './../../components/PostsContainer/EmphasisPosts/EmphasisPosts';

import { Transition } from "../../utils/Transition/Transition";
import "./Home.scss";

const Home = () => {

  return (

    <>
      <section id="home">
        <h1>Em destaque</h1>
        <div className="border-bottom"></div>

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

        {/*             
            <Link to={`allTopics`}>Topicos <GoArrowRight />
            </Link> */}
      </section>
    </>
  );
};

export default Transition(Home);
