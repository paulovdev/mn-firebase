import React from 'react';
import { NavLink } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { IoMdCube, IoMdCloudUpload } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { MdCategory } from "react-icons/md";
import { useQuery } from "react-query";
import { Blog } from "../../../context/Context";
import { fetchNotifications } from "../../../hooks/useNotifications";
import { useRealtimeNotifications } from '../../../hooks/useRealtimeNotifications'; // Atualizado
import './SideBar.scss';

const SideBar = () => {
    const { currentUser } = Blog();

    const { data } = useQuery(
        ["notifications", currentUser],
        () => fetchNotifications(currentUser),
        {
            enabled: !!currentUser,
        }
    );

    useRealtimeNotifications(currentUser);

    const notifications = data?.notifications || [];

    return (
        <aside id="sidebar">
            <ul>
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active side-container' : 'side-container'}>
                        <div className='side-icon'>
                            <GoHomeFill size={22} />
                        </div>
                        <div className="side-text">
                            <span>Inicio</span>
                        </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/allTopics" className={({ isActive }) => isActive ? 'active side-container' : 'side-container'}>
                        <div className='side-icon'>
                            <MdCategory size={22} />
                        </div>
                        <div className="side-text">
                            <span>Topicos</span>
                        </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={`/me/notifications`} className={({ isActive }) => isActive ? 'active side-container' : 'side-container'}>
                        <div className='side-icon'>
                            <IoNotifications size={22} />
                            {notifications.length > 0 && (
                                <div className="notification-container">
                                    <span>{notifications.length}</span>
                                </div>
                            )}
                        </div>
                        <div className="side-text">
                            <span>Notificações</span>
                        </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/post/create" className={({ isActive }) => isActive ? 'active side-container' : 'side-container'}>
                        <div className='side-icon'>
                            <IoMdCloudUpload size={22} />
                        </div>
                        <div className="side-text">
                            <span>Publicar</span>
                        </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active side-container' : 'side-container'}>
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
};

export default SideBar;
