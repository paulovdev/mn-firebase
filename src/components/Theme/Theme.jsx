import { useState } from 'react'
import { VscColorMode } from "react-icons/vsc";


const Theme = (toggleTheme) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    function toggleTheme(e) {
        e.preventDefault()
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle("light");
    }


    return (
        <button onClick={toggleTheme} className="toogle-theme">
            <VscColorMode size={22} color={isDarkMode ? '#000' : '#fff'} />
            Tema
        </button>
    )
}

export default Theme;