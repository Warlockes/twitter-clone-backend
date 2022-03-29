import { model, Schema, Document } from "mongoose";
import { IUserModel } from "./UserModel";

export interface ITweetModel {
  _id?: string;
  text: string;
  images?: string[];
  user: IUserModel;
}

export type ITweetModelDocument = ITweetModel & Document;

const TweetSchema = new Schema<ITweetModel>(
  {
    text: {
      reuqired: true,
      type: String,
      maxlength: 280,
    },
    user: {
      reuqired: true,
      ref: "User",
      type: Schema.Types.ObjectId,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const TweetModel = model<ITweetModelDocument>("Tweet", TweetSchema);
