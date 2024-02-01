import { UploadObject, useFileProgress, useUploadState } from "@/context";
import { useCallback } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { MotiView, MotiText, AnimatePresence } from "moti";
import { Image } from "expo-image";
import { getFileType } from "@/features/files/helpers";

const UploadQueueItem = ({ file }: { file: UploadObject }) => {
    const progress = useFileProgress(file.id!);

    const { type, short } = getFileType(file.mimeType);

    return (
        <View style={styles.item} key={file.id}>
            <View
                style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: "rgba(0,0,0,0.25)",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                }}
            >
                <Text style={{ fontSize: 18, color: "white" }}>{progress}</Text>
            </View>
            {type === "image" ? (
                <Image source={{ uri: file.uri }} style={styles.image} />
            ) : (
                <View style={styles.file}>
                    <Text style={styles.fileType}>{short}</Text>
                </View>
            )}
        </View>
    );
};

export const UploadQueue = () => {
    const { files } = useUploadState();

    const renderItem = useCallback((f: UploadObject) => {
        return <UploadQueueItem key={f.id!} file={f} />;
    }, []);

    return (
        <AnimatePresence>
            {files.length > 0 ? (
                <MotiView
                    from={{ opacity: 0, translateY: -80 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    style={{ marginTop: 20, marginBottom: 20 }}
                    exit={{
                        opacity: 0,
                        translateY: -80,
                    }}
                    transition={{ duration: 350 }}
                >
                    <Text style={styles.title}>Uploads</Text>
                    <View style={styles.container}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                alignItems: "center",
                                paddingLeft: 5,
                            }}
                        >
                            {files.map(renderItem)}
                        </ScrollView>
                    </View>
                </MotiView>
            ) : null}
        </AnimatePresence>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#95A3B3",
        marginHorizontal: 20,
        flexDirection: "row",
        height: 80,
    },
    title: {
        fontSize: 30,
        color: "black",
        fontWeight: "bold",
        alignSelf: "center",
        marginBottom: 10,
    },
    item: {
        width: 70,
        height: 70,
        borderRadius: 8,
        borderColor: "#95A3B3",
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    file: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: "#4B4E6D",
        alignItems: "center",
        justifyContent: "center",
    },
    fileType: {
        textTransform: "uppercase",
        fontSize: 16,
        color: "white",
        fontWeight: "bold",
    },
});
