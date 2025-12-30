import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
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
export const storage = getStorage(app);

// ==========================================
// ADMIN AUTHENTICATION (Simple Password)
// ==========================================
const ADMIN_PASSWORD = 'Sahil388';

export const verifyAdminPassword = (password) => {
    return password === ADMIN_PASSWORD;
};

export const isAdminAuthenticated = () => {
    return sessionStorage.getItem('nerdism_admin') === 'true';
};

export const setAdminAuthenticated = (value) => {
    if (value) {
        sessionStorage.setItem('nerdism_admin', 'true');
    } else {
        sessionStorage.removeItem('nerdism_admin');
    }
};

// ==========================================
// NEWSLETTER SUBSCRIBERS
// ==========================================
export const addNewsletterSubscriber = async (email) => {
    try {
        const subscribersRef = collection(db, 'nerdism_newsletter');
        const q = query(subscribersRef, where('email', '==', email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return { success: false, message: 'Email already subscribed!' };
        }

        await addDoc(collection(db, 'nerdism_newsletter'), {
            email: email.toLowerCase(),
            subscribedAt: serverTimestamp(),
            source: 'website'
        });

        return { success: true, message: 'Successfully subscribed!' };
    } catch (error) {
        console.error('[Newsletter] Error:', error);
        return { success: false, message: 'Failed to subscribe. Please try again.' };
    }
};

// ==========================================
// BLOG POSTS CRUD
// ==========================================

// Default author info
const DEFAULT_AUTHOR = {
    name: 'Sahil',
    avatar: 'https://ui-avatars.com/api/?name=Sahil&background=6366f1&color=fff&size=128'
};

/**
 * Generate slug from title
 */
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

/**
 * Calculate read time
 */
const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
};

/**
 * Get all published posts
 */
export const getPublishedPosts = async () => {
    try {
        const postsRef = collection(db, 'nerdism_posts');
        const q = query(
            postsRef,
            where('published', '==', true),
            orderBy('publishedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            publishedAt: doc.data().publishedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        }));
    } catch (error) {
        console.error('[Posts] Error fetching:', error);
        return [];
    }
};

/**
 * Get all posts (for admin)
 */
export const getAllPosts = async () => {
    try {
        const postsRef = collection(db, 'nerdism_posts');
        const q = query(postsRef, orderBy('publishedAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            publishedAt: doc.data().publishedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        }));
    } catch (error) {
        console.error('[Posts] Error fetching all:', error);
        return [];
    }
};

/**
 * Get single post by slug
 */
export const getPostBySlug = async (slug) => {
    try {
        const postsRef = collection(db, 'nerdism_posts');
        const q = query(postsRef, where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return null;

        const doc = querySnapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data(),
            publishedAt: doc.data().publishedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        };
    } catch (error) {
        console.error('[Posts] Error fetching by slug:', error);
        return null;
    }
};

/**
 * Create new post
 */
export const createPost = async (postData) => {
    try {
        // Use provided slug or generate from title
        const slug = postData.slug && postData.slug.trim()
            ? postData.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            : generateSlug(postData.title);

        // Check if slug exists
        const existing = await getPostBySlug(slug);
        if (existing) {
            return { success: false, message: 'A post with this URL (slug) already exists. Please choose another.' };
        }

        const post = {
            title: postData.title,
            slug: slug,
            excerpt: postData.excerpt || postData.content.substring(0, 150) + '...',
            content: postData.content,
            category: postData.category,
            image: postData.image || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
            author: DEFAULT_AUTHOR,
            readTime: calculateReadTime(postData.content),
            published: postData.published !== false,
            publishedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'nerdism_posts'), post);

        return {
            success: true,
            message: 'Post published successfully!',
            id: docRef.id,
            slug: slug
        };
    } catch (error) {
        console.error('[Posts] Error creating:', error);
        return { success: false, message: 'Failed to publish post.' };
    }
};

/**
 * Update existing post
 */
export const updatePost = async (postId, postData) => {
    try {
        const postRef = doc(db, 'nerdism_posts', postId);

        await updateDoc(postRef, {
            ...postData,
            readTime: calculateReadTime(postData.content),
            updatedAt: serverTimestamp()
        });

        return { success: true, message: 'Post updated successfully!' };
    } catch (error) {
        console.error('[Posts] Error updating:', error);
        return { success: false, message: 'Failed to update post.' };
    }
};

/**
 * Delete post
 */
// ==========================================
// COMMENTS SYSTEM
// ==========================================

/**
 * Add a new comment
 */
export const addComment = async (postId, commentData) => {
    try {
        const comment = {
            postId,
            author: commentData.name || 'Anonymous',
            content: commentData.content,
            createdAt: serverTimestamp(),
            // In a real app, you'd want some auth or captcha here
        };
        await addDoc(collection(db, 'nerdism_comments'), comment);
        return { success: true };
    } catch (error) {
        console.error('[Comments] Error adding:', error);
        return { success: false, error };
    }
};

/**
 * Get comments for a post
 */
export const getComments = async (postId) => {
    try {
        const commentsRef = collection(db, 'nerdism_comments');
        const q = query(
            commentsRef,
            where('postId', '==', postId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date()
        }));
    } catch (error) {
        console.error('[Comments] Error fetching:', error);
        return [];
    }
};

/**
 * Delete post (and associated comments - optional cleanup)
 */
export const deletePost = async (postId) => {
    try {
        await deleteDoc(doc(db, 'nerdism_posts', postId));
        return { success: true, message: 'Post deleted successfully!' };
    } catch (error) {
        console.error('[Posts] Error deleting:', error);
        return { success: false, message: 'Failed to delete post.' };
    }
};
