// src/Contexto/GhibliContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Importamos nuestro cliente Supabase

export const GhibliContext = createContext();

const FAVORITOS_FILMS_KEY = 'ghibliAppFavoritosFilms';

export function GhibliProvider({ children }) {
  // --- ESTADOS DE DATOS (Films, People, Locations) ---
  const [films, setFilms] = useState([]);
  const [loadingFilms, setLoadingFilms] = useState(true);
  const [errorFilms, setErrorFilms] = useState(null);

  const [people, setPeople] = useState([]);
  const [loadingPeople, setLoadingPeople] = useState(true);
  const [errorPeople, setErrorPeople] = useState(null);

  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [errorLocations, setErrorLocations] = useState(null);

  const [favoritosFilms, setFavoritosFilms] = useState(() => {
    try {
      const filmsGuardados = localStorage.getItem(FAVORITOS_FILMS_KEY);
      return filmsGuardados ? JSON.parse(filmsGuardados) : [];
    } catch (error) {
      console.error("Error al cargar favoritosFilms de localStorage:", error);
      return [];
    }
  });

  // --- ESTADO DE AUTENTICACIÓN --- (NUEVO)
  const [userSession, setUserSession] = useState(null); // Para almacenar la sesión del usuario (null si no hay sesión)
  const [authLoading, setAuthLoading] = useState(true); // Para saber si estamos verificando el estado inicial de auth

  // useEffects para cargar Films, People, Locations (se mantienen como estaban)
  useEffect(() => { /* ... fetchFilms ... */
    const fetchFilms = async () => { setLoadingFilms(true); setErrorFilms(null); try { const response = await fetch('https://ghibliapi.vercel.app/films'); if (!response.ok) throw new Error(`Error HTTP: ${response.status} - Películas.`); const data = await response.json(); setFilms(data); } catch (error) { console.error("Error films:", error); setErrorFilms(error.message); setFilms([]); } finally { setLoadingFilms(false); } }; fetchFilms();
  }, []);
  useEffect(() => { /* ... fetchPeople ... */
    const fetchPeople = async () => { setLoadingPeople(true); setErrorPeople(null); try { const response = await fetch('https://ghibliapi.vercel.app/people'); if (!response.ok) throw new Error(`Error HTTP: ${response.status} - Personajes.`); const data = await response.json(); setPeople(data); } catch (error) { console.error("Error people:", error); setErrorPeople(error.message); setPeople([]); } finally { setLoadingPeople(false); } }; fetchPeople();
  }, []);
  useEffect(() => { /* ... fetchLocations ... */
    const fetchLocations = async () => { setLoadingLocations(true); setErrorLocations(null); try { const response = await fetch('https://ghibliapi.vercel.app/locations'); if (!response.ok) throw new Error(`Error HTTP: ${response.status} - Locaciones.`); const data = await response.json(); setLocations(data); } catch (error) { console.error("Error locations:", error); setErrorLocations(error.message); setLocations([]); } finally { setLoadingLocations(false); } }; fetchLocations();
  }, []);

  useEffect(() => { /* ... guardar favoritosFilms en localStorage ... */
    try { localStorage.setItem(FAVORITOS_FILMS_KEY, JSON.stringify(favoritosFilms)); } catch (error) { console.error("Error al guardar favoritosFilms en localStorage:", error); }
  }, [favoritosFilms]);


  // --- useEffect para MANEJAR LA SESIÓN DE AUTENTICACIÓN --- (NUEVO)
  useEffect(() => {
    setAuthLoading(true); // Empezar a verificar el estado de auth

    // 1. Intenta obtener la sesión actual al cargar la aplicación
    //    Esto es útil si el usuario ya estaba logueado y recarga la página.
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error al obtener sesión inicial:", error);
      }
      setUserSession(session); // Puede ser null si no hay sesión
      setAuthLoading(false); // Terminamos la verificación inicial
    };

    getInitialSession();

    // 2. Escucha los cambios en el estado de autenticación
    //    Esto se dispara cuando el usuario inicia sesión, cierra sesión, o la sesión cambia.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Evento de AuthStateChange:', event, session);
        setUserSession(session); // Actualiza el estado de la sesión
        // Si quisiéramos actualizar el contador de logins aquí:
        // if (event === 'SIGNED_IN' && session?.user) {
        //   // Aquí llamaríamos a una función para actualizar el sign_in_count en la tabla 'profiles'
        //   // incrementSignInCount(session.user.id);
        // }
        setAuthLoading(false); // Asegurarnos que authLoading esté en false después de cualquier evento
      }
    );

    // 3. Limpiar el listener cuando el componente se desmonte
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []); // Se ejecuta solo una vez al montar el GhibliProvider

  const addFilmToFavoritos = (film) => { if (!favoritosFilms.find(favFilm => favFilm.id === film.id)) { setFavoritosFilms(prevFavoritos => [...prevFavoritos, film]); } };
  const removeFilmFromFavoritos = (filmId) => { setFavoritosFilms(prevFavoritos => prevFavoritos.filter(film => film.id !== filmId)); };
  const isFilmInFavoritos = (filmId) => { return favoritosFilms.some(film => film.id === filmId); };

  // --- FUNCIÓN PARA CERRAR SESIÓN --- (NUEVO)
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error);
    }
    // El listener onAuthStateChange se encargará de poner userSession a null
  };

  const contextValue = {
    films, loadingFilms, errorFilms,
    people, loadingPeople, errorPeople,
    locations, loadingLocations, errorLocations,
    favoritosFilms, addFilmToFavoritos, removeFilmFromFavoritos, isFilmInFavoritos,

    // Nuevas propiedades para autenticación
    userSession,     // La sesión actual del usuario (o null)
    authLoading,     // Booleano para saber si se está verificando la sesión inicial
    signOut,         // Función para cerrar sesión
    // Podríamos pasar 'supabase.auth' directamente si los componentes necesitan más funciones,
    // pero es mejor exponer solo lo necesario.
    // auth: supabase.auth // Opcional
  };

  return (
    <GhibliContext.Provider value={contextValue}>
      {children}
    </GhibliContext.Provider>
  );
}