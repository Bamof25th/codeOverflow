"use server";

import { revalidatePath } from "next/cache";
import Question from "../database/question.model";
import Tag from "../database/tag.model";
import User from "../database/user.model";
import Answer from "../database/answer.model";
import { ConnectToDataBase } from "../mongoose";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import Interaction from "../database/interaction.model";
import { FilterQuery } from "mongoose";

//  get questions

export async function getQuestions(params: GetQuestionsParams) {
  try {
    ConnectToDataBase();

    const { searchQuery } = params;
    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });
    // console.log(questions);

    return { questions };
  } catch (error) {
    console.log("error in getting questions :", error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
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
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    ConnectToDataBase();

    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });
    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upVoteQuestion(params: QuestionVoteParams) {
  try {
    ConnectToDataBase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;
    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("question not found");
    }

    // Increment authors Reputation by 10+ for up-voting a question

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downVoteQuestion(params: QuestionVoteParams) {
  try {
    ConnectToDataBase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;
    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("question not found");
    }

    // Increment authors Reputation by 10+ for up-voting a question

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    ConnectToDataBase();

    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });

    await Tag.updateMany(
      { questions: questionId },
      { $pull: { question: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function editQuestion(params: EditQuestionParams) {
  try {
    ConnectToDataBase();

    const { questionId, title, content, path } = params;

    const question = await Question.findById({ _id: questionId }).populate(
      "tags"
    );
    if (!question) {
      throw new Error("Question not Found");
    }

    question.title = title;
    question.content = content;

    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotQuestions() {
  try {
    ConnectToDataBase();

    const hotQuestions = await Question.find({}).sort({
      views: -1,
      upvotes: -1,
    });

    return hotQuestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
