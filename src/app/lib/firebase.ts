import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';

 
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.FIREBASE_APP_ID || "",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || ""
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 设置玩家分数
export async function setPlayerScore(player: string, score: number): Promise<void> {
  const docRef = doc(db, 'blackjack', player);
  await setDoc(docRef, {
    score: score,
  }, { merge: true });
}

// 获取玩家分数
export async function getPlayerScore(player: string): Promise<number | null> {
  const docRef = doc(db, 'blackjack', player);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data().score || 0;
  } else {
    return null;
  }
}

// 增加玩家分数
export async function incrementPlayerScore(playerAddress: string, points: number = 1): Promise<void> {
  const docRef = doc(db, 'blackjack', playerAddress);
  
  // 先检查文档是否存在
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, {
      score: increment(points),
      lastUpdated: new Date().toISOString()
    });
  } else {
    // 如果文档不存在，创建新文档
    await setDoc(docRef, {
      player: playerAddress,
      score: points,
      lastUpdated: new Date().toISOString()
    });
  }
}