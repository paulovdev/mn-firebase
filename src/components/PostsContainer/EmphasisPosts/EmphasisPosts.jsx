import React from "react";
import { Link } from "react-router-dom";

import Skeleton from 'react-loading-skeleton';

import { SiReadme } from "react-icons/si";
import { FaClock } from "react-icons/fa";

import FormatDate from "../../../utils/FormatDate";
import { readTime } from "../../../utils/ReadTime";

import useEmphasisPostsAndUser from "../../../hooks/useEmphasisPostsAndUser";
import "./EmphasisPosts.scss";

const EmphasisPosts = () => {
  const { posts,  users, loading } = useEmphasisPostsAndUser();

  return (
    <div id="emphasis-posts">
      {loading ? (
        <>
          <div className="post-container large-post">
            <Skeleton height={450} />
            <Skeleton width={100} height={10} />
            <Skeleton height={20} />
          </div>
          <div className="grid-container">
            {[1, 2, 3].map((_, i) => (
              <div className="post-container small-post" key={i}>
                <Skeleton height={250} />
                <Skeleton width={100} height={10} />
                <Skeleton height={20} />
              </div>
            ))}
          </div>
        </>
      ) : posts.length > 0 ? (
        <>
          {posts.slice(0, 1).map((post, i) => {
            const user = users[post.userId];
            return (
              <Link to={`/post/${post.id}`} className="post-container large-post" key={i}>
                <div className="post">
                  <div className="img-post">
                    <img src={post.postImg} alt="Imagem do post" />
                  </div>

                  <div className="post-content">
                    <div className="post-right-content">
                      <span className="topic">{post.topic}</span>
                      <h1>{post.title}</h1>
                      <div
                        className="body-posts"
                        dangerouslySetInnerHTML={{
                          __html: post.desc.slice(0, 250),
                        }}
                      ></div>
                      <div className="read-topic">

                        <div className="topic-profile-container">
                          {user && (
                            <div className="profile-content">
                              <img src={user.userImg} alt="" />
                              <div className="profile-text-wrapper">
                                <p>{user.username.split(" ")[0]}</p>
                                <span>•</span>
                                <p>
                                  <FaClock />
                                  <FormatDate date={post.created} />
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        <span>< SiReadme /> {readTime({ __html: post.desc })} min de leitura</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          <div className="grid-container">
            {posts.slice(1).map((post, i) => {
              const user = users[post.userId];
              return (
                <Link to={`/post/${post.id}`} className="post-container small-post" key={i}>
                  <div className="post">

                    <div className="img-post">
                      <img src={post.postImg} alt="Imagem do post" />
                    </div>

                    <div className="post-content">
                      <div className="post-right-content">
                        <span className="topic">{post.topic}</span>



                        <h1>{post.title}</h1>
                        <div className="read-topic">

                          <div className="topic-profile-container">
                            {user && (
                              <div className="profile-content">
                                <img src={user.userImg} alt="" />
                                <div className="profile-text-wrapper">
                                <p>{user.username.split(" ")[0]}</p>
                                  <span>•</span>
                                  <p>
                                    <FaClock />
                                    <FormatDate date={post.created} />
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          <span>< SiReadme /> {readTime({ __html: post.desc })} min de leitura</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      ) : (
        <p>Sem posts disponíveis</p>
      )}
    </div>
  );
};

export default EmphasisPosts;
