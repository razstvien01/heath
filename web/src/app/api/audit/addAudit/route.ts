import { AuditRepository } from "@/repositories/mariaDb/AuditRepository";
import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

export async function POST(request: Request)
{
    const formData = await request.formData();

    const guid = formData.get("guid");
    const name = formData.get("name");

    if(name == null || guid == null)
    {
        return new Response("Bad", {
            status: 400
        })
    }

    const ownerRepository = new OwnerRepository();
    const auditRepository = new AuditRepository();

    const ownerId = await ownerRepository.GetOwnerIdFromManagementGuid(guid as string);

    if(!ownerId) {
        return new Response("Invalid Request", {
            status: 500
        })
    } 

    const result = auditRepository.AddAudit(ownerId, name as string);

    if(result) {
        return new Response("Audit inserted successfully", {
            status: 200
        });
    } else {
        return new Response("Audit insert failed", {
            status: 500
        })
    }
}