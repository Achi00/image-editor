import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default async function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-100 to-white dark:from-indigo-950 dark:to-background text-white px-4">
      <div className="absolute top-1/3 bottom-10 left-4 h-44 w-44 animate-blob rounded-full bg-purple-300 opacity-70 mix-blend-multiply blur-xl filter"></div>
      <div className="absolute right-4 h-44 w-44 animate-blob animation-delay-2000 rounded-full bg-yellow-300 opacity-70 mix-blend-multiply blur-xl filter"></div>
      <div className="absolute bottom-16 left-20 h-44 w-44 animate-blob animation-delay-4000 rounded-full bg-pink-300 opacity-70 mix-blend-multiply blur-xl filter"></div>

      <h1 className="text-9xl font-extrabold mb-4">404</h1>
      <p className="text-2xl mb-8 text-center">
        Oops! The page you{"'"}re looking for doesn{"'"}t exist.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          asChild
          variant="secondary"
          size="lg"
          className="flex items-center gap-2"
        >
          <Link href="/">
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="flex items-center gap-2 bg-white text-primary hover:bg-white/90 dark:text-black"
        >
          <Link href="javascript:history.back()">
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Link>
        </Button>
      </div>
    </div>
  );
}
