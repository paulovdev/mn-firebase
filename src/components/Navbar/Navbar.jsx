import { NavLink } from "react-router-dom";
import Loading from "../Loading/Loading";
import { Blog } from "../../context/Context";

import "./Navbar.scss";
import UserModal from "../UserModal/UserModal";
const Navbar = () => {
  const { currentUser, userLoading } = Blog();

  return (
    <>
      {userLoading ? (
        <Loading />
      ) : (
        <header>
          <div className="logo"></div>
          <nav>
            <li>
              <NavLink to="/">Inicio</NavLink>
            </li>
            {currentUser && (
              <>
                <li>
                  <NavLink to="/post/create">Novo post</NavLink>
                </li>
              </>
            )}
            {!currentUser && (
              <>
                <li>
                  <NavLink to="/login">Entrar</NavLink>
                </li>
                <li>
                  <NavLink to="/register">Cadastrar</NavLink>
                </li>
              </>
            )}
            {currentUser && <UserModal />}
          </nav>
        </header>
      )}
    </>
  );
};

export default Navbar;
