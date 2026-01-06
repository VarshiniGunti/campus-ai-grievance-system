import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Query, DocumentData } from 'firebase/firestore';

// Firebase configuration
// Replace these with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForDevelopment",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "campus-ai-grievance.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "campus-ai-grievance",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "campus-ai-grievance.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123def456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface GrievanceData {
  id?: string;
  studentName: string;
  studentEmail: string;
  complaint: string;
  category?: string;
  urgency?: string;
  sentiment?: string;
  summary?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AIAnalysis {
  category: string;
  urgency: string;
  sentiment: string;
  summary: string;
}

/**
 * Submit a new grievance to Firestore
 */
export async function submitGrievance(grievanceData: Omit<GrievanceData, 'id' | 'createdAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'grievances'), {
      ...grievanceData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting grievance:', error);
    throw error;
  }
}

/**
 * Fetch all grievances from Firestore, ordered by creation date (newest first)
 */
export async function fetchGrievances(): Promise<GrievanceData[]> {
  try {
    const q: Query<DocumentData> = query(
      collection(db, 'grievances'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const grievances: GrievanceData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      grievances.push({
        id: doc.id,
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        complaint: data.complaint,
        category: data.category,
        urgency: data.urgency,
        sentiment: data.sentiment,
        summary: data.summary,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      });
    });
    
    return grievances;
  } catch (error) {
    console.error('Error fetching grievances:', error);
    throw error;
  }
}

/**
 * Update grievance with AI analysis
 */
export async function updateGrievanceWithAnalysis(
  grievanceId: string,
  analysis: AIAnalysis
): Promise<void> {
  try {
    // This would require firestore update function
    // For now, the backend handles this
  } catch (error) {
    console.error('Error updating grievance:', error);
    throw error;
  }
}

export { db };
