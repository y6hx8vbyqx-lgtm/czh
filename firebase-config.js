// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyA...ваш_ключ",
  authDomain: "czhmass.firebaseapp.com",
  projectId: "czhmass",
  storageBucket: "czhmass.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // База данных
const auth = firebase.auth();    // Аутентификация
