import { useState, useEffect } from "react";
import { collection, query, getDocs, doc, getDoc, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/Config";

const useFetchNewPostsAndUser = () => {
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState({});
    const [skeleton, setSkeleton] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setSkeleton(true);
            try {
                const postsCollection = collection(db, "posts");
                const usersCollection = collection(db, "users");

                const postsSnapshot = await getDocs(query(postsCollection, orderBy("created", "desc"), limit(2)));
                
                const fetchedPosts = [];
                const fetchedUsers = {};

                for (const postDoc of postsSnapshot.docs) {
                    const postData = postDoc.data();
                    const postId = postDoc.id;

                    const userDoc = await getDoc(doc(usersCollection, postData.userId));
                    const userData = userDoc.data();

                    fetchedPosts.push({ ...postData, id: postId });
                    fetchedUsers[postData.userId] = userData;
                }

                setPosts(fetchedPosts);
                setUsers(fetchedUsers);

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
    }, []);

    return { posts, users, loading, skeleton };
};

export default useFetchNewPostsAndUser;
