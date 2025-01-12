import { DocumentData } from "firebase/firestore";

export interface AdminProfile extends DocumentData {
  name: string;
  password: string;
  ownerManagementGuid: string;
};
