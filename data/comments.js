import { db, auth, provider } from "../src/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import { signInWithPopup, signOut } from "firebase/auth";

const COLLECTION_NAME = "comments";

export const loginUser = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Login failed", error);
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const subscribeToComments = (idMeal, onUpdate) => {
  if (!idMeal) {
    onUpdate([]);
    return () => {};
  }

  const q = query(
    collection(db, COLLECTION_NAME),
    where("mealId", "==", idMeal),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => {
      const docData = doc.data();
      return {
        id: doc.id,
        ...docData,
        createdAt: docData.createdAt
          ? docData.createdAt.toDate().toISOString()
          : new Date().toISOString(),
      };
    });
    onUpdate(data);
  });
};

export const postComment = async (text, user, idMeal) => {
  if (!text.trim() || !user || !idMeal) return;

  await addDoc(collection(db, COLLECTION_NAME), {
    text: text,
    uid: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
    mealId: idMeal,
    createdAt: new Date(),
  });
};

export const editComment = async (commentId, newText) => {
  if (!newText.trim()) return;
  const commentRef = doc(db, COLLECTION_NAME, commentId);
  await updateDoc(commentRef, {
    text: newText,
  });
};

export const removeComment = async (commentId) => {
  await deleteDoc(doc(db, COLLECTION_NAME, commentId));
};
