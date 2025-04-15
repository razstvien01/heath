import { CreateConnection } from "@/config/mariadbConfig";
import { OwnerSchema } from "@/dto/owner/OwnerDto";
import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const name = formData.get("username");
    const password = formData.get("password");

    if (name == null || password == null) {
      return new Response("Username and password are required", {
        status: 400,
      });
    }

    const parsed = OwnerSchema.safeParse({ name, password });

    if (!parsed.success) {
      return new Response(`Bad Request: ${parsed.error.issues[0].message}`, {
        status: 400,
      });
    }

    const db = await CreateConnection();
    const ownerRepo = new OwnerRepository(db);
    const result = await ownerRepo.AddOwner(
      parsed.data.name,
      parsed.data.password
    );

    if (!result) {
      return new Response("Owner insert failed", {
        status: 500,
      });
    }

    return new Response("Owner inserted successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
