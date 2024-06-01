import React from 'react';
import { NavLink } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { IoMdCube, IoMdCloudUpload } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";

import { MdCategory } from "react-icons/md";
import './SideBar.scss';
import { Blog } from '../../../context/Context';

const SideBar = () => {
    const { currentUser } = Blog()
    return (
        <aside id="sidebar">

            <ul>
                <li>
                    <NavLink exact to="/" activeClassName="active" className="side-container">
                        <div className='side-icon'>
                            <GoHomeFill size={22} />
                        </div>
                        <div className="side-text">
                            <span>Inicio</span>
                        </div>
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/allTopics" activeClassName="active" className="side-container">

                        <div className='side-icon'>

                            <MdCategory size={22} />

                        </div>
                        <div className="side-text">
                            <span>Topicos</span>
                        </div>
                    </NavLink>
                </li>

                <li>
                    <NavLink to={`/me/notifications`} activeClassName="active" className="side-container">

                        <div className='side-icon'>

                            <IoNotifications size={22} />


                        </div>
                        <div className="side-text">
                            <span>Notificações</span>
                        </div>
                    </NavLink>
                </li>



                <li>
                    <NavLink to="/post/create" activeClassName="active" className="side-container">

                        <div className='side-icon'>
                            <IoMdCloudUpload size={22} />

                        </div>
                        <div className="side-text">
                            <span>Publicar</span>

                        </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard" activeClassName="active" className="side-container">

                        <div className='side-icon'>
                            <IoMdCube size={22} />

                        </div>
                        <div className="side-text">
                            <span>Dashboard</span>

                        </div>
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
}

export default SideBar;
