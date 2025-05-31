const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_URL in environment variables");
}

const ADMIN_URL = BASE_URL + "/api/admin";

export const AdminRoutes = Object.freeze({
  IS_ADMIN_GUID_URL: `${ADMIN_URL}/isAdminGuid`,
  CONFIRM_ADMIN_URL: `${ADMIN_URL}/confirmAdminLogin`,
  FETCH_ADMIN_BY_GUID: `${ADMIN_URL}/fetchAdminByGuid`,
});
