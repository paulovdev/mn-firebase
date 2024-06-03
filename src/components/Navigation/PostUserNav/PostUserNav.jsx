import React from 'react';
import { NavLink } from 'react-router-dom';
import "./PostUserNav.scss";

const PostUserNav = () => {
    return (
        <div className="post-users-container">
            <NavLink to="/search">Postagens</NavLink>
            <NavLink to="/users">Usuários</NavLink>
        </div>
    );
};

export default PostUserNav;
