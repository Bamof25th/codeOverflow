"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { EASE, withMotion } from "@/lib/animate";

const NavContent = ({ authId }: { authId?: string }) => {
  const pathname = usePathname();
  return (
    <>
      <section className="flex h-full flex-col gap-6 pt-16 ">
        {sidebarLinks.map((item) => {
          if (item.route === "/profile" && !authId) return null;

          const route =
            item.route === "/profile" ? `/profile/${authId}` : item.route;

          const isActive =
            (pathname.includes(route) && route.length > 1) || pathname === route;

          return (
            <SheetClose asChild key={item.route}>
              <Link
                href={route}
                className={`${isActive ? "primary-gradient rounded-lg text-light-900" : "text-dark300_light900"} mobile-link flex items-center justify-start gap-4 bg-transparent p-4`}
              >
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={`${isActive ? "" : "invert-colors"}`}
                />
                <p className={`${isActive ? "base-bold" : "base-medium"}`}>
                  {item.label}
                </p>
              </Link>
            </SheetClose>
          );
        })}
      </section>
    </>
  );
};

const MobileNav = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  // Radix mounts the sheet body in a later commit than the one that flips
  // `open`, so an effect keyed on `open` runs while the panel is still absent
  // and animates nothing. Tracking the node itself means the animation fires on
  // the render where the links actually exist.
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!panel) return;
      withMotion(() => {
        gsap.from(".mobile-link, .mobile-cta", {
          x: -24,
          opacity: 0,
          duration: 0.35,
          stagger: 0.05,
          ease: EASE,
        });
      });
    },
    { dependencies: [panel], scope: panel ?? undefined }
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Image
          src="/assets/icons/hamburger.svg"
          width={36}
          height={36}
          alt="Menu"
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        ref={setPanel}
        side="left"
        className="background-light900_dark200 border-none"
      >
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/images/site-logo.svg"
            width={23}
            height={23}
            alt="CodeOverFlow"
          />
          <p className="h2-bold  text-dark100_light900 font-spaceGrotesk ">
            Code <span className="text-primary-500">OverFlow</span>
          </p>
        </Link>
        <div>
          <SheetClose asChild>
            <NavContent authId={session?.user?.authId} />
          </SheetClose>
          {!session && (
            <div className=" flex flex-col gap-3">
              {/* Links to the page rather than opening the auth modal: a dialog
                  nested inside this sheet would leave two focus traps fighting,
                  and a full page is the better surface on a phone anyway. */}
              <SheetClose asChild>
                <Link href={"/sign-in"}>
                  <Button className="small-medium btn-secondary mobile-cta min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none ">
                    <span className="primary-text-gradient">Log In</span>
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={"/sign-up"}>
                  <Button className="subtle-medium light-border-2 btn-tertiary text-dark400_light900 mobile-cta min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none ">
                    Sign Up
                  </Button>
                </Link>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
