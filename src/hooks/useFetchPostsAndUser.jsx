import { useState, useRef, useCallback } from "react";
import { doc, getDoc, collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../firebase/Config";
import { toast } from "react-toastify";

const useFetchPostsAndUser = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [lastDoc, setLastDoc] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef();

  const fetchPosts = useCallback(async (loadMore = false) => {
    setLoading(true);
    setIsLoadingMore(loadMore);
    try {
      const postsCollection = collection(db, "posts");
      const postsQuery = query(
        postsCollection,
        orderBy("created", "desc"),
        limit(3),
        ...(lastDoc ? [startAfter(lastDoc)] : [])
      );

      const postsSnapshot = await getDocs(postsQuery);
      const fetchedPosts = [];
      const fetchedUsers = {};

      postsSnapshot.forEach((postDoc) => {
        const postData = postDoc.data();
        const postId = postDoc.id;
        fetchedPosts.push({ ...postData, id: postId });

        const userRef = doc(db, "users", postData.userId);
        const getUser = getDoc(userRef);
        fetchedUsers[postData.userId] = getUser;
      });

      const resolvedUsers = await Promise.all(Object.values(fetchedUsers));
      resolvedUsers.forEach((userDoc, index) => {
        const userData = userDoc.data();
        const userId = Object.keys(fetchedUsers)[index];
        fetchedUsers[userId] = { ...userData, id: userId };
      });

      setPosts((prevPosts) => loadMore ? [...prevPosts, ...fetchedPosts] : fetchedPosts);
      setUsers((prevUsers) => ({ ...prevUsers, ...fetchedUsers }));
      setLastDoc(postsSnapshot.docs[postsSnapshot.docs.length - 1]);

      setLoading(false);
      setIsLoadingMore(false);

    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [lastDoc]);

  const lastPostElementRef = useCallback(node => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && lastDoc) {
        fetchPosts(true);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoadingMore, lastDoc, fetchPosts]);

  return { posts, users, loading, fetchPosts, lastPostElementRef };
};

export default useFetchPostsAndUser;
