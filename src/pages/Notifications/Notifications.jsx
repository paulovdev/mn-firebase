import React from "react";
import { Link } from "react-router-dom";
import { Blog } from "../../context/Context";
import useNotifications from "../../hooks/useNotifications";
import { IoIosArrowRoundBack } from "react-icons/io";

import { toast } from "react-toastify";
import FormatHour from "../../utils/FormatHour";
import Skeleton from "react-loading-skeleton";

import "./Notifications.scss";

const Notifications = () => {
  const { notifications, loading, users } = useNotifications();
  const { currentUser } = Blog();

  if (!currentUser) {
    toast.error("Você precisa estar conectado para comentar.");
  }

  return (
    <section id="notifications">
      <Link to="/" className="back">
        <IoIosArrowRoundBack size={32} />
        <p>Inicio</p>
      </Link>
      <h1>Notificações</h1>
      <div className="border-bottom"></div>
      {loading ? (
        <div>
          <div className="notification-item">
            <div className="user-info">
              <Link>
                <Skeleton borderRadius={100} width={50} height={50} />
              </Link>
            </div>
            <div className="user-text">
              <p><Skeleton width={100} height={10} /></p>
              <Skeleton width={100} height={10} />
            </div>
          </div>
        </div>


      ) : (
        <div>
          {notifications.map((notification, index) => {
            const user = users[notification.userId];
            return (
              <div key={index} className="notification-item">

                <div className="user-info">
                  <Link to={`/profile/${user.userId}`}>
                    <img src={user.userImg} alt={`${notification.username}'s profile`} />
                  </Link>
                </div>

                <div className="user-text">
                  <p><span>{user.username}</span> começou a seguir você</p>
                  <FormatHour date={notification.timestamp} />
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
