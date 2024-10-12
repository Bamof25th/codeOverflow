"use server";

import Answer from "../database/answer.model";
import Question from "../database/question.model";
import Tag from "../database/tag.model";
import User from "../database/user.model";
import { ConnectToDataBase } from "../mongoose";
import { SearchParams } from "./shared.types";

const SearchableTypes = [ "question", "answer", "user" , 'tag'];

export async function globalSearch(params: SearchParams) {
  try {
    ConnectToDataBase();

    const { query, type } = params;
    const regexQuery = { $regex: query, $options: "i" };

    let results = [];
    
    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    const typeLower = type?.toLowerCase();

    if(!typeLower || !SearchableTypes.includes(typeLower)){
    //    search everywhere
    }else{
        // search in the specified modal type
        const modelInfo  = modelsAndTypes.find((item) => item.type === '')
    }

  } catch (error) {
    console.log(" error in fetching global result : ", error);
    throw error;
  }
}
