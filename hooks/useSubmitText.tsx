import { useEffect, useState } from "react";
const loadingTexts = [
  "Please wait",
  "Processing...",
  "Calculating face meshes...",
  "Process Face Swapping...",
  "Almost there...",
  "Getting URL Ready...",
  "Finishing...",
];
export const useSubmitText = (isPending: boolean) => {
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);
  useEffect(() => {
    if (isPending) {
      const interval = setInterval(() => {
        setLoadingText((current) => {
          const currentIndex = loadingTexts.indexOf(current);
          return loadingTexts[(currentIndex + 1) % loadingTexts.length];
        });
      }, 4000); // Change text every second

      return () => {
        clearInterval(interval);
        setLoadingText((img) => img[0]);
      };
    }
  }, [isPending]);

  return { loadingText };
};
