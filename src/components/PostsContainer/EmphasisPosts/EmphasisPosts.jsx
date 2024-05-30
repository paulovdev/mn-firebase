import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/Config";
import { toast } from "react-toastify";
import { Blog } from "../../../context/Context";
import Skeleton from 'react-loading-skeleton';
import "./EmphasisPosts.scss";

const EmphasisPosts = () => {
  const [loading, setLoading] = useState(false);
  const [skeleton, setSkeleton] = useState(false);
  const [postEmphasis, setPostEmphasis] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchPostsEmphasis = async () => {
      setSkeleton(true);
      setLoading(true);
      try {
        const postsEmphasisCollection = collection(db, "posts");
        const postsEmphasisSnapshot = await getDocs(query(postsEmphasisCollection, orderBy("created", "desc")));

        const desiredPostIds = ["XSOcAo0Rxfq1AGUlpoWP", "XIkpkijBgoyF1LoshOET", "XIV0ZhuITDoP8CtcWqqX", "BGNkIQ5rZ6cqJcvCYnJ9"];

        const fetchedPostEmphasis = [];
        const fetchedUsers = {};

        const userFetchPromises = [];

        postsEmphasisSnapshot.forEach((postDoc) => {
          const postData = postDoc.data();
          const postId = postDoc.id;

          if (desiredPostIds.includes(postId) && !fetchedPostEmphasis.find(post => post.id === postId)) {
            fetchedPostEmphasis.push({ ...postData, id: postId });

            if (!fetchedUsers[postData.userId]) {
              const userFetchPromise = getDoc(doc(db, "users", postData.userId)).then((userDoc) => {
                const userData = userDoc.data();
                fetchedUsers[postData.userId] = { ...userData, id: postData.userId };
              });
              userFetchPromises.push(userFetchPromise);
            }
          }
        });

        await Promise.all(userFetchPromises);

        setPostEmphasis(fetchedPostEmphasis);
        setUsers(fetchedUsers);

        setLoading(false);
        setTimeout(() => {
          setSkeleton(false);
        }, 800);

      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    };

    fetchPostsEmphasis();
  }, []);






  return (
    <div id="emphasis-posts">
      {skeleton ? (
        <>
          <div className="post-container large-post">
            <Skeleton height={450} />
            <Skeleton width={100} height={10} />
            <Skeleton height={20} />
          </div>
          <div className="grid-container">
            {[1, 2, 3].map((_, i) => (
              <div className="post-container small-post" key={i}>
                <Skeleton height={150} />
                <Skeleton width={100} height={10} />
                <Skeleton height={20} />
              </div>
            ))}
          </div>
        </>
      ) : postEmphasis.length > 0 ? (
        <>
          {postEmphasis.slice(0, 1).map((post, i) => (
            <Link to={`/post/${post.id}`} className="post-container large-post" key={i}>
              <div className="post">
                <div className="img-post">
                  <img src={post.postImg} alt="Imagem do post" />
                </div>
                <div className="post-content">
                  <div className="topic"><span>{post.topic}</span></div>
                  <h1>{post.title}</h1>
                </div>
              </div>
            </Link>
          ))}
          <div className="grid-container">
            {postEmphasis.slice(1).map((post, i) => (
              <Link to={`/post/${post.id}`} className="post-container small-post" key={i}>
                <div className="post">
                  <div className="img-post">
                    <img src={post.postImg} alt="Imagem do post" />
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
  );
};

export default EmphasisPosts;