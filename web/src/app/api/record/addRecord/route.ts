import { CreateConnection } from "@/config/mariadbConfig";
import { CreateRecordSchema } from "@/dto/record/CreateRecordReqDto";
import { AuditRepository } from "@/repositories/mariaDb/AuditRepository";
import { RecordRepository } from "@/repositories/mariaDb/RecordRepository";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const guid = formData.get("guid");
    const balance = formData.get("balance");
    const reason = formData.get("reason");
    const receiptFile = formData.get("receipt");
    const signature = formData.get("signature");

    if (!guid || !balance || !reason) {
      return new Response("Missing required fields", {
        status: 400,
      });
    }

    const receipt =
      receiptFile instanceof File
        ? Buffer.from(await receiptFile.arrayBuffer())
        : null;

    const db = await CreateConnection();
    const auditRepository = new AuditRepository(db);
    const auditId = await auditRepository.getAuditIdFromGuid(guid as string);

    if (!auditId) {
      return new Response("Invalid request. Audit not found", {
        status: 400,
      });
    }

    const parsedRecord = CreateRecordSchema.safeParse({
      auditId,
      amount: Number(balance),
      reason,
      receipt,
      signature,
      approved: 0,
    });

    if (!parsedRecord.success) {
      return new Response(
        `Bad Request: ${parsedRecord.error.issues[0].message}`,
        {
          status: 400,
        }
      );
    }

    const recordRepository = new RecordRepository(db);
    const result = await recordRepository.addRecord(parsedRecord.data);

    if (!result) {
      throw Error("Failed to insert record");
    }

    return new Response("Record inserted successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return new Response(message, {
      status: 500,
    });
  }
}
