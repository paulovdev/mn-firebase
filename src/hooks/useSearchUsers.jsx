import { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../firebase/Config";

const useSearchUsers = (search) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (search) {
          const usersCollection = collection(db, "users");
          const usersSnapshot = await getDocs(usersCollection);
          const fetchedUsers = {};

          for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            const userId = userDoc.id;

            if (userData.username.toLowerCase().includes(search.toLowerCase())) {
              fetchedUsers[userId] = userData;
            }
          }

          setUsers(fetchedUsers);
        } else {
          setUsers({});
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search]);

  return { users, loading };
};

export default useSearchUsers;
