# AI Image Processing App

A Next.js application that provides image processing capabilities including image upscaling, face swapping, and background removal.

![App](https://github.com/user-attachments/assets/b79f6a4d-6e4e-48ca-bf3b-0f2f6aaa4300)

## Features

- **Image Upscaling**: Enhance low-resolution images to higher quality
- **Face Swap**: Swap faces between two images
- **Background Removal**: Remove backgrounds from images automatically
- **Gallery**: View and manage your processed images
- **User Authentication**: stores images undes user's id in postgreSQL database
- **Locas Storage**: uses browser's local storage in case user is not authenticated, images are filtered in same manner as they are in database
- **Download**: after processing image user is able to download result image

## What API's this app uses

- **Face Swap**: Face swapping api is created by me, it is written in python and uses [insightface](https://insightface.ai/) inswapper model and [GFPGAN](https://github.com/TencentARC/GFPGAN) face enhancment models to provide highly detaild results

- **Revemo Background**: Background removal api is created only as server component and uses [briaai/RMBG-1.4](https://huggingface.co/briaai/RMBG-1.4) with [Hugging Face](https://huggingface.co/) [Transformers.js](https://huggingface.co/docs/transformers.js/en/index) to make possible to load image in browser environment and be able to run model on user's device `No server side interaction is done while removing image background`

- **Revemo Background**: image upscaler uses same [GFPGAN](https://github.com/TencentARC/GFPGAN) face enhancment models with [Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN) model but it is used as external API simply because my vps server did not had enought resurces after deploying face swap on it

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [React Server Components](https://nextjs.org/docs/getting-started/react-essentials#server-components) - Server-side Rendering

## Project Structure

```
├── app/                # Next.js app directory
├── components/         # Reusable UI components
├── database/          # Database configurations and schemas
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
├── public/            # Static assets
├── store/             # State management wuth Zustand
├── types/             # TypeScript type definitions
└── utils/             # Helper functions
```
