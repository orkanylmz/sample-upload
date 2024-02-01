import { File } from "@/api";

import { View, StyleSheet, Text, Dimensions } from "react-native";
import { Image } from "expo-image";
import { getFileType } from "@/features/files/helpers";
interface FilesListItemProps {
    file: File;
}

export const FilesListItem = ({ file }: FilesListItemProps) => {
    const width = Dimensions.get("window").width;

    const imageSize = width / 3 - 40;

    const { type, short } = getFileType(file.metadata.mimetype);

    if (type === "image") {
        return (
            <View
                style={{
                    width: imageSize,
                    height: imageSize,
                    borderRadius: 10,
                    borderWidth: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Image
                    style={{
                        width: imageSize - 6,
                        height: imageSize - 6,
                        borderRadius: 10,
                    }}
                    source={file.url}
                    contentFit="cover"
                    transition={1000}
                    recyclingKey={file.id}
                />
            </View>
        );
    }

    if (type === "file") {
        return (
            <View
                style={[
                    styles.fileContainer,
                    {
                        width: imageSize,
                        height: imageSize,
                    },
                ]}
            >
                <Text style={styles.fileType}>{short}</Text>
            </View>
        );
    }

    return null;
};

const styles = StyleSheet.create({
    fileContainer: {
        backgroundColor: "#4B4E6D",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
    fileType: {
        textTransform: "uppercase",
        fontSize: 16,
        color: "white",
        fontWeight: "bold",
    },
});
