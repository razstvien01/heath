import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

export async function GET()
{
    try {
        const ownerRepository = new OwnerRepository()
        const result = await ownerRepository.GetOwnerList()
        
        if(Array.isArray(result) && result.length > 0)
            return new Response(JSON.stringify(result), {
                status: 200,
            });
        return new Response("No owners found", {
            status: 404.
        })
        
    } catch (error) {
        console.error("Error processing request:", error)
        return new Response("Internal Server Error:", {
            status: 500
        })
    }
}