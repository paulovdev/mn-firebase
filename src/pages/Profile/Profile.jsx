import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import EditProfile from "./EditProfile";
import UserFollow from "../Post/Actions/UserFollow/UserFollow";
import { motion } from 'framer-motion';
import { doc, getDoc, collection, query, getDocs } from "firebase/firestore";
import { Blog } from "../../context/Context";
import { db } from "../../firebase/Config";
import { toast } from "react-toastify";
import { Transition } from "../../utils/Transition/Transition";
import "./Profile.scss";

const Profile = () => {
  const { currentUser } = Blog();
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
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
        } else {
          setUser(null);
          toast.error("User does not exist.");
        }
      } catch (error) {
        toast.error(error.message);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [userId]);

  const fetchFollowersCount = async () => {
    try {
      const followersQuery = query(collection(db, "users", userId, "followers"));
      const querySnapshot = await getDocs(followersQuery);
      setFollowersCount(querySnapshot.size);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
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
                          getUserData={user}
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
        </section>
      )}
    </>
  );
};

export default Transition(Profile);