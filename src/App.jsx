import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css'
import Listar from './Componentes/Listar'
import Original from './Componentes/Original'
import Aleatorio from './Componentes/Aleatorio'
import Detalle from './Componentes/Detalle'
import Favoritos from './Componentes/Favoritos'
import Usuario from './Componentes/Usuario'
import Menu from './Componentes/Menu';

function App() {

  return (
    <Router>
      <Menu />
      <Routes>
      <Route path="/"element={<Listar />} />
        <Route path="/Usuario " element={<Usuario />} />
        <Route path="/Aleatorio" element={<Aleatorio />} />
        <Route path="/Original" element={<Original />} />
        <Route path="/Favoritos" element={<Favoritos />} />
        <Route path="/Detalle/:id" element={<Detalle />} />
      </Routes>

    </Router>
  )
}

export default App
