import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Blog } from "../../context/Context";
import { IoIosSearch } from "react-icons/io";
import FirstHome from '../FirstHome/FirstHome'
import Loading from "../../components/Loading/Loading";
import "./Home.scss";
import Posts from "../../components/Posts/Posts";
import { LuPlus } from "react-icons/lu";
import { Transition } from "../../utils/Transition/Transition";
import FirstPost from "../../components/FirstPost/FirstPost";


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
          <FirstPost />
          <section id="home">
            <div className="trending" >
              <span>publicações.</span>
              <div className="border-trending"></div>
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

            <Posts />
          </section>
        </>
      )}
    </>
  );
};

export default Transition(Home);
