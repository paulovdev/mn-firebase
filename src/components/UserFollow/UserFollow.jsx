import React, { useState, useEffect } from "react";
import { deleteDoc, doc, setDoc, getDocs, collection, query } from "firebase/firestore";
import { Blog } from "../../context/Context";
import { db } from "../../firebase/Config";
import { toast } from "react-toastify";
import './UserFollow.scss'
import Loading from './../Loading/Loading';

const UserFollow = ({ userId }) => {
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = Blog();

  useEffect(() => {
    const fetchFollowers = async () => {
      setLoading(true);
      try {
        const followersQuery = query(
          collection(db, "users", userId, "followers")
        );
        const querySnapshot = await getDocs(followersQuery);
        const followers = querySnapshot.docs.map(doc => doc.data());

        setFollowersCount(followers.length);
        if (currentUser) {
          setIsFollowed(followers.some(follower => follower.userId === currentUser.uid));
        }
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchFollowers();
  }, [userId, currentUser]);

  const handleFollowToggle = async () => {

    if (!currentUser) {
      toast.error("Você precisa estar conectado para seguir este perfil.");
      return;
    }

    // Verificar se uma operação está em andamento
    if (isProcessing) {
      return;
    }

    setIsProcessing(true); // bloquear novas operações
    setLoading(true);
    try {

      const followRef = doc(db, "users", userId, "followers", currentUser.uid);
      if (isFollowed) {
        await deleteDoc(followRef);
        setFollowersCount(prevCount => prevCount - 1);
      } else {
        await setDoc(followRef, { userId: currentUser.uid });
        setFollowersCount(prevCount => prevCount + 1);
      }
      setIsFollowed(!isFollowed);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setIsProcessing(false); // liberar operações após a conclusão
    }
  };

  return (
    <div id="user-follow" onClick={handleFollowToggle}>
      {loading ? (<Loading />) :
        <p>Seguidores: {followersCount}</p>
      }
      {currentUser && isFollowed ? (
        <span>
          Deixar de seguir
        </span>
      ) : (
        <span>
          {currentUser ? "Seguir" : "Você precisa estar conectado para seguir"}
        </span>
      )}
    </div>
  );
};

export default UserFollow;
