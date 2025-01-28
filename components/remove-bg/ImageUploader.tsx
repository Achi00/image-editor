"use client";
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import {
  AutoModel,
  AutoProcessor,
  env,
  RawImage,
  Processor,
} from "@xenova/transformers";
import Image from "next/image";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ImageIcon, Images, Loader2, Upload } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import DownloadButton from "../DownloadButton";
import toast, { Toaster } from "react-hot-toast";

const ImageUploader = () => {
  const [status, setStatus] = useState("");
  const [beforeImg, setBeforeImg] = useState("");

  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(
    null
  );

  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const modelRef = useRef<AutoModel | null>(null);
  const processorRef = useRef<Processor | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  // const { toast } = useToast();

  const EXAMPLE_URL =
    "https://res.cloudinary.com/dle6xv667/image/upload/v1737909558/superman_mv6hmz.jpg";

  // load model
  useEffect(() => {
    (async () => {
      // Allow only remote/hub models
      env.allowLocalModels = false;

      // Proxy the WASM backend so large model processing can happen in a web worker
      env.backends.onnx.wasm.proxy = true;
      setStatus("loading model...");
      // Load the model
      const loadedModel = await AutoModel.from_pretrained("briaai/RMBG-1.4", {
        config: { model_type: "custom" },
      });

      // Load the processor
      const loadedProcessor = await AutoProcessor.from_pretrained(
        "briaai/RMBG-1.4",
        {
          config: {
            do_normalize: true,
            do_pad: false,
            do_rescale: true,
            do_resize: true,
            image_mean: [0.5, 0.5, 0.5],
            feature_extractor_type: "ImageFeatureExtractor",
            image_std: [1, 1, 1],
            resample: 2,
            rescale_factor: 0.00392156862745098,
            size: { width: 1024, height: 1024 },
          },
        }
      );

      // Store them in refs
      modelRef.current = loadedModel;
      processorRef.current = loadedProcessor;

      setStatus("Ready");
    })();
  }, []);

  // create interval while image is analyzing to see if it took too long time
  useEffect(() => {
    if (status === "Analyzing...") {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      // Reset timer when not analyzing
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimer(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status]);

  // trank how long image processing took
  useEffect(() => {
    let toastTimeout: NodeJS.Timeout;

    if (status === "Analyzing..." && timer >= 15) {
      toastTimeout = setTimeout(() => {
        toast("Seems like image processing took more time than usual");
      }, 0);
    }

    return () => {
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }
    };
  }, [status, timer]);

  //   handle file input
  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Convert file into a data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setBeforeImg(e.target?.result as string);
        predict(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const onExampleClick = async () => {
    setBeforeImg(EXAMPLE_URL);
    predict(EXAMPLE_URL);
  };

  async function predict(url: string) {
    if (!modelRef.current || !processorRef.current) return;

    setStatus("Analyzing...");
    const container = containerRef.current;
    if (!container) return;
    // Clear out old results
    container.innerHTML = "";
    container.style.backgroundImage = `url(${url})`;

    // 4a. Load the raw image
    const image = await RawImage.fromURL(url);

    // Set container width and height depending on aspect ratio
    const ar = image.width / image.height;
    const [cw, ch] = ar > 720 / 480 ? [720, 720 / ar] : [480 * ar, 480];
    container.style.width = `${cw}px`;
    container.style.height = `${ch}px`;

    // 4b. Preprocess image
    const { pixel_values } = await processorRef.current(image);

    // 4c. Predict alpha matte
    const { output } = await modelRef.current({ input: pixel_values });

    // 4d. Resize mask back to original size
    const mask = await RawImage.fromTensor(
      output[0].mul(255).to("uint8")
    ).resize(image.width, image.height);

    // 4e. Draw output to a new canvas
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw original
    ctx.drawImage(image.toCanvas(), 0, 0);

    // Update alpha channel
    const pixelData = ctx.getImageData(0, 0, image.width, image.height);
    for (let i = 0; i < mask.data.length; i++) {
      pixelData.data[4 * i + 3] = mask.data[i];
    }
    ctx.putImageData(pixelData, 0, 0);

    // Add canvas to container, remove background image
    const processedUrl = canvas.toDataURL("image/png");
    setProcessedImageUrl(processedUrl);
    setStatus("Done!");
  }

  return (
    <div className="w-full px-10">
      <Toaster />
      {status === "loading model..." && (
        <div className="flex gap-3 items-center p-4">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading Model...
        </div>
      )}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Your Image</CardTitle>
          <CardDescription>
            Choose an image file to remove its background.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onExampleClick} disabled={status !== "Ready"}>
            <Images />
            Use Example Image
          </Button>
          <div className="flex pt-4 items-center space-x-4">
            <Input
              className="cursor-pointer"
              id="picture"
              type="file"
              accept="image/*"
              onChange={onFileChange}
            />
            <Button>
              {status === "Analyzing..." ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Remove Background
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Original Image</CardTitle>
            <CardDescription>
              Your uploaded image will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {beforeImg ? (
                <Image
                  src={beforeImg || "/placeholder.svg"}
                  alt="Original image"
                  fill
                  style={{ objectFit: "contain" }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-12 h-12 mr-2" />
                  <span>No image uploaded</span>
                </div>
              )}
              {status === "Analyzing..." && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-xl flex items-center gap-1 font-bold">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Analyzing...
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Processed Image</CardTitle>
              <DownloadButton />
            </div>
            <CardDescription>
              Your image with the background removed will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {processedImageUrl ? (
                <Image
                  src={processedImageUrl || "/placeholder.svg"}
                  alt="Processed image"
                  fill
                  style={{ objectFit: "contain" }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-center p-4">
                  <span>
                    {processedImageUrl
                      ? "Click 'Remove Background' to see the result here"
                      : "Upload an image and process it to see the result here"}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <p>Status: {status}</p>
      <div>{status === "loading model..." && <div>Loading...</div>}</div>

      {/* Example button */}

      {/* File input */}
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <Input
          id="picture"
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
      </div>
      {/* <input type="file" accept="image/*" onChange={onFileChange} /> */}

      {/* Container that shows final results */}
      <div className="hidden" ref={containerRef} id="container"></div>
    </div>
  );
};

export default ImageUploader;
