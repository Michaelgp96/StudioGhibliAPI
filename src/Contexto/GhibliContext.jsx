// src/Contexto/GhibliContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const GhibliContext = createContext();

export function GhibliProvider({ children }) {
  // --- ESTADO PARA LAS PELÍCULAS (FILMS) ---
  const [films, setFilms] = useState([]);
  const [loadingFilms, setLoadingFilms] = useState(true);
  const [errorFilms, setErrorFilms] = useState(null);

  // --- ESTADO PARA PERSONAJES (PEOPLE) --- (NUEVO)
  const [people, setPeople] = useState([]); // Para almacenar el array de personajes
  const [loadingPeople, setLoadingPeople] = useState(true); // Para saber si los personajes se están cargando
  const [errorPeople, setErrorPeople] = useState(null); // Para almacenar cualquier error al cargar personajes

  // ...y así para los otros endpoints (locations, species, vehicles)

  // useEffect para Cargar las Películas
  useEffect(() => {
    const fetchFilms = async () => {
      setLoadingFilms(true);
      setErrorFilms(null);
      try {
        const response = await fetch('https://ghibliapi.vercel.app/films');
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - No se pudieron obtener las películas.`);
        }
        const data = await response.json();
        setFilms(data);
      } catch (error) {
        console.error("Error al cargar las películas de Ghibli:", error);
        setErrorFilms(error.message);
        setFilms([]);
      } finally {
        setLoadingFilms(false);
      }
    };
    fetchFilms();
  }, []);

  // --- useEffect para Cargar los Personajes --- (NUEVO)
  useEffect(() => {
    const fetchPeople = async () => {
      setLoadingPeople(true); // Empezamos la carga
      setErrorPeople(null);   // Reseteamos cualquier error previo
      try {
        const response = await fetch('https://ghibliapi.vercel.app/people');
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - No se pudieron obtener los personajes.`);
        }
        const data = await response.json();
        setPeople(data); // Guardamos los datos de los personajes en el estado
      } catch (error) {
        console.error("Error al cargar los personajes de Ghibli:", error);
        setErrorPeople(error.message); // Guardamos el mensaje de error
        setPeople([]); // En caso de error, dejamos el array de personajes vacío
      } finally {
        setLoadingPeople(false); // Terminamos la carga
      }
    };

    fetchPeople();
  }, []); // El array vacío -> se ejecuta solo una vez al montar

  // El Valor que el Provider Pasará a sus Hijos
  const contextValue = {
    films,
    loadingFilms,
    errorFilms,
    people,         // Añadimos personajes al contexto
    loadingPeople,  // Añadimos estado de carga de personajes
    errorPeople,    // Añadimos estado de error de personajes
    // ... aquí irán los datos de locations, species, etc.
  };

  return (
    <GhibliContext.Provider value={contextValue}>
      {children}
    </GhibliContext.Provider>
  );
}