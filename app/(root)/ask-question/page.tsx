import Question from "@/components/Forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await auth();
  if (!session?.user?.authId) redirect("/sign-in");

  const mongoUser = await getUserById({ userId: session.user.authId });
  // console.log(mongoUser);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(mongoUser?._id)} />
      </div>
    </div>
  );
};

export default Page;
