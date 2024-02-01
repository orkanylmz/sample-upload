import * as ImagePicker from "expo-image-picker";

export const useImagePicker = () => {
    const openPicker = async (): Promise<ImagePicker.ImagePickerAsset[]> => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            return result.assets;
        }

        return [];
    };

    return openPicker;
};
