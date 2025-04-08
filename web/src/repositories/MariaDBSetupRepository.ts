import { Config } from "@/constants/configConstants";
import { IMariaDBSetupRepository } from "@/interfaces/IMariaDBSetupRepository";
import { Connection } from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";

export class MariaDBSetupRepository implements IMariaDBSetupRepository {
  private sqlConnection: Connection
  
  constructor(sqlConnection: Connection){
    this.sqlConnection = sqlConnection;
  }
  
  async createAdminsTable(): Promise<void> {
    const query = `CREATE TABLE IF NOT EXISTS Admins (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      name VARCHAR(255), 
      password VARCHAR(255), 
      ownerManagementGuid VARCHAR(255)
    )`;

    try {
      const result = await this.sqlConnection.execute(query);
      console.log("Table creation result:", result);
    } catch (error) {
      console.error("Error creating Admins table:", error);
    }
  }
  async createOwnersTable(): Promise<void> {
    const query = `CREATE TABLE IF NOT EXISTS Owners (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      name VARCHAR(255), 
      password VARCHAR(255), 
      managementGuid VARCHAR(255)
    )`;

    try {
      const result = await this.sqlConnection.execute(query);
      console.log("Table creation result:", result);
    } catch (error) {
      console.error("Error creating Owners table:", error);
    }
  }
  async createAuditsTable(): Promise<void> {
    const query = `CREATE TABLE IF NOT EXISTS Audits (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      ownerId INT NOT NULL, 
      name VARCHAR(255), 
      publicGuid VARCHAR(255), 
      ownerGuid VARCHAR(255),
      FOREIGN KEY (ownerId) REFERENCES Owners(id)
    )`;

    try {
      const result = await this.sqlConnection.execute(query);
      console.log("Table creation result:", result);
    } catch (error) {
      console.error("Error creating Audits table:", error);
    }
  }
  async createRecordsTable(): Promise<void> {
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

    try {
      const result = await this.sqlConnection.execute(query);
      console.log("Table creation result:", result);
    } catch (error) {
      console.error("Error creating Records table:", error);
    }
  }
  async insertAdminRecords(): Promise<void> {
    await this.sqlConnection.execute("TRUNCATE TABLE Admins");

    const insertQuery = `INSERT INTO Admins (name, password, ownerManagementGuid) VALUES 
        (?, SHA2(?, 256), ?), 
        (?, SHA2(?, 256), ?);`;

    try {
      const result = await this.sqlConnection.execute(insertQuery, [
        Config.MYSQL_ADMIN1_USERNAME,
        Config.MYSQL_ADMIN1_PASSWORD,
        uuidv4(),
        Config.MYSQL_ADMIN2_USERNAME,
        Config.MYSQL_ADMIN2_PASSWORD,
        uuidv4(),
      ]);

      console.log("Inserting records in Admins table result:", result);
    } catch (error) {
      console.error("Error inserting records in Admins table:", error);
    }
  }
}
