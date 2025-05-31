import { OwnerRoutes } from "@/constants/ownerRoutesConstants";
import { OwnerFilterDto } from "@/dto/owner";
import axios from "axios";

export async function fetchOwnersReq(filter: OwnerFilterDto) {
  const getOwnersUrl = OwnerRoutes.GET_OWNERS;
  const queryParams = new URLSearchParams();

  (Object.keys(filter) as (keyof OwnerFilterDto)[]).forEach((key) => {
    const value = filter[key];
    if (value !== undefined && value !== null && value !== "")
      queryParams.append(key, String(value));
  });

  try {
    const res = await axios.get(`${getOwnersUrl}?${queryParams.toString()}`);

    return res;
  } catch {
    return null;
  }
}

export async function addOwnerReq(formData: FormData) {
  const addOwnerUrl = OwnerRoutes.ADD_OWNER;

  try {
    const res = await axios.post(addOwnerUrl, formData);

    return res.status === 200;
  } catch (error) {
    console.error("Error adding owner:", error);
    return null;
  }
}

export async function updateOwnerReq(formData: FormData) {
  const updateOwnerUrl = OwnerRoutes.UPDATE_OWNER;
  try {
    const res = await axios.put(updateOwnerUrl, formData);

    return res.status === 200;
  } catch (error) {
    console.error("Error updating owner:", error);
    return null;
  }
}

export async function deleteOwnerReq(formData: FormData) {
  const deleteOwnerUrl = OwnerRoutes.DELETE_OWNER;
  try {
    const res = await axios.delete(deleteOwnerUrl, {
      data: formData,
    });

    return res.status === 200;
  } catch (error) {
    console.error("Error deleting owner:", error);
    return null;
  }
}

export async function isOwnerGuid(guid: string) {
  const isAdminGuidUrl = OwnerRoutes.IS_OWNER_GUID;

  const formData = new FormData();
  formData.append("guid", guid);

  try {
    const res = await axios.post(isAdminGuidUrl, formData);

    return res.status === 200;
  } catch {
    return false;
  }
}

export const confirmOwnerLoginReq = async (
  guid: string,
  username: string,
  password: string
): Promise<boolean> => {
  const formData = new FormData();

  formData.append("guid", guid);
  formData.append("username", username);
  formData.append("password", password);

  try {
    const res = await axios.post(OwnerRoutes.CONFIRM_OWNER_LOGIN, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.status === 200;
  } catch {
    return false;
  }
};

export const getOwnerReq = async (guid: string) => {
  const fetchOwnerByGuid = OwnerRoutes.FETCH_OWNER_BY_GUID;
  const formData = new FormData();

  formData.append("guid", guid);

  const res = await axios.post(fetchOwnerByGuid, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
