
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import EditProfile from "./EditProfile";
import UserFollow from "../Post/Actions/UserFollow/UserFollow";

import useUserData from "../../hooks/useUserData";
import { motion, AnimatePresence } from "framer-motion";

import "./Profile.scss";
import { Blog } from "../../context/Context";

const Profile = () => {
  const { currentUser } = Blog();
  const { userId } = useParams();
  const { data: userData, isLoading, isError, error } = useUserData(userId);
  const [modal, setModal] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const isAuthor = currentUser && currentUser.uid === userId;

  const handleProfileUpdate = (updatedUser) => {
    // handle profile update logic
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <AnimatePresence mode='wait'>
          <motion.section id="my-profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            <div className="container">
              <div className="profile-photo">
                <img src={userData.userImg} alt={userData.username} />
                <div className="wrapper-text">
                  <h1>{userData.username}</h1>
                  <p>{userData.bio}</p>
                  {isAuthor && (
                    <>
                      <button onClick={() => setModal(!modal)}>
                        Editar perfil
                      </button>
                      {modal && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <EditProfile
                            onClick={() => setModal(!modal)}
                            getUserData={userData}
                            onProfileUpdate={handleProfileUpdate}
                          />
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="border-bottom"></div>
              <UserFollow userId={userId} followersCount={followersCount} />
            </div>
          </motion.section>
        </AnimatePresence>
      )}
    </>
  );
};

export default Profile;
