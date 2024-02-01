import { forwardRef } from "react";
import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
} from "@gorhom/bottom-sheet";
import {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
} from "react-native-reanimated";
import { Button } from "@/components/ui";

const CustomBackdrop = ({
    animatedIndex,
    style,
    ...rest
}: BottomSheetBackdropProps) => {
    // animated variables
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            animatedIndex.value,
            [0, 1],
            [0, 1],
            Extrapolation.CLAMP
        ),
    }));

    // styles
    const containerStyle = useMemo(
        () => [
            style,
            {
                backgroundColor: "rgba(0,0,0,0.5)",
            },
        ],
        [style, containerAnimatedStyle]
    );

    return (
        <BottomSheetBackdrop
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            animatedIndex={animatedIndex}
            {...rest}
            style={containerStyle}
            pressBehavior="close"
        />
    );
};

interface ActionSheetProps {
    onSelect: (type: "image" | "file") => void;
}

export const ActionSheet = forwardRef<BottomSheetModal, ActionSheetProps>(
    ({ onSelect }, ref) => {
        // variables
        const snapPoints = useMemo(() => ["25%"], []);

        return (
            <BottomSheetModal
                ref={ref}
                index={0}
                snapPoints={snapPoints}
                backdropComponent={CustomBackdrop}
            >
                <View style={styles.contentContainer}>
                    <Button
                        label="Image"
                        style={{ marginBottom: 20, height: 50 }}
                        onPress={() => onSelect("image")}
                    />
                    <Button
                        label="File"
                        style={{ height: 50 }}
                        onPress={() => onSelect("file")}
                    />
                </View>
            </BottomSheetModal>
        );
    }
);

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 20,
        width: "100%",
        alignItems: "center",
    },
});
