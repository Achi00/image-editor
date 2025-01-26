import { LinkCardProps } from "@/types";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Computer, Server } from "lucide-react";

const LinkCards = ({
  status,
  Icon,
  href,
  heading,
  description,
}: LinkCardProps) => {
  return (
    <Link href={href} className="block w-1/6">
      <Card className="w-full transition-shadow h-[300px] hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-center">
            <Icon className="h-8 w-8 mb-2 text-primary" />
          </div>
          <CardTitle className="border-b text-center">{heading}</CardTitle>
          <CardDescription className="pt-10">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click to use this AI model
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-md font-semibold tracking-tight first:mt-0">
            {status === "server" ? (
              <div className="flex gap-4 items-center">
                <Server />
                <p className="border-b">Runs on server</p>
              </div>
            ) : (
              <div className="flex gap-4 items-center">
                <Computer />
                <p className="border-b">Runs on your browser</p>
              </div>
            )}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default LinkCards;
