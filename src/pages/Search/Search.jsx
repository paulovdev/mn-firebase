import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Blog } from "../../context/Context";
import { IoIosSearch } from "react-icons/io";
import PostDetail from "../../components/PostDetail/PostDetail";
import "./Search.scss";

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
        <h2>Search</h2>
        <Link to="/">Voltar para a página inicial</Link>
      </div>

      <div className="posts">
        {posts.length === 0 ? (
          <div className="no-result">
            <span>
              <p>Ops! Não encontramos nada para "{search}".</p>
              <p>Tente usar outros termos.</p>
            </span>
          </div>
        ) : (
          <>
            <p>
              Encontramos {posts.length} resultados para "{search}":
            </p>
            {posts.map((post) => (
              <PostDetail key={post.id} post={post} />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Search;
