export interface IMariaDBSetupRepository{
  createAdminsTable(): Promise<void>;
  createOwnersTable(): Promise<void>;
  createAuditsTable(): Promise<void>;
  createRecordsTable(): Promise<void>;
  insertAdminRecords(): Promise<void>;
}