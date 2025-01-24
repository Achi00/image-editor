import { ArrowLeftRight, Eraser } from "lucide-react";
import React from "react";
import LinkCards from "./components/LinkCards";
import { LinkCardProps } from "@/types";

const Links: LinkCardProps[] = [
  {
    id: 1,
    icon: <ArrowLeftRight />,
    href: "/face-swap",
    heading: "Swap Face",
    description:
      "Swap faces from one face to another with perfect shadows, mimics and skin tone",
  },
  {
    id: 2,
    icon: <Eraser />,
    href: "/remove-bg",
    heading: "Remove Background",
    description: "Make any image transparent by one click",
  },
];

const page = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      {Links.map((link: LinkCardProps) => (
        <LinkCards
          key={link.id}
          id={link.id}
          icon={link.icon}
          href={link.href}
          heading={link.heading}
          description={link.description}
        />
      ))}
    </div>
  );
};

export default page;
