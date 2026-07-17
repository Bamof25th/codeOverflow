"use client";
import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AuthForm, { AuthMode } from "@/components/Forms/AuthForm";
import { withMotion } from "@/lib/animate";

interface Props {
  mode: AuthMode;
  children: React.ReactNode;
}

const AuthModal = ({ mode, children }: Props) => {
  const [open, setOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<AuthMode>(mode);
  const card = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!open) return;
      withMotion(() => {
        gsap.from(card.current, {
          scale: 0.94,
          opacity: 0,
          y: 12,
          duration: 0.35,
          ease: "back.out(1.6)",
        });
      });
    },
    { dependencies: [open], scope: card }
  );

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    // Reset to the mode the trigger asked for, so reopening "Log In" never
    // shows the sign-up copy left behind by a previous switch.
    if (!next) setActiveMode(mode);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[420px] px-4">
        <div
          ref={card}
          className="background-light900_dark200 light-border shadow-light-300 rounded-2xl border p-8 dark:shadow-none"
        >
          <DialogTitle className="sr-only">
            {activeMode === "sign-in" ? "Log in" : "Sign up"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Continue with your GitHub account.
          </DialogDescription>

          <AuthForm
            key={activeMode}
            mode={activeMode}
            onSwitchMode={setActiveMode}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
