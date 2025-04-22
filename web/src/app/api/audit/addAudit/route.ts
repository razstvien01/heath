import { CreateAuditSchema } from "@/dto/audit/CreateAuditReqDto";
import { AuditRepository } from "@/repositories/mariaDb/AuditRepository";
import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const managementGuid = formData.get("guid");
    const name = formData.get("name");

    if (!name || !guid) {
      return new Response("Guid and name are required.", {
        status: 400,
      });
    }
    
    // const parsed = CreateAuditSchema.safeParse({ name })
    

    const ownerRepository = new OwnerRepository();
    // const auditRepository = new AuditRepository();

    const ownerId = await ownerRepository.getOwnerIdFromManagementGuid(
      guid as string
    );

    // if (!ownerId) {
    //   return new Response("Invalid Request", {
    //     status: 500,
    //   });
    // }

    // const result = auditRepository.addAudit(ownerId, name as string);

    // if (result) {
    //   return new Response("Audit inserted successfully", {
    //     status: 200,
    //   });
    // } else {
    //   return new Response("Audit insert failed", {
    //     status: 500,
    //   });
    // }
  } catch (error) {
    console.error("Error processing request:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return new Response(message, {
      status: 500,
    });
  }
}
