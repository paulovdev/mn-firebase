import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Importe useNavigate
import { Blog } from "../../context/Context";
import { IoIosSearch } from "react-icons/io";
import Loading from "../../components/Loading/Loading";
import "./Home.scss";
import Posts from "../../components/PostDetail/Posts";
import { LuPlus } from "react-icons/lu";

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

            <div className="posts">
              <Posts />
            </div>
          </div>

          <div className="container-right">
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

          {currentUser && (
            <Link to="/post/create" className="btn" title="Criar post">
              <LuPlus size={32} color="#000" />
            </Link>
          )}
        </section>
      )}
    </>
  );
};

export default Home;
