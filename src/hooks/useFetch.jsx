import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/Config";

const useFetch = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = () => {
      const postRef = query(
        collection(db, collectionName),
        orderBy("created", "desc")
      );
      onSnapshot(postRef, (snapshot) => {
        setData(
          snapshot.docs.map((document) => ({
            ...document.data(),
            id: document.id,
          }))
        );
        setLoading(false);
      });
    };
    getUsers();
  }, []);

  return { data, loading };
};

export default useFetch;
