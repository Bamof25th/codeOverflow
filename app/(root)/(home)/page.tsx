import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";

const questions = [
  {
    _id: "1",
    title: "How to implement authentication in a MERN stack app?",
    tags: [
      { _id: "101", name: "JavaScript" },
      { _id: "102", name: "MERN" },
      { _id: "103", name: "Authentication" },
    ],
    author: {
      _id: "a123",
      name: "John Doe",
      picture: "https://example.com/john_doe.jpg",
    },
    upvotes: 42,
    views: 256,
    answers: [
      {
        _id: "201",
        content:
          "You can use JWT for authentication and store it in the local storage.",
        author: {
          _id: "b456",
          name: "Jane Smith",
          picture: "https://example.com/jane_smith.jpg",
        },
        upvotes: 15,
        createdAt: new Date("2024-09-01T12:34:56Z"),
      },
    ],
    createdAt: new Date("2023-08-31T10:00:00Z"),
  },
  {
    _id: "2",
    title: "What are the best practices for using React Hooks?",
    tags: [
      { _id: "104", name: "React" },
      { _id: "105", name: "JavaScript" },
      { _id: "106", name: "Hooks" },
    ],
    author: {
      _id: "b234",
      name: "Alice Johnson",
      picture: "https://example.com/alice_johnson.jpg",
    },
    upvotes: 6400,
    views: 3120000,
    answers: [
      {
        _id: "202",
        content: "Always use hooks at the top level of your component.",
        author: {
          _id: "c567",
          name: "Bob Lee",
          picture: "https://example.com/bob_lee.jpg",
        },
        upvotes: 2200000,
        createdAt: new Date("2024-09-02T09:00:00Z"),
      },
    ],
    createdAt: new Date("2024-09-01T11:00:00Z"),
  },
  {
    _id: "3",
    title: "How do I manage state in a large-scale Next.js app?",
    tags: [
      { _id: "107", name: "Next.js" },
      { _id: "108", name: "State Management" },
      { _id: "109", name: "Redux" },
    ],
    author: {
      _id: "c345",
      name: "Michael Green",
      picture: "https://example.com/michael_green.jpg",
    },
    upvotes: 27,
    views: 145,
    answers: [
      {
        _id: "203",
        content:
          "You can combine Redux Toolkit with React Context for efficient state management.",
        author: {
          _id: "d678",
          name: "Sarah Brown",
          picture: "https://example.com/sarah_brown.jpg",
        },
        upvotes: 12,
        createdAt: new Date("2024-09-03T15:20:30Z"),
      },
    ],
    createdAt: new Date("2024-09-01T14:45:00Z"),
  },
];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href={"/ask-question"} className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center ">
        <LocalSearchbar
          placeholder={"Search questions"}
          iconPosition={"left"}
          imgSrc="/assets/icons/search.svg"
          route="/"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
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
            title="There's no questions to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved!"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
