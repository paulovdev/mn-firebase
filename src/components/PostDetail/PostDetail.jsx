import React from "react";
import { Link } from "react-router-dom";
import { readTime } from "../../utils/ReadTime";
import FormatDate from "../../utils/FormatDate";
import { FaRegClock } from "react-icons/fa";
import { HiArrowNarrowRight } from "react-icons/hi";

import "./PostDetail.scss";

const PostDetail = ({ post }) => {
  const { title, postImg, category, created, color, desc, id: postId } = post;
  const limitedDesc = desc.slice(0, 60);

  return (
    <>
      <div id="post-detail">
        <Link to={`/post/${postId}`}>
          <div className="wrapper">
            <div className="left-content">
              <img src={postImg} alt="postImg" />
            </div>

            <div className="right-content">
              <div className="date-category-text">
                <span
                  className="category-text"
                  style={{ backgroundColor: color }}
                >
                  {category}
                </span>
                <span className="date-text">
                  <FaRegClock />
                  <FormatDate date={created} />
                </span>
              </div>

              <div className="title-text">
                <h1>{title}</h1>
                <div
                  className="body"
                  dangerouslySetInnerHTML={{ __html: limitedDesc }}
                />
                <p>{readTime({ __html: limitedDesc })} min de leitura</p>
              </div>
              <Link className="read-more" to={`/post/${postId}`}>
                Ler Mais <HiArrowNarrowRight size={20} />
              </Link>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default PostDetail;
