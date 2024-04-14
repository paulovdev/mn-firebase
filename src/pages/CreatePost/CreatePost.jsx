import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import TagsInput from "react-tagsinput";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db, storage } from "../../firebase/Config";
import { addDoc, collection } from "firebase/firestore";
import { Blog } from "../../context/Context";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { GrGallery } from "react-icons/gr";

import "./CreatePost.scss";

const CreatePost = () => {
  const imageRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState([]);
  const [desc, setDesc] = useState("");
  const { currentUser } = Blog();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState({
    title: "",
    photo: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (preview.title === "" || desc === "" || tags.length === 0) {
        toast.error("Todos os campos são obrigatórios!!!");
        return;
      }

      if (preview.title.length < 6) {
        toast.error("O título deve ter pelo menos 6 letras");
        return;
      }

      const collections = collection(db, "posts");

      let url = "";
      if (preview.photo) {
        const storageRef = ref(storage, `image/${preview.photo.name}`);
        setUploadingImage(true);
        await uploadBytes(storageRef, preview.photo);
        url = await getDownloadURL(storageRef);
        setUploadingImage(false);
      }

      await addDoc(collections, {
        userId: currentUser?.uid,
        title: preview.title,
        desc,
        tags,
        postImg: url,
        created: new Date().toISOString(),
        pageViews: 0,
      });
      toast.success("O post foi adicionado com sucesso");
      navigate("/");
      setPreview({
        title: "",
        photo: "",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    imageRef.current.click();
  };

  return (
    <section id="create-post">
      <div className="container">
        <h1>Criar post</h1>
        <p>Escreva sobre o que quiser e compartilhe o seu conhecimento</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <div className="label-wrapper">
            <label>Título:</label>
            <input
              type="text"
              placeholder="Title"
              value={preview.title}
              onChange={(e) =>
                setPreview({ ...preview, title: e.target.value })
              }
            />
          </div>

          <div className="label-wrapper">
            <label>Tags:</label>
            <TagsInput
              value={tags}
              onChange={setTags}
              inputProps={{ placeholder: "Adicione tags" }}
            />
          </div>
        </div>

        <label>Conteúdo:</label>
        <ReactQuill theme="snow" value={desc} onChange={setDesc} />

        <label>Upload de Imagem:</label>
        <button type="button" className="prf-file" onClick={handleClick}>
          {!imageUrl && <GrGallery size={22} />}
        </button>
        {imageUrl && (
          <img src={imageUrl} alt="Preview" style={{ width: "100px" }} />
        )}
        <input
          onChange={(e) => {
            setImageUrl(URL.createObjectURL(e.target.files[0]));
            setPreview({ ...preview, photo: e.target.files[0] });
          }}
          ref={imageRef}
          type="file"
          hidden
        />

        <button
          type="submit"
          className="btn"
          disabled={
            uploadingImage || !preview.title || !preview.photo || !desc || !tags
          }
        >
          {uploadingImage
            ? "Carregando foto..."
            : loading
            ? "Criando post..."
            : "Criar post"}
        </button>
      </form>
    </section>
  );
};

export default CreatePost;
