import { collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, query, orderBy, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { db, auth } from '../firebase';

const COLLECTION_NAME = 'properties';
const CMS_COLLECTION = 'cms';
const CMS_DOC = 'home-content';

/* ── AUTHENTICATION ───────────────────────── */

export function listenAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function registerUser(email, password, displayName) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    return cred.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function loginUser(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

/* ── LISTINGS ─────────────────────────────── */

export async function getListings() {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('postedDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching listings:', error);
    return []; // Return empty array if Firebase fails (e.g. permission denied)
  }
}

export async function getUserListings(userId) {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('ownerId', '==', userId), orderBy('postedDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user listings:', error);
    return [];
  }
}

export async function getListingById(id) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id.toString());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching listing:', error);
    return null;
  }
}

export async function addListing(data) {
  try {
    if (!auth.currentUser) throw new Error("Must be logged in to add a listing");
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      ownerId: auth.currentUser.uid,
      ownerName: auth.currentUser.displayName || 'Property Owner',
      ownerEmail: auth.currentUser.email,
      postedDate: new Date().toISOString(),
      views: 0
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding listing:', error);
    throw error;
  }
}

export async function updateListing(id, data) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id.toString());
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
}

export async function deleteListing(id) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id.toString());
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
}

/* ── DYNAMIC CMS ──────────────────────────── */

export async function getSiteContent() {
  try {
    const docRef = doc(db, CMS_COLLECTION, CMS_DOC);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    // Default content if not set in CMS
    return {
      heroTitle: 'Find your perfect stay in Pune',
      heroSubtitle: 'PGs · Hostels · Flats · Studios — connect directly with owners, no broker',
      stat1Value: '500+', stat1Label: 'Properties in Pune',
      stat2Value: '2,000+', stat2Label: 'Happy Tenants',
      stat3Value: '20+', stat3Label: 'Areas Covered',
      stat4Value: '100+', stat4Label: 'Daily Inquiries',
      footerCredit: 'Developed by Jayesh Sonar',
    };
  } catch (error) {
    console.error('Error fetching CMS content:', error);
    return null;
  }
}

export async function updateSiteContent(data) {
  try {
    const docRef = doc(db, CMS_COLLECTION, CMS_DOC);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error('Error updating CMS content:', error);
    throw error;
  }
}
