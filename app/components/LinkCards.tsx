import { LinkCardProps } from "@/types";
import Link from "next/link";
import React from "react";

const LinkCards = ({ id, icon, href, heading, description }: LinkCardProps) => {
  return (
    <div>
      <Link href="/face-swap">Face Swap</Link>
    </div>
  );
};

export default LinkCards;
