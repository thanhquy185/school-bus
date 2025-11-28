import { ClassResponse } from "./class.response";
import { ParentResponse } from "./parent.response";
import { PickupResponse } from "./pickup.response";

type StudentResponse = {
    id: number,
    parent?: ParentResponse,
    class?: ClassResponse,
    pickup?: PickupResponse
    avatar?: string,
    card_id?: string,
    full_name?: string,
    birth_date?: string,
    gender?: string,
    address?: string,
    status?: "STUDYING" | "DROPPED_OUT",
}

export type { StudentResponse };