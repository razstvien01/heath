import { CreateConnection } from "@/config/mariadbConfig";
import { v4 as uuidv4 } from "uuid";

export class OwnerRepository {
  async AddOwner(username: string, password: string) {
    const DB = CreateConnection();
    const result = (await DB).execute(
      "INSERT INTO Owners (name, password, managementGuid) VALUES " +
        "(?, SHA2(?, 256), ?)",
      [username, password, uuidv4()]
    );

    return result;
  }

  async ConfirmOwnerLogin(guid: string, username: string, password: string) {
    const DB = await CreateConnection();
    const result: unknown[] = await DB.query(
      "SELECT * FROM Owners WHERE managementGuid = ? and name = ? and password = SHA2(?, 256)",
      [guid, username, password]
    );

    return Array.isArray(result) && result.length > 0;
  }

  async DeleteOwnerFromManagementGuid(guid: string) {
    const DB = CreateConnection();
    const result = (await DB).execute(
      "DELETE FROM Owners WHERE managementGuid = ?",
      [guid]
    );
    return result;
  }

  async IsOwnerGuid(guid: string) {
    const DB = await CreateConnection();
    const result: unknown[] = await DB.query(
      "SELECT * FROM Owners WHERE managementGuid = ?",
      [guid]
    );

    return Array.isArray(result) && result.length > 0;
  }

  async GetOwnerList() {
    const DB = await CreateConnection();
    try {
      const [rows] = await DB.query("SELECT * FROM Owners"); 
      return rows;
    } catch (error) {
      console.error("Error fetching owner list:", error);
      throw new Error("Failed to fetch owner list");
    }
  }

  async GetOwnerIdFromManagementGuid(guid: string): Promise<number | null> {
    const DB = await CreateConnection();
    const [rows]: unknown[] = await DB.query(
      "SELECT id FROM Owners WHERE managementGuid = ?",
      [guid]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0].id;
    } else {
      return null;
    }
  }

  async UpdateOwner(username: string, password: string, guid: string) {
    const DB = CreateConnection();
    const result = (await DB).execute(
      "UPDATE Owners SET " +
        "name = ?, " +
        "password = SHA2(?, 256) " +
        "WHERE managementGuid = ?",
      [username, password, guid]
    );

    return result;
  }
}
