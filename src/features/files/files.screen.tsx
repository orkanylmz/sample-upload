import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { RootStackParamList } from "../../navigation";
import { useAuth } from "@/features/auth";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useMutation } from "@tanstack/react-query";
import { signout } from "@/api";
import { useFiles } from "@/features/files/use-files";
import { FilesList } from "@/features/files/files-list/files-list";
import { FAB } from "@/features/files/fab-button";
import { ActionSheet } from "@/features/files/components";
import { useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useImagePicker } from "@/features/files/use-image-picker";
import { useDocumentPicker } from "@/features/files/use-document-picker";
import { UploadQueue } from "@/features/files/upload-queue";

import { useUploadDispatch } from "@/context/upload";

export const FilesScreen = ({
    navigation,
}: NativeStackScreenProps<RootStackParamList, "Files">) => {
    const { bottom } = useSafeAreaInsets();
    const actionSheetRef = useRef<BottomSheetModal>(null);

    const selectImage = useImagePicker();
    const selectDocument = useDocumentPicker();
    const uploadDispatch = useUploadDispatch();

    const onPressFab = () => {
        actionSheetRef.current?.present();
    };

    const onSelectAction = async (type: "image" | "file") => {
        actionSheetRef.current?.close();

        if (type === "image") {
            const images = await selectImage();
            uploadDispatch({
                type: "ADD_TO_UPLOAD_QUEUE",
                objects: images.map((i) => ({
                    name: i.fileName,
                    mimeType: i.mimeType,
                    uri: i.uri,
                })),
            });
        }

        if (type === "file") {
            const files = await selectDocument();
            uploadDispatch({
                type: "ADD_TO_UPLOAD_QUEUE",
                objects: files.map((i) => ({
                    name: i.name,
                    mimeType: i.mimeType,
                    uri: i.uri,
                })),
            });
        }
    };

    return (
        <>
            <View
                style={{
                    flex: 1,
                    backgroundColor: "white",
                    paddingBottom: bottom,
                }}
            >
                <UploadQueue />
                <FilesList />
                <FAB onPress={onPressFab} />
            </View>
            <ActionSheet ref={actionSheetRef} onSelect={onSelectAction} />
        </>
    );
};

const styles = StyleSheet.create({
    welcome: {
        fontSize: 24,
    },
});
