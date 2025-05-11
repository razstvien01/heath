import { OwnerRoutes } from "@/constants/ownerRoutesConstants";
import { OwnerCountFilterDto, OwnerFilterDto } from "@/dto/owner";
import axios from "axios";

export async function fetchOwnersReq(filter: OwnerFilterDto) {
  const getOwnersUrl = OwnerRoutes.GET_OWNERS_URL;
  const queryParams = new URLSearchParams();

  (Object.keys(filter) as (keyof OwnerFilterDto)[]).forEach((key) => {
    const value = filter[key];
    if (value !== undefined && value !== null && value !== "")
      queryParams.append(key, String(value));
  });

  try {
    const res = await axios.get(`${getOwnersUrl}?${queryParams.toString()}`);

    return res;
  } catch (error) {
    console.error("Error confirming admin loigin:", error);
    return null;
  }
}

export async function fetchTotalOwnersReq(
  filter: OwnerCountFilterDto
): Promise<number> {
  const getOwnerTotalCountRoute = OwnerRoutes.TOTAL_COUNTS_ROUTE;

  const queryParams = new URLSearchParams();

  (Object.keys(filter) as (keyof OwnerFilterDto)[]).forEach((key) => {
    const value = filter[key];
    if (value !== undefined && value !== null && value !== "")
      queryParams.append(key, String(value));
  });

  try {
    const res = await axios.get(
      `${getOwnerTotalCountRoute}?${queryParams.toString()}`
    );

    return res.data.total;
  } catch (error) {
    console.error("Error fetching total owners:", error);
    return 0;
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

export async function deleteOwnerReq(formData: FormData) {
  const deleteOwnerUrl = OwnerRoutes.DELETE_OWNER_URL;
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
