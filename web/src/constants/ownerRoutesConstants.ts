const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_URL in environment variables");
}

const OWNER_URL = BASE_URL + "/api/owner";

export const OwnerRoutes = Object.freeze({
  GET_OWNERS: `${OWNER_URL}/ownersList`,
  ADD_OWNER: `${OWNER_URL}/addOwner`,
  UPDATE_OWNER: `${OWNER_URL}/updateOwner`,
  DELETE_OWNER: `${OWNER_URL}/deleteOwner`,
  TOTAL_COUNTS: `${OWNER_URL}/totalOwners`,
  IS_OWNER_GUID: `${OWNER_URL}/isOwnerGuid`,
  CONFIRM_OWNER_LOGIN: `${OWNER_URL}/confirmOwnerLogin`,
  FETCH_OWNER_BY_GUID: `${OWNER_URL}/fetchOwnerByGuid`,
});
