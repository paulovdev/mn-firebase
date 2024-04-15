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
  const [category, setCategory] = useState("Sem Categoria");
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
        category: category, // Atualiza a categoria para a selecionada
        desc,
        tags,
        postImg: url,
        created: new Date().toISOString(),
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

        <div className="input-wrapper">

          <div className="label-wrapper">
            <label>Categoria:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Sem Categoria">Sem Categoria</option>
              <option value="Tecnologia e Gadgets">Tecnologia e Gadgets</option>
              <option value="Viagens e Aventuras">Viagens e Aventuras</option>
              <option value="Moda e Estilo de Vida">
                Moda e Estilo de Vida
              </option>
              <option value="Saúde e Bem-Estar">Saúde e Bem-Estar</option>
              <option value="Alimentação e Nutrição">
                Alimentação e Nutrição
              </option>
              <option value="Negócios e Empreendedorismo">
                Negócios e Empreendedorismo
              </option>
              <option value="Arte e Cultura">Arte e Cultura</option>
              <option value="Educação e Aprendizado">
                Educação e Aprendizado
              </option>
              <option value="Esportes e Fitness">Esportes e Fitness</option>
              <option value="Meio Ambiente e Sustentabilidade">
                Meio Ambiente e Sustentabilidade
              </option>
            </select>
            </div>

            <div className="label-wrapper">
              <label>Upload de Imagem:</label>
              <button type="button" className="prf-file" onClick={handleClick}>
                {!imageUrl && <GrGallery size={22} />}
              </button>
            </div>



        
        </div>

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
