import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { toast } from "react-toastify";
import { Blog } from "../../context/Context";

import Loading from "../Loading/Loading";
import "./PostsEmphasis.scss";

const PostsEmphasis = () => {
  const { postLoading } = Blog();
  const [loading, setLoading] = useState(false);
  const [postEmphasis, setPostEmphasis] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchPostsEmphasis = async () => {
      setLoading(true);
      try {
        const postsEmphasisCollection = collection(db, "posts");
        const postsEmphasisSnapshot = await getDocs(query(postsEmphasisCollection, orderBy("created", "desc")));

        const desiredPostIds = ["XIV0ZhuITDoP8CtcWqqX", "XSOcAo0Rxfq1AGUlpoWP"];

        const fetchedPostEmphasis = [];
        const fetchedUsers = {};

        postsEmphasisSnapshot.forEach(async (postDoc) => {
          const postData = postDoc.data();
          const postId = postDoc.id;

          if (desiredPostIds.includes(postId)) {
            fetchedPostEmphasis.push({ ...postData, id: postId });

            const userRef = doc(db, "users", postData.userId);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data();
            fetchedUsers[postData.userId] = { ...userData, id: postData.userId };
          }
        });

        setPostEmphasis(fetchedPostEmphasis);
        setUsers(fetchedUsers);
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    };

    fetchPostsEmphasis();
  }, []);

  return (
    <>
      {postLoading || loading ? (
        <Loading />
      ) : (
        <div id="posts-emphasis">
          {postEmphasis.length > 0 ? (
            <>
              {postEmphasis.map((post, i) => (
                <Link to={`/post/${post.id}`} className={`post-container ${i === 0 ? 'large-post' : 'small-post'}`} key={i}>
                  <div className="post">
                    <div className="img-post">
                      <img src={post.postImg} alt="postImg" />
                    </div>
                    <div className="post-content">
                      <div className="topic"><span>{post.topic}</span></div>
                      <h1>{post.title}</h1>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <p>Sem Posts com Ênfase disponíveis</p>
          )}
        </div>
      )}
    </>
  );
};

export default PostsEmphasis;
