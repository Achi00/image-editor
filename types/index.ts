import { LucideIcon } from "lucide-react";

// main page <Link> card types
export interface LinkCardProps {
  id: number;
  Icon: LucideIcon;
  href: string;
  heading: string;
  description: string;
  status: "server" | "local";
}

// form fields data input
export interface FormFields {
  user_image: File[];
  generated_image_url: string;
}

// face swap image result
export type FaceSwapResponse = {
  result_image: string;
};

// faca swap select image
export type FaceSwapImageSelect = {
  id: number;
  imgUrl: string;
  isSelected: boolean;
};

export interface ReusableHoverCardProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  contentClassName?: string;
}
export interface LocalStorageProps {
  imageFrom: "face-swap" | "remove-bg" | "enhance";
  imgUrl: string;
  date: Date;
  id?: number;
  userId?: string;
}

export interface UserType {
  id: string;
  name: string;
  email: string;
  image: string;
  stableDiffusion: number;
}
