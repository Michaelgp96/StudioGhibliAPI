import { useState } from "react";
import "./style.css"
import { Link } from 'react-router-dom';

function Menu() {
    return (
        <nav className="c-menu">
          <Link to="/">Listar</Link>
          <Link to="/Original">Original</Link>
          <Link to="/Aleatorio">Aleatorio</Link>
          <Link to="/Usuario">Usuario</Link>
          <Link to="/Favoritos">Favoritos</Link>
          <Link to="/Personajes">Personajes</Link>
          

        </nav>
    )
  }
 
  export default Menu



