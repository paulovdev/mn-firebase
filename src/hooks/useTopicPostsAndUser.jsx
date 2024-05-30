import { useState, useEffect } from "react";
import { collection, query, getDocs, doc, getDoc, where } from "firebase/firestore";
import { db } from "../firebase/Config";

const useTopicPostsAndUser = (topicId) => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [skeleton, setSkeleton] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setSkeleton(true);
        if (topicId) {
          const postsCollection = collection(db, "posts");
          const usersCollection = collection(db, "users");

          const postsQuery = query(postsCollection, where("topic", "==", topicId));
          const postsSnapshot = await getDocs(postsQuery);

          const fetchedPosts = [];
          const fetchedUsers = {};

          for (const postDoc of postsSnapshot.docs) {
            const postData = postDoc.data();
            const postId = postDoc.id;

            const userDoc = await getDoc(doc(usersCollection, postData.userId));
            const userData = userDoc.data();

            fetchedPosts.push({ ...postData, id: postId, user: userData });
            fetchedUsers[postData.userId] = userData;
          }

          setPosts(fetchedPosts);
          setUsers(fetchedUsers);
        } else {
          setPosts([]);
          setUsers({});
        }

        setLoading(false);
        setTimeout(() => {
          setSkeleton(false);
        }, 800);

      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  return { posts, users, skeleton };
};

export default useTopicPostsAndUser;
