import { useInfiniteQuery } from 'react-query';
import { doc, getDoc, collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../firebase/Config";
import { toast } from "react-toastify";

const fetchPostsAndUsers = async ({ pageParam = null }) => {
  const postsCollection = collection(db, "posts");
  const postsQuery = query(
    postsCollection,
    orderBy("created", "desc"),
    limit(3),
    ...(pageParam ? [startAfter(pageParam)] : [])
  );

  const postsSnapshot = await getDocs(postsQuery);
  const fetchedPosts = [];
  const fetchedUsers = {};

  postsSnapshot.forEach((postDoc) => {
    const postData = postDoc.data();
    const postId = postDoc.id;
    fetchedPosts.push({ ...postData, id: postId });

    const userRef = doc(db, "users", postData.userId);
    fetchedUsers[postData.userId] = getDoc(userRef);
  });

  const resolvedUsers = await Promise.all(Object.values(fetchedUsers));
  resolvedUsers.forEach((userDoc, index) => {
    const userData = userDoc.data();
    const userId = Object.keys(fetchedUsers)[index];
    fetchedUsers[userId] = { ...userData, id: userId };
  });

  return {
    posts: fetchedPosts,
    users: fetchedUsers,
    lastDoc: postsSnapshot.docs[postsSnapshot.docs.length - 1],
  };
};

const useFetchPostsAndUser = () => {
  return useInfiniteQuery('posts', fetchPostsAndUsers, {
    getNextPageParam: (lastPage) => lastPage?.lastDoc ?? undefined,
  });
};

export default useFetchPostsAndUser;
