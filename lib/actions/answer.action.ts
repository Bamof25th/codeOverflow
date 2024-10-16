"use server";
import { revalidatePath } from "next/cache";
import Answer from "../database/answer.model";
import Question from "../database/question.model";
import { ConnectToDataBase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Interaction from "../database/interaction.model";
import User from "../database/user.model";

export const createAnswer = async (params: CreateAnswerParams) => {
  ConnectToDataBase();
  try {
    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({ content, author, question });

    // Add the answer to the question's answers Array
    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO : Add interactions
    await Interaction.create({
      user: author,
      action: "answer",
      answer: newAnswer._id,
      tag: questionObject.tags,
    });
    // Increment authors reputation +5
    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAnswers = async (params: GetAnswersParams) => {
  try {
    ConnectToDataBase();

    const { questionId, sortBy, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    let sortOptions = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sortOptions = { upvotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("author", "_id clerkId name picture")
      .sort(sortOptions);

    const totalAnswers = await Answer.countDocuments({ question: questionId });
    const isNextAnswers = totalAnswers > skipAmount + answers.length;
    return { answers, isNextAnswers };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function upVoteAnswer(params: AnswerVoteParams) {
  try {
    ConnectToDataBase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
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

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("answer not found");
    }

    // Increment authors Reputation by +1/-1  for up-voting/revoking an up-vote a answer
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -2 : 2 },
    });

    // Increment authors Reputation by 10+ for up-voting a answer
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downVoteAnswer(params: AnswerVoteParams) {
  try {
    ConnectToDataBase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
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

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("answer not found");
    }

    // Increment authors Reputation by 10+ for up-voting a question
    // Increment authors Reputation by +1/-1  for up-voting/revoking an up-vote a answer
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -2 : 2 },
    });

    // Increment authors Reputation by 10+ for up-voting a answer
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasdownVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    ConnectToDataBase();

    const { answerId, path } = params;

    const answer = await Answer.findById({ _id: answerId });

    if (!answer) {
      throw new Error("Answer Not Found");
    }

    await answer.deleteOne({ _id: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answer: answerId } }
    );
    await Interaction.deleteMany({ answers: answerId });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
