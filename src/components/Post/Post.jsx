import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { readTime } from "../../utils/ReadTime";
import { toast } from "react-toastify";
import Loading from "../Loading/Loading";

import "./Post.scss";
import { Blog } from "../../context/Context";

const Post = () => {
  const { currentUser } = Blog();
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, "posts", postId);
        const getPost = await getDoc(postRef);
        if (getPost.exists()) {
          const postData = getPost.data();
          if (postData?.userId) {
            const userRef = doc(db, "users", postData?.userId);
            const getUser = await getDoc(userRef);

            if (getUser.exists()) {
              const { created, ...rest } = getUser.data();
              setPost({ ...postData, ...rest, id: postId });
            }
          }
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const {
    title,
    desc,
    postImg,
    username,
    userImg,
    userId,

    created,
    category,
  } = post;
  const isAuthor = currentUser && currentUser.uid === userId;

  
  return (
    <>
      {!loading && (
        <section id="post-solo">
          <div className="container">
            <div className="title-text">
              <h1>{title}</h1>
              {userImg && <img src={userImg} alt={`${username}'s profile`} />}
              <p>Por {username}</p>
              <p> {readTime({ __html: desc })} min de leitura</p>
              {category}
              {created}
              <div className="tags-container">
                <div className="tags-text">
   
                </div>
              </div>
            </div>
            <div className="buttons">
              <Link to="/">Voltar</Link>
              {isAuthor && <Link to={`/editPost/${postId}`}>Editar</Link>}
            </div>
          </div>

          <div className="post">
            <img src={postImg} alt={`${username}'s post`} />
            <div className="body">
              <div dangerouslySetInnerHTML={{ __html: desc }} />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Post;
