"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GenerateTab from "./GenerateTab";
import {
  useImageActions,
  useSelectedBackgroundSourceUrl,
  useSelectedSourceId,
} from "@/store/useImageSelectionStore";
import SelectImage from "../SelectImage";
import { imagesArr } from "@/lib/images";
import { useSession } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AlertTriangle, Trash2 } from "lucide-react";
import GoogleButton from "@/components/GoogleButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// for source image
export default function ImageTabs() {
  const { data: session } = useSession();
  const { setSelectedBackgroundSourceId, setSelectedBackgroundSourceUrl } =
    useImageActions();
  const selectedSourceId = useSelectedSourceId();
  const [activeTab, setActiveTab] = useState("select");

  // background image url
  const selectedBackgroundUrl = useSelectedBackgroundSourceUrl();
  console.log("selectedBackgroundUrl: " + selectedBackgroundUrl);
  // remove selected stable diffusion image
  const handleRemove = () => {
    setSelectedBackgroundSourceUrl(null);
  };

  return (
    <Tabs
      defaultValue="select"
      value={activeTab}
      className="w-full max-w-4xl mx-auto"
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="generate">
          Generate with Stable Diffusion
        </TabsTrigger>
        <TabsTrigger value="select">Select Image</TabsTrigger>
      </TabsList>
      <TabsContent value="generate">
        {session?.user.id ? (
          <GenerateTab userId={session?.user.id} setActiveTab={setActiveTab} />
        ) : (
          <Card className="w-full max-w-3xl mx-auto mt-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                Authentication Required
              </CardTitle>
              <CardDescription>
                To access Stable Diffusion image generation, please log in or
                create an account.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="text-lg font-semibold">
                Stable Diffusion is a powerful AI image generation tool that
                allows you to create images from text descriptions. This feature
                is exclusively available to authenticated users.
              </p>
              <div className="w-full border-t-2 border-gray-700"></div>
              <p className="p-2 text-gray-600">
                After authentication you will be albe to generate image and use
                that image to place selected face into it
              </p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <GoogleButton />
            </CardFooter>
          </Card>
        )}
      </TabsContent>
      <TabsContent value="select">
        {selectedBackgroundUrl?.startsWith("https://replicate.delivery") ? (
          <Alert variant="destructive" className="mb-4 py-8 my-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Stable Diffusion image already selected</AlertTitle>
            <AlertDescription>
              You need to remove the currently selected Stable Diffusion image
              before selecting an image from this section.
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full sm:w-auto"
                onClick={handleRemove}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove Stable Diffusion Image
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <SelectImage
            images={imagesArr}
            selectedId={selectedSourceId}
            onSelect={(id) => {
              setSelectedBackgroundSourceId(id);
            }}
          />
        )}
        {/* <SelectImage images={galleryImages} selectedId={selectedSourceId} /> */}
      </TabsContent>
    </Tabs>
  );
}
