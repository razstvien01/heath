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

        const ownerId: any = await new Promise((resolve, reject) => {
            var DB = CreateConnection();

            DB.query("SELECT id FROM Owners WHERE managementGuid = ?", [guid], 
            function(err, results) {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(results);
                }
            });
        });

        if(!Array.isArray(ownerId) || ownerId.length <= 0) {
            return new Response("Invalid Request", {
                status: 500
            })
        } 

        const result: any = await new Promise((resolve, reject) => {
            var DB = CreateConnection();

            DB.query("SELECT *, 0 as entries FROM Audits WHERE ownerId = ?", [ownerId[0].id],
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