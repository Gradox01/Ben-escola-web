// js/firebase-init.js

// 1. TUS CLAVES DE CONFIGURACIÓN
const firebaseConfig = {
  apiKey: "AIzaSyCWfmeeyJ4eQfv_tpXjf6uQDHFkV9C62Ac",
  authDomain: "bem-estar-escolar-57d42.firebaseapp.com",
  projectId: "bem-estar-escolar-57d42",
  storageBucket: "bem-estar-escolar-57d42.firebasestorage.app",
  messagingSenderId: "83601836201",
  appId: "1:83601836201:web:ee8b526b6ae94452d4c1b8",
  measurementId: "G-S7BD94ECVG"
};

// 2. INICIALIZACIÓN DE LA APLICACIÓN
// Nota: 'firebase' debe estar definido, lo haremos en el Paso 3 con los scripts CDN
const app = firebase.initializeApp(firebaseConfig);

// 3. OBTENER LOS SERVICIOS QUE NECESITAMOS
// Hacemos que estas variables sean globales para usarlas en otros scripts (como login.js)
const auth = firebase.auth(); 
const db = firebase.firestore(); 

console.log("Firebase y servicios inicializados correctamente.");