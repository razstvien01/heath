import { CreateConnection  } from "@/config/mariadbConfig";

export async function POST(request: Request)
{
    const formData = await request.formData();
    const guid = formData.get("guid");
    if(guid == null)
    {
        return new Response("Bad", {
            status: 400
        })
    }

    const isPublicResult : any = await new Promise((resolve, reject) => {
        var DB = CreateConnection();

        DB.query("SELECT * FROM Audits WHERE publicGuid = ?", [guid], 
        function(err, results) {
            if(err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });


    if(Array.isArray(isPublicResult) && isPublicResult.length > 0) {
        return new Response(JSON.stringify(true), {
            status: 200,
        });
    } 

    const isPrivateResult : any = await new Promise((resolve, reject) => {
        var DB = CreateConnection();

        DB.query("SELECT * FROM Audits WHERE ownerGuid = ?", [guid], 
        function(err, results) {
            if(err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });


    if(Array.isArray(isPrivateResult) && isPrivateResult.length > 0) {
        return new Response(JSON.stringify(false), {
            status: 200,
        });
    }

    return new Response(JSON.stringify(false), {
        status: 500
    })
}