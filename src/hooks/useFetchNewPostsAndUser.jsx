import { useState, useEffect } from "react";
import { collection, query, doc, getDoc, getDocs, where, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/Config";
import { Blog } from "../context/Context";
import { useParams } from "react-router-dom"; // Importando o hook useParams

const useFetchNewPostsAndUser = () => {
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState({});

    const { currentUser } = Blog(); // Obtendo o usuário atual  

    useEffect(() => {
        const fetchPosts = async () => {
            if (!currentUser) {
                return;
            }

            setLoading(true);

            try {
                const fetchedUsers = {};
                const usersCollection = collection(db, "users");
                // Consulta para obter os IDs dos usuários seguidos pelo usuário atual
                const followingQuery = query(
                    collection(db, "users", currentUser.uid, "following")
                );
                const followingSnapshot = await getDocs(followingQuery);
                const followingIds = followingSnapshot.docs.map(doc => doc.id);

                const postsQuery = query(
                    collection(db, "posts"),
                    where("userId", "in", followingIds),
                    orderBy("created", "desc"),
                    limit(2)
                );
                const postsSnapshot = await getDocs(postsQuery);

                const fetchedPosts = [];

                for (const postDoc of postsSnapshot.docs) {
                    const postData = postDoc.data();
                    const postId = postDoc.id;
                    const userDoc = await getDoc(doc(usersCollection, postData.userId));
                    const userData = userDoc.data();

                    fetchedPosts.push({ ...postData, id: postId, user: userData });
                    fetchedUsers[postData.userId] = userData;
                }

                // Embaralhando os posts
                const shuffledPosts = shuffleArray(fetchedPosts);

                setPosts(shuffledPosts);
                setUsers(fetchedUsers);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [currentUser]);

    // Função para embaralhar o array
    const shuffleArray = array => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

    return { posts, loading, users };
};

export default useFetchNewPostsAndUser;
