import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { toast } from "react-toastify";
import { Blog } from "../../context/Context";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import "./Posts.scss";

const Posts = () => {
  const { postLoading } = Blog();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const postsCollection = collection(db, "posts");
        const postsSnapshot = await getDocs(query(postsCollection, orderBy("created", "desc"), limit(4)));
        const fetchedPosts = [];

        postsSnapshot.forEach((postDoc) => {
          const postData = postDoc.data();
          const postId = postDoc.id;
          fetchedPosts.push({ ...postData, id: postId });
        });

        setPosts(fetchedPosts);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>

      <div id="posts">
        {loading ? (
          <>
            <div className="post-container large-post">
              <Skeleton height={300} />
              <Skeleton height={50} />
              <Skeleton height={20} width={100} />
            </div>
            <div className="grid-container">
              {[1, 2, 3].map((_, i) => (
                <div className="post-container small-post" key={i}>
                  <Skeleton height={150} />
                  <Skeleton height={50} />
                  <Skeleton height={20} width={100} />
                </div>
              ))}
            </div>
          </>
        ) : posts.length > 0 ? (
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
    </>
  );
};

export default Posts;
