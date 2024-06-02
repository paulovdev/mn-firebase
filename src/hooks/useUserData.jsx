import { useQuery } from 'react-query';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/Config";

const fetchUserData = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    throw new Error("User does not exist.");
  }
};

const useUserData = (userId) => {
  return useQuery(['user', userId], () => fetchUserData(userId));
};

export default useUserData;
