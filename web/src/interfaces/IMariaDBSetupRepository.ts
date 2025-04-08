import { Connection } from "mysql2/promise"

export interface IMariaDBSetupRepository{
  createAdminsTable(DB: Connection): Promise<void>;
  createOwnersTable(DB: Connection): Promise<void>;
  createAuditsTable(DB: Connection): Promise<void>;
  createRecordsTable(DB: Connection): Promise<void>;
  insertAdminRecords(DB: Connection): Promise<void>;
}