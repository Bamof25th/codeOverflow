import Profile from "@/components/Forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@/auth";
import React from "react";

const Page = async ({ params }: ParamsProps) => {
  const session = await auth();

  if (!session?.user?.authId) return null;

  const authId = session.user.authId;
  const mongoUser = await getUserById({ userId: authId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-9">
        <Profile authId={authId} user={JSON.stringify(mongoUser)} />
      </div>
    </>
  );
};

export default Page;
