export type PickupResponse = {
    id: number,
    name?: string,
    category?: string,
    lat?: number,
    lng?: number,
    status?: "ACTIVE" | "INACTIVE"
}