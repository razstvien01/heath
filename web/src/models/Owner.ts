class Owner {
  id?: number | undefined;
  name?: string = "";
  managementGuid?: string = "";
  password?: string = "";
  createdAt?: Date = new Date();
  updatedAt?: Date = new Date();
}

export default Owner;
