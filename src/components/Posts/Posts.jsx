import React from "react";
import { Link } from "react-router-dom";
import { Blog } from "../../context/Context";
import { readTime } from "../../utils/ReadTime";
import FormatDate from "../../utils/FormatDate";
import Loading from "../Loading/Loading";
import "./Posts.scss";

const Posts = () => {
  const { postData, postLoading } = Blog();


  return (
    <>
      {postLoading ? (
        <Loading />
      ) : (
        <>
          <div id="posts">
            {postData && postData.length > 0 ? (
              postData.map((post, i) => (
                <Link to={`/post/${post.id}`} className="wrapper" key={i}>

                  <div className="left-content">
                    <img src={post.postImg} alt="postImg" />
                  </div>

                  <div className="right-content">
                    <div
                      className="color-background"
                      style={{ backgroundColor: post.color }}
                    ></div>

                    <div className="title-text">
                      <h1>{post.title}</h1>
                      <div className="body-posts" dangerouslySetInnerHTML={{ __html: post.desc.slice(0, 150) }}>

                      </div>
                    </div>

                    <div className="text-wrapper">
                      <p>
                        criado em
                      </p>
                      <span>
                        <FormatDate date={post.created} />
                      </span>
                      <span className="predefinition">•</span>
                      <p>
                        {readTime({ __html: post.desc })} min de leitura
                      </p>
                    </div>
                  </div>

                </Link>
              ))
            ) : (
              <p>Sem posts disponíveis</p>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Posts;
