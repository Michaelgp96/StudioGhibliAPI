// src/Contexto/GhibliContext.jsx
import React, { createContext, useState, useEffect, useRef } from 'react'; // Añadido useRef
import { supabase } from '../supabaseClient';

export const GhibliContext = createContext();

const FAVORITOS_FILMS_KEY = 'ghibliAppFavoritosFilms';

const incrementSignInCount = async (userId) => {
  if (!userId) {
    console.log("GhibliContext/incrementSignInCount: No userId provided, skipping increment.");
    return;
  }
  console.log(`GhibliContext/incrementSignInCount: Intentando incrementar para userID: ${userId}`);
  try {
    const { error } = await supabase.rpc('increment_user_sign_in_count', { user_id_input: userId });
    if (error) {
      console.error('GhibliContext/incrementSignInCount: Error al incrementar sign_in_count via RPC:', error);
    } else {
      console.log('GhibliContext/incrementSignInCount: sign_in_count incrementado para el usuario:', userId);
    }
  } catch (error) {
    console.error('GhibliContext/incrementSignInCount: Excepción al llamar a RPC:', error);
  }
};

export function GhibliProvider({ children }) {
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
      console.error("GhibliContext: Error al cargar favoritosFilms de localStorage:", error);
      return [];
    }
  });

  const [userSession, setUserSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const initialAuthCheckDone = useRef(false); // Para controlar la primera carga de autenticación

  useEffect(() => { /* fetchFilms */
    const fetchFilms = async () => { setLoadingFilms(true); setErrorFilms(null); try { const response = await fetch('https://ghibliapi.vercel.app/films'); if (!response.ok) throw new Error(`Error HTTP: ${response.status} - Películas.`); const data = await response.json(); setFilms(data); } catch (error) { console.error("GhibliContext/fetchFilms Error:", error); setErrorFilms(error.message); setFilms([]); } finally { setLoadingFilms(false); } }; fetchFilms();
  }, []);

  useEffect(() => { /* fetchPeople */
    const fetchPeople = async () => { setLoadingPeople(true); setErrorPeople(null); try { const response = await fetch('https://ghibliapi.vercel.app/people'); if (!response.ok) throw new Error(`Error HTTP: ${response.status} - Personajes.`); const data = await response.json(); setPeople(data); } catch (error) { console.error("GhibliContext/fetchPeople Error:", error); setErrorPeople(error.message); setPeople([]); } finally { setLoadingPeople(false); } }; fetchPeople();
  }, []);

  useEffect(() => { /* fetchLocations */
    const fetchLocations = async () => { setLoadingLocations(true); setErrorLocations(null); try { const response = await fetch('https://ghibliapi.vercel.app/locations'); if (!response.ok) throw new Error(`Error HTTP: ${response.status} - Locaciones.`); const data = await response.json(); setLocations(data); } catch (error) { console.error("GhibliContext/fetchLocations Error:", error); setErrorLocations(error.message); setLocations([]); } finally { setLoadingLocations(false); } }; fetchLocations();
  }, []);

  useEffect(() => { /* guardar favoritosFilms */
    try { localStorage.setItem(FAVORITOS_FILMS_KEY, JSON.stringify(favoritosFilms)); } catch (error) { console.error("GhibliContext: Error al guardar favoritosFilms en localStorage:", error); }
  }, [favoritosFilms]);

  useEffect(() => {
    console.log("GhibliContext: Auth useEffect - INICIO");
    // No establecer authLoading a true aquí para evitar reseteos innecesarios
    // Se establece en true solo al inicio del componente GhibliProvider.

    // 1. Obtener sesión inicial
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      console.log("GhibliContext: getSession() completado. Sesión:", session);
      if (error) {
        console.error("GhibliContext: Error en getSession():", error.message);
      }
      setUserSession(session); // Establece la sesión (puede ser null)
      
      // Solo llamar a incrementSignInCount aquí si es la primera vez que se detecta una sesión
      // y el listener onAuthStateChange no lo ha hecho ya por un evento SIGNED_IN.
      // Es difícil evitar doble conteo perfectamente sin más lógica de estado.
      // Por ahora, el listener onAuthStateChange es el principal responsable del incremento.
      // if (session?.user && !initialAuthCheckDone.current) {
      //   console.log("GhibliContext: Sesión inicial detectada, incrementando contador para:", session.user.id);
      //   await incrementSignInCount(session.user.id);
      // }

      initialAuthCheckDone.current = true;
      setAuthLoading(false); // Indica que la verificación inicial de autenticación ha terminado
      console.log("GhibliContext: Auth useEffect - getSession() finalizado, authLoading:", false);
    });

    // 2. Escuchar cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`GhibliContext: onAuthStateChange - Evento: ${event}, Sesión:`, session);
        
        // Comparamos la sesión actual (antes de este evento) con la nueva sesión
        // para detectar un inicio de sesión real.
        // Nota: userSession dentro de este callback es el valor de userSession del render anterior
        // cuando este callback fue definido. Para una comparación más precisa,
        // se podría usar un ref para el valor anterior o pasar userSession como dependencia al useEffect.
        // Por simplicidad, nos basamos en el evento SIGNED_IN y que la sesión actual sea nueva.
        
        const isNewLogin = event === 'SIGNED_IN' && session?.user && (userSession === null || userSession?.user?.id !== session.user.id);

        setUserSession(session); // Actualiza el estado de la sesión globalmente

        if (isNewLogin) {
          console.log("GhibliContext: onAuthStateChange - Detectado NUEVO SIGNED_IN, incrementando contador para:", session.user.id);
          await incrementSignInCount(session.user.id);
        }

        // Asegurarse de que authLoading se ponga en false si aún no lo estaba
        // (aunque getSession debería haberlo hecho).
        if (initialAuthCheckDone.current && authLoading) {
            setAuthLoading(false);
            console.log("GhibliContext: onAuthStateChange - authLoading forzado a false por evento:", event);
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        console.log("GhibliContext: Desuscribiendo de onAuthStateChange.");
        authListener.subscription.unsubscribe();
      }
    };
  }, []); // El array de dependencias está vacío. `userSession` no se incluye para evitar re-suscripciones innecesarias.

  const addFilmToFavoritos = (film) => { if (!favoritosFilms.find(favFilm => favFilm.id === film.id)) { setFavoritosFilms(prevFavoritos => [...prevFavoritos, film]); } };
  const removeFilmFromFavoritos = (filmId) => { setFavoritosFilms(prevFavoritos => prevFavoritos.filter(film => film.id !== filmId)); };
  const isFilmInFavoritos = (filmId) => { return favoritosFilms.some(film => film.id === filmId); };

  const signOut = async () => {
    console.log("GhibliContext: signOut llamado");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("GhibliContext: Error al cerrar sesión:", error);
    }
    // onAuthStateChange debería poner userSession a null
  };

  const contextValue = {
    films, loadingFilms, errorFilms,
    people, loadingPeople, errorPeople,
    locations, loadingLocations, errorLocations,
    favoritosFilms, addFilmToFavoritos, removeFilmFromFavoritos, isFilmInFavoritos,
    userSession, authLoading, signOut,
  };
  console.log("GhibliContext: Re-render, authLoading:", authLoading, "userSession:", userSession);

  return (
    <GhibliContext.Provider value={contextValue}>
      {children}
    </GhibliContext.Provider>
  );
}