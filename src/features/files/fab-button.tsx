import { TouchableOpacity, StyleSheet } from "react-native";
import FontAwesomeIcons from "@expo/vector-icons/FontAwesome6";

export const FAB = ({ onPress }: { onPress: () => void }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <FontAwesomeIcons name="plus" size={32} color="#84DCC6" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#4B4E6D",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        right: 40,
        bottom: 40,
    },
});
