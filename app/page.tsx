import { ArrowLeftRight, Eraser } from "lucide-react";
import React from "react";
import LinkCards from "../components/landing/LinkCards";
import { LinkCardProps } from "@/types";
import Hero from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import FaceSwapIllustration from "@/components/landing/FaceSwapIllustration";
import RemoveBGIllustration from "@/components/landing/RemoveBGIllustration";

const Links: LinkCardProps[] = [
  {
    id: 1,
    Icon: ArrowLeftRight,
    href: "/face-swap",
    heading: "Swap Face",
    description:
      "Swap faces from one face to another with perfect shadows, mimics and skin tone",
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
];

const page = async ({
  searchParams,
}: {
  searchParams: { authStatus?: string };
}) => {
  const status = await searchParams;
  return (
    <main>
      <Hero authStatus={status.authStatus || ""} />

      <div className="flex w-full items-center justify-center gap-10">
        {Links.map((link: LinkCardProps) => (
          <LinkCards
            key={link.id}
            id={link.id}
            Icon={link.Icon}
            href={link.href}
            heading={link.heading}
            description={link.description}
            status={link.status}
          />
        ))}
      </div>
      <div className="container mx-auto py-16 flex flex-col gap-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-12">
          Services
        </h1>
        <FaceSwapIllustration />
        <RemoveBGIllustration />
      </div>
      <HowItWorks />
    </main>
  );
};

export default page;
