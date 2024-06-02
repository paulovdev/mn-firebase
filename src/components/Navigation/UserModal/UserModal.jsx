import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Blog } from '../../../context/Context';

import useLogout from '../../../hooks/useLogout';
import './UserModal.scss';

const UserModal = () => {
  const { currentUser, allUsers } = Blog();
  const getUserData = allUsers.find((user) => user.id === currentUser?.uid);
  const username = getUserData?.username;
  const firstWord = username ? username.split(' ').slice(0, 2).join(' ') : '';
  const [modal, setModal] = useState(false);
  const dropdownRef = useRef(null);

  const { mutate: logout, isLoading } = useLogout();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setModal(false);
    }
  };

  const handleButtonClick = () => {
    setModal(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="user-modal">
        <div className="profile-image" onClick={() => setModal(!modal)}>
          <img src={getUserData?.userImg || '/profile.jpg'} alt="Profile" />
        </div>

        <motion.div
          ref={dropdownRef}
          className={`dropdown ${modal ? '' : 'dropdown-active'}`}
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

          <button onClick={() => { logout(); handleButtonClick(); }} className="profile-button" disabled={isLoading}>
            Sair
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default UserModal;
