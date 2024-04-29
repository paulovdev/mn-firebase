import React from 'react';
import { NavLink } from "react-router-dom";
import { GrHomeRounded } from "react-icons/gr";
import { RxDashboard } from "react-icons/rx";
import { IoCreateOutline } from "react-icons/io5";

import './SideBar.scss';

const SideBar = () => {
    return (
        <aside className="sidebar">
            <ul >
                <li>
                    <NavLink to={'/'}>
                        <GrHomeRounded />
                    </NavLink>
                </li>
                <li>
                    <NavLink to={`/dashboard`}>
                        < RxDashboard />
                    </NavLink>
                </li>
                <li>
                    <NavLink to={'/post/create'}>
                        <IoCreateOutline />
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
}

export default SideBar;
