// Hàm
export const getItemById = (array: any[], id: string | number) =>{
    return array?.find((item) => item.id === id);
}

// // Hàm
// export const getIndexById = (array: any[], id: string | number) =>{
//     console.log(array?.findIndex((item) => item.pickup.id === id));
//     return array?.findIndex((item) => item.id === id);
// }
