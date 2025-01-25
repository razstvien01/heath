import { AuditRepository } from "@/repositories/mariaDb/AuditRepository";
import { RecordRepository } from "@/repositories/mariaDb/RecordRepository";

export async function POST(request: Request)
{
    const formData = await request.formData();

    const guid = formData.get("guid");
    const balance = formData.get("balance");
    const reason = formData.get("reason");
    const receiptFile = formData.get("receipt");
    const signature = formData.get("signature");

    const receipt = await new Promise((resolve, reject) => {
        (receiptFile as File).arrayBuffer().then((arrayBuffer) => {
            resolve(arrayBuffer)
        })
    })

    if(guid == null || balance == null || reason == null)
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

    const result = recordRepository.AddRecord(auditId, Number(balance), reason as string, receipt as ArrayBuffer, signature as string)

    if(result) {
        return new Response("Record inserted successfully", {
            status: 200
        });
    } else {
        return new Response("Record insert failed", {
            status: 500
        })
    }
}