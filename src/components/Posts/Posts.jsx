import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { toast } from "react-toastify";
import { Blog } from "../../context/Context";
import Loading from "../Loading/Loading";
import "./Posts.scss";

const Posts = () => {
  const { postLoading } = Blog();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const postsCollection = collection(db, "posts");
        const postsSnapshot = await getDocs(query(postsCollection, orderBy("created", "desc"), limit(4)));
        const fetchedPosts = [];
        const fetchedUsers = {};

        postsSnapshot.forEach((postDoc) => {
          const postData = postDoc.data();
          const postId = postDoc.id;
          fetchedPosts.push({ ...postData, id: postId });

          const userRef = doc(db, "users", postData.userId);
          const getUser = getDoc(userRef);
          fetchedUsers[postData.userId] = getUser;
        });

        const resolvedUsers = await Promise.all(Object.values(fetchedUsers));
        resolvedUsers.forEach((userDoc, index) => {
          const userData = userDoc.data();
          const userId = Object.keys(fetchedUsers)[index];
          fetchedUsers[userId] = { ...userData, id: userId };
        });

        setPosts(fetchedPosts);
        setUsers(fetchedUsers);
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      {postLoading && loading ? (
        <Loading />
      ) : (
        <div id="posts">
          {posts.length > 0 ? (
            <>
              {posts.slice(0, 1).map((post, i) => (
                <Link to={`/post/${post.id}`} className="post-container large-post" key={i}>
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
              <div className="grid-container">
                {posts.slice(1).map((post, i) => (
                  <Link to={`/post/${post.id}`} className="post-container small-post" key={i}>
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
              </div>
            </>
          ) : (
            <p>Sem posts disponíveis</p>
          )}
        </div>
      )}
    </>
  );
};

export default Posts;
