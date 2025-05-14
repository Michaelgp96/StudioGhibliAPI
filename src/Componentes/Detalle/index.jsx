// src/Componentes/Detalle/index.jsx
import { useState, useEffect, useContext } from "react"; // useContext añadido
import { useParams, Link } from "react-router-dom"; // Link añadido por si lo necesitamos
import './style.css';
import { GhibliContext } from '../../Contexto/GhibliContext'; // 1. Importar el Contexto

function Detalle() {
  const { id: filmIdFromParams } = useParams(); // Renombrar 'id' para evitar confusión con ids de film

  // 2. Consumir el estado de las películas del contexto
  const { films, loadingFilms, errorFilms } = useContext(GhibliContext);

  const [filmDetail, setFilmDetail] = useState(null);
  // El estado 'loading' y 'error' local ahora dependerá más del estado del contexto
  // y de si encontramos la película.
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    setLocalLoading(true); // Iniciar carga local
    setLocalError(null);   // Resetear error local
    setFilmDetail(null);   // Resetear detalle

    if (loadingFilms) {
      // Si el contexto aún está cargando las películas, no hacemos nada más aquí,
      // esperamos a que el contexto termine. El renderizado condicional se encargará.
      // Mantenemos localLoading en true.
      return;
    }

    if (errorFilms) {
      // Si hubo un error al cargar las películas en el contexto, lo reflejamos localmente.
      setLocalError(`Error general al cargar datos de películas: ${errorFilms}`);
      setLocalLoading(false);
      return;
    }

    // Si las películas del contexto ya se cargaron y no hay error general:
    if (films && films.length > 0) {
      const foundFilm = films.find(film => film.id === filmIdFromParams);

      if (foundFilm) {
        setFilmDetail(foundFilm);
        setLocalError(null);
      } else {
        setLocalError(`No se encontró una película con el ID: ${filmIdFromParams}`);
      }
    } else if (!loadingFilms) {
      // Films no está cargando, pero el array 'films' está vacío o no existe (y no hubo errorFilms)
      setLocalError("No hay datos de películas disponibles en el contexto.");
    }
    setLocalLoading(false); // La búsqueda local (o intento) ha terminado

    // 3. ELIMINAR el fetch individual que estaba aquí.
    //    La lógica ahora se basa en encontrar la película en los 'films' del contexto.
    /*
    const obtenerDetallePelicula = async () => {
      // ... lógica de fetch individual anterior ...
    };
    obtenerDetallePelicula();
    */

  }, [filmIdFromParams, films, loadingFilms, errorFilms]); // Dependencias del efecto

  // --- Renderizado Condicional ---
  if (localLoading || loadingFilms) { // Considerar también loadingFilms del contexto
    return <div className="c-detalle-mensaje">Cargando detalles de la película...</div>;
  }

  if (localError) {
    return <div className="c-detalle-mensaje c-detalle-error">Error: {localError}</div>;
  }

  if (!filmDetail) {
    return <div className="c-detalle-mensaje">No se encontraron detalles para esta película.</div>;
  }

  // --- Renderizado de los Detalles (tu código existente, prácticamente sin cambios) ---
  return (
    <div className="c-detalle-pelicula">
      <h2>{filmDetail.title} ({filmDetail.release_date})</h2>
      <h4>{filmDetail.original_title} / {filmDetail.original_title_romanised}</h4>

      {filmDetail.movie_banner && (
        <img
          src={filmDetail.movie_banner}
          alt={`Banner de ${filmDetail.title}`}
          className="c-detalle-imagen-banner" // Añadida clase para diferenciar del poster
        />
      )}

      <p><strong>Director:</strong> {filmDetail.director}</p>
      <p><strong>Productor:</strong> {filmDetail.producer}</p>
      <p><strong>Puntuación Rotten Tomatoes:</strong> {filmDetail.rt_score}%</p>
      <p className="c-detalle-descripcion"><strong>Descripción:</strong> {filmDetail.description}</p>

      {filmDetail.image && (!filmDetail.movie_banner || filmDetail.movie_banner === filmDetail.image) && (
        // Mostrar poster si no hay banner, o si el banner es la misma imagen que el poster
        // (algunas películas en la API usan la misma URL para image y movie_banner)
        <img
          src={filmDetail.image}
          alt={`Poster de ${filmDetail.title}`}
          className="c-detalle-imagen-poster" // Añadida clase
        />
      )}
      
      {/* Aquí es donde podríamos empezar a listar Personajes, Locaciones, etc.
        que están vinculados a esta película. Por ejemplo:
        <h3>Personajes:</h3>
        <ul>
          {filmDetail.people && filmDetail.people.map(personUrl => {
            // Aquí necesitaríamos una forma de obtener el nombre del personaje a partir de su URL
            // o tener los datos de todos los personajes en el contexto.
            // Por ahora, solo mostraremos la URL o un ID extraído.
            const personId = personUrl.split('/').pop();
            return <li key={personId}><Link to={`/personajes/${personId}`}>Personaje ID: {personId}</Link></li>;
          })}
          {(!filmDetail.people || filmDetail.people.length === 0 || filmDetail.people[0].includes("TODO")) && <li>No hay personajes específicos listados para esta película.</li>}
        </ul>
        (Similar para locations, species, vehicles)
      */}
    </div>
  );
}

export default Detalle;