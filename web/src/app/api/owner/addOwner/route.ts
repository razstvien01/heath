import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

export async function POST(request: Request)
{
    const formData = await request.formData();

    const username = formData.get("username");
    const password = formData.get("password");

    if(username == null || password == null)
    {
        return new Response("Bad", {
            status: 400
        })
    }

    const repository = new OwnerRepository();
    const result = await repository.AddOwner(username as string, password as string)

    if(result) {
        return new Response("Owner inserted successfully", {
            status: 200
        });
    } else {
        return new Response("Owner insert failed", {
            status: 500
        })
    }
}