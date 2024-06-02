import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import "./Notifications.scss";
import FormatHour from "../../utils/FormatHour";
import Skeleton from "react-loading-skeleton";
import useNotifications from './../../hooks/useNotifications';

const Notifications = () => {
  const { data: notifications, isLoading, isError } = useNotifications();

  return (
    <section id="notifications">
      <Link to="/" className="back">
        <IoIosArrowRoundBack size={32} />
        <p>Inicio</p>
      </Link>
      <h1>Notificações</h1>
      <div className="border-bottom"></div>

      {isError && "aasoidjaosijdoasijd"}

      {isLoading ? (
        <div>
          <div className="notification-item">
            <div className="user-info">
              <Link to="/profile"> {/* Adicione um link aqui */}
                <Skeleton borderRadius={100} width={50} height={50} />
              </Link>
            </div>
            <div className="user-text">
              <p><Skeleton width={300} height={10} /></p>
              <Skeleton width={100} height={10} />
            </div>
          </div>
        </div>
      ) : (
        <div>
          {notifications && notifications.fetchedNotifications.length > 0 ? (
            notifications.fetchedNotifications.map((notification, index) => {
              const user = notifications.fetchedUsers[notification.userId];
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
            })
          ) : (
            <div className="notification-item">
              <p>Nenhuma notificação encontrada.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Notifications;
