"use client";
import { ReusableHoverCardProps } from "@/types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useWindowDimensions } from "../hooks/useWindowDimensions";

// component shows data based on width of device to avoid eventdefault behaivors on mobile devices

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

const ReusableClickCard = ({
  trigger,
  content,
  contentClassName,
}: ReusableHoverCardProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className={contentClassName}>{content}</PopoverContent>
    </Popover>
  );
};

const ResponsiveCard = ({
  trigger,
  content,
  contentClassName = "w-80",
}: ReusableHoverCardProps) => {
  const deviceWidth = useWindowDimensions();
  const isMobile = deviceWidth.width < 768;

  return isMobile ? (
    <ReusableClickCard
      trigger={trigger}
      content={content}
      contentClassName={contentClassName}
    />
  ) : (
    <ReusableHoverCard
      trigger={trigger}
      content={content}
      contentClassName={contentClassName}
    />
  );
};

export default ResponsiveCard;
