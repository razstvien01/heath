class OwnerDto {
  id: number | undefined;
  name: string = "";
  managementGuid: string = "";
  createdAt?: Date = new Date();
}

export default OwnerDto