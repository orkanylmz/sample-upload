import { File } from "@/api";
import { FilesListItem } from "@/features/files/files-list/files-list-item";
import { useFiles } from "@/features/files/use-files";
import { useRefreshByUser } from "@/hooks";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";

import {
    Text,
    View,
    StyleSheet,
    useWindowDimensions,
    RefreshControl,
} from "react-native";

export const FilesList = () => {
    const { width } = useWindowDimensions();

    const { data: files, isLoading, refetch } = useFiles();

    const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

    const renderItem = ({ item }: ListRenderItemInfo<File>) => {
        return (
            <View
                style={{
                    width: width / 3,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                }}
            >
                <FilesListItem file={item} />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Files</Text>
            <FlashList
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetchingByUser}
                        onRefresh={refetchByUser}
                    />
                }
                data={files}
                renderItem={renderItem}
                estimatedItemSize={80}
                ListEmptyComponent={() => (
                    <View style={{ alignItems: "center" }}>
                        <Text>You don't have any files</Text>
                    </View>
                )}
                numColumns={3}
                keyExtractor={(item: File) => item.id}
                contentContainerStyle={{ padding: 10 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 30,
        color: "black",
        fontWeight: "bold",
        alignSelf: "center",
        marginBottom: 10,
    },
});
