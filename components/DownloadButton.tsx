import { useImageDownload } from "@/hooks/useImageDownload";
import React, { memo } from "react";
import { Button } from "./ui/button";
import { Download as DownloadIcon } from "lucide-react";

const DownloadButton = memo(() => {
  // download face swap image
  const { isDownloadLoading, downloadError, handleDownload } =
    useImageDownload();

  return (
    <Button
      disabled={isDownloadLoading}
      onClick={handleDownload}
      className="flex gap-2 items-center"
    >
      <DownloadIcon />
      {isDownloadLoading ? "Downloading..." : "Download"}
      {downloadError instanceof Error && (
        <p>Something went wrong: {downloadError.message}</p>
      )}
    </Button>
  );
});

DownloadButton.displayName = "DownloadButton";

export default DownloadButton;
