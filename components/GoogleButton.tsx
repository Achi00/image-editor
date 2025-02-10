import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

const GoogleButton = () => {
  return <Button onClick={() => signIn("google")}>Sign in with Google</Button>;
};

export default GoogleButton;
