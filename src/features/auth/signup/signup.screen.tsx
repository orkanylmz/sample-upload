import { APIAuthError, signup } from "@/api";
import { AuthContainer } from "@/features/auth/components";
import { SignUpData } from "@/features/auth/schemas";
import { SignUpForm } from "@/features/auth/signup/signup-form";
import { RootStackParamList } from "@/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const SignUpScreen = ({
    navigation,
}: NativeStackScreenProps<RootStackParamList, "SignUp">) => {
    const signupMutation = useMutation({
        mutationFn: (data: SignUpData) => signup(data.email, data.password),
        onError: (error: APIAuthError) => {
            Toast.show({
                type: "error",
                text1: "Singup Error",
                text2: error.message,
                position: "bottom",
            });
        },
    });

    const onSubmit = (data: SignUpData) => {
        signupMutation.mutate(data);
    };

    const onPressFooter = () => {
        navigation.navigate("SignIn");
    };

    return (
        <AuthContainer
            title="Sign Up"
            footerLabel="Already have any account?"
            footerButtonText="Login"
            onPressFooter={onPressFooter}
        >
            <SignUpForm
                isLoading={signupMutation.isPending}
                onSubmit={onSubmit}
            />
        </AuthContainer>
    );
};
