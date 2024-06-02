import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "react-query"; // Importe useMutation e useQueryClient do react-query
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/Config";
import { doc, updateDoc } from "firebase/firestore";
import "./Profile.scss";

const EditProfile = ({ getUserData, onClick, onProfileUpdate }) => {
  const imgRef = useRef(null);
  const queryClient = useQueryClient(); // Instancie o cliente de consulta
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

  // Defina a mutação para atualizar o perfil
  const updateProfileMutation = useMutation(async () => {
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

    return { // Retorne os novos dados do usuário após a atualização
      ...getUserData,
      bio: form.bio,
      username: form.username,
      userImg: imageUrl,
    };
  }, {
    onSuccess: (data) => {
      onProfileUpdate(data); // Atualize o estado do usuário após o sucesso da mutação
      onClick(); // Feche o modal após a atualização bem-sucedida
      queryClient.invalidateQueries('user'); // Invalidate a query para atualizar os dados do usuário na UI
    },
    onError: (error) => {
      toast.error("Erro ao atualizar perfil: " + error.message);
    },
  });

  const saveForm = (e) => {
    e.preventDefault();
    if (!form.username) {
      toast.error("Por favor, coloque seu nome.");
      return;
    }

    updateProfileMutation.mutate(); // Execute a mutação ao enviar o formulário
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

      <button id="save-button" type="submit" disabled={updateProfileMutation.isLoading}>
        {updateProfileMutation.isLoading ? "Salvando..." : "Salvar"}
      </button>
    </motion.form>
  );
};

export default EditProfile;
