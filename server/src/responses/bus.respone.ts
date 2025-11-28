export type BusResponse = {
    id: number,
    license_plate?: string,
    capacity?: number,
    status?: "ACTIVE" | "INACTIVE"
}