import AdminDto from "@/dto/admin/AdminDto";
import { IAdminRepository } from "@/interfaces/IAdminRepository";
import AdminMapper from "@/mappers/AdminMapper";
import Admin from "@/models/Admin";
import { Connection } from "mysql2/promise";

export class AdminRepository implements IAdminRepository {
  private readonly _db: Connection;

  constructor(db: Connection) {
    this._db = db;
  }
  async getAdminByOMGUID(ownerManagementGuid: string): Promise<AdminDto[]> {
    const query = "SELECT * FROM Admins WHERE ownerManagementGuid = ?";

    try {
      const [rows]: unknown[] = await this._db.execute(query, [ownerManagementGuid]);
      
      const admins: AdminDto[] = (rows as Admin[]).map((row: Admin) =>
        AdminMapper.toAdminDto(row)
      );
      
      return admins;
    } catch (error) {
      console.error("Error fetching admins by ownerManagementGuid:", error);
      throw new Error("Failed to fetch admins");
    }
  }
}
