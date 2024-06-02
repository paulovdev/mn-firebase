import React from "react";
import { Link } from "react-router-dom";
import { Blog } from "../../context/Context";
import { useQuery } from "react-query";
import { IoIosArrowRoundBack } from "react-icons/io";
import "./Notifications.scss";
import { toast } from "react-toastify";
import FormatHour from "../../utils/FormatHour";
import Skeleton from "react-loading-skeleton";
import { fetchNotifications } from "../../hooks/useNotifications";
import { useRealtimeNotifications } from "../../hooks/useRealtimeNotifications";
import { motion, AnimatePresence } from "framer-motion";

const Notifications = () => {
  const { currentUser } = Blog();

  const { data, error, isLoading } = useQuery(
    ["notifications", currentUser],
    () => fetchNotifications(currentUser),
    {
      enabled: !!currentUser, // Only execute the query if currentUser is defined
    }
  );

  useRealtimeNotifications(currentUser);

  if (!currentUser) {
    toast.error("Você precisa estar conectado para comentar.");
    return null;
  }

  return (
    <section id="notifications">
      <Link to="/" className="back">
        <IoIosArrowRoundBack size={32} />
        <p>Inicio</p>
      </Link>
      <h1>Notificações</h1>
      <div className="border-bottom"></div>
      <AnimatePresence mode='wait'>
        {isLoading && (
          <div>
            <div className="notification-item">
              <div className="user-info">
                <Link to="#">
                  <Skeleton borderRadius={100} width={50} height={50} />
                </Link>
              </div>
              <div className="user-text">
                <p><Skeleton width={300} height={10} /></p>
                <Skeleton width={100} height={10} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <p>Erro ao carregar notificações</p>
        )}

        {!isLoading && !error && data.notifications.length > 0 && (
          data.notifications.map((notification, index) => {
            const user = data.users[notification.userId];
            return (
              <motion.div
                key={index}
                className="notification-item"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="user-info">
                  <Link to={`/profile/${user.userId}`}>
                    <img src={user.userImg} alt={`${user.username}'s profile`} />
                  </Link>
                </div>
                <div className="user-text">
                  <p><span>{user.username}</span> começou a seguir você</p>
                  <FormatHour date={notification.timestamp} />
                </div>
              </motion.div>
            );
          })
        )}

        {!isLoading && !error && data.notifications.length === 0 && (
          <p>Sem notificações</p>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Notifications;
