import { useQuery, useMutation } from 'react-query';
import { query, collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/Config";

export const useUserFollow = (userId, currentUser) => {
    const fetchFollowers = async () => {
        const followersQuery = query(collection(db, "users", userId, "followers"));
        const querySnapshot = await getDocs(followersQuery);
        return querySnapshot.docs.map(doc => doc.data());
    };

    const followUser = async () => {
        const followRef = doc(db, "users", userId, "followers", currentUser.uid);
        const followingRef = doc(db, "users", currentUser.uid, "following", userId);

        await setDoc(followRef, { userId: currentUser.uid });
        await setDoc(followingRef, { userId });
    };

    const unfollowUser = async () => {
        const followRef = doc(db, "users", userId, "followers", currentUser.uid);
        const followingRef = doc(db, "users", currentUser.uid, "following", userId);

        await deleteDoc(followRef);
        await deleteDoc(followingRef);
    };

    return {
        fetchFollowers: useQuery('followers', fetchFollowers),
        followUser: useMutation(followUser),
        unfollowUser: useMutation(unfollowUser),
    };
};
