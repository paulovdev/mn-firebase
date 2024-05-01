import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { readTime } from "../../utils/ReadTime";
import { toast } from "react-toastify";
import ScrollTop from "../../utils/ScrollTop/ScrollTop";
import Loading from "../../components/Loading/Loading";
import { GoArrowDown } from "react-icons/go";
import { MdEdit } from "react-icons/md";
import { ProgressBar } from "../../utils/ProgressBar/ProgressBar";
import { FaRegComments } from "react-icons/fa6";
import { FiShare2 } from "react-icons/fi";


import "./Post.scss";
import { Blog } from "../../context/Context";
import { Transition } from "../../utils/Transition/Transition";
import UserComments from '../../components/UserComments/UserComments'

const Post = () => {
  const { currentUser } = Blog();
  const { postId } = useParams();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState({});
  const [user, setUser] = useState({});
  const [comments, setComments] = useState([]); // Estado para armazenar os comentários
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
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    const fetchComments = () => {
      const commentsRef = collection(db, "comments");
      const commentsQuery = query(commentsRef, where("postId", "==", postId));

      onSnapshot(commentsQuery, (snapshot) => {
        const commentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsData);
      });
    };

    fetchComments();
  }, [postId]);

  const { title, desc, postImg, color, created } = post;
  const { username, userImg, userId } = user;

  const isAuthor = currentUser && currentUser.uid === userId;

  const goToProfile = () => {
    navigate(`/profile/${userId}`);
  };

  // Função para compartilhar o post
  const sharePost = () => {
    const postUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: desc,
        url: postUrl,
      }).then(() => {
        console.log('Post compartilhado com sucesso!');
      }).catch((error) => {
        console.error('Erro ao compartilhar o post:', error);
      });
    } else {
      console.log('Este navegador não suporta a API de Web Share.');
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section id="post-solo">

          <div className="container">
            <div
              className="color-background"
              style={{ backgroundColor: color }}
            ></div>


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
                    <p>Postado por: </p> <span> {username}</span>
                  </div>
                </div>
              </div>

              <div className="action-icons">

                <div className="action-icon">
                  <a href="#post">
                    <GoArrowDown size={28} color="#fff" />
                  </a>
                </div>

                <div className="action-icon">
                  <a href="#user-comments">
                    < FaRegComments size={22} color="#fff" />
                  </a>
                </div>

                <div className="action-icon" onClick={sharePost}>
                  <FiShare2 size={22} color="#fff" />
                </div>

              </div>
            </div>


            <div className="post">
              <img src={postImg} id="post" alt={`${username}'s post`} />
              <div
                className="body-post"
                dangerouslySetInnerHTML={{
                  __html: post.desc
                }}
              ></div>
              <p>{created}</p>
            </div>
            <ProgressBar backgroundColor={color} />
            <ScrollTop />
          </div>
          <UserComments postId={postId} comments={comments} />
        </section>
      )}
      {isAuthor && (
        <>
          <Link
            to={`/editPost/${postId}`}
            className="btn"
            title="Editar post"
          >
            <div className="icon-content">
              <MdEdit size={26} color="#000" />
            </div>
            <p>editar post</p>
          </Link>
        </>
      )}
    </>
  );
};

export default Transition(Post);
