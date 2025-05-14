// src/Componentes/Listar/index.jsx
import { useState, useEffect, useContext } from "react"; // 1. Importar useContext
import { useNavigate } from "react-router-dom";
import './style.css';
// import Filtro from "../Filtros"; // El filtro de tipos de Pokémon no aplica aquí directamente.
                                 // Podríamos tener otro tipo de filtros para Ghibli más adelante.

// 2. Importar el GhibliContext
import { GhibliContext } from '../../Contexto/GhibliContext'; // Ajusta la ruta si es necesario

function Listar() {
  // 3. Consumir los datos de películas, el estado de carga y el error del contexto
  const { films, loadingFilms, errorFilms } = useContext(GhibliContext);

  const [busqueda, setBusqueda] = useState(''); // El estado de búsqueda sigue siendo local
  const navigate = useNavigate();

  // 4. ELIMINAR el useEffect que hacía el fetch local de películas.
  //    El GhibliContext ahora se encarga de esto.
  /*
  useEffect(() => {
    const obtenerPeliculas = async () => {
      // ... lógica de fetch anterior ...
    };
    obtenerPeliculas();
  }, []);
  */

  // --- Lógica de Búsqueda (opera sobre los 'films' del contexto) ---
  let resultados = films || []; // Usar 'films' del contexto. Asegurar que sea un array.
  if (busqueda.trim().length >= 1) {
    resultados = (films || []).filter(film => // Asegurar que films no sea null/undefined antes de filtrar
      film.title.toLowerCase().includes(busqueda.toLowerCase().trim())
    );
  }

  // 5. Manejar los estados de Carga y Error provenientes del Contexto
  if (loadingFilms) {
    return (
      <div className="c-estado-carga">
        <p>Cargando películas de Studio Ghibli...</p>
        {/* Aquí podrías poner un spinner o animación de carga */}
      </div>
    );
  }

  if (errorFilms) {
    return (
      <div className="c-estado-error">
        <p>Error al cargar películas: {errorFilms}</p>
        <p>Por favor, intenta recargar la página más tarde.</p>
      </div>
    );
  }

  // --- Renderizado ---
  return (
    <div className="c-listar-container-ghibli"> {/* Nueva clase contenedora para estilos específicos */}
      <input
        type="text"
        placeholder="Buscar Película de Ghibli por título"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="c-buscador" // Puedes reutilizar tus estilos de c-buscador
      />
      {/* Aquí podríamos añadir filtros específicos para Ghibli en el futuro,
          como por director, año de lanzamiento, etc. */}

      {resultados.length > 0 ? (
        <section className='c-lista'> {/* Reutiliza tus estilos de c-lista */}
          {resultados.map((film) => (
            <div
              className='c-lista-pelicula' // Reutiliza tus estilos de c-lista-pelicula
              onClick={() => navigate(`/detalle/${film.id}`)} // Navega usando el id de la película
              key={film.id}
            >
              <p><strong>{film.title}</strong> ({film.release_date})</p>
              <img
                src={film.image}
                alt={`Poster de ${film.title}`}
                width='200' // Ajustado para que quepan más en la cuadrícula, puedes cambiarlo
                loading='lazy'
              />
              {/* Podrías mostrar el director o la puntuación aquí si quieres más info en la tarjeta */}
              {/* <p className="c-lista-pelicula-director">Director: {film.director}</p> */}
            </div>
          ))}
        </section>
      ) : (
        <p className="c-lista-vacia-ghibli">
          {busqueda.trim() !== '' ? `No se encontraron películas para "${busqueda}".` : "No hay películas para mostrar."}
        </p>
      )}
    </div>
  );
}

export default Listar;