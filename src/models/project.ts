import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";

export const ProjectSchemaVali = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(null, ""),
  collaborators: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid("activo", "pausado", "completado").default("activo"),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).allow(null),
  priority: Joi.string().valid("alta", "media", "baja").default("media"),
  tags: Joi.array().items(Joi.string()).default([]),
  color: Joi.string().allow(null, ""),
});

interface IProject extends Document {
  name: string;
  description?: string;
  createdBy:  mongoose.Types.ObjectId; // ID del usuario propietario del proyecto
  collaborators: {
    _id: mongoose.Types.ObjectId,
    name: string;
  }[]; // Lista de IDs de usuarios que colaboran en el proyecto
  status: "activo" | "pausado" | "completado";
  startDate: Date;
  endDate?: Date;
  priority: "alta" | "media" | "baja";
  tags: {
    _id: mongoose.Types.ObjectId,
    name: string;
    color: string;
  }[];
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
    startDate: { type: Date },
    endDate: { type: Date },
    priority: {
      type: String,
      enum: ["alta", "media", "baja"],
      default: "media",
    },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    color: { type: String, default: "" },
  },
  { timestamps: true } // Esto incluye createdAt y updatedAt automáticamente
);

export default mongoose.model<IProject>("Project", ProjectSchema);
