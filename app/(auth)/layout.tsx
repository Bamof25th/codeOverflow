import Image from "next/image";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 flex min-h-screen w-full">
      <section className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="background-light900_dark200 light-border shadow-light-300 w-full max-w-[420px] rounded-2xl border p-8 dark:shadow-none">
          {children}
        </div>
      </section>

      <aside className="relative hidden overflow-hidden p-14 lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center lg:gap-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-primary-500/5 to-transparent dark:from-primary-500/10 dark:via-dark-300/40 dark:to-dark-200" />

        <div className="relative z-10 max-w-md text-center">
          <h2 className="h1-bold text-dark100_light900 font-spaceGrotesk">
            Ask. Answer. <span className="primary-text-gradient">Level up.</span>
          </h2>
          <p className="body-regular text-dark400_light700 mt-4">
            Join a community of developers trading hard-won answers on web dev,
            algorithms, data structures and everything in between.
          </p>
        </div>

        {/* Decorative only: the copy above already carries the meaning. Sized
            intrinsically rather than `fill`, so it stacks under the copy
            instead of sitting behind it. */}
        <Image
          src="/assets/images/auth-light.png"
          alt=""
          aria-hidden
          width={720}
          height={512}
          priority
          className="relative z-10 h-auto w-full max-w-lg dark:hidden"
        />
        <Image
          src="/assets/images/auth-dark.png"
          alt=""
          aria-hidden
          width={720}
          height={512}
          priority
          className="relative z-10 hidden h-auto w-full max-w-lg dark:block"
        />
      </aside>
    </main>
  );
};

export default Layout;
