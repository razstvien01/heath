interface Admin {
  id: number;
  name: string;
  password: string;
  ownerManagementGuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export default Admin