import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/Config";

export const fetchNotifications = async (currentUser) => {
  if (!currentUser) throw new Error("User is not logged in");

  const usersCollection = collection(db, "users");
  const notificationCollection = collection(db, "users", currentUser.uid, "notifications");

  const notificationSnapshot = await getDocs(notificationCollection);

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

  return { notifications: fetchedNotifications, users: fetchedUsers };
};
