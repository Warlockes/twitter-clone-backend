import { Document, model, Schema } from "mongoose";

export interface IUserModel {
  _id?: string;
  email: string;
  fullname: string;
  username: string;
  password: string;
  confirmHash: string;
  confirmed?: boolean;
  location?: string;
  about?: string;
  website?: string;
}

export type IUserModelDocument = IUserModel & Document;

const UserSchema = new Schema<IUserModel>({
  email: {
    unique: true,
    required: true,
    type: String,
  },
  fullname: {
    required: true,
    type: String,
  },
  username: {
    unique: true,
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  confirmHash: {
    required: true,
    type: String,
  },
  location: String,
  about: String,
  website: String,
});

UserSchema.set("toJSON", {
  transform: (_, obj) => {
    delete obj.password;
    delete obj.confirmHash;
    return obj;
  },
});

export const UserModel = model<IUserModelDocument>("User", UserSchema);
