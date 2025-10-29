// frontend/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGANW9fpWq1UrHrTj3ZHb2CTCAzhw41zg",
  authDomain: "storyspark-ai-914b9.firebaseapp.com",
  projectId: "storyspark-ai-914b9",
  storageBucket: "storyspark-ai-914b9.appspot.com",
  messagingSenderId: "951600914209",
  appId: "1:951600914209:web:827ba5e63fc7648d55a860",
  measurementId: "G-M8Y97ZHQJ5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
