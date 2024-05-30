import React, { useState, useEffect } from "react";
import { deleteDoc, doc, setDoc, getDocs, collection, query } from "firebase/firestore";
import { Blog } from "../../../../context/Context";
import { db } from "../../../../firebase/Config";
import { toast } from "react-toastify";
import Skeleton from 'react-loading-skeleton';

import './UserFollow.scss'

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
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [userId, currentUser]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Você precisa estar conectado para seguir este perfil.");
      return;
    }

    if (isProcessing) {
      return;
    }

    setIsProcessing(true);
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
      setIsProcessing(false);
    }
  };

  return (
    <div id="user-follow" onClick={handleFollowToggle}>
      {loading ? (
        <>
          <Skeleton width={200} height={10} />
          <Skeleton width={200} height={30} />
        </>
      ) : (
        <>
          <p>{followersCount} Seguidores</p>
          {currentUser && isFollowed ? (
            <button>
              Deixar de seguir
            </button>
          ) : (
            <button>
              {currentUser ? "Seguir" : "Você precisa estar conectado para seguir"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default UserFollow;
