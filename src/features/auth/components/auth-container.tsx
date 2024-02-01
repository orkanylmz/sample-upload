import { ReactNode } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface AuthContainerProps {
    title?: string;
    children: ReactNode;
    footerLabel?: string;
    footerButtonText?: string;
    onPressFooter?: () => void;
}

export const AuthContainer = ({
    title,
    children,
    footerButtonText,
    footerLabel,
    onPressFooter,
}: AuthContainerProps) => {
    const { bottom } = useSafeAreaInsets();
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{title}</Text>
                    <KeyboardAwareScrollView scrollEnabled={false}>
                        {children}
                    </KeyboardAwareScrollView>
                </View>

                <View
                    style={[
                        styles.footer,
                        { marginBottom: bottom > 0 ? bottom + 10 : 10 },
                    ]}
                >
                    <TouchableOpacity
                        onPress={onPressFooter}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text style={styles.footerLabel}>{footerLabel}</Text>
                        <Text style={styles.footerButtonText}>
                            {footerButtonText}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#84DCC6",
        justifyContent: "flex-end",
    },
    innerContainer: {
        backgroundColor: "#efefef",
        minHeight: Dimensions.get("window").height - 150,
        width: "100%",
        borderTopLeftRadius: 70,
        paddingHorizontal: 15,
        paddingTop: 35,
        justifyContent: "space-between",
    },
    title: {
        fontSize: 32,
        fontWeight: "400",
        color: "#222222",
        alignSelf: "center",
        marginBottom: 25,
    },
    footer: {
        padding: 10,
    },
    footerLabel: {
        color: "#4B4E6D",
        fontWeight: "bold",
    },
    footerButtonText: {
        color: "#222222",
        fontWeight: "bold",
        marginLeft: 5,
    },
});
