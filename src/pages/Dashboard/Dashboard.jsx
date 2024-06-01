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
import { IoIosArrowRoundBack } from "react-icons/io";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import "./Dashboard.scss";
import { Transition } from '../../utils/Transition/Transition';

const Dashboard = () => {
  const { currentUser, userLoading } = Blog();
  const [loading, setLoading] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "posts"),
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
        return () => unsubscribe();
      } catch (error) {
        console.log("Erro ao buscar postagens de usuários:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [currentUser.uid]);

  const handleDelete = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
    } catch (error) {
      console.error("Erro ao excluir postagem:", error);
      toast.error("Ocorreu um erro ao excluir a postagem");
    }
  };

  return (
    <>
      <section id="dashboard">
        <Link to="/" className="back">
          <IoIosArrowRoundBack size={32} />
          <p>Inicio</p>
        </Link>
        <h1>Dashboard</h1>
        <div className="border-bottom"></div>

        <div className="posts">
          {loading ? (
            Array(3).fill().map((_, index) => (
              <div className="post-dashboard" key={index}>
                <div className="background">
                  <Skeleton height={350} />
                </div>
                <div className="text">
                  <Skeleton width={250} height={10} />
                </div>
                <div className="actions">
                  <Skeleton width={40} height={30} />
                  <Skeleton width={40} height={30} />
                  <Skeleton width={40} height={30} />
                </div>
              </div>
            ))
          ) : userPosts.length === 0 ? (
            <div className="no-result">
              <p>nenhum post encontrado.</p>
              <Link to="/post/create">criar primeiro post</Link>
            </div>
          ) : (
            userPosts.map((post) => (
              <div className="post-dashboard" key={post.id}>
                <div className="background">
                  <img src={post.postImg} alt="" />
                </div>
                <div className="text">
                  <h1>{post.title}</h1>
                </div>
                <div className="actions">
                  <li>
                    <Link to={`/post/${post.id}`}>
                      <MdOutlineVisibility size={18} />
                    </Link>
                  </li>
                  <li>
                    <Link to={`/editPost/${post.id}`}>
                      <MdEdit size={18} />
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => handleDelete(post.id)}>
                      <MdDeleteOutline size={18} />
                    </button>
                  </li>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default Transition(Dashboard);
