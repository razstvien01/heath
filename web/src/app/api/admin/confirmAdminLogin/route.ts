import { CreateConnection } from "@/config/mariadbConfig";
import { AdminRepository } from "@/repositories/mariaDb/AdminRepository";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const guid = formData.get("guid");
    const username = formData.get("username");
    const password = formData.get("password");

    if (guid == null || username == null || password == null) {
      return new Response("Bad Request", {
        status: 400,
      });
    }

    const db = await CreateConnection();
    const adminRepo = new AdminRepository(db);

    const result = await adminRepo.isAdminValid(
      guid.toString(),
      username.toString(),
      password.toString()
    );

    if (result) {
      return new Response("Valid Admin", {
        status: 200,
      });
    }
    return new Response("Bad Request", {
      status: 400,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
