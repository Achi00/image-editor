import React, { ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

interface ReusableAlertProps {
  icon: ReactNode;
  title: string;
  content: ReactNode;
  className: string;
}

const ReusableAlert = ({
  icon,
  title,
  content,
  className,
}: ReusableAlertProps) => {
  return (
    <Alert className={className}>
      <div className="flex gap-2 items-center">
        {icon}
        <AlertTitle className="text-lg font-semibold tracking-tight">
          {title}
        </AlertTitle>
      </div>
      <AlertDescription className="leading-7 [&:not(:first-child)]:mt-2">
        {content}
      </AlertDescription>
    </Alert>
  );
};

export default ReusableAlert;
