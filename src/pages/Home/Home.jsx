import React from "react";
import { Blog } from "../../context/Context";

import { RiMedalFill } from "react-icons/ri";

import Loading from "../../components/Loading/Loading";

import Posts from "../../components/Posts/Posts";
import PostsEmphasis from "../../components/PostsEmphasis/PostsEmphasis";

import { Transition } from "../../utils/Transition/Transition";

import "./Home.scss";
import { PostsTopicsAI, PostsTopicsProgramming } from "../../components/PostsTopics/PostsTopicsSelect";
import PostsAll from "../../components/PostsAll/PostsAll";
import PostsTopicsSelection from "../../components/PostsTopicsSelection/PostsTopicsSelection";

const Home = () => {
  const { userLoading } = Blog();

  return (
    <>
      {userLoading ? (
        <Loading />
      ) : (
        <>
          <section id="home">
            <h1>Novos posts</h1>
            <Posts />
            <div className="emphasis-text">
              <h1>Em destaque</h1>  <RiMedalFill size={24} />
            </div>
            {/*  <p>Posts selecionados a dedo e que faz grande diferenca na vidas das pessoas</p> */}
            <PostsEmphasis />

            <div className="emphasis-text">
              <h1>Programação </h1>
            </div>
            <PostsTopicsProgramming />

            <div className="emphasis-text">
              <h1>Inteligência Artificial</h1>
            </div>
            <PostsTopicsAI />
            <div className="emphasis-text">
              <h1>Navegar</h1>
            </div>

            <PostsTopicsSelection />
            <div className="emphasis-text">
              <h1>Todos os posts</h1>
            </div>
            <PostsAll />

            {/*             
            <Link to={`allTopics`}>Topicos <GoArrowRight />
            </Link> */}
          </section>
        </>
      )}
    </>
  );
};

export default Transition(Home);
