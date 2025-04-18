import { CreateConnection } from "@/config/mariadbConfig";
import { OwnerSchema } from "@/dto/owner/OwnerDto";
import OwnerMapper from "@/mappers/OwnerMapper";
import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();

    const guid = formData.get("guid");
    const username = formData.get("username");
    const passwd = formData.get("password");

    if (!username || !passwd || !guid) {
      return new Response("The username, guid, and password are required.", {
        status: 400,
      });
    }

    const input = {
      managementGuid: guid,
      name: username,
      password: passwd,
    };
    const validation = OwnerSchema.safeParse(input);

    if (!validation.success) {
      return new Response(
        `Bad Request: ${validation.error.issues[0].message}`,
        {
          status: 400,
        }
      );
    }

    const db = await CreateConnection();
    const repository = new OwnerRepository(db);
    const dto = OwnerMapper.toOwnerFromUpdateDto(validation.data);
    const result = await repository.updateOwner(dto);

    if (!result) {
      return new Response("Owner update failed", {
        status: 500,
      });
    }

    return new Response("Owner updated successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error:", {
      status: 500,
    });
  }
}
