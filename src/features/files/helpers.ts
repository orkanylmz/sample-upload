export const getFileType = (
    mimeType: string
): { type: "image" | "file"; short: string } => {
    const short = mimeType.split("/")[1];

    if (mimeType.startsWith("image")) {
        return { type: "image", short };
    }

    switch (mimeType) {
        case "text/plain":
        case "application/pdf":
            return { type: "file", short };

        default:
            return { type: "file", short };
    }
};
