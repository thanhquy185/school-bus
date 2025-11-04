export type ParentResponse = {
    id: number,
    full_name: string,
    phone: string,
    email: string,
    address: string,
    account_id: number,
    status: "ACTIVE" | "INACTIVE",
}