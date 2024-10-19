import JobCard from "@/components/cards/JobCard";
import Filter from "@/components/shared/Filter";

import LocalSearchbar from "@/components/shared/search/LocalSearchbar";

import { JobPageFilters } from "@/constants/filters";

import React from "react";

// Mock data for job listings
const jobListings = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: "$120k - $160k",
    type: "Full-time",
    tags: ["React", "TypeScript", "Node.js"],
    posted: "2 days ago",
  },
  {
    id: "2",
    title: "Python Backend Engineer",
    company: "DataSystems",
    location: "New York, NY",
    salary: "$100k - $140k",
    type: "Full-time",
    tags: ["Python", "Django", "PostgreSQL"],
    posted: "1 week ago",
  },
  {
    id: "3",
    title: "DevOps Specialist",
    company: "CloudNine",
    location: "Remote",
    salary: "$110k - $150k",
    type: "Contract",
    tags: ["AWS", "Docker", "Kubernetes"],
    posted: "3 days ago",
  },
];

const page = () => {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Jobs</h1>
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
          filters={JobPageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {jobListings.map((job) => (
          <JobCard
            key={job.id}
            _id={job.id}
            title={job.title}
            company={job.company}
            location={job.location}
            salary={job.salary}
            type={job.type}
            tags={job.tags}
            posted={job.posted}
          />
        ))}
      </div>
      <div className="mt-10">{/* Pagination */}</div>
    </>
  );
};

export default page;
