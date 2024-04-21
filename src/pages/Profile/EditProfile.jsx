import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/Config";
import { doc, updateDoc } from "firebase/firestore";
import "./Profile.scss";

const EditProfile = ({ getUserData, modal, setModal }) => {
  const imgRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    userImg: "",
    bio: "",
  });

  const openFile = () => {
    imgRef.current.click();
  };

  useEffect(() => {
    if (getUserData) {
      setForm(getUserData);
    } else {
      setForm({ username: "", bio: "", userImg: "" });
    }
  }, [getUserData]);

  const saveForm = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      let imageUrl = form.userImg; // Initialize imageUrl with existing URL or empty string

      // Upload the image to Firebase Storage if a new image is selected
      if (form.userImg instanceof File) {
        const storageRef = ref(storage, `image/${form.userImg.name}`);
        await uploadBytes(storageRef, form.userImg);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Update the Firestore document with the image URL
      const docRef = doc(db, "users", getUserData?.userId);
      await updateDoc(docRef, {
        bio: form.bio,
        username: form.username,
        userImg: imageUrl, // Update userImg with the image URL
      });

      setLoading(false);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={saveForm} className={modal ? "active-modal-edit" : ""}>
      <div className="close-edit">
        <MdOutlineClose
          className="close-svg"
          onClick={() => setModal(!modal)}
          size={32}
        />
      </div>
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
            maxLength={16}
            inputMode="text"
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
            inputMode="text"
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
