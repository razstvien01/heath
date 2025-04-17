import { CreateConnection } from "@/config/mariadbConfig";
import { OwnerSchema } from "@/dto/owner/OwnerDto";
import { OwnerFilterSchema } from "@/dto/owner/OwnerFIlterDto";
import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";
import { z } from "zod";

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);

    const body = {
      name: searchParams.get("name") ?? undefined,
      createdFrom: searchParams.get("createdFrom") ?? undefined,
      createdTo: searchParams.get("createdTo") ?? undefined,
      updatedFrom: searchParams.get("updatedFrom") ?? undefined,
      updatedTo: searchParams.get("updatedTo") ?? undefined,
      orderBy: searchParams.get("orderBy") ?? undefined,
      orderDirection: searchParams.get("orderDirection") ?? undefined,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : undefined,
    };

    const parsed = OwnerFilterSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          message: "Invalid filter",
          issues: parsed.error.format(),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const db = await CreateConnection();
    const ownerRepository = new OwnerRepository(db);
    const owners = await ownerRepository.getOwnerList(parsed.data);

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
