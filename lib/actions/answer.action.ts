"use server";

import { revalidatePath } from "next/cache";
import Answer from "../database/answer.model";
import Question from "../database/question.model";
import { ConnectToDataBase } from "../mongoose";
import { CreateAnswerParams } from "./shared.types";

export const createAnswer = async (params: CreateAnswerParams) => {
  ConnectToDataBase();
  try {
    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({ content, author, question });

    // Add the answer to the question's answers Array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO : Add interactions
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
