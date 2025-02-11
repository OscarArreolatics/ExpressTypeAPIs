import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";

export const TagSchemaVali = Joi.object({
  title: Joi.string().required(),
  color: Joi.string().required(),
});


interface ITag extends Document {
  title: string;
  color: string;
}

const TagSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    color: { type: String, required: true },
  }
);

export default mongoose.model<ITag>("Tag", TagSchema);