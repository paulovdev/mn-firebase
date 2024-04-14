import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importe useNavigate
import { Blog } from "../../context/Context";
import { IoIosSearch } from "react-icons/io";
import Loading from "../../components/Loading/Loading";
import "./Home.scss";
import Posts from "../../components/PostDetail/Posts";

const Home = () => {
  const [search, setSearch] = useState("");
  const { currentUser, allUsers, userLoading } = Blog();
  const navigate = useNavigate();

  const getUserData = allUsers.find((user) => user.id === currentUser?.uid);

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
        <section id="home">
          <div className="container">
            {!currentUser && <h1>Bem vindo</h1>}
            {currentUser && (
              <h1>
                Olá, <br />
                {getUserData?.username}
              </h1>
            )}
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

          <div className="posts">
            <Posts />
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
