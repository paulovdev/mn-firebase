import { onAuthStateChanged } from "firebase/auth";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { auth, db } from "../firebase/Config";
import Loading from "../components/Loading/Loading";
import { collection, onSnapshot, query } from "firebase/firestore";
import useFetch from "../hooks/useFetch";

const BlogContext = createContext();

const Context = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [authModel, setAuthModel] = useState(false);

  const [updateData, setUpdateData] = useState({});
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState("#f3f175");
  const [img, setImg] = useState("#f3f175");
  const [publish, setPublish] = useState(false);
  const [comments, setComments] = useState([]);
  const addComment = (newComment) => {
    setComments([...comments, newComment]);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const getUsers = () => {
      const postRef = query(collection(db, "users"));
      onSnapshot(postRef, (snapshot) => {
        setAllUsers(
          snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
        setUserLoading(false);
      });
    };
    getUsers();
  }, []);

  const { data: postData, loading: postLoading } = useFetch("posts");
  const { data: getData } = useFetch("users");


  return (
    <BlogContext.Provider
      value={{

        currentUser,
        setCurrentUser,
        allUsers,
        userLoading,
        publish,
        setPublish,
        updateData,
        setUpdateData,
        title,
        setTitle,
        desc,
        setDesc,
        color,
        setColor,
        img,
        setImg,
        postData,
        postLoading,
        getData,
        authModel,
        setAuthModel,

        comments,
        addComment,
      }}
    >
      {loading ? <Loading /> : children}
    </BlogContext.Provider>
  );
};

export default Context;

export const Blog = () => useContext(BlogContext);
