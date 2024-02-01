import { ReactNode } from "react";
import {
    Pressable,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ViewStyle,
} from "react-native";

interface ButtonProps {
    label: string;
    icon?: ReactNode;
    isLoading?: boolean;
    onPress: () => void;
    style?: ViewStyle;
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        backgroundColor: "#4B4E6D",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    label: {
        color: "white",
        fontSize: 14,
    },
});

export const Button = ({ label, onPress, isLoading, style }: ButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, style]}
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator animating size="small" />
            ) : (
                <Text style={styles.label}>{label}</Text>
            )}
        </TouchableOpacity>
    );
};
