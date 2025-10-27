// js/firebase-config.js
// **IMPORTANTE: Las variables deben ser globales (usando 'var' o sin 'const/let' si es posible)**

// Configuración de tu proyecto Firebase
var firebaseConfig = {
    apiKey: "AIzaSyCWfmeeyJ4eQfv_tpXjf6uQDHFkV9C62Ac",
    authDomain: "bem-estar-escolar-57d42.firebaseapp.com",
    projectId: "bem-estar-escolar-57d42",
    storageBucket: "bem-estar-escolar-57d42.firebasestorage.app",
    messagingSenderId: "83601836201",
    appId: "1:83601836201:web:ee8b526b6ae94452d4c1b8",
};

// Inicializar Firebase
var app = firebase.initializeApp(firebaseConfig);

// Obtener referencias de servicios (HACERLAS GLOBALES)
var auth = app.auth();
var db = app.firestore();

// Muestra un mensaje en la consola para confirmar que Firebase se inicializó.
console.log("Firebase inicializado y servicios 'auth' y 'db' definidos globalmente.");
