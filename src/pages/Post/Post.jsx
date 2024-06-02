import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaRegComments } from "react-icons/fa6";
import { FiShare2 } from "react-icons/fi";
import Skeleton from 'react-loading-skeleton';
/* import UserComments from './Actions/UserComments/UserComments' */
import ScrollTop from "../../utils/ScrollTop/ScrollTop";
import { readTime } from "../../utils/ReadTime";
import ScrollDown from "../../utils/ScrollDown/ScrollDown";
import "./Post.scss";
import usePostDetails from '../../hooks/usePostDetails';
const Post = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = usePostDetails(postId);

  const goToProfile = () => {
    navigate(`/profile/${data?.user?.id}`);
  };

  const sharePost = () => {
    const postUrl = window.location.href;
    if (navigator.share) {
      try {
        navigator.share({
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

  if (isLoading) {
    return (
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
        </div>
      </section>
    );
  }

  if (isError) {
    toast.error(error.message);
  }

  const { title, desc, postImg, created, topic } = data?.post;
  const { username, userImg } = data?.user;

  return (
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
            __html: desc
          }}
        ></div>
      </div>

      <ScrollTop />
    </section>
  );
};

export default Post;
