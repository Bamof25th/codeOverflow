"use client";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DURATION, EASE, withMotion } from "@/lib/animate";
import { Button } from "../ui/button";

export type AuthMode = "sign-in" | "sign-up";

interface Props {
  mode: AuthMode;
  callbackUrl?: string;
  /** Supplied by the modal so the alt link swaps copy in place instead of navigating. */
  onSwitchMode?: (mode: AuthMode) => void;
}

const copy = {
  "sign-in": {
    title: "Welcome back",
    subtitle: "Sign in to ask questions, answer others and save what matters.",
    altText: "New around here?",
    altLabel: "Create an account",
    altHref: "/sign-up",
    altMode: "sign-up" as AuthMode,
  },
  "sign-up": {
    title: "Join CodeOverFlow",
    subtitle: "Create your account and start sharing what you know.",
    altText: "Already have an account?",
    altLabel: "Log in",
    altHref: "/sign-in",
    altMode: "sign-in" as AuthMode,
  },
};

const GithubMark = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="size-5 fill-current">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);

const AuthForm = ({ mode, callbackUrl, onSwitchMode }: Props) => {
  const { title, subtitle, altText, altLabel, altHref, altMode } = copy[mode];
  const [isPending, setIsPending] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      withMotion(() => {
        gsap.from(".auth-item", {
          y: 18,
          opacity: 0,
          duration: DURATION,
          stagger: 0.07,
          ease: EASE,
        });
      });
    },
    { scope: container }
  );

  const handleSignIn = () => {
    setIsPending(true);
    // Full-page redirect to GitHub; no need to clear isPending afterwards.
    signIn("github", { callbackUrl: callbackUrl || "/" });
  };

  return (
    <div ref={container} className="w-full">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image
          src="/assets/images/site-logo.svg"
          width={40}
          height={40}
          alt="CodeOverFlow"
          className="auth-item"
        />
        <h1 className="h2-bold text-dark100_light900 auth-item font-spaceGrotesk mt-2">
          {title}
        </h1>
        <p className="body-regular text-dark500_light500 auth-item">
          {subtitle}
        </p>
      </div>

      {/* Deliberately GitHub's own near-black rather than `primary-gradient`:
          the gradient fades to #5faee2, which leaves white label text at ~2.4:1
          contrast. Dark also reads instantly as an OAuth button. */}
      <Button
        onClick={handleSignIn}
        disabled={isPending}
        className="auth-item mt-8 flex min-h-[46px] w-full items-center justify-center gap-2.5 rounded-lg bg-dark-300 px-4 py-3 !text-light-900 transition-transform hover:scale-[1.02] hover:bg-dark-400 active:scale-[0.98] disabled:opacity-70 dark:bg-light-900 dark:!text-dark-100 dark:hover:bg-light-800"
      >
        <GithubMark />
        <span className="paragraph-medium">
          {isPending ? "Redirecting…" : "Continue with GitHub"}
        </span>
      </Button>

      <p className="small-regular text-dark400_light700 auth-item mt-6 text-center">
        {altText}{" "}
        {onSwitchMode ? (
          <button
            type="button"
            onClick={() => onSwitchMode(altMode)}
            className="primary-text-gradient font-semibold"
          >
            {altLabel}
          </button>
        ) : (
          <Link href={altHref} className="primary-text-gradient font-semibold">
            {altLabel}
          </Link>
        )}
      </p>
    </div>
  );
};

export default AuthForm;
