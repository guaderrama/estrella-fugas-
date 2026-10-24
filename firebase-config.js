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

// Colección de Firestore por donde viajan los mensajes del celular a la pantalla (se borran al salir en pantalla)
export const MESSAGES_COLLECTION = "mural-de-luz-mensajes";

// Respaldo: cada mensaje que ya salió en pantalla (para el modo recuerdo, el póster y para que el corazón no se vacíe al recargar)
export const HISTORY_COLLECTION = "mural-de-luz-historia";

// Estado compartido de la noche: cuándo empezó y la cuenta regresiva colectiva
export const STATE_DOC = ["mural-de-luz-estado", "noche"];

// Largo máximo de un mensaje (el control no deja escribir más y la pantalla recorta si llega algo más largo)
export const MAX_MESSAGE_CHARS = 140;

// Colores de luz que la persona puede escoger (vivos pero suaves, como el resto del mural)
export const LIGHT_COLORS = {
  oro:      { rgb: [242, 196, 109], name: { es: "Oro", en: "Gold" } },
  rosa:     { rgb: [236, 143, 186], name: { es: "Rosa", en: "Rose" } },
  cielo:    { rgb: [126, 196, 236], name: { es: "Cielo", en: "Sky" } },
  jade:     { rgb: [150, 214, 168], name: { es: "Jade", en: "Jade" } },
  lavanda:  { rgb: [184, 164, 240], name: { es: "Lavanda", en: "Lavender" } }
};
export const DEFAULT_COLOR = "oro";

// Una "noche" dura como máximo esto; después, la pantalla empieza una nueva sola (también se puede empezar con la tecla N)
export const NIGHT_MAX_HOURS = 14;
