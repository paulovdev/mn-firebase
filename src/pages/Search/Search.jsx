import React from "react";
import { useLocation, Link } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { readTime } from "../../utils/ReadTime";
import FormatDate from "../../utils/FormatDate";
import Skeleton from 'react-loading-skeleton';

import useSearchPostsAndUser from "../../hooks/useSearchPostsAndUser";

import "./Search.scss";
import { Transition } from "../../utils/Transition/Transition";

const Search = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("q");
  const { posts, users, skeleton } = useSearchPostsAndUser(search);

  return (
    <section id="search">
      <div className="container">
        <Link to="/" className="back">
          <IoIosArrowRoundBack size={32} />
          <p>Voltar</p>
        </Link>

        <h1>
          Encontramos {skeleton ? "..." : posts.length} resultado{posts.length === 1 ? "" : "s"} para "{search}":
        </h1>

        {skeleton ? (
          <div id="search-posts">
            <Link to="/" className="post-container">
              <div className="post-left-content">
                <Skeleton width={300} height={200} />
              </div>
              <div className="post-right-content">
                <Skeleton width={100} height={20} />
                <div className="topic-profile-container">
                  <div className="profile-content">
                    <Skeleton circle={true} width={24} height={24} />
                    <div className="profile-text-wrapper">
                      <p><Skeleton width={100} height={10} /></p>
                      <p><Skeleton width={100} height={10} /></p>
                    </div>
                  </div>
                </div>
                <h1><Skeleton width={600} height={20} /></h1>
                <div className="body-posts">
                  <Skeleton count={4} height={15} />
                </div>
                <span><Skeleton width={50} height={10} /></span>
              </div>
            </Link>
          </div>
        ) : posts.length === 0 ? (
          <div className="no-result">
            <span>
              <p>Ops! Não encontramos nada para "{search}".</p>
              <p>Tente usar outros termos.</p>
            </span>
          </div>
        ) : (
          <div id="search-posts">
            {posts.length > 0 && posts.map((post, i) => {
              const user = users[post.userId];
              return (
                <Link to={`/post/${post.id}`} className="post-container" key={i}>
                  <div className="post-left-content">
                    <img src={post.postImg} alt="postImg" />
                  </div>
                  <div className="post-right-content">
                    <span className="topic">{post.topic}</span>
                    <div className="topic-profile-container">
                      {user && (
                        <div className="profile-content">
                          <img src={user.userImg} alt="" />
                          <div className="profile-text-wrapper">
                            <p>{user.username}</p>
                            <span>|</span>
                            <p>
                              <FormatDate date={post.created} />
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <h1>{post.title}</h1>
                    <div
                      className="body-posts"
                      dangerouslySetInnerHTML={{
                        __html: post.desc.slice(0, 250),
                      }}
                    ></div>
                    <span>{readTime({ __html: post.desc })} min de leitura</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Transition(Search);
