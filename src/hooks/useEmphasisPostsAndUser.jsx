import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/Config";
import { useQuery } from "react-query";

const fetchPostsAndUsers = async () => {
  try {
    const postsCollection = collection(db, "posts");
    const postsQuery = query(postsCollection);
    const postsSnapshot = await getDocs(postsQuery);

    const fetchedPosts = [];
    const fetchedUsers = {};

    const desiredPostIds = ["lE72M0ZgG2cnUtzSCXf1", "WujsdcHDIdhxLsqz4145", "GcSOkURm9Bvxc8yMLxLJ", "unbYyrAdCqFy3I3SnFRI"];

    await Promise.all(
      postsSnapshot.docs.map(async (postDoc) => {
        const postData = postDoc.data();
        const postId = postDoc.id;

        if (desiredPostIds.includes(postId)) {
          fetchedPosts.push({ ...postData, id: postId });

          if (!fetchedUsers[postData.userId]) {
            const userDoc = await getDoc(doc(db, "users", postData.userId));
            const userData = userDoc.data();
            fetchedUsers[postData.userId] = { ...userData, id: postData.userId };
          }
        }
      })
    );

    return { fetchedPosts, fetchedUsers };
  } catch (error) {
    throw new Error(error.message);
  }
};

const useEmphasisPostsAndUser = () => {
  return useQuery("postsAndUsers", fetchPostsAndUsers);
};

export default useEmphasisPostsAndUser;