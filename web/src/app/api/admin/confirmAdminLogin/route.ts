import { CreateConnection } from "@/config/mariadbConfig";
import { AdminRepository } from "@/repositories/mariaDb/AdminRepository";
import { AdminSchema } from "@/dto/admin/AdminDto";

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

    const { ownerManagementGuid, name, password } = parsed.data;

    const db = await CreateConnection();
    const adminRepo = new AdminRepository(db);

    const isValid = await adminRepo.isAdminValid(
      ownerManagementGuid,
      name,
      password
    );
    if (!isValid) {
      return new Response("Invalid Credentials", { status: 400 });
    }

    return new Response("Valid Credentials", { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
