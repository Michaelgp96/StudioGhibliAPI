// src/Componentes/Favoritos/index.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GhibliContext } from '../../Contexto/GhibliContext'; // Ajusta la ruta si es necesario
import './style.css'; // Crearemos o actualizaremos este archivo

function Favoritos() {
  const { favoritosFilms } = useContext(GhibliContext);
  const navigate = useNavigate();

  if (!favoritosFilms || favoritosFilms.length === 0) {
    return (
      <div className="c-favoritos-container c-lista-vacia-ghibli"> {/* Contenedor y clase para mensaje */}
        <h1 className="c-favoritos-titulo-principal">Mis Películas Favoritas</h1>
        <p>Aún no has añadido ninguna película a tus favoritos.</p>
        <p>Ve al detalle de una película y presiona el corazón 🤍 para agregarla.</p>
      </div>
    );
  }

  return (
    <div className="c-favoritos-container">
      <h1 className="c-favoritos-titulo-principal">Mis Películas Favoritas</h1>
      <section className="c-lista-favoritos c-lista-grid"> {/* Reutilizar estructura de cuadrícula */}
        {favoritosFilms.map((film) => (
          <div
            key={film.id}
            className="c-lista-pelicula" // Reutilizar estilos de tarjeta de película de Listar.jsx
            onClick={() => navigate(`/detalle/${film.id}`)}
          >
            {/* Reutilizar la misma estructura de tarjeta que en Listar.jsx */}
            <p><strong>{film.title}</strong> ({film.release_date})</p>
            <img
              src={film.image}
              alt={`Poster de ${film.title}`}
              width='200' // O el tamaño que estés usando en Listar.jsx
              loading='lazy'
            />
            {/* Podrías añadir un pequeño botón o ícono para quitar de favoritos directamente desde aquí si quisieras */}
          </div>
        ))}
      </section>
    </div>
  );
}

export default Favoritos;