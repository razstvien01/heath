import { DB } from "@/config/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  setDoc,
  WithFieldValue,
} from "firebase/firestore";

class FirestoreRepository<T extends DocumentData> {
  private collectionName: string;
  private collectionRef: ReturnType<typeof collection>;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.collectionRef = collection(DB, collectionName);
  }

  private sanitizeData(data: T): WithFieldValue<DocumentData> {
    const sanitized: Record<string, any> = {};

    const entries = Object.entries(data as Record<string, any>);

    for (const [key, value] of entries) {
      if (value !== undefined) {
        sanitized[key] = value;
      }
    }

    return sanitized as WithFieldValue<DocumentData>;
  }

  async createDocument(data: T): Promise<string> {
    try {
      const sanitizedData = this.sanitizeData(data);
      const docRef = await addDoc(this.collectionRef, sanitizedData);
      console.log(`Document added with ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  }
	
	async setDocument(documentId: string, data: T): Promise<void> {
		try {
			const sanitizedData = this.sanitizeData(data);
			await setDoc(doc(this.collectionRef, documentId), sanitizedData);
			console.log(`Document updated with ID: ${documentId}`);
		} catch (error) {
			console.error("Error updating document:", error);
			throw error;
		}
	}
}

export default FirestoreRepository;