// src/Componentes/Menu/index.jsx
import React, { useContext } from 'react'; // useContext añadido
import { NavLink, useNavigate } from 'react-router-dom'; // NavLink para estilos activos, useNavigate para signOut
import { GhibliContext } from '../../Contexto/GhibliContext'; // Ajusta la ruta si es necesario
import "./style.css";

function Menu() {
  const { userSession, authLoading, signOut } = useContext(GhibliContext);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(); // Llama a la función signOut del contexto
    navigate('/login'); // Redirige a la página de login después de cerrar sesión
  };

  // No mostrar nada o un loader simple mientras se verifica el estado de autenticación inicial
  if (authLoading) {
    // Podrías retornar un spinner o null para no mostrar el menú hasta que se sepa el estado auth.
    // Por ahora, retornaremos null para que no interfiera visualmente.
    return null;
    // O un loader simple:
    // return <nav className="c-menu"><p className="c-menu-loading">Cargando menú...</p></nav>;
  }

  return (
    <nav className="c-menu">
      <ul className="c-menu-lista">
        {userSession ? (
          // --- ENLACES PARA USUARIO LOGUEADO ---
          <>
            <li className="c-menu-item">
              <NavLink to="/" className={({ isActive }) => isActive ? "c-menu-enlace c-menu-enlace-activo" : "c-menu-enlace"}>
                Películas
              </NavLink>
            </li>
            <li className="c-menu-item">
              <NavLink to="/personajes" className={({ isActive }) => isActive ? "c-menu-enlace c-menu-enlace-activo" : "c-menu-enlace"}>
                Personajes
              </NavLink>
            </li>
            <li className="c-menu-item">
              <NavLink to="/locaciones" className={({ isActive }) => isActive ? "c-menu-enlace c-menu-enlace-activo" : "c-menu-enlace"}>
                Locaciones
              </NavLink>
            </li>
            {/* Aquí podrías añadir enlaces a Especies y Vehículos cuando los implementemos */}
            <li className="c-menu-item">
              <NavLink to="/favoritos" className={({ isActive }) => isActive ? "c-menu-enlace c-menu-enlace-activo" : "c-menu-enlace"}>
                Favoritos
              </NavLink>
            </li>
            {/* Los enlaces "Aleatorio" y "Original" los mantenemos si aún tienen sentido para tu app */}
            <li className="c-menu-item">
              <NavLink to="/aleatorio" className={({ isActive }) => isActive ? "c-menu-enlace c-menu-enlace-activo" : "c-menu-enlace"}>
                Aleatorio
              </NavLink>
            </li>
            <li className="c-menu-item">
              <NavLink to="/original" className={({ isActive }) => isActive ? "c-menu-enlace c-menu-enlace-activo" : "c-menu-enlace"}>
                Original
              </NavLink>
            </li>
             <li className="c-menu-item">
              <NavLink to="/usuario" className={({ isActive }) => isActive ? "c-menu-enlace c-menu-enlace-activo" : "c-menu-enlace"}>
                Mi Perfil
              </NavLink>
            </li>
            <li className="c-menu-item">
              <button onClick={handleSignOut} className="c-menu-enlace c-menu-boton-logout">
                Cerrar Sesión
              </button>
            </li>
          </>
        ) : (
          // --- ENLACES PARA USUARIO NO LOGUEADO ---
          <>
            {/* Podrías tener un enlace a una vista pública de películas si quieres */}
            {/* <li className="c-menu-item">
              <NavLink to="/" className={({ isActive }) => isActive ? "c-menu-enlace c-menu-enlace-activo" : "c-menu-enlace"}>
                Ver Películas
              </NavLink>
            </li> */}
            <li className="c-menu-item">
              <NavLink to="/login" className={({ isActive }) => isActive ? "c-menu-enlace c-menu-enlace-activo" : "c-menu-enlace"}>
                Iniciar Sesión
              </NavLink>
            </li>
            <li className="c-menu-item">
              <NavLink to="/registro" className={({ isActive }) => isActive ? "c-menu-enlace c-menu-enlace-activo" : "c-menu-enlace"}>
                Registro
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Menu;

