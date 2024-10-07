import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProfileLinkProps {
  imgUrl: string;
  href?: string;
  title: string;
}

const ProfileLink = ({ imgUrl, href, title }: ProfileLinkProps) => {
  return (
    <div className="flex-center cursor-pointer gap-1">
      <Image src={imgUrl} alt="icon" height={20} width={20} />

      {href ? (
        <Link
          href={href}
          target="_blank"
          className="paragraph-medium text-orange-500"
        >
          Portfolio
        </Link>
      ) : (
        <p className=" paragraph-medium text-dark400_light700">{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
