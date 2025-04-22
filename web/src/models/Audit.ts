class Audit {
  id?: number | undefined;
  name?: string = "";
  publicGuid?: string = "";
  ownerGuid?: string = "";
  createdAt?: Date = new Date();
}

export default Audit;
