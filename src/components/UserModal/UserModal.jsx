import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";

import { IoMdExit } from "react-icons/io";

import { TbLayoutDashboard } from "react-icons/tb";

import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/Config";
import "./UserModal.scss";

import { Blog } from "../../context/Context";

const UserModal = () => {
  const { currentUser, allUsers } = Blog();
  const getUserData = allUsers.find((user) => user.id === currentUser?.uid);
  const username = getUserData?.username;
  const firstWord = username ? username.split(" ").slice(0, 2).join(" ") : "";
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
      toast.success("O usuário foi desconectado");
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
          <div className="text">
            <p>{firstWord}</p>
            <span>Usuario</span>
          </div>
          <img src={getUserData?.userImg || "/profile.jpg"} />
        </div>

        <div className={`dropdown ${openModal ? "active" : ""}`}>
          <NavLink to={`/profile/${getUserData?.userId}`}>
            <button
              onClick={() => {
                setOpenModal(!openModal);
              }}
            >
              <FaRegUser size={16} color="#fff" /> Meu Perfil
            </button>
          </NavLink>

          <NavLink to={`/dashboard`}>
            <button
              onClick={() => {
                setOpenModal(!openModal);
              }}
            >
              <TbLayoutDashboard size={20} color="#fff" /> Dashboard
            </button>
          </NavLink>

          <button onClick={logout}>
            <IoMdExit size={20} color="#fff" /> Sair
          </button>
        </div>
      </div>
    </>
  );
};

export default UserModal;
