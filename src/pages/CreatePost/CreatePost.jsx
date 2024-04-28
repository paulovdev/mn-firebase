import React, { useState, useRef } from "react";
import Editor from "../../utils/Editor/Editor";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db, storage } from "../../firebase/Config";
import { addDoc, collection } from "firebase/firestore";
import { Blog } from "../../context/Context";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { MdAddPhotoAlternate } from "react-icons/md";
import { FaSave } from "react-icons/fa";

import ScrollTop from "../../utils/ScrollTop/ScrollTop";
import "./CreatePost.scss";
import Transition from "../../utils/Transition/Transition";

const CreatePost = () => {
  const imageRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [desc, setDesc] = useState("");
  const { currentUser } = Blog();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState({
    title: "",
    photo: "",
  });

  const [selectedColor, setSelectedColor] = useState(null);
  const colors = ["#A6A6A6", "#737373", "#404040", "#262626", "#0D0D0D"];

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
        color: selectedColor,
        desc,
        postImg: url,
        created: new Date().toISOString(),
      });

      toast.success("Post publicado com sucesso!");
      navigate(`/`);
    } catch (error) {
      console.error("erro ao adicionar documento: ", error);
      toast.error(
        "ocorreu um erro ao publicar o post. Por favor, tente novamente mais tarde."
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
      <form onSubmit={handleSubmit}>

        <div className="image-select">
          <button type="button" className="prf-file" onClick={handleClick}>
            {!imageUrl && <MdAddPhotoAlternate size={26} />}
            <p>{imageUrl ? "imagem carregada..." : "adicione uma capa"}</p>
          </button>

          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            title="escolher cor"
            style={{ background: selectedColor }}
          >
            {colors.map((color, index) => (
              <option key={index} value={color} style={{ backgroundColor: color }}>
                {color}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="titulo do post aqui..."
          value={preview.title}
          minLength={6}
          onChange={(e) => setPreview({ ...preview, title: e.target.value })}
        />

        <input
          onChange={(e) => {
            setImageUrl(URL.createObjectURL(e.target.files[0]));
            setPreview({ ...preview, photo: e.target.files[0] });
          }}
          ref={imageRef}
          type="file"
          hidden
        />

        <Editor
          placeholder="escreva sobre o que quiser e compartilhe o seu conhecimento..."
          value={desc}
          onChange={setDesc}
        />


        <button
          type="submit"
          className="btn"
          title="Salvar"
          disabled={uploadingImage || !preview.title || !preview.photo || !desc}
        >
          <div className="icon-content">
            <FaSave
              style={{
                animation: !loading ? "" : "round 1s infinite",
              }}
              size={26}
              color="#000"
            />
          </div>
          <p>{!loading ? "salvar" : "salvando..."}</p>
        </button>
      </form>
      <ScrollTop />
    </section>
  );
};

export default Transition(CreatePost);
