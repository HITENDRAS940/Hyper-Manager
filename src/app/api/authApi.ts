import { apiRequest } from './baseApi';

export interface OtpRequestResponse {
    message?: string;
    // Add other fields if backend returns more
}

export interface VerifyOtpResponse {
    token: string;
}

export const authApi = {
    requestOtp: async (email: string): Promise<OtpRequestResponse> => {
        return apiRequest<OtpRequestResponse>('/auth/request-email-otp', {
            data: { email },
        });
    },

    verifyOtp: async (email: string, otp: string): Promise<VerifyOtpResponse> => {
        return apiRequest<VerifyOtpResponse>('/auth/verify-email-otp', {
            data: { email, otp },
        });
    },
};
