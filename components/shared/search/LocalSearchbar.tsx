import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

interface CustomInputProps {
  route: string;
  placeholder: string;
  iconPosition: string;
  imgSrc: string;
  otherClasses: string;
}

const LocalSearchbar = ({
  placeholder,
  iconPosition,
  imgSrc,
  otherClasses,
}: CustomInputProps) => {
  return (
    <div className="background-light800_darkgradient relative flex min-h-[56px] items-center gap-1  rounded-xl px-4">
      <Image
        src="/assets/icons/search.svg"
        alt="Search"
        width={24}
        height={24}
        className="cursor-pointer"
      />
      <Input
        type="text"
        value=""
        placeholder={placeholder}
        className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
      />
    </div>
  );
};

export default LocalSearchbar;
