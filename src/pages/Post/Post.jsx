import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Blog } from "../../context/Context";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/Config";

import { toast } from "react-toastify";

import { MdEdit } from "react-icons/md";
import { ProgressBar } from "../../utils/ProgressBar/ProgressBar";
import { FaRegComments } from "react-icons/fa6";
import { FiShare2 } from "react-icons/fi";
import Skeleton from 'react-loading-skeleton';

import UserComments from './Actions/UserComments/UserComments'

import ScrollTop from "../../utils/ScrollTop/ScrollTop";
import { readTime } from "../../utils/ReadTime";
import ScrollDown from "../../utils/ScrollDown/ScrollDown";
import { Transition } from "../../utils/Transition/Transition";
import "./Post.scss";

const Post = () => {
  const { currentUser } = Blog();
  const { postId } = useParams();
  const [loading, setLoading] = useState(false);
  const [skeleton, setSkeleton] = useState(false);
  const [post, setPost] = useState({});
  const [user, setUser] = useState({});
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      setSkeleton(true);
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
        setTimeout(() => {
          setSkeleton(false);
        }, 800);

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

  const { title, desc, postImg, color, created, topic } = post;
  const { username, userImg, userId } = user;

  const isAuthor = currentUser && currentUser.uid === userId;

  const goToProfile = () => {
    navigate(`/profile/${userId}`);
  };

  const sharePost = () => {
    const postUrl = window.location.href;
    if (navigator.share) {
      try {
        navigator.share({
          title: title,
          text: desc,
          url: postUrl,
        }).then(() => {
          console.log('Post compartilhado com sucesso!');
        }).catch((error) => {
          console.error('Erro ao compartilhar o post:', error);
        });
      } catch (error) {
        console.error('Erro ao compartilhar o post:', error);
      }
    } else {
      console.log('Este navegador não suporta a API de Web Share.');
    }
  };


  return (
    <>
      {skeleton ? (
        <section id="post-solo">
          <div className="container">
            <div className="image-background">
              <Skeleton width={948} height={498} />
            </div>

            <Skeleton width={120} height={20} />
            <br />
            <div className="title-text">
              <Skeleton width={1265} height={30} />
              <Skeleton width={250} height={15} />
              <Skeleton width={250} height={15} />
              <Skeleton width={250} height={15} />
              <div className="profile">
                <div className="profile-image">
                  <Skeleton circle={true} height={50} width={50} />
                </div>
                <div className="profile-info">
                  <Skeleton width={180} height={10} />
                </div>
              </div>
              <div className="action-icons">
                <div className="action-icon">
                  <Skeleton width={`40%`} height={20} />
                </div>
                <div className="action-icon">
                  <a href="#user-comments">
                    <Skeleton width={`40%`} height={20} />
                  </a>
                </div>
                <div className="action-icon" onClick={sharePost}>
                  <Skeleton width={`40%`} height={20} />
                </div>
              </div>
            </div>
          </div>
          <div className="post">
            <div className="body-post">
              <Skeleton width={`100%`} count={2} />
              <br />
              <Skeleton width={`100%`} count={4} />
              <br />
              <Skeleton width={`100%`} count={6} />
            </div>
            <ProgressBar backgroundColor={color} />
          </div>
        </section>
      ) : (
        <section id="post-solo">

          <div className="container">
            <div className="image-background">
              <img src={postImg} id="post" alt={`${username}'s post`} />
            </div>

            <span className="topic">{topic}</span>

            <div className="title-text">
              <h1>{title}</h1>
              <p> {created}</p>
              <p>{readTime({ __html: desc })} min de leitura</p>

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
                  <ScrollDown />
                </div>

                <div className="action-icon">
                  <a href="#user-comments">
                    <FaRegComments size={22} color="#fff" />
                  </a>
                </div>

                <div className="action-icon" onClick={sharePost}>
                  <FiShare2 size={22} color="#fff" />
                </div>

              </div>
            </div>

          </div>

          <div className="post">

            <div
              className="body-post"
              dangerouslySetInnerHTML={{
                __html: post.desc
              }}
            ></div>
            <ProgressBar backgroundColor={color} />

          </div>
          <UserComments postId={postId} comments={comments} />
          <ScrollTop />
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
              <MdEdit size={26} color="#fff" />
            </div>
          </Link>
        </>
      )}

    </>
  );
};

export default Transition(Post);
