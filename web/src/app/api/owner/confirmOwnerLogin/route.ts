import { CreateConnection } from "@/config/mariadbConfig";
import { OwnerSchema } from "@/dto/owner/OwnerDto";
import OwnerMapper from "@/mappers/OwnerMapper";
import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();

    const input = {
      managementGuid: formData.get("guid"),
      name: formData.get("username"),
      password: formData.get("password"),
    };

    if (!input.name || input.managementGuid || !input.password) {
      return new Response("The username, guid, and password are required.", {
        status: 400,
      });
    }

    const parsed = OwnerSchema.safeParse(input);

    if (!parsed.success) {
      return new Response(`Bad Request: ${parsed.error.issues[0].message}}`, {
        status: 400,
      });
    }
    const db = await CreateConnection();
    const ownerRepo = new OwnerRepository(db);
    const dto = OwnerMapper.toConfirmOwnerDto(parsed.data);
    const isValid = await ownerRepo.confirmOwnerLogin(dto);

    if (!isValid) {
      return new Response("Invalid Owner", {
        status: 400,
      });
    }

    return new Response("Valid Owner", {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error:", {
      status: 500,
    });
  }
}
