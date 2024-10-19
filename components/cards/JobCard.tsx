import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { MapPin, Briefcase, DollarSign } from "lucide-react";
import { Badge } from "../ui/badge";

export type JobType = "Full-time" | "Part-time" | "Contract" | "Remote";

export interface JobParams {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: JobType | string;
  tags: string[];
  posted: string;
}

const JobCard = ({
  _id,
  title,
  company,
  location,
  salary,
  type,
  tags,
  posted,
}: JobParams) => {
  return (
    <div>
      <Card key={_id}>
        <CardHeader>
          <CardTitle className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {title}
          </CardTitle>
          <p className="text-sm text-gray-500">{company}</p>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="mr-1 size-4" />
              {location}
            </div>
            <div className="flex items-center">
              <Briefcase className="mr-1 size-4" />
              {type}
            </div>
            <div className="flex items-center">
              <DollarSign className="mr-1 size-4" />
              {salary}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="small-medium text-dark400_light800 border dark:border-white"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Posted {posted}</span>
          <Button className="small-medium text-dark400_light800 border dark:border-white">
            Apply Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default JobCard;
