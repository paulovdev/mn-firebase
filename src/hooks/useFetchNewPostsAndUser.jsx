
import { collection, query, doc, getDoc, getDocs, where, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/Config";
import { Blog } from "../context/Context";
import { useQuery } from "react-query";

const fetchNewPostsAndUser = async (currentUser) => {
  try {
    const fetchedUsers = {};
    const usersCollection = collection(db, "users");

    const followingQuery = query(collection(db, "users", currentUser.uid, "following"));
    const followingSnapshot = await getDocs(followingQuery);
    const followingIds = followingSnapshot.docs.map(doc => doc.id);

    const postsQuery = query(
      collection(db, "posts"),
      where("userId", "in", followingIds),
      orderBy("created", "desc"),
      limit(2)
    );

    const postsSnapshot = await getDocs(postsQuery);
    const fetchedPosts = [];

    for (const postDoc of postsSnapshot.docs) {
      const postData = postDoc.data();
      const postId = postDoc.id;
      const userDoc = await getDoc(doc(usersCollection, postData.userId));
      const userData = userDoc.data();

      fetchedPosts.push({ ...postData, id: postId, user: userData });
      fetchedUsers[postData.userId] = userData;
    }

    return { fetchedPosts, fetchedUsers };
  } catch (error) {
    throw new Error("Error fetching posts: " + error.message);
  }
};

const useFetchNewPostsAndUser = () => {
  const { currentUser } = Blog();
  return useQuery('newPostsAndUsers', () => fetchNewPostsAndUser(currentUser));
};

export default useFetchNewPostsAndUser;
