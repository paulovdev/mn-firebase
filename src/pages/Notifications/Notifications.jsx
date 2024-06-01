import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { toast } from "react-toastify";
import { Blog } from "../../context/Context";
import "./Notifications.scss";

const Notifications = () => {
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [users, setUsers] = useState({});
    const { currentUser } = Blog();

    useEffect(() => {
        const fetchNotificationsAndUsers = async () => {
            if (!currentUser) {
                return;
            }

            setLoading(true);

            try {
                const usersCollection = collection(db, "users");
                const notificationCollection = collection(db, "users", currentUser.uid, "notifications");

                const notificationSnapshot = await getDocs(notificationCollection);

                const fetchedUsers = {};
                const fetchedNotifications = [];
              
                for (const postDoc of notificationSnapshot.docs) {
                    const postData = postDoc.data();
                    const postId = postDoc.uid;

                    // Verificar se o usuário já foi buscado
                    if (!fetchedUsers[postData.userId]) {
                        const userDoc = await getDoc(doc(usersCollection, postData.userId));
                        const userData = userDoc.data();
                        fetchedUsers[postData.userId] = userData;
                    }

                    fetchedNotifications.push({ ...postData, id: postId });
                }

                setNotifications(fetchedNotifications);
                setUsers(fetchedUsers);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNotificationsAndUsers();
    }, [currentUser]);

    return (
        <section id="notifications">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <h1>Notifications</h1>
                    <div className="border-bottom"></div>
                    {notifications.map((notification, index) => {
                        const user = users[notification.userId];
                        return (
                            <div key={index} className="notification-item">
                                <div className="user-info">
                                    <img src={user.userImg} alt="User Profile" />
                                </div>
                                <div className="user-text">
                                    <p><span>{user.username}</span> started following you</p>
                                    <p>{notification.timestamp}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default Notifications;
