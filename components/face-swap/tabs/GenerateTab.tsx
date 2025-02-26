"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useImageActions } from "@/store/useImageSelectionStore";
import { useUserStore } from "@/store/useUserStore";
import { UserType } from "@/types";
import { stableDiffusion } from "@/utils/StableDiffusion";
import {
  AlertCircle,
  ImageIcon,
  Loader2,
  TriangleAlert,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface StableDiffusionLimitProps {
  onSwitchTab: () => void;
}

export default function GenerateTab({
  userId,
  setActiveTab,
}: {
  userId: string;
  setActiveTab: (value: string) => void;
}) {
  const [input, setInput] = useState({ prompt: "", negativePrompt: "" });
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  // test
  const [sdLimit, setSdLimit] = useState<boolean>(false);

  const [sdCount, setSdCount] = useState<number>(1);

  // TODO: something causes re-render after submit
  // store generated image url
  const { setSelectedBackgroundSourceUrl } = useImageActions();
  const [imageUrl, setImageUrl] = useState("");
  // const [imageUrl, setImageUrl] = useState(
  //   "https://res.cloudinary.com/dle6xv667/image/upload/v1737910618/Untitled-1_mkmjvo.jpg"
  // );

  const getUser = useUserStore((state) => state.getUser);
  const user = useUserStore((state) => state.users[userId]) as UserType;

  useEffect(() => {
    if (!user) {
      getUser(userId);
    }
    // set users stable diffusion generation count
    setSdCount(user?.stableDiffusion);
  }, [getUser, user, userId]);

  // useEffect(() => {
  //   if (sdCount === 0) {
  //     setSdLimit(true);
  //   }
  // }, [sdCount, sdLimit]);

  if (!user) return <div>Loading...</div>;

  // disable component if user hit stable diffusion usage limit
  // TODO: fix when count hits 0 it will not show generated image and will straight show this component
  const handleTestSdCount = () => {
    setSdCount((prev) => prev - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => {
      const newInput = { ...prev, [e.target.name]: e.target.value };
      setDisable(newInput.prompt === "");

      return newInput;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // chack if user have any more generations left
    if (sdCount === 0) {
      setSdLimit(true);
    } else if (sdCount >= 1) {
      try {
        // Reset the URL
        setSelectedBackgroundSourceUrl(null);
        setLoading(true);
        const { resultImg, updatedData } = await stableDiffusion({
          ...input,
          userId: user.id,
        });

        console.log(resultImg);
        // update stable diffusion generation limit
        if (typeof updatedData.remainingGenerations === "number") {
          setSdCount(updatedData.remainingGenerations);
        }
        if (resultImg === "image generation limit reached") {
          setError(
            "Image generation limit reached, you can't generate any more images with stable diffusion"
          );
        } else {
          // to diaplay image
          setImageUrl(resultImg);
          console.log(JSON.stringify(input));
          // store stable diffusion generated image url in store
          if (resultImg !== "") {
            // setSdCount((prev) => prev - 1);
            setSelectedBackgroundSourceUrl(resultImg);
          }
        }
      } catch (error: any) {
        setError(error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6 p-6 w-full bg-white rounded-lg shadow">
      <Alert>
        <TriangleAlert className="h-4 w-4 " />
        <AlertTitle>You have {sdCount} Generations left</AlertTitle>
        <AlertDescription>
          After using all free stableDiffusion generations you will not be able
          to generate any more images
        </AlertDescription>
      </Alert>
      {error && (
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4 " />
          <AlertTitle>There was problem while generating the image</AlertTitle>
          <AlertDescription>
            {" "}
            This can happen if the generated image was flagged by safety filters
          </AlertDescription>
        </Alert>
      )}
      <Button onClick={handleTestSdCount}>Test</Button>
      {sdLimit ? (
        <StableDiffusionLimit onSwitchTab={() => setActiveTab("select")} />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Input
              value={input.prompt}
              onChange={(e) => handleChange(e)}
              name="prompt"
              id="prompt"
              required={true}
              placeholder="Describe the image you want to generate..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="negative-prompt">Negative Prompt (Optional)</Label>
            <Input
              value={input.negativePrompt}
              onChange={(e) => handleChange(e)}
              name="negativePrompt"
              id="negative-prompt"
              placeholder="Describe what you don't want in the image..."
            />
          </div>
          <div className="flex mt-4 justify-between items-center">
            <Button
              disabled={disable || loading || sdLimit}
              type="submit"
              className={`${disable && "bg-gray-500"}`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please wait
                </>
              ) : (
                "Generate Image"
              )}
            </Button>
          </div>
        </form>
      )}

      <div className="mt-4 relative aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="stable diffusion image"
            width={550}
            height={550}
            quality={70}
          />
        ) : (
          <span className="text-gray-400">
            Generated image will appear here
          </span>
        )}
      </div>
    </div>
  );
}

const StableDiffusionLimit = ({ onSwitchTab }: StableDiffusionLimitProps) => {
  return (
    <Card className="w-full mx-auto py-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
          <AlertCircle className="h-8 w-8 text-yellow-500" />
          Image Generation Limit Reached
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-6">
          <div className="relative">
            <ImageIcon className="h-24 w-24 text-gray-400" />
            <Zap className="h-10 w-10 text-yellow-500 absolute -top-2 -right-2 transform rotate-12" />
          </div>
        </div>
        <p className="text-center font-semibold text-gray-600 mb-4">
          You have reached your limit for generating images with Stable
          Diffusion.
        </p>
        <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
          <li>Each user has a limit for AI image generation</li>
          <li>This helps with keeping low server cost</li>
        </ul>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button className="w-full" onClick={onSwitchTab}>
          Switch back to<span className="font-bold">Select Image</span>
          section
        </Button>
      </CardFooter>
    </Card>
  );
};
