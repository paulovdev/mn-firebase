import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/Config";
import { useQueryClient } from "react-query";
import { useEffect } from "react";

export const useRealtimeNotifications = (currentUser) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!currentUser) {
      return;
    }

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

      queryClient.setQueryData(["notifications", currentUser], {
        notifications: fetchedNotifications,
        users: fetchedUsers,
      });
    }, (error) => {
      console.error("Failed to fetch notifications:", error);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [currentUser, queryClient]);
};
