import { AdminRoutes } from "@/constants/adminRoutesConstants";
import axios from "axios";

export async function isAdminGuidReq(guid: string): Promise<boolean> {
  const formData = new FormData();

  formData.append("guid", guid);

  try {
    const res = await axios.post(AdminRoutes.IS_ADMIN_GUID_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.status === 200;
  } catch (error) {
    console.error("Error checking admin GUID:", error);
    return false;
  }
}

export async function confirmAdminLoginReq(
  guid: string,
  username: string,
  password: string
): Promise<boolean> {
  const formData = new FormData();

  formData.append("guid", guid);
  formData.append("username", username);
  formData.append("password", password);

  try {
    const res = await axios.post(AdminRoutes.CONFIRM_ADMIN_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.status === 200;
  } catch (error) {
    console.error("Error confirming admin login:", error);
    return false;
  }
}

export async function getAdminReq(guid: string) {
  try {
    const formData = new FormData();

    formData.append("guid", guid);

    const res = await axios.post(AdminRoutes.FETCH_ADMIN_BY_GUID, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch {
    return false;
  }
}
