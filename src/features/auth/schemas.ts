import * as z from "zod";

export const passwordSchema = z
    .string()
    .min(8, "Password should be at least 8 characters")
    .max(16, "Select a password smaller than 16 characters");

export const SignInSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: passwordSchema,
});

export const SignUpSchema = z
    .object({
        email: z.string().min(1, "Email is required").email("Invalid email"),
        password: passwordSchema,
        confirmPassword: passwordSchema,
    })
    .refine(
        (values) => {
            return values.password === values.confirmPassword;
        },
        {
            message: "Passwords must match!",
            path: ["confirmPassword"],
        }
    );

export type SignInData = z.infer<typeof SignInSchema>;
export type SignUpData = z.infer<typeof SignUpSchema>;
