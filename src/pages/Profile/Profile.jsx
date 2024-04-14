import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Profile.scss";
import Loading from "../../components/Loading/Loading";
import EditProfile from "./EditProfile";
import { Blog } from "../../context/Context";

const Profile = () => {
  const { currentUser, allUsers, userLoading } = Blog();
  const { userId } = useParams();

  const getUserData = allUsers.find((user) => user.id === currentUser?.uid);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const foundUser = allUsers.find((user) => user.id === currentUser?.uid);
    setUserData(foundUser);
  }, [allUsers, userId]);

  return (
    <>
      {userLoading ? (
        <Loading />
      ) : (
        <section id="my-profile">
          <div className="container">
            <img
              src={getUserData?.userImg || "/profile.jpg"}
              alt="profile-img"
            />
            <h1>{getUserData?.username}</h1>
            <p>{getUserData?.bio}</p>
          </div>
          <EditProfile getUserData={userData} />
        </section>
      )}
    </>
  );
};

export default Profile;
