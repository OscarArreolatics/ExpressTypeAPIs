import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";

export const TaskSchemaVali = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  projectId: Joi.string().required(),
  assignedTo: Joi.string().allow(null, ""),
  stage: Joi.string()
    .valid("planeacion", "programacion", "validacion", "finalizada")
    .default("planeacion"),
  status: Joi.string()
    .valid("pendiente", "en progreso", "completada", "cancelada")
    .default("pendiente"),
  priority: Joi.string().valid("alta", "media", "baja").default("media"),
  dueDate: Joi.date().allow(null),
  completedAt: Joi.date().allow(null),
  attachments: Joi.array().items(Joi.string()).default([]),
  comments: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string().required(),
        comment: Joi.string().required(),
        createdAt: Joi.date().default(() => new Date()),
      })
    )
    .default([]),
  activityLog: Joi.array()
    .items(
      Joi.object({
        action: Joi.string().required(),
        userId: Joi.string().required(),
        timestamp: Joi.date().default(() => new Date()),
      })
    )
    .default([]),
});

export interface ITask extends Document {
  title: string;
  description: string;
  projectId: mongoose.Types.ObjectId; // ID del proyecto al que pertenece
  assignedTo?: mongoose.Types.ObjectId; // ID del usuario asignado a la tarea (opcional)
  stage: "planeacion" | "programacion" | "validacion" | "finalizada";
  status: "pendiente" | "en progreso" | "completada" | "cancelada";
  priority: "alta" | "media" | "baja";
  dueDate?: Date; // Fecha límite de la tarea (opcional)
  completedAt: Date;
  attachments: string[];
  comments: {
    userId: string; // ID del usuario que hizo el comentario
    comment: string; // Contenido del comentario
    createdAt: Date; // Fecha del comentario
  }[]; // Lista de comentarios asociados
  activityLog: {
    action: string; // Acción realizada (ejemplo: "actualización de estado", "asignación de usuario")
    userId: string; // ID del usuario que realizó la acción
    timestamp: Date; // Fecha de la acción
  }[]; // Registro de actividad
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    stage: {
      type: String,
      enum: ["planeacion", "programacion", "validacion", "finalizada"],
      default: "planeacion",
    },
    status: {
      type: String,
      enum: ["pendiente", "en progreso", "completada", "cancelada"],
      default: "pendiente",
    },
    priority: {
      type: String,
      enum: ["alta", "media", "baja"],
      default: "media",
    },
    dueDate: { type: Date },
    completedAt: { type: Date },
    attachments: [{ type: String }],
    comments: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        comment: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    activityLog: [
      {
        action: { type: String },
        from: { type: String },
        to: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // Agrega automáticamente createdAt y updatedAt
  }
);

export default mongoose.model<ITask>("Task", TaskSchema);
