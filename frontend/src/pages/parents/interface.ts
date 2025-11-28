export interface CurrentActiveStudent {
    // Some object i don't use. Read in request to update this
    active_id: number,
    at: any,
    status: string,
    student: {
        avatar: string,
        pickup: {
            name: string,
            lat: number,
            lng: number
        }
    },
    student_id: 1
}