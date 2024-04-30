import React, { useState, useEffect } from "react";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import { deleteDoc, doc, setDoc, getDocs, collection, query } from "firebase/firestore";
import { Blog } from "../../context/Context";
import { db } from "../../firebase/Config";
import { toast } from "react-toastify";

const UserFollow = ({ postId }) => {
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Estado para controlar se uma operação está em andamento
  const { currentUser } = Blog();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const followersQuery = query(
          collection(db, "posts", postId, "follow")
        );
        const querySnapshot = await getDocs(followersQuery);
        const followers = querySnapshot.docs.map(doc => doc.data());

        setFollowersCount(followers.length);
        if (currentUser) {
          setIsFollowed(followers.some(follower => follower.userId === currentUser.uid));
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchFollowers();
  }, [postId, currentUser]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Você precisa estar conectado para seguir este perfil.");
      return;
    }

    // Verificar se uma operação está em andamento
    if (isProcessing) {
      return;
    }

    setIsProcessing(true); // Bloquear novas operações

    try {
      const followRef = doc(db, "posts", postId, "follow", currentUser.uid);
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
      setIsProcessing(false); // Liberar operações após a conclusão
    }
  };

  return (
    <div onClick={handleFollowToggle}>
      <p>Seguidores: {followersCount}</p>
      {isFollowed || !currentUser ? (
        <SlUserUnfollow size={32} />
      ) : (
        <SlUserFollow size={32} />
      )}
    </div>
  );
};

export default UserFollow;
