import { CircleAlert } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const useTimer = ({ status }: { status: string }) => {
  const [timer, setTimer] = useState(0);

  // pricess time tracking
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // create interval while image is analyzing to see if it took too long time
  useEffect(() => {
    if (status === "Analyzing...") {
      // check on every 5 secs to avoid unnecessary re-rendering
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 5);
      }, 5000);
    } else {
      // Reset timer when not analyzing
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimer(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status]);

  // track how long image processing took, if it took more that 15 sec notify user to refresh page
  useEffect(() => {
    let toastTimeout: NodeJS.Timeout;

    if (status === "Analyzing..." && timer == 15) {
      toastTimeout = setTimeout(() => {
        toast(
          "Seems like image processing took more time than usual, refresh page and try again",
          {
            icon: <CircleAlert />,
            duration: 10000,
          }
        );
      }, 0);
    }

    return () => {
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }
    };
  }, [status, timer]);
};

export default useTimer;
