import { AdminRoutes } from "@/constants/adminRoutesConstants";
import axios from "axios";

export async function isAdminGuid(guid: string): Promise<boolean>{
  const formData = new FormData();
  
  formData.append("guid", guid);
  
  try{
    const res = await axios.post(AdminRoutes.IS_ADMIN_GUID_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    
    return res.status === 200;
  } catch(error){
    console.error("Error checking admin GUID:", error);
    return false;
  }
  
}