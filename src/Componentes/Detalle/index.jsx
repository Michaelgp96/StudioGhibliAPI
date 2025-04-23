// En src/Componentes/Detalle/index.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './style.css'; // Asegúrate que los estilos siguen siendo adecuados o ajústalos

function Detalle() {
  const [filmDetail, setFilmDetail] = useState(null); // Inicializar como null
  const [loading, setLoading] = useState(true); // Estado para la carga
  const [error, setError] = useState(null); // Estado para errores
  const { id } = useParams(); // Obtener el 'id' de la URL (asegúrate que la ruta en App.jsx sea /detalle/:id)

  useEffect(() => {
    // Resetear estados al cambiar de ID
    setLoading(true);
    setError(null);
    setFilmDetail(null);

    const obtenerDetallePelicula = async () => {
      try {
        const url = `https://ghibliapi.vercel.app/films/${id}`; // Endpoint de Ghibli para detalle
        const res = await fetch(url);
        if (!res.ok) {
          // Si la película no se encuentra (404) u otro error HTTP
          throw new Error(`Error ${res.status}: No se pudo obtener la información de la película.`);
        }
        const responseData = await res.json();
        setFilmDetail(responseData); // Guardar los detalles de la película
      } catch (error) {
        console.error("Error fetching Ghibli film details:", error);
        setError(error.message); // Guardar el mensaje de error
      } finally {
        setLoading(false); // Terminar la carga, con éxito o error
      }
    };

    obtenerDetallePelicula();
  }, [id]); // El efecto se ejecuta cuando el 'id' cambia

  // --- Renderizado Condicional ---
  if (loading) {
    return <div>Cargando detalles de la película...</div>; // Mensaje mientras carga
  }

  if (error) {
    return <div>Error: {error}</div>; // Mensaje si hubo un error
  }

  if (!filmDetail) {
    // Esto no debería pasar si loading es false y no hay error, pero es una buena guarda
    return <div>No se encontraron detalles para esta película.</div>;
  }

  // --- Renderizado de los Detalles ---
  return (
    // Puedes usar un div contenedor principal, quizás con una clase específica
    <div className="c-detalle-pelicula"> {/* Cambiar/Ajustar clase CSS */}
      <h2>{filmDetail.title} ({filmDetail.release_date})</h2>
      <h4>{filmDetail.original_title} / {filmDetail.original_title_romanised}</h4>

      {/* Puedes usar el banner como imagen principal si existe */}
      {filmDetail.movie_banner && (
         <img
           src={filmDetail.movie_banner}
           alt={`Banner de ${filmDetail.title}`}
           style={{ width: '80%', height: 'auto', marginBottom: '20px' }} // Estilo ejemplo
         />
      )}

      <p><strong>Director:</strong> {filmDetail.director}</p>
      <p><strong>Productor:</strong> {filmDetail.producer}</p>
      <p><strong>Puntuación Rotten Tomatoes:</strong> {filmDetail.rt_score}%</p>

      <p><strong>Descripción:</strong> {filmDetail.description}</p>

       {/* Si quieres mostrar el poster también */}
       {filmDetail.image && !filmDetail.movie_banner && ( // Mostrar poster si no hay banner
          <img
            src={filmDetail.image}
            alt={`Poster de ${filmDetail.title}`}
            style={{ width: '200px', height: 'auto', marginTop: '20px' }} // Estilo ejemplo
          />
       )}

      {/* Elimina los elementos específicos de Pokémon como ID numérico, altura, peso */}
    </div>
  );
}

export default Detalle;