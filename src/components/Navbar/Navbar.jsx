import { NavLink, Link } from "react-router-dom";
import Loading from "../Loading/Loading";
import { Blog } from "../../context/Context";
import "./Navbar.scss";
import UserModal from "../UserModal/UserModal";
const Navbar = () => {
  const { currentUser, userLoading } = Blog();

  return (
    <>
      {
        <header>
          <nav>
            {!currentUser && (<>
              <li>
                <NavLink to="/login">Entrar</NavLink>
              </li>
              <li>
                <NavLink to="/register">Cadastrar</NavLink>
              </li>
              <li>
                <NavLink to="/about">Sobre</NavLink>
              </li>
            </>
            )}
          </nav>


          {currentUser && <UserModal />}

        </header >
      }
    </>
  );
};

export default Navbar;
