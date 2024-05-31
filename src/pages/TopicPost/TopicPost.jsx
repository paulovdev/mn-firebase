import React from "react";
import { Link, useParams } from "react-router-dom";
import { Transition } from "../../utils/Transition/Transition";
import useTopicPostsAndUser from "../../hooks/useTopicPostsAndUser";
import FormatDate from "../../utils/FormatDate";
import { readTime } from "../../utils/ReadTime";

import { SiReadme } from "react-icons/si";
import { FaClock } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";

import Skeleton from 'react-loading-skeleton';
import "./TopicPost.scss";

const TopicPost = () => {
  const { postId } = useParams();
  const { posts, users, loading, skeleton } = useTopicPostsAndUser(postId);

  return (
    <section id="topic-post">
      <div className="container">
        <Link to="/" className="back">
          <IoIosArrowRoundBack size={32} />
          <p>Voltar</p>
        </Link>

        <h1>
          Encontramos {loading ? "..." : posts.length} resultado{posts.length === 1 ? "" : "s"} para "{postId}":
        </h1>
        {skeleton ? (
          <div id="topic-posts">
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
        ) : (
          <div id="posts">
            {posts.length < 1 ? (
              <p>Nenhum resultado</p>
            ) : (
              <div id="topic-posts">
                {posts.map((post, i) => {
                  const user = users[post.userId];
                  return (
                    <Link to={`/post/${post.id}`} className="post-container" key={i}>
                      <div className="post-left-content">
                        <img src={post.postImg} alt="postImg" />
                      </div>
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
                                  <p>{user.username}</p>
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
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Transition(TopicPost);
