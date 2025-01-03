import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";

export const ProjectSchemaVali = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(null, ""),
  collaborators: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid("activo", "pausado", "completado").default("activo"),
  tasks: Joi.array().items(Joi.string()).default([]),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).allow(null),
  priority: Joi.string().valid("alta", "media", "baja").default("media"),
  tags: Joi.array().items(Joi.string()).default([]),
  color: Joi.string().allow(null, ""),
});

interface IProject extends Document {
  name: string;
  description?: string;
  createdBy: string; // ID del usuario propietario del proyecto
  collaborators: string[]; // Lista de IDs de usuarios que colaboran en el proyecto
  status: "activo" | "pausado" | "completado";
  tasks: string[]; // Lista de IDs de tareas asociadas al proyecto
  startDate: Date;
  endDate?: Date;
  priority: "alta" | "media" | "baja";
  tags: string[];
  color: string;
}

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["activo", "en pausa", "completado"],
      default: "activo",
    },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    startDate: { type: Date },
    endDate: { type: Date },
    priority: {
      type: String,
      enum: ["alta", "media", "baja"],
      default: "media",
    },
    tags: [{ type: String }],
    color: { type: String, default: "" },
  },
  { timestamps: true } // Esto incluye createdAt y updatedAt automáticamente
);

export default mongoose.model<IProject>("Project", ProjectSchema);
