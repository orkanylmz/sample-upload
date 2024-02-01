import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { RootStackParamList } from "../../../navigation";
import { AuthContainer } from "@/features/auth/components";
import { SignInForm } from "./signin-form";
import { useMutation } from "@tanstack/react-query";
import { APIAuthError, APIError, login } from "@/api";
import { SignInData } from "@/features/auth/schemas";
import Toast from "react-native-toast-message";

export const SignInScreen = ({
    navigation,
}: NativeStackScreenProps<RootStackParamList, "SignIn">) => {
    const loginMutation = useMutation({
        mutationFn: (data: SignInData) => login(data.email, data.password),
        onError: (error: APIAuthError) => {
            Toast.show({
                type: "error",
                text1: "Login Error",
                text2: error.message,
                position: "bottom",
            });
        },
    });

    const onSubmit = (data: SignInData) => {
        loginMutation.mutate(data);
    };

    const onPressFooter = () => {
        navigation.navigate("SignUp");
    };

    return (
        <AuthContainer
            title="Login"
            footerLabel="Don't have any account?"
            footerButtonText="Sign Up"
            onPressFooter={onPressFooter}
        >
            <SignInForm
                isLoading={loginMutation.isPending}
                onSubmit={onSubmit}
            />
        </AuthContainer>
    );
};
