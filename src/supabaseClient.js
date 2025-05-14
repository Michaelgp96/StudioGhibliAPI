// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// MANTÉN ESTOS CONSOLE.LOG POR AHORA:
console.log('VITE_SUPABASE_URL desde .env:', supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY desde .env:', supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error CRÍTICO: Variables de entorno de Supabase NO CARGADAS desde .env. Verifica tu archivo .env y los nombres de las variables (deben empezar con VITE_).");
  // Considera no crear el cliente si estas son undefined para evitar más errores.
  // O exportar un objeto que indique el error.
}

// Solo intenta crear el cliente si la URL y la clave están presentes
export const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

if (supabase) {
  console.log('Cliente Supabase creado exitosamente usando variables de .env');
} else if (supabaseUrl && supabaseAnonKey) {
  // Esto no debería pasar si createClient funciona, pero es una verificación extra
  console.error('Error al crear el cliente Supabase a pesar de tener URL y Key.');
}