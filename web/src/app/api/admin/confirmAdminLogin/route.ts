import { CreateConnection  } from "@/config/mariadbConfig";

export async function POST(request: Request)
{
    const formData = await request.formData();
    const guid = formData.get("guid");
    const username = formData.get("username");
    const password = formData.get("password");

    if(guid == null || username == null || password == null)
    {
        return new Response("Bad Request", {
            status: 400
        })
    }

    const result : any = await new Promise((resolve, reject) => {
        var DB = CreateConnection();

        DB.query("SELECT * FROM Admins WHERE ownerManagementGuid = ? and name = ? and password = SHA2(?, 256)", [guid, username, password], 
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
        return new Response("Valid Admin", {
            status: 200
        });
    } 

    return new Response("Bad Request", {
        status: 400
    })
}