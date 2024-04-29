import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase/Config";
import Loading from "../../components/Loading/Loading";
import Editor from "../../utils/Editor/Editor";
import { MdEdit, MdAddPhotoAlternate } from "react-icons/md";
import { Blog } from "../../context/Context";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import "./EditPost.scss";
import { Transition } from '../../utils/Transition/Transition'

const EditPost = () => {
  const [loading, setLoading] = useState(false);
  const { updateData, title, setTitle, desc, setDesc, color, img, setImg } = Blog();

  const { pathname } = useLocation();
  const postId = pathname.split("/")[2];
  const navigate = useNavigate();
  const imageRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState({
    title: title,
    photo: img,
  });

  const [selectedColor, setSelectedColor] = useState(null);
  const colors = ["#A6A6A6", "#737373", "#404040", "#262626", "#0D0D0D"];
  console.log(selectedColor)

  useEffect(() => {
    if (updateData) {
      setTitle(updateData.title);
      setDesc(updateData.desc);
      setSelectedColor(updateData.color);
      setImg(updateData.postImg);
    }
  }, [updateData, setTitle, setDesc, setSelectedColor, setImg]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const postRef = doc(db, "posts", postId);

      let url = img;

      if (preview.photo) {
        const storageRef = ref(storage, `image/${preview.photo.name}`);
        setUploadingImage(true);
        await uploadBytes(storageRef, preview.photo);
        url = await getDownloadURL(storageRef);
        setUploadingImage(false);
      }

      await updateDoc(postRef, {
        title,
        desc,
        color: selectedColor,
        postImg: url,
      });

      navigate(`/post/${postId}`);
      toast.success("A postagem foi atualizada");
    } catch (error) {
      console.error("Erro ao atualizar o documento: ", error);
      toast.error("Ocorreu um erro ao atualizar o post. Por favor, tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    imageRef.current.click();
  };



  return (
    <section id="edit-post">
      <form onSubmit={handleEdit}>

        <div className="image-select">
          <button type="button" className="prf-file" onClick={handleClick}>
            {!imageUrl && <MdAddPhotoAlternate size={26} />}
            <p>{imageUrl ? "Imagem carregada..." : "Adicione uma capa"}</p>
          </button>

          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            title="Escolher cor"
            style={{ backgroundColor: selectedColor }}
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
          placeholder="Titulo do post aqui..."
          minLength={6}
          maxLength={65}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          placeholder="Edite o seu texto..."
          value={desc}
          onChange={setDesc}
        />

        <button type="submit" className="btn" title="Salvar">
          <div className="icon-content">
            <MdEdit
              style={{
                animation: !loading ? "" : "round 1s infinite",
              }}
              size={26}
              color="#000"
            />
          </div>
          <p>{!loading ? "Editar" : "Editando..."}</p>
        </button>
      </form>
    </section>
  );
};

export default Transition(EditPost);
