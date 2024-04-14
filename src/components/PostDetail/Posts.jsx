import React from "react";
import PostDetail from "./PostDetail";
import { Blog } from "../../context/Context";
import "./PostDetail.scss";
import Loading from "../Loading/Loading";

const Posts = () => {
  const { postData, postLoading } = Blog();

  return (
    <>
      {postLoading ? (
        <>
          <Loading />
        </>
      ) : postData && postData.length > 0 ? (
        postData.map((post, i) => (
          <div className="post-detail" key={i}>
            <PostDetail post={post} />
          </div>
        ))
      ) : (
        <p>Sem posts disponíveis</p>
      )}
    </>
  );
};

export default Posts;
