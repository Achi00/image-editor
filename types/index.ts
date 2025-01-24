import { ReactElement } from "react";

export interface LinkCardProps {
  id: number;
  icon: ReactElement;
  href: string;
  heading: string;
  description: string;
}
