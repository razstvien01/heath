import { CreateConnection } from "@/config/mariadbConfig";
import { RecordDto } from "@/dto/record";
import { CreateBackdatedSchema } from "@/dto/record/CreateBackdatedReqDto";
import { RecordSchema } from "@/dto/record/RecordDto";
import { AuditRepository, RecordRepository } from "@/repositories/mariaDb";

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const recordJson = formData.get("records");

    if (!recordJson)
      return new Response("Missing records data", {
        status: 400,
      });

    let records: RecordDto[];

    try {
      records = JSON.parse(recordJson.toString());
    } catch {
      return new Response("Invalid JSON format for records", {
        status: 400,
      });
    }

    const db = await CreateConnection();
    const auditRepository = new AuditRepository(db);
    const recordRepository = new RecordRepository(db);

    for (let i = 0; i < records.length; ++i) {
      const record = records[i];

      const parsedGUID = RecordSchema.safeParse({
        guid: record.guid,
      });
      if (!parsedGUID.success) {
        console.warn(`Skipping record[${i}]: Invalid GUID`);
        continue;
      }

      const auditId = await auditRepository.getAuditIdFromGuid(
        record.guid as string
      );
      if (!auditId) {
        console.warn(`Skipping record[${i}]: Audit not found`);
        continue;
      }

      const receiptFile = formData.get(`receipt-${i}`);

      const receipt =
        receiptFile instanceof File
          ? Buffer.from(await receiptFile.arrayBuffer())
          : null;
          
      const createdAtDate = record.createdAt ? new Date(record.createdAt) : new Date();
      const parsedRecord = CreateBackdatedSchema.safeParse({
        auditId,
        amount: Number(record.amount),
        reason: record.reason,
        receipt,
        signature: record.signature,
        approved: 0,
        createdAt: createdAtDate,
        updatedAt: createdAtDate,
      });
      if (!parsedRecord.success) {
        console.warn(`Skipping record[${i}]:`, parsedRecord.error.issues);
        continue;
      }

      const success = await recordRepository.addBackdated(parsedRecord.data);
      if (!success) console.warn(`Failed to insert record[${i}]`);
    }

    return new Response("Sync completed successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Sync error:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return new Response(message, {
      status: 500,
    });
  }
}
