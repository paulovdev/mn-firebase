import React, { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { toast } from "react-toastify";
import FormatDate from "../../utils/FormatDate";
import { readTime } from "../../utils/ReadTime";
import { useParams, Link } from "react-router-dom";
import { Transition } from '../../utils/Transition/Transition'
import './TopicPost.scss'

const TopicPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { postId } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const postsRef = collection(db, "posts");
        const postsQuery = query(postsRef, where("topic", "==", postId));

        const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
          const postsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPosts(postsData);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        toast.error("Erro ao buscar os posts relacionados ao tópico: " + error.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [postId]);

  return (
    <div id="topic-post">
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div id="posts">
          {posts.length < 1 ? <p>Nenhum resultado</p> : posts.map((post) => (
            <Link to={`/post/${post.id}`} className="wrapper" key={post.id}>

              <div className="left-content">
                <img src={post.postImg} alt="postImg" />
              </div>
              <div className="right-content">
                <div className="topic">{post.topic}</div>
                <div className="title-text">
                  <h1>{post.title}</h1>
                  <div
                    className="body-posts"
                    dangerouslySetInnerHTML={{
                      __html: post.desc.slice(0, 150),
                    }}
                  ></div>
                </div>
                <div className="text-wrapper">
                  <p>Criado em</p>
                  <span>
                    <FormatDate date={post.created} />
                  </span>
                  <span className="predefinition">•</span>
                  <p>{readTime({ __html: post.desc })} min de leitura</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Transition(TopicPost);
