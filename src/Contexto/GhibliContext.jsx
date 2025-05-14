// src/Contexto/GhibliContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const GhibliContext = createContext();

// Nombre clave para localStorage
const FAVORITOS_FILMS_KEY = 'ghibliAppFavoritosFilms';

export function GhibliProvider({ children }) {
  // --- ESTADO PARA LAS PELÍCULAS (FILMS) ---
  const [films, setFilms] = useState([]);
  const [loadingFilms, setLoadingFilms] = useState(true);
  const [errorFilms, setErrorFilms] = useState(null);

  // --- ESTADO PARA PERSONAJES (PEOPLE) ---
  const [people, setPeople] = useState([]);
  const [loadingPeople, setLoadingPeople] = useState(true);
  const [errorPeople, setErrorPeople] = useState(null);

  // --- ESTADO PARA LOCACIONES (LOCATIONS) ---
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [errorLocations, setErrorLocations] = useState(null);

  // --- ESTADO PARA PELÍCULAS FAVORITAS --- (NUEVO)
  const [favoritosFilms, setFavoritosFilms] = useState(() => {
    // Intentar cargar los favoritos desde localStorage al iniciar
    try {
      const filmsGuardados = localStorage.getItem(FAVORITOS_FILMS_KEY);
      return filmsGuardados ? JSON.parse(filmsGuardados) : [];
    } catch (error) {
      console.error("Error al cargar favoritosFilms de localStorage:", error);
      return [];
    }
  });

  // useEffects para cargar Films, People, Locations (sin cambios, se mantienen como estaban)
  useEffect(() => { /* ... fetchFilms ... */
    const fetchFilms = async () => {
      setLoadingFilms(true); setErrorFilms(null);
      try {
        const response = await fetch('https://ghibliapi.vercel.app/films');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status} - No se pudieron obtener las películas.`);
        const data = await response.json(); setFilms(data);
      } catch (error) { console.error("Error al cargar las películas de Ghibli:", error); setErrorFilms(error.message); setFilms([]);
      } finally { setLoadingFilms(false); }
    };
    fetchFilms();
  }, []);

  useEffect(() => { /* ... fetchPeople ... */
    const fetchPeople = async () => {
      setLoadingPeople(true); setErrorPeople(null);
      try {
        const response = await fetch('https://ghibliapi.vercel.app/people');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status} - No se pudieron obtener los personajes.`);
        const data = await response.json(); setPeople(data);
      } catch (error) { console.error("Error al cargar los personajes de Ghibli:", error); setErrorPeople(error.message); setPeople([]);
      } finally { setLoadingPeople(false); }
    };
    fetchPeople();
  }, []);

  useEffect(() => { /* ... fetchLocations ... */
    const fetchLocations = async () => {
      setLoadingLocations(true); setErrorLocations(null);
      try {
        const response = await fetch('https://ghibliapi.vercel.app/locations');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status} - No se pudieron obtener las locaciones.`);
        const data = await response.json(); setLocations(data);
      } catch (error) { console.error("Error al cargar las locaciones de Ghibli:", error); setErrorLocations(error.message); setLocations([]);
      } finally { setLoadingLocations(false); }
    };
    fetchLocations();
  }, []);


  // --- useEffect para GUARDAR películas favoritas en localStorage --- (NUEVO)
  // Este efecto se ejecuta cada vez que 'favoritosFilms' cambia.
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITOS_FILMS_KEY, JSON.stringify(favoritosFilms));
    } catch (error) {
      console.error("Error al guardar favoritosFilms en localStorage:", error);
    }
  }, [favoritosFilms]);

  // --- FUNCIONES PARA MANEJAR FAVORITOS --- (NUEVO)
  const addFilmToFavoritos = (film) => {
    // Comprobar si la película ya está en favoritos para no duplicarla
    if (!favoritosFilms.find(favFilm => favFilm.id === film.id)) {
      setFavoritosFilms(prevFavoritos => [...prevFavoritos, film]);
    }
  };

  const removeFilmFromFavoritos = (filmId) => {
    setFavoritosFilms(prevFavoritos => prevFavoritos.filter(film => film.id !== filmId));
  };

  const isFilmInFavoritos = (filmId) => {
    return favoritosFilms.some(film => film.id === filmId);
  };


  // El Valor que el Provider Pasará a sus Hijos
  const contextValue = {
    films, loadingFilms, errorFilms,
    people, loadingPeople, errorPeople,
    locations, loadingLocations, errorLocations,

    // Nuevas propiedades para favoritos
    favoritosFilms,
    addFilmToFavoritos,
    removeFilmFromFavoritos,
    isFilmInFavoritos, // Útil para que los componentes verifiquen fácilmente
  };

  return (
    <GhibliContext.Provider value={contextValue}>
      {children}
    </GhibliContext.Provider>
  );
}