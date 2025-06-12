const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_URL in environment variables");
}

const RECORD_URL = BASE_URL + "/api/record";

export const RecordRoutes = Object.freeze({
  IS_PUBLIC_GUID: `${RECORD_URL}/isPublicGuid`,
});
