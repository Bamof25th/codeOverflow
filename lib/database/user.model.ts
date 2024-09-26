import { Schema, model, Document, models } from "mongoose";

// Interface to define the shape of the user document
interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  picture: string;
  location?: string;
  portfolioWebsite?: string;
  reputation?: number;
  saved: Schema.Types.ObjectId[];
  joinDate: Date;
}

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  bio: { type: String },
  picture: { type: String, required: true },
  location: { type: String },
  portfolioWebsite: { type: String },
  reputation: { type: Number, default: 0 }, // Optional with default 0
  saved: [{ type: Schema.Types.ObjectId, ref: "Question" }], // Array of ObjectIds referencing saved items
  joinDate: { type: Date, default: Date.now }, // Automatically set join date
});

const User = models.User || model("User", UserSchema);

export default User;
