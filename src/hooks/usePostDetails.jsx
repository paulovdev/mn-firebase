import { useQuery } from 'react-query';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/Config";

const usePostDetails = (postId) => {
  return useQuery(['post', postId], async () => {
    const postRef = doc(db, "posts", postId);
    const getPost = await getDoc(postRef);
    if (getPost.exists()) {
      const postData = getPost.data();
      const userRef = doc(db, "users", postData.userId);
      const getUser = await getDoc(userRef);
      if (getUser.exists()) {
        const userData = getUser.data();
        return { post: { ...postData, id: postId }, user: { ...userData, id: postData.userId } };
      }
    }
    throw new Error("Post not found");
  });
};

export default usePostDetails;
