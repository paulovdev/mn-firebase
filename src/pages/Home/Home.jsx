import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Blog } from "../../context/Context";
import { IoIosSearch } from "react-icons/io";

import FirstHome from '../FirstHome/FirstHome'
import { GoArrowRight } from "react-icons/go";

import Loading from "../../components/Loading/Loading";

import Posts from "../../components/Posts/Posts";
import { LuPlus } from "react-icons/lu";
import { Transition } from "../../utils/Transition/Transition";

import "./Home.scss";

const Home = () => {
  const [search, setSearch] = useState("");
  const { currentUser, allUsers, userLoading } = Blog();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (search) {
      return navigate(`/search?q=${search}`);
    }
  };

  return (
    <>
      {userLoading ? (
        <Loading />
      ) : (
        <>
          <FirstHome />

          <section id="home">
            <div className="recent-text">
              <h1>Mais recente</h1>
              <Link to={`allTopics`}>Topicos <GoArrowRight />
              </Link>
            </div>
            <div className="field-container">
              <div className="left-content">
                <Posts />
              </div>
              <div className="right-content">
                <form onSubmit={handleSubmit}>
                  <div className="search-input">
                    <input
                      type="text"
                      placeholder="Busca por blogs"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">
                      <IoIosSearch size={26} />
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Transition(Home);
