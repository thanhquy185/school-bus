import { api } from '../api/api';

export const updatePassword = async (accountId: number, newPassword: string) => {
    const response = await api.put(`/api/accounts/${accountId}`, 
        { 
            password: newPassword 
        }
    );

    return response.data;
};