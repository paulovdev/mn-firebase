import React from 'react';
import { NavLink } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { IoMdCube, IoMdCloudUpload } from "react-icons/io";
import { MdCategory } from "react-icons/md";
import './SideBar.scss';

const SideBar = () => {
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
