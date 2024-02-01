import * as DocumentPicker from "expo-document-picker";

export const useDocumentPicker = () => {
    const openPicker = async (): Promise<
        DocumentPicker.DocumentPickerAsset[]
    > => {
        const result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
            multiple: true,
        });

        if (!result.canceled) {
            return result.assets;
        }

        return [];
    };

    return openPicker;
};
