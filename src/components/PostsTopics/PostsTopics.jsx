import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, orderBy, where, limit } from "firebase/firestore";
import { readTime } from "../../utils/ReadTime";
import { db } from "../../firebase/Config";
import { Blog } from "../../context/Context";

import Loading from "../Loading/Loading";
import "./PostsTopics.scss";

const PostsTopics = ({ topic }) => {
  const { postLoading } = Blog();
  const [loading, setLoading] = useState(false);
  const [postTopic, setPostTopic] = useState([]);

  useEffect(() => {
    fetchPostsTopics();
  }, [topic]);

  const fetchPostsTopics = async () => {
    setLoading(true);
    try {
      const postsTopicCollection = collection(db, "posts");
      const postsTopicSnapshot = await getDocs(
        query(postsTopicCollection, orderBy("created"), where("topic", "==", topic), limit(2))
      );

      const fetchedPostTopic = [];
      await Promise.all(
        postsTopicSnapshot.docs.map(async (postDoc) => {
          const postData = postDoc.data();
          const postId = postDoc.id;

          const userRef = doc(db, "users", postData.userId);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();

          fetchedPostTopic.push({ ...postData, id: postId, user: { ...userData, id: postData.userId } });
        })
      );

      setPostTopic(fetchedPostTopic);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar tópicos de posts:", error);
      setLoading(false);
    }
  };

  return (
    <>
      {postLoading || loading ? (
        <Loading />
      ) : (
        <div id="posts-topics">
          {postTopic && postTopic.length > 0 ? (
            postTopic.map((post) => (
              <Link to={`/post/${post.id}`} className="post-container" key={post.id}>
                <div className="post">
                  <div className="img-post">
                    <img src={post.postImg} alt="postImg" />
                  </div>
                  <div className="post-content">
                    <div className="topic"><span>{post.topic}</span></div>
                    <div className="read-text">
                      <p>{readTime({ __html: post.desc })} min de leitura</p>
                    </div>
                    <h1>{post.title}</h1>

                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>Sem Posts com Ênfase disponíveis</p>
          )}
        </div>
      )}
    </>
  );
};

export default PostsTopics;
