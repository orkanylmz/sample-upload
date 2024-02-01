import { File, getFiles } from "@/api";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

const fetchFiles = (): Promise<File[]> => {
    return getFiles();
};

export const useFiles = (): UseQueryResult<File[], Error> => {
    return useQuery<File[], Error>({
        queryKey: ["files"],
        queryFn: fetchFiles,
    });
};
