export interface IMariaDBSetupRepository{
  createAdminsTable(): Promise<void>;
  dropAdminsTable(): Promise<void>;
  createOwnersTable(): Promise<void>;
  dropOwnersTable(): Promise<void>;
  createAuditsTable(): Promise<void>;
  dropAuditsTable(): Promise<void>;
  createRecordsTable(): Promise<void>;
  dropRecordsTable(): Promise<void>;
  insertAdminRecords(): Promise<void>;
}