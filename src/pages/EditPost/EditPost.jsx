import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import Loading from "../../components/Loading/Loading";
import Editor from "../../utils/Editor/Editor";
import { MdEdit } from "react-icons/md";
import { Blog } from "../../context/Context";
import "./EditPost.scss";

const EditPost = () => {
  const [loading, setLoading] = useState(false);
  const { updateData, title, setTitle, description, setDescription } = Blog();

  const { pathname } = useLocation();

  const postId = pathname.split("/")[2];

  const navigate = useNavigate();

  useEffect(() => {
    if (updateData) {
      setTitle(updateData.title);
      setDescription(updateData.description);
    }
  }, [updateData, setTitle, setDescription]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const ref = doc(db, "posts", postId);
      await updateDoc(ref, {
        title,
        description,
      });
      navigate(`/post/${postId}`);
      toast.success("A postagem foi atualizada");
    } catch (error) {
      console.error("Erro ao atualizar o documento: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="edit-post">
      <form onSubmit={handleEdit}>
        <input
          type="text"
          placeholder="Titulo do post aqui..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Editor
          placeholder="Edite o seu texto..."
          value={description}
          onChange={setDescription}
        />

        <button type="submit" className="btn" title="Salvar">
          <MdEdit
            style={{
              animation: !loading ? "" : "round 1s infinite",
            }}
            size={26}
            color="#000"
          />
        </button>
      </form>
    </section>
  );
};

export default EditPost;
