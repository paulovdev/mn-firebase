import { useState, useEffect } from "react";
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/Config";

const useSearchPostsAndUser = (search) => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {

        if (search) {
          const postsCollection = collection(db, "posts");
          const usersCollection = collection(db, "users");

          const postsSnapshot = await getDocs(postsCollection);
          const fetchedPosts = [];
          const fetchedUsers = {};



          for (const postDoc of postsSnapshot.docs) {
            const postData = postDoc.data();
            const postId = postDoc.id;

            if (postData.title.toLowerCase().includes(search.toLowerCase())) {
              const userDoc = await getDoc(doc(usersCollection, postData.userId));
              const userData = userDoc.data();

              fetchedPosts.push({ ...postData, id: postId, user: userData });
              fetchedUsers[postData.userId] = userData;
            }
          }

          setPosts(fetchedPosts);
          setUsers(fetchedUsers);
        } else {
          setPosts([]);
          setUsers({});
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search]);

  return { posts, users, loading };
};

export default useSearchPostsAndUser;
