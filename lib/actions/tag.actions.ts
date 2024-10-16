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
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    const tags = await Tag.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);
    const totalTags = await Tag.countDocuments(query);

    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    ConnectToDataBase();
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;
    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        limit: pageSize + 1,
        skip: skipAmount,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    const isNext = tag.questions.length > pageSize;

    if (!tag) {
      throw new Error("tag not found");
    }

    const questions = tag.questions;

    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopPopularTags() {
  try {
    ConnectToDataBase();

    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);
    return popularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
