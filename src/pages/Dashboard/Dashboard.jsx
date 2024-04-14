import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Blog } from "../../context/Context";
import {
  doc,
  deleteDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/Config";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Loading";
import "./Dashboard.scss";

const Dashboard = () => {
  const { currentUser, userLoading } = Blog();
  const [loading, setLoading] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const docCollection = "posts";

  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoading(true);
      try {
        const collectionRef = collection(db, docCollection);
        const q = query(
          collectionRef,
          where("userId", "==", currentUser.uid),
          orderBy("created", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const posts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserPosts(posts);
        });
        setLoading(false);
        return () => unsubscribe();
      } catch (error) {
        console.log("Error fetching user posts:", error);
      }
    };

    fetchUserPosts();
  }, [currentUser.uid]);

  const handleDelete = async (postId) => {
    try {
      await deleteDoc(doc(db, docCollection, postId));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("An error occurred while deleting the post");
    }
  };

  return (
    <>
      {userLoading ? (
        <Loading />
      ) : (
        <section id="dashboard">
          <div className="container">
            <h1>Dashboard</h1>
            <p>Gerencie seus posts</p>
          </div>

          <div className="posts">
            {userPosts.length === 0 ? (
              <>
                <div className="no-result">
                  <p>Nenhum post encontrado.</p>
                  <Link to="/post/create">Criar primeiro post</Link>
                </div>
              </>
            ) : (
              userPosts.map((post) => (
                <>
                  <div className="posts-dashboard" key={post.id}>
                    <div className="post-dashboard">
                      <div className="background">
                        <img src={post.postImg} alt="" />
                      </div>
                      <span>Título:</span>
                      <h1>{post.title}</h1>
                      <div className="actions">
                        <li>
                          <Link to={`/post/${post.id}`}>Ver</Link>
                        </li>
                        <li>
                          <Link to={`/editPost/${post.id}`}>Editar</Link>
                        </li>
                        <li>
                          <button onClick={() => handleDelete(post.id)}>
                            Deletar
                          </button>
                        </li>
                      </div>
                    </div>
                  </div>
                </>
              ))
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Dashboard;