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
          <>
            <PostDetail key={i} post={post} />
          </>
        ))
      ) : (
        <p>Sem posts disponíveis</p>
      )}
    </>
  );
};

export default Posts;
