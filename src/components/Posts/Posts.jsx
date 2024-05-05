import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore"; // Adicionando 'query' e 'orderBy'
import { db } from "../../firebase/Config";
import { toast } from "react-toastify";
import { Blog } from "../../context/Context";
import { readTime } from "../../utils/ReadTime";
import FormatDate from "../../utils/FormatDate";
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
        const postsSnapshot = await getDocs(query(postsCollection, orderBy("created", "desc")));
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
        <>
          <div id="posts">
            {posts.length > 0 ? (
              posts.map((post, i) => {
                const user = users[post.userId];
                return (
                  <Link to={`/post/${post.id}`} className="post-container" key={i}>

                    <div className="post-left-content">
                      <img src={post.postImg} alt="postImg" />
                    </div>

                    <div className="post-right-content">
                      <div className="topic"><span>{post.topic}</span></div>
                      <h1>{post.title}</h1>
                      <div
                        className="body-posts"
                        dangerouslySetInnerHTML={{
                          __html: post.desc.slice(0, 250),
                        }}
                      ></div>
                      <div className="topic-profile-container">

                        {user && (
                          <div className="profile-content">
                            <img src={user.userImg} alt="" />


                            <div className="profile-text-wrapper">
                              <p>
                                {user.username}
                              </p>
                              
                              <div className="profile-date-text-wrapper">
                                <span>
                                  <FormatDate date={post.created} />
                                </span>
                                <span>{readTime({ __html: post.desc })} min de leitura</span>
                              </div>
                            </div>


                          </div>
                        )}
                      </div>
                    </div>

                  </Link>
                );
              })
            ) : (
              <p>Sem posts disponíveis</p>
            )}
          </div>
        </>
      )
      }
    </>
  );
};

export default Posts;
