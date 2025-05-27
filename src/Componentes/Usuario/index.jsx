// src/Componentes/Usuario/index.jsx
import React, { useContext, useState, useEffect } from 'react';
import { GhibliContext } from '../../Contexto/GhibliContext';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './style.css';

function Usuario() {
  const { userSession, authLoading, signOut } = useContext(GhibliContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true); // Inicia como true
  const [profileError, setProfileError] = useState(null);

  console.log("Usuario.jsx: Renderizando. authLoading:", authLoading, "userSession:", userSession);

  useEffect(() => {
    console.log("Usuario.jsx: useEffect disparado. authLoading:", authLoading, "userSession:", userSession);

    // Función para obtener el perfil del usuario
    const fetchProfile = async () => {
      console.log("Usuario.jsx: fetchProfile - INICIO para user ID:", userSession.user.id);
      setLoadingProfile(true); // Indicar que estamos cargando el perfil
      setProfileError(null);
      setProfile(null);

      try {
        const { data, error, status } = await supabase
          .from('profiles')
          .select('username, email, sign_in_count, created_at')
          .eq('id', userSession.user.id);

        console.log("Usuario.jsx: fetchProfile - Respuesta de Supabase (profiles):", { data, error, status });

        if (error && status !== 406) {
          throw error;
        }
        
        if (data && data.length > 0) {
          setProfile(data[0]);
        } else if (data && data.length === 0) {
          console.warn("Usuario.jsx: fetchProfile - No se encontró perfil para:", userSession.user.id);
          setProfileError("No se encontró el perfil. Puede que no se haya creado al registrarse.");
        } else if (!data && !error) {
            setProfileError("Respuesta inesperada o vacía al obtener el perfil.");
        }
      } catch (err) {
        console.error("Usuario.jsx: fetchProfile - ERROR EN CATCH:", err);
        setProfileError(err.message || "No se pudo cargar la información del perfil.");
      } finally {
        console.log("Usuario.jsx: fetchProfile - FINALLY, setLoadingProfile(false)");
        setLoadingProfile(false);
      }
    };

    // Lógica principal del useEffect
    if (authLoading) {
      console.log("Usuario.jsx: useEffect - authLoading es true, esperando...");
      // No establecemos loadingProfile a true aquí directamente porque fetchProfile lo hará
      // si se cumplen las condiciones para llamarlo. Simplemente esperamos.
      return; // Espera a que la autenticación se resuelva
    }

    if (!userSession?.user) {
      console.log("Usuario.jsx: useEffect - No hay userSession, setLoadingProfile(false). Redirigiendo a login opcionalmente.");
      setLoadingProfile(false); // No hay perfil que cargar
      // navigate('/login'); // Opcional: redirigir
      return;
    }

    // Si hay sesión de usuario y la autenticación no está cargando, obtenemos el perfil.
    console.log("Usuario.jsx: useEffect - authLoading es false y hay userSession. Llamando a fetchProfile.");
    fetchProfile();

  }, [userSession, authLoading, navigate]); // Dependencias correctas


  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // --- Renderizado ---
  console.log("Usuario.jsx: Antes de renderizar. authLoading:", authLoading, "loadingProfile:", loadingProfile, "userSession:", userSession, "profile:", profile, "profileError:", profileError);

  if (authLoading) { // Prioridad 1: Carga de autenticación
    return <div className="c-usuario-mensaje">Verificando autenticación...</div>;
  }

  if (!userSession) { // Prioridad 2: No hay sesión
    return (
      <div className="c-usuario-container c-usuario-no-logueado">
        <h1>Mi Perfil</h1>
        <p>Debes iniciar sesión para ver tu perfil.</p>
        <button onClick={() => navigate('/login')} className="c-usuario-boton-accion">Ir a Iniciar Sesión</button>
      </div>
    );
  }

  // Si hay sesión, pero el perfil aún se está cargando
  if (loadingProfile) {
    return <div className="c-usuario-mensaje">Cargando información del perfil...</div>;
  }
  
  if (profileError) {
    return (
      <div className="c-usuario-container c-usuario-error-container">
        <h1>Mi Perfil</h1>
        <div className="c-usuario-mensaje c-usuario-error">Error al cargar perfil: {profileError}</div>
        <button onClick={handleSignOut} className="c-usuario-boton-logout">Cerrar Sesión</button>
      </div>
    );
  }
  
  if (!profile) {
     return (
      <div className="c-usuario-container c-usuario-no-perfil">
        <h1>Mi Perfil</h1>
        <div className="c-usuario-mensaje">No se encontró información del perfil para {userSession.user.email}.</div>
        <p>El perfil podría no haberse creado correctamente. Intenta cerrar sesión y volver a iniciarla.</p>
        <button onClick={handleSignOut} className="c-usuario-boton-logout">Cerrar Sesión</button>
      </div>
    );
  }

  return (
    <section className="c-usuario-container">
      <header className="c-usuario-header">
        <h1>Mi Perfil Ghibli</h1>
      </header>
      <div className="c-usuario-contenido">
        <div className="c-usuario-info-item">
          <span className="c-usuario-info-label">Correo Electrónico:</span>
          <span className="c-usuario-info-valor">{profile.email || userSession.user.email}</span>
        </div>
        {profile.username && (
          <div className="c-usuario-info-item">
            <span className="c-usuario-info-label">Nombre de Usuario:</span>
            <span className="c-usuario-info-valor">{profile.username}</span>
          </div>
        )}
        <div className="c-usuario-info-item">
          <span className="c-usuario-info-label">Número de Inicios de Sesión:</span>
          <span className="c-usuario-info-valor">{profile.sign_in_count !== null && profile.sign_in_count !== undefined ? profile.sign_in_count : 'No disponible'}</span>
        </div>
        <div className="c-usuario-info-item">
          <span className="c-usuario-info-label">Miembro desde:</span>
          <span className="c-usuario-info-valor">{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'No disponible'}</span>
        </div>
        <button onClick={handleSignOut} className="c-usuario-boton-logout">
          Cerrar Sesión
        </button>
      </div>
    </section>
  );
}

export default Usuario;