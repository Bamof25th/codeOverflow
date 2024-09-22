"use server";
import { ConnectToDataBase } from "../mongoose";
import User from "../database/user.model";

export async function getUserById(params: any) {
  try {
    ConnectToDataBase();
    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
