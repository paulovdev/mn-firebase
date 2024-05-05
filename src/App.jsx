import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Blog } from "./context/Context";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import Home from "./pages/Home/Home";
import SideBar from './components/SideBar/SideBar'
import Profile from "./pages/Profile/Profile";
/* import Footer from "./components/Footer/Footer"; */
import CreatePost from "./pages/CreatePost/CreatePost";
import EditPost from "./pages/EditPost/EditPost";
import Post from "./pages/Post/Post";
import Dashboard from "./pages/Dashboard/Dashboard";

/* 

import About from "./pages/About/About";

import CreatePost from "./pages/CreatePost/CreatePost"; 
*/

import Search from "./pages/Search/Search";
import TopicPost from "./pages/TopicPost/TopicPost";
import TopicSelection from "./pages/TopicSelection/TopicSelection";
const App = () => {
  const { currentUser } = Blog();
  const location = useLocation();

  return (
    <>
      <Navbar />
      <SideBar />
      <ToastContainer />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route index path="/" element={<Home />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={!currentUser ? <Login /> : <Dashboard />} />
          <Route path="/post/create" element={!currentUser ? <Login /> : <CreatePost />} />
          <Route path="/post/:postId" element={<Post />} />
          <Route path="/editPost/:uid" element={<EditPost />} />
          <Route path="/topic/:postId" element={<TopicPost />} />
          <Route path="/allTopics" element={<TopicSelection />} />
          <Route path="/search" element={<Search />} />
          <Route
            path="*"
            element={<Navigate to={!currentUser ? "/login" : "/"} />}
          />
        </Routes>
      </AnimatePresence>
      {/*  <Footer /> */}
    </>
  );
};

export default App;
