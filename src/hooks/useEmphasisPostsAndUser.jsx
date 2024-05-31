import { useState, useEffect } from "react";
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/Config";
import { toast } from "react-toastify";

const useEmphasisPostsAndUser = () => {
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState({});
    const [skeleton, setSkeleton] = useState(false);

    const desiredPostIds = ["XSOcAo0Rxfq1AGUlpoWP", "XIkpkijBgoyF1LoshOET", "XIV0ZhuITDoP8CtcWqqX", "BGNkIQ5rZ6cqJcvCYnJ9"];

    useEffect(() => {
        const fetchPostsEmphasis = async () => {
            setSkeleton(true);
            setLoading(true);
            try {
                const postsCollection = collection(db, "posts");
                const postsQuery = query(postsCollection);

                const postsSnapshot = await getDocs(postsQuery);

                const fetchedPosts = [];
                const fetchedUsers = {};

                const userFetchPromises = [];

                postsSnapshot.forEach((postDoc) => {
                    const postData = postDoc.data();
                    const postId = postDoc.id;

                    if (desiredPostIds.includes(postId)) {
                        fetchedPosts.push({ ...postData, id: postId });

                        if (!fetchedUsers[postData.userId]) {
                            const userFetchPromise = getDoc(doc(db, "users", postData.userId)).then((userDoc) => {
                                const userData = userDoc.data();
                                fetchedUsers[postData.userId] = { ...userData, id: postData.userId };
                            });
                            userFetchPromises.push(userFetchPromise);
                        }
                    }
                });

                await Promise.all(userFetchPromises);

                setPosts(fetchedPosts);
                setUsers(fetchedUsers);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
                setTimeout(() => {
                    setSkeleton(false);
                }, 800);
            }
        };

        fetchPostsEmphasis();
    }, []);

    return { loading, posts, users, skeleton };
};

export default useEmphasisPostsAndUser;
