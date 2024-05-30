import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Blog } from "../../../context/Context";
import { readTime } from "../../../utils/ReadTime";
import FormatDate from "../../../utils/FormatDate";
import Loading from "../../Loading/Loading";
import useFetchPostsAndUser from "../../../hooks/useFetchPostsAndUser";
import "./AllPosts.scss";

const AllPosts = () => {
  const { postLoading } = Blog();
  const { posts, users, loading, fetchPosts, lastPostElementRef } = useFetchPostsAndUser();

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      {postLoading && loading ? (
        <Loading />
      ) : (
        <>
          <div id="all-posts">
            {posts.length > 0 ? (
              posts.map((post, i) => {
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
              })
            ) : (
              <p>Sem posts disponíveis</p>
            )}
          </div>
          {loading && <div className="loading-container"><div className="loading"></div></div>}
          <div ref={lastPostElementRef}></div>
        </>
      )}
    </>
  );
};

export default AllPosts;
