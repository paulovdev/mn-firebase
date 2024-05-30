import React from 'react';
import { NavLink } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { MdSpaceDashboard } from "react-icons/md";
import { IoCreate } from "react-icons/io5";
import { MdCategory } from "react-icons/md";

import './SideBar.scss';

const SideBar = () => {


    return (
        <aside className="sidebar">
            <ul >
                <li>
                    <NavLink to={'/'}>
                        <GoHomeFill size={22} />
                        Inicio
                    </NavLink>
                </li>

                <li>
                    <NavLink to={`/dashboard`}>
                        <MdSpaceDashboard size={22} />
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to={'/post/create'}>
                        <IoCreate size={22} />
                        Publicar
                    </NavLink>
                </li>

                <li>
                    <NavLink to={'/allTopics'}>
                        <MdCategory size={22} />
                        Topicos
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
}

export default SideBar;
