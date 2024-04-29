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
import { MdOutlineVisibility } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";

import { MdEdit } from "react-icons/md";
import Loading from "../../components/Loading/Loading";
import "./Dashboard.scss";
import { Transition } from '../../utils/Transition/Transition'

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
        console.log("Erro ao buscar postagens de usuários:", error);
      }
    };

    fetchUserPosts();
  }, [currentUser.uid]);

  const handleDelete = async (postId) => {
    try {
      await deleteDoc(doc(db, docCollection, postId));
      toast.success("Postagem excluída com sucesso");
    } catch (error) {
      console.error("Erro ao excluir postagem:", error);
      toast.error("Ocorreu um erro ao excluir a postagem");
    }
  };

  return (
    <>
      {userLoading && loading ? (
        <Loading />
      ) : (
        <section id="dashboard">
          <div className="container">
            <h1>dashboard</h1>
            <p>gerencie seus posts</p>
          </div>

          <div className="posts">
            {userPosts.length === 0 ? (
              <>
                <div className="no-result">
                  <p>nenhum post encontrado.</p>
                  <Link to="/post/create">criar primeiro post</Link>
                </div>
              </>
            ) : (
              userPosts.map((post) => (
                <>
                  <div className="post-dashboard" key={post.id}>
                    <div className="background">
                      <img src={post.postImg} alt="" />
                    </div>

                    <div className="text">
                      <span>título:</span>
                      <h1>{post.title}</h1>
                    </div>

                    <div className="actions">
                      <li>
                        <Link to={`/post/${post.id}`}>
                          <MdOutlineVisibility size={24} />
                        </Link>
                      </li>
                      <li>
                        <Link to={`/editPost/${post.id}`}>
                          <MdEdit size={24} />
                        </Link>
                      </li>
                      <li>
                        <button onClick={() => handleDelete(post.id)}>
                          <MdDeleteOutline color="#ffffff" size={24} />
                        </button>
                      </li>
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

export default Transition(Dashboard);
