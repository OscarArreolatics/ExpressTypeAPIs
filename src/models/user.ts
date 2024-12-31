import mongoose, { Schema, Document } from "mongoose";
import Joi, { string } from "joi";

export const UserSchemaVali = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const LoginSchemaVali = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true, // Agrega automáticamente createdAt y updatedAt
  }
);

export default mongoose.model<IUser>("User", UserSchema);