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

        DB.query("SELECT * FROM Admins WHERE ownerManagementGuid = ?", [guid], 
        function(err, results) {
            if(err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });

    if(Array.isArray(result) && result.length > 0) {
        console.log("Guid exists");
        return new Response("Good?", {
            status: 200
        });
    } 

    return new Response("Invalid Link", {
        status: 404
    })
}