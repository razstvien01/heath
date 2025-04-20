interface Audit {
    id: number | undefined;
    name: string;
    entries: number;
    publicGuid: string;
    ownerGuid: string;
}

export default Audit;