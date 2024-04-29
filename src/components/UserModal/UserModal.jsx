import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LuUser } from "react-icons/lu";
import { motion } from "framer-motion";
import { TbLogout2 } from "react-icons/tb";

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
  const navigate = useNavigate();

  const [modal, setModal] = useState(false);
  const close = () => setModal(false);
  const open = () => setModal(true);


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
          onClick={() => (modal ? close() : open())}
        >
          <img src={getUserData?.userImg || "/profile.jpg"} />
        </div>

        <motion.div
          className={`dropdown ${modal ? "dropdown-active" : ""}`}
          initial={{ opacity: modal ? 1 : 0 }}
          animate={{ opacity: modal ? 0 : 1 }}
          exit={{ opacity: modal ? 1 : 0 }}

        >
          <div className="text">
            <p>{firstWord}</p>
            <span>{getUserData?.email}</span>
          </div>


          <NavLink to={`/profile/${getUserData?.userId}`} className="profile-button">

            <LuUser />
            Perfil

          </NavLink>

          <div className="border-top" style={{ width: "100%", height: "1px", background: "#ffffff22" }}></div>


          <button onClick={logout} className="profile-button">
            <TbLogout2 />
            Sair
          </button>


        </motion.div>
      </div >
    </>
  );
};

export default UserModal;
