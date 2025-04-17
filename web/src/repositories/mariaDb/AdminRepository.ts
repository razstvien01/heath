import { AdminDto } from "@/dto/admin";
import { IAdminRepository } from "@/interfaces/IAdminRepository";
import AdminMapper from "@/mappers/AdminMapper";
import Admin from "@/models/Admin";
import { Connection, FieldPacket, RowDataPacket } from "mysql2/promise";

export class AdminRepository implements IAdminRepository {
  private readonly _db: Connection;

  constructor(db: Connection) {
    this._db = db;
  }
  async isGuidValid(ownerManagementGuid: string): Promise<boolean> {
    const query =
      "SELECT COUNT(*) as count FROM Admins WHERE ownerManagementGuid = ?";

    try {
      const [rows]: [RowDataPacket[], FieldPacket[]] = await this._db.query(
        query,
        [ownerManagementGuid]
      );

      // const count = (rows[0] as { count: number })?.count || 0;

      return rows.length > 0;
    } catch (error) {
      console.error("Error validating admin:", error);
      throw new Error("Failed to validate admin");
    }
  }
  async isAdminValid(
    guid: string | undefined,
    username: string | undefined,
    password: string | undefined
  ): Promise<boolean> {
    const query =
      "SELECT COUNT(*) as count FROM Admins WHERE ownerManagementGuid = ? and name = ? and password = SHA2(?, 256)";

    try {
      const [rows]: [RowDataPacket[], FieldPacket[]] = await this._db.query(
        query,
        [guid, username, password]
      );

      const count = (rows[0] as { count: number })?.count || 0;

      return count > 0;
    } catch (error) {
      console.error("Error validating admin:", error);
      throw new Error("Failed to validate admin");
    }
  }
  async getAdminByOMGUID(ownerManagementGuid: string): Promise<AdminDto> {
    const query = "SELECT * FROM Admins WHERE ownerManagementGuid = ?";

    try {
      const [rows] = await this._db.execute<RowDataPacket[]>(query, [
        ownerManagementGuid,
      ]);

      const admins: AdminDto[] = (rows as Admin[]).map((row: Admin) =>
        AdminMapper.toAdminDto(row)
      );

      return admins[0];
    } catch (error) {
      console.error("Error fetching admins by ownerManagementGuid:", error);
      throw new Error("Failed to fetch admins");
    }
  }
}
