class Record {
  id?: number | undefined;
  auditId?: number | undefined;
  amount?: number | undefined;
  reason?: string = "";
  receipt?: Buffer;
  signature?: string = "";
  approved?: number | undefined;
  createdAt?: Date = new Date();
  updatedAt?: Date = new Date();
}

export default Record;
