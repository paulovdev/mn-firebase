import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/Config";
import { doc, updateDoc } from "firebase/firestore";
import "./Profile.scss";

const EditProfile = ({ getUserData }) => {
  const imgRef = useRef(null);

  // loading must be implemented in the button
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    userImg: "",
    bio: "",
  });

  const openFile = () => {
    imgRef.current.click();
  };

  // Atualiza o estado do formulário com os dados do usuário ao montar o componente
  useEffect(() => {
    if (getUserData) {
      setForm(getUserData);
    } else {
      setForm({ username: "", bio: "", userImg: "" });
    }
  }, [getUserData]);

  // Salva o formulário
  const saveForm = async (e) => {
    e.preventDefault();

    if (form.username === "" || form.bio === "") {
      toast.error("All inputs are required!!!");
      return;
    }

    setLoading(true);

    try {
      // Upload da imagem para o Firebase Storage, se uma imagem foi selecionada
      if (form.userImg) {
        const storageRef = ref(storage, `image/${form.userImg.name}`);
        await uploadBytes(storageRef, form.userImg);
        const imageUrl = await getDownloadURL(storageRef);
        // Atualiza o formulário com a URL da imagem
        setForm({ ...form, userImg: imageUrl });
      }

      // Atualiza os dados do usuário no Firestore
      const docRef = doc(db, "users", getUserData?.userId);
      await updateDoc(docRef, {
        bio: form.bio,
        username: form.username,
        userImg: form.userImg,
      });

      setLoading(false);
      toast.success("Profile has been updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={saveForm}>
      <div className="image-profile">
        <img
          width={50}
          src={form.userImg ? form.userImg : "/profile.jpg"}
          alt="profile-img"
          onClick={openFile}
        />
        <FaCamera onClick={openFile} />
      </div>

      <div className="input-wrapper">
        <input
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setForm({ ...form, userImg: e.target.files[0] });
            }
          }}
          accept="image/jpg, image/png, image/jpeg"
          ref={imgRef}
          type="file"
          hidden
        />

        <div className="label-wrapper">
          <label>Nome:</label>
          <input
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            value={form.username}
            type="text"
            placeholder="username..."
            maxLength={50}
            autoFocus
          />
        </div>

        <div className="label-wrapper">
          <label>Biografia:</label>
          <input
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            value={form.bio}
            type="text"
            placeholder="bio..."
            maxLength={160}
          />
        </div>
      </div>

      <label>E-mail:</label>
      <input type="text" readOnly value={getUserData?.email} />

      <p>
        Este endereço de e-mail está associado à sua conta M-blog. Atualizar seu
        e-mail de cobrança, vá para Configurações do espaço de trabalho →
        Planos.
      </p>
      {!loading ? (
        <button type="submit">Salvar</button>
      ) : (
        <button disabled type="submit">
          Salvando...
        </button>
      )}
    </form>
  );
};

export default EditProfile;
