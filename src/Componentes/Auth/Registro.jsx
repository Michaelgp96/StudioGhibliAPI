// src/Componentes/Auth/Registro.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Importamos nuestro cliente Supabase
import './style.css'; // o './auth.css'

function Registro() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); // Para mensajes de éxito

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        // Opciones adicionales, como data para el perfil (si tienes la tabla 'profiles' configurada)
        // options: {
        //   data: {
        //     username: 'un_nombre_de_usuario_inicial', // Ejemplo
        //   }
        // }
      });

      if (signUpError) {
        throw signUpError;
      }

      // data.user contendrá el usuario si el registro fue exitoso y la confirmación por email está deshabilitada.
      // Si la confirmación por email está habilitada (por defecto en Supabase),
      // data.user será null aquí y el usuario necesitará confirmar su email.
      // data.session será null hasta que el email sea confirmado.

      if (data.user && data.user.aud === 'authenticated') {
         // Esto sucede si la confirmación por email está deshabilitada
        setMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
        // Podrías redirigir al login o directamente a la app si la sesión se crea
        // navigate('/login');
      } else if (data.user && data.user.aud !== 'authenticated') {
        // Esto sucede si la confirmación por email está HABILITADA
        setMessage('¡Registro exitoso! Por favor, revisa tu correo electrónico para confirmar tu cuenta.');
      } else if (!data.user && !data.session) {
        // Caso donde el usuario ya existe pero no está confirmado (Supabase puede devolver esto)
         setMessage('Por favor, revisa tu correo electrónico para confirmar tu cuenta. Si ya lo hiciste, intenta iniciar sesión.');
      }


    } catch (err) {
      console.error("Error en el registro:", err);
      setError(err.message || 'Ocurrió un error durante el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleRegistro} className="auth-form">
        <h2>Crear una Cuenta</h2>
        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-message">{message}</p>}
        <div>
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarme'}
        </button>
      </form>
    </div>
  );
}

export default Registro;