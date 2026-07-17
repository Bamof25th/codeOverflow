"use client";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DURATION, EASE, motionDuration, withMotion } from "@/lib/animate";
import AuthModal from "../AuthModal";

const LeftSidebar = () => {
  const { data: session } = useSession();
  const authId = session?.user?.authId;
  const pathname = usePathname();

  const section = useRef<HTMLElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Derived rather than assigned back onto `item`: sidebarLinks is a shared
  // module-level constant, so mutating it leaks one user's id into every
  // later render.
  const links = sidebarLinks
    .filter((item) => item.route !== "/profile" || authId)
    .map((item) => ({
      ...item,
      href: item.route === "/profile" ? `/profile/${authId}` : item.route,
    }));

  const isActive = (href: string) =>
    (pathname.includes(href) && href.length > 1) || pathname === href;

  const activeIndex = links.findIndex((item) => isActive(item.href));

  useGSAP(
    () => {
      withMotion(() => {
        gsap.from(".sidebar-link", {
          x: -16,
          opacity: 0,
          duration: DURATION,
          stagger: 0.06,
          ease: EASE,
        });
        gsap.from(".sidebar-cta", {
          y: 12,
          opacity: 0,
          duration: DURATION,
          stagger: 0.08,
          delay: 0.2,
          ease: EASE,
        });
      });
    },
    { scope: section }
  );

  // The indicator carries the active highlight, so it has to be placed even
  // when motion is reduced — only the travel time is negotiable.
  useGSAP(
    () => {
      const target = linkRefs.current[activeIndex];

      if (!target || !indicator.current) {
        gsap.set(indicator.current, { opacity: 0 });
        return;
      }

      const placement = {
        y: target.offsetTop,
        height: target.offsetHeight,
        opacity: 1,
      };

      // While hidden the indicator has no meaningful position, so land it
      // directly instead of sliding in from the top of the list. Read from the
      // element rather than a ref flag, so this stays correct across GSAP
      // context reverts and StrictMode's double-invoke.
      if (gsap.getProperty(indicator.current, "opacity") === 0) {
        gsap.set(indicator.current, placement);
        return;
      }

      gsap.to(indicator.current, {
        ...placement,
        duration: motionDuration(0.4),
        ease: EASE,
      });
    },
    { dependencies: [activeIndex, pathname], scope: section }
  );

  return (
    <section
      ref={section}
      className="background-light900_dark200 light-border  custom-scrollbar sticky left-0 top-0 flex  h-screen max-w-xl flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 max-sm:hidden lg:w-[266px]"
    >
      <div ref={list} className="relative flex flex-1 flex-col gap-6">
        <span
          ref={indicator}
          aria-hidden
          className="primary-gradient pointer-events-none absolute inset-x-0 top-0 z-0 rounded-lg opacity-0"
        />

        {links.map((item, index) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.route}
              href={item.href}
              ref={(el) => {
                linkRefs.current[index] = el;
              }}
              className={`${active ? "text-light-900" : "text-dark300_light900"} sidebar-link relative z-10 flex items-center justify-start gap-4 rounded-lg bg-transparent p-4 transition-colors duration-200`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${active ? "" : "invert-colors"}`}
              />
              <p
                className={`${active ? "base-bold" : "base-medium"} max-lg:hidden`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>

      {!session && (
        <div className="mt-5 flex flex-col gap-3">
          <AuthModal mode="sign-in">
            <Button className="small-medium btn-secondary sidebar-cta min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none transition-transform hover:scale-[1.02]">
              <Image
                src="/assets/icons/account.svg"
                alt="login"
                height={20}
                width={20}
                className="invert-colors lg:hidden"
              />
              <span className="primary-text-gradient max-lg:hidden">Log In</span>
            </Button>
          </AuthModal>

          <AuthModal mode="sign-up">
            <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 sidebar-cta min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none transition-transform hover:scale-[1.02]">
              <Image
                src="/assets/icons/sign-up.svg"
                alt="sign-up"
                height={20}
                width={20}
                className="invert-colors lg:hidden"
              />
              <span className="max-lg:hidden">Sign Up</span>
            </Button>
          </AuthModal>
        </div>
      )}
    </section>
  );
};

export default LeftSidebar;
