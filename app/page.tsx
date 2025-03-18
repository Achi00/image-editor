import React from "react";
import LinkCards from "../components/landing/LinkCards";
import { LinkCardProps } from "@/types";
import Hero from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import FaceSwapIllustration from "@/components/landing/FaceSwapIllustration";
import RemoveBGIllustration from "@/components/landing/RemoveBGIllustration";
import SdGenerationIllustration from "@/components/landing/SdGenerationIllustration";
import UpscaleIllustration from "@/components/landing/UpscaleIllustration";
import { links } from "@/lib/Links";

const page = async ({ searchParams }: { searchParams: any }) => {
  const status = await searchParams;
  return (
    <main>
      <Hero authStatus={status.authStatus || ""} />

      <div className="flex w-full flex-col md:flex-row items-center justify-center gap-10">
        {links.map((link: LinkCardProps) => (
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
      <div className="border-t mt-10"></div>
      <HowItWorks />
      <div className="container pb-20 border-t-2 mt-16 mx-auto py-6 flex flex-col gap-8">
        <h1 className="text-4xl font-semibold tracking-tight text-center">
          Services
        </h1>
        <FaceSwapIllustration />
        <div className="border-t"></div>
        <RemoveBGIllustration />
        <div className="border-t"></div>
        <SdGenerationIllustration />
        <div className="border-t"></div>
        <UpscaleIllustration />
      </div>
    </main>
  );
};

export default page;
