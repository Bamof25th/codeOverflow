import { getTopInteractedTags } from "@/lib/actions/tag.actions";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import RenderTags from "../shared/RenderTags";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({ user }: Props) => {
  const interactedTags = await getTopInteractedTags({ userId: user._id });
  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className=" shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <div className="background-light900_dark200 group relative flex size-72 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl from-sky-200 via-orange-200 to-blue-400 text-center before:absolute before:top-0 before:h-24 before:w-72 before:rounded-t-2xl before:bg-gradient-to-bl before:transition-all before:duration-500 before:content-[''] before:hover:h-72 before:hover:w-80 before:hover:scale-95 before:hover:rounded-b-2xl">
        <div className="z-10 mt-8 size-24 rounded-full border-4 border-slate-50  transition-all duration-500 group-hover:-translate-x-24  group-hover:-translate-y-20 group-hover:scale-150">
          <Image
            src={user.picture}
            alt="user DP"
            width={100}
            height={100}
            className=" flex items-center justify-center rounded-full"
          />
        </div>
        <div className="z-10  transition-all duration-500 group-hover:-translate-y-10">
          <span className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </span>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>
        <div className="z-10 transition-all duration-500 hover:scale-105">
          {interactedTags.length > 0 ? (
            <div className=" flex items-center gap-2 ">
              {interactedTags.map((tag) => (
                <RenderTags key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge className="small-medium text-dark200_light900">
              No Tags
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
};
export default UserCard;
