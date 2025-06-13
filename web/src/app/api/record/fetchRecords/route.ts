import { CreateConnection } from "@/config/mariadbConfig";
import { AuditSchema } from "@/dto/audit/AuditDto";
import { RecordFilterSchema } from "@/dto/record/RecordFilterDto";
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

    const { searchParams } = new URL(request.url);

    const body = {
      reason: searchParams.get("reason") ?? undefined,
      createdFrom: searchParams.get("createdFrom") ?? undefined,
      createdTo: searchParams.get("createdTo") ?? undefined,
      updatedFrom: searchParams.get("updatedFrom") ?? undefined,
      updatedTo: searchParams.get("updatedTo") ?? undefined,
      orderBy: searchParams.get("orderBy") ?? undefined,
      orderDirection: searchParams.get("orderDirection") ?? undefined,
      page: searchParams.get("page")
        ? parseInt(searchParams.get("page")!)
        : undefined,
      pageSize: searchParams.get("pageSize")
        ? parseInt(searchParams.get("pageSize")!)
        : undefined,
    };

    const parsedFilter = RecordFilterSchema.safeParse(body);

    if (!parsedFilter.success) {
      return new Response(
        JSON.stringify({
          message: "Invalid filter",
          issues: parsedFilter.error.format(),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const filters = parsedFilter.data;
    const recordRepository = new RecordRepository(db);
    const records = await recordRepository.getRecords(auditId, filters);
    const total = await recordRepository.getRecordTotalCount(auditId, filters);
    
    if(!records || records.length === 0){
      return new Response(JSON.stringify({ message: "No Records found "}), {
        status: 404,
        headers: {
          "Content-Type": "application/json"
        }
      })
    }

    if (!records || records.length === 0)
      return new Response(JSON.stringify({ message: "No Records found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });

    return new Response(JSON.stringify({ records, total }), {
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
