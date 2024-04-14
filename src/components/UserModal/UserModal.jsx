import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

import { FaPowerOff } from "react-icons/fa";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase/Config";
import "./UserModal.scss";

import { Blog } from "../../context/Context";
import Theme from "../../components/Theme/Theme";

const UserModal = () => {
  const { currentUser, allUsers } = Blog();
  const getUserData = allUsers.find((user) => user.id === currentUser?.uid);
  const username = getUserData?.username; // Supondo que getUserData é um objeto contendo informações do usuário
  const firstWord = username ? username.split(" ")[0] : "";
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
      toast.success("User has be logged out");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="user-modal">
        <div
          className="profile-image"
          onClick={() => {
            setOpenModal(!openModal);
          }}
        >
          <img src={getUserData?.userImg || "/profile.jpg"} />
        </div>

        <div className={`dropdown ${openModal ? "active" : ""}`}>
          <img width={50} src={getUserData?.userImg || "/profile.jpg"} />
          <p>{firstWord}</p>
          <p>{getUserData?.email}</p>
          <Link to={`/profile/${getUserData?.userId}`}>
            <button
              onClick={() => {
                setOpenModal(!openModal);
              }}
            >
              <FaUser size={20} /> Meu Perfil
            </button>
          </Link>
          <Theme size={22} />
          <button onClick={logout}>
            <FaPowerOff size={20} /> Sair
          </button>
        </div>
      </div>
    </>
  );
};

export default UserModal;
