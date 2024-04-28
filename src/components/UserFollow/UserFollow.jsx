import React, { useState, useEffect, useContext } from "react";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { Blog } from "../../context/Context";
import { db } from "../../firebase/Config";
import { toast } from "react-toastify";
import useSingleFetch from "../../hooks/useSingleFetch";

const UserFollow = ({ postId }) => {
  const { currentUser } = useContext(Blog) || {}; // Manejar caso donde Blog no está definido
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentUser) return; // Manejar el caso de currentUser es undefined
        const { data } = await useSingleFetch("posts", postId, "follow");
        const followed =
          data && data.some((item) => item.userId === currentUser.uid);
        setIsFollowed(followed);
        setFollowersCount(data.length);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchData();
  }, [postId, currentUser]);

  const handleFollowToggle = async () => {
    try {
      if (!currentUser) {
        // Aquí deberías manejar la autenticación de acuerdo a tu lógica de aplicación
        // Puedes redirigir al usuario a la página de inicio de sesión, mostrar un modal, etc.
        console.log(
          "El usuario no está autenticado. Manejar la autenticación aquí."
        );
        return;
      }
      const likeRef = doc(db, "posts", postId, "follow", currentUser.uid);
      if (isFollowed) {
        await deleteDoc(likeRef);
        setFollowersCount((prevCount) => prevCount - 1);
      } else {
        await setDoc(likeRef, { userId: currentUser.uid });
        setFollowersCount((prevCount) => prevCount + 1);
      }
      setIsFollowed(!isFollowed);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div onClick={handleFollowToggle}>
      <p>Seguidores: {followersCount}</p>
      {isFollowed ? <SlUserUnfollow size={32} /> : <SlUserFollow size={32} />}
    </div>
  );
};

export default UserFollow;
