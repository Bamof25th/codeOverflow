"use server";

import Interaction from "../database/interaction.model";
import Question from "../database/question.model";
import { ConnectToDataBase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    ConnectToDataBase();
    const { questionId, userId } = params;

    // update view count for the question

    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (existingInteraction)
        return console.log("user has already seen this question");
    }

    await Interaction.create({
      user: userId,
      action: "view",
      question: questionId,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
