import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignInScreen, SignUpScreen } from "@/features/auth";
import { FilesScreen } from "@/features/files";
import { useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "@/context";
import { TouchableOpacity } from "react-native";
import FontAwesomeIcons from "@expo/vector-icons/FontAwesome6";
import { useMutation } from "@tanstack/react-query";
import { signout } from "@/api";

export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    Files: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    const { session } = useContext(AuthContext);

    const signoutMutation = useMutation({
        mutationFn: () => signout(),
    });

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!session ? (
                <Stack.Group>
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                </Stack.Group>
            ) : (
                <Stack.Screen
                    name="Files"
                    component={FilesScreen}
                    options={{
                        headerShown: true,
                        headerRight: () => (
                            <TouchableOpacity
                                onPress={() => signoutMutation.mutate()}
                            >
                                <FontAwesomeIcons
                                    name="arrow-right-from-bracket"
                                    size={24}
                                    color="#84DCC6"
                                />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: false,
                        headerTitle: "",
                    }}
                />
            )}
        </Stack.Navigator>
    );
};
