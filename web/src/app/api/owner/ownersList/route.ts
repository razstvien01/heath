import { CreateConnection } from "@/config/mariadbConfig";
import { OwnerSchema } from "@/dto/owner/OwnerDto";
import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";
import { z } from "zod";

export async function GET(): Promise<Response> {
  try {
    const db = await CreateConnection();
    const ownerRepository = new OwnerRepository(db);
    const owners = await ownerRepository.GetOwnerList();

    if (!owners || owners.length === 0) {
      return new Response(JSON.stringify({ message: "No Owners found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const ownersValidation = z.array(OwnerSchema).safeParse(owners);

    if (!ownersValidation.success) {
      console.error(
        "Invalid owners data from DB",
        ownersValidation.error.format()
      );

      return new Response(
        JSON.stringify({ message: "Currupted owners data" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(JSON.stringify(owners), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error:", {
      status: 500,
    });
  }
}
