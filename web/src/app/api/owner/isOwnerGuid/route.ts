import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

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

    const ownerRepository = new OwnerRepository();
    const result = await ownerRepository.IsOwnerGuid(guid as string)

    if(result) {
        return new Response("Good?", {
            status: 200
        });
    } 

    return new Response("Invalid Link", {
        status: 404
    })
}