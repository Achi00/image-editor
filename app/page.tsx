import { ArrowLeftRight, Eraser } from "lucide-react";
import React from "react";
import LinkCards from "../components/landing/LinkCards";
import { LinkCardProps } from "@/types";
import Hero from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import FaceSwapIllustration from "@/components/landing/FaceSwapIllustration";
import RemoveBGIllustration from "@/components/landing/RemoveBGIllustration";
import SdGenerationIllustration from "@/components/landing/SdGenerationIllustration";

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
      <div className="container border-t-2 mt-16 mx-auto py-6 flex flex-col gap-8">
        <h1 className="text-4xl font-semibold tracking-tight text-center">
          Services
        </h1>
        <FaceSwapIllustration />
        <div className="border-t"></div>
        <RemoveBGIllustration />
        <div className="border-t"></div>
        <SdGenerationIllustration />
      </div>
      <HowItWorks />
    </main>
  );
};

export default page;
