import React from "react";
import { Link } from "react-router-dom";
import { readTime } from "../../../utils/ReadTime";
import FormatDate from "../../../utils/FormatDate";
import { useInView } from 'react-intersection-observer';

import { SiReadme } from "react-icons/si";
import { FaClock } from "react-icons/fa";

import useFetchPostsAndUser from "../../../hooks/useFetchPostsAndUser";
import "./AllPosts.scss";

const AllPosts = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useFetchPostsAndUser();

  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (isLoading) {
    return <div className="loading-container"><div className="loading"></div></div>;
  }

  if (isError) {
    return <p>Erro ao carregar os posts</p>;
  }

  return (
    <div id="all-posts">
      {data.pages.map((page, pageIndex) =>
        page.posts.map((post, i) => {
          const user = page.users[post.userId];
          return (
            <Link to={`/post/${post.id}`} className="post-container" key={`${pageIndex}-${i}`}>
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
                  <span><SiReadme /> {readTime({ __html: post.desc })} min de leitura</span>
                </div>
              </div>
            </Link>
          );
        })
      )}
      <div ref={ref}></div>
      {isFetchingNextPage && <div className="loading-container"><div className="loading"></div></div>}
    </div>
  );
};

export default AllPosts;
