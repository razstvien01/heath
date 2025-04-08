import { Connection } from "mysql2"

export interface IMariaDBSetupRepository{
  createAdminsTable(DB: Connection): void;
  createOwnersTable(DB: Connection): void;
  createAuditsTable(DB: Connection): void;
  createRecordsTable(DB: Connection): void;
  insertAdminRecords(DB: Connection): Promise<boolean>;
}