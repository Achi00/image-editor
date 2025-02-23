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
import { useUserStore } from "@/store/useUserStore";
import { UserType } from "@/types";
import { AlertCircle, ImageIcon, TriangleAlert, Zap } from "lucide-react";
import { useEffect } from "react";

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
  const getUser = useUserStore((state) => state.getUser);
  const user = useUserStore((state) => state.users[userId]) as UserType;
  useEffect(() => {
    if (!user) {
      getUser(userId);
    }
  }, [getUser, user, userId]);

  if (!user) return <div>Loading...</div>;

  // if (user.stableDiffusion === 0)
  if (user.stableDiffusion === 0) {
    return <StableDiffusionLimit onSwitchTab={() => setActiveTab("select")} />;
  }

  return (
    <div className="space-y-6 p-6 w-full bg-white rounded-lg shadow">
      <Alert>
        <TriangleAlert className="h-4 w-4 " />
        <AlertTitle>
          You have {user.stableDiffusion} Generations left
        </AlertTitle>
        <AlertDescription>
          After using all free stableDiffusion generations you will not be able
          to generate any more images
        </AlertDescription>
      </Alert>
      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt</Label>
        <Input
          id="prompt"
          required={true}
          placeholder="Describe the image you want to generate..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="negative-prompt">Negative Prompt (Optional)</Label>
        <Input
          id="negative-prompt"
          placeholder="Describe what you don't want in the image..."
        />
      </div>
      <div className="flex justify-between items-center">
        <Button>Generate Image</Button>
        <div className="text-sm text-gray-500">
          Image will appear here after generation
        </div>
      </div>
      <div className="mt-4 aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Generated image will appear here</span>
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
