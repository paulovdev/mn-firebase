import React from "react";
import { Link } from "react-router-dom";
import { Blog } from "../../context/Context";
import { MdOutlineVisibility, MdDeleteOutline, MdEdit } from "react-icons/md";
import { IoIosArrowRoundBack } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from 'react-query';
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { toast } from "react-toastify";

import "./Dashboard.scss";
import useDashboard from './../../hooks/useDashboard';

const Dashboard = () => {
  const { currentUser } = Blog();
  const { data: userPosts, isLoading, error } = useDashboard(currentUser.uid);
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation(
    async (postId) => {
      await deleteDoc(doc(db, "posts", postId));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userPosts');
        toast.success("Postagem excluída com sucesso!");
      },
      onError: () => {
        toast.error("Ocorreu um erro ao excluir a postagem");
      }
    }
  );

  const handleDelete = async (postId) => {
    if (window.confirm("Tem certeza que deseja excluir esta postagem?")) {
      try {
        await deletePostMutation.mutateAsync(postId);
      } catch (error) {
        console.error("Erro ao excluir postagem:", error);
      }
    }
  };


  return (
    <section id="dashboard">
      <Link to="/" className="back">
        <IoIosArrowRoundBack size={32} />
        <p>Inicio</p>
      </Link>
      <h1>Notificações</h1>
      <div className="border-bottom"></div>

      {isLoading && (
        <div className="posts">
          {Array(4)
            .fill()
            .map((_, index) => (
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
            ))}
        </div>
      )}

      {error && (<p>Erro ao carregar notificações</p>)}

      {!isLoading && !error &&
        <AnimatePresence mode='wait'>
          <motion.div className="posts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            {userPosts.length === 0 ? (
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
          </motion.div>
        </AnimatePresence>}
    </section>
  );
};

export default Dashboard;
