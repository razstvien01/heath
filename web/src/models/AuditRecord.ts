interface AuditRecord {
    receipt: { data: [] } | null;
    reason: string;
    signature: string | null;
    id: number;
    amount: number;
    dateCreatedEpoch: number;
    dateCreated: Date;
    hasReceipt: boolean;
    hasSignature: boolean;
    runningBalance: number;
}

export default AuditRecord;