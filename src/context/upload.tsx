import { AsyncActionHandlers, useReducerAsync } from "use-reducer-async";
import { createContainer } from "react-tracked";
import { Reducer } from "react";
import * as tus from "tus-js-client";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import { supabase } from "@/lib/supabase";

import { getFile } from "@/api";
import { queryClient } from "@/lib/query-client";

export type UploadObject = {
    name: string;
    mimeType: string;
    uri: string;
    id?: string;
    progress: 0;
};

type State = {
    files: UploadObject[];
    filesById: { [id: string]: UploadObject };
};

const initialState: State = {
    files: [],
    filesById: {},
};

type Action =
    | { type: "START"; object: UploadObject }
    | { type: "SET_STATUS"; id: string; progress: number };

const reducer: Reducer<State, Action> = (state, action) => {
    switch (action.type) {
        case "START":
            return {
                ...state,
                files: [...state.files, action.object],
                filesById: {
                    ...state.filesById,
                    [action.object.id!]: action.object,
                },
            };
        case "SET_STATUS":
            const { id, progress } = action;
            const exists = state.filesById[id];
            if (exists) {
                if (progress === 100) {
                    const newFiles = state.files.filter((f) => f.id !== id);
                    const newFilesById = { ...state.filesById };
                    delete newFilesById[id];
                    return {
                        ...state,
                        files: newFiles,
                        filesById: newFilesById,
                    };
                } else {
                    return {
                        ...state,
                        filesById: {
                            ...state.filesById,
                            [id]: {
                                ...state.filesById[id],
                                progress,
                            },
                        },
                    };
                }
            }
            return state;
        default:
            return state;
    }
};

type AsyncActionStartUpload = { type: "START_UPLOAD"; object: UploadObject };

type AsyncActionAddToUploadQueue = {
    type: "ADD_TO_UPLOAD_QUEUE";
    objects: UploadObject[];
};

type AsyncAction = AsyncActionStartUpload | AsyncActionAddToUploadQueue;

const asyncActionHandlers: AsyncActionHandlers<
    Reducer<State, Action>,
    AsyncAction
> = {
    START_UPLOAD:
        ({ dispatch }) =>
        async (action) => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            dispatch({
                type: "START",
                object: action.object,
            });

            const {
                id: objectId,
                mimeType,
                uri,
                name: objectName,
            } = action.object;

            let fileUri = uri;

            if (mimeType.startsWith("image")) {
                const r = await manipulateAsync(
                    uri,
                    [
                        {
                            resize: {
                                width: 1080,
                            },
                        },
                    ],
                    { compress: 0.9 }
                );
                fileUri = r.uri;
            }

            const data = await fetch(fileUri);
            const blob = await data.blob();

            const filename = `${objectId}_${objectName}`;

            const upload = new tus.Upload(blob, {
                endpoint: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
                retryDelays: [0, 3000, 5000, 10000, 20000],
                headers: {
                    authorization: `Bearer ${session?.access_token}`,
                    "x-upsert": "true",
                },
                uploadDataDuringCreation: true,
                removeFingerprintOnSuccess: true,
                metadata: {
                    bucketName: "files",
                    objectName: `${session?.user.id}/${filename}`,
                    contentType: mimeType,
                    cacheControl: 3600,
                },
                chunkSize: 0.25 * 1024 * 1024,
                onError: function (error) {
                    console.log("Failed because: " + error);
                },
                onProgress: function (bytesUploaded, bytesTotal) {
                    var percentage = (
                        (bytesUploaded / bytesTotal) *
                        100
                    ).toFixed(2);

                    dispatch({
                        type: "SET_STATUS",
                        id: objectId!,
                        progress: parseInt(percentage),
                    });
                },
                onSuccess: async function () {
                    const res = await getFile(filename);

                    queryClient.setQueryData(["files"], (d: File[]) => {
                        return [res, ...d];
                    });
                },
            });

            upload.start();
        },
    ADD_TO_UPLOAD_QUEUE:
        ({ dispatch }) =>
        async (action) => {
            try {
                const { objects } = action;
                objects.forEach((o) => {
                    dispatch({
                        type: "START_UPLOAD",
                        object: {
                            ...o,
                            id: generateUUID(10),
                            progress: 0,
                        },
                    });
                });
            } catch (error) {}
        },
};

const useValue = () =>
    useReducerAsync(reducer, initialState, asyncActionHandlers);

export const {
    Provider: UploadProvider,
    useTrackedState: useUploadState,
    useUpdate: useUploadDispatch,
    useSelector,
} = createContainer(useValue);

export const useFileProgress = (id: string) =>
    useSelector((state: State) => state.filesById[id]?.progress || 0);

export function generateUUID(digits: number) {
    let str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ";
    let uuid = [];
    for (let i = 0; i < digits; i++) {
        uuid.push(str[Math.floor(Math.random() * str.length)]);
    }
    return uuid.join("");
}
