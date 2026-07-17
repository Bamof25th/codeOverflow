import gsap from "gsap";

/**
 * Runs `build` only when the visitor hasn't asked for reduced motion, and hands
 * back a matchMedia context. Inside `useGSAP` the returned context is reverted
 * automatically, so animated elements are left at their natural resting state
 * for anyone who opts out.
 *
 * Use this for decoration only. Anything that also *positions* an element must
 * still run when motion is reduced — gate the duration with `motionDuration`
 * instead, or the element never lands where it belongs.
 */
export const withMotion = (build: () => void) =>
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", build);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** `seconds`, collapsed to an instant jump when motion is reduced. */
export const motionDuration = (seconds: number) =>
  prefersReducedMotion() ? 0 : seconds;

/** Shared feel, so the nav, sidebar and auth surfaces move as one system. */
export const EASE = "power3.out";
export const DURATION = 0.55;
