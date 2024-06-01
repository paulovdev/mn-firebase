import { useState, useEffect } from "react";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/Config";
import { toast } from "react-toastify";
import { Blog } from "../context/Context";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(false);
  const { currentUser } = Blog();

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    setLoading(true);

    const usersCollection = collection(db, "users");
    const notificationCollection = collection(db, "users", currentUser.uid, "notifications");

    const unsubscribe = onSnapshot(notificationCollection, async (notificationSnapshot) => {
      const fetchedUsers = {};
      const fetchedNotifications = [];

      for (const postDoc of notificationSnapshot.docs) {
        const postData = postDoc.data();
        const postId = postDoc.id;

        // Verificar se o usuário já foi buscado
        if (!fetchedUsers[postData.userId]) {
          const userDoc = await getDoc(doc(usersCollection, postData.userId));
          const userData = userDoc.data();
          fetchedUsers[postData.userId] = userData;
        }

        fetchedNotifications.push({ ...postData, id: postId });
      }

      setNotifications(fetchedNotifications);
      setUsers(fetchedUsers);
      setLoading(false);
    }, (error) => {
      toast.error(error.message);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe() ;
  }, [currentUser]); // Depend only on currentUser

  return { notifications, setNotifications, users, loading };
};

export default useNotifications;
