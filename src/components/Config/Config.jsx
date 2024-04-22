import { useAuthentication } from '../../hooks/useAuthentication'
import { useAuthValue } from "../../context/AuthContext"

import Theme from "../Theme/Theme"

import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";


import './Config.scss'
import { useEffect, useState, useRef } from 'react'

const Config = () => {
    const [open, setOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const dropdownRef = useRef(null);
    const profileRef = useRef(null);

    const { logout } = useAuthentication();
    const { user } = useAuthValue();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef, profileRef]);

    const closeProfileOpen = () => {
        setProfileOpen(!profileOpen);
        setOpen(!open);
    };

    return (
        <>
            <div className='config' >
                <img src="" onClick={() => setOpen(!open)} alt="" />

                <div className={`dropdown ${open ? "active" : ""}`} ref={dropdownRef}>

                    <button onClick={closeProfileOpen}><CgProfile size={22} /> Meu Perfil</button>

                    <Theme size={22} />

                    <button onClick={logout}> <CiLogout size={22} />Sair</button>
                </div>
            </div>

            <div className={`my-profile ${profileOpen ? "active" : ""}`} ref={profileRef}>
                {user &&
                    <>
                        <p>Nome:<span>{user.displayName}</span></p>
                        <br />
                        <p>{user.metadata.creationTime}</p>
                        <br />
                        <p>{user.email}</p>
                        <br />
                        <p>{user.emailVerified}</p>
                    </>
                }
            </div >
        </>
    )
}

export default Config;
