import { useState, useEffect } from "react";
import { getDocs, query, collection } from "firebase/firestore";
import { Blog } from "../../../../context/Context";
import { db } from "../../../../firebase/Config";
import { toast } from "react-toastify";

const useFollowState = (userId) => {
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = Blog();

  useEffect(() => {
    const fetchFollowers = async () => {
      setLoading(true);

      try {
        const followersQuery = query(
          collection(db, "users", userId, "followers")
        );
        const querySnapshot = await getDocs(followersQuery);
        const followers = querySnapshot.docs.map(doc => doc.data());

        setFollowersCount(followers.length);
        if (currentUser) {
          setIsFollowed(followers.some(follower => follower.userId === currentUser.uid));

          // Fetching following count for current user
          const followingQuery = query(
            collection(db, "users", currentUser.uid, "following")
          );
          const followingSnapshot = await getDocs(followingQuery);
          const following = followingSnapshot.docs.map(doc => doc.data());
          setFollowingCount(following.length);
          setIsFollowing(following.some(follow => follow.userId === userId));
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [userId, currentUser]);

  return { followersCount, setFollowersCount, followingCount, setFollowingCount, isFollowing, setIsFollowing, loading, setLoading, isFollowed, setIsFollowed, isProcessing, setIsProcessing };
};

export default useFollowState;
