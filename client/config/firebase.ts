import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Query,
  DocumentData,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

/* ---------------------------
   Firebase Configuration
---------------------------- */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

/* ---------------------------
   Initialize Firebase
---------------------------- */
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/* ---------------------------
   Types
---------------------------- */
export interface AttachmentBase64 {
  name: string;
  type: string;
  size: number;
  base64: string; // ✅ actual data
}

export interface GrievanceData {
  id?: string;

  studentName: string;
  studentEmail: string;
  complaint: string;

  category?: string;
  urgency?: string;
  sentiment?: string;
  summary?: string;

  status?: "submitted" | "viewed" | "cleared";
  adminMessage?: string;

  attachments?: AttachmentBase64[]; // ✅ base64 images stored in Firestore

  createdAt: Date;
  updatedAt?: Date;
}

/* ---------------------------
   Submit Grievance (Firestore only)
---------------------------- */
export async function submitGrievance(
  grievanceData: Omit<GrievanceData, "id" | "createdAt" | "updatedAt">,
): Promise<string> {
  try {
    console.log("📝 Writing grievance to Firestore...");

    const docRef = await addDoc(collection(db, "grievances"), {
      ...grievanceData,
      status: "submitted",
      adminMessage: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("✅ grievance saved:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error submitting grievance:", error);
    throw error;
  }
}

/* ---------------------------
   Fetch All Grievances
---------------------------- */
export async function fetchGrievances(): Promise<GrievanceData[]> {
  try {
    const q: Query<DocumentData> = query(
      collection(db, "grievances"),
      orderBy("createdAt", "desc"),
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => {
      const data: any = docSnap.data();

      return {
        id: docSnap.id,
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        complaint: data.complaint,

        category: data.category,
        urgency: data.urgency,
        sentiment: data.sentiment,
        summary: data.summary,

        status: data.status || "submitted",
        adminMessage: data.adminMessage || "",

        attachments: data.attachments || [],

        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : undefined,
      };
    });
  } catch (error) {
    console.error("❌ Error fetching grievances:", error);
    throw error;
  }
}

/* ---------------------------
   Fetch Single Grievance
---------------------------- */
export async function fetchGrievanceById(
  grievanceId: string,
): Promise<GrievanceData | null> {
  try {
    const snap = await getDoc(doc(db, "grievances", grievanceId));
    if (!snap.exists()) return null;

    const data: any = snap.data();

    return {
      id: snap.id,
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      complaint: data.complaint,

      category: data.category,
      urgency: data.urgency,
      sentiment: data.sentiment,
      summary: data.summary,

      status: data.status || "submitted",
      adminMessage: data.adminMessage || "",

      attachments: data.attachments || [],

      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : undefined,
    };
  } catch (error) {
    console.error("❌ Error fetching grievance:", error);
    throw error;
  }
}

/* ---------------------------
   Update Grievance Status
---------------------------- */
export async function updateGrievanceStatus(
  grievanceId: string,
  status: "submitted" | "viewed" | "cleared",
  adminMessage?: string,
): Promise<void> {
  try {
    const grievanceRef = doc(db, "grievances", grievanceId);

    await updateDoc(grievanceRef, {
      status,
      adminMessage: adminMessage || "",
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("❌ Error updating grievance status:", error);
    throw error;
  }
}

/* ---------------------------
   Delete Grievance
---------------------------- */
export async function deleteGrievance(grievanceId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "grievances", grievanceId));
  } catch (error) {
    console.error("❌ Error deleting grievance:", error);
    throw error;
  }
}