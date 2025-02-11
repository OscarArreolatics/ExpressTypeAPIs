import mongoose, { Schema, Document } from "mongoose";
import Joi, { string } from "joi";

export const UserSchemaVali = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("admin", "user", "editor").default("user"),
});

export const LoginSchemaVali = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user" | "editor";
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user", "editor"], default: "user" },
  },
  {
    timestamps: true, // Agrega automáticamente createdAt y updatedAt
  }
);

export default mongoose.model<IUser>("User", UserSchema);
