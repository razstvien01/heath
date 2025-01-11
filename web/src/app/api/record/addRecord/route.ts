import { CreateConnection  } from "@/config/mariadbConfig";

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

    var DB = CreateConnection();

    const auditId: any = await new Promise((resolve, reject) => {

        DB.query("SELECT id FROM Audits WHERE publicGuid = ? or ownerGuid = ?", [guid, guid], 
        function(err, results) {
            if(err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });


    if(!Array.isArray(auditId) || auditId.length <= 0) {
        return new Response("Invalid Request", {
            status: 500
        })
    } 

    const result = DB.execute("INSERT INTO Records (auditId, amount, reason, receipt, signature, approved) VALUES " +
        "(?, ?, ?, ?, ?, ?)", 
        [auditId[0].id, balance, reason, receipt, signature, 0],
    );

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