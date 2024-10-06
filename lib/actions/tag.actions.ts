"use server";

import { FilterQuery } from "mongoose";
import Tag, { ITag } from "../database/tag.model";
import User from "../database/user.model";
import { ConnectToDataBase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Question from "../database/question.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    ConnectToDataBase();
    const { userId } = params;
    const user = await User.findById({
      _id: userId,
    });
    if (!user) {
      throw new Error("User not Found");
    }

    // Find interactions fpr the user and groups by tags...

    return [
      { _id: "1", name: "Tag1" },
      { _id: "2", name: "Tag2" },
      { _id: "3", name: "Tag3" },
    ];
  } catch (error) {
    console.log(error);

    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    ConnectToDataBase();
    const tags = await Tag.find();
    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    ConnectToDataBase();
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) {
      throw new Error("tag not found");
    }

    const questions = tag.questions;

    return { tagTitle: tag.name, questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
