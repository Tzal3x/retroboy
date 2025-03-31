import { CssGrid, Orientation, GapSize, Position } from "./cssGrid";
import { FileUploadButton, FileUploadButtonProps } from "./fileUploadButton";
import { BlobLoader } from "./getBlobButton";

import * as useResponsiveBreakpoint from "../hooks/useResponsiveBreakpoint";

// Ensure BlobLoader is exported

const processBlob = async (blob: Blob): Promise<FileBufferObject | null> => {
    const buffer = await blob.arrayBuffer();
    return {
        filename: "loaded_from_blob",
        data: new Uint8Array(buffer),
    };
};

const processFile = (
    uploadedFile: File | null,
): Promise<FileBufferObject | null> =>
    new Promise(resolve => {
        if (uploadedFile) {
            uploadedFile.arrayBuffer().then(buffer => {
                resolve({
                    filename: uploadedFile.name,
                    data: new Uint8Array(buffer),
                });
            });
        } else {
            resolve(null);
        }
    });

const getFieldFileUploadLabel = (value: FileBufferObject | null): string => {
    return value ? value.filename : "No file chosen";
};

export const BufferFileUpload = ({
    onFileSelect,
    uploadedFile,
    label,
    ...remainingProps
}: BufferFileUploadProps): JSX.Element => {
    const isMobile = useResponsiveBreakpoint.useIsMobile();

    const handleBlobLoad = async (blob: Blob) => {
        const bufferObject = await processBlob(blob);
        if (bufferObject) {
            onFileSelect(bufferObject);
        }
    };

    return (
        <CssGrid
            orientation={Orientation.vertical}
            gap={GapSize.medium}
            alignItems={Position.center}
            justifyContent={isMobile ? Position.stretch : Position.start}
        >
            <CssGrid
                orientation={
                    isMobile ? Orientation.vertical : Orientation.horizontal
                }
                gap={GapSize.medium}
                alignItems={Position.center}
                justifyContent={isMobile ? Position.stretch : Position.start}
            >
                <FileUploadButton
                    variant="contained"
                    {...remainingProps}
                    onFileSelect={async (fileList: FileList | null) => {
                        if (!fileList) return;
                        const file = fileList[0];
                        try {
                            const bufferObject = await processFile(file);
                            if (bufferObject) {
                                onFileSelect(bufferObject);
                            }
                        } catch (err) {
                            console.error(
                                "An error occurred while processing the file",
                                err,
                            );
                        }
                    }}
                >
                    <CssGrid
                        orientation={Orientation.horizontal}
                        gap={GapSize.medium}
                        alignItems={Position.center}
                    >
                        {label || "Choose File"}
                    </CssGrid>
                </FileUploadButton>
                <div>{getFieldFileUploadLabel(uploadedFile)}</div>
            </CssGrid>
            <div>OR</div>
            <BlobLoader onLoadBlob={handleBlobLoad} />
        </CssGrid>
    );
};

export interface FileBufferObject {
    filename: string;
    data: Uint8Array;
}

interface BufferFileUploadProps
    extends Omit<FileUploadButtonProps, "onFileSelect" | "children"> {
    onFileSelect: (file: FileBufferObject | null) => void;
    uploadedFile: FileBufferObject | null;
    label?: string;
}
