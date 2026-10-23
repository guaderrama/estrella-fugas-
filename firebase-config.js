// Configuración de Firebase compartida por el mural (index.html) y el control del celular (control.html)
export const firebaseConfig = {
  apiKey: "AIzaSyCz_du9pqA8Uye_Sgm4baekxg7ldqGRGko",
  authDomain: "instalacionmariposas.firebaseapp.com",
  projectId: "instalacionmariposas",
  storageBucket: "instalacionmariposas.firebasestorage.app",
  messagingSenderId: "79329581996",
  appId: "1:79329581996:web:a1fa70f3292025b85d3809",
  measurementId: "G-CK7RWVZS20"
};

// Colección de Firestore por donde viajan los mensajes del celular a la pantalla
export const MESSAGES_COLLECTION = "mural-de-luz-mensajes";

// Largo máximo de un mensaje (el control no deja escribir más y la pantalla recorta si llega algo más largo)
export const MAX_MESSAGE_CHARS = 140;
