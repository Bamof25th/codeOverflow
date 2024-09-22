"use server";

import Question from "../database/question.model";
import Tag from "../database/tag.model";
import { ConnectToDataBase } from "../mongoose";

export async function createQuestion(params: any) {
  // eslint-disable-next-line
  try {
    // connect to DB
    ConnectToDataBase();

    const { title, content, tags, author, path } = params;

    // Create the question

    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];
    // create  the tags or get if they already exists
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, "i") },
        },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // create an interaction record for the  users ask_question action

    // Increment authors reputation
  } catch (error) {
    console.log(error);
    throw error;
  }
}
