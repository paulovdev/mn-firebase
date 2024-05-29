import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  const dropdownRef = useRef(null);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
      toast.success("O usuário foi desconectado");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setModal(false);
    }
  };

  const handleButtonClick = () => {
    setModal(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="user-modal">
        <div className="profile-image" onClick={() => setModal(!modal)}>
          <img src={getUserData?.userImg || "/profile.jpg"} alt="Profile" />
        </div>

        <motion.div
          ref={dropdownRef}
          className={`dropdown ${modal ? "" : "dropdown-active"}`}
          initial={{ opacity: modal ? 1 : 0 }}
          animate={{ opacity: modal ? 1 : 0 }}
          exit={{ opacity: modal ? 1 : 0 }}
        >
          <div className="text">
            <p>{firstWord}</p>
            <span>{getUserData?.email}</span>
          </div>

          <NavLink
            to={`/profile/${getUserData?.userId}`}
            className="profile-button"
            onClick={handleButtonClick}
          >
            Perfil
          </NavLink>

          <button onClick={() => { logout(); handleButtonClick(); }} className="profile-button">
            Sair
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default UserModal;
