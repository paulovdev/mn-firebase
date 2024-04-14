import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { toast } from "react-toastify"; 
/* import ReactQuill from "react-quill"; */
import { Blog } from "../../context/Context";
import "./EditPost.scss";

const EditPost = () => {
  const {
    updateData,
    title,
    setTitle,
    description,
    setDescription,
    userLoading,
  } = Blog();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { postId } = useParams();

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const ref = doc(db, "posts", postId);
      await updateDoc(ref, {
        title,
        desc: description,
      });
      console.log(description);

      navigate(`/post/${postId}`);
      toast.success("Post atualizado com sucesso!");
    } catch (error) {
      toast.error("Ocorreu algum erro: " + error.message); // Corrija a concatenação do erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (updateData) {
      setTitle(updateData.title);
      setDescription(updateData.description);
    }
  }, [updateData]);

  return (
    <>
      {userLoading && <Loading />}
      <section id="edit-post">
        <div className="container">
          <h1>Editar post</h1>
          <p>Altere os dados do post como desejar</p>
        </div>

        <form onSubmit={handleEdit}>
          <label>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Conteúdo:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {/*           <ReactQuill
            theme="snow"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          /> */}

          {!loading && <button type="submit">Editar</button>}
          {loading && (
            <button disabled type="submit">
              Editando post...
            </button>
          )}
        </form>
      </section>
    </>
  );
};

export default EditPost;

{
  /*        */
}
