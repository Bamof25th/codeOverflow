import React from "react";
import { getQuestionsByTagId } from "@/lib/actions/tag.actions";
import QuestionCard from "@/components/cards/QuestionCard";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import NoResult from "@/components/shared/NoResult";
import { IQuestion } from "@/lib/database/question.model";
import { URLProps } from "@/types";
import Pagination from "@/components/shared/Pagination";

const Page = async ({ params, searchParams }: URLProps) => {
  const result = await getQuestionsByTagId({
    tagId: params.id,
    searchQuery: searchParams.q,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <div>
      <>
        <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>
        </div>
        <div className="mt-11 w-full ">
          <LocalSearchbar
            placeholder={"Search tag questions"}
            iconPosition={"left"}
            imgSrc="/assets/icons/search.svg"
            route={`/tags/${params.id}`}
            otherClasses="flex-1"
          />
        </div>

        <div className="mt-10 flex w-full flex-col gap-6">
          {result.questions.length > 0 ? (
            result.questions.map((question: IQuestion) => (
              <QuestionCard
                key={question._id}
                _id={question._id}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvotes={question.upvotes}
                views={question.views}
                answers={question.answers}
                createdAt={question.createdAt}
              />
            ))
          ) : (
            <NoResult
              title="There's no saved questions to show"
              description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved!"
              link="/"
              linkTitle="Ask a Question"
            />
          )}
        </div>
      </>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </div>
  );
};

export default Page;
