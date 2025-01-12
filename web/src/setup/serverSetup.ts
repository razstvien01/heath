import { CreateConnection } from "@/config/mariadbConfig";
import { AdminProfile } from "@/models/adminProfile";
import FirestoreRepository from "@/repositories/firestoreRepository";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "@/lib/utils";
import { Config } from "@/config/config";

// Setup function to initialize the app
export function Setup() {
  console.log("Setting up the app");
  validateEnvironmentVariables();
  MariaDbSetup();
  FirebaseSetup();
}

// MariaDB Setup for creating tables
async function MariaDbSetup() {
  const DB = CreateConnection();
  const tableCreationResults = await createTables(DB);

  if (tableCreationResults) {
    console.log("Tables created successfully");
    await insertAdminRecords(DB);
  } else {
    console.log("[ERROR] Table creation failed");
  }
}

// Function to create tables in MariaDB
async function createTables(DB: any): Promise<boolean> {
  const createTableQueries = [
    `CREATE TABLE IF NOT EXISTS Admins (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      name VARCHAR(255), 
      password VARCHAR(255), 
      ownerManagementGuid VARCHAR(255)
    )`,
    `CREATE TABLE IF NOT EXISTS Owners (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      name VARCHAR(255), 
      password VARCHAR(255), 
      managementGuid VARCHAR(255)
    )`,
    `CREATE TABLE IF NOT EXISTS Audits (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      ownerId INT NOT NULL, 
      name VARCHAR(255), 
      publicGuid VARCHAR(255), 
      ownerGuid VARCHAR(255),
      FOREIGN KEY (ownerId) REFERENCES Owners(id)
    )`,
    `CREATE TABLE IF NOT EXISTS Records (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      auditId INT NOT NULL, 
      amount DOUBLE NOT NULL, 
      reason TEXT NOT NULL, 
      receipt MEDIUMBLOB, 
      signature TEXT, 
      approved TINYINT(1),
      FOREIGN KEY (auditId) REFERENCES Audits(id)
    )`,
  ];

  try {
    for (const query of createTableQueries) {
      const result = await DB.execute(query);
      if (!result) return false;
    }
    return true;
  } catch (error) {
    console.error("[ERROR] Table creation failed:", error);
    return false;
  }
}

// Insert admin records into the Admins table
async function insertAdminRecords(DB: any): Promise<void> {
  try {
    await DB.execute("DELETE FROM Admins");

    const result = await DB.execute(
      `INSERT INTO Admins (name, password, ownerManagementGuid) VALUES 
        (?, SHA2(?, 256), ?), 
        (?, SHA2(?, 256), ?);`,
      [
        Config.MYSQL_ADMIN1_USERNAME,
        Config.MYSQL_ADMIN1_PASSWORD,
        uuidv4(),
        Config.MYSQL_ADMIN2_USERNAME,
        Config.MYSQL_ADMIN2_PASSWORD,
        uuidv4(),
      ]
    );

    if (result) {
      console.log("Admin records inserted successfully");
    } else {
      console.log("[ERROR] Admin records insert failed");
    }
  } catch (error) {
    console.error("[ERROR] Failed to insert admin records:", error);
  }
}

// Firebase Setup to create Admin documents
async function FirebaseSetup() {
  const adminRepo = new FirestoreRepository<AdminProfile>("admins");

  const admin1: AdminProfile = createAdminProfile(
    Config.MYSQL_ADMIN1_USERNAME,
    Config.MYSQL_ADMIN1_PASSWORD
  );
  const admin2: AdminProfile = createAdminProfile(
    Config.MYSQL_ADMIN2_USERNAME,
    Config.MYSQL_ADMIN2_PASSWORD
  );

  try {
    await adminRepo.createDocument(admin1);
    await adminRepo.createDocument(admin2);
    console.log("Admin documents created and inserted data successfully in Firestore");
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
}

// Validate environment variables for Admin credentials
function validateEnvironmentVariables() {
  const admin1Username = Config.MYSQL_ADMIN1_USERNAME;
  const admin2Username = Config.MYSQL_ADMIN2_USERNAME;
  const admin1Password = Config.MYSQL_ADMIN1_PASSWORD;
  const admin2Password = Config.MYSQL_ADMIN2_PASSWORD;

  if (!admin1Username || !admin1Password) {
    throw new Error(
      "Admin 1 credentials are not properly configured in environment variables"
    );
  }

  if (!admin2Username || !admin2Password) {
    throw new Error(
      "Admin 2 credentials are not properly configured in environment variables"
    );
  }
}

// Create an Admin profile object
function createAdminProfile(username: string, password: string): AdminProfile {
  return {
    name: username,
    password: hashPassword(password),
    ownerManagementGuid: uuidv4(),
  };
}
