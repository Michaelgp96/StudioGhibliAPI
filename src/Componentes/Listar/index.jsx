import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Filtro from "../Filtros";

function Listar() {
  const [data, setData] = useState([]); // Estado para almacenar los datos de Pokémon
  const [busqueda, setBusqueda] = useState(''); // Estado para almacenar la búsqueda
  const [tipoSeleccionado, setTipoSeleccionado] = useState('All'); // Estado para el tipo de Pokémon
  const navigate = useNavigate(); // Hook para la navegación
  
  
  // useEffect que se ejecuta cuando tipoSeleccionado cambia
  useEffect(() => {
    const obtenerDatos = async () => {
      let url = "https://pokeapi.co/api/v2/pokemon?limit=1025"; // URL base para obtener todos los Pokémon

      // Si se ha seleccionado un tipo específico, modificamos la URL para buscar por tipo
      if (tipoSeleccionado !== 'All') {
        url = `https://pokeapi.co/api/v2/type/${tipoSeleccionado}`;
      }

      const res = await fetch(url);
      const json = await res.json();
      if (tipoSeleccionado === 'All') {
        setData(json.results); // Guarda los datos de Pokémon si no hay filtro de tipo
      } else {
        // Si hay un filtro de tipo, extraemos solo los Pokémon del tipo seleccionado
        const listaFiltrada = json.pokemon.map(p => p.pokemon); 
        setData(listaFiltrada); 
      }
    };

    obtenerDatos(); 
  }, [tipoSeleccionado]); 

  const handleTipoChange = (tipo) => {
    setTipoSeleccionado(tipo); 
  };

  let resultados = data;

  if (busqueda.length >= 3 && isNaN(busqueda)) {
    resultados = data.filter(pokemon =>
      pokemon.name.toLowerCase().includes(busqueda.toLowerCase())
    );
  }
  if (!isNaN(busqueda)) {
    resultados = data.filter(pokemon =>
      pokemon.url.includes('/' + busqueda)
    );
  }

  return (
    <>
     <input
        type="text"
        placeholder="Buscar Pokémon"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="c-buscador"
      />
      <Filtro onTipoChange={handleTipoChange} /> {}
      <section className='c-lista'>
        {/* Mapea los datos y muestra los Pokémon */}
        {resultados.map((pokemon, index) => (
          <div 
            className='c-lista-pokemon'
            onClick={() => navigate(`/detalle/${pokemon.name}`)} // Redirige al detalle del Pokémon
            key={index}
          >
            {/* Extrae el ID del Pokémon desde la URL para usarlo en la imagen */}
            <p>{pokemon.url.split("/")[6]}</p>
            <img 
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.url.split("/")[6]}.png`} 
              alt={`Pokémon ${pokemon.name}`} 
              width='200' 
              height='200' 
              loading='lazy'
            />
            <p>{pokemon.name}</p>
          </div>
        ))}
      </section>
    </>
  );
}

export default Listar;