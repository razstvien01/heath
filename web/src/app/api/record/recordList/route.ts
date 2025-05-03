import { CreateConnection } from "@/config/mariadbConfig";
import { AuditSchema } from "@/dto/audit/AuditDto";
import { AuditRepository } from "@/repositories/mariaDb/AuditRepository";
import { RecordRepository } from "@/repositories/mariaDb/RecordRepository";

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const guid = formData.get("guid");

    if (!guid) {
      return new Response("GUID is required", {
        status: 400,
      });
    }

    const parsedGUID = AuditSchema.safeParse({
      publicGuid: guid,
      ownerGuid: guid,
    });

    if (!parsedGUID.success) {
      return new Response(
        `Bad Request: ${parsedGUID.error.issues[0].message}`,
        {
          status: 400,
        }
      );
    }

    const db = await CreateConnection();
    const auditRepository = new AuditRepository(db);
    const auditId = await auditRepository.getAuditIdFromGuid(guid as string);

    if (!auditId) {
      return new Response("Audit ID is required", {
        status: 400,
      });
    }

    const recordRepository = new RecordRepository(db);
    const records = await recordRepository.getRecordList(auditId);

    if (!records || records.length === 0)
      return new Response(JSON.stringify({ message: "No Records found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });

    return new Response(JSON.stringify(records), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
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
