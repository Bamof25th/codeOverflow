import AuthForm from "@/components/Forms/AuthForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SearchParamsProps } from "@/types";
import React from "react";

const Page = async ({ searchParams }: SearchParamsProps) => {
  const session = await auth();
  if (session) redirect("/");

  return <AuthForm mode="sign-in" callbackUrl={searchParams.callbackUrl} />;
};

export default Page;
