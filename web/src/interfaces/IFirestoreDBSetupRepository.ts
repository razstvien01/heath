export interface IFirestoreDBSetupRepository {
  dropAdminsCollection(): Promise<void>;
  dropOwnersCollection(): Promise<void>;
  dropAuditsCollection(): Promise<void>;
  dropRecordsCollection(): Promise<void>;
  
  insertAdminRecords(): Promise<void>;
}