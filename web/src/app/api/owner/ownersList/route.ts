import { CreateConnection  } from "@/config/mariadbConfig";

export async function POST(request: Request)
{
    try {
        const result: any = await new Promise((resolve, reject) => {
            var DB = CreateConnection();

            DB.query("SELECT * FROM Owners",
                function (err, results) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(results);
                    }
                }
            );
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