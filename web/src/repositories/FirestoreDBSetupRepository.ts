import { Config } from "@/constants/configConstants";
import { IFirestoreDBSetupRepository } from "@/interfaces/IFirestoreDBSetupRepository";
import {
  CollectionReference,
  Firestore,
  collection,
  getDocs,
  deleteDoc,
  WithFieldValue,
  DocumentData,
  addDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export class FirestoreDBSetupRepository implements IFirestoreDBSetupRepository {
  private firestoreConnection: Firestore;

  private ownersCollectionRef: CollectionReference;
  private auditsCollectionRef: CollectionReference;
  private recordsCollectionRef: CollectionReference;
  private adminsCollectionRef: CollectionReference;

  constructor(firestoreConnection: Firestore) {
    this.firestoreConnection = firestoreConnection;

    this.adminsCollectionRef = collection(this.firestoreConnection, "admins");
    this.ownersCollectionRef = collection(this.firestoreConnection, "owners");
    this.auditsCollectionRef = collection(this.firestoreConnection, "audits");
    this.recordsCollectionRef = collection(this.firestoreConnection, "records");
  }

  private async truncateCollection(
    collectionRef: ReturnType<typeof collection>
  ): Promise<void> {
    try {
      const snapshot = await getDocs(collectionRef);
      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log(`All documents in the collection have been deleted.`);
    } catch (error) {
      console.error("Error truncating collection:", error);
      throw error;
    }
  }

  async dropAdminsCollection(): Promise<void> {
    await this.truncateCollection(this.adminsCollectionRef);
  }
  async dropOwnersCollection(): Promise<void> {
    await this.truncateCollection(this.ownersCollectionRef);
  }
  async dropAuditsCollection(): Promise<void> {
    await this.truncateCollection(this.auditsCollectionRef);
  }
  async dropRecordsCollection(): Promise<void> {
    await this.truncateCollection(this.recordsCollectionRef);
  }

  private sanitizeData(
    data: Record<string, unknown>
  ): WithFieldValue<DocumentData> {
    const sanitized: Record<string, unknown> = {};
    const entries = Object.entries(data);

    for (const [key, value] of entries) {
      if (value !== undefined) {
        sanitized[key] = value;
      }
    }
    return sanitized as WithFieldValue<DocumentData>;
  }

  async insertAdminRecords(): Promise<void> {
    const adminData = [
      {
        name: Config.MYSQL_ADMIN1_USERNAME,
        password: Config.MYSQL_ADMIN1_PASSWORD,
        ownerManagementGuid: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: Config.MYSQL_ADMIN2_USERNAME,
        password: Config.MYSQL_ADMIN2_PASSWORD,
        ownerManagementGuid: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    try {
      for (const data of adminData) {
        const sanitizedData = this.sanitizeData(data);
        await addDoc(this.adminsCollectionRef, sanitizedData);
        console.log(`Admin record inserted with name: ${data.name}`);
      }
    } catch (error) {
      console.error("Error inserting admin records:", error);
      throw error;
    }
  }
}
