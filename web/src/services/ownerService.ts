import { OwnerRoutes } from "@/constants/ownerRoutesConstants";
import axios from "axios";

export async function fetchOwnersReq() {
  const getOwnersUrl = OwnerRoutes.GET_OWNERS_URL;

  try {
    const res = await axios.get(getOwnersUrl);

    return res;
  } catch (error) {
    console.error("Error confirming admin loigin:", error);
    return null;
  }
}

export async function addOwnerReq(formData: FormData) {
  const addOwnerUrl = OwnerRoutes.ADD_OWNER_URL;

  try {
    const res = await axios.post(addOwnerUrl, formData);

    return res.status === 200
  } catch (error) {
    console.error("Error adding owner:", error);
    return null;
  }
}
