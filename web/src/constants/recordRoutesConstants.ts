const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_URL in environment variables");
}

const RECORD_URL = BASE_URL + "/api/record";

export const RecordRoutes = Object.freeze({
  FETCH_RECORDS: `${RECORD_URL}/fetchRecords`,
  RECORD_LIST: `${RECORD_URL}/recordList`,
  ADD_RECORD: `${RECORD_URL}/addRecord`,
  EDIT_RECORD: `${RECORD_URL}/editRecord`,
  DELETE_RECORD: `${RECORD_URL}/deleteRecord`,
});
