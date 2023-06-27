import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../css/Nav.module.css";
import LogoClaro from "../img/LogoClaro.png";
import Carrito from "../img/Carrito.png";
import IconoUser from "../img/IconoUser.png";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import * as actions from "../redux/actions/actions";
import { useDispatch } from "react-redux";

const Nav = () => {
  const { pathname } = useLocation();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [admin, setAdmin] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(actions.logoutUser());
  };
  useEffect(() => {
    const storedLoggedInStatus = localStorage.getItem("isLoggedIn");
    if (storedLoggedInStatus) {
      setIsLoggedIn(JSON.parse(storedLoggedInStatus));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const handleRefrescar = () => {
    pathname === "/home" && window.location.reload();
  };

  // const validaruser = () => {
  //   const cookieString = document.cookie;
  //   if (cookieString) {
  //     const tokenCookie = cookieString
  //       .split(";")
  //       .find((cookie) => cookie.trim().startsWith("login="));
  //     const token = tokenCookie.split("=")[1];
  //     const cookiesUsers = async () => {
  //       try {
  //         const response = await axios.post("/auth/user", { token: token });
  //         const admin = response.data.user.admin;
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };
  //   }

  // };

  // useEffect(() => {
  //   validaruser();
  // }, []);

  return (
    <div className={styles.Nav}>
      <div className={styles.DivLogo}>
        <a href="/home">
          <img className={styles.Logo} src={LogoClaro} alt="Logo" />
        </a>
      </div>
      {pathname !== "/" && (
        <div className={styles.DivCentral}>
          <Link to="/home">
            <button onClick={handleRefrescar} className={styles.ButtonNav}>
              Productos
            </button>
          </Link>
          <Link to="/landing">
            <button className={styles.ButtonNav}>Nosotros</button>
          </Link>
          <Link to="/FQA">
            <button className={styles.ButtonNav}>Preguntas Frecuentes</button>
          </Link>
        </div>
      )}

      <div className={styles.DivLogin}>
        {pathname === "/" && (
          <Link to="/home">
            <button className={styles.ButtonNav}>Ingresar</button>
          </Link>
        )}
        {pathname !== "/" && pathname !== "/carrito" && (
          <Link to="/carrito">
            <button className={styles.Carrito}>
              <img src={Carrito} alt="Carrito" />
            </button>
          </Link>
        )}
        <div className={styles.PerfilDropdown}>
          <img src={IconoUser} alt="User" className={styles.Perfil} />
          <div className={styles.PerfilContent}>
            {localStorage.user ? (
              <>
                <Link to="/infocliente">
                  <button className={styles.ButtonNav}>Mi Perfil</button>
                </Link>
                <Link to="/compracliente">
                  <button className={styles.ButtonNav}>Mis Compras</button>
                </Link>
                <Link to="/">
                  <button onClick={handleLogout} className={styles.ButtonNav}>
                    Cerrar Sesión
                  </button>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <button className={styles.ButtonNav}>Iniciar Sesión</button>
              </Link>
            )}
            {admin && (
              <Link to="/dashboard">
                <button className={styles.ButtonNav}>Administrador</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
