import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { toast } from "react-toastify";
import { Blog } from "../../context/Context";
import { readTime } from "../../utils/ReadTime";
import FormatDate from "../../utils/FormatDate";
import Loading from "../Loading/Loading";
import "./PostsAll.scss";

const PostsAll = () => {
  const { postLoading } = Blog();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [lastDoc, setLastDoc] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (loadMore = false) => {
    setLoading(true);
    setIsLoadingMore(loadMore);
    try {
      const postsCollection = collection(db, "posts");
      const postsQuery = query(
        postsCollection,
        orderBy("created", "desc"),
        limit(3),
        ...(lastDoc ? [startAfter(lastDoc)] : [])
      );
      const postsSnapshot = await getDocs(postsQuery);
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

      setPosts((prevPosts) => loadMore ? [...prevPosts, ...fetchedPosts] : fetchedPosts);
      setUsers((prevUsers) => ({ ...prevUsers, ...fetchedUsers }));
      setLastDoc(postsSnapshot.docs[postsSnapshot.docs.length - 1]);
      setLoading(false);
      setIsLoadingMore(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const lastPostElementRef = useCallback(node => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && lastDoc) {
        fetchPosts(true);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoadingMore, lastDoc]);

  return (
    <>
      {postLoading && loading ? (
        <Loading />
      ) : (
        <>
          <div id="posts-all">
            {posts.length > 0 ? (
              posts.map((post, i) => {
                const user = users[post.userId];
                return (
                  <Link to={`/post/${post.id}`} className="post-container" key={i}>
                    <div className="post-left-content">
                      <img src={post.postImg} alt="postImg" />
                    </div>
                    <div className="post-right-content">

                      <span className="topic">{post.topic}</span>
                      <div className="topic-profile-container">
                        {user && (
                          <div className="profile-content">
                            <img src={user.userImg} alt="" />

                            <div className="profile-text-wrapper">

                              <p>{user.username}</p>
                              <span>|</span>
                              <p>
                                <FormatDate date={post.created} />
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      <h1>{post.title}</h1>
                      <div
                        className="body-posts"
                        dangerouslySetInnerHTML={{
                          __html: post.desc.slice(0, 250),
                        }}
                      ></div>
                      <span>{readTime({ __html: post.desc })} min de leitura</span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p>Sem posts disponíveis</p>
            )}
          </div>
          {isLoadingMore && <div className="loading-container"><div className="loading"></div></div>}
          <div ref={lastPostElementRef}></div>
        </>
      )}
    </>
  );
};

export default PostsAll;
