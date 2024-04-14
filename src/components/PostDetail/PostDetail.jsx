import React from "react";
import { Link } from "react-router-dom";
import { RiArrowRightDownLine } from "react-icons/ri";
import { readTime } from "../../utils/ReadTime";

import "./PostDetail.scss";

const PostDetail = ({ post }) => {
  const { title, desc, postImg, tags, id: postId } = post;

  return (
    <>
      <img src={postImg} alt="postImg" />
      <div className="title-text">
        <h1>{title}</h1>
      </div>

      <div className="tags-container">
        <p>{readTime({ __html: desc })} min de leitura</p>
        <div className="tags-text">
          {tags.map((tag, index) => (
            <div className="tags" key={index}>
              <p>{tag}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="read">
        <Link to={`/post/${postId}`}>
          Ler <RiArrowRightDownLine size={24} />
        </Link>
      </div>
    </>
  );
};

export default PostDetail;
