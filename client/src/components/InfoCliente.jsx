import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../css/InfoCliente.module.css";
import PerfilDefault from "../img/PerfilDefault.png";
import loader from "../css/Loader.module.css";
import Editar from "../img/Editar.png";
import Llave from "../img/Llave.png";
import SubirImagen from "./SubirImagen";
import Swal from "sweetalert2";

const InfoCliente = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editpass, setEditpass] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [admin, setAdmin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const id = userData?.id;

  const cookieString = document.cookie;
  const tokenCookie = cookieString
    .split(";")
    .find((cookie) => cookie.trim().startsWith("login="));
  const token = tokenCookie.split("=")[1];


  const cookiesUsers = async () => {
    try {
      const response = await axios.post("/auth/user", { token: token });
      setUserData(response.data.user);
      setName(response.data.user.name);
      setLastName(response.data.user.last_name);
      setPhoneNumber(response.data.user.phone);
      setAdmin(response.data.user.admin);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cookiesUsers();
  }, []);

  useEffect(() => {
    const getLC = () => {
      const userDataLC = JSON.parse(localStorage.getItem('userData')) ?? [];  
      setUserData(userDataLC);
    }
    getLC();
  }, []);
  
  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);
  

  const enableEditing = () => {
    setEditing(true);
  };

  const disableEditing = () => {
    setEditing(false);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const enablePass = () => {
    setEditpass(true);
  };

  const disablePass = () => {
    setEditpass(false);
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const saveChanges = async () => {
    try {
      await axios.put(`/users/${id}`, {
        name,
        last_name: lastName,
        phone: phoneNumber,
        email: userData.email,
        image: userData.image,
      });
      disableEditing();
      setUserData({
        ...userData,
        name,
        last_name: lastName,
        phone: phoneNumber,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = (image) => {
    setUserData({
      ...userData,
      image: image,
    });
  };

  const savePass = async () => {
    if (newPassword === confirmPassword) {
      try {
        await axios.put(`/auth/user`, {
          token: token,
          email: userData.email,
          oldPassword: oldPassword,
          newPassword: confirmPassword,
        });
        Swal.fire({
          icon: "success",
          title: "Modificación",
          text: "Se modificó correctamente",
          timer: 1500,
        });
        setEditpass(false);
        disableEditing();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Contraseña actual incorrecta",
          timer: 1500,
        });
      }
    } else {
      console.log("Las contraseñas no coinciden");
    }
  };  

  const isPasswordValid = () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(newPassword);
  };

  

  return (
    <div className={styles.General}>
      <div className={styles.Perfil}>
        {userData ? (
          <img
            src={userData.image ? userData.image : PerfilDefault}
            alt="Usuario"
          />
        ) : (
          <img src={PerfilDefault} alt="Usuario" />
        )}
        {name && lastName ? <h1>{`${name} ${lastName}`}</h1> : <h1>{name}</h1>}
      </div>

      <div className={styles.Info}>
        {userData ? (
          <div className={styles.Datos}>
            {!editing && !editpass && (
              <div className={styles.Editar}>
                <button onClick={enableEditing}>
                  <img src={Editar} alt="Editar" />
                </button>
                <p>Editar</p>
              </div>
            )}
            {editing && (
              <div className={styles.DatosInput}>
                <h2>Nombre:</h2>
                <input type="text" value={name} onChange={handleNameChange} />
                <h2>Apellido:</h2>
                <input
                  type="text"
                  value={lastName}
                  onChange={handleLastNameChange}
                />
                <h2>Telefono:</h2>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                />
                <div>
                  <SubirImagen handleSave={handleSave} />
                  <div className={styles.Botones}>
                    <button onClick={saveChanges}>Guardar</button>
                    <button onClick={disableEditing}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}
            {!editpass && !editing && (
              <div className={styles.DatosLectura}>
                <h2>Nombre: </h2>
                <h1>{userData.name}</h1>
                <h2>Apellido: </h2>
                <h1>{lastName}</h1>
                <h2>Teléfono: </h2>
                <h1>{userData.phone}</h1>
                <h2>Correo: </h2>
                <h1>{userData.email}</h1>
              </div>
            )}
            <div className={styles.Botones}>
              <Link to="/compracliente">
                {!editing && !editpass && <button>Mis Compras</button>}
              </Link>
              {admin && !editing && !editpass && (
                  <Link to="/dashboard">
                    <button className={styles.ButtonNav}>Administrador</button>
                  </Link>
                )}
              {!editing && !editpass && (
                <div className={styles.Contraseña}>
                  <button onClick={enablePass}>
                    <img src={Llave} alt="llave" /> <p>Cambiar Contraseña</p>
                  </button>
                </div>
              )}
              {editpass && (
                <div className={styles.DatosInput}>
                  <h2>Contraseña Actual:</h2>
                  <input
                    type="text"
                    placeholder="Contraseña Actual"
                    onChange={handleOldPasswordChange}
                  />
                  <h2>Contraseña Nueva:</h2>
                  <input
                    type="text"
                    placeholder="Contraseña Nueva"
                    onChange={handleNewPasswordChange}
                  />
                  <h2>Repetir:</h2>
                  <input
                    type="text"
                    placeholder="Contraseña Nueva"
                    onChange={handleConfirmPasswordChange}
                  />
                  {!isPasswordValid() && (
                    <p className={styles.ErrorMessage}>
                      La contraseña debe tener al menos 8 caracteres y contener
                      al menos una letra y un número.
                    </p>
                  )}
                  <div className={styles.BotonesPass}>
                    <button onClick={savePass}>Guardar</button>
                    <button onClick={disablePass}>Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={loader.loaderLarge}></div>
        )}
      </div>
    </div>
  );
};

export default InfoCliente;
