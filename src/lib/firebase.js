import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Reemplaza con tus credenciales de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBDh0wZy52RrOrQ0XOkAa2BFa7y7bLGARQ",
  authDomain: "beverage-warehouse-mvp.firebaseapp.com",
  projectId: "beverage-warehouse-mvp",
  storageBucket: "beverage-warehouse-mvp.firebasestorage.app",
  messagingSenderId: "700953591013",
  appId: "1:700953591013:web:96e1ef2a4e97977e55680c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
