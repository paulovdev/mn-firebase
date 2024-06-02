import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { motion } from "framer-motion";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/Config";
import { doc, updateDoc } from "firebase/firestore";
import "./Profile.scss";

const EditProfile = ({ getUserData, onClick, onProfileUpdate }) => {
  const imgRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    userImg: "",
    bio: "",
  });

  useEffect(() => {
    if (getUserData) {
      setForm(getUserData);
    } else {
      setForm({ username: "", bio: "", userImg: "" });
    }
  }, [getUserData]);

  const openFile = () => {
    imgRef.current.click();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm({ ...form, userImg: e.target.files[0] });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const saveForm = async (e) => {
    e.preventDefault();
    if (!form.username) {
      toast.error("Por favor, coloque seu nome.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = form.userImg;
      if (form.userImg instanceof File) {
        const storageRef = ref(storage, `image/${form.userImg.name}`);
        await uploadBytes(storageRef, form.userImg);
        imageUrl = await getDownloadURL(storageRef);
      }

      const docRef = doc(db, "users", getUserData?.userId);
      await updateDoc(docRef, {
        bio: form.bio,
        username: form.username,
        userImg: imageUrl,
      });

      toast.success("Perfil atualizado com sucesso!");

      // Notify the parent component about the profile update
      onProfileUpdate({
        ...getUserData,
        bio: form.bio,
        username: form.username,
        userImg: imageUrl,
      });

      onClick(); // Close the modal
    } catch (error) {
      toast.error("Erro ao atualizar perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form onSubmit={saveForm} className="edit-profile-form">
      <div className="close-edit">
        <MdOutlineClose className="close-svg" onClick={onClick} size={32} />
      </div>

      <div className="image-profile" onClick={openFile} role="button" tabIndex={0}>
        <img
          width={50}
          src={form.userImg instanceof File ? URL.createObjectURL(form.userImg) : form.userImg || "/profile.jpg"}
          alt="profile-img"
        />
        <FaCamera />
      </div>

      <input
        onChange={handleImageChange}
        accept="image/jpg, image/png, image/jpeg"
        ref={imgRef}
        type="file"
        hidden
      />

      <input
        name="username"
        onChange={handleInputChange}
        value={form.username}
        type="text"
        placeholder="Seu nome"
        minLength={6}
        maxLength={24}
        inputMode="text"
      />

      <textarea
        name="bio"
        onChange={handleInputChange}
        value={form.bio}
        type="text"
        placeholder="Biografia"
        rows={5}
        maxLength={150}
        inputMode="text"
      />

      <input
        type="text"
        id="disabled-input"
        disabled
        readOnly
        value={getUserData?.email}
      />

      <button id="save-button" type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </motion.form>
  );
};

export default EditProfile;
