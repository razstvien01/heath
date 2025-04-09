import { CreateConnection } from "@/config/mariadbConfig";
import { AdminProfile } from "@/models/adminProfile";
import FirestoreRepository from "@/repositories/firestoreRepository";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "@/lib/utils";
import { Config } from "@/constants/configConstants";
import { MariaDBSetupRepository } from "@/repositories/MariaDBSetupRepository";

//* Setup function to initialize the app
export async function Setup() {
  validateEnvironmentVariables();

  const sqlConnection = await CreateConnection();
  const mariaDBSetupRepo = new MariaDBSetupRepository(sqlConnection);

  // Drop existing tables
  // await mariaDBSetupRepo.dropAdminsTable();
  // await mariaDBSetupRepo.dropRecordsTable();
  // await mariaDBSetupRepo.dropAuditsTable();
  // await mariaDBSetupRepo.dropOwnersTable();

  await mariaDBSetupRepo.createAdminsTable();
  await mariaDBSetupRepo.createOwnersTable();
  await mariaDBSetupRepo.createAuditsTable();
  await mariaDBSetupRepo.createRecordsTable();

  await mariaDBSetupRepo.insertAdminRecords();

  FirebaseSetup();
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
    await adminRepo.truncateCollection();
    await adminRepo.createDocument(admin1);
    await adminRepo.createDocument(admin2);
    console.log(
      "Admin documents created and inserted data successfully in Firestore"
    );
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
