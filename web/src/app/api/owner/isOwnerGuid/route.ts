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

    const result : any = await new Promise((resolve, reject) => {
        var DB = CreateConnection();

        DB.query("SELECT * FROM Owners WHERE managementGuid = ?", [guid], 
        function(err, results) {
            if(err) {
                console.log('ERR', err);
                reject(err);
            }
            else {
                console.log('RESOLVED', results);
                resolve(results);
            }
        });
    });

    if(Array.isArray(result) && result.length > 0) {
        return new Response("Good?", {
            status: 200
        });
    } 

    return new Response("Invalid Link", {
        status: 404
    })
}