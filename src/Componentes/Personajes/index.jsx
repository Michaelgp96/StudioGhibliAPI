// src/Componentes/Personajes/index.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GhibliContext } from '../../Contexto/GhibliContext';
import './style.css'; // Crearemos este archivo para los estilos

function Personajes() {
  const { people, loadingPeople, errorPeople } = useContext(GhibliContext);
  const navigate = useNavigate();

  if (loadingPeople) {
    return (
      <div className="c-estado-carga">
        <p>Cargando personajes de Studio Ghibli...</p>
      </div>
    );
  }

  if (errorPeople) {
    return (
      <div className="c-estado-error">
        <p>Error al cargar personajes: {errorPeople}</p>
      </div>
    );
  }

  if (!people || people.length === 0) {
    return (
      <div className="c-lista-vacia-ghibli">
        <p>No hay personajes para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="c-personajes-container">
      <h1 className="c-personajes-titulo-principal">Personajes de Studio Ghibli</h1>
      <section className="c-lista-personajes c-lista-grid">
        {people.map((person) => (
          <div
            key={person.id}
            className="c-tarjeta-personaje"
            onClick={() => navigate(`/personajes/${person.id}`)} // Navegaremos a un detalle de personaje
          >
            <h2 className="c-tarjeta-personaje-nombre">{person.name}</h2>
            {/* La API de Ghibli no provee imágenes directas para personajes */}
            {/* Podríamos poner un placeholder o icono aquí */}
            <div className="c-tarjeta-personaje-placeholder-img">
              <span>{person.name.substring(0, 1)}</span> {/* Inicial del nombre como placeholder */}
            </div>
            <div className="c-tarjeta-personaje-info">
              <p><strong>Género:</strong> {person.gender || 'No especificado'}</p>
              <p><strong>Edad:</strong> {person.age || 'No especificada'}</p>
              <p><strong>Color de Ojos:</strong> {person.eye_color || 'No especificado'}</p>
              <p><strong>Color de Cabello:</strong> {person.hair_color || 'No especificado'}</p>
              {/* 'species' es una URL, podríamos mostrar el ID o prepararnos para cargar detalles de especie */}
              {/* <p><strong>Especie ID:</strong> {person.species.split('/').pop()}</p> */}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Personajes;