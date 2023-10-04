import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD6zDbOUiP1xcaKq04XlWhbTaV9Ehzq-Cc",
  authDomain: "supertictactoe-132fb.firebaseapp.com",
  databaseURL: "https://supertictactoe-132fb-default-rtdb.firebaseio.com",
  projectId: "supertictactoe-132fb",
  storageBucket: "supertictactoe-132fb.appspot.com",
  messagingSenderId: "312329876751",
  appId: "1:312329876751:web:ae11100da2cdd6c88c3a7a"
}

export const firebaseApp = initializeApp(firebaseConfig)
