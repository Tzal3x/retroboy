import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";

// Use similar styled components for consistency
const StyledInput = styled("input")`
    margin-right: 8px;
    padding: 10px 15px;
    width: calc(100% - 60px); // Adjust as per actual layout space available
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const LoadBlobButton = styled(Button)`
    width: auto; // Set to auto or a specific width as needed
`;

export const BlobLoader = ({ onLoadBlob }: BlobLoaderProps) => {
    const [blobId, setBlobId] = useState("");

    const handleLoadBlob = async () => {
        const url = `https://aggregator.walrus-mainnet.walrus.space/v1/blobs/${encodeURIComponent(blobId)}`;
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            onLoadBlob(blob);
        } catch (error) {
            console.error("Failed to load the blob", error);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
            }}
        >
            <StyledInput
                style={{ flex: 1, marginRight: "8px" }}
                type="text"
                value={blobId}
                onChange={e => setBlobId(e.target.value)}
                placeholder="Type Walrus Blob ID"
            />
            <LoadBlobButton
                style={{ flex: 1 }}
                variant="contained"
                color="primary"
                onClick={handleLoadBlob}
            >
                Load Blob
            </LoadBlobButton>
        </div>
    );
};

interface BlobLoaderProps {
    onLoadBlob: (blob: Blob) => void;
}
