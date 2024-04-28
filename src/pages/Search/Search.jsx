import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Blog } from "../../context/Context";
import { IoIosArrowRoundBack } from "react-icons/io";

import Posts from "../../components/Posts/Posts";
import "./Search.scss";
import Transition from "../../utils/Transition/Transition";

const Search = () => {
  const { postData } = Blog();
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("q");
  const [posts, setPosts] = useState([]);

  React.useEffect(() => {
    const searchData = postData.filter((post) =>
      post.title.toLowerCase().includes(search.toLowerCase())
    );
    setPosts(searchData);
  }, [search, postData]);

  return (
    <section id="search">
      <div className="container">

        <Link to="/" className="back">
          <IoIosArrowRoundBack size={32} />
          <p> Voltar</p>
        </Link>

        <h1>Busca</h1>

        {posts.length === 0 ? (
          <div className="no-result">
            <span>
              <p>Ops! Não encontramos nada para "{search}".</p>
              <p>Tente usar outros termos.</p>
            </span>
          </div>
        ) : (
          <p>
            Encontramos {posts.length} resultados para "{search}":
          </p>
        )}
      </div>

      <div className="posts">
        <>
          {posts.map((post) => (
            <Posts key={post.id} post={post} />
          ))}
        </>
      </div>
    </section>
  );
};

export default Transition(Search);
