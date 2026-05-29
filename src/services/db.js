import { collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { listings as mockListings } from '../data/mockListings';

const COLLECTION_NAME = 'properties';

export async function getListings() {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('postedDate', 'desc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('Firestore is empty. Attempting to seed with mock data...');
      const seeded = await seedDatabase();
      if (seeded) {
        return getListings(); // Retry after successful seeding
      } else {
        console.warn('Seeding failed (likely permission denied). Falling back to mock data.');
        return mockListings;
      }
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching listings:', error);
    return mockListings; // Fallback to mock data if Firebase fails
  }
}

export async function getListingById(id) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id.toString());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return mockListings.find(l => l.id.toString() === id.toString());
  } catch (error) {
    console.error('Error fetching listing:', error);
    return mockListings.find(l => l.id.toString() === id.toString());
  }
}

export async function addListing(data) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
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

async function seedDatabase() {
  try {
    const promises = mockListings.map(listing => {
      // Use string IDs for Firestore documents to keep it simple
      const docRef = doc(db, COLLECTION_NAME, listing.id.toString());
      return setDoc(docRef, listing);
    });
    await Promise.all(promises);
    console.log('Seeded database successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}
