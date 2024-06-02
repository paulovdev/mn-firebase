import { collection, doc, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/Config";
import { useQuery } from "react-query";
import { Blog } from "../context/Context";

const fetchNotifications = async (currentUser) => {

  const usersCollection = collection(db, "users");
  const notificationCollection = collection(db, "users", currentUser.uid, "notifications");

  console.log("Fetching notifications...");

  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(notificationCollection, async (notificationSnapshot) => {
      console.log("Notification snapshot received:", notificationSnapshot.docs.length, "docs");

      const fetchedUsers = {};
      const fetchedNotifications = [];

      for (const postDoc of notificationSnapshot.docs) {
        const postData = postDoc.data();
        const postId = postDoc.id;

        console.log("Processing notification:", postId);

        if (!fetchedUsers[postData.userId]) {
          console.log("Fetching user data for user:", postData.userId);
          const userDoc = await getDoc(doc(usersCollection, postData.userId));
          const userData = userDoc.data();
          fetchedUsers[postData.userId] = userData;
          console.log("User data fetched:", userData);
        }
        fetchedNotifications.push({ ...postData, id: postId });
      }

      console.log("Notifications processed:", fetchedNotifications.length);

      resolve({ fetchedUsers, fetchedNotifications });
    }, (error) => {
      console.error("Error fetching notifications:", error);
      reject(error);
    });

    // Retorna a função de limpeza
    return () => {
      console.log("Unsubscribing from notifications...");
      unsubscribe();
    };
  });
};

const useNotifications = () => {
  const { currentUser } = Blog();
  return useQuery('notifications', () => fetchNotifications(currentUser));
};

export default useNotifications;
