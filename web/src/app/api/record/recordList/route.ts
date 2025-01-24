import { AuditRepository } from "@/repositories/mariaDb/AuditRepository";
import { RecordRepository } from "@/repositories/mariaDb/RecordRepository";

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

        const auditRepository = new AuditRepository();
        const recordRepository = new RecordRepository();

        const auditId = await auditRepository.GetAuditIdFromGuid(guid as string)

        if(!auditId) {
            return new Response("Invalid Request", {
                status: 500
            })
        } 

        const result = await recordRepository.GetRecordList(auditId)

        return new Response(JSON.stringify(result), {
            status: 200,
        });
    } catch (e) {
        return new Response(null, {
            status: 400,
        });
    }
}