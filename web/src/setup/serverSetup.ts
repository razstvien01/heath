import { CreateConnection } from "@/config/mariadbConfig";
import { Config } from "@/constants/configConstants";
import { MariaDBSetupRepository } from "@/repositories/MariaDBSetupRepository";
import { DB as firestoreConnection } from "@/config/firebaseConfig";
import { FirestoreDBSetupRepository } from "@/repositories/FirestoreDBSetupRepository";

//* Setup function to initialize the app
export async function Setup() {
  validateEnvironmentVariables();

  sqlSetup();
  firebaseSetup();
}

async function sqlSetup() {
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
}

async function firebaseSetup() {
  const firestoreDBSetupRepo = new FirestoreDBSetupRepository(
    firestoreConnection
  );

  await firestoreDBSetupRepo.dropAdminsCollection();
  await firestoreDBSetupRepo.dropRecordsCollection();
  await firestoreDBSetupRepo.dropAuditsCollection();
  await firestoreDBSetupRepo.dropOwnersCollection();
  
  await firestoreDBSetupRepo.insertAdminRecords();
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
