type StudentResponse = {
    id: number,
    avatar: string,
    full_name: string,
    birth_date: string,
    gender: string,
    address: string,
    status: string,
    parent: {
        id: number,
        full_name: string
    },
    class: {
        id: number,
        name: string
    },
    pickup: {
        id: number,
        name: string,
        category: string,
        lat: number,
        lng: number
    },
    route?: {
        id: number,
        name: string,
        category: string,
        lat: number,
        lng: number
    }[]
}

export type { StudentResponse };