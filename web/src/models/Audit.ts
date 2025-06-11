export class Audit {
  id?: number | undefined;
  name?: string = "";
  description?: string = "";
  publicGuid?: string = "";
  ownerGuid?: string = "";
  createdAt?: Date = new Date();
}
