import { Connection } from "mysql2"

export interface IMariaDBSetupRepository{
  createAdminsTable(DB: Connection): Promise<boolean>;
  createOwnersTable(DB: Connection): Promise<boolean>;
  createAuditsTable(DB: Connection): Promise<boolean>;
  createRecordsTable(DB: Connection): Promise<boolean>;
  insertAdminRecords(DB: Connection): Promise<boolean>;
}