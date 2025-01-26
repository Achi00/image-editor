import React from "react";
import { ReusableHoverCardProps } from "@/types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

const ReusableHoverCard = ({
  trigger,
  content,
  contentClassName,
}: ReusableHoverCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent className={contentClassName}>
        {content}
      </HoverCardContent>
    </HoverCard>
  );
};

export default ReusableHoverCard;
