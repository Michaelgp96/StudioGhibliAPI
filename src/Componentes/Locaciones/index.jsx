// src/Componentes/Locaciones/index.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Para futura navegación a detalle de locación
import { GhibliContext } from '../../Contexto/GhibliContext'; // Ajusta la ruta si es necesario
import './style.css'; // Crearemos este archivo para los estilos

function Locaciones() {
  const { locations, loadingLocations, errorLocations } = useContext(GhibliContext);
  const navigate = useNavigate();

  if (loadingLocations) {
    return (
      <div className="c-estado-carga">
        <p>Cargando locaciones de Studio Ghibli...</p>
      </div>
    );
  }

  if (errorLocations) {
    return (
      <div className="c-estado-error">
        <p>Error al cargar locaciones: {errorLocations}</p>
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="c-lista-vacia-ghibli">
        <p>No hay locaciones para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="c-locaciones-container">
      <h1 className="c-locaciones-titulo-principal">Locaciones de Studio Ghibli</h1>
      <section className="c-lista-locaciones c-lista-grid">
        {locations.map((location) => (
          <div
            key={location.id}
            className="c-tarjeta-locacion"
            // onClick={() => navigate(`/locaciones/${location.id}`)} // Para futura vista de detalle
          >
            <h2 className="c-tarjeta-locacion-nombre">{location.name}</h2>
            <div className="c-tarjeta-locacion-info">
              <p><strong>Clima:</strong> {location.climate || 'No especificado'}</p>
              <p><strong>Terreno:</strong> {location.terrain || 'No especificado'}</p>
              <p><strong>Agua Superficial:</strong> {location.surface_water || 'No especificado'}%</p>
              {/* 'films' y 'residents' son arrays de URLs.
                  Podríamos mostrar cuántas películas/residentes o prepararnos para listarlos.
                  Por ahora, solo un conteo o un placeholder.
              */}
              <p><strong>Aparece en:</strong> {location.films.length > 0 && !location.films[0].includes("TODO") ? `${location.films.length} película(s)` : 'Info no disponible'}</p>
              <p><strong>Residentes Notables:</strong> {location.residents.length > 0 && !location.residents[0].includes("TODO") ? `${location.residents.length} listado(s)` : 'Info no disponible'}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Locaciones;