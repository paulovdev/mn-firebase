import { Navigate, Route, Routes } from "react-router-dom";
import { Blog } from "./context/Context";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import Home from "./pages/Home/Home";

import Profile from "./pages/Profile/Profile";
/* import Footer from "./components/Footer/Footer"; */
import CreatePost from "./pages/CreatePost/CreatePost";
import EditPost from "./pages/EditPost/EditPost";
import Post from "./components/Post/Post";
import Dashboard from "./pages/Dashboard/Dashboard";

/* 

import About from "./pages/About/About";

import CreatePost from "./pages/CreatePost/CreatePost"; 
*/

import Search from "./pages/Search/Search";

const App = () => {
  const { currentUser } = Blog();

  return (
    <>
      <div className="container">
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/post/create" element={<CreatePost />} />
          <Route path="/post/:postId" element={<Post />} />
          <Route path="/editPost/:uid" element={<EditPost />} />
          <Route path="/search" element={<Search />} />

          {/*
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          */}
          {/*           <Route
            path="/posts/create"
            element={!currentUser ? <Navigate to="/login" /> : <CreatePost />}
          />

          <Route
            path="/posts/edit/:id"
            element={!currentUser ? <Navigate to="/login" /> : <EditPost />}
          /> */}
          {/*           <Route
            path="/dashboard"
            element={!currentUser ? <Navigate to="/login" /> : <Dashboard />}
          />*/}

          <Route
            path="*"
            element={<Navigate to={!currentUser ? "/login" : "/"} />}
          />
        </Routes>
       {/*  <Footer /> */}
      </div>
    </>
  );
};

export default App;
