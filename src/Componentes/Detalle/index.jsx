// src/Componentes/Detalle/index.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import './style.css'; // Tus estilos existentes
import { GhibliContext } from '../../Contexto/GhibliContext';

function Detalle() {
  const { id: filmIdFromParams } = useParams();

  // 1. Consumir las nuevas funciones y el estado de favoritos del contexto
  const {
    films, loadingFilms, errorFilms, // Estados existentes para la lista de películas
    addFilmToFavoritos,               // Nueva función para añadir a favoritos
    removeFilmFromFavoritos,          // Nueva función para quitar de favoritos
    isFilmInFavoritos                 // Nueva función para verificar si es favorito
  } = useContext(GhibliContext);

  const [filmDetail, setFilmDetail] = useState(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  // Variable para saber si la película actual es favorita
  const esFavoritaActual = filmDetail ? isFilmInFavoritos(filmDetail.id) : false;

  useEffect(() => {
    setLocalLoading(true);
    setLocalError(null);
    setFilmDetail(null);

    if (loadingFilms) {
      return;
    }
    if (errorFilms) {
      setLocalError(`Error general al cargar datos de películas: ${errorFilms}`);
      setLocalLoading(false);
      return;
    }
    if (films && films.length > 0) {
      const foundFilm = films.find(film => film.id === filmIdFromParams);
      if (foundFilm) {
        setFilmDetail(foundFilm);
        setLocalError(null);
      } else {
        setLocalError(`No se encontró una película con el ID: ${filmIdFromParams}`);
      }
    } else if (!loadingFilms) {
      setLocalError("No hay datos de películas disponibles en el contexto.");
    }
    setLocalLoading(false);
  }, [filmIdFromParams, films, loadingFilms, errorFilms]);

  // 2. Handler para el botón de favoritos
  const handleToggleFavorito = () => {
    if (!filmDetail) return; // No hacer nada si no hay detalles de la película

    if (esFavoritaActual) {
      removeFilmFromFavoritos(filmDetail.id);
    } else {
      // Pasamos el objeto filmDetail completo para que se guarde en la lista de favoritos
      // con toda la info necesaria (id, title, image, etc.)
      addFilmToFavoritos(filmDetail);
    }
  };

  if (localLoading || loadingFilms) {
    return <div className="c-detalle-mensaje">Cargando detalles de la película...</div>;
  }
  if (localError) {
    return <div className="c-detalle-mensaje c-detalle-error">Error: {localError}</div>;
  }
  if (!filmDetail) {
    return <div className="c-detalle-mensaje">No se encontraron detalles para esta película.</div>;
  }

  return (
    <div className="c-detalle-pelicula">
      {/* Contenedor para título y botón de favorito */}
      <div className="c-detalle-cabecera">
        <h2>{filmDetail.title} ({filmDetail.release_date})</h2>
        {/* 3. Botón para añadir/quitar de favoritos */}
        <button
          onClick={handleToggleFavorito}
          className={`c-boton-favorito ${esFavoritaActual ? 'favorito-activo' : ''}`}
          aria-label={esFavoritaActual ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          {esFavoritaActual ? '❤️ Quitar de Favoritos' : '🤍 Añadir a Favoritos'}
        </button>
      </div>

      <h4>{filmDetail.original_title} / {filmDetail.original_title_romanised}</h4>

      {filmDetail.movie_banner && (
        <img
          src={filmDetail.movie_banner}
          alt={`Banner de ${filmDetail.title}`}
          className="c-detalle-imagen-banner"
        />
      )}

      <p><strong>Director:</strong> {filmDetail.director}</p>
      <p><strong>Productor:</strong> {filmDetail.producer}</p>
      <p><strong>Puntuación Rotten Tomatoes:</strong> {filmDetail.rt_score}%</p>
      <p className="c-detalle-descripcion"><strong>Descripción:</strong> {filmDetail.description}</p>

      {filmDetail.image && (!filmDetail.movie_banner || filmDetail.movie_banner === filmDetail.image) && (
        <img
          src={filmDetail.image}
          alt={`Poster de ${filmDetail.title}`}
          className="c-detalle-imagen-poster"
        />
      )}

      {/* ... (resto del JSX, como la sección de personajes si la tenías) ... */}
    </div>
  );
}

export default Detalle;