import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { PiSignOut } from "react-icons/pi";
import { MdOutlineDashboardCustomize } from "react-icons/md";

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
          <div className="drop-profile">
            <img width={50} src={getUserData?.userImg || "/profile.jpg"} />
            <p>{firstWord}</p>
          </div>

          <NavLink to={`/profile/${getUserData?.userId}`}>
            <button
              onClick={() => {
                setOpenModal(!openModal);
              }}
            >
              <CiUser size={20} /> Meu Perfil
            </button>
          </NavLink>

          <NavLink to={`/dashboard`}>
            <button
              onClick={() => {
                setOpenModal(!openModal);
              }}
            >
              <MdOutlineDashboardCustomize size={20} /> Dashboard
            </button>
          </NavLink>

          {/* theme */}
          <Theme size={22} />

          <button onClick={logout}>
            <PiSignOut size={20} /> Sair
          </button>
        </div>
      </div>
    </>
  );
};

export default UserModal;
