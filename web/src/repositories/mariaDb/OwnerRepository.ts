import { CreateConnection } from "@/config/mariadbConfig";
import { v4 as uuidv4 } from "uuid";

export class OwnerRepository {
  async AddOwner(username: string, password: string) {
    const DB = CreateConnection();
    const result = DB.execute(
      "INSERT INTO Owners (name, password, managementGuid) VALUES " +
        "(?, SHA2(?, 256), ?)",
      [username, password, uuidv4()]
    );

    return result;
  }

  async ConfirmOwnerLogin(guid: string, username: string, password: string) {
    const result: unknown = await new Promise((resolve, reject) => {
      const DB = CreateConnection();

      DB.query(
        "SELECT * FROM Owners WHERE managementGuid = ? and name = ? and password = SHA2(?, 256)",
        [guid, username, password],
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    return Array.isArray(result) && result.length > 0;
  }

  async DeleteOwnerFromManagementGuid(guid: string) {
    const DB = CreateConnection();
    const result = DB.execute("DELETE FROM Owners WHERE managementGuid = ?", [
      guid,
    ]);
    return result;
  }

  async IsOwnerGuid(guid: string) {
    const DB = CreateConnection();
    const result: unknown = await new Promise((resolve, reject) => {
      DB.query(
        "SELECT * FROM Owners WHERE managementGuid = ?",
        [guid],
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    return Array.isArray(result) && result.length > 0;
  }

  async GetOwnerList() {
    const DB = CreateConnection();
    const result: unknown = await new Promise((resolve, reject) => {
      DB.query("SELECT * FROM Owners", function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    return result;
  }

  async GetOwnerIdFromManagementGuid(guid: string): Promise<number | null> {
    const DB = CreateConnection();
    const rows: unknown = await new Promise((resolve, reject) => {
      DB.query(
        "SELECT id FROM Owners WHERE managementGuid = ?",
        [guid],
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0].id;
    } else {
      return null;
    }
  }

  async UpdateOwner(username: string, password: string, guid: string) {
    const DB = CreateConnection();
    const result = DB.execute(
      "UPDATE Owners SET " +
        "name = ?, " +
        "password = SHA2(?, 256) " +
        "WHERE managementGuid = ?",
      [username, password, guid]
    );

    return result;
  }
}
