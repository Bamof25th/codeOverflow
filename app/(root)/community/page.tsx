import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";

const Page = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllUsers({
    searchQuery: searchParams.q,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center ">
        <LocalSearchbar
          placeholder={"Search for Amazing Minds"}
          iconPosition={"left"}
          imgSrc="/assets/icons/search.svg"
          route="/community"
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-16">
        {result.users.length > 0 ? (
          result.users.map((user) => <UserCard user={user} key={user._id} />)
        ) : (
          <>
            <div className="paragraph-regular text-dark200_light800  mx-auto max-w-4xl text-center">
              <p>No users Yet</p>
              <Link
                href={"/sign-up"}
                className="mt-2 font-bold text-accent-blue"
              ></Link>
            </div>
          </>
        )}
      </section>
    </>
  );
};
export default Page;
