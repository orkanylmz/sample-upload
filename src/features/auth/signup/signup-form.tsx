import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { View, StyleSheet } from "react-native";
import { Button, FormInput } from "@/components/ui";
import { SignInData, SignUpData, SignUpSchema } from "@/features/auth/schemas";

interface SignInFormProps {
    isLoading: boolean;
    onSubmit: (data: SignInData) => void;
}

export const SignUpForm = ({ isLoading, onSubmit }: SignInFormProps) => {
    const methods = useForm<SignUpData>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        mode: "onSubmit",
    });

    return (
        <View style={styles.container}>
            <FormProvider {...methods}>
                <FormInput
                    name="email"
                    label="Email"
                    placeholder="john@example.com"
                    error={methods.formState.errors.email?.message}
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    editable={!isLoading}
                />
                <FormInput
                    name="password"
                    label="Password"
                    placeholder="password"
                    secureTextEntry
                    error={methods.formState.errors.password?.message}
                    editable={!isLoading}
                />
                <FormInput
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="password"
                    secureTextEntry
                    error={methods.formState.errors.confirmPassword?.message}
                    editable={!isLoading}
                />
                <Button
                    label="Login"
                    onPress={methods.handleSubmit(onSubmit)}
                    isLoading={isLoading}
                />
            </FormProvider>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
});
