"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DURATION, EASE, withMotion } from "@/lib/animate";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import UserButton from "./UserButton";
import GlobalSearch from "../search/GlobalSearch";

const Navbar = () => {
  const nav = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      withMotion(() => {
        gsap
          .timeline()
          .from(nav.current, {
            y: -72,
            opacity: 0,
            duration: DURATION,
            ease: EASE,
          })
          .from(
            ".nav-item",
            {
              y: -10,
              opacity: 0,
              duration: 0.4,
              stagger: 0.08,
              ease: EASE,
            },
            "-=0.25"
          );
      });
    },
    { scope: nav }
  );

  return (
    <nav
      ref={nav}
      className="flex-between background-light900_dark200 light-border fixed z-50 w-full gap-5 border-b p-6 shadow-light-300 dark:shadow-none sm:px-12"
    >
      <Link
        href="/"
        className="nav-item flex items-center gap-2 transition-transform duration-200 hover:scale-[1.03]"
      >
        <Image
          src="/assets/images/site-logo.svg"
          width={23}
          height={23}
          alt="CodeOverFlow"
        />
        <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Code <span className="text-primary-500">OverFlow</span>
        </p>
      </Link>
      <GlobalSearch />
      <div className="flex-between gap-5">
        <div className="nav-item">
          <Theme />
        </div>
        <div className="nav-item">
          <UserButton />
        </div>
        <div className="nav-item">
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
