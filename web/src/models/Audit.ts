interface Audit {
    id: number | null | undefined;
    name: string;
    entries: number;
    publicGuid: string;
    ownerGuid: string;
}

export default Audit;