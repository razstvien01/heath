import {
  ConfirmOwnerReqDto,
  CreateOwnerReqDto,
  OwnerDto,
  OwnerFilterDto,
  UpdateOwnerReqDto,
} from "@/dto/owner";
import { IOwnerRepository } from "@/interfaces";
import OwnerMapper from "@/mappers/OwnerMapper";
import Owner from "@/models/Owner";
import {
  Connection,
  FieldPacket,
  QueryResult,
  RowDataPacket,
} from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";

export class OwnerRepository implements IOwnerRepository {
  private readonly _db: Connection;

  constructor(db: Connection) {
    this._db = db;
  }
  async getOwnerTotalCount(filters: OwnerFilterDto): Promise<number> {
    let query = "SELECT COUNT(*) AS total FROM Owners";
    const conditions: string[] = [];
    const values: (string | number)[] = [];

    if (filters.name) {
      conditions.push("name LIKE ?");
      values.push(`%${filters.name}%`);
    }

    if (filters.createdFrom) {
      conditions.push("createdAt >= ?");
      values.push(filters.createdFrom);
    }

    if (filters.createdTo) {
      conditions.push("createdAt <= ?");
      values.push(filters.createdTo);
    }

    if (filters.updatedFrom) {
      conditions.push("updatedAt >= ?");
      values.push(filters.updatedFrom);
    }

    if (filters.updatedTo) {
      conditions.push("updatedAt <= ?");
      values.push(filters.updatedTo);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const [rows] = await this._db.query<RowDataPacket[]>(query, values);

    return rows[0]?.total ?? 0;
  }

  async checkOwnerIfExist(name: string): Promise<boolean> {
    const [rows] = await this._db.query<RowDataPacket[]>(
      "SELECT 1 FROM Owners WHERE name = ?",
      [name]
    );

    return rows.length > 0;
  }

  async addOwner(
    dto: CreateOwnerReqDto
  ): Promise<[QueryResult, FieldPacket[]]> {
    if (await this.checkOwnerIfExist(dto.name))
      throw new Error("Owner with this name already exists.");

    const query =
      "INSERT INTO Owners (name, password, managementGuid) VALUES " +
      "(?, SHA2(?, 256), ?)";

    try {
      const result = this._db.execute(query, [
        dto.name,
        dto.password,
        uuidv4(),
      ]);

      return result;
    } catch (error) {
      console.log("Error inserting a new owner:", error);
      throw new Error("Failed to add a new owner.");
    }
  }

  async confirmOwnerLogin(dto: ConfirmOwnerReqDto): Promise<boolean> {
    const query =
      "SELECT * FROM Owners WHERE managementGuid = ? and name = ? and password = SHA2(?, 256)";
    const values = [dto.managementGuid, dto.name, dto.password];

    try {
      const [rows]: [RowDataPacket[], FieldPacket[]] = await this._db.query(
        query,
        values
      );

      return rows.length > 0;
    } catch (error) {
      console.error("Error confirming owner login:", error);
      throw new Error("Failed to confirm owner login");
    }
  }

  async deleteOwnerFromManagementGuid(
    guid: string
  ): Promise<[QueryResult, FieldPacket[]]> {
    try {
      const [rows] = await this._db.query<RowDataPacket[]>(
        "SELECT 1 FROM Owners WHERE managementGuid = ?",
        [guid]
      );

      if (rows.length === 0) {
        console.log("Owner not found");
        throw new Error("Owner not found. Deletion aborted.");
      }

      const result = await this._db.execute(
        "DELETE FROM Owners WHERE managementGuid = ?",
        [guid]
      );
      return result;
    } catch (error) {
      console.log("Error deleting owner by guid:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to delete an owner");
    }
  }

  async isOwnerGuid(guid: string): Promise<boolean> {
    const query = "SELECT 1 FROM Owners WHERE managementGuid = ?";

    try {
      const [rows]: [RowDataPacket[], FieldPacket[]] = await this._db.query(
        query,
        [guid]
      );

      return rows.length > 0;
    } catch (error) {
      console.error("Error validating admin:", error);
      throw new Error("Failed to validate admin");
    }
  }

  async getOwnerList(filters: OwnerFilterDto): Promise<OwnerDto[]> {
    let query = "SELECT * FROM Owners";
    const conditions: string[] = [];
    const values: (string | number)[] = [];

    //* Filters
    if (filters.name && filters.managementGuid) {
      conditions.push("name LIKE ? OR managementGuid = ?");
      values.push(`%${filters.name}%`, `%${filters.managementGuid}`);
    } else if (filters.name) {
      conditions.push("name LIKE ?");
      values.push(`%${filters.name}%`);
    } else if (filters.managementGuid) {
      conditions.push("managementGuid LIKE ?");
      values.push(`%${filters.managementGuid}%`);
    }

    if (filters.createdFrom) {
      conditions.push("createdAt >= ?");
      values.push(filters.createdFrom);
    }

    if (filters.createdTo) {
      conditions.push("createdAt <= ?");
      values.push(filters.createdTo);
    }

    if (filters.updatedFrom) {
      conditions.push("updatedAt >= ?");
      values.push(filters.updatedFrom);
    }

    if (filters.updatedTo) {
      conditions.push("updatedAt <= ?");
      values.push(filters.updatedTo);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    if (filters.orderBy) {
      const dir =
        filters.orderDirection?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      query += ` ORDER BY ${filters.orderBy} ${dir}`;
    }

    //* Pagination
    const offset = (filters.page - 1) * filters.pageSize;

    query += " LIMIT ? OFFSET ?";
    values.push(filters.pageSize, offset);
    
    const [rows] = await this._db.query<Owner[] & RowDataPacket[]>(
      query,
      values
    );

    const owners: OwnerDto[] = rows.map((row: Owner) =>
      OwnerMapper.toOwnerDto(row)
    );

    return owners;
  }

  async getOwnerIdFromManagementGuid(guid: string): Promise<number | null> {
    const query = "SELECT id FROM Owners WHERE managementGuid = ?";
    try {
      const [rows] = await this._db.query<RowDataPacket[]>(query, [guid]);

      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0].id;
      }
      return null;
    } catch (error) {
      console.error("Error fetching owners:", error);
      throw new Error("Failed to fetch owners");
    }
  }

  async updateOwner(
    dto: UpdateOwnerReqDto
  ): Promise<[QueryResult, FieldPacket[]]> {
    try {
      const query =
        "UPDATE Owners SET " +
        "name = ?, " +
        "password = SHA2(?, 256) " +
        "WHERE managementGuid = ?";
      const values = [dto.name, dto.password, dto.managementGuid];
      const result = await this._db.execute(query, values);

      return result;
    } catch (error) {
      console.error("Error updating an owner:", error);
      throw new Error("Failed to update an owner");
    }
  }
}
