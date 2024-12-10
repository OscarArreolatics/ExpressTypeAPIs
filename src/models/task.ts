import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";

export const TaskSchemaVali = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  completed: Joi.boolean().required(),
});

interface ITask extends Document {
  title: string;
  description: string;
  completed: boolean;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, required: true },
  },
  {
    timestamps: true, // Agrega automáticamente createdAt y updatedAt
  }
);

export default mongoose.model<ITask>("Task", TaskSchema);
