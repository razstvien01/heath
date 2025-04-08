import { IMariaDBSetupRepository } from "@/interfaces/IMariaDBSetupRepository";
import { Connection } from "mysql2";

export class MariaDBSetupRepository implements IMariaDBSetupRepository {
  createAdminsTable(DB: Connection): boolean {
    const query = `CREATE TABLE IF NOT EXISTS Admins (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      name VARCHAR(255), 
      password VARCHAR(255), 
      ownerManagementGuid VARCHAR(255)
    )`;
    const result = DB.execute(query);
    if (result) return true;
    return false;
  }
  createOwnersTable(DB: Connection): void {
    const query = `CREATE TABLE IF NOT EXISTS Owners (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      name VARCHAR(255), 
      password VARCHAR(255), 
      managementGuid VARCHAR(255)
    )`;

    DB.execute(query);
  }
  createAuditsTable(DB: Connection): void {
    const query = `CREATE TABLE IF NOT EXISTS Audits (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      ownerId INT NOT NULL, 
      name VARCHAR(255), 
      publicGuid VARCHAR(255), 
      ownerGuid VARCHAR(255),
      FOREIGN KEY (ownerId) REFERENCES Owners(id)
    )`;

    DB.execute(query);
  }
  createRecordsTable(DB: Connection): void {
    const query = `CREATE TABLE IF NOT EXISTS Records (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      auditId INT NOT NULL, 
      amount DOUBLE NOT NULL, 
      reason TEXT NOT NULL, 
      receipt MEDIUMBLOB, 
      signature TEXT, 
      approved TINYINT(1),
      dateCreated DATETIME,
      FOREIGN KEY (auditId) REFERENCES Audits(id)
    )`;

    DB.execute(query);
  }
  insertAdminRecords(DB: Connection): boolean {
    throw new Error("Method not implemented.");
  }
}
