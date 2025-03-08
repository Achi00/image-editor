import ImageUpscaleForm from "@/components/upscale/ImageUpscaleForm";
import { auth } from "@/lib/auth";

const Page = async () => {
  const session = await auth();

  return <ImageUpscaleForm session={session} />;
};

export default Page;
