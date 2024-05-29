import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/Config";
import { doc, updateDoc } from "firebase/firestore";
import "./Profile.scss";

const EditProfile = ({ getUserData, onClick }) => {
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
    } catch (error) {
      toast.error(error.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (

    <motion.form onSubmit={saveForm}
    >
      <div className="close-edit">
        <MdOutlineClose
          className="close-svg"
          onClick={onClick}
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



      <input
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        value={form.username}
        type="text"
        placeholder="Seu nome"
        minLength={6}
        maxLength={24}
        inputMode="text"
      />

      <textarea
        onChange={(e) => setForm({ ...form, bio: e.target.value })}
        value={form.bio}
        type="text"
        placeholder="Biografia"
        rows={5}
        maxLength={150}
        inputMode="text"
      />

      <input type="text" id="disabled-input" disabled readOnly value={getUserData?.email} />

      {!loading ? (
        <button id="save-button" type="submit">Salvar</button>
      ) : (
        <button id="save-button" disabled type="submit">
          Salvando...
        </button>
      )}
    </motion.form>

  );
};

export default EditProfile;
