import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
export const db: Firestore = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Collection references
export const seedsCollection = collection(db, 'seeds');
export const diagnosesCollection = collection(db, 'diagnoses');
export const recommendationsCollection = collection(db, 'recommendations');
export const weatherCollection = collection(db, 'weather');
export const chatMessagesCollection = collection(db, 'chatMessages');

// Helper functions for Firestore operations
export const firebaseService = {
  // Seeds
  getSeeds: async () => {
    const seedSnapshot = await getDocs(seedsCollection);
    return seedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  getSeedById: async (id: string) => {
    const seedDoc = await getDoc(doc(db, 'seeds', id));
    return seedDoc.exists() ? { id: seedDoc.id, ...seedDoc.data() } : null;
  },
  
  createSeed: async (seedData: any) => {
    const docRef = doc(seedsCollection);
    await setDoc(docRef, seedData);
    return { id: docRef.id, ...seedData };
  },
  
  updateSeed: async (id: string, seedData: any) => {
    const seedRef = doc(db, 'seeds', id);
    await updateDoc(seedRef, seedData);
    return { id, ...seedData };
  },
  
  deleteSeed: async (id: string) => {
    await deleteDoc(doc(db, 'seeds', id));
  },
  
  // Diagnoses
  getDiagnoses: async () => {
    const diagnosisSnapshot = await getDocs(diagnosesCollection);
    return diagnosisSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  createDiagnosis: async (diagnosisData: any) => {
    const docRef = doc(diagnosesCollection);
    await setDoc(docRef, diagnosisData);
    return { id: docRef.id, ...diagnosisData };
  },
  
  // Recommendations
  getRecommendations: async () => {
    const recSnapshot = await getDocs(recommendationsCollection);
    return recSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  createRecommendation: async (recData: any) => {
    const docRef = doc(recommendationsCollection);
    await setDoc(docRef, recData);
    return { id: docRef.id, ...recData };
  },
  
  // Weather
  getWeatherData: async () => {
    const weatherSnapshot = await getDocs(query(weatherCollection, orderBy('timestamp', 'desc'), limit(1)));
    if (!weatherSnapshot.empty) {
      const doc = weatherSnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  },
  
  saveWeatherData: async (weatherData: any) => {
    const docRef = doc(weatherCollection);
    await setDoc(docRef, { ...weatherData, timestamp: new Date() });
    return { id: docRef.id, ...weatherData };
  },
  
  // Chat
  getChatMessages: async () => {
    const msgSnapshot = await getDocs(query(chatMessagesCollection, orderBy('timestamp', 'asc')));
    return msgSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  addChatMessage: async (messageData: any) => {
    const docRef = doc(chatMessagesCollection);
    await setDoc(docRef, { ...messageData, timestamp: new Date() });
    return { id: docRef.id, ...messageData };
  },
  
  // File upload
  uploadFile: async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }
};

export default app;