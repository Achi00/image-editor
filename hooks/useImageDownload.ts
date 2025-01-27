"use client";
import { downloadImage } from "@/utils/DownloadImage";
import { useCallback, useMemo, useState } from "react";

export const useImageDownload = () => {
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState<unknown | null>(null);

  const handleDownload = useCallback(async () => {
    setIsDownloadLoading(true);
    setDownloadError(null);
    try {
      await downloadImage();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setDownloadError(err.message);
      } else {
        setDownloadError(String(err));
      }
    } finally {
      setIsDownloadLoading(false);
    }
  }, []);

  return useMemo(
    () => ({
      //   result,
      isDownloadLoading,
      downloadError,
      handleDownload,
    }),
    [isDownloadLoading, downloadError, handleDownload]
  );
};
