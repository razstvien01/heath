import ADMIN_METHODS from "@/constants/admin.constants";
import AdminController from "@/controllers/admin.controller";

export async function POST(request: Request) {
  const formData = await request.formData();
  const method = formData.get("method");

  if (method == null) {
    return new Response("Bad Request", {
      status: 400,
    });
  }

  const adminController = new AdminController(formData);

  switch (method) {
    case ADMIN_METHODS.CONFIRM_ADMIN_LOGIN:
      try {
        if (!adminController.validateFormData()) {
          return new Response("Bad Request", {
            status: 400,
          });
        }

        if (await adminController.validateAdmin()) {
          return new Response("Valid Admin", {
            status: 200,
          });
        }

        return new Response("Bad Request", {
          status: 400,
        });
      } catch (error) {
        return new Response("Internal Server Error", {
          status: 500,
        });
      }
      
    case ADMIN_METHODS.IS_ADMIN_GUID:
      try{
        if(!adminController.validateGuid()){
          return new Response("Bad Request", {
            status: 400,
          });
        }
        
        if(await adminController.checkGuidExists()){
          return new Response("Good?", {
            status: 200,
          });
        }
        
        return new Response("Invalid Link", {
          status: 404,
        });
      } catch(error){
        return new Response("Internal Server Error", {
          status: 500,
        });
      }
    default:
      break;
  }
}
