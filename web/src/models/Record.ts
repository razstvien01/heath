export class Record {
  id?: number | undefined;
  auditId?: number | undefined;
  amount?: number | undefined;
  reason?: string;
  receipt?: Buffer<ArrayBuffer>;
  signature?: string;
  approved?: number | undefined;
  createdAt?: Date;
  updatedAt?: Date;
}
