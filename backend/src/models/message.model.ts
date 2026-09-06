import mongoose, { type Document } from "mongoose";
import type { Role } from "../types/message.types";

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  role: Role;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "model"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Indexes
messageSchema.index({ conversation: 1 });

export const Message = mongoose.model<IMessage>("Message", messageSchema);
