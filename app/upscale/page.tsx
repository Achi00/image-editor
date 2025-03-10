import UpscaleIllustration from "@/components/landing/UpscaleIllustration";
import ReusableAlert from "@/components/ReusableAlert";
import ImageUpscaleForm from "@/components/upscale/ImageUpscaleForm";
import { auth } from "@/lib/auth";
import { ArrowRight, CircleAlert } from "lucide-react";
import Image from "next/image";

const Page = async () => {
  const session = await auth();

  return (
    <div className="w-full flex items-center justify-center flex-col py-10 gap-10">
      <div className="w-1/2">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Transform low-resolution images into stunning high-definition visuals
          using our advanced AI technology
        </h2>
        <ReusableAlert
          className="my-4 border-yellow-500"
          icon={<CircleAlert className="h-5 w-5 text-yellow-500" />}
          title="What images can be uspcaled?"
          content={
            <>
              Images which are{" "}
              <span className="font-bold">Below 1024X1024</span> pixels can be
              uspcaled and improved in terms of visual quality and colors. We{" "}
              <span className="font-bold">Do Not</span> recommend uploading
              image Above 1024x1024 pixels resolution because it will cause
              reverse effect and will worsen image quality
            </>
          }
        />
      </div>
      <ImageUpscaleForm session={session} />
    </div>
  );
};

export default Page;
