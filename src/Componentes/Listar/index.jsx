// En Listar.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './style.css'
// import Filtro from "../Filtros"; // Ya no lo necesitamos aquí por ahora

function Listar() {
  const [films, setFilms] = useState([]); // Renombrar estado para claridad
  const [busqueda, setBusqueda] = useState('');
  // const [tipoSeleccionado, setTipoSeleccionado] = useState('All'); // Ya no es necesario
  const navigate = useNavigate();

  // useEffect para obtener las películas de Ghibli
  useEffect(() => {
    const obtenerPeliculas = async () => {
      try { // Buena práctica: usar try...catch para manejo de errores
        const url = "https://ghibliapi.vercel.app/films"; // URL de la API Ghibli
        const res = await fetch(url);
        if (!res.ok) { // Verificar si la respuesta fue exitosa
           throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setFilms(data); // Ghibli API devuelve directamente el array de películas
      } catch (error) {
        console.error("Error fetching Ghibli films:", error);
        // Aquí podrías setear un estado de error para mostrarlo en la UI
      }
    };

    obtenerPeliculas();
  }, []); // Ejecutar solo una vez al montar el componente

  // --- Lógica de Búsqueda (Adaptar si es necesario) ---
  // La búsqueda actual busca en 'pokemon.name'. Necesitas adaptarla para 'film.title'.
  let resultados = films;
  if (busqueda.length >= 1) { // Buscar por título
    resultados = films.filter(film =>
      film.title.toLowerCase().includes(busqueda.toLowerCase())
    );
  }
   // La búsqueda por ID (isNaN) probablemente no aplique igual aquí, considerar quitarla o adaptarla si Ghibli tiene IDs numéricos buscables.

  // --- Adaptar el Renderizado ---
  return (
    <>
      <input
        type="text"
        placeholder="Buscar Película de Ghibli por título" // Actualizar placeholder
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="c-buscador" // Mantener o cambiar clase CSS si es necesario
      />
      {/* <Filtro onTipoChange={handleTipoChange} />  Quitamos el filtro de tipos */}
      <section className='c-lista'> {/* Mantener o cambiar clase CSS */}
        {resultados.map((film) => ( // Iterar sobre 'films'
          <div
            className='c-lista-pelicula' // Cambiar clase CSS si quieres estilos diferentes
            // Para navegar al detalle, Ghibli usa 'id' (un UUID string), no 'name'.
            // Asegúrate que tu ruta /detalle/:id pueda manejar esto.
            onClick={() => navigate(`/detalle/${film.id}`)}
            key={film.id} // Usar el 'id' único de la película como key
          >
            {/* Mostrar datos relevantes de la película */}
            <p><strong>{film.title}</strong> ({film.release_date})</p>
            <img
               src={film.image} // Ghibli API provee una URL de imagen directamente
               alt={`Poster de ${film.title}`}
               width='500' // Ajustar tamaño si es necesario
               // height='...' // Puedes quitar height para mantener proporción
               loading='lazy'
            />
             {/* <p>Director: {film.director}</p> */}
             {/* Puedes añadir más info si quieres */}
          </div>
        ))}
      </section>
    </>
  );
}

export default Listar;