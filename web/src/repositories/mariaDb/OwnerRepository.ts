import { CreateConnection } from "@/config/mariadbConfig";
import { OwnerDto } from "@/dto/owner";
import { IOwnerRepository } from "@/interfaces/IOwnerRepository";
import OwnerMapper from "@/mappers/OwnerMapper";
import Owner from "@/models/Owner";
import { Connection, RowDataPacket } from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";

export class OwnerRepository implements IOwnerRepository {
  private readonly _db: Connection;

  constructor(db: Connection) {
    this._db = db;
  }

  async AddOwner(username: string, password: string) {
    const result = this._db.execute(
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
    const query = "SELECT * FROM Owners";
    try {
      const [rows] = await this._db.query<Owner[] & RowDataPacket[]>(query);

      const owners: OwnerDto[] = rows.map((row: Owner) =>
        OwnerMapper.toOwnerDto(row)
      );

      return owners;
    } catch (error) {
      console.log("Error fetching owners:", error);
      throw new Error("Failed to fetch owners");
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
