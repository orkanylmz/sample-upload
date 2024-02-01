import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "./navigation";
import { AppStateStatus, Platform, View } from "react-native";
import Toast from "react-native-toast-message";
import { QueryClientProvider, focusManager } from "@tanstack/react-query";
import { useAppState, useOnlineManager } from "@/hooks";
import { useCallback, useContext } from "react";
import * as SplashScreen from "expo-splash-screen";

import { AuthContext, AuthProvider } from "@/context";
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { UploadProvider } from "@/context/upload";
import { queryClient } from "@/lib/query-client";

function onAppStateChange(status: AppStateStatus) {
    // React Query already supports in web browser refetch on window focus by default
    if (Platform.OS !== "web") {
        focusManager.setFocused(status === "active");
    }
}

const AppInner = () => {
    const insets = useSafeAreaInsets();
    const { isLoading } = useContext(AuthContext);

    const onLayoutRootView = useCallback(async () => {
        if (!isLoading) {
            await SplashScreen.hideAsync();
        }
    }, [isLoading]);

    if (isLoading) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
                <NavigationContainer>
                    <BottomSheetModalProvider>
                        <UploadProvider>
                            <RootNavigator />
                            <Toast />
                        </UploadProvider>
                    </BottomSheetModalProvider>
                </NavigationContainer>
            </View>
        </GestureHandlerRootView>
    );
};

const App = () => {
    useOnlineManager();

    useAppState(onAppStateChange);

    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <AppInner />
                </AuthProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    );
};

export default App;
