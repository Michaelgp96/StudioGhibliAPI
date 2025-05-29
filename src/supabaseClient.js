// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// --- COLOCA TUS CREDENCIALES DE SUPABASE DIRECTAMENTE AQUÍ ---
// Asegúrate de que estas sean las URL y Clave Anon PÚBLICA correctas y actuales de tu proyecto Supabase.
const supabaseUrl = 'https://qlvaisqkubputacoberp.supabase.co'; // Ejemplo: 'https://xyz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsdmFpc3FrdWJwdXRhY29iZXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMzYzMDYsImV4cCI6MjA2MjgxMjMwNn0.pUdw6KjaOivei859XQHi2NpddHrhca-1nIo-YApuApM'; // Ejemplo: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdX...'
// --- FIN DE LAS CREDENCIALES DIRECTAS ---

let supabaseInstance = null;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'URL_DE_TU_PROYECTO_SUPABASE_AQUI') {
  console.error(
    "supabaseClient.js: ¡ERROR CRÍTICO! Las credenciales de Supabase no están definidas correctamente en el código." +
    " Reemplaza los placeholders 'URL_DE_TU_PROYECTO_SUPABASE_AQUI' y 'TU_CLAVE_ANON_PUBLIC_DE_SUPABASE_AQUI' con tus valores reales."
  );
} else {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    console.log("supabaseClient.js: Cliente Supabase creado exitosamente con credenciales directas.");
  } catch (error) {
    console.error("supabaseClient.js: Error al crear el cliente de Supabase:", error);
  }
}

export const supabase = supabaseInstance;