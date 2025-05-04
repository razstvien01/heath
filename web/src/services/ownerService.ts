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

    return res.status === 200;
  } catch (error) {
    console.error("Error adding owner:", error);
    return null;
  }
}

export async function updateOwnerReq(formData: FormData) {
  const updateOwnerUrl = OwnerRoutes.UPDATE_OWNER_URL;
  try {
    const res = await axios.put(updateOwnerUrl, formData);

    return res.status === 200;
  } catch (error) {
    console.error("Error updating owner:", error);
    return null;
  }
}

export async function deleteOwnerReq(formData: FormData){
  const deleteOwnerUrl = OwnerRoutes.DELETE_OWNER_URL;
  try {
    const res = await axios.delete(deleteOwnerUrl, {
      data: formData
    });

    return res.status === 200;
  } catch (error) {
    console.error("Error deleting owner:", error);
    return null;
  }
}