import React, { useState, useRef } from "react";
import Editor from "../../utils/Editor/Editor";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { db, storage } from "../../firebase/Config";
import { addDoc, collection } from "firebase/firestore";
import { Blog } from "../../context/Context";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { MdAddPhotoAlternate } from "react-icons/md";
import { FaSave } from "react-icons/fa";

import ScrollTop from "../../utils/ScrollTop/ScrollTop";
import "./CreatePost.scss";

const CreatePost = () => {
  const [category, setCategory] = useState({
    label: "Sem Categoria",
    color: "#0055ff",
  });
  const imageRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
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
      if (!preview.title || !preview.photo || !desc) {
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
        category: category.label,
        color: category.color,
        desc,
        tags,
        postImg: url,
        created: new Date().toISOString(),
      });

      toast.success("Post publicado com sucesso!");
      navigate(`/`);
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error(
        "Ocorreu um erro ao publicar o post. Por favor, tente novamente mais tarde."
      );
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
        <input
          onChange={(e) => {
            setImageUrl(URL.createObjectURL(e.target.files[0]));
            setPreview({ ...preview, photo: e.target.files[0] });
          }}
          ref={imageRef}
          type="file"
          hidden
        />

        <div className="image-select">
          <button type="button" className="prf-file" onClick={handleClick}>
            {!imageUrl && <MdAddPhotoAlternate size={26} />}
            <p>{imageUrl ? "Imagem carregada..." : "Adicione uma capa"}</p>
          </button>

          <select
            value={category.label} 
            onChange={(e) => {
              const selectedCategory = categories.find(
                (category) => category.label === e.target.value
              );
              setCategory(selectedCategory);
            }}
          >
            {categories.map((category) => (
              <option key={category.label} value={category.label}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Titulo do post aqui..."
          value={preview.title}
          minLength={6}
          onChange={(e) => setPreview({ ...preview, title: e.target.value })}
        />
        <Editor value={desc} onChange={setDesc} />

        <button
          type="submit"
          className="btn"
          disabled={uploadingImage || !preview.title || !preview.photo || !desc}
        >
          <FaSave
            style={{
              animation: !loading ? "" : "round 1s infinite",
            }}
            size={26}
            color="#fff"
          />
        </button>
      </form>
      <ScrollTop />
    </section>
  );
};

export default CreatePost;

const categories = [
  { label: "Sem Categoria", color: "#34495e" }, // Cinza Azulado
  { label: "Tecnologia", color: "#3498db" }, // Azul Claro
  { label: "Filmes e Series", color: "#8855ff" }, // Roxo
  { label: "Programacao", color: "#2ecc71" }, // Verde Esmeralda
  { label: "Historias", color: "#f39c12" }, // Laranja
  { label: "Alimentação", color: "#e74c3c" }, // Vermelho
  { label: "Negócios", color: "#1abc9c" }, // Azul Claro
];
