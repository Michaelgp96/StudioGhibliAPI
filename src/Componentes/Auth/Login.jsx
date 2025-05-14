// src/Componentes/Auth/Login.jsx
import React, { useState, useContext } from 'react'; // useContext lo usaremos pronto
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Importamos nuestro cliente Supabase
// import { GhibliContext } from '../../Contexto/GhibliContext'; // Lo necesitaremos para actualizar el estado del usuario
import './style.css'; // o './auth.css' si es compartido

function Login() {
  const navigate = useNavigate();
  // const { setUserSession } = useContext(GhibliContext); // Ejemplo de cómo podríamos obtener una función del contexto para actualizar la sesión del usuario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        throw signInError;
      }

      // Si el login es exitoso, data.user y data.session contendrán la información.
      // Aquí es donde actualizaremos el estado global de la aplicación para reflejar que el usuario ha iniciado sesión.
      // Por ahora, solo mostraremos un mensaje y redirigiremos.

      // console.log("Usuario logueado:", data.user);
      // console.log("Sesión:", data.session);
      // if (setUserSession) setUserSession(data.session); // Ejemplo

      setMessage('¡Inicio de sesión exitoso! Redirigiendo...');
      setTimeout(() => {
        navigate('/'); // Redirigir a la página principal o al perfil de usuario
      }, 1500); // Pequeña demora para que el usuario vea el mensaje

    } catch (err) {
      console.error("Error en el inicio de sesión:", err);
      if (err.message === "Invalid login credentials") {
        setError("Credenciales de inicio de sesión inválidas. Por favor, verifica tu email y contraseña.");
      } else if (err.message === "Email not confirmed") {
        setError("Tu correo electrónico aún no ha sido confirmado. Por favor, revisa tu bandeja de entrada.");
        // Podríamos añadir un botón para reenviar email de confirmación aquí
      } else {
        setError(err.message || 'Ocurrió un error durante el inicio de sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Iniciar Sesión</h2>
        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-message">{message}</p>}
        <div>
          <label htmlFor="login-email">Correo Electrónico:</label>
          <input
            id="login-email" // Diferente id del input de registro para el label
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label htmlFor="login-password">Contraseña:</label>
          <input
            id="login-password" // Diferente id
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Tu contraseña"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
        <p className="auth-link">
          ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
        {/* Podríamos añadir un enlace para "Olvidé mi contraseña" aquí en el futuro */}
      </form>
    </div>
  );
}

export default Login;