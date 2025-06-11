import { CreateConnection } from "@/config/mariadbConfig";
import { CreateAuditSchema } from "@/dto/audit/CreateAuditReqDto";
import { OwnerSchema } from "@/dto/owner/OwnerDto";
import { AuditRepository } from "@/repositories/mariaDb/AuditRepository";
import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const managementGuid = formData.get("guid");
    const name = formData.get("name");
    const description = formData.get("description");
    const createdAt = formData.get("date");
  
    if (!name || !managementGuid || !createdAt) {
      return new Response("Guid, name, and createdAt are required.", {
        status: 400,
      });
    }

    const parsedOwner = OwnerSchema.safeParse({ managementGuid });

    if (!parsedOwner.success) {
      return new Response(
        `Bad Request: ${parsedOwner.error.issues[0].message}`,
        {
          status: 400,
        }
      );
    }

    const db = await CreateConnection();
    const ownerRepository = new OwnerRepository(db);

    const ownerId = await ownerRepository.getOwnerIdFromManagementGuid(
      managementGuid as string
    );

    const parsedAudit = CreateAuditSchema.safeParse({
      name,
      ownerId,
      description,
      createdAt: new Date(createdAt as string)
    });

    if (!parsedAudit.success) {
      return new Response(
        `Bad Request: ${[parsedAudit.error.issues[0].message]}`,
        {
          status: 400,
        }
      );
    }

    const auditRepository = new AuditRepository(db);

    const result = auditRepository.addAudit(parsedAudit.data);

    if (!result) {
      return new Response("Audit insert failed", {
        status: 500,
      });
    }

    return new Response("Audit inserted successfully", {
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
