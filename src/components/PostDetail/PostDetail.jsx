import React from "react";
import { Link } from "react-router-dom";
import { readTime } from "../../utils/ReadTime";
import "./PostDetail.scss";

const PostDetail = ({ post }) => {
  const { title, desc, postImg, category, color, id: postId } = post;

  return (
    <>
      <div id="post-detail">
        <Link to={`/post/${postId}`}>
          <img src={postImg} alt="postImg" />
          <div className="title-text">
            <span className="category-text" style={{ backgroundColor: color }}>
              {category}
            </span>
            <h1>{title}</h1>
            <p>{readTime({ __html: desc })} min de leitura</p>
          </div>
        </Link>
      </div>
    </>
  );
};

export default PostDetail;
