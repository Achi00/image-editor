import { LinkCardProps } from "@/types";
import { ArrowLeftRight, Eraser, ImageUpscale } from "lucide-react";

export const links: LinkCardProps[] = [
  {
    id: 1,
    Icon: ArrowLeftRight,
    href: "/face-swap",
    heading: "Swap Face",
    description:
      "Swap faces from one image to another with perfect shadows, mimics and skin tone",
    status: "server",
  },
  {
    id: 2,
    Icon: Eraser,
    href: "/remove-bg",
    heading: "Remove Background",
    description:
      "Make any image transparent by one click, runs on your local browser",
    status: "local",
  },
  {
    id: 3,
    Icon: ImageUpscale,
    href: "/upscale",
    heading: "Upscale Images",
    description:
      "Upscale your images from low resolution to high, with improved quality, contrast and coloring",
    status: "server",
  },
];
