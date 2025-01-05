import OWNER_METHODS from "@/constants/owner.constants";
import OwnerController from "@/controllers/owner.controller";

export async function POST(request: Request) {
  const formData = await request.formData();
  const method = formData.get("method");

  if (method == null) {
    return new Response("Bad Request", {
      status: 400,
    });
  }

  const ownerController = new OwnerController(formData);

  switch (method) {
    case OWNER_METHODS.ADD_OWNER:
      try {
        if (!ownerController.validateFormData()) {
          return new Response("Bad Request", {
            status: 400,
          });
        }

        if (await ownerController.addOwner()) {
          return new Response("Owner inserted successfully", {
            status: 200,
          });
        }

        return new Response("Owner insert failed", {
          status: 500,
        });
      } catch (error) {
        return new Response("Internal Server Error", {
          status: 500,
        });
      }

    case OWNER_METHODS.OWNER_LIST:
      try {
        const result = await ownerController.getOwners();
        return new Response(JSON.stringify(result), {
          status: 200,
        });
      } catch (error) {
        return new Response("Internal Server Error", {
          status: 500,
        });
      }
    default:
      break;
  }
}
