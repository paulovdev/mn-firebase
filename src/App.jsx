import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Blog } from "./context/Context";
import { ToastContainer } from "react-toastify";
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


import Navbar from "./components/Navigation/Navbar/Navbar";
import SideBar from './components/Navigation/SideBar/SideBar'

import Login from "./pages/Registration/Login/Login";
import Register from "./pages/Registration/Register/Register";

import Home from "./pages/Home/Home";

import Profile from "./pages/Profile/Profile";
/* import Footer from "./components/Footer/Footer"; */
import CreatePost from "./pages/CreatePost/CreatePost";
import EditPost from "./pages/EditPost/EditPost";
import Post from "./pages/Post/Post";
import Dashboard from "./pages/Dashboard/Dashboard";
import AllTopics from "./components/TopicsContainer/AllTopics/AllTopics"
/* 

import About from "./pages/About/About";

import CreatePost from "./pages/CreatePost/CreatePost"; 
*/

import Search from "./pages/Search/Search";
import TopicPost from "./pages/TopicPost/TopicPost";
import FirstHome from "./pages/FirstHome/FirstHome";
import Notifications from "./pages/Notifications/Notifications";

const App = () => {
  const { currentUser } = Blog();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const overflow = () => {
      window.document.body.style.overflowY = "hidden"
      setTimeout(() => {
        window.document.body.style.overflowY = "auto"
      }, 1000);
    }
    overflow()
  }, [location.pathname]);


  return (
    <>
      <SkeletonTheme baseColor="#3a3a3a" highlightColor="#262626">

        <Navbar />
        {currentUser && < SideBar />}
        <ToastContainer />

          <Routes location={location} key={location.pathname}>
            <Route index path="/" element={!currentUser ? <FirstHome /> : < Home />} />
            <Route path="/dashboard" element={!currentUser ? <Login /> : <Dashboard />} />
            <Route path="/home" element={!currentUser ? <FirstHome /> : <Home />} />
            <Route path="/me/notifications" element={<Notifications />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={!currentUser ? <Login /> : <Dashboard />} />
            <Route path="/post/create" element={!currentUser ? <Login /> : <CreatePost />} />
            <Route path="/post/:postId" element={<Post />} />
            <Route path="/editPost/:uid" element={<EditPost />} />
            <Route path="/topic/:postId" element={<TopicPost />} />
            <Route path="/allTopics" element={<AllTopics />} />
            <Route path="/search" element={<Search />} />
            <Route
              path="*"
              element={<Navigate to={!currentUser ? "/login" : "/home"} />}
            />
          </Routes>


      </SkeletonTheme>
      {/*  <Footer /> */}
    </>
  );
};

export default App;
