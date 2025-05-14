// src/Componentes/PersonajeDetalle/index.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GhibliContext } from '../../Contexto/GhibliContext'; // Ajusta la ruta si es necesario
import './style.css';

function PersonajeDetalle() {
  const { id: personIdFromParams } = useParams(); // ID del personaje desde la URL

  // Consumimos 'people' y 'films' del contexto.
  // 'films' lo usaremos para mostrar los nombres de las películas en las que aparece el personaje.
  const { people, loadingPeople, errorPeople, films, loadingFilms } = useContext(GhibliContext);

  const [personDetail, setPersonDetail] = useState(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    setLocalLoading(true);
    setLocalError(null);
    setPersonDetail(null);

    // Esperar a que tanto los personajes como las películas se hayan cargado del contexto
    if (loadingPeople || loadingFilms) {
      return; // Mantenemos localLoading en true y esperamos
    }

    if (errorPeople) {
      setLocalError(`Error al cargar datos de personajes: ${errorPeople}`);
      setLocalLoading(false);
      return;
    }
    // Podríamos también chequear errorFilms si fuera crucial para este componente

    if (people && people.length > 0) {
      const foundPerson = people.find(p => p.id === personIdFromParams);

      if (foundPerson) {
        // Enriquecer foundPerson con los nombres de las películas
        const filmsData = foundPerson.films.map(filmUrl => {
          if (filmUrl.includes("TODO")) return { id: filmUrl, title: "Información de película no disponible" }; // Manejar placeholder de la API
          const filmId = filmUrl.split('/').pop();
          const filmInfo = films.find(f => f.id === filmId);
          return filmInfo ? { id: filmId, title: filmInfo.title } : { id: filmId, title: `Película ID: ${filmId}` };
        });

        // Similar para species (si tuviéramos species cargadas en el contexto)
        let speciesData = null;
        if (foundPerson.species && !foundPerson.species.includes("TODO") && !foundPerson.species.endsWith("TODO")) {
            const speciesId = foundPerson.species.split('/').pop();
            // Aquí buscaríamos la especie en 'context.species' si estuviera cargada
            // Por ahora, solo guardamos el ID o la URL.
            speciesData = { id: speciesId, name: `Especie ID: ${speciesId}` };
             // Si tuviéramos las especies cargadas en el contexto, haríamos algo como:
            // const speciesInfo = context.speciesAll.find(s => s.id === speciesId);
            // speciesData = speciesInfo ? { id: speciesId, name: speciesInfo.name } : { id: speciesId, name: `Especie ID: ${speciesId}` };
        }


        setPersonDetail({ ...foundPerson, filmsData, speciesData });
        setLocalError(null);
      } else {
        setLocalError(`No se encontró un personaje con el ID: ${personIdFromParams}`);
      }
    } else if (!loadingPeople) {
      setLocalError("No hay datos de personajes disponibles en el contexto.");
    }
    setLocalLoading(false);
  }, [personIdFromParams, people, loadingPeople, errorPeople, films, loadingFilms]);

  if (localLoading || loadingPeople || loadingFilms) {
    return <div className="c-detalle-mensaje">Cargando detalles del personaje...</div>;
  }

  if (localError) {
    return <div className="c-detalle-mensaje c-detalle-error">Error: {localError}</div>;
  }

  if (!personDetail) {
    return <div className="c-detalle-mensaje">No se encontraron detalles para este personaje.</div>;
  }

  return (
    <div className="c-detalle-personaje">
      <div className="c-detalle-personaje-avatar">
        <span>{personDetail.name.substring(0, 1)}</span>
      </div>
      <h1>{personDetail.name}</h1>

      <div className="c-detalle-personaje-info-seccion">
        <h3>Información General</h3>
        <p><strong>Género:</strong> {personDetail.gender || 'No especificado'}</p>
        <p><strong>Edad:</strong> {personDetail.age || 'No especificada'}</p>
        <p><strong>Color de Ojos:</strong> {personDetail.eye_color || 'No especificado'}</p>
        <p><strong>Color de Cabello:</strong> {personDetail.hair_color || 'No especificado'}</p>
        {personDetail.speciesData && <p><strong>Especie:</strong> {personDetail.speciesData.name}</p>}
      </div>

      {personDetail.filmsData && personDetail.filmsData.length > 0 && (
        <div className="c-detalle-personaje-info-seccion">
          <h3>Apariciones en Películas</h3>
          <ul>
            {personDetail.filmsData.map(film => (
              <li key={film.id}>
                {film.title.includes("Película ID:") || film.title.includes("no disponible") ? (
                  film.title // Mostrar el ID si no se encontró el título
                ) : (
                  <Link to={`/detalle/${film.id}`}>{film.title}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PersonajeDetalle;