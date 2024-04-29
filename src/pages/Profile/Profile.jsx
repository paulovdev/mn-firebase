import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Profile.scss";
import Loading from "../../components/Loading/Loading";
import EditProfile from "./EditProfile";
import { motion } from 'framer-motion'
import { Blog } from "../../context/Context";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/Config";
import { toast } from "react-toastify";
import { Transition } from "../../utils/Transition/Transition";

const Profile = () => {
  const { currentUser, allUsers } = Blog();
  const { userId } = useParams();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(false);
  const { username, userImg, bio } = post;

  const [modal, setModal] = useState(false);

  const close = () => setModal(false);
  const open = () => setModal(true);

  const [userPosts, setUserPosts] = useState([]);

  const isAuthor = currentUser && currentUser.uid === userId;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, "posts", userId);
        const getPost = await getDoc(postRef);
        if (getPost.exists()) {
          const postData = getPost.data();
          if (postData?.userId) {
            const userRef = doc(db, "users", postData.userId);
            const getUser = await getDoc(userRef);
            if (getUser.exists()) {
              const userData = getUser.data();
              const { created, ...rest } = postData;
              setPost({ ...rest, ...userData, id: userId });
            }
          }
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [userId]);

  useEffect(() => {
    const foundUser = allUsers.find((user) => user.id === userId);
    setUserData(foundUser);
  }, [allUsers, userId]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoading(true);
      try {
        const collectionRef = collection(db, "posts");
        const q = query(
          collectionRef,
          where("userId", "==", userId),
          orderBy("created", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const posts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserPosts(posts);
        });
        setLoading(false);
        return () => unsubscribe();
      } catch (error) {
        console.log("Error fetching user posts:", error);
      }
    };

    fetchUserPosts();
  }, [userId]);

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
                  <img src={userData?.userImg} alt="" />
                  <div className="wrapper-text">
                    <h1>{userData?.username}</h1>
                    <p>{userData?.bio}</p>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => (modal ? close() : open())}>
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
                    onClick={() => (modal ? close() : open())}
                    getUserData={userData}
                  />
                </motion.div>
              )}

            </section>
          ) : (
            <section id="my-profile">
              <div className="container">
                <div className="profile-photo">
                  <img src={userImg} alt="" />
                  <h1>{username}</h1>
                  <p>{bio}</p>
                </div>

                <div className="followers">
                  <p>
                    Seguidores: <span>30.000</span>
                  </p>
                  <p>
                    Seguindo: <span> 2.304</span>
                  </p>
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
