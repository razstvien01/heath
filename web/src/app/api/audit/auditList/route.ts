import { AuditRepository } from "@/repositories/mariaDb/AuditRepository";
import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

export async function POST(request: Request)
{
    try {
        const formData = await request.formData();
        const guid = formData.get("guid");
        
        if(guid == null)
        {
            return new Response("Bad", {
                status: 400
            })
        }

        const ownerRepository = new OwnerRepository();
        const auditRepository = new AuditRepository();

        const ownerId = await ownerRepository.GetOwnerIdFromManagementGuid(guid as string)

        if(!ownerId) {
            return new Response("Invalid Request", {
                status: 500
            })
        } 

        const result = await auditRepository.GetAuditList(ownerId);

        return new Response(JSON.stringify(result), {
            status: 200,
        });
    } catch (e) {
        return new Response(null, {
            status: 400,
        });
    }
}