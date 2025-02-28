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
import { Laptop, Server } from "lucide-react";
import { Badge } from "../ui/badge";

const LinkCards = ({
  status,
  Icon,
  href,
  heading,
  description,
}: LinkCardProps) => {
  return (
    <Link href={href} className="block px-5">
      <Card className="w-full h-full transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary">
            <Icon className="h-8 w-8" />
          </div>
          <CardTitle className="text-center group-hover:text-primary transition-colors duration-300">
            {heading}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardContent>
        <CardFooter className="pt-4">
          <div className="w-full flex items-center justify-center">
            <Badge
              variant={status === "server" ? "default" : "secondary"}
              className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
            >
              {status === "server" ? (
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Runs on server
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Laptop className="h-4 w-4" />
                  Runs in browser
                </div>
              )}
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default LinkCards;
