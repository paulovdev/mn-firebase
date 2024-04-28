import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { readTime } from "../../utils/ReadTime";
import { toast } from "react-toastify";
import ScrollTop from "../../utils/ScrollTop/ScrollTop";
import Loading from "../Loading/Loading";
import { IoIosArrowRoundBack } from "react-icons/io";
import { GoArrowDown } from "react-icons/go";
import { MdEdit } from "react-icons/md";
import { ProgressBar } from "../../utils/ProgressBar/ProgressBar";
import "./Post.scss";
import { Blog } from "../../context/Context";
import Transition from "../../utils/Transition/Transition";

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

  const { title, desc, postImg, color, created } = post;
  const { username, userImg, userId } = user;

  const isAuthor = currentUser && currentUser.uid === userId;

  const goToProfile = () => {
    navigate(`/profile/${userId}`);
  };

  return (
    <>
      {loading ? <Loading /> : (
        <section id="post-solo">
          <div className="container">
            <div className="color-background" style={{ backgroundColor: color }}></div>
            <p>{readTime({ __html: desc })} min de leitura</p>
            <div className="title-text">
              <h1>{title}</h1>

              <div className="profile">
                {userImg && (
                  <img
                    src={userImg}

                    onClick={goToProfile}
                    alt={`${username}'s profile`}
                  />
                )}
                <div className="text">
                  <div className="post-by">
                    <p>Postado por:  </p>  <span> {username}</span>
                  </div>
                </div>
              </div>

              <div className="icon-down"> <a href="#post"> <GoArrowDown size={32} color="#fff" /></a></div>
            </div>
          </div>

          <div className="post">
            <img src={postImg} id="post" alt={`${username}'s post`} />
            <div className="body-post" >
              <div dangerouslySetInnerHTML={{ __html: desc }} />
            </div>
            <p>{created}</p>
          </div>

          <ProgressBar backgroundColor={color} />
          <ScrollTop />
        </section>
      )}
      {isAuthor && (
        <>
          <Link to={`/editPost/${postId}`} className="btn" title="criar post">
            <div className="icon-content">
              <MdEdit
                size={26}
                color="#000"
              /></div>
            <p>editar post</p>
          </Link>
        </>
      )}
    </>
  );
};

export default Transition(Post);
