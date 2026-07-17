"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserButton = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="background-light800_dark400 size-10 animate-pulse rounded-full" />
    );
  }

  // Mirrors the old <SignedIn> wrapper: the navbar shows nothing to guests,
  // who get the Log In / Sign Up buttons in the sidebar instead.
  if (!session?.user) return null;

  const { name, image, authId } = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="no-focus rounded-full">
        <Image
          src={image || "/assets/icons/avatar.svg"}
          width={40}
          height={40}
          alt={name || "Your profile"}
          className="size-10 rounded-full object-cover ring-2 ring-primary-500/70 transition hover:ring-primary-500"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="background-light900_dark200 light-border w-56 border"
      >
        <DropdownMenuLabel className="text-dark200_light900 line-clamp-1">
          {name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="light-border-2" />

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            href={`/profile/${authId}`}
            className="text-dark300_light700 body-medium"
          >
            <Image
              src="/assets/icons/user.svg"
              width={16}
              height={16}
              alt=""
              className="invert-colors"
            />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-dark300_light700 body-medium cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <Image
            src="/assets/icons/account.svg"
            width={16}
            height={16}
            alt=""
            className="invert-colors"
          />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
