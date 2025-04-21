import { CreateConnection } from "@/config/mariadbConfig";
import { AdminRepository } from "@/repositories/mariaDb/AdminRepository";
import { AdminSchema } from "@/dto/admin/AdminDto";
import AdminMapper from "@/mappers/AdminMapper";

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();

    const input = {
      ownerManagementGuid: formData.get("guid"),
      name: formData.get("username"),
      password: formData.get("password"),
    };

    const parsed = AdminSchema.safeParse(input);
    if (!parsed.success) {
      return new Response(`Bad Request: ${parsed.error.issues[0].message}`, {
        status: 400,
      });
    }

    const db = await CreateConnection();
    const adminRepo = new AdminRepository(db);
    const dto = AdminMapper.toConfirmAdminDto(parsed.data);
    const isValid = await adminRepo.isAdminValid(dto);
    if (!isValid) {
      return new Response("Invalid Credentials", { status: 400 });
    }

    return new Response("Valid Credentials", { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return new Response(message, {
      status: message === "Owner with this name already exists." ? 400 : 500,
    });
  }
}
