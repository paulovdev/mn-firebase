import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import EditProfile from "./EditProfile";
import UserFollow from "../../components/UserFollow/UserFollow";
import { motion } from 'framer-motion'
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Blog } from "../../context/Context";
import { db } from "../../firebase/Config";
import { toast } from "react-toastify";
import { Transition } from "../../utils/Transition/Transition";

import "./Profile.scss";

const Profile = () => {
  const { currentUser, allUsers } = Blog();
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [followersCount, setFollowersCount] = useState(0); // State para o número de seguidores

  const isAuthor = currentUser && currentUser.uid === userId;

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser(userData);
          // Após carregar os dados do usuário, buscar o número de seguidores
          await fetchFollowersCount();
        }
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const foundUser = allUsers.find((user) => user.id === userId);
    setUserData(foundUser);
  }, [allUsers, userId]);

  const { username, userImg, bio } = user;

  const fetchFollowersCount = async () => {
    setLoading(true);
    try {
      const followersQuery = query(
        collection(db, "users", userId, "followers")
      );
      const querySnapshot = await getDocs(followersQuery);
      const followers = querySnapshot.docs.map(doc => doc.data());
      setFollowersCount(followers.length);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {isAuthor ? (
            <section id="my-profile">
              <div className="container">
                <div className="profile-photo">
                  <img src={userImg} alt="" />
                  <div className="wrapper-text">
                    <h1>{username}</h1>
                    <p>{userData?.bio}</p>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setModal(!modal)}>
                      editar perfil
                    </motion.button>
                  </div>
                </div>
              </div>

              {modal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}>
                  <EditProfile
                    onClick={() => setModal(!modal)}
                    getUserData={userData}
                  />
                </motion.div>
              )}
              <UserFollow userId={userId} followersCount={followersCount} />
            </section>
          ) : (
            <section id="my-profile">
              <div className="container">
                <div className="profile-photo">
                  <div className="wrapper-text">
                    <img src={userImg} alt="" />
                    <h1>{username}</h1>
                    <p>{bio}</p>
                  </div>
                  <UserFollow userId={userId} followersCount={followersCount} />
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
};

export default Transition(Profile);
