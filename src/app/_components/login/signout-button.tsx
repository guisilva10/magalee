"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";

const SignOutButton = () => {
  return (
    <Button className="mt-6" onClick={() => signOut()}>
      Sair da conta <LogOutIcon />
    </Button>
  );
};

export default SignOutButton;
