import axiosInstance from "@/lib/axios";
import { z } from "zod";

export const AdminLoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  otp: z.string().optional(),
});
export type AdminLoginResponse = z.infer<typeof AdminLoginResponseSchema>;

export const AdminLoginVerifyResponseSchema = z.object({
  message: z.string(),
  tokens: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
});
export type AdminLoginVerifyResponse = z.infer<typeof AdminLoginVerifyResponseSchema>;

export const authApi = {
  // Always return the parsed result!
  sendOtp: async (email: string): Promise<AdminLoginResponse> => {
    const raw = await axiosInstance.post("/auth/admin/login", { email });
    return AdminLoginResponseSchema.parse(raw); 
  },

  verifyOtp: async (email: string, otp: string): Promise<AdminLoginVerifyResponse> => {
    const raw = await axiosInstance.post("/auth/admin/login/verify", { email, otp });
    return AdminLoginVerifyResponseSchema.parse(raw); 
  },
};
