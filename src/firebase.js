import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";

// Firebase configuration (using existing project)
const firebaseConfig = {
    apiKey: "AIzaSyDLFl9158CJjNlA_pIN7Sc_MooKMyR5mvY",
    authDomain: "aura-notes-fbcbc.firebaseapp.com",
    projectId: "aura-notes-fbcbc",
    storageBucket: "aura-notes-fbcbc.firebasestorage.app",
    messagingSenderId: "49038090824",
    appId: "1:49038090824:web:ff2ef1785001c04bdf2e7d",
    measurementId: "G-PXGW61YK6N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/**
 * Add a new newsletter subscriber
 * @param {string} email - Subscriber email
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const addNewsletterSubscriber = async (email) => {
    try {
        // Check if email already exists
        const subscribersRef = collection(db, 'nerdism_newsletter');
        const q = query(subscribersRef, where('email', '==', email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return { success: false, message: 'Email already subscribed!' };
        }

        // Add new subscriber
        await addDoc(collection(db, 'nerdism_newsletter'), {
            email: email.toLowerCase(),
            subscribedAt: serverTimestamp(),
            source: 'website'
        });

        return { success: true, message: 'Successfully subscribed!' };
    } catch (error) {
        console.error('[Newsletter] Error adding subscriber:', error);
        return { success: false, message: 'Failed to subscribe. Please try again.' };
    }
};
