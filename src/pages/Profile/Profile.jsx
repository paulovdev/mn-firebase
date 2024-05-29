import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import EditProfile from "./EditProfile";
import UserFollow from "../../components/UserFollow/UserFollow";
import { motion } from 'framer-motion';
import { doc, getDoc, collection, query, getDocs } from "firebase/firestore";
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
  const [followersCount, setFollowersCount] = useState(0);

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
          await fetchFollowersCount();
        }
      } catch (error) {
        toast.error(error.message);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const foundUser = allUsers.find((user) => user.id === userId);
    setUserData(foundUser);
  }, [allUsers, userId]);

  const fetchFollowersCount = async () => {
    try {
      const followersQuery = query(collection(db, "users", userId, "followers"));
      const querySnapshot = await getDocs(followersQuery);
      setFollowersCount(querySnapshot.size);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const { username, userImg, bio } = user;

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section id="my-profile">
          <div className="container">
            <div className="profile-photo">
              <img src={userImg} alt={username} />
              <div className="wrapper-text">
                <h1>{username}</h1>
                <p>{bio}</p>
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
                        />
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </div>
            <UserFollow userId={userId} followersCount={followersCount} />
          </div>
        </section>
      )}
    </>
  );
};

export default Transition(Profile);
