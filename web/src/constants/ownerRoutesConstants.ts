export const OwnerRoutes = {
  GET_OWNERS_ROUTE: process.env.NEXT_PUBLIC_API_URL + "/api/owner/ownersList",
  ADD_OWNER_ROUTE: process.env.NEXT_PUBLIC_API_URL + "/api/owner/addOwner",
  UPDATE_OWNER_ROUTE:
    process.env.NEXT_PUBLIC_API_URL + "/api/owner/updateOwner",
  DELETE_OWNER_ROUTE:
    process.env.NEXT_PUBLIC_API_URL + "/api/owner/deleteOwner",
  TOTAL_COUNTS_ROUTE:
    process.env.NEXT_PUBLIC_API_URL + "/api/owner/totalOwners",
  IS_OWNER_GUID: process.env.NEXT_PUBLIC_API_URL + "/api/owner/isOwnerGuid",
  CONFIRM_OWNER_URL:
    process.env.NEXT_PUBLIC_API_URL + "/api/owner/confirmOwnerLogin",
};
