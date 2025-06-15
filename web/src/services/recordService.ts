import { AuditRoutes, RecordRoutes } from "@/constants";
import { RecordFilterDto } from "@/dto/record";
import axios from "axios";

interface PageInfo {
  isPublic: boolean;
  isInvalid: boolean;
}

export async function isPublicGuid(guid: string) {
  const isPublicGuidUrl = AuditRoutes.IS_PUBLIC_GUID;

  const formData = new FormData();
  formData.append("guid", guid);

  let isInvalid = false;

  const val: boolean = await new Promise((resolve, reject) => {
    axios
      .post(isPublicGuidUrl, formData)
      .then((res) => {
        isInvalid = res.status !== 200;
        return res.data;
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });

  const output: PageInfo = {
    isInvalid: isInvalid,
    isPublic: val,
  };

  return output;
}

export async function fetchRecordsReq(
  formData: FormData,
  filter: RecordFilterDto
) {
  const getRecordsUrl = RecordRoutes.RECORD_LIST;
  const queryParams = new URLSearchParams();

  (Object.keys(filter) as (keyof RecordFilterDto)[]).forEach((key) => {
    const value = filter[key];
    if (value !== undefined && value !== null && value !== "")
      queryParams.append(key, String(value));
  });

  try {
    const res = await axios.post(
      `${getRecordsUrl}?${queryParams.toString()}`,
      formData
    );

    return res;
  } catch {
    return null;
  }
}

export async function addRecordReq(formData: FormData) {
  const addRecordUrl = RecordRoutes.ADD_RECORD;

  try {
    const res = await axios.post(addRecordUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.status === 200;
  } catch {
    return null;
  }
}

export async function editRecordReq(formData: FormData) {
  const editRecordUrl = RecordRoutes.EDIT_RECORD;
  try {
    const res = await axios.put(editRecordUrl, formData);

    return res.status === 200;
  } catch {
    return null;
  }
}

export async function deleteRecordReq(formData: FormData) {
  const deleteRecordUrl = RecordRoutes.DELETE_RECORD;

  try {
    const res = await axios.delete(deleteRecordUrl, { data: formData });

    return res.status === 200;
  } catch {
    return false;
  }
}
