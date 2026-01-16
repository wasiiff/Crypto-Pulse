import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .regex(emailRegex, "Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
        .string()
        .min(1, "Email is required")
        .regex(emailRegex, "Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
