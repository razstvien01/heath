import { CreateConnection  } from "@/config/mariadbConfig";

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

        const auditId: any = await new Promise((resolve, reject) => {
            var DB = CreateConnection();

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

        const result: any = await new Promise((resolve, reject) => {
            var DB = CreateConnection();

            DB.query("SELECT * FROM Records WHERE auditId = ?", [auditId[0].id],
                function (err, results) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(results);
                    }
                });
        });

        return new Response(JSON.stringify(result), {
            status: 200,
        });
    } catch (e) {
        return new Response(null, {
            status: 400,
        });
    }
}