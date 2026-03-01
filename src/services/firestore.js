import { collection, addDoc, getDocs, doc, getDoc, updateDoc, setDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';

export const createUserProfile = async (userId, profileData) => {
    try {
        await setDoc(doc(db, 'users', userId), profileData);
    } catch (error) {
        console.error("Error creating user profile: ", error);
        throw error;
    }
};

export const getUserProfile = async (userId) => {
    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting user profile: ", error);
        throw error;
    }
};
