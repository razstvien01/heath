import { CreateConnection } from "@/config/mariadbConfig";

export class RecordRepository {
  async AddRecord(
    auditId: number,
    balance: number,
    reason: string,
    receipt: ArrayBuffer,
    signature: string
  ) {
    const DB = CreateConnection();
    const result = (await DB).execute(
      "INSERT INTO Records (auditId, amount, reason, receipt, signature, approved, dateCreated) VALUES " +
        "(?, ?, ?, ?, ?, ?, ?)",
      [auditId, balance, reason, receipt, signature, 0, new Date()]
    );
    return result;
  }

  async GetRecordList(auditId: number) {
    const DB = CreateConnection();
    const [results]: unknown[] = await (await DB).query(
      "SELECT *, UNIX_TIMESTAMP(dateCreated) as dateCreatedEpoch FROM Records WHERE auditId = ?",
      [auditId]
    );

    return results;
  }

  async UpdateRecord(id: number, receipt: ArrayBuffer, signature: string) {
    const DB = CreateConnection();
    const result = (await DB).execute(
      "UPDATE Records SET " +
        "receipt = ?, " +
        "signature = ? " +
        "WHERE id = ?",
      [receipt, signature, id]
    );

    return result;
  }

  async DeleteRecordById(id: number) {
    const DB = CreateConnection();
    const result = (await DB).execute("DELETE FROM Records WHERE id = ?", [id]);
    return result;
  }
}
