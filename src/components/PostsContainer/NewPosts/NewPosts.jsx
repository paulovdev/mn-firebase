import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../../firebase/Config";
import { toast } from "react-toastify";
import { Blog } from "../../../context/Context";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import "./NewPosts.scss";

const NewPosts = () => {
  const [loading, setLoading] = useState(false);
  const [skeleton, setSkeleton] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setSkeleton(true);
      setLoading(true);
      try {
        const postsCollection = collection(db, "posts");
        const postsSnapshot = await getDocs(query(postsCollection, orderBy("created", "desc"), limit(2)));
        const fetchedPosts = [];

        postsSnapshot.forEach((postDoc) => {
          const postData = postDoc.data();
          const postId = postDoc.id;
          fetchedPosts.push({ ...postData, id: postId });
        });

        setPosts(fetchedPosts);
        setLoading(false);
        setTimeout(() => {
          setSkeleton(false);
        }, 800);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div id="new-posts">
      {skeleton ? (
        <>
          <div className="post-container large-post">
            <Skeleton height={200} />
          </div>
          {[...Array(3)].map((_, i) => (
            <div className="post-container small-post" key={i}>
              <Skeleton height={200} />
            </div>
          ))}
        </>
      ) : posts.length > 0 ? (
        posts.map((post, i) => (
          <Link
            to={`/post/${post.id}`}
            className={`post-container ${i === 0 ? 'large-post' : 'small-post'}`}
            key={post.id}
          >
            <div className="post">
              <div className="img-post">
                <img src={post.postImg || 'fallback-image-url.jpg'} alt="postImg" />
              </div>
              <div className="post-content">
                <div className="topic"><span>{post.topic}</span></div>
                <h1>{post.title}</h1>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p>Sem Posts com Ênfase disponíveis</p>
      )}
    </div>
  );
};

export default NewPosts;
