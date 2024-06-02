import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import EditProfile from "./EditProfile";
import UserFollow from "../Post/Actions/UserFollow/UserFollow";
import { motion } from 'framer-motion';
import { useQuery } from 'react-query'; // Importe useQuery do react-query
import { doc, getDoc, collection, query, getDocs } from "firebase/firestore";
import { Blog } from "../../context/Context";
import { db } from "../../firebase/Config";
import { toast } from "react-toastify";

import "./Profile.scss";

const Profile = () => {
  const { currentUser } = Blog();
  const { userId } = useParams();
  const [modal, setModal] = useState(false);

  const isAuthor = currentUser && currentUser.uid === userId;

  // Use useQuery para buscar os dados do usuário
  const { isLoading, isError, data: user } = useQuery(['user', userId], async () => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      throw new Error("User does not exist.");
    }
  });

  // Use useQuery para buscar o número de seguidores
  const { data: followersCount } = useQuery(['followers', userId], async () => {
    const followersQuery = query(collection(db, "users", userId, "followers"));
    const querySnapshot = await getDocs(followersQuery);
    return querySnapshot.size;
  });

  const handleProfileUpdate = (updatedUser) => {
    // Aqui você pode atualizar o estado do usuário após a edição
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Error: {isError.message}</div>;

  const { username, userImg, bio } = user;

  return (
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
  );
};

export default Profile;
