import React from "react";
import { Link } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaClock } from 'react-icons/fa';
import { SiReadme } from 'react-icons/si';
import FormatDate from "../../../utils/FormatDate";
import { readTime } from "../../../utils/ReadTime";
import useFetchNewPostsAndUser from "../../../hooks/useFetchNewPostsAndUser";
import "./NewPosts.scss";

const NewPosts = () => {
  const { data: postsAndUsers, isLoading, error } = useFetchNewPostsAndUser();

  return (
    <div id="new-posts">
      {isLoading && (
        <>
          <div className="post-container large-post">
            <Skeleton height={300} />
          </div>
          {[...Array(1)].map((_, i) => (
            <div className="post-container small-post" key={i}>
              <Skeleton height={300} />
            </div>
          ))}
        </>
      )}

      {error && (
        <p>Erro ao carregar os posts.</p>
      )}

      {!isLoading && !error && postsAndUsers && postsAndUsers.fetchedPosts.length > 0 ? (
        postsAndUsers.fetchedPosts.map((post, i) => (
          <Link
            to={`/post/${post.id}`}
            className={`post-container ${i === 0 ? 'large-post' : 'small-post'}`}
            key={post.id}
          >
            <div className="post">
              <div className="img-post">
                <img src={post.postImg || 'fallback-image-url.jpg'} alt="postImg" />
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
                      {post.user && (
                        <div className="profile-content">
                          <img src={post.user.userImg} alt="" />
                          <div className="profile-text-wrapper">
                            <p>{post.user.username.split(" ")[0]}</p>
                            <span>•</span>
                            <p>
                              <FaClock />
                              <FormatDate date={post.created} />
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <span><SiReadme /> {readTime({ __html: post.desc })} min de leitura</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p>Você não segue nenhuma pessoa ainda :(</p>
      )}
    </div>
  );
};

export default NewPosts;
