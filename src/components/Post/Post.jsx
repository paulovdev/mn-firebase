import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { readTime } from "../../utils/ReadTime";
import { toast } from "react-toastify";
import ScrollTop from "../../utils/ScrollTop/ScrollTop";
import Loading from "../Loading/Loading";
import { IoIosArrowRoundBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { ProgressBar } from "../../utils/ProgressBar/ProgressBar";
import "./Post.scss";
import { Blog } from "../../context/Context";

const Post = () => {
  const { currentUser } = Blog();
  const { postId } = useParams();

  const [post, setPost] = useState({});
  const [user, setUser] = useState({});

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, "posts", postId);
        const getPost = await getDoc(postRef);
        if (getPost.exists()) {
          const postData = getPost.data();
          setPost({ ...postData, id: postId });
          const userRef = doc(db, "users", postData.userId);
          const getUser = await getDoc(userRef);
          if (getUser.exists()) {
            const userData = getUser.data();
            setUser({ ...userData, id: postData.userId });
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

  const { title, desc, postImg, color, created, category } = post;
  const { username, userImg, userId } = user;

  const isAuthor = currentUser && currentUser.uid === userId;

  const goToProfile = () => {
    navigate(`/profile/${userId}`);
  };

  return (
    <>
      {!loading && (
        <section id="post-solo">
          <div className="container">
            <Link to="/" className="back">
              <IoIosArrowRoundBack size={32} />
              <p> Voltar</p>
            </Link>

            <div className="title-text">
              <span
                className="category-text"
                style={{ backgroundColor: color }}
              >
                {category}
              </span>
              <h1>{title}</h1>
              <div className="profile">
                {userImg && (
                  <img
                    src={userImg}
                    style={{ border: `1px solid ${color}` }}
                    onClick={goToProfile}
                    alt={`${username}'s profile`}
                  />
                )}
                <div className="text">
                  <span>{username}</span>
                  <p>{readTime({ __html: desc })} min de leitura</p>
                  {isAuthor && (
                    <Link to={`/editPost/${postId}`}>
                      <MdEdit size={20} />
                      <p>Editar</p>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="post">
            <img src={postImg} alt={`${username}'s post`} />
            <div className="body">
              <div dangerouslySetInnerHTML={{ __html: desc }} />
            </div>
            <p>{created}</p>
          </div>

          <ProgressBar backgroundColor={color} />
          <ScrollTop />
        </section>
      )}
      {loading && <Loading />}
    </>
  );
};

export default Post;
