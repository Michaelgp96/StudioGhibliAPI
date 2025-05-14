// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// 1. Importar el GhibliProvider
import { GhibliProvider } from './Contexto/GhibliContext'; // Asegúrate que la ruta sea correcta

import './App.css';
import Listar from './Componentes/Listar';
import Original from './Componentes/Original';
import Aleatorio from './Componentes/Aleatorio';
import Detalle from './Componentes/Detalle';
import Favoritos from './Componentes/Favoritos';
import Usuario from './Componentes/Usuario';
import Menu from './Componentes/Menu';
import Personajes from './Componentes/Personajes';

function App() {
  return (
    // 2. Envolver el Router (o su contenido) con GhibliProvider
    <GhibliProvider>
      <Router>
        <Menu />
        <Routes>
          <Route path="/" element={<Listar />} />
          <Route path="/Usuario" element={<Usuario />} /> {/* Cuidado: hay un espacio en "/Usuario " en tu código original, lo quité */}
          <Route path="/Aleatorio" element={<Aleatorio />} />
          <Route path="/Original" element={<Original />} />
          <Route path="/Favoritos" element={<Favoritos />} />
          <Route path="/Personajes" element={<Personajes />} />
          <Route path="/Detalle/:id" element={<Detalle />} />
        </Routes>
      </Router>
    </GhibliProvider>
  );
}

export default App;