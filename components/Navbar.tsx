"use client";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ImageIcon, LogOut, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import Image from "next/image";
import { Session } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GoogleButton from "./GoogleButton";

const navItems = [
  { name: "Remove Background", href: "/remove-bg" },
  { name: "Face Swap", href: "/face-swap" },
  { name: "Enhance Quality", href: "/enhance-quality" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-md dark:bg-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-gray-800 dark:text-white"
              >
                ImageAI
              </Link>
            </div>
          </div>
          <div className="hidden items-center sm:ml-6 sm:flex sm:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm text-gray-700 dark:text-white font-semibold  dark:hover:text-gray-400 hover:text-gray-300 ${
                  pathname === item.href && "underline"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <ThemeToggle />
            <NavbarUserMenu session={session} />
          </div>

          <div className="-mr-2 flex gap-2 items-center sm:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>

              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden p-5">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <NavbarUserMenu session={session} />
        </div>
      )}
    </nav>
  );
}

const NavbarUserMenu = ({ session }: { session: Session | null }) => {
  return (
    <>
      {session?.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-12 justify-start space-x-2 px-4"
            >
              <Image
                quality={60}
                className="rounded-full"
                width={32}
                height={32}
                src={session?.user?.image || "/placeholder.svg"}
                alt="User avatar"
              />
              <span className="flex-1 text-left text-sm font-medium">
                {session?.user?.name}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user?.name}
                </p>
                {session?.user?.email && (
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/gallery"
                prefetch={true}
                className="flex items-center cursor-pointer"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                <span>Open Gallery</span>
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem asChild>
              <Link
                href="/profile"
                className="flex items-center cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-800  cursor-pointer"
              onSelect={() => signOut()}
            >
              <LogOut className="mr-2 h-6 w-6" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <GoogleButton />
      )}
    </>
  );
};
