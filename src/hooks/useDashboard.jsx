import { useQuery } from 'react-query';
import { query, collection, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase/Config";

const fetchUserPosts = async (userId) => {
  const q = query(
    collection(db, "posts"),
    where("userId", "==", userId),
    orderBy("created", "desc")
  );

  const querySnapshot = await getDocs(q);
  const posts = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return posts;
};

const useUserPosts = (userId) => {
  return useQuery(['userPosts', userId], () => fetchUserPosts(userId));
};

export default useUserPosts;
