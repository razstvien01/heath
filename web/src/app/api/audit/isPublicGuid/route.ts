import { CreateConnection } from "@/config/mariadbConfig";
import { AuditSchema } from "@/dto/audit/AuditDto";
import { AuditRepository } from "@/repositories/mariaDb/AuditRepository";

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const guid = formData.get("guid");

    if (!guid) {
      return new Response("Bad Request: Missing or invalid GUID", {
        status: 400,
      });
    }

    const validation = AuditSchema.safeParse({
      publicGuid: guid,
    });

    if (!validation.success) {
      return new Response(
        `Bad Request: ${validation.error.issues[0].message}`,
        {
          status: 400,
        }
      );
    }

    const { publicGuid = "" } = validation.data;
    const db = await CreateConnection();
    const auditRepository = new AuditRepository(db);
    const isPublicResult = await auditRepository.isAuditPublicGuid(publicGuid);

    if (isPublicResult) {
      return new Response(JSON.stringify(true), {
        status: 200,
      });
    }

    const ownerGuid = publicGuid;

    const isPrivateResult = await auditRepository.isAuditPrivateGuid(ownerGuid);

    if (isPrivateResult) {
      return new Response(JSON.stringify(false), {
        status: 200,
      });
    }

    return new Response(JSON.stringify(false), {
      status: 500,
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
