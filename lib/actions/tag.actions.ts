"use server";

import Tag from "../database/tag.model";
import User from "../database/user.model";
import { ConnectToDataBase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";

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

export async function getAllTags(props: GetAllTagsParams) {
  try {
    ConnectToDataBase();
    const tags = await Tag.find();
    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
